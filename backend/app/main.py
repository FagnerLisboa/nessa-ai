"""
NESSA AI — Aplicação FastAPI (fundação)

Estrutura:
  GET /health        → verificação de vida do serviço
  /api/v1/*          → rotas versionadas (app/api/v1/router.py)
  /docs              → documentação interativa (Swagger UI)

Arquitetura futura:
  Angular → FastAPI → AI Gateway → Providers
  (OpenAI, Google Gemini, Anthropic Claude, Qwen, Kimi, Grok, DeepSeek)
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exception_handlers import (
    http_exception_handler as fastapi_http_exception_handler,
)
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.v1.router import api_router
from app.core.config import get_settings
from app.core.middleware import JsonBodyGuardMiddleware

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Ciclo de vida da aplicação (recursos globais das próximas etapas)."""
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend da plataforma NESSA AI — FastAPI + PostgreSQL.",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Guarda do body JSON — deve ser registrado ANTES do CORS para que o CORS
# fique externo e os erros 400 de body também recebam cabeçalhos CORS.
# Valida UTF-8/JSON ANTES do FastAPI/Pydantic (ver core/middleware.py).
app.add_middleware(JsonBodyGuardMiddleware)

# CORS — origens explícitas vindas de CORS_ORIGINS (sem '*' como padrão).
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas versionadas
app.include_router(api_router, prefix="/api/v1")


# ------------------------------------------------------------
# Tratamento básico de erros — formato estável consumido pelo
# frontend Angular (code · message · status · details).
# ------------------------------------------------------------
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Normaliza erros de validação de entrada (422)."""
    details = [
        {
            "loc": [str(part) for part in error.get("loc", [])],
            "msg": str(error.get("msg", "")),
            "type": str(error.get("type", "")),
        }
        for error in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={
            "code": "VALIDATION_ERROR",
            "message": "Dados inválidos na requisição.",
            "status": 422,
            "details": details,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> Response:
    """Normaliza exceções HTTP para o envelope da NESSA.

    Registrado na classe BASE do Starlette (e não em fastapi.HTTPException)
    porque o erro de parse do body é levantado como
    starlette.exceptions.HTTPException — a classe base. O lookup de handlers
    do Starlette percorre o __mro__ da exceção levantada, que NÃO inclui a
    subclasse fastapi.HTTPException; registrar na base casa ambos os casos.

    (A correção principal dos erros de body está no middleware
    JsonBodyGuardMiddleware; este handler é defesa em profundidade.)
    """
    detail = exc.detail if isinstance(exc.detail, str) else ""

    if exc.status_code == 400 and "parsing the body" in detail:
        return JSONResponse(
            status_code=400,
            content={
                "code": "INVALID_JSON_BODY",
                "message": (
                    "O corpo da requisição não é um JSON válido. "
                    "Envie com Content-Type: application/json e codificação UTF-8."
                ),
                "status": 400,
                "details": {
                    "exemplo": (
                        'curl -X POST http://127.0.0.1:8000/api/v1/chat '
                        '-H "Content-Type: application/json; charset=utf-8" '
                        "--data-binary '{\"message\": \"Olá, NESSA!\"}'"
                    )
                },
            },
        )

    return await fastapi_http_exception_handler(request, exc)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Verificação de vida do serviço."""
    return {"status": "ok", "service": "nessa-api"}

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
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1.router import api_router
from app.core.config import get_settings

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


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Verificação de vida do serviço."""
    return {"status": "ok", "service": "nessa-api"}

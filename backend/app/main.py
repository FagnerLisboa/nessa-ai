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

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    """Verificação de vida do serviço."""
    return {"status": "ok", "service": "nessa-api"}

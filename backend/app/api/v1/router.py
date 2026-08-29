"""
NESSA AI — Router da API v1

Ponto único de montagem das rotas versionadas.
Novos domínios entram aqui via `include_router`.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import chat

api_router = APIRouter(tags=["v1"])

# ---- Domínios ----
api_router.include_router(chat.router)


@api_router.get("/health")
def health_v1() -> dict[str, str]:
    """Health check versionado, espelhando GET /health."""
    return {"status": "ok", "service": "nessa-api", "version": "v1"}

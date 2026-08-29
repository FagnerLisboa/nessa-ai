"""
NESSA AI — Router da API v1

Ponto único de montagem das rotas versionadas.
Os routers de domínio das próximas etapas (conversas, agentes,
projetos, arquivos, mídia, pesquisa) serão incluídos aqui.
"""

from fastapi import APIRouter

api_router = APIRouter(tags=["v1"])


@api_router.get("/health")
def health_v1() -> dict[str, str]:
    """Health check versionado, espelhando GET /health."""
    return {"status": "ok", "service": "nessa-api", "version": "v1"}

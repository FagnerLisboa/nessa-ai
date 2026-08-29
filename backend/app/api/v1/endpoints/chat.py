"""
NESSA AI — Endpoint de Chat

POST /api/v1/chat

O endpoint é fino por design: validação de entrada via schema
Pydantic, lógica no ChatService e IA atrás da interface
AIProvider (mock nesta etapa).
"""

from functools import lru_cache

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService, ChatServiceError

router = APIRouter(prefix="/chat", tags=["chat"])


@lru_cache
def get_chat_service() -> ChatService:
    """Instância única do serviço (injetável nos testes)."""
    return ChatService()


@router.post(
    "",
    response_model=ChatResponse,
    status_code=200,
    summary="Conversar com a NESSA",
    responses={
        422: {"description": "Mensagem inválida ou vazia"},
        502: {"description": "Falha no provedor de IA"},
    },
)
async def chat(
    payload: ChatRequest,
    service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    """Recebe a mensagem do usuário e retorna a resposta da NESSA."""
    try:
        return await service.reply(payload.message)
    except ChatServiceError as exc:
        return JSONResponse(
            status_code=502,
            content={"code": "CHAT_PROVIDER_ERROR", "message": str(exc), "status": 502},
        )

"""
NESSA AI — Endpoint de Chat

POST /api/v1/chat

O endpoint permanece fino por design:
- validação de entrada via Pydantic;
- sessão do banco via dependência;
- lógica de negócio no ChatService;
- seleção do provedor feita pela camada de serviços.
"""

from functools import lru_cache

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService, ChatServiceError
from app.services.conversation_service import ConversationNotFoundError


router = APIRouter(
    prefix="/chat",
    tags=["chat"],
)


@lru_cache
def get_chat_service() -> ChatService:
    """Instância única do serviço, injetável nos testes."""

    return ChatService()


@router.post(
    "",
    response_model=ChatResponse,
    status_code=200,
    summary="Conversar com a NESSA",
    responses={
        404: {
            "description": "Conversa informada não encontrada",
        },
        422: {
            "description": "Mensagem ou modelo inválido",
        },
        502: {
            "description": "Falha no provedor de IA",
        },
    },
)
async def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db),
    service: ChatService = Depends(get_chat_service),
) -> ChatResponse:
    """Recebe a mensagem e encaminha para o modelo selecionado."""

    try:
        return await service.reply(
            payload.message,
            db=db,
            conversation_id=payload.conversation_id,
            model=payload.model,
        )

    except ConversationNotFoundError as exc:
        return JSONResponse(
            status_code=404,
            content={
                "code": "CONVERSATION_NOT_FOUND",
                "message": str(exc),
                "status": 404,
            },
        )

    except ChatServiceError as exc:
        return JSONResponse(
            status_code=502,
            content={
                "code": "CHAT_PROVIDER_ERROR",
                "message": str(exc),
                "status": 502,
            },
        )
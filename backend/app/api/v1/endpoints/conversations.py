"""
NESSA AI — Endpoints de Conversas

GET    /api/v1/conversations              → lista conversas
GET    /api/v1/conversations/{id}         → conversa com mensagens
DELETE /api/v1/conversations/{id}         → exclui conversa (e mensagens)
"""

from uuid import UUID

from fastapi import APIRouter, Depends, Response
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.conversation import (
    ConversationDetail,
    ConversationRead,
    MessageRead,
)
from app.services.conversation_service import ConversationService

router = APIRouter(prefix="/conversations", tags=["conversations"])


def _not_found(conversation_id: UUID) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={
            "code": "CONVERSATION_NOT_FOUND",
            "message": f"Conversa {conversation_id} não encontrada.",
            "status": 404,
        },
    )


@router.get(
    "",
    response_model=list[ConversationRead],
    summary="Listar conversas",
)
def list_conversations(db: Session = Depends(get_db)) -> list[ConversationRead]:
    """Retorna as conversas mais recentes primeiro, com contagem de mensagens."""
    service = ConversationService(db)
    result: list[ConversationRead] = []
    for conversation in service.list_all():
        result.append(
            ConversationRead(
                id=conversation.id,
                title=conversation.title,
                created_at=conversation.created_at,
                updated_at=conversation.updated_at,
                message_count=len(conversation.messages),
            )
        )
    return result


@router.get(
    "/{conversation_id}",
    response_model=ConversationDetail,
    summary="Obter conversa com mensagens",
    responses={404: {"description": "Conversa não encontrada"}},
)
def get_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
) -> ConversationDetail | JSONResponse:
    """Retorna uma conversa com todas as mensagens ordenadas por criação."""
    service = ConversationService(db)
    conversation = service.get(conversation_id)
    if conversation is None:
        return _not_found(conversation_id)

    messages = sorted(conversation.messages, key=lambda m: m.created_at)
    return ConversationDetail(
        id=conversation.id,
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        message_count=len(messages),
        messages=[MessageRead.model_validate(m) for m in messages],
    )


@router.delete(
    "/{conversation_id}",
    status_code=204,
    summary="Excluir conversa",
    responses={404: {"description": "Conversa não encontrada"}},
)
def delete_conversation(
    conversation_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    """Exclui a conversa e todas as suas mensagens.

    NOTA: a anotação de retorno deve ser a classe `Response` (e não uma
    união como `Response | JSONResponse`). Em uma união o FastAPI deriva
    um response model e, com status_code=204, lança:
        AssertionError: Status code 204 must not have a response body
    Instâncias de JSONResponse (o 404) continuam sendo repassadas
    intactas em runtime, pois todo JSONResponse é um Response.
    """
    service = ConversationService(db)
    deleted = service.delete(conversation_id)
    if not deleted:
        return _not_found(conversation_id)
    db.commit()
    return Response(status_code=204)

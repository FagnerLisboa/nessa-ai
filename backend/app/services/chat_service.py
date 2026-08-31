"""
NESSA AI — ChatService

Regras de negócio do chat: validação de domínio, persistência da
troca (conversa + mensagens) e consulta ao provedor de IA.

Fluxo:
  1. valida a mensagem;
  2. resolve a conversa (cria uma nova se não houver id);
  3. salva a mensagem do usuário;
  4. gera a resposta via AIProvider;
  5. salva a resposta da NESSA;
  6. confirma a transação e devolve os dados ao frontend.
"""

from uuid import UUID

from sqlalchemy.orm import Session

from app.schemas.chat import ChatResponse
from app.services.ai import AIProvider, get_ai_provider
from app.services.conversation_service import (
    ConversationNotFoundError,
    ConversationService,
)


class ChatServiceError(RuntimeError):
    """Falha de domínio durante o processamento do chat."""


class ChatService:
    """Orquestra a conversa entre o usuário e o provedor de IA."""

    def __init__(self, provider: AIProvider | None = None) -> None:
        self._provider = provider or get_ai_provider()

    async def reply(
        self,
        message: str,
        db: Session,
        conversation_id: UUID | None = None,
    ) -> ChatResponse:
        """Gera a resposta da NESSA persistindo a troca completa."""
        text = message.strip()
        if not text:
            raise ChatServiceError("A mensagem não pode ser vazia.")

        conversations = ConversationService(db)

        # 2. Resolve a conversa: cria uma nova quando não há id.
        if conversation_id is None:
            conversation = conversations.create(title=text)
        else:
            conversation = conversations.get(conversation_id)
            if conversation is None:
                raise ConversationNotFoundError(conversation_id)

        try:
            # 3. Salva a mensagem do usuário.
            conversations.add_message(conversation.id, role="user", content=text)

            # 4. Gera a resposta através do AIProvider.
            result = await self._provider.complete(text)
            if not result.text.strip():
                raise ChatServiceError("O provedor de IA retornou uma resposta vazia.")

            # 5. Salva a resposta da NESSA.
            conversations.add_message(conversation.id, role="assistant", content=result.text)

            # 6. Confirma a transação (conversa + 2 mensagens).
            db.commit()
        except ChatServiceError:
            db.rollback()
            raise
        except Exception as exc:  # falha do provedor/banco → erro de domínio explícito
            db.rollback()
            raise ChatServiceError("Falha ao processar a conversa.") from exc

        return ChatResponse(response=result.text, conversation_id=conversation.id)

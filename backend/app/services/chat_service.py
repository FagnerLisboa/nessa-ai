"""
NESSA AI — ChatService

Regras de negócio do chat:
- validação da mensagem;
- persistência da conversa;
- seleção do provedor de IA;
- geração da resposta;
- persistência da resposta.

O frontend pode selecionar:
    - nessa
    - qwen
    - gemini
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
        self._provider = provider

    async def reply(
        self,
        message: str,
        db: Session,
        conversation_id: UUID | None = None,
        model: str = "nessa",
    ) -> ChatResponse:
        """Gera a resposta persistindo a troca completa."""

        text = message.strip()

        if not text:
            raise ChatServiceError("A mensagem não pode ser vazia.")

        conversations = ConversationService(db)

        # Resolve a conversa.
        if conversation_id is None:
            conversation = conversations.create(title=text)
        else:
            conversation = conversations.get(conversation_id)

            if conversation is None:
                raise ConversationNotFoundError(conversation_id)

        try:
            # Salva a mensagem do usuário.
            conversations.add_message(
                conversation.id,
                role="user",
                content=text,
            )

            # Seleciona o provider.
            provider = self._provider or get_ai_provider(model)

            # Gera a resposta.
            result = await provider.complete(text)

            if not result.text.strip():
                raise ChatServiceError(
                    "O provedor de IA retornou uma resposta vazia."
                )

            # Salva a resposta da IA.
            conversations.add_message(
                conversation.id,
                role="assistant",
                content=result.text,
            )

            # Confirma a transação.
            db.commit()

        except ChatServiceError:
            db.rollback()
            raise

        except Exception as exc:
            db.rollback()
            raise ChatServiceError(
                "Falha ao processar a conversa."
            ) from exc

        return ChatResponse(
            response=result.text,
            conversation_id=conversation.id,
        )
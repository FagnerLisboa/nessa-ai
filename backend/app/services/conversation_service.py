"""
NESSA AI — ConversationService

Camada de dados das conversas: criação, listagem, leitura com
mensagens e exclusão. Recebe a `Session` por chamada — o ciclo
de vida da transação pertence a quem orquestra (ChatService ou
endpoints de CRUD).
"""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.conversation import Conversation
from app.models.message import Message

MAX_TITLE_LENGTH = 60


class ConversationNotFoundError(RuntimeError):
    """Conversa inexistente para o id informado."""

    def __init__(self, conversation_id: UUID):
        super().__init__(f"Conversa {conversation_id} não encontrada.")
        self.conversation_id = conversation_id


class ConversationService:
    """Acesso a dados de Conversation e Message."""

    def __init__(self, db: Session) -> None:
        self._db = db

    # -------------------------------------------------- escrita
    def create(self, title: str) -> Conversation:
        conversation = Conversation(title=title[:MAX_TITLE_LENGTH])
        self._db.add(conversation)
        self._db.flush()  # gera o id sem encerrar a transação
        return conversation

    def add_message(self, conversation_id: UUID, role: str, content: str) -> Message:
        message = Message(conversation_id=conversation_id, role=role, content=content)
        self._db.add(message)
        self._db.flush()
        return message

    # -------------------------------------------------- leitura
    def get(self, conversation_id: UUID) -> Conversation | None:
        return self._db.get(Conversation, conversation_id)

    def list_all(self) -> list[Conversation]:
        """Conversas mais recentes primeiro, com mensagens carregadas."""
        statement = (
            select(Conversation)
            .options(selectinload(Conversation.messages))
            .order_by(Conversation.created_at.desc(), Conversation.id)
        )
        return list(self._db.scalars(statement))

    # -------------------------------------------------- remoção
    def delete(self, conversation_id: UUID) -> bool:
        conversation = self.get(conversation_id)
        if conversation is None:
            return False
        self._db.delete(conversation)  # cascade remove as mensagens
        self._db.flush()
        return True

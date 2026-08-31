"""
NESSA AI — Schemas de Conversas e Mensagens (contratos de leitura)
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

MessageRole = Literal["user", "assistant"]


class MessageRead(BaseModel):
    """Mensagem individual dentro de uma conversa."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    role: MessageRole
    content: str
    created_at: datetime


class ConversationRead(BaseModel):
    """Resumo de uma conversa (item de listagem)."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int


class ConversationDetail(ConversationRead):
    """Conversa completa, com as mensagens ordenadas por criação."""

    messages: list[MessageRead] = []

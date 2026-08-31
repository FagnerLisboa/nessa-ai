"""
NESSA AI — Schemas do Chat (contratos de request/response)

Espelham o contrato consumido pelo frontend Angular:
  request : { "message": "Olá NESSA", "conversation_id": "<uuid?>" }
  response: { "response": "...", "conversation_id": "<uuid>" }
"""

from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class ChatRequest(BaseModel):
    """Mensagem enviada pelo usuário."""

    message: str = Field(
        ...,
        min_length=1,
        max_length=4000,
        description="Mensagem do usuário para a NESSA",
        examples=["Olá NESSA"],
    )
    conversation_id: UUID | None = Field(
        default=None,
        description=(
            "Id de uma conversa existente. Se omitido, uma nova conversa é criada."
        ),
    )

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()
        if not stripped:
            raise ValueError("A mensagem não pode ser vazia.")
        return stripped


class ChatResponse(BaseModel):
    """Resposta gerada pela NESSA."""

    response: str = Field(
        ...,
        description="Resposta da NESSA para a mensagem enviada",
        examples=["Olá! Como posso ajudar você hoje?"],
    )
    conversation_id: UUID = Field(
        ...,
        description="Conversa onde a troca foi persistida (nova ou existente)",
    )

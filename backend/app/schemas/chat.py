"""
NESSA AI — Schemas do Chat

Contratos de request/response do chat.

Request:
{
    "message": "Olá NESSA",
    "conversation_id": "<uuid?>",
    "model": "nessa"
}

Response:
{
    "response": "...",
    "conversation_id": "<uuid>"
}
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
            "Id de uma conversa existente. "
            "Se omitido, uma nova conversa é criada."
        ),
    )

    model: str = Field(
        default="nessa",
        description="Modelo de IA selecionado pelo usuário.",
        examples=["nessa", "qwen", "gemini"],
    )

    @field_validator("message")
    @classmethod
    def message_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()

        if not stripped:
            raise ValueError("A mensagem não pode ser vazia.")

        return stripped

    @field_validator("model")
    @classmethod
    def model_must_be_supported(cls, value: str) -> str:
        normalized = value.strip().lower()

        allowed_models = {"nessa", "qwen", "gemini"}

        if normalized not in allowed_models:
            raise ValueError(
                "Modelo inválido. Use: nessa, qwen ou gemini."
            )

        return normalized


class ChatResponse(BaseModel):
    """Resposta gerada pelo provedor de IA."""

    response: str = Field(
        ...,
        description="Resposta da IA para a mensagem enviada",
    )

    conversation_id: UUID = Field(
        ...,
        description="Conversa onde a troca foi persistida.",
    )
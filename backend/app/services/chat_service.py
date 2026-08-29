"""
NESSA AI — ChatService

Regras de negócio do chat: validação de domínio, consulta ao
provedor de IA e montagem da resposta. O endpoint é apenas uma
ponte HTTP até este serviço.
"""

from app.schemas.chat import ChatResponse
from app.services.ai import AIProvider, get_ai_provider


class ChatServiceError(RuntimeError):
    """Falha de domínio durante o processamento do chat."""


class ChatService:
    """Orquestra a conversa entre o usuário e o provedor de IA."""

    def __init__(self, provider: AIProvider | None = None) -> None:
        self._provider = provider or get_ai_provider()

    async def reply(self, message: str) -> ChatResponse:
        """Gera a resposta da NESSA para a mensagem recebida."""
        text = message.strip()
        if not text:
            raise ChatServiceError("A mensagem não pode ser vazia.")

        try:
            result = await self._provider.complete(text)
        except ChatServiceError:
            raise
        except Exception as exc:  # falha do provedor → erro de domínio explícito
            raise ChatServiceError("Falha ao consultar o provedor de IA.") from exc

        if not result.text.strip():
            raise ChatServiceError("O provedor de IA retornou uma resposta vazia.")

        return ChatResponse(response=result.text)

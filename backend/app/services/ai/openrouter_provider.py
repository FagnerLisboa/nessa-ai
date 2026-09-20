from typing import Any

from openai import AsyncOpenAI

from app.core.config import get_settings
from app.services.ai.provider import AIProvider, ProviderResult


class OpenRouterProvider(AIProvider):
    """Provider de IA usando a API do OpenRouter."""

    name = "openrouter"

    def __init__(self) -> None:
        settings = get_settings()

        if not settings.OPENROUTER_API_KEY:
            raise RuntimeError(
                "OPENROUTER_API_KEY não configurada."
            )

        self._model = settings.OPENROUTER_MODEL

        self._client = AsyncOpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
        )

    async def complete(self, prompt: str) -> ProviderResult:
        """Envia uma mensagem para o modelo configurado no OpenRouter."""

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        text = self._extract_response_text(response)

        if not text:
            raise RuntimeError(
                "O OpenRouter retornou uma resposta vazia."
            )

        return ProviderResult(
            text=text,
            provider=self.name,
            model=self._model,
        )

    @staticmethod
    def _extract_response_text(response: Any) -> str:
        """Extrai o texto da resposta da API."""

        choices = getattr(response, "choices", None)

        if not choices:
            return ""

        message = getattr(choices[0], "message", None)

        if message is None:
            return ""

        content = getattr(message, "content", None)

        if isinstance(content, str):
            return content.strip()

        return ""
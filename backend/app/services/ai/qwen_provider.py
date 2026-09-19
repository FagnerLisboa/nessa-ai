"""
NESSA AI — Provider Qwen

Integração com a API OpenAI-compatible da Alibaba Cloud Model Studio.
"""

from openai import AsyncOpenAI

from app.core.config import get_settings

from app.services.ai.provider import AIProvider, ProviderResult


class QwenProvider(AIProvider):
    """Provedor Qwen via API OpenAI-compatible."""

    name = "qwen"

    def __init__(self) -> None:
        settings = get_settings()

        if not settings.QWEN_API_KEY:
            raise RuntimeError("QWEN_API_KEY não configurada.")

        self._model = settings.QWEN_MODEL
        self._client = AsyncOpenAI(
            api_key=settings.QWEN_API_KEY,
            base_url=settings.QWEN_BASE_URL,
        )

    async def complete(self, prompt: str) -> ProviderResult:
        """Envia o prompt para o Qwen e retorna o texto gerado."""

        response = await self._client.chat.completions.create(
            model=self._model,
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
        )

        text = response.choices[0].message.content or ""

        return ProviderResult(
            text=text,
            provider=self.name,
            model=self._model,
        )
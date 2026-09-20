"""
NESSA AI — Provider Qwen

Integração com a API OpenAI-compatible da Alibaba Cloud Model Studio.
"""

from typing import Any

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
        """
        Envia o prompt para o Qwen usando a Responses API
        e retorna somente a resposta final.
        """

        response = await self._client.responses.create(
            model=self._model,
            input=prompt,
            extra_body={
                "enable_thinking": True,
            },
        )

        text = self._extract_response_text(response)

        if not text:
            raise RuntimeError("O Qwen retornou uma resposta vazia.")

        return ProviderResult(
            text=text,
            provider=self.name,
            model=self._model,
        )

    @staticmethod
    def _extract_response_text(response: Any) -> str:
        """
        Extrai o texto final dos itens de saída da Responses API.

        A API do Qwen pode retornar itens de reasoning e message.
        Para o NESSA, utilizamos somente o conteúdo final da message.
        """

        output = getattr(response, "output", None)

        if not output:
            return ""

        for item in output:
            if getattr(item, "type", None) != "message":
                continue

            content = getattr(item, "content", None)

            if not content:
                continue

            for content_item in content:
                text = getattr(content_item, "text", None)

                if isinstance(text, str) and text.strip():
                    return text.strip()

        return ""
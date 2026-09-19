"""
NESSA AI — Camada de provedores de IA

Seleção central dos providers disponíveis.

Modelos selecionáveis pelo frontend:
    - nessa
    - qwen
    - gemini
"""

from app.core.config import get_settings
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.mock_provider import MockAIProvider
from app.services.ai.provider import AIProvider, ProviderResult
from app.services.ai.qwen_provider import QwenProvider


def get_ai_provider(model: str | None = None) -> AIProvider:
    """
    Retorna o provider correspondente ao modelo solicitado.

    Quando o modelo é 'nessa', utiliza o provider definido
    em AI_PROVIDER no .env.
    """

    settings = get_settings()

    provider_id = (
        model.strip().lower()
        if model
        else settings.AI_PROVIDER.strip().lower()
    )

    # NESSA utiliza o provider padrão configurado no ambiente.
    if provider_id == "nessa":
        provider_id = settings.AI_PROVIDER.strip().lower()

    if provider_id == "gemini":
        return GeminiProvider()

    if provider_id == "qwen":
        return QwenProvider()

    return MockAIProvider()


__all__ = [
    "AIProvider",
    "GeminiProvider",
    "MockAIProvider",
    "ProviderResult",
    "QwenProvider",
    "get_ai_provider",
]
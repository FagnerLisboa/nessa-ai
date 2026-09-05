"""
NESSA AI — Camada de provedores de IA

`get_ai_provider()` é o único ponto de seleção de motor, definido
por `settings.AI_PROVIDER`:

  - "mock"   (padrão) → MockAIProvider: resposta determinística,
                         sem nenhuma chamada externa (desenvolvimento/testes).
  - "gemini"           → GeminiProvider: Google Gemini via SDK
                         oficial google-genai (chave via GEMINI_API_KEY).

O contrato `AIProvider` permanece inalterado — endpoint, ChatService
e frontend Angular não conhecem o motor ativo.
"""

from app.core.config import get_settings
from app.services.ai.gemini_provider import GeminiProvider
from app.services.ai.mock_provider import MockAIProvider
from app.services.ai.provider import AIProvider, ProviderResult


def get_ai_provider() -> AIProvider:
    """Retorna o provedor de IA ativo conforme a configuração."""
    provider_id = get_settings().AI_PROVIDER.strip().lower()
    if provider_id == "gemini":
        return GeminiProvider()
    return MockAIProvider()


__all__ = [
    "AIProvider",
    "GeminiProvider",
    "MockAIProvider",
    "ProviderResult",
    "get_ai_provider",
]

"""
NESSA AI — Camada de provedores de IA

`get_ai_provider()` é o único ponto de seleção de motor.
Futuro: ler o provedor ativo da configuração (settings) e
retornar GeminiProvider, QwenProvider, etc.
"""

from app.services.ai.mock_provider import MockAIProvider
from app.services.ai.provider import AIProvider, ProviderResult


def get_ai_provider() -> AIProvider:
    """Retorna o provedor de IA ativo (mock nesta etapa)."""
    # Futuro: selecionar via settings.AI_PROVIDER ("gemini", "qwen", ...)
    # mantendo o contrato de `AIProvider` inalterado.
    return MockAIProvider()


__all__ = ["AIProvider", "MockAIProvider", "ProviderResult", "get_ai_provider"]

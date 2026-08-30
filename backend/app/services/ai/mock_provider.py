"""
NESSA AI — Provider mock (temporário)

Existe apenas para validar a comunicação ponta a ponta:
  Angular → FastAPI → ChatService → AI Provider → FastAPI → Angular

Nenhuma API externa é chamada. Será substituído pelos provedores
reais (Gemini, Qwen, ...) nas próximas etapas.
"""

from app.services.ai.provider import AIProvider, ProviderResult

MOCK_REPLY = "Olá! Como posso ajudar você hoje?"


class MockAIProvider(AIProvider):
    """Implementação determinística para a etapa de fundação do chat."""

    name = "mock"

    async def complete(self, prompt: str) -> ProviderResult:
        return ProviderResult(text=MOCK_REPLY, provider=self.name, model="mock-v1")

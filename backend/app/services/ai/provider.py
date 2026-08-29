"""
NESSA AI — Interface do provedor de IA

Contrato único entre o ChatService e qualquer motor de IA.
Para conectar Gemini, Qwen, Claude ou outro provedor, basta
implementar esta interface — o endpoint e o frontend Angular
permanecem intocados.

Arquitetura:
  Angular → FastAPI → ChatService → AIProvider → (futuro: AI Gateway)
"""

from abc import ABC, abstractmethod

from pydantic import BaseModel, Field


class ProviderResult(BaseModel):
    """Resultado bruto retornado por um provedor de IA."""

    text: str = Field(..., description="Texto gerado pelo provedor")
    provider: str = Field(..., description="Identificador do provedor (mock, gemini, qwen...)")
    model: str = Field("", description="Modelo utilizado, quando aplicável")


class AIProvider(ABC):
    """Interface desacoplada para provedores de IA."""

    name: str = "base"

    @abstractmethod
    async def complete(self, prompt: str) -> ProviderResult:
        """Gera uma resposta para o prompt recebido."""

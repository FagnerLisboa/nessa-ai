"""
NESSA AI — Testes do GeminiProvider

Isolados da API real do Google: o provider recebe um client falso
(injeção) que imita a superfície assíncrona usada em produção
(`client.aio.models.generate_content` → objeto com `.text`).

Cobre os cenários exigidos:
  1. mensagem válida        → texto do Gemini encapsulado em ProviderResult
  2. erro do Gemini         → GeminiProviderError controlado (timeout, genérico)
  3. API Key ausente        → GeminiConfigError
  4. resposta vazia/None    → GeminiProviderError
  5. API Key nunca aparece  → nem no erro, nem no resultado
  + contrato da interface AIProvider e categorização de erros da API.

Nenhum teste dispara chamada de rede nem exige o google-genai instalado
(o import do SDK no provider é tardio; a categorização é função pura).
"""

import asyncio

from app.services.ai import get_ai_provider
from app.services.ai.gemini_provider import (
    GeminiConfigError,
    GeminiProvider,
    GeminiProviderError,
    _categorize_api_error,
)
from app.services.ai.mock_provider import MockAIProvider
from app.services.ai.provider import AIProvider, ProviderResult


# ------------------------------------------------------------
# Doubles: imitam a superfície do SDK usada pelo provider
# ------------------------------------------------------------
class _FakeResponse:
    """Resposta com a única propriedade que o provider lê."""

    def __init__(self, text):
        self.text = text


def _fake_client(result):
    """Client falso expondo `client.aio.models.generate_content`.

    `result` pode ser um _FakeResponse (sucesso) ou uma exceção
    (para simular falhas da API).
    """

    class _Models:
        async def generate_content(self, model, contents):
            if isinstance(result, BaseException):
                raise result
            return result

    class _Aio:
        def __init__(self):
            self.models = _Models()

    class _Client:
        def __init__(self):
            self.aio = _Aio()

    return _Client()


class _FakeAPIError:
    """Objeto com `.code`, como as APIError do SDK, para a função pura."""

    def __init__(self, code):
        self.code = code


# ------------------------------------------------------------
# 1. Mensagem válida → resposta do Gemini
# ------------------------------------------------------------
def test_valid_message_returns_gemini_text():
    provider = GeminiProvider(client=_fake_client(_FakeResponse("Resposta do Gemini")))

    result = asyncio.run(provider.complete("Olá, NESSA!"))

    assert isinstance(result, ProviderResult)
    assert result.text == "Resposta do Gemini"
    assert result.provider == "gemini"
    assert result.model  # modelo preenchido (default ou env)


# ------------------------------------------------------------
# 2. Erros do Gemini → exceções controladas (sem vazamento interno)
# ------------------------------------------------------------
def test_timeout_raises_controlled_error():
    provider = GeminiProvider(client=_fake_client(TimeoutError("estouro")))

    try:
        asyncio.run(provider.complete("Olá"))
    except GeminiProviderError as exc:
        assert "Tempo de resposta" in str(exc)
        return
    raise AssertionError("TimeoutError deveria virar GeminiProviderError")


def test_unexpected_error_is_controlled_and_hides_detail():
    provider = GeminiProvider(client=_fake_client(RuntimeError("detalhe-interno-secreto")))

    try:
        asyncio.run(provider.complete("Olá"))
    except GeminiProviderError as exc:
        message = str(exc)
        assert "Erro inesperado" in message
        assert "detalhe-interno-secreto" not in message  # nada interno vaza
        return
    raise AssertionError("Erro inesperado deveria virar GeminiProviderError")


# ------------------------------------------------------------
# 3. API Key ausente → erro de configuração
# ------------------------------------------------------------
def test_missing_api_key_raises_config_error():
    # Sem client injetado e com chave vazia, _get_client deve falhar
    # ANTES de qualquer chamada — erro de configuração explícito.
    provider = GeminiProvider(api_key="")

    try:
        asyncio.run(provider.complete("Olá"))
    except GeminiConfigError as exc:
        assert "GEMINI_API_KEY" in str(exc)
        return
    raise AssertionError("Chave ausente deveria virar GeminiConfigError")


# ------------------------------------------------------------
# 4. Resposta vazia ou inválida → erro controlado
# ------------------------------------------------------------
def test_empty_response_raises_error():
    provider = GeminiProvider(client=_fake_client(_FakeResponse("")))

    try:
        asyncio.run(provider.complete("Olá"))
    except GeminiProviderError as exc:
        assert "vazia" in str(exc).lower()
        return
    raise AssertionError("Resposta vazia deveria virar GeminiProviderError")


def test_none_text_response_raises_error():
    provider = GeminiProvider(client=_fake_client(_FakeResponse(None)))

    try:
        asyncio.run(provider.complete("Olá"))
    except GeminiProviderError:
        return
    raise AssertionError("Texto None deveria virar GeminiProviderError")


# ------------------------------------------------------------
# 5. A API Key NUNCA aparece (nem no erro, nem no resultado)
# ------------------------------------------------------------
def test_api_key_never_leaks():
    secret = "chave-super-secreta-9f8e7d6c"

    # No caminho de erro…
    failing = GeminiProvider(api_key=secret, client=_fake_client(RuntimeError("falha")))
    try:
        asyncio.run(failing.complete("Olá"))
    except GeminiProviderError as exc:
        assert secret not in str(exc)
    else:
        raise AssertionError("Deveria ter falhado")

    # …e no caminho de sucesso.
    ok = GeminiProvider(api_key=secret, client=_fake_client(_FakeResponse("oi")))
    result = asyncio.run(ok.complete("Olá"))
    assert secret not in result.text
    assert secret not in result.provider
    assert secret not in result.model


# ------------------------------------------------------------
# Contrato da interface + seleção de provider
# ------------------------------------------------------------
def test_gemini_provider_implements_interface():
    assert issubclass(GeminiProvider, AIProvider)
    assert GeminiProvider.name == "gemini"


def test_get_ai_provider_defaults_to_mock():
    # O conftest força AI_PROVIDER=mock; o default do config também é mock.
    provider = get_ai_provider()
    assert isinstance(provider, MockAIProvider)
    assert isinstance(provider, AIProvider)


# ------------------------------------------------------------
# Categorização de erros da API (função pura — sem SDK)
# ------------------------------------------------------------
def test_categorize_auth_error():
    assert "autenticação" in _categorize_api_error(_FakeAPIError(401)).lower()
    assert "autenticação" in _categorize_api_error(_FakeAPIError(403)).lower()


def test_categorize_quota_error():
    assert "Limite" in _categorize_api_error(_FakeAPIError(429))


def test_categorize_model_not_found():
    assert "Modelo" in _categorize_api_error(_FakeAPIError(404))


def test_categorize_generic_error():
    assert "Erro na API" in _categorize_api_error(_FakeAPIError(500))
    assert "Erro na API" in _categorize_api_error(_FakeAPIError(None))

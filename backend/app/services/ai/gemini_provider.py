"""
NESSA AI — Provider Gemini (google-genai SDK oficial)

Implementa a interface `AIProvider` — o ChatService e o endpoint
permanecem inalterados; a troca de motor é feita em
`get_ai_provider()` via settings.AI_PROVIDER.

SDK: google-genai (Google Gen AI SDK oficial, sucessor do
google-generativeai). Uso assíncrono validado na documentação:
    response = await client.aio.models.generate_content(model=..., contents=...)
    response.text

Segurança:
  - A chave vem EXCLUSIVAMENTE de variável de ambiente
    (GEMINI_API_KEY, com fallback GOOGLE_API_KEY) — nunca do código
    ou do frontend.
  - Nenhum log ou mensagem de erro contém a chave ou stack trace;
    as exceções do SDK são convertidas em mensagens controladas.
  - O import do SDK é tardio (somente quando o client real é
    construído), permitindo importar este módulo e rodar a suíte
    com um client injetado mesmo sem o google-genai instalado.
"""

from typing import Any

from app.core.config import get_settings
from app.services.ai.provider import AIProvider, ProviderResult

# Timeout das chamadas à API do Gemini, em milissegundos.
_GEMINI_TIMEOUT_MS = 30_000


class GeminiError(RuntimeError):
    """Base para erros do provider Gemini."""


class GeminiConfigError(GeminiError):
    """Configuração ausente ou inválida (ex.: GEMINI_API_KEY vazia)."""


class GeminiProviderError(GeminiError):
    """Falha controlada ao consultar a API do Gemini."""


def _timeout_classes() -> tuple[type[BaseException], ...]:
    """Classes de timeout: do SDK (httpx) + TimeoutError do Python."""
    classes: list[type[BaseException]] = [TimeoutError]
    try:
        import httpx

        classes.append(httpx.TimeoutException)
    except ImportError:  # pragma: no cover - httpx acompanha o SDK
        pass
    return tuple(classes)


def _api_error_classes() -> tuple[type[BaseException], ...]:
    """Classe de erro da API do SDK (import tolerante a ausência)."""
    try:
        from google.genai import errors as genai_errors

        return (genai_errors.APIError,)
    except ImportError:  # SDK não instalado — path genérico cobre
        return ()


def _categorize_api_error(exc: BaseException) -> str:
    """Mensagem controlada por categoria — sem detalhes internos."""
    code = getattr(exc, "code", None)
    if code in (401, 403):
        return "Falha de autenticação com o Gemini. Verifique a GEMINI_API_KEY no backend."
    if code == 429:
        return "Limite de requisições do Gemini atingido. Tente novamente em instantes."
    if code == 404:
        return "Modelo do Gemini indisponível. Verifique a variável GEMINI_MODEL."
    return "Erro na API do Gemini. Tente novamente."


class GeminiProvider(AIProvider):
    """Integração com o Google Gemini via SDK oficial google-genai."""

    name = "gemini"

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        client: Any = None,
    ) -> None:
        settings = get_settings()
        # A chave vive somente no backend (env). Fallback para
        # GOOGLE_API_KEY espelha o comportamento do próprio SDK.
        self._api_key = api_key if api_key is not None else (
            settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
        )
        self._model = model or settings.GEMINI_MODEL
        # `client` injetado (testes) ou construído sob demanda (produção).
        self._client = client

    def _get_client(self) -> Any:
        if self._client is None:
            if not self._api_key:
                raise GeminiConfigError(
                    "GEMINI_API_KEY não configurada. "
                    "Defina a variável de ambiente no backend (.env)."
                )
            # Import tardio do SDK — ver docstring do módulo.
            from google import genai
            from google.genai import types

            self._client = genai.Client(
                api_key=self._api_key,
                http_options=types.HttpOptions(timeout=_GEMINI_TIMEOUT_MS),
            )
        return self._client

    async def complete(self, prompt: str) -> ProviderResult:
        """Envia o prompt ao Gemini e devolve somente o texto gerado."""
        client = self._get_client()

        try:
            response = await client.aio.models.generate_content(
                model=self._model,
                contents=prompt,
            )
        except _timeout_classes():
            raise GeminiProviderError(
                "Tempo de resposta do Gemini excedido. Tente novamente."
            ) from None
        except _api_error_classes() as exc:
            # Auth (401/403), quota (429), modelo inválido (404), 5xx...
            raise GeminiProviderError(_categorize_api_error(exc)) from None
        except Exception:
            # Qualquer falha inesperada vira erro controlado —
            # nem stack trace nem dados internos chegam ao frontend.
            raise GeminiProviderError(
                "Erro inesperado ao consultar o Gemini."
            ) from None

        text = getattr(response, "text", None)
        text = text.strip() if isinstance(text, str) else ""
        if not text:
            raise GeminiProviderError("O Gemini retornou uma resposta vazia.")

        return ProviderResult(text=text, provider=self.name, model=self._model)

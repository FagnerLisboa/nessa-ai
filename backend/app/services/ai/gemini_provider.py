"""
NESSA AI — Provider Gemini

Integração com a API oficial do Google Gemini
usando a Interactions API.
"""

from typing import Any

from app.core.config import get_settings
from app.services.ai.provider import AIProvider, ProviderResult

_GEMINI_TIMEOUT_MS = 30_000


class GeminiError(RuntimeError):
    """Base para erros do provider Gemini."""


class GeminiConfigError(GeminiError):
    """Configuração ausente ou inválida."""


class GeminiProviderError(GeminiError):
    """Falha controlada ao consultar a API do Gemini."""


def _timeout_classes() -> tuple[type[BaseException], ...]:
    classes: list[type[BaseException]] = [TimeoutError]

    try:
        import httpx

        classes.append(httpx.TimeoutException)
    except ImportError:
        pass

    return tuple(classes)


def _api_error_classes() -> tuple[type[BaseException], ...]:
    try:
        from google.genai import errors as genai_errors

        return (
            genai_errors.APIError,
            genai_errors.ClientError,
        )
    except ImportError:
        return ()


class GeminiProvider(AIProvider):
    """
    Provider do Gemini para o NESSA AI.

    Utiliza a Interactions API do Google.
    """

    name = "gemini"

    def __init__(
        self,
        api_key: str | None = None,
        model: str | None = None,
        client: Any = None,
    ) -> None:
        settings = get_settings()

        self._api_key = (
            api_key
            if api_key is not None
            else (
                settings.GEMINI_API_KEY
                or settings.GOOGLE_API_KEY
            )
        )

        self._model = model or settings.GEMINI_MODEL
        self._client = client

    def _get_client(self) -> Any:
        if self._client is None:
            if not self._api_key:
                raise GeminiConfigError(
                    "GEMINI_API_KEY não configurada."
                )

            from google import genai
            from google.genai import types

            self._client = genai.Client(
                api_key=self._api_key,
                http_options=types.HttpOptions(
                    timeout=_GEMINI_TIMEOUT_MS,
                ),
            )

        return self._client

    async def complete(self, prompt: str) -> ProviderResult:
        """
        Envia o prompt para o Gemini e retorna somente o texto.
        """

        client = self._get_client()

        try:
            interaction = await client.aio.interactions.create(
                model=self._model,
                input=prompt,
            )

        except _timeout_classes():
            raise GeminiProviderError(
                "Tempo de resposta do Gemini excedido. "
                "Tente novamente."
            ) from None

        except _api_error_classes() as exc:
            code = getattr(exc, "code", None)
            message = getattr(
                exc,
                "message",
                str(exc),
            )

            print("\n========== GEMINI API ERROR ==========")
            print(f"Tipo: {type(exc).__name__}")
            print(f"Código: {code}")
            print(f"Mensagem: {message}")
            print("======================================\n")

            if code in (401, 403):
                raise GeminiProviderError(
                    "Falha de autenticação com o Gemini. "
                    "Verifique a GEMINI_API_KEY."
                ) from None

            if code == 404:
                raise GeminiProviderError(
                    "Modelo do Gemini indisponível. "
                    "Verifique a GEMINI_MODEL."
                ) from None

            if code == 429:
                raise GeminiProviderError(
                    "Limite de requisições do Gemini atingido. "
                    "Tente novamente em instantes."
                ) from None

            raise GeminiProviderError(
                "Erro na API do Gemini. "
                "Tente novamente."
            ) from None

        except Exception as exc:
            print("\n========== GEMINI UNEXPECTED ERROR ==========")
            print(f"Tipo: {type(exc).__name__}")
            print(f"Mensagem: {exc}")
            print("=============================================\n")

            raise GeminiProviderError(
                "Erro inesperado ao consultar o Gemini."
            ) from None

        text = getattr(
            interaction,
            "output_text",
            None,
        )

        text = (
            text.strip()
            if isinstance(text, str)
            else ""
        )

        if not text:
            raise GeminiProviderError(
                "O Gemini retornou uma resposta vazia."
            )

        return ProviderResult(
            text=text,
            provider=self.name,
            model=self._model,
        )
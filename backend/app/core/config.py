"""
NESSA AI — Configuração central (Pydantic Settings)

Toda configuração vem de variáveis de ambiente / arquivo .env.
Nenhum segredo é declarado neste arquivo — apenas contratos e
padrões de desenvolvimento.

SEGURANÇA: as chaves dos provedores de IA (OpenAI, Gemini,
Claude, Qwen, Kimi, Grok, DeepSeek) vivem exclusivamente aqui,
no backend. O frontend Angular nunca as recebe.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações mínimas da fundação."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ---- Aplicação ----
    APP_NAME: str = "NESSA API"
    APP_ENV: str = "development"

    # ---- Banco de dados (PostgreSQL via psycopg 3) ----
    DATABASE_URL: str = "postgresql+psycopg://usuario:senha@localhost:5432/nessa"

    # ---- CORS (origens separadas por vírgula) ----
    CORS_ORIGINS: str = "http://localhost:4200"

    # ---- Motor de IA do chat ----
    # "mock" (padrão — sem chamadas externas) ou "gemini".
    # A chave do provedor vive EXCLUSIVAMENTE aqui, no backend.
    AI_PROVIDER: str = "mock"

    # Chave do Google Gemini (https://aistudio.google.com/apikey).
    # Nunca preencher em arquivo versionado; somente no .env local.
    GEMINI_API_KEY: str = ""

    # Modelo Gemini utilizado no chat (estável e indicado para conversa).
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # ---- Provedores de IA (placeholders vazios nesta etapa) ----
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    QWEN_API_KEY: str = ""
    KIMI_API_KEY: str = ""
    XAI_API_KEY: str = ""
    DEEPSEEK_API_KEY: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        """Origens do CORS como lista, sem usar '*' como padrão."""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_development(self) -> bool:
        return self.APP_ENV.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    """Instância única e imutável das configurações."""
    return Settings()

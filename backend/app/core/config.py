"""
NESSA AI — Configuração central (Pydantic Settings)

Toda configuração vem de variáveis de ambiente / arquivo .env.

Nenhum segredo é declarado neste arquivo — apenas contratos e
padrões de desenvolvimento.

SEGURANÇA:
As chaves dos provedores de IA vivem exclusivamente no backend.
O frontend Angular nunca recebe essas chaves.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configurações centrais da aplicação."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # ---------------------------------------------------------
    # Aplicação
    # ---------------------------------------------------------

    APP_NAME: str = "NESSA API"
    APP_ENV: str = "development"

    # ---------------------------------------------------------
    # Banco de dados
    # PostgreSQL via psycopg 3
    # ---------------------------------------------------------

    DATABASE_URL: str = (
        "postgresql+psycopg://usuario:senha@localhost:5432/nessa"
    )

    # ---------------------------------------------------------
    # CORS
    # Origens separadas por vírgula
    # ---------------------------------------------------------

    CORS_ORIGINS: str = (
        "http://localhost:4200,http://localhost:5173"
    )

    # ---------------------------------------------------------
    # Autenticação / JWT
    # ---------------------------------------------------------

    SECRET_KEY: str = "sua-chave-secreta-muito-forte-e-segura-aqui"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # ---------------------------------------------------------
    # Motor de IA
    # ---------------------------------------------------------
    #
    # Provedores disponíveis:
    #
    # mock       → resposta fixa para desenvolvimento
    # gemini     → Google Gemini
    # openrouter → OpenRouter
    # qwen       → Alibaba Cloud Model Studio / Qwen
    #
    # O valor pode ser sobrescrito pelo arquivo .env.
    # ---------------------------------------------------------

    AI_PROVIDER: str = "mock"

    # ---------------------------------------------------------
    # Google Gemini
    # ---------------------------------------------------------

    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # ---------------------------------------------------------
    # OpenAI
    # ---------------------------------------------------------

    OPENAI_API_KEY: str = ""

    # ---------------------------------------------------------
    # OpenRouter
    # ---------------------------------------------------------
    #
    # OpenRouter utiliza uma API compatível com OpenAI.
    #
    # O modelo "openrouter/free" seleciona automaticamente
    # um modelo gratuito disponível.
    # ---------------------------------------------------------

    OPENROUTER_API_KEY: str = ""
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "openrouter/free"

    # ---------------------------------------------------------
    # Google
    # ---------------------------------------------------------

    GOOGLE_API_KEY: str = ""

    # ---------------------------------------------------------
    # Anthropic / Claude
    # ---------------------------------------------------------

    ANTHROPIC_API_KEY: str = ""

    # ---------------------------------------------------------
    # Alibaba Cloud / Qwen
    # ---------------------------------------------------------

    QWEN_API_KEY: str = ""

    QWEN_BASE_URL: str = (
        "https://ws-swtntep0cied9rdb.cn-beijing.maas.aliyuncs.com"
        "/compatible-mode/v1"
    )

    QWEN_MODEL: str = "qwen-plus"

    # ---------------------------------------------------------
    # Kimi
    # ---------------------------------------------------------

    KIMI_API_KEY: str = ""

    # ---------------------------------------------------------
    # Grok / xAI
    # ---------------------------------------------------------

    XAI_API_KEY: str = ""

    # ---------------------------------------------------------
    # DeepSeek
    # ---------------------------------------------------------

    DEEPSEEK_API_KEY: str = ""

    # ---------------------------------------------------------
    # Propriedades auxiliares
    # ---------------------------------------------------------

    @property
    def cors_origins_list(self) -> list[str]:
        """Converte as origens CORS em uma lista."""

        return [
            origin.strip()
            for origin in self.CORS_ORIGINS.split(",")
            if origin.strip()
        ]

    @property
    def is_development(self) -> bool:
        """Indica se a aplicação está em ambiente de desenvolvimento."""

        return self.APP_ENV.lower() == "development"


@lru_cache
def get_settings() -> Settings:
    """Retorna a instância única das configurações."""

    return Settings()
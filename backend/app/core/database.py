"""
NESSA AI — Conexão PostgreSQL (SQLAlchemy 2.x)

O engine é criado de forma preguiçosa: importar este módulo NÃO
abre conexão com o banco — o que permite que /health e /docs
respondam mesmo antes do PostgreSQL estar disponível.

`Base` é o ponto de registro dos modelos ORM (Conversation,
Message, ...) usados pelo Alembic e pela suíte de testes.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

settings = get_settings()


def _sqlalchemy_database_url(database_url: str) -> str:
    """Garante o uso do driver psycopg v3 em URLs da Neon/Vercel."""
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)
    if database_url.startswith("postgres://"):
        return database_url.replace("postgres://", "postgresql+psycopg://", 1)
    return database_url


engine = create_engine(
    _sqlalchemy_database_url(settings.DATABASE_URL),
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    future=True,
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base declarativa de todos os modelos ORM da NESSA."""


def get_db():
    """Dependência FastAPI: sessão com ciclo de vida gerenciado."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

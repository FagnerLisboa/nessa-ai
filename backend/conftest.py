"""
NESSA AI — Fixtures compartilhadas dos testes

Estar na raiz do backend garante que o diretório entre no
sys.path (import de `app.*`) e centraliza o cliente de testes.

O banco de teste é um SQLite em memória (isolado por teste),
sobrescrevendo a dependência `get_db` — o PostgreSQL real é
usado apenas em produção/development via DATABASE_URL.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base, get_db
from app.main import app

# Importa os modelos para registrar as tabelas no metadata.
import app.models  # noqa: F401


@pytest.fixture()
def client():
    """Cliente HTTP de testes com banco SQLite isolado em memória."""
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    TestingSessionLocal = sessionmaker(
        bind=engine, autocommit=False, autoflush=False, expire_on_commit=False
    )

    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()

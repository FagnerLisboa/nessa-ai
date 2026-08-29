"""
NESSA AI — Fixtures compartilhadas dos testes

Estar na raiz do backend garante que o diretório entre no
sys.path (import de `app.*`) e centraliza o cliente de testes.
"""

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture()
def client() -> TestClient:
    """Cliente HTTP de testes contra a aplicação FastAPI."""
    return TestClient(app)

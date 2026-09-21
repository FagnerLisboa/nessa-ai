"""
NESSA AI — Dependências compartilhadas da API.

Fornece dependências reutilizáveis para os endpoints:
- get_db: sessão do banco de dados por requisição
"""

from typing import Generator

from sqlalchemy.orm import Session

from app.core.database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    Fornece uma sessão do banco de dados por requisição.

    Uso típico nos endpoints:
        @router.get("/...")
        def my_endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

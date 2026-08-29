"""
NESSA AI — Modelos ORM (SQLAlchemy)

Nesta etapa ainda não existem tabelas. Os modelos das próximas
etapas serão declarados aqui, herdados de
`app.core.database.Base`, para que o Alembic os descubra
automaticamente via `Base.metadata`.
"""

from app.core.database import Base

__all__ = ["Base"]

"""
NESSA AI — Modelos ORM (SQLAlchemy 2.x)

Importar este pacote registra todos os modelos no metadata de
`Base` — essencial para o Alembic (autogenerate) e para a suíte
de testes (create_all).
"""

from app.core.database import Base
from app.models.conversation import Conversation
from app.models.message import Message

__all__ = ["Base", "Conversation", "Message"]

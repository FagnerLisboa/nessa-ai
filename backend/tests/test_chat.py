"""
NESSA AI — Testes da API de Chat (com persistência)

Cobre:
  - mensagem válida (ponta a ponta via HTTP, persistindo conversa);
  - mensagem vazia / em branco / ausente (422);
  - formato da resposta da API (response + conversation_id);
  - endpoint POST /api/v1/chat;
  - conversa inexistente informada no request (404);
  - contrato da interface AIProvider;
  - ChatService em unidade.
"""

import asyncio
import uuid

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.database import Base
from app.services.ai import AIProvider, MockAIProvider
from app.services.chat_service import ChatService, ChatServiceError

import app.models  # noqa: F401  (registra tabelas no metadata)

CHAT_URL = "/api/v1/chat"
EXPECTED_REPLY = "Olá! Como posso ajudar você hoje?"


def _make_session():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine, autocommit=False, autoflush=False)
    return Session()


# ------------------------------------------------------------
# Endpoint /api/v1/chat
# ------------------------------------------------------------
def test_chat_with_valid_message(client):
    response = client.post(CHAT_URL, json={"message": "Olá NESSA"})

    assert response.status_code == 200
    body = response.json()
    assert body["response"] == EXPECTED_REPLY
    assert "conversation_id" in body
    # O conversation_id deve ser um UUID válido.
    uuid.UUID(body["conversation_id"])


def test_chat_response_shape(client):
    response = client.post(CHAT_URL, json={"message": "teste de formato"})
    body = response.json()

    assert set(body.keys()) == {"response", "conversation_id"}
    assert isinstance(body["response"], str)
    assert body["response"].strip() != ""


def test_chat_endpoint_exists(client):
    response = client.post(CHAT_URL, json={"message": "ping"})

    assert response.status_code == 200
    assert "response" in response.json()


def test_chat_with_unknown_conversation_returns_404(client):
    unknown_id = str(uuid.uuid4())
    response = client.post(
        CHAT_URL,
        json={"message": "Olá", "conversation_id": unknown_id},
    )

    assert response.status_code == 404
    assert response.json()["code"] == "CONVERSATION_NOT_FOUND"


def test_chat_with_existing_conversation_keeps_id(client):
    first = client.post(CHAT_URL, json={"message": "primeira"})
    conversation_id = first.json()["conversation_id"]

    second = client.post(
        CHAT_URL,
        json={"message": "segunda", "conversation_id": conversation_id},
    )

    assert second.status_code == 200
    assert second.json()["conversation_id"] == conversation_id


# ------------------------------------------------------------
# Validação da mensagem
# ------------------------------------------------------------
def test_chat_rejects_empty_message(client):
    response = client.post(CHAT_URL, json={"message": ""})

    assert response.status_code == 422
    body = response.json()
    assert body["code"] == "VALIDATION_ERROR"
    assert body["status"] == 422


def test_chat_rejects_whitespace_only_message(client):
    response = client.post(CHAT_URL, json={"message": "   \n\t  "})

    assert response.status_code == 422
    assert response.json()["code"] == "VALIDATION_ERROR"


def test_chat_rejects_missing_message(client):
    response = client.post(CHAT_URL, json={})

    assert response.status_code == 422
    assert response.json()["code"] == "VALIDATION_ERROR"


# ------------------------------------------------------------
# Parsing do body (regressão — normalizado pelo middleware
# JsonBodyGuardMiddleware para HTTP 400 + INVALID_JSON_BODY)
# ------------------------------------------------------------
def test_chat_rejects_invalid_utf8_body(client):
    # \xe1 é "á" em latin-1 — sequência inválida em UTF-8.
    response = client.post(
        CHAT_URL,
        content=b'{"message": "Ol\xe1, NESSA!"}',
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 400
    body = response.json()
    assert body["code"] == "INVALID_JSON_BODY"
    assert body["status"] == 400


def test_chat_rejects_malformed_json_body(client):
    # UTF-8 válido, mas JSON malformado (sem aspas nas chaves).
    response = client.post(
        CHAT_URL,
        content="{message: Olá, NESSA!}".encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 400
    assert response.json()["code"] == "INVALID_JSON_BODY"


def test_chat_accepts_accented_utf8_message(client):
    # UTF-8 válido + JSON válido deve passar pelo middleware e responder 200.
    response = client.post(
        CHAT_URL,
        content='{"message": "Olá, NESSA!"}'.encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
    )

    assert response.status_code == 200
    assert response.json()["response"] == EXPECTED_REPLY


# ------------------------------------------------------------
# Health (regressão)
# ------------------------------------------------------------
def test_health_keeps_working(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "nessa-api"}


# ------------------------------------------------------------
# Unidade: interface do provider + ChatService
# ------------------------------------------------------------
def test_mock_provider_implements_interface():
    assert isinstance(MockAIProvider(), AIProvider)


def test_chat_service_returns_provider_text():
    service = ChatService(MockAIProvider())
    db = _make_session()

    result = asyncio.run(service.reply("Olá", db=db))

    assert result.response == EXPECTED_REPLY
    assert result.conversation_id is not None


def test_chat_service_rejects_blank_message():
    service = ChatService(MockAIProvider())
    db = _make_session()

    try:
        asyncio.run(service.reply("    ", db=db))
    except ChatServiceError:
        return
    raise AssertionError("ChatService deveria rejeitar mensagem em branco")


def test_chat_service_raises_for_unknown_conversation():
    service = ChatService(MockAIProvider())
    db = _make_session()

    from app.services.conversation_service import ConversationNotFoundError

    try:
        asyncio.run(service.reply("Olá", db=db, conversation_id=uuid.uuid4()))
    except ConversationNotFoundError:
        return
    raise AssertionError("ChatService deveria lançar ConversationNotFoundError")

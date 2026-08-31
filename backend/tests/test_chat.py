"""
NESSA AI — Testes da API de Chat

Cobre:
  - mensagem válida (ponta a ponta via HTTP);
  - mensagem vazia / em branco / ausente (422);
  - formato da resposta da API;
  - endpoint POST /api/v1/chat;
  - contrato da interface AIProvider;
  - ChatService em unidade.
"""

import asyncio

from app.services.ai import AIProvider, MockAIProvider
from app.services.chat_service import ChatService, ChatServiceError

CHAT_URL = "/api/v1/chat"
EXPECTED_REPLY = "Olá! Como posso ajudar você hoje?"


# ------------------------------------------------------------
# Endpoint /api/v1/chat
# ------------------------------------------------------------
def test_chat_with_valid_message(client):
    response = client.post(CHAT_URL, json={"message": "Olá NESSA"})

    assert response.status_code == 200
    assert response.json() == {"response": EXPECTED_REPLY}


def test_chat_response_shape(client):
    response = client.post(CHAT_URL, json={"message": "teste de formato"})
    body = response.json()

    assert set(body.keys()) == {"response"}
    assert isinstance(body["response"], str)
    assert body["response"].strip() != ""


def test_chat_endpoint_exists(client):
    response = client.post(CHAT_URL, json={"message": "ping"})

    assert response.status_code == 200
    assert "response" in response.json()


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

    result = asyncio.run(service.reply("Olá"))

    assert result.response == EXPECTED_REPLY


def test_chat_service_rejects_blank_message():
    service = ChatService(MockAIProvider())

    try:
        asyncio.run(service.reply("    "))
    except ChatServiceError:
        return
    raise AssertionError("ChatService deveria rejeitar mensagem em branco")


# ------------------------------------------------------------
# Robustez do body JSON (codificação / aspas no terminal)
# ------------------------------------------------------------
def test_chat_rejects_invalid_utf8_body(client):
    # \xe1 é "á" em latin-1 — inválido em UTF-8. Reproduz o
    # cenário de terminais com codepage fora de UTF-8.
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
    # Aspas quebradas pelo terminal chegam assim: JSON inválido.
    response = client.post(
        CHAT_URL,
        content="{message: Olá, NESSA!}".encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )

    assert response.status_code == 400
    assert response.json()["code"] == "INVALID_JSON_BODY"


def test_chat_accepts_accented_utf8_message(client):
    response = client.post(
        CHAT_URL,
        content='{"message": "Olá, NESSA!"}'.encode("utf-8"),
        headers={"Content-Type": "application/json; charset=utf-8"},
    )

    assert response.status_code == 200
    assert response.json() == {"response": EXPECTED_REPLY}

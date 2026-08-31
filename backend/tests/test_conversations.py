"""
NESSA AI — Testes da API de Conversas

Cobre:
  - listar conversas (vazio e populado via chat);
  - obter conversa com mensagens ordenadas;
  - obter conversa inexistente (404);
  - excluir conversa (e mensagens em cascata);
  - excluir conversa inexistente (404);
  - título derivado da primeira mensagem (truncado em 60).
"""

import uuid

CHAT_URL = "/api/v1/chat"
CONVERSATIONS_URL = "/api/v1/conversations"


def _create_conversation(client, message="Olá NESSA") -> str:
    response = client.post(CHAT_URL, json={"message": message})
    assert response.status_code == 200
    return response.json()["conversation_id"]


# ------------------------------------------------------------
# Listagem
# ------------------------------------------------------------
def test_list_conversations_empty(client):
    response = client.get(CONVERSATIONS_URL)

    assert response.status_code == 200
    assert response.json() == []


def test_list_conversations_after_chat(client):
    conversation_id = _create_conversation(client, "Primeira conversa")
    _create_conversation(client, "Segunda conversa")

    response = client.get(CONVERSATIONS_URL)

    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2

    item = next(i for i in items if i["id"] == conversation_id)
    assert item["title"] == "Primeira conversa"
    # Uma troca completa = 1 mensagem do usuário + 1 da NESSA.
    assert item["message_count"] == 2
    assert "created_at" in item
    assert "updated_at" in item


def test_list_conversations_order_newest_first(client):
    _create_conversation(client, "antiga")
    _create_conversation(client, "recente")

    items = client.get(CONVERSATIONS_URL).json()
    assert len(items) == 2

    # Garantia real do endpoint: created_at em ordem não-crescente.
    # (O SQLite tem resolução de segundo, então empates são possíveis
    # e a ordem entre itens empatados não é afirmada.)
    timestamps = [i["created_at"] for i in items]
    assert timestamps == sorted(timestamps, reverse=True)
    assert {i["title"] for i in items} == {"antiga", "recente"}


# ------------------------------------------------------------
# Leitura com mensagens
# ------------------------------------------------------------
def test_get_conversation_with_messages(client):
    conversation_id = _create_conversation(client, "Olá NESSA")

    response = client.get(f"{CONVERSATIONS_URL}/{conversation_id}")

    assert response.status_code == 200
    body = response.json()
    assert body["id"] == conversation_id
    assert body["title"] == "Olá NESSA"
    assert body["message_count"] == 2
    assert len(body["messages"]) == 2

    first, second = body["messages"]
    assert first["role"] == "user"
    assert first["content"] == "Olá NESSA"
    assert second["role"] == "assistant"
    assert second["content"] == "Olá! Como posso ajudar você hoje?"


def test_get_conversation_not_found(client):
    unknown_id = str(uuid.uuid4())

    response = client.get(f"{CONVERSATIONS_URL}/{unknown_id}")

    assert response.status_code == 404
    assert response.json()["code"] == "CONVERSATION_NOT_FOUND"


def test_get_conversation_invalid_uuid_returns_422(client):
    response = client.get(f"{CONVERSATIONS_URL}/não-é-uuid")

    assert response.status_code == 422


# ------------------------------------------------------------
# Exclusão
# ------------------------------------------------------------
def test_delete_conversation(client):
    conversation_id = _create_conversation(client)

    response = client.delete(f"{CONVERSATIONS_URL}/{conversation_id}")

    assert response.status_code == 204

    # A conversa some da listagem...
    assert client.get(CONVERSATIONS_URL).json() == []
    # ...e da leitura direta.
    assert client.get(f"{CONVERSATIONS_URL}/{conversation_id}").status_code == 404


def test_delete_conversation_not_found(client):
    unknown_id = str(uuid.uuid4())

    response = client.delete(f"{CONVERSATIONS_URL}/{unknown_id}")

    assert response.status_code == 404
    assert response.json()["code"] == "CONVERSATION_NOT_FOUND"


# ------------------------------------------------------------
# Título da conversa
# ------------------------------------------------------------
def test_conversation_title_truncated_to_60_chars(client):
    long_message = "a" * 100
    conversation_id = _create_conversation(client, long_message)

    response = client.get(f"{CONVERSATIONS_URL}/{conversation_id}")

    assert response.status_code == 200
    assert len(response.json()["title"]) == 60


def test_conversation_title_uses_first_message(client):
    conversation_id = _create_conversation(client, "primeira mensagem")
    client.post(
        CHAT_URL,
        json={"message": "segunda mensagem", "conversation_id": conversation_id},
    )

    response = client.get(f"{CONVERSATIONS_URL}/{conversation_id}")

    assert response.json()["title"] == "primeira mensagem"
    assert response.json()["message_count"] == 4

"""
NESSA AI — Testes do JsonBodyGuardMiddleware

Cobre os cenários obrigatórios da especificação:

  1. JSON normal                                 → 200
  2. JSON com acentos (UTF-8)                    → 200
  3. JSON UTF-8 com BOM (EF BB BF)               → 200
  4. JSON inválido (truncado)                    → 400 INVALID_JSON_BODY
  5. Body vazio com Content-Type json            → 400 INVALID_JSON_BODY
  6. OPTIONS (preflight CORS)                    → 200 + allow-origin
  7. POST /api/v1/chat com payload válido        → 200
  8. GET /health                                 → 200 envelope exato

Mais as regressões:
  - UTF-8 inválido                               → 400 INVALID_JSON_BODY
  - BOM + JSON malformado                        → 400 INVALID_JSON_BODY
  - BOM + acentos                                → 200
"""

CHAT_URL = "/api/v1/chat"
JSON_HEADERS = {"Content-Type": "application/json"}
EXPECTED_REPLY = "Olá! Como posso ajudar você hoje?"


# ------------------------------------------------------------
# 1. JSON normal
# ------------------------------------------------------------
def test_json_normal(client):
    response = client.post(
        CHAT_URL,
        content=b'{"message":"Ola NESSA"}',
        headers=JSON_HEADERS,
    )

    assert response.status_code == 200
    assert response.json()["response"] == EXPECTED_REPLY


# ------------------------------------------------------------
# 2. JSON com acentos (UTF-8 multibyte)
# ------------------------------------------------------------
def test_json_with_accents(client):
    body = '{"message":"Olá NESSA"}'.encode("utf-8")

    response = client.post(CHAT_URL, content=body, headers=JSON_HEADERS)

    assert response.status_code == 200
    assert "conversation_id" in response.json()


# ------------------------------------------------------------
# 3. JSON UTF-8 com BOM (EF BB BF) — os bytes exatos do test.json
# ------------------------------------------------------------
def test_json_with_utf8_bom(client):
    body = b"\xef\xbb\xbf" + b'{"message":"Ola NESSA"}\r\n'

    response = client.post(CHAT_URL, content=body, headers=JSON_HEADERS)

    assert response.status_code == 200
    payload = response.json()
    assert payload["response"] == EXPECTED_REPLY
    assert "conversation_id" in payload


def test_json_with_bom_and_accents(client):
    body = b"\xef\xbb\xbf" + '{"message":"Olá NESSA"}'.encode("utf-8")

    response = client.post(CHAT_URL, content=body, headers=JSON_HEADERS)

    assert response.status_code == 200
    assert "conversation_id" in response.json()


# ------------------------------------------------------------
# 4. JSON inválido (truncado)
# ------------------------------------------------------------
def test_malformed_json_returns_400(client):
    response = client.post(
        CHAT_URL,
        content=b'{"message":"Ola NESSA"',
        headers=JSON_HEADERS,
    )

    assert response.status_code == 400
    body = response.json()
    assert body["code"] == "INVALID_JSON_BODY"
    assert body["status"] == 400
    assert body["message"]


def test_bom_with_malformed_json_still_400(client):
    # O BOM é removido, mas o JSON continua inválido → 400.
    response = client.post(
        CHAT_URL,
        content=b"\xef\xbb\xbf" + b'{"message":',
        headers=JSON_HEADERS,
    )

    assert response.status_code == 400
    assert response.json()["code"] == "INVALID_JSON_BODY"


# ------------------------------------------------------------
# 5. Body vazio com Content-Type application/json
#    (o guarda repassa; o FastAPI responde 400 via handler de main.py
#     com o mesmo envelope — comportamento esperado do endpoint)
# ------------------------------------------------------------
def test_empty_json_body_returns_400(client):
    response = client.post(CHAT_URL, content=b"", headers=JSON_HEADERS)

    assert response.status_code == 400
    assert response.json()["code"] == "INVALID_JSON_BODY"


# ------------------------------------------------------------
# 6. OPTIONS (preflight CORS) — o middleware não interfere
# ------------------------------------------------------------
def test_options_preflight_cors(client):
    response = client.options(
        CHAT_URL,
        headers={
            "Origin": "http://localhost:4200",
            "Access-Control-Request-Method": "POST",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:4200"


# ------------------------------------------------------------
# 7. POST /api/v1/chat com payload válido (fluxo completo)
# ------------------------------------------------------------
def test_chat_post_valid_payload_keeps_200(client):
    response = client.post(CHAT_URL, json={"message": "Olá, NESSA!"})

    assert response.status_code == 200
    payload = response.json()
    assert payload["response"] == EXPECTED_REPLY
    assert "conversation_id" in payload


# ------------------------------------------------------------
# 8. GET /health (regressão)
# ------------------------------------------------------------
def test_health_keeps_working(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "nessa-api"}


# ------------------------------------------------------------
# Regressão: UTF-8 inválido (byte latin-1 isolado)
# ------------------------------------------------------------
def test_invalid_utf8_returns_400(client):
    response = client.post(
        CHAT_URL,
        content=b'{"message":"Ol\xe1 NESSA"}',
        headers=JSON_HEADERS,
    )

    assert response.status_code == 400
    body = response.json()
    assert body["code"] == "INVALID_JSON_BODY"
    assert body["status"] == 400

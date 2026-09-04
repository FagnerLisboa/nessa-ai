"""
NESSA AI — Middleware de guarda do body JSON (core/middleware)

Valida o corpo bruto ANTES de o FastAPI/Pydantic processá-lo.

Por que um middleware (e não um handler de exceção)?
  Os handlers de exceção rodam depois que o FastAPI já leu e parseou
  o body — tarde demais para os dois cenários:

  - UTF-8 inválido  → o parse levanta starlette.exceptions.HTTPException(400)
                      (a classe BASE). Um handler registrado em
                      fastapi.HTTPException (a SUBCLASSE) nunca casa, pois o
                      Starlette percorre o __mro__ da exceção levantada, que
                      não inclui a subclasse. Cai no handler padrão
                      ({"detail": ...}, sem "code").

  - JSON malformado → o FastAPI converte o JSONDecodeError em
                      RequestValidationError (422) ANTES de qualquer
                      HTTPException existir. Nenhum handler de HTTPException
                      jamais veria esse erro.

  Portanto, a única camada capaz de normalizar AMBOS os casos para
  HTTP 400 + {"code": "INVALID_JSON_BODY"} é um middleware que inspeciona
  os bytes crus antes do roteamento/validação.

Comportamento:
  - Intercepta apenas requests com Content-Type application/json e método
    de escrita (POST/PUT/PATCH/DELETE). Os demais passam direto — em
    especial OPTIONS (preflight CORS), nunca tocado por este middleware.
  - Bufferiza o corpo, valida UTF-8 e, em seguida, o JSON.
  - BOM UTF-8 (EF BB BF) é suportado: detectado no início do corpo,
    removido antes da validação textual e do replay — o downstream
    recebe JSON UTF-8 limpo, conforme a RFC 8259 (§8.1: implementações
    NÃO DEVEM adicionar BOM; o conteúdo após o BOM é o JSON real).
  - Inválido → responde 400 com o envelope da NESSA.
  - Válido   → replica (replay) os bytes normalizados para a aplicação
               downstream, que os lê normalmente.
  - Body vazio em POST/PUT/PATCH → 400 INVALID_JSON_BODY (não é JSON
                 válido). DELETE é isento: chega comumente com Content-Type
                 json e sem corpo e os endpoints DELETE ignoram o payload.

É um middleware ASGI puro (não BaseHTTPMiddleware) para bufferizar e
repetir o corpo com segurança, sem consumir o stream.
"""

import json

from starlette.responses import JSONResponse
from starlette.types import ASGIApp, Message, Receive, Scope, Send

_WRITE_METHODS = {"POST", "PUT", "PATCH", "DELETE"}

# Métodos que exigem payload: body vazio com Content-Type json é rejeitado
# com 400. DELETE fica de fora — ele é comumente enviado sem corpo e os
# endpoints DELETE ignoram o payload (preserva o comportamento atual).
_BODY_REQUIRED_METHODS = {"POST", "PUT", "PATCH"}

# BOM UTF-8: EF BB BF em bytes; U+FEFF quando decodificado.
_UTF8_BOM = b"\xef\xbb\xbf"
_BOM_CHAR = "\ufeff"


class JsonBodyGuardMiddleware:
    """Normaliza erros de body JSON para HTTP 400 + envelope da NESSA."""

    def __init__(self, app: ASGIApp) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        method = scope.get("method", "").upper()
        headers = {
            key.decode("latin-1").lower(): value.decode("latin-1")
            for key, value in scope.get("headers", [])
        }
        content_type = headers.get("content-type", "")

        is_json_write = method in _WRITE_METHODS and "application/json" in content_type
        if not is_json_write:
            await self.app(scope, receive, send)
            return

        # ---- Bufferiza o corpo bruto ----
        chunks: list[bytes] = []
        while True:
            message: Message = await receive()
            if message["type"] == "http.disconnect":
                return
            chunks.append(message.get("body", b""))
            if not message.get("more_body", False):
                break
        body = b"".join(chunks)

        # ---- Valida UTF-8 ----
        problem: str | None = None
        decoded: str | None = None
        try:
            decoded = body.decode("utf-8")
        except UnicodeDecodeError:
            problem = (
                "O corpo da requisição não é um UTF-8 válido. "
                "Envie com codificação UTF-8."
            )

        # ---- Trata BOM UTF-8 (EF BB BF) ----
        # json.loads() sobre str rejeita U+FEFF inicial mesmo quando o JSON é
        # válido; já sobre bytes o Python o aceita. Para ser independente do
        # caminho, removemos o BOM aqui: a validação incide sobre o JSON real
        # e o downstream recebe bytes limpos.
        if problem is None and decoded is not None and decoded.startswith(_BOM_CHAR):
            decoded = decoded[1:]
            body = body[len(_UTF8_BOM):]

        # ---- Body vazio em métodos que exigem payload → 400 ----
        # POST/PUT/PATCH com Content-Type json e corpo vazio — ou contendo
        # apenas o BOM — não representam um JSON válido. Respondemos aqui,
        # antes do FastAPI: ele trata corpo ausente como erro de validação
        # (422), fora do envelope da NESSA. DELETE é isento (ver constante).
        if problem is None and not body and method in _BODY_REQUIRED_METHODS:
            problem = (
                "O corpo da requisição está vazio. "
                "Envie um JSON válido com Content-Type: application/json."
            )

        # ---- Valida o JSON (somente se houver conteúdo) ----
        if problem is None and decoded:
            try:
                json.loads(decoded)
            except json.JSONDecodeError:
                problem = (
                    "O corpo da requisição não é um JSON válido. "
                    "Envie com Content-Type: application/json e codificação UTF-8."
                )

        if problem is not None:
            response = JSONResponse(
                status_code=400,
                content={"code": "INVALID_JSON_BODY", "message": problem, "status": 400},
            )
            await response(scope, receive, send)
            return

        # ---- Corpo válido: replica os bytes normalizados para o downstream ----
        # Entrega one-shot: a primeira leitura recebe o corpo completo;
        # leituras subsequentes recebem vazio (more_body=False), evitando
        # re-entrega caso algo leia o stream mais de uma vez sem cache.
        state = {"sent": False}

        async def replay_receive() -> Message:
            if state["sent"]:
                return {"type": "http.request", "body": b"", "more_body": False}
            state["sent"] = True
            return {"type": "http.request", "body": body, "more_body": False}

        await self.app(scope, replay_receive, send)

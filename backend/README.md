# NESSA AI — Backend

Fundação do backend da plataforma **NESSA AI**: API **FastAPI** (Python 3.12+) sobre **PostgreSQL**, com **SQLAlchemy 2.x**, **Alembic** para migrations e **Pydantic Settings** para configuração.

> Etapa 2.1 — somente a fundação. Chat, provedores de IA, mídia, agentes e autenticação chegam nas próximas etapas.

## Arquitetura

```
Angular (frontend)  →  FastAPI (este repositório)  →  AI Gateway  →  Providers
                                                          └─ OpenAI · Gemini · Claude · Qwen · Kimi · Grok · DeepSeek
```

As chaves dos provedores vivem **exclusivamente** neste backend — o frontend nunca as recebe.

## Estrutura

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # aplicação FastAPI · /health · CORS · /api/v1
│   ├── core/
│   │   ├── config.py        # Pydantic Settings (APP_NAME, APP_ENV, DATABASE_URL, CORS_ORIGINS)
│   │   └── database.py      # engine SQLAlchemy + sessão + Base declarativa
│   ├── api/v1/router.py     # router versionado (/api/v1)
│   ├── models/              # modelos ORM (próximas etapas)
│   ├── schemas/             # schemas Pydantic (próximas etapas)
│   └── services/            # regras de negócio + AI Gateway (próximas etapas)
├── alembic/                 # migrations (configurado, sem tabelas ainda)
├── .env                     # local — NUNCA versionar com segredos
├── .env.example             # modelo versionável (placeholders)
├── alembic.ini
├── requirements.txt
└── README.md
```

## 1. Criar o ambiente virtual

Requer **Python 3.12+**.

```bash
python -m venv .venv
```

Ativar:

- **Windows**

  ```powershell
  .venv\Scripts\activate
  ```

- **macOS / Linux**

  ```bash
  source .venv/bin/activate
  ```

## 2. Instalar as dependências

```bash
pip install -r requirements.txt
```

## 3. Configurar o `.env`

```bash
# macOS / Linux
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Ajuste no mínimo:

```ini
DATABASE_URL=postgresql+psycopg://usuario:senha@localhost:5432/nessa
CORS_ORIGINS=http://localhost:4200
```

- `CORS_ORIGINS` aceita **múltiplas origens** separadas por vírgula (ex.: `http://localhost:4200,http://localhost:5173`). Não utilize `*` como solução definitiva.
- As chaves de provedores (`OPENAI_API_KEY`, `GOOGLE_API_KEY`, ...) permanecem **vazias** nesta etapa.

## 4. Executar

```bash
uvicorn app.main:app --reload
```

O servidor sobe em `http://127.0.0.1:8000`.

## 5. Endpoints de verificação

| Rota         | Resultado esperado                                                          |
| ------------ | ---------------------------------------------------------------------------- |
| `GET /health`    | `{"status": "ok", "service": "nessa-api"}`                               |
| `GET /api/v1/health` | `{"status": "ok", "service": "nessa-api", "version": "v1"}`           |
| `GET /docs`  | Swagger UI interativo                                                        |
| `GET /redoc` | ReDoc                                                                        |

Teste rápido:

```bash
curl http://127.0.0.1:8000/health
```

> `/health` e `/docs` funcionam **mesmo sem o PostgreSQL no ar** — a conexão com o banco é preguiçosa.

## 6. Alembic (migrations)

Sistema de migrations configurado, sem tabelas ainda. Comandos futuros:

```bash
# criar migration a partir dos modelos
alembic revision --autogenerate -m "descricao"

# aplicar migrations no banco
alembic upgrade head
```

## Segurança

- `.env` está no `.gitignore` — nunca commite segredos.
- Nenhuma senha, token ou API Key existe no código — apenas contratos e placeholders.
- CORS com origens explícitas via `CORS_ORIGINS`.

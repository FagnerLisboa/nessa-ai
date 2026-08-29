/* ============================================================
   NESSA AI — Modelos de API (core/models)
   Contratos da comunicação Angular ⇄ FastAPI.
   ============================================================ */

/** Envelope padrão das respostas do backend. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Erro normalizado retornado pelo backend (ou derivado de falhas HTTP). */
export interface ApiError {
  /** Código estável do erro (ex.: "CONVERSATION_NOT_FOUND"). */
  code: string;
  /** Mensagem legível para exibição. */
  message: string;
  /** Status HTTP, quando aplicável. */
  status?: number;
  /** Detalhes estruturados (validações etc.). */
  details?: unknown;
}

/** Metadados de paginação das listagens. */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

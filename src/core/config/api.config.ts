/* ============================================================
   NESSA AI — Configuração central da API (core/config)
   Fonte única para URL, versão e timeout. Nenhuma URL de API
   deve ser escrita diretamente em componentes ou serviços de
   domínio — todos passam por aqui.

   Arquitetura futura:
     Angular → FastAPI → AI Gateway → Providers
     (OpenAI, Google Gemini, Anthropic Claude, Qwen, Kimi,
      Grok, DeepSeek)

   SEGURANÇA: o Angular nunca conhece as APIs dos provedores.
   As chaves ficam exclusivamente no backend Python.
   ============================================================ */

import { environment } from "../../environments/environment";

export const API_CONFIG = {
  /** Origem do backend FastAPI (vem do environment ativo). */
  baseUrl: environment.apiUrl,

  /** Versão da API — prefixo de todas as rotas. */
  apiPrefix: "/api/v1",

  /** Timeout das requisições HTTP, em milissegundos. */
  timeoutMs: 30_000,

  /** Rota do AI Gateway no backend (roteamento de provedores). */
  gatewayPath: "/ai",
} as const;

/** Monta a URL completa de um endpoint da API versionada. */
export function apiUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${API_CONFIG.baseUrl}${API_CONFIG.apiPrefix}${clean}`;
}

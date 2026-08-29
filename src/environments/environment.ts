/* ============================================================
   NESSA AI — Environment (base)
   Substituído por arquivo específico via "fileReplacements"
   (angular.json) em cada configuração de build.

   SEGURANÇA: nenhuma API Key de provedor de IA (OpenAI, Gemini,
   Claude, Qwen, Kimi, Grok, DeepSeek) pode existir no frontend.
   As chaves vivem exclusivamente no backend Python.
   ============================================================ */

import type { Environment } from "./environment.model";

export const environment: Environment = {
  production: false,
  apiUrl: "http://localhost:8000",
};

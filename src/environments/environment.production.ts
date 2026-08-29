import type { Environment } from "./environment.model";

/*
 * Ambiente de produção.
 * A origem definitiva é definida no deploy (mesma origem ou domínio
 * do backend FastAPI). Nenhuma credencial ou API Key neste arquivo.
 */
export const environment: Environment = {
  production: true,
  apiUrl: "http://localhost:8000",
};

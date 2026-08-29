import type { Environment } from "./environment.model";

/* Ambiente de desenvolvimento — backend FastAPI local. */
export const environment: Environment = {
  production: false,
  apiUrl: "http://localhost:8000",
};

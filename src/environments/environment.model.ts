/* Contrato compartilhado dos arquivos de environment.
   Este arquivo NUNCA é substituído pelo fileReplacements. */

export interface Environment {
  production: boolean;
  /** Origem do backend FastAPI. */
  apiUrl: string;
}

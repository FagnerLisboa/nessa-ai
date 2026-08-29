/* ============================================================
   NESSA AI — ResearchService (core/services)
   Pesquisa futura na web com fontes via backend FastAPI.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { ResearchResult } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

export type ResearchFilter = "tudo" | "noticias" | "academico" | "codigo";

export interface ResearchQueryPayload {
  query: string;
  filter: ResearchFilter;
}

const ENDPOINTS = {
  queries: "/research/queries",
  one: (id: string) => `/research/queries/${id}`,
} as const;

@Injectable({ providedIn: "root" })
export class ResearchService {
  private readonly api = inject(ApiService);

  /** Inicia uma pesquisa e retorna a síntese com fontes. */
  search(payload: ResearchQueryPayload): Observable<ApiResponse<ResearchResult>> {
    // return this.api.post<ApiResponse<ResearchResult>>(ENDPOINTS.queries, payload);
    return notImplemented("ResearchService.search");
  }

  /** Obtém uma pesquisa anterior pelo id. */
  get(id: string): Observable<ApiResponse<ResearchResult>> {
    // return this.api.get<ApiResponse<ResearchResult>>(ENDPOINTS.one(id));
    return notImplemented("ResearchService.get");
  }

  /** Lista pesquisas recentes. */
  history(): Observable<ApiResponse<ResearchResult[]>> {
    // return this.api.get<ApiResponse<ResearchResult[]>>(ENDPOINTS.queries);
    return notImplemented("ResearchService.history");
  }
}

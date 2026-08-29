/* ============================================================
   NESSA AI — AgentService (core/services)
   CRUD futuro de agentes especializados no backend FastAPI.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { Agent, AgentStatus } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

export interface CreateAgentPayload {
  name: string;
  description: string;
  model: string;
}

const ENDPOINTS = {
  list: "/agents",
  one: (id: string) => `/agents/${id}`,
  status: (id: string) => `/agents/${id}/status`,
} as const;

@Injectable({ providedIn: "root" })
export class AgentService {
  private readonly api = inject(ApiService);

  /** Lista os agentes do workspace. */
  list(query?: string): Observable<ApiResponse<Agent[]>> {
    // return this.api.get<ApiResponse<Agent[]>>(ENDPOINTS.list, { query });
    return notImplemented("AgentService.list");
  }

  /** Cria um novo agente. */
  create(payload: CreateAgentPayload): Observable<ApiResponse<Agent>> {
    // return this.api.post<ApiResponse<Agent>>(ENDPOINTS.list, payload);
    return notImplemented("AgentService.create");
  }

  /** Atualiza os dados de um agente. */
  update(id: string, payload: Partial<CreateAgentPayload>): Observable<ApiResponse<Agent>> {
    // return this.api.put<ApiResponse<Agent>>(ENDPOINTS.one(id), payload);
    return notImplemented("AgentService.update");
  }

  /** Alterna o status (ativo/pausado). */
  setStatus(id: string, status: AgentStatus): Observable<ApiResponse<Agent>> {
    // return this.api.patch<ApiResponse<Agent>>(ENDPOINTS.status(id), { status });
    return notImplemented("AgentService.setStatus");
  }

  /** Exclui um agente. */
  remove(id: string): Observable<ApiResponse<null>> {
    // return this.api.delete<ApiResponse<null>>(ENDPOINTS.one(id));
    return notImplemented("AgentService.remove");
  }
}

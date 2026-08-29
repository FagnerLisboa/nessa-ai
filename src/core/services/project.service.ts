/* ============================================================
   NESSA AI — ProjectService (core/services)
   CRUD futuro de projetos no backend FastAPI.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { Project } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

export interface CreateProjectPayload {
  name: string;
  description?: string;
}

const ENDPOINTS = {
  list: "/projects",
  one: (id: string) => `/projects/${id}`,
} as const;

@Injectable({ providedIn: "root" })
export class ProjectService {
  private readonly api = inject(ApiService);

  /** Lista os projetos do workspace. */
  list(query?: string): Observable<ApiResponse<Project[]>> {
    // return this.api.get<ApiResponse<Project[]>>(ENDPOINTS.list, { query });
    return notImplemented("ProjectService.list");
  }

  /** Cria um novo projeto. */
  create(payload: CreateProjectPayload): Observable<ApiResponse<Project>> {
    // return this.api.post<ApiResponse<Project>>(ENDPOINTS.list, payload);
    return notImplemented("ProjectService.create");
  }

  /** Atualiza nome/descrição de um projeto. */
  update(id: string, payload: Partial<CreateProjectPayload>): Observable<ApiResponse<Project>> {
    // return this.api.patch<ApiResponse<Project>>(ENDPOINTS.one(id), payload);
    return notImplemented("ProjectService.update");
  }

  /** Exclui um projeto. */
  remove(id: string): Observable<ApiResponse<null>> {
    // return this.api.delete<ApiResponse<null>>(ENDPOINTS.one(id));
    return notImplemented("ProjectService.remove");
  }
}

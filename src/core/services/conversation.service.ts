/* ============================================================
   NESSA AI — ConversationService (core/services)
   CRUD futuro de conversas no backend FastAPI.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { Conversation } from "../models";
import type { ApiResponse, Pagination } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

/** Resposta paginada de listagens. */
export interface ConversationPage {
  items: Conversation[];
  pagination: Pagination;
}

export interface CreateConversationPayload {
  title?: string;
  agentId?: string;
  projectId?: string;
}

const ENDPOINTS = {
  list: "/conversations",
  one: (id: string) => `/conversations/${id}`,
} as const;

@Injectable({ providedIn: "root" })
export class ConversationService {
  private readonly api = inject(ApiService);

  /** Lista conversas com paginação. */
  list(params?: { page?: number; pageSize?: number; query?: string }): Observable<ApiResponse<ConversationPage>> {
    // return this.api.get<ApiResponse<ConversationPage>>(ENDPOINTS.list, params);
    return notImplemented("ConversationService.list");
  }

  /** Obtém uma conversa pelo id. */
  get(id: string): Observable<ApiResponse<Conversation>> {
    // return this.api.get<ApiResponse<Conversation>>(ENDPOINTS.one(id));
    return notImplemented("ConversationService.get");
  }

  /** Cria uma nova conversa. */
  create(payload: CreateConversationPayload): Observable<ApiResponse<Conversation>> {
    // return this.api.post<ApiResponse<Conversation>>(ENDPOINTS.list, payload);
    return notImplemented("ConversationService.create");
  }

  /** Renomeia uma conversa. */
  rename(id: string, title: string): Observable<ApiResponse<Conversation>> {
    // return this.api.patch<ApiResponse<Conversation>>(ENDPOINTS.one(id), { title });
    return notImplemented("ConversationService.rename");
  }

  /** Exclui uma conversa. */
  remove(id: string): Observable<ApiResponse<null>> {
    // return this.api.delete<ApiResponse<null>>(ENDPOINTS.one(id));
    return notImplemented("ConversationService.remove");
  }
}

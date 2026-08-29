/* ============================================================
   NESSA AI — ChatService (core/services)
   Comunicação futura com o motor de conversa.

   Fluxo: Angular → FastAPI → AI Gateway → Provider.
   O frontend nunca fala diretamente com provedores de IA.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

/** Payload de envio de mensagem (contrato com o backend). */
export interface ChatMessagePayload {
  content: string;
  agentId?: string;
}

/** Mensagem devolvida pelo backend. */
export interface ChatMessageDto {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

const ENDPOINTS = {
  send: (conversationId: string) => `/chat/conversations/${conversationId}/messages`,
} as const;

@Injectable({ providedIn: "root" })
export class ChatService {
  private readonly api = inject(ApiService);

  /** Envia uma mensagem do usuário para a conversa. */
  sendMessage(conversationId: string, payload: ChatMessagePayload): Observable<ApiResponse<ChatMessageDto>> {
    // return this.api.post<ApiResponse<ChatMessageDto>>(ENDPOINTS.send(conversationId), payload);
    return notImplemented("ChatService.sendMessage");
  }

  /*
   * FUTURO — streaming de respostas (SSE):
   *
   *   stream(conversationId: string): Observable<ChatStreamChunk> { ... }
   *
   * O backend exporá um endpoint de Server-Sent Events no
   * AI Gateway; este método consumirá o fluxo token a token.
   */
}

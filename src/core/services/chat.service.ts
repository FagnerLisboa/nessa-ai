/* ============================================================
   NESSA AI — ChatService (core/services)
   Comunicação com o motor de conversa via backend FastAPI.

   Fluxo: Angular → FastAPI → AI Gateway → Provider.
   O frontend nunca fala diretamente com provedores de IA.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import { ApiService } from "./api.service";

/** Payload enviado ao backend (espelha `ChatRequest`). */
export interface ChatRequestDto {
  message: string;
  /** Id de uma conversa existente; omitido para criar uma nova. */
  conversation_id?: string;
  /**
   * Identificador do modelo selecionado (NESSA/Qwen/Gemini).
   * Disponível no payload para o backend; o roteamento real do
   * motor é responsabilidade do AI Gateway.
   */
  model?: string;
}

/** Resposta devolvida pelo backend (espelha `ChatResponse`). */
export interface ChatResponseDto {
  response: string;
  conversation_id: string;
}

@Injectable({ providedIn: "root" })
export class ChatService {
  private readonly api = inject(ApiService);

  /** Envia a mensagem do usuário e recebe a resposta da NESSA. */
  send(payload: ChatRequestDto): Observable<ChatResponseDto> {
    return this.api.post<ChatResponseDto>("/chat", payload);
  }

  /*
   * FUTURO — streaming de respostas (SSE):
   *
   *   stream(payload: ChatRequestDto): Observable<ChatStreamChunk> { ... }
   *
   * O backend exporá um endpoint de Server-Sent Events no
   * AI Gateway; este método consumirá o fluxo token a token.
   */
}

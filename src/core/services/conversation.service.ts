/* ============================================================
   NESSA AI — ConversationService (core/services)
   Acesso às conversas persistidas pelo backend FastAPI.

   Faz o mapeamento dos DTOs do backend (snake_case) para os
   modelos de domínio do frontend na fronteira do serviço.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";

import type { ChatMessage, Conversation } from "../models";
import { formatDisplayDate } from "../utils/format-date";
import { ApiService } from "./api.service";

/** DTO de listagem devolvido pelo backend (`ConversationRead`). */
interface ConversationDto {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

/** DTO de mensagem devolvido pelo backend (`MessageRead`). */
interface MessageDto {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

/** Conversa completa com mensagens (`ConversationDetail`). */
export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

@Injectable({ providedIn: "root" })
export class ConversationService {
  private readonly api = inject(ApiService);

  /** Lista as conversas persistidas, mais recentes primeiro. */
  list(): Observable<Conversation[]> {
    return this.api
      .get<ConversationDto[]>("/conversations")
      .pipe(map((dtos) => dtos.map((dto) => this.toConversation(dto))));
  }

  /** Obtém uma conversa com todas as mensagens ordenadas. */
  get(id: string): Observable<ConversationDetail> {
    return this.api
      .get<ConversationDto & { messages: MessageDto[] }>(`/conversations/${id}`)
      .pipe(
        map((dto) => ({
          ...this.toConversation(dto),
          messages: (dto.messages ?? []).map(
            (message): ChatMessage => ({
              id: message.id,
              role: message.role,
              content: message.content,
            }),
          ),
        })),
      );
  }

  /** Exclui uma conversa (e suas mensagens) no backend. */
  remove(id: string): Observable<void> {
    return this.api.delete<void>(`/conversations/${id}`);
  }

  private toConversation(dto: ConversationDto): Conversation {
    return {
      id: dto.id,
      title: dto.title,
      messageCount: dto.message_count,
      displayDate: formatDisplayDate(dto.created_at),
    };
  }
}

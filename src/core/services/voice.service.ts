/* ============================================================
   NESSA AI — VoiceService (core/services)
   Sessões futuras de voz (gravação, transcrição) no backend.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { VoiceSession } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

const ENDPOINTS = {
  sessions: "/voice/sessions",
  one: (id: string) => `/voice/sessions/${id}`,
} as const;

@Injectable({ providedIn: "root" })
export class VoiceService {
  private readonly api = inject(ApiService);

  /** Cria uma sessão de voz enviando o áudio gravado. */
  createSession(audio: Blob): Observable<ApiResponse<VoiceSession>> {
    // const formData = new FormData();
    // formData.append("audio", audio, "gravacao.webm");
    // return this.api.upload<ApiResponse<VoiceSession>>(ENDPOINTS.sessions, formData);
    return notImplemented("VoiceService.createSession");
  }

  /** Lista o histórico de sessões de voz. */
  history(): Observable<ApiResponse<VoiceSession[]>> {
    // return this.api.get<ApiResponse<VoiceSession[]>>(ENDPOINTS.sessions);
    return notImplemented("VoiceService.history");
  }

  /** Obtém a transcrição de uma sessão. */
  transcript(id: string): Observable<ApiResponse<VoiceSession>> {
    // return this.api.get<ApiResponse<VoiceSession>>(ENDPOINTS.one(id));
    return notImplemented("VoiceService.transcript");
  }
}

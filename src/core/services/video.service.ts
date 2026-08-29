/* ============================================================
   NESSA AI — VideoService (core/services)
   Geração futura de vídeos via AI Gateway do backend.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { AspectRatio, VideoDuration, VideoGeneration } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

export interface GenerateVideoPayload {
  prompt: string;
  duration: VideoDuration;
  ratio: AspectRatio;
}

const ENDPOINTS = {
  generate: "/videos/generations",
  list: "/videos/generations",
} as const;

@Injectable({ providedIn: "root" })
export class VideoService {
  private readonly api = inject(ApiService);

  /** Solicita a geração de um vídeo a partir de um prompt. */
  generate(payload: GenerateVideoPayload): Observable<ApiResponse<VideoGeneration>> {
    // return this.api.post<ApiResponse<VideoGeneration>>(ENDPOINTS.generate, payload);
    return notImplemented("VideoService.generate");
  }

  /** Lista o histórico de gerações. */
  history(): Observable<ApiResponse<VideoGeneration[]>> {
    // return this.api.get<ApiResponse<VideoGeneration[]>>(ENDPOINTS.list);
    return notImplemented("VideoService.history");
  }
}

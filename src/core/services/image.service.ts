/* ============================================================
   NESSA AI — ImageService (core/services)
   Geração futura de imagens via AI Gateway do backend.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { AspectRatio, ImageGeneration } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

export interface GenerateImagePayload {
  prompt: string;
  ratio: AspectRatio;
}

const ENDPOINTS = {
  generate: "/images/generations",
  list: "/images/generations",
} as const;

@Injectable({ providedIn: "root" })
export class ImageService {
  private readonly api = inject(ApiService);

  /** Solicita a geração de uma imagem a partir de um prompt. */
  generate(payload: GenerateImagePayload): Observable<ApiResponse<ImageGeneration>> {
    // return this.api.post<ApiResponse<ImageGeneration>>(ENDPOINTS.generate, payload);
    return notImplemented("ImageService.generate");
  }

  /** Lista o histórico de gerações. */
  history(): Observable<ApiResponse<ImageGeneration[]>> {
    // return this.api.get<ApiResponse<ImageGeneration[]>>(ENDPOINTS.list);
    return notImplemented("ImageService.history");
  }
}

/* ============================================================
   NESSA AI — FileService (core/services)
   Gestão futura de arquivos (upload multipart, listagem,
   exclusão) no backend FastAPI.

   ETAPA ATUAL: apenas contratos. Nenhuma API é chamada.
   ============================================================ */

import { Injectable, inject } from "@angular/core";
import type { Observable } from "rxjs";

import type { FileItem } from "../models";
import type { ApiResponse } from "../models/api.models";
import { ApiService, notImplemented } from "./api.service";

const ENDPOINTS = {
  list: "/files",
  upload: "/files/upload",
  one: (id: string) => `/files/${id}`,
} as const;

@Injectable({ providedIn: "root" })
export class FileService {
  private readonly api = inject(ApiService);

  /** Lista os arquivos do workspace. */
  list(query?: string): Observable<ApiResponse<FileItem[]>> {
    // return this.api.get<ApiResponse<FileItem[]>>(ENDPOINTS.list, { query });
    return notImplemented("FileService.list");
  }

  /** Envia um arquivo (multipart/form-data). */
  upload(file: File): Observable<ApiResponse<FileItem>> {
    // const formData = new FormData();
    // formData.append("file", file, file.name);
    // return this.api.upload<ApiResponse<FileItem>>(ENDPOINTS.upload, formData);
    return notImplemented("FileService.upload");
  }

  /** Exclui um arquivo. */
  remove(id: string): Observable<ApiResponse<null>> {
    // return this.api.delete<ApiResponse<null>>(ENDPOINTS.one(id));
    return notImplemented("FileService.remove");
  }
}

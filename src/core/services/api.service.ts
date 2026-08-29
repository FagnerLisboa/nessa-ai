/* ============================================================
   NESSA AI — ApiService (core/services)
   Cliente HTTP genérico e reutilizável da plataforma.
   Centraliza: URL base + versão, timeout e normalização de
   erros para ApiError.

   Nenhum componente chama HttpClient diretamente — todos usam
   este serviço (ou os serviços de domínio que o encapsulam).
   ============================================================ */

import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, defer, throwError, timeout } from "rxjs";

import { API_CONFIG, apiUrl } from "../config/api.config";
import type { ApiError } from "../models/api.models";

type QueryParams = HttpParams | Record<string, string | number | boolean> | undefined;

@Injectable({ providedIn: "root" })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.request(() => this.http.get<T>(apiUrl(path), { params: this.toParams(params) }));
  }

  post<T>(path: string, body?: unknown): Observable<T> {
    return this.request(() => this.http.post<T>(apiUrl(path), body));
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.request(() => this.http.put<T>(apiUrl(path), body));
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.request(() => this.http.patch<T>(apiUrl(path), body));
  }

  delete<T>(path: string): Observable<T> {
    return this.request(() => this.http.delete<T>(apiUrl(path)));
  }

  /** Upload multipart (arquivos) — usado futuramente por FileService. */
  upload<T>(path: string, formData: FormData): Observable<T> {
    return this.request(() => this.http.post<T>(apiUrl(path), formData));
  }

  /* ------------------------------------------------------------
     Pipeline único: timeout + normalização de erros.
     ------------------------------------------------------------ */
  private request<T>(operation: () => Observable<T>): Observable<T> {
    return operation().pipe(
      timeout(API_CONFIG.timeoutMs),
      catchError((error: unknown) => throwError(() => this.normalize(error))),
    );
  }

  private normalize(error: unknown): ApiError | unknown {
    if (error instanceof HttpErrorResponse) {
      const body = (error.error ?? undefined) as Partial<ApiError> | undefined;
      return {
        code: body?.code ?? `HTTP_${error.status}`,
        message: body?.message ?? error.message,
        status: error.status,
        details: body?.details,
      } satisfies ApiError;
    }
    return error;
  }

  private toParams(params?: QueryParams): HttpParams | undefined {
    if (!params) return undefined;
    if (params instanceof HttpParams) return params;
    let result = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      result = result.set(key, String(value));
    }
    return result;
  }
}

/**
 * Placeholder honesto para métodos ainda não implementados.
 * Nada é chamado nesta etapa — se um método for invocado antes
 * do backend existir, o erro é explícito (e nunca silencioso).
 */
export function notImplemented(method: string): Observable<never> {
  return defer(() =>
    throwError(
      () => new Error(`[NESSA] ${method} aguarda o backend (FastAPI). Nenhuma API é chamada nesta etapa.`),
    ),
  );
}

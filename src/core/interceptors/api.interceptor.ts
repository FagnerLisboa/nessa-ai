/* ============================================================
   NESSA AI — Interceptor de API (core/interceptors)
   Interceptor funcional (arquitetura moderna do Angular 20 —
   sem NgModules). Registrado via withInterceptors() em
   app.config.ts.

   Nesta etapa NÃO há autenticação. O ponto exato de inserção
   do header futuro está marcado abaixo. Nenhum token fake é
   criado.
   ============================================================ */

import type { HttpInterceptorFn } from "@angular/common/http";

import { API_CONFIG } from "../config/api.config";

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  /* Somente as requisições destinadas à API da NESSA passam por aqui. */
  const isNessaApi = request.url.startsWith(API_CONFIG.baseUrl);
  if (!isNessaApi) {
    return next(request);
  }

  /*
   * FUTURO (Etapa de autenticação):
   *
   *   const token = inject(AuthService).accessToken();
   *   if (token) {
   *     request = request.clone({
   *       setHeaders: { Authorization: `Bearer ${token}` },
   *     });
   *   }
   *
   * O token será emitido pelo backend Python — nunca gerado ou
   * armazenado em claro por este interceptor.
   */

  return next(request);
};

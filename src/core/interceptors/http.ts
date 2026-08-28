/* ============================================================
   NESSA AI — Cliente HTTP com interceptadores (core/interceptors)
   Camada pronta para a Etapa 2 — nenhuma chamada é feita na
   Etapa 1 (não existem endpoints reais ainda).
   ============================================================ */

export interface HttpRequestConfig {
  path: string;
  init?: RequestInit;
}

export interface HttpResponse<T> {
  ok: boolean;
  status: number;
  data: T | null;
}

export interface HttpInterceptor {
  /** Antes do envio — injetar headers, base URL, token etc. */
  onRequest?(config: HttpRequestConfig): HttpRequestConfig;
  /** Depois da resposta — normalização, telemetria etc. */
  onResponse?<T>(response: HttpResponse<T>): HttpResponse<T>;
  /** Em falhas de rede/parse — logging centralizado. */
  onError?(error: unknown): void;
}

export interface HttpClient {
  use(interceptor: HttpInterceptor): HttpClient;
  request<T>(path: string, init?: RequestInit): Promise<HttpResponse<T>>;
  get<T>(path: string): Promise<HttpResponse<T>>;
  post<T>(path: string, body?: unknown): Promise<HttpResponse<T>>;
  patch<T>(path: string, body?: unknown): Promise<HttpResponse<T>>;
  delete<T>(path: string): Promise<HttpResponse<T>>;
}

export function createHttpClient(baseUrl: string): HttpClient {
  const interceptors: HttpInterceptor[] = [];

  const request = async <T>(path: string, init?: RequestInit): Promise<HttpResponse<T>> => {
    let config: HttpRequestConfig = { path, init };
    for (const interceptor of interceptors) {
      if (interceptor.onRequest) config = interceptor.onRequest(config);
    }

    try {
      const raw = await fetch(`${baseUrl}${config.path}`, {
        headers: { "Content-Type": "application/json" },
        ...config.init,
      });
      const text = await raw.text();
      let data: T | null = null;
      if (text) {
        try {
          data = JSON.parse(text) as T;
        } catch {
          data = null;
        }
      }
      let response: HttpResponse<T> = { ok: raw.ok, status: raw.status, data };
      for (const interceptor of interceptors) {
        if (interceptor.onResponse) response = interceptor.onResponse(response);
      }
      return response;
    } catch (error) {
      for (const interceptor of interceptors) {
        interceptor.onError?.(error);
      }
      throw error;
    }
  };

  const withBody = (body: unknown): RequestInit => ({
    method: "POST",
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return {
    use(interceptor) {
      interceptors.push(interceptor);
      return this;
    },
    request,
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) => request(path, withBody(body)),
    patch: (path, body) => request(path, { ...withBody(body), method: "PATCH" }),
    delete: (path) => request(path, { method: "DELETE" }),
  };
}

/** Cliente padrão — a base real chega com o backend (Etapa 2). */
export const http: HttpClient = createHttpClient("/api/v1");

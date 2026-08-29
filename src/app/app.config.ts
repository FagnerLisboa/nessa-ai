import { provideHttpClient, withInterceptors } from "@angular/common/http";
import type { ApplicationConfig } from "@angular/core";
import { provideRouter, withHashLocation } from "@angular/router";

import { apiInterceptor } from "../core/interceptors/api.interceptor";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    /* HttpClient moderno (sem NgModules) + interceptor da API. */
    provideHttpClient(withInterceptors([apiInterceptor])),
  ],
};

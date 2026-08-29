/* ============================================================
   NESSA AI — Bootstrap (Angular 20)
   zone.js é carregado via "polyfills" no angular.json.
   ============================================================ */
import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
  console.error("[NESSA] bootstrap falhou", error);
});

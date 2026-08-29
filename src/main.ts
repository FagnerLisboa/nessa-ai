/* ============================================================
   NESSA AI — Bootstrap (Angular 20)
   ============================================================ */
import "zone.js";
import { VERSION as NG_COMPILER_VERSION } from "@angular/compiler";
import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";
import "./styles/nessa-theme.scss";

/** Mantém o compilador JIT no bundle (este ambiente não executa ngc/AOT). */
export const NG_COMPILER = NG_COMPILER_VERSION.full;

bootstrapApplication(AppComponent, appConfig).catch((error: unknown) => {
  console.error("[NESSA] bootstrap falhou", error);
});

/* ============================================================
   NESSA AI — Bootstrap (Angular 20)
   zone.js é carregado via "polyfills" no angular.json.
   ============================================================ */
import { bootstrapApplication } from "@angular/platform-browser";

import { AppComponent } from "./app/app.component";
import { appConfig } from "./app/app.config";

/**
 * Em caso de falha de bootstrap, exibe o motivo dentro do
 * <app-root> — a página nunca fica em branco sem explicação.
 */
function renderBootstrapError(error: unknown): void {
  console.error("[NESSA] bootstrap falhou", error);
  const root = document.querySelector("app-root");
  if (root) {
    root.removeAttribute("data-booting");
    const box = document.createElement("div");
    box.setAttribute("role", "alert");
    box.style.cssText =
      "min-height:100dvh;display:grid;place-items:center;padding:32px;" +
      "font-family:'Inter','Manrope',system-ui,sans-serif;text-align:center;";
    box.innerHTML =
      '<div style="max-width:420px">' +
      '<p style="margin:0 0 8px;font-size:15px;font-weight:700;letter-spacing:.3em;color:#F5F5F7">NESSA</p>' +
      '<p style="margin:0;font-size:13px;line-height:1.6;color:#A1A1AA">' +
      "A plataforma não pôde iniciar neste navegador. " +
      "Abra o console do desenvolvedor para ver o motivo.</p>" +
      "</div>";
    root.replaceChildren(box);
  }
}

bootstrapApplication(AppComponent, appConfig).catch(renderBootstrapError);

/* ============================================================
   NESSA AI — Pós-build
   Torna o dist/index.html auto-contido: todo JS e CSS local é
   embutido no HTML, para que a aplicação carregue mesmo quando
   apenas o index.html é servido pelo ambiente de pré-visualização.
   Executado automaticamente pelo npm após "ng build" (postbuild).
   ============================================================ */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const indexPath = join(distDir, "index.html");

if (!existsSync(indexPath)) {
  console.error("[inline] dist/index.html não encontrado — nada a fazer.");
  process.exit(1);
}

let html = readFileSync(indexPath, "utf8");

const readAsset = (file) => readFileSync(join(distDir, file.replace(/^\//, "")), "utf8");

/** Escapa sequências que fechariam a tag <script> prematuramente. */
const safeJs = (code) => code.replaceAll("</script", "<\\/script");

/* 1. Embute os módulos locais (polyfills + main). */
html = html.replace(
  /<script\s+(?:src="([^"]+)"\s+type="module"|type="module"\s+src="([^"]+)")\s*><\/script>/g,
  (match, srcA, srcB) => {
    const src = srcA ?? srcB;
    if (!src || /^https?:/i.test(src) || !existsSync(join(distDir, src.replace(/^\//, "")))) {
      return match;
    }
    return `<script type="module">${safeJs(readAsset(src))}</script>`;
  },
);

/* 2. Remove modulepreload (inútil após o inline). */
html = html.replace(/<link rel="modulepreload"[^>]*>/g, "");

/* 3. Remove o fallback <noscript> do CSS otimizado. */
html = html.replace(/<noscript>\s*<link rel="stylesheet" href="[^"]+">\s*<\/noscript>/g, "");

/* 4. Embute as folhas de estilo locais (inclusive a variante media="print"). */
html = html.replace(/<link rel="stylesheet" href="([^"]+)"[^>]*>/g, (match, href) => {
  if (/^https?:/i.test(href) || !existsSync(join(distDir, href.replace(/^\//, "")))) {
    return match;
  }
  return `<style>${readAsset(href)}</style>`;
});

writeFileSync(indexPath, html, "utf8");
console.log("[inline] dist/index.html auto-contido gerado com sucesso.");

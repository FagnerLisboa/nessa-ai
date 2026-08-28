/* ============================================================
   NESSA AI — Utilitários puros (core/utils)
   ============================================================ */

/** Combina classes condicionais sem dependências externas. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

let uidSeq = 0;

/** Identificador único simples para uso em UI (não criptográfico). */
export function uid(prefix = "id"): string {
  uidSeq += 1;
  return `${prefix}-${Date.now().toString(36)}-${uidSeq.toString(36)}`;
}

export function isMac(): boolean {
  return typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

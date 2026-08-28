/* ============================================================
   NESSA AI — Carregador de módulo (lazy loading)
   ============================================================ */
import { ButterflyMark } from "./Logo";

export function PageLoader() {
  return (
    <div className="flex min-h-[52vh] flex-col items-center justify-center gap-4">
      <ButterflyMark size={44} alive />
      <p className="u-label animate-[nessa-pulse-soft_1.6s_var(--ease-out)_infinite]">
        Carregando módulo
      </p>
    </div>
  );
}

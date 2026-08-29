/* ============================================================
   NESSA AI — Página de módulo em fundação (shared/components)
   Estado vazio elegante para áreas que chegam nas próximas
   etapas: borboleta · "Em breve" · descrição real do módulo.
   ============================================================ */
import { Link } from "react-router-dom";
import type { ModuleId } from "../../core/models";
import { getModule } from "../../core/models/modules";
import { Icon } from "./Icons";
import { EmptyState } from "./EmptyState";

interface ModulePageProps {
  moduleId: ModuleId;
}

export function ModulePage({ moduleId }: ModulePageProps) {
  const module = getModule(moduleId);

  return (
    <EmptyState
      description={`${module.summary} Este espaço já está roteado e preparado — o conteúdo real chega quando o motor correspondente for conectado.`}
    >
      <Link
        to="/"
        className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--nessa-border)] px-4 text-[13px] font-semibold text-[var(--nessa-text)] transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] hover:border-[var(--nessa-accent)] hover:bg-[var(--nessa-surface-hover)] active:scale-[0.97]"
        aria-label="Voltar para o início"
      >
        <Icon name="arrow-right" size={14} className="rotate-180" />
        Voltar ao início
      </Link>
    </EmptyState>
  );
}

/* ============================================================
   NESSA AI — Empty state (shared/components)
   Elegante e honesto: borboleta · "Em breve" · descrição curta.
   Sem dados falsos, sem dashboards fictícios.
   ============================================================ */
import type { ReactNode } from "react";
import { cn } from "../../core/utils";
import { ButterflyMark } from "./Logo";

interface EmptyStateProps {
  title?: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function EmptyState({ title = "Em breve", description, children, className }: EmptyStateProps) {
  return (
    <div className={cn("empty-stage", className)}>
      <div className="arrive">
        <ButterflyMark size={40} className="mx-auto opacity-80" />
      </div>
      <h2
        className="arrive font-display mt-5 text-[22px] font-bold tracking-tight text-[var(--nessa-text)]"
        style={{ animationDelay: "80ms" }}
      >
        {title}
      </h2>
      <p
        className="arrive mt-2 max-w-sm text-[13.5px] leading-relaxed text-[var(--nessa-text-muted)]"
        style={{ animationDelay: "150ms" }}
      >
        {description}
      </p>
      {children && (
        <div className="arrive mt-6" style={{ animationDelay: "220ms" }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   NESSA AI — Estado vazio (shared/components)
   Superfície honesta: sem dados simulados, sem mocks.
   ============================================================ */
import type { ReactNode } from "react";
import { cn } from "../../core/utils";
import { Icon, type IconName } from "./Icons";
import { ButterflyMark } from "./Logo";

interface EmptyStateProps {
  icon?: IconName;
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-dashed border-[var(--nessa-border)] bg-[color-mix(in_srgb,var(--nessa-surface)_72%,transparent)] px-6 py-14 text-center",
        className,
      )}
    >
      <ButterflyMark
        size={190}
        className="pointer-events-none absolute -right-8 -bottom-10 opacity-[0.05]"
      />
      {icon && (
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-[var(--radius-md)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] text-[var(--nessa-accent)] shadow-[var(--shadow-inset)]">
          <Icon name={icon} size={22} />
        </span>
      )}
      <h3 className="font-display max-w-md text-[17px] font-bold tracking-tight text-[var(--nessa-text)]">
        {title}
      </h3>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-[var(--nessa-text-muted)]">
        {description}
      </p>
      {children && <div className="mt-6 flex flex-wrap items-center justify-center gap-3">{children}</div>}
    </div>
  );
}

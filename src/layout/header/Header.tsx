/* ============================================================
   NESSA AI — Header global (layout/header)
   Breadcrumb do módulo ativo, relógio local e status da etapa.
   ============================================================ */
import { Link, useLocation } from "react-router-dom";
import { getModuleByPath } from "../../core/models/modules";
import { setMobileNav } from "../../core/state/workspace.store";
import { cn } from "../../core/utils";
import { STAGE_LABEL } from "../../core/utils/tokens";
import { useMediaQuery, useNow } from "../../shared/directives/hooks";
import { Icon } from "../../shared/components/Icons";
import { formatClock } from "../../shared/pipes/format";
import { Badge, Kbd } from "../../shared/ui";

export function Header() {
  const location = useLocation();
  const now = useNow(30_000);
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const current = getModuleByPath(location.pathname);

  return (
    <header className="app-header">
      {!isDesktop && (
        <button
          onClick={() => setMobileNav(true)}
          className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] text-[var(--nessa-text-muted)] transition-colors hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]"
          aria-label="Abrir navegação"
        >
          <Icon name="menu" size={19} />
        </button>
      )}

      <div className="flex min-w-0 items-baseline gap-2.5">
        <span className="u-label hidden sm:inline">{current?.group ?? "nessa"}</span>
        <span className="hidden h-3 w-px bg-[var(--nessa-border)] sm:inline-block" aria-hidden="true" />
        <span className="font-display truncate text-[14px] font-bold tracking-tight text-[var(--nessa-text)]">
          {current?.label ?? "Início"}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-1.5 text-[12px] font-medium tabular-nums text-[var(--nessa-text-muted)] md:inline-flex">
          <Icon name="clock" size={13} />
          {formatClock(now)}
        </span>

        <Badge tone="primary" dot pulse className={cn(!isDesktop && "hidden sm:inline-flex")}>
          {STAGE_LABEL}
        </Badge>

        {isDesktop && (
          <span className="hidden items-center gap-1.5 text-[11px] text-[var(--nessa-text-muted)] xl:inline-flex">
            <Kbd>[</Kbd> sidebar
          </span>
        )}

        <Link
          to="/settings"
          className={cn(
            "grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] transition-all duration-[var(--t-fast)]",
            location.pathname === "/settings"
              ? "bg-[var(--nessa-primary-soft)] text-[var(--nessa-accent)]"
              : "text-[var(--nessa-text-muted)] hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]",
          )}
          aria-label="Configurações"
          title="Configurações"
        >
          <Icon name="gear" size={17} />
        </Link>
      </div>
    </header>
  );
}

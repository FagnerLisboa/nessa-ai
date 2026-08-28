/* ============================================================
   NESSA AI — Sidebar desktop (layout/sidebar)
   Colapsável, com estado persistido via store de signals.
   ============================================================ */
import { initials } from "../../shared/pipes/format";
import { Kbd } from "../../shared/ui";
import { Icon } from "../../shared/components/Icons";
import { Wordmark } from "../../shared/components/Logo";
import {
  toggleSidebar,
  useOperatorName,
  useSettings,
  useUi,
} from "../../core/state/workspace.store";
import { VERSION } from "../../core/utils/tokens";
import { NavList } from "./NavList";

export function Sidebar() {
  const { sidebarCollapsed } = useUi();
  const settings = useSettings();
  const name = useOperatorName();

  return (
    <aside className="app-sidebar">
      <div className="flex h-[var(--header-h)] flex-none items-center border-b border-[var(--nessa-hairline)] px-5">
        <Wordmark />
      </div>

      <div className="sidebar-nav">
        <NavList />
      </div>

      <div className="flex-none border-t border-[var(--nessa-hairline)] p-3">
        <div
          className="mb-2 flex items-center gap-2.5 overflow-hidden rounded-[var(--radius-sm)] px-2 py-1.5"
          title={name}
        >
          <span className="grid h-8 w-8 flex-none place-items-center rounded-full border border-[var(--nessa-primary-ring)] bg-[var(--nessa-primary-soft)] text-[11px] font-bold text-[var(--nessa-accent)]">
            {initials(name)}
          </span>
          <span className="sidebar-item__label flex min-w-0 flex-col">
            <span className="truncate text-[12.5px] font-bold text-[var(--nessa-text)]">{name}</span>
            <span className="truncate text-[11px] text-[var(--nessa-text-muted)]">
              {settings.role.trim() || "Workspace pessoal"}
            </span>
          </span>
        </div>

        <button
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-sm)] px-2 py-2 text-[var(--nessa-text-muted)] transition-colors duration-[var(--t-fast)] hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]"
          aria-label={sidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          title={sidebarCollapsed ? "Expandir" : "Colapsar ( [ )"}
        >
          <Icon name="panel" size={16} />
          <span className="sidebar-item__label flex flex-1 items-center justify-between text-[12px] font-semibold">
            {sidebarCollapsed ? "Expandir" : "Recolher"}
            {!sidebarCollapsed && <Kbd>[</Kbd>}
          </span>
        </button>

        <p className="sidebar-item__label mt-2 px-2 text-[10.5px] tracking-wide text-[var(--nessa-text-muted)]/70">
          v{VERSION} · fundação
        </p>
      </div>
    </aside>
  );
}

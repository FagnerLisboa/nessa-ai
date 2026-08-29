/* ============================================================
   NESSA AI — Sidebar desktop (layout/sidebar)
   Fixa a partir de 1200px · colapsável em trilho de símbolos.
   ============================================================ */
import { Icon } from "../../shared/components/Icons";
import { Wordmark } from "../../shared/components/Logo";
import { toggleSidebar, useUi } from "../../core/state/workspace.store";
import { NavList } from "./NavList";

export function Sidebar() {
  const { sidebarCollapsed } = useUi();

  return (
    <aside className="app-sidebar">
      <div className="sidebar-brand">
        <Wordmark compact />
        <button
          onClick={toggleSidebar}
          className="header-icon-btn -mr-1.5"
          aria-label={sidebarCollapsed ? "Expandir sidebar" : "Recolher sidebar"}
          title={sidebarCollapsed ? "Expandir" : "Recolher"}
        >
          <Icon name={sidebarCollapsed ? "chevron-right" : "chevron-left"} size={15} />
        </button>
      </div>

      <div className="sidebar-nav">
        <NavList />
      </div>
    </aside>
  );
}

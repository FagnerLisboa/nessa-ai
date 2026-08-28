/* ============================================================
   NESSA AI — Lista de navegação (layout/sidebar)
   Consumida pela sidebar desktop e pelo drawer mobile.
   ============================================================ */
import { NavLink } from "react-router-dom";
import { NAV_GROUPS, MODULES } from "../../core/models/modules";
import { cn } from "../../core/utils";
import { Icon, type IconName } from "../../shared/components/Icons";

interface NavListProps {
  onNavigate?: () => void;
}

export function NavList({ onNavigate }: NavListProps) {
  return (
    <nav className="flex flex-col gap-5" aria-label="Navegação principal">
      {NAV_GROUPS.map((group) => {
        const items = MODULES.filter((m) => m.group === group.id);
        if (items.length === 0) return null;
        return (
          <div key={group.id}>
            <p className="sidebar-group__title u-label mb-1.5 px-3">{group.title}</p>
            <div className="flex flex-col gap-0.5">
              {items.map((module) => (
                <NavLink
                  key={module.id}
                  to={module.path}
                  end={module.path === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) => cn("sidebar-item", isActive && "is-active")}
                  title={module.label}
                >
                  <span className="sidebar-item__icon">
                    <Icon name={module.icon as IconName} size={18} />
                  </span>
                  <span className="sidebar-item__label flex-1 truncate">{module.label}</span>
                  {!module.ready && (
                    <span
                      className="sidebar-item__label h-1.5 w-1.5 flex-none rounded-full bg-[var(--nessa-border)] transition-colors group-hover:bg-[var(--nessa-text-muted)]"
                      title={`Motor na Etapa ${module.stage}`}
                      aria-hidden="true"
                    />
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

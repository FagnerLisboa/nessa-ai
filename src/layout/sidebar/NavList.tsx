/* ============================================================
   NESSA AI — Navegação compacta (layout/sidebar)
   Discreta por definição: apenas o essencial.
   ============================================================ */
import { Link, NavLink } from "react-router-dom";
import type { ModuleId } from "../../core/models";
import { getModule } from "../../core/models/modules";
import { initials } from "../../shared/pipes/format";
import { cn } from "../../core/utils";
import { useOperatorName, useSettings } from "../../core/state/workspace.store";
import { Icon, type IconName } from "../../shared/components/Icons";

const PRIMARY_ITEMS: ModuleId[] = ["conversations", "projects", "agents", "files"];

function NavItem({ id, onNavigate }: { id: ModuleId; onNavigate?: () => void }) {
  const module = getModule(id);
  return (
    <NavLink
      to={module.path}
      onClick={onNavigate}
      className={({ isActive }) => cn("sidebar-item", isActive && "is-active")}
      title={module.label}
    >
      <span className="sidebar-item__icon">
        <Icon name={module.icon as IconName} size={18} />
      </span>
      <span className="sidebar-item__label flex-1 truncate">{module.label}</span>
    </NavLink>
  );
}

interface NavListProps {
  onNavigate?: () => void;
}

export function NavList({ onNavigate }: NavListProps) {
  const settings = useSettings();
  const name = useOperatorName();

  return (
    <nav className="flex flex-1 flex-col gap-1" aria-label="Navegação principal">
      <Link to="/chat" onClick={onNavigate} className="sidebar-new" title="Nova conversa">
        <span className="sidebar-item__icon">
          <Icon name="plus" size={17} strokeWidth={2} />
        </span>
        <span className="sidebar-new__label sidebar-item__label">Nova conversa</span>
      </Link>

      <div className="sidebar-divider" role="separator" />

      {PRIMARY_ITEMS.map((id) => (
        <NavItem key={id} id={id} onNavigate={onNavigate} />
      ))}

      <div className="sidebar-divider" role="separator" />

      <div className="mt-auto flex flex-col gap-1">
        <NavItem id="settings" onNavigate={onNavigate} />

        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) => cn("sidebar-profile", isActive && "is-active")}
          title={name}
          aria-label={`Perfil de ${name} — abrir configurações`}
        >
          <span className="sidebar-profile__avatar">{initials(name)}</span>
          <span className="sidebar-profile__meta">
            <span className="truncate text-[12.5px] font-bold text-[var(--nessa-text)]">{name}</span>
            <span className="truncate text-[11px] text-[var(--nessa-text-muted)]">
              {settings.role.trim() || "Workspace pessoal"}
            </span>
          </span>
        </NavLink>
      </div>
    </nav>
  );
}

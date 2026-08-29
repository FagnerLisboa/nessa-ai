/* ============================================================
   NESSA AI — Header (layout/header)
   Minimalista: título da página · tema · perfil.
   Mobile: menu · título · perfil.
   ============================================================ */
import { Link, useLocation } from "react-router-dom";
import { getModuleByPath } from "../../core/models/modules";
import {
  setMobileNav,
  toggleTheme,
  useOperatorName,
  useTheme,
} from "../../core/state/workspace.store";
import { useMediaQuery } from "../../shared/directives/hooks";
import { Icon } from "../../shared/components/Icons";
import { initials } from "../../shared/pipes/format";

export function Header() {
  const location = useLocation();
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const showTheme = useMediaQuery("(min-width: 768px)");
  const theme = useTheme();
  const name = useOperatorName();
  const current = getModuleByPath(location.pathname);

  return (
    <header className="app-header">
      {!isDesktop && (
        <button
          onClick={() => setMobileNav(true)}
          className="header-icon-btn -ml-2"
          aria-label="Abrir navegação"
        >
          <Icon name="menu" size={19} />
        </button>
      )}

      <h1 className="font-display min-w-0 truncate text-[14.5px] font-bold tracking-tight text-[var(--nessa-text)]">
        {current?.label ?? "Início"}
      </h1>

      <div className="ml-auto flex items-center gap-1.5">
        {showTheme && (
          <button
            onClick={toggleTheme}
            className="header-icon-btn"
            aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
            title={theme === "dark" ? "Tema claro" : "Tema escuro"}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={17} />
          </button>
        )}

        <Link
          to="/settings"
          className="ml-1 grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-[var(--nessa-primary-ring)] bg-[var(--nessa-primary-soft)] text-[11px] font-bold text-[var(--nessa-accent)] transition-transform duration-[var(--t-fast)] ease-[var(--ease-spring)] hover:scale-105 active:scale-95"
          aria-label={`Perfil de ${name} — abrir configurações`}
          title={name}
        >
          {initials(name)}
        </Link>
      </div>
    </header>
  );
}

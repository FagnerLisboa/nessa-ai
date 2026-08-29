/* ============================================================
   NESSA AI — Navegação recolhível (layout/mobile-navigation)
   Drawer para tablet e mobile (< 1200px).
   Fecha ao navegar, clicar fora ou pressionar Esc.
   ============================================================ */
import { useRef } from "react";
import { setMobileNav, useUi } from "../../core/state/workspace.store";
import { cn } from "../../core/utils";
import { useClickOutside, useHotkey } from "../../shared/directives/hooks";
import { Icon } from "../../shared/components/Icons";
import { ButterflyMark } from "../../shared/components/Logo";
import { NavList } from "../sidebar/NavList";

export function MobileNav() {
  const { mobileNavOpen } = useUi();
  const drawerRef = useRef<HTMLElement | null>(null);

  useClickOutside(drawerRef, () => setMobileNav(false), mobileNavOpen);
  useHotkey("Escape", () => setMobileNav(false));

  return (
    <>
      <div
        className={cn("drawer-scrim", mobileNavOpen && "is-open")}
        aria-hidden="true"
        onClick={() => setMobileNav(false)}
      />
      <aside
        ref={drawerRef}
        className={cn("drawer", mobileNavOpen && "is-open")}
        aria-label="Navegação"
        aria-hidden={!mobileNavOpen}
      >
        <div className="flex h-[var(--header-h)] flex-none items-center justify-between border-b border-[var(--nessa-hairline)] px-5">
          {/* Logo reduzido: o símbolo protagoniza no mobile */}
          <span className="inline-flex items-center gap-2.5">
            <ButterflyMark size={24} />
            <span className="font-display text-[14px] font-bold tracking-[0.24em] text-[var(--nessa-text)]">
              NESSA
            </span>
          </span>
          <button
            onClick={() => setMobileNav(false)}
            className="header-icon-btn"
            aria-label="Fechar navegação"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-4">
          <NavList onNavigate={() => setMobileNav(false)} />
        </div>
      </aside>
    </>
  );
}

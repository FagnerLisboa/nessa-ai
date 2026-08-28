/* ============================================================
   NESSA AI — Navegação mobile (layout/mobile-navigation)
   Drawer com scrim; fecha ao navegar, clicar fora ou Esc.
   ============================================================ */
import { useRef } from "react";
import { setMobileNav, useUi } from "../../core/state/workspace.store";
import { VERSION } from "../../core/utils/tokens";
import { cn } from "../../core/utils";
import { useClickOutside, useHotkey } from "../../shared/directives/hooks";
import { Icon } from "../../shared/components/Icons";
import { Wordmark } from "../../shared/components/Logo";
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
        aria-label="Navegação mobile"
        aria-hidden={!mobileNavOpen}
      >
        <div className="flex h-[var(--header-h)] flex-none items-center justify-between border-b border-[var(--nessa-hairline)] px-5">
          <Wordmark compact />
          <button
            onClick={() => setMobileNav(false)}
            className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] text-[var(--nessa-text-muted)] transition-colors hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]"
            aria-label="Fechar navegação"
          >
            <Icon name="close" size={17} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <NavList onNavigate={() => setMobileNav(false)} />
        </div>

        <p className="flex-none border-t border-[var(--nessa-hairline)] px-5 py-3.5 text-[10.5px] tracking-wide text-[var(--nessa-text-muted)]/70">
          NESSA AI · v{VERSION} · fundação
        </p>
      </aside>
    </>
  );
}

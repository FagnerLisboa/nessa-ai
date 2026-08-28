/* ============================================================
   NESSA AI — Shell da aplicação (layout/shell)
   Fundo ambiente em camadas + sidebar + header + outlet lazy.
   ============================================================ */
import { Suspense, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { cn } from "../../core/utils";
import { toggleSidebar, useUi } from "../../core/state/workspace.store";
import { useHotkey } from "../../shared/directives/hooks";
import { PageLoader } from "../../shared/components/PageLoader";
import { Toaster } from "../../shared/components/Toaster";
import { Sidebar } from "../sidebar/Sidebar";
import { Header } from "../header/Header";
import { MobileNav } from "../mobile-navigation/MobileNav";

export function Shell() {
  const { sidebarCollapsed } = useUi();
  const location = useLocation();

  useHotkey("[", toggleSidebar);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

  return (
    <>
      <div className="ambient" aria-hidden="true">
        <div className="ambient__glow" />
        <div className="ambient__glow ambient__glow--alt" />
        <div className="ambient__grid" />
        <div className="ambient__noise" />
      </div>

      <div className={cn("app-shell", sidebarCollapsed && "is-collapsed")}>
        <Sidebar />
        <MobileNav />

        <div className="app-main">
          <Header />
          <main className="page route-anim" key={location.pathname}>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      <Toaster />
    </>
  );
}

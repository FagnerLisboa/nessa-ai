import { Component, inject, output, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

import { ThemeService } from "../../../../core/services";

const PAGE_TITLES: Record<string, string> = {
  "/": "Início",
  "/conversations": "Conversas",
  "/agents": "Agentes",
  "/projects": "Projetos",
  "/files": "Arquivos",
  "/images": "Imagens",
  "/videos": "Vídeos",
  "/voice": "Voz",
  "/research": "Pesquisa",
  "/assistant": "Assistente",
  "/settings": "Configurações",
  "/profile": "Perfil",
};

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  /** Emitido para abrir/fechar o drawer (tablet/mobile). */
  readonly requestToggle = output<void>();

  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  /** Título da página atual, derivado da rota. */
  protected pageTitle = signal(PAGE_TITLES[this.router.url] ?? "Início");

  protected get isDark(): boolean {
    return this.themeService.theme() === "dark";
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.pageTitle.set(PAGE_TITLES[event.urlAfterRedirects] ?? "NESSA");
      });
  }

  protected toggleTheme(): void {
    this.themeService.toggle();
  }
}

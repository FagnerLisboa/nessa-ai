import { Component, inject, output, signal } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

import { ThemeService } from "../../../../core/services";
import { AuthService } from "../../../../core/services/auth.service";

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
  "/login": "Entrar",
  "/cadastro": "Criar Conta",
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
  private readonly authService = inject(AuthService);
  protected readonly router = inject(Router);

  /** Título da página atual, derivado da rota. */
  protected pageTitle = signal(PAGE_TITLES[this.router.url] ?? "Início");

  protected get isDark(): boolean {
    return this.themeService.theme() === "dark";
  }

  protected get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  /** Rota de destino do avatar: /profile se autenticado, /cadastro se não */
  protected get avatarRoute(): string {
    return this.isAuthenticated ? "/profile" : "/cadastro";
  }

  /** Navega para a rota do avatar */
  protected navigateToAvatarRoute(): void {
    this.router.navigate([this.avatarRoute]);
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

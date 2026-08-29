import { Component, effect, output, signal } from "@angular/core";

type Theme = "dark" | "light";

const THEME_KEY = "nessa:theme";

@Component({
  selector: "app-header",
  standalone: true,
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  /** Emitido para abrir/fechar o drawer (tablet/mobile). */
  readonly requestToggle = output<void>();

  /** Título da página atual. */
  protected readonly pageTitle = signal("Início");

  /** Tema ativo. */
  protected readonly theme = signal<Theme>(this.readInitialTheme());

  constructor() {
    effect(() => {
      const value = this.theme();
      document.documentElement.setAttribute("data-theme", value);
      try {
        localStorage.setItem(THEME_KEY, value);
      } catch {
        /* armazenamento indisponível — o tema segue em memória */
      }
    });
  }

  protected toggleTheme(): void {
    this.theme.set(this.theme() === "dark" ? "light" : "dark");
  }

  protected get isDark(): boolean {
    return this.theme() === "dark";
  }

  private readInitialTheme(): Theme {
    const fromDom = document.documentElement.getAttribute("data-theme");
    return fromDom === "light" ? "light" : "dark";
  }
}

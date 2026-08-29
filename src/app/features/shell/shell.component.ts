import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";

/**
 * Casco da aplicação: sidebar + header + área de conteúdo
 * (preenchida pelas rotas filhas via <router-outlet>).
 */
@Component({
  selector: "app-shell",
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.scss",
  host: {
    "(document:keydown.escape)": "closeSidebar()",
  },
})
export class ShellComponent {
  /** Estado do drawer (tablet/mobile). */
  protected readonly sidebarOpen = signal(false);

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}

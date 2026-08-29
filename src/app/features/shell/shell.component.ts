import { Component, signal } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { NessaComposerComponent } from "./nessa-composer/nessa-composer.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { SuggestionsComponent } from "./suggestions/suggestions.component";
import { NessaLogoComponent } from "../../shared/components/nessa-logo/nessa-logo.component";

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [
    SidebarComponent,
    HeaderComponent,
    NessaLogoComponent,
    NessaComposerComponent,
    SuggestionsComponent,
  ],
  templateUrl: "./shell.component.html",
  styleUrl: "./shell.component.scss",
  host: {
    "(document:keydown.escape)": "closeSidebar()",
  },
})
export class ShellComponent {
  /** Estado do drawer (tablet/mobile). */
  protected readonly sidebarOpen = signal(false);

  /** Prefill enviado das sugestões para o composer. */
  protected readonly seed = signal("");
  protected readonly seedTick = signal(0);

  protected toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  protected closeSidebar(): void {
    this.sidebarOpen.set(false);
  }

  protected onSuggestion(prefill: string): void {
    this.seed.set(prefill);
    this.seedTick.update((tick) => tick + 1);
  }
}

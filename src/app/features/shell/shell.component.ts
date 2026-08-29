import { Component, signal } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NessaLogoComponent } from "../../shared/components/nessa-logo/nessa-logo.component";

@Component({
  selector: "app-shell",
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, NessaLogoComponent],
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

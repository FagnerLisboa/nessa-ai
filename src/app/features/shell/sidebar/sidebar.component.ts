import { Component, inject, input, output } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs/operators";

import { NessaLogoComponent } from "../../../shared/components/nessa-logo/nessa-logo.component";

interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
}

const NAV_GROUPS: NavItem[][] = [
  [
    { id: "inicio", label: "Início", icon: "home", route: "/" },
    { id: "chat", label: "Chat", icon: "chat", route: "/" },
    { id: "conversas", label: "Conversas", icon: "stack", route: "/conversations" },
  ],
  [
    { id: "agentes", label: "Agentes", icon: "nodes", route: "/agents" },
    { id: "projetos", label: "Projetos", icon: "folder", route: "/projects" },
    { id: "arquivos", label: "Arquivos", icon: "doc", route: "/files" },
  ],
  [
    { id: "imagens", label: "Imagens", icon: "image", route: "/images" },
    { id: "videos", label: "Vídeos", icon: "play", route: "/videos" },
    { id: "voz", label: "Voz", icon: "wave", route: "/voice" },
  ],
  [
    { id: "pesquisa", label: "Pesquisa", icon: "compass", route: "/research" },
    { id: "assistente", label: "Assistente", icon: "spark", route: "/assistant" },
  ],
  [{ id: "configuracoes", label: "Configurações", icon: "gear", route: "/settings" }],
];

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [NessaLogoComponent],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
  host: {
    "[class.is-open]": "open()",
  },
})
export class SidebarComponent {
  /** Controla o drawer em telas < 1200px. */
  readonly open = input<boolean>(false);

  /** Emitido quando o drawer deve fechar (navegação ou clique em um item). */
  readonly requestClose = output<void>();

  protected readonly groups = NAV_GROUPS;

  /** Item ativo, derivado da rota atual. */
  protected activeId = "inicio";

  private readonly router = inject(Router);

  constructor() {
    this.syncActive(this.router.url);
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => this.syncActive(event.urlAfterRedirects));
  }

  protected select(item: NavItem): void {
    if (this.router.url !== item.route) {
      void this.router.navigate([item.route]);
    }
    this.requestClose.emit();
  }

  protected goProfile(): void {
    if (this.router.url !== "/profile") {
      void this.router.navigate(["/profile"]);
    }
    this.requestClose.emit();
  }

  private syncActive(url: string): void {
    const flat = NAV_GROUPS.flat();
    const match = flat.find((item) => item.route === url && item.id !== "chat") ?? flat[0];
    this.activeId = url === "/" ? "inicio" : match.id;
  }
}

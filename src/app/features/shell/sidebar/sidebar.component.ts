import { Component, input, output } from "@angular/core";
import { NessaLogoComponent } from "../../../shared/components/nessa-logo/nessa-logo.component";

interface NavItem {
  id: string;
  label: string;
  icon: string;
}

const NAV_GROUPS: NavItem[][] = [
  [
    { id: "inicio", label: "Início", icon: "home" },
    { id: "chat", label: "Chat", icon: "chat" },
    { id: "conversas", label: "Conversas", icon: "stack" },
  ],
  [
    { id: "agentes", label: "Agentes", icon: "nodes" },
    { id: "projetos", label: "Projetos", icon: "folder" },
    { id: "arquivos", label: "Arquivos", icon: "doc" },
  ],
  [
    { id: "imagens", label: "Imagens", icon: "image" },
    { id: "videos", label: "Vídeos", icon: "play" },
    { id: "voz", label: "Voz", icon: "wave" },
  ],
  [
    { id: "pesquisa", label: "Pesquisa", icon: "compass" },
    { id: "assistente", label: "Assistente", icon: "spark" },
  ],
  [{ id: "configuracoes", label: "Configurações", icon: "gear" }],
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

  /** Somente a rota atual ("/") está ativa nesta etapa. */
  protected readonly activeId = "inicio";

  protected select(item: NavItem): void {
    if (item.id === this.activeId) {
      this.requestClose.emit();
    }
  }
}

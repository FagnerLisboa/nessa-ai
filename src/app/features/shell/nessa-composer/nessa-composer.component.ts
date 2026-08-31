import {
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild,
} from "@angular/core";

import { AppState } from "../../../../core/state/app.state";
import { ModelSelectorComponent } from "../../../shared/components/model-selector.component";

interface AttachedFile {
  name: string;
  sizeLabel: string;
}

interface ComposerAction {
  id: string;
  label: string;
  icon: string;
  prefill: string;
}

const ACTIONS: ComposerAction[] = [
  { id: "image", label: "Criar imagem", icon: "image", prefill: "Crie uma imagem de " },
  { id: "video", label: "Criar vídeo", icon: "play", prefill: "Crie um vídeo sobre " },
  { id: "voice", label: "Usar voz", icon: "mic", prefill: "" },
  { id: "search", label: "Pesquisar", icon: "search", prefill: "Pesquise na web: " },
  { id: "file", label: "Analisar arquivo", icon: "doc", prefill: "Analise este arquivo: " },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let index = 0;
  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

/**
 * Composer principal da NESSA — o elemento central de interação.
 * Comportamento real: texto, anexos do sistema de arquivos, menu
 * contextual e feedback honesto (o motor de IA chega depois).
 */
@Component({
  selector: "app-nessa-composer",
  standalone: true,
  imports: [ModelSelectorComponent],
  templateUrl: "./nessa-composer.component.html",
  styleUrl: "./nessa-composer.component.scss",
})
export class NessaComposerComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Modelo de IA selecionado — estado global, pronto para a API. */
  protected readonly appState = inject(AppState);

  /** Prefill vindo das sugestões (texto + contador de acionamento). */
  readonly seed = input<string>("");
  readonly seedTick = input<number>(0);

  protected readonly actions = ACTIONS;

  protected readonly text = signal("");
  protected readonly focused = signal(false);
  protected readonly menuOpen = signal(false);
  protected readonly attachments = signal<AttachedFile[]>([]);
  protected readonly status = signal<string | null>(null);

  protected readonly canSend = computed(
    () => this.text().trim().length > 0 || this.attachments().length > 0,
  );

  private readonly field = viewChild<ElementRef<HTMLTextAreaElement>>("field");
  private statusTimer: number | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.statusTimer !== undefined) window.clearTimeout(this.statusTimer);
    });

    /* Aplica o prefill quando as sugestões disparam. */
    effect(() => {
      const tick = this.seedTick();
      if (tick > 0) {
        this.setFieldValue(this.seed());
        this.focusField();
      }
    });
  }

  protected onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.text.set(el.value);
    this.autosize();
  }

  protected onEnter(event: Event): void {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.submit();
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected runAction(action: ComposerAction): void {
    this.menuOpen.set(false);
    if (action.id === "voice") {
      this.showStatus("Voz estará disponível quando o motor de áudio for conectado.");
      return;
    }
    this.setFieldValue(action.prefill);
    this.focusField();
  }

  protected voiceHint(): void {
    this.showStatus("Voz estará disponível quando o motor de áudio for conectado.");
  }

  protected onFiles(event: Event): void {
    const inputEl = event.target as HTMLInputElement;
    const files = Array.from(inputEl.files ?? []).map((file) => ({
      name: file.name,
      sizeLabel: formatBytes(file.size),
    }));
    if (files.length > 0) {
      this.attachments.update((current) => [...current, ...files]);
    }
    inputEl.value = "";
  }

  protected removeAttachment(index: number): void {
    this.attachments.update((current) => current.filter((_, i) => i !== index));
  }

  protected submit(): void {
    if (!this.canSend()) return;
    this.setFieldValue("");
    this.attachments.set([]);
    this.showStatus("Mensagem registrada. A resposta chega quando o motor de IA estiver conectado.");
    this.focusField();
  }

  private showStatus(message: string): void {
    if (this.statusTimer !== undefined) window.clearTimeout(this.statusTimer);
    this.status.set(message);
    this.statusTimer = window.setTimeout(() => this.status.set(null), 4600);
  }

  /**
   * Escrita programática no campo: sincroniza DOM + signal + altura.
   *
   * O textarea é não-controlado (nenhuma binding escreve no valor),
   * então esta é a ÚNICA porta de escrita — usada por sugestões,
   * ações do menu "+" e envio. Estado externo (ex.: o modelo de IA
   * selecionado) não passa por aqui e jamais altera o texto digitado.
   */
  private setFieldValue(value: string): void {
    this.text.set(value);
    const el = this.field()?.nativeElement;
    if (el) el.value = value;
    this.autosize();
  }

  private focusField(): void {
    requestAnimationFrame(() => this.field()?.nativeElement.focus());
  }

  private autosize(): void {
    requestAnimationFrame(() => {
      const el = this.field()?.nativeElement;
      if (!el) return;
      el.style.height = "0px";
      el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
    });
  }

  /* Fecha o menu ao clicar fora ou pressionar Esc. */
  @HostListener("document:click", ["$event"])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.menuOpen.set(false);
    }
  }

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    this.menuOpen.set(false);
  }
}

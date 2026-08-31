import {
  Component,
  ElementRef,
  HostListener,
  computed,
  inject,
  input,
  output,
  signal,
} from "@angular/core";

import { AI_MODELS, type AiModel } from "../../../core/models";

/**
 * Seletor de modelo de IA — reutilizável e desacoplado.
 * Recebe a lista de modelos e o id selecionado; emite a nova
 * seleção. O estado real vive em quem o hospeda (AppState),
 * pronto para ser enviado à API no futuro.
 *
 * Comportamento: abre para cima (não cobre o campo de texto),
 * alinha à direita, fecha com seleção, clique fora ou Escape.
 */
@Component({
  selector: "app-model-selector",
  standalone: true,
  template: `
    <div class="selector">
      <button
        type="button"
        class="selector__trigger"
        [class.is-open]="open()"
        (click)="toggle()"
        aria-haspopup="listbox"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="'Modelo de IA selecionado: ' + selectedLabel() + '. Abrir lista de modelos'"
      >
        <span class="selector__label">{{ selectedLabel() }}</span>
        <svg
          class="selector__chevron"
          [class.is-flipped]="open()"
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          stroke-width="1.9"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9.5 6 6 6-6" />
        </svg>
      </button>

      @if (open()) {
        <div class="selector__menu" role="listbox" [attr.aria-label]="'Selecionar modelo de IA'">
          <p class="selector__menu-title">Modelo</p>
          @for (model of models(); track model.id) {
            <button
              type="button"
              role="option"
              class="selector__option"
              [class.is-active]="model.id === selectedId()"
              [attr.aria-selected]="model.id === selectedId()"
              (click)="pick(model)"
            >
              <span class="selector__option-label">{{ model.label }}</span>
              @if (model.id === selectedId()) {
                <svg
                  class="selector__check"
                  viewBox="0 0 24 24"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .selector {
      position: relative;
      display: inline-flex;
    }

    .selector__trigger {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      height: 34px;
      padding: 0 10px;
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      font-family: inherit;
      cursor: pointer;
      color: var(--nessa-text-muted);
      transition:
        background var(--t-fast) var(--ease-out),
        color var(--t-fast) var(--ease-out);
    }

    .selector__trigger:hover,
    .selector__trigger.is-open {
      background: var(--nessa-surface-hover);
      color: var(--nessa-text);
    }

    .selector__label {
      font-size: 12.5px;
      font-weight: 600;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    .selector__chevron {
      color: var(--nessa-accent);
      transition: transform var(--t-fast) var(--ease-spring);
    }

    .selector__chevron.is-flipped {
      transform: rotate(180deg);
    }

    /* Abre para cima — não cobre o campo de texto. */
    .selector__menu {
      position: absolute;
      bottom: calc(100% + 10px);
      right: 0;
      z-index: 70;
      min-width: 184px;
      max-width: calc(100vw - 32px);
      padding: 6px;
      border: 1px solid var(--nessa-hairline);
      border-radius: var(--radius-md);
      background: var(--nessa-surface-2);
      box-shadow: var(--shadow-pop);
      animation: selector-menu-in var(--t-fast) var(--ease-out) both;
    }

    @keyframes selector-menu-in {
      from {
        opacity: 0;
        transform: translateY(6px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .selector__menu-title {
      margin: 0 0 4px;
      padding: 4px 10px 2px;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--nessa-text-muted);
    }

    .selector__option {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      width: 100%;
      padding: 8px 10px;
      border: 0;
      border-radius: var(--radius-sm);
      background: transparent;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      text-align: left;
      color: var(--nessa-text);
      cursor: pointer;
      transition: background var(--t-fast) var(--ease-out);
    }

    .selector__option:hover {
      background: var(--nessa-surface-hover);
    }

    .selector__option.is-active {
      color: var(--nessa-accent);
    }

    .selector__check {
      flex: none;
      color: var(--nessa-accent);
    }

    @media (prefers-reduced-motion: reduce) {
      .selector__menu {
        animation: none;
      }
    }
  `,
})
export class ModelSelectorComponent {
  private readonly host = inject(ElementRef<HTMLElement>);

  /** Modelos disponíveis (padrão: NESSA, Qwen, Gemini). */
  readonly models = input<AiModel[]>(AI_MODELS);

  /** Id do modelo atualmente selecionado. */
  readonly selectedId = input<string>(AI_MODELS[0].id);

  /** Emite o id do modelo escolhido. */
  readonly selectedIdChange = output<string>();

  protected readonly open = signal(false);

  protected readonly selectedLabel = computed(() => {
    const id = this.selectedId();
    return this.models().find((model) => model.id === id)?.label ?? this.models()[0].label;
  });

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected pick(model: AiModel): void {
    this.open.set(false);
    if (model.id !== this.selectedId()) {
      this.selectedIdChange.emit(model.id);
    }
  }

  /* Fecha ao clicar fora ou pressionar Escape. */
  @HostListener("document:click", ["$event"])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  @HostListener("document:keydown.escape")
  protected onEscape(): void {
    this.open.set(false);
  }
}

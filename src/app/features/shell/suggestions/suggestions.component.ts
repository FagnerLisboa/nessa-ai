import { Component, output } from "@angular/core";

interface Suggestion {
  label: string;
  icon: "code" | "image" | "search" | "doc";
  prefill: string;
}

const SUGGESTIONS: Suggestion[] = [
  { label: "Escreva um código", icon: "code", prefill: "Escreva um código para " },
  { label: "Crie uma imagem", icon: "image", prefill: "Crie uma imagem de " },
  { label: "Pesquise na web", icon: "search", prefill: "Pesquise na web: " },
  { label: "Analise um arquivo", icon: "doc", prefill: "Analise este arquivo: " },
];

/**
 * Sugestões discretas sob o composer.
 * Ao escolher, o texto-base vai para o composer (comportamento real).
 */
@Component({
  selector: "app-suggestions",
  standalone: true,
  template: `
    <div class="chips">
      @for (item of suggestions; track item.label) {
        <button type="button" class="chip" (click)="picked.emit(item.prefill)">
          <span class="chip__icon" aria-hidden="true">
            @switch (item.icon) {
              @case ("code") {
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m8.5 8-4.3 4 4.3 4M15.5 8l4.3 4-4.3 4" />
                </svg>
              }
              @case ("image") {
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="5" width="16" height="14" rx="2" />
                  <circle cx="9" cy="10" r="1.4" />
                  <path d="m5.5 17.5 4.5-4 3 2.6 2.5-2.1 3 3.5" />
                </svg>
              }
              @case ("search") {
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="6" />
                  <path d="m19.5 19.5-4-4" />
                </svg>
              }
              @case ("doc") {
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 3.8h8l4 4v12.4H6Z" />
                  <path d="M14 3.8v4h4M9 12h6M9 15.4h6" />
                </svg>
              }
            }
          </span>
          {{ item.label }}
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 10px;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 8px 14px;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-full);
      background: color-mix(in srgb, var(--nessa-surface) 72%, transparent);
      color: var(--nessa-text-muted);
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      transition:
        color var(--t-fast) var(--ease-out),
        border-color var(--t-fast) var(--ease-out),
        background var(--t-fast) var(--ease-out),
        transform var(--t-fast) var(--ease-out);
    }

    .chip:hover {
      color: var(--nessa-text);
      border-color: var(--nessa-accent);
      background: var(--nessa-surface-hover);
      transform: translateY(-1px);
    }

    .chip:active {
      transform: translateY(0) scale(0.97);
    }

    .chip__icon {
      display: inline-flex;
      color: var(--nessa-accent);
    }

    /* Mobile: duas colunas exatas — cada botão cabe por inteiro,
       o texto quebra se preciso e nada sai da viewport. */
    @media (max-width: 639.98px) {
      :host {
        width: 100%;
        max-width: 100%;
      }

      .chips {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        width: 100%;
      }

      .chip {
        min-width: 0;
        justify-content: center;
        padding: 9px 10px;
        white-space: normal;
        line-height: 1.3;
        text-align: center;
      }

      .chip__icon {
        flex: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .chip {
        transition: none;
      }
    }
  `,
})
export class SuggestionsComponent {
  /** Texto-base escolhido para preencher o composer. */
  readonly picked = output<string>();

  protected readonly suggestions = SUGGESTIONS;
}

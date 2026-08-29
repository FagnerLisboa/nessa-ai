import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import type { AspectRatio } from "../../../core/models";
import { PageHeaderComponent } from "../../shared/components/page-header.component";

const RATIOS: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3"];

@Component({
  selector: "app-images-page",
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <section class="page">
      <app-page-header title="Imagens" description="Crie imagens usando inteligência artificial."></app-page-header>

      <div class="studio panel arrive" style="animation-delay: 60ms">
        <label class="studio__label" for="image-prompt">Prompt</label>
        <textarea
          id="image-prompt"
          class="input studio__prompt"
          rows="3"
          placeholder="Descreva a imagem que você quer criar…"
          [value]="prompt()"
          (input)="onPrompt($event)"
        ></textarea>

        <div class="studio__row">
          <div class="ratios" role="radiogroup" aria-label="Proporção da imagem">
            @for (ratio of ratios; track ratio) {
              <button
                type="button"
                class="ratio"
                role="radio"
                [attr.aria-checked]="selected() === ratio"
                (click)="selected.set(ratio)"
              >
                <span class="ratio__box" [attr.data-ratio]="ratio"></span>
                <span class="ratio__label">{{ ratio }}</span>
              </button>
            }
          </div>

          <button
            type="button"
            class="btn btn--primary studio__generate"
            [disabled]="prompt().trim().length === 0"
            (click)="generate()"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3.5c.7 4.6 3.9 7.8 8.5 8.5-4.6.7-7.8 3.9-8.5 8.5-.7-4.6-3.9-7.8-8.5-8.5 4.6-.7 7.8-3.9 8.5-8.5Z" />
            </svg>
            Gerar
          </button>
        </div>
      </div>

      @if (showNotice()) {
        <div class="connect panel panel--soft arrive" role="status">
          <span class="connect__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="8.2" />
              <path d="M12 11v5M12 7.8v.2" />
            </svg>
          </span>
          <div class="connect__text">
            <p class="connect__title">Conecte um modelo de geração de imagens para começar.</p>
            <p class="connect__desc">
              Nenhum provedor está configurado ainda —
              <a class="link" routerLink="/settings">escolha um modelo nas Configurações</a>.
            </p>
          </div>
        </div>
      }

      <div class="history arrive" style="animation-delay: 120ms">
        <p class="u-eyebrow history__title">Histórico de gerações</p>
        <div class="panel panel--soft history__empty">
          <span class="history__ghost" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="5" width="16" height="14" rx="2" />
              <circle cx="9" cy="10" r="1.4" />
              <path d="m5.5 17.5 4.5-4 3 2.6 2.5-2.1 3 3.5" />
            </svg>
          </span>
          <p class="history__hint">Suas gerações aparecerão aqui.</p>
        </div>
      </div>
    </section>
  `,
  styles: `
    .studio {
      padding: 18px;
    }

    .studio__label {
      display: block;
      font-size: 12px;
      font-weight: 600;
      color: var(--nessa-text-muted);
      margin-bottom: 7px;
    }

    .studio__prompt {
      min-height: 84px;
    }

    .studio__row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .ratios {
      display: flex;
      gap: 8px;
    }

    .ratio {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 9px 12px;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-sm);
      background: transparent;
      font-family: inherit;
      cursor: pointer;
      transition: border-color var(--t-fast) var(--ease-out), background var(--t-fast) var(--ease-out);
    }

    .ratio:hover {
      border-color: var(--nessa-accent);
    }

    .ratio[aria-checked="true"] {
      border-color: var(--nessa-primary);
      background: var(--nessa-primary-soft);
    }

    .ratio__box {
      display: block;
      border: 1.5px solid var(--nessa-text-muted);
      border-radius: 3px;
      transition: border-color var(--t-fast) var(--ease-out);
    }

    .ratio[aria-checked="true"] .ratio__box {
      border-color: var(--nessa-accent);
    }

    .ratio__box[data-ratio="1:1"] { width: 20px; height: 20px; }
    .ratio__box[data-ratio="16:9"] { width: 26px; height: 15px; }
    .ratio__box[data-ratio="9:16"] { width: 14px; height: 24px; }
    .ratio__box[data-ratio="4:3"] { width: 24px; height: 18px; }

    .ratio__label {
      font-size: 11px;
      font-weight: 600;
      color: var(--nessa-text-muted);
    }

    .ratio[aria-checked="true"] .ratio__label {
      color: var(--nessa-accent);
    }

    .connect {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      margin-top: 18px;
      padding: 16px 18px;
    }

    .connect__icon {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      flex: none;
      border-radius: var(--radius-full);
      background: var(--nessa-primary-soft);
      color: var(--nessa-accent);
    }

    .connect__title {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: var(--nessa-text);
    }

    .connect__desc {
      margin: 3px 0 0;
      font-size: 13px;
      line-height: 1.55;
      color: var(--nessa-text-muted);
    }

    .history {
      margin-top: 30px;
    }

    .history__title {
      margin-bottom: 12px;
    }

    .history__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 40px 20px;
    }

    .history__ghost {
      color: var(--nessa-text-muted);
      opacity: 0.55;
    }

    .history__hint {
      margin: 0;
      font-size: 13px;
      color: var(--nessa-text-muted);
    }
  `,
})
export class ImagesPage {
  protected readonly ratios = RATIOS;
  protected readonly prompt = signal("");
  protected readonly selected = signal<AspectRatio>("1:1");
  protected readonly showNotice = signal(false);

  protected onPrompt(event: Event): void {
    this.prompt.set((event.target as HTMLTextAreaElement).value);
  }

  protected generate(): void {
    if (this.prompt().trim().length === 0) return;
    this.showNotice.set(true);
  }
}

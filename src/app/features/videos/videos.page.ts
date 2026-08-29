import { Component, signal } from "@angular/core";
import { RouterLink } from "@angular/router";

import type { AspectRatio, VideoDuration } from "../../../core/models";
import { PageHeaderComponent } from "../../shared/components/page-header.component";

const DURATIONS: VideoDuration[] = ["5s", "10s", "20s"];
const RATIOS: AspectRatio[] = ["16:9", "9:16", "1:1"];

@Component({
  selector: "app-videos-page",
  standalone: true,
  imports: [RouterLink, PageHeaderComponent],
  template: `
    <section class="page">
      <app-page-header title="Vídeos" description="Transforme ideias em vídeos."></app-page-header>

      <div class="studio panel arrive" style="animation-delay: 60ms">
        <label class="studio__label" for="video-prompt">Prompt</label>
        <textarea
          id="video-prompt"
          class="input studio__prompt"
          rows="3"
          placeholder="Descreva a cena que você quer gerar…"
          [value]="prompt()"
          (input)="onPrompt($event)"
        ></textarea>

        <div class="studio__row">
          <div class="studio__group">
            <span class="studio__group-label">Duração</span>
            <div class="pills" role="radiogroup" aria-label="Duração do vídeo">
              @for (duration of durations; track duration) {
                <button
                  type="button"
                  class="pill"
                  role="radio"
                  [attr.aria-checked]="selectedDuration() === duration"
                  (click)="selectedDuration.set(duration)"
                >
                  {{ duration }}
                </button>
              }
            </div>
          </div>

          <div class="studio__group">
            <span class="studio__group-label">Proporção</span>
            <div class="pills" role="radiogroup" aria-label="Proporção do vídeo">
              @for (ratio of ratios; track ratio) {
                <button
                  type="button"
                  class="pill"
                  role="radio"
                  [attr.aria-checked]="selectedRatio() === ratio"
                  (click)="selectedRatio.set(ratio)"
                >
                  {{ ratio }}
                </button>
              }
            </div>
          </div>

          <button
            type="button"
            class="btn btn--primary studio__generate"
            [disabled]="prompt().trim().length === 0"
            (click)="generate()"
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="4" y="5" width="16" height="14" rx="2.5" />
              <path d="m10.4 9.2 4.6 2.8-4.6 2.8Z" />
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
            <p class="connect__title">Conecte um modelo de geração de vídeos para começar.</p>
            <p class="connect__desc">
              Nenhum provedor está configurado ainda —
              <a class="link" routerLink="/settings">escolha um modelo nas Configurações</a>.
            </p>
          </div>
        </div>
      }

      <div class="history arrive" style="animation-delay: 120ms">
        <p class="u-eyebrow history__title">Histórico</p>
        <div class="panel panel--soft history__empty">
          <span class="history__ghost" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="5" width="16" height="14" rx="2.5" />
              <path d="m10.4 9.2 4.6 2.8-4.6 2.8Z" />
            </svg>
          </span>
          <p class="history__hint">Seus vídeos aparecerão aqui.</p>
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
      align-items: flex-end;
      gap: 22px;
      flex-wrap: wrap;
      margin-top: 14px;
    }

    .studio__group {
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    .studio__group-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--nessa-text-muted);
    }

    .pills {
      display: flex;
      gap: 7px;
    }

    .pill {
      padding: 7px 14px;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-full);
      background: transparent;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--nessa-text-muted);
      cursor: pointer;
      transition: color var(--t-fast) var(--ease-out), border-color var(--t-fast) var(--ease-out),
        background var(--t-fast) var(--ease-out);
    }

    .pill:hover {
      color: var(--nessa-text);
      border-color: var(--nessa-accent);
    }

    .pill[aria-checked="true"] {
      color: var(--nessa-accent);
      border-color: var(--nessa-primary-ring);
      background: var(--nessa-primary-soft);
    }

    .studio__generate {
      margin-left: auto;
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

    @media (max-width: 640px) {
      .studio__generate {
        margin-left: 0;
        width: 100%;
      }
    }
  `,
})
export class VideosPage {
  protected readonly durations = DURATIONS;
  protected readonly ratios = RATIOS;
  protected readonly prompt = signal("");
  protected readonly selectedDuration = signal<VideoDuration>("10s");
  protected readonly selectedRatio = signal<AspectRatio>("16:9");
  protected readonly showNotice = signal(false);

  protected onPrompt(event: Event): void {
    this.prompt.set((event.target as HTMLTextAreaElement).value);
  }

  protected generate(): void {
    if (this.prompt().trim().length === 0) return;
    this.showNotice.set(true);
  }
}

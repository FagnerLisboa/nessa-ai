import { Component, signal } from "@angular/core";

import { NessaLogoComponent } from "../../shared/components/nessa-logo/nessa-logo.component";
import { NessaComposerComponent } from "../shell/nessa-composer/nessa-composer.component";
import { SuggestionsComponent } from "../shell/suggestions/suggestions.component";

/** Tela inicial — palco central com o composer como protagonista. */
@Component({
  selector: "app-home-page",
  standalone: true,
  imports: [NessaLogoComponent, NessaComposerComponent, SuggestionsComponent],
  template: `
    <section class="stage">
      <app-nessa-logo class="stage__logo" [size]="56"></app-nessa-logo>

      <p class="stage__wordmark">NESSA</p>

      <h2 class="stage__title">Como posso ajudar você hoje?</h2>

      <p class="stage__subtitle">
        Converse, crie, pesquise e transforme suas ideias.
      </p>

      <div class="stage__composer">
        <app-nessa-composer [seed]="seed()" [seedTick]="seedTick()"></app-nessa-composer>
      </div>

      <app-suggestions class="stage__suggestions" (picked)="onSuggestion($event)"></app-suggestions>
    </section>
  `,
  styles: `
    :host {
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .stage {
      width: 100%;
      max-width: 760px;
      margin: auto;
      padding: 44px 20px 56px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stage__wordmark {
      margin: 20px 0 0;
      font-family: var(--nessa-font-display);
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.46em;
      text-indent: 0.46em;
      color: var(--nessa-text);
    }

    .stage__title {
      margin: 18px 0 0;
      max-width: 18ch;
      font-family: var(--nessa-font-display);
      font-size: clamp(26px, 4.2vw, 38px);
      font-weight: 600;
      line-height: 1.16;
      letter-spacing: -0.02em;
      color: var(--nessa-text);
    }

    .stage__subtitle {
      margin: 12px 0 0;
      max-width: 42ch;
      font-size: 15px;
      line-height: 1.65;
      color: var(--nessa-text-muted);
    }

    .stage__composer {
      width: 100%;
      max-width: 720px;
      margin-top: 36px;
      text-align: left;
    }

    .stage__suggestions {
      margin-top: 18px;
    }

    /* Entrada escalonada (uma única vez). */
    @keyframes stage-arrive {
      from {
        opacity: 0;
        transform: translateY(14px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .stage > * {
      animation: stage-arrive 0.65s var(--ease-out) both;
    }

    .stage > *:nth-child(2) { animation-delay: 0.07s; }
    .stage > *:nth-child(3) { animation-delay: 0.14s; }
    .stage > *:nth-child(4) { animation-delay: 0.2s; }
    .stage > *:nth-child(5) { animation-delay: 0.28s; }
    .stage > *:nth-child(6) { animation-delay: 0.36s; }

    @media (prefers-reduced-motion: reduce) {
      .stage > * {
        animation: none;
      }
    }
  `,
})
export class HomePage {
  /** Texto repassado ao composer quando uma sugestão é escolhida. */
  protected readonly seed = signal("");
  protected readonly seedTick = signal(0);

  protected onSuggestion(text: string): void {
    this.seed.set(text);
    this.seedTick.update((tick) => tick + 1);
  }
}

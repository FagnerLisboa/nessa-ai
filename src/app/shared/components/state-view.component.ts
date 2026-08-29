import { Component, input, output } from "@angular/core";

export type StateKind = "loading" | "empty" | "error";

/** Estados de tela: carregando (skeleton), vazio e erro. */
@Component({
  selector: "app-state-view",
  standalone: true,
  template: `
    @switch (kind()) {
      @case ("loading") {
        <div class="panel state" aria-busy="true" aria-label="Carregando">
          @for (row of rows(); track $index) {
            <div class="state__row">
              <span class="skeleton state__avatar"></span>
              <span class="state__lines">
                <span class="skeleton state__line state__line--lg"></span>
                <span class="skeleton state__line state__line--sm"></span>
              </span>
            </div>
          }
        </div>
      }
      @case ("empty") {
        <div class="panel panel--soft state state--center arrive">
          <span class="state__icon">
            <svg viewBox="0 0 48 48" width="26" height="26" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="state-wing" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
                  <stop stop-color="var(--nessa-primary)" />
                  <stop offset="1" stop-color="var(--nessa-accent)" />
                </linearGradient>
              </defs>
              <g fill="url(#state-wing)">
                <path d="M22.6 20.5C16.5 8.5 5.5 5.5 4.6 12.6 3.8 18.9 12 23.6 22.6 23.4Z" opacity=".96" />
                <path d="M25.4 20.5C31.5 8.5 42.5 5.5 43.4 12.6 44.2 18.9 36 23.6 25.4 23.4Z" opacity=".96" />
                <path d="M22.6 25.6C13.5 25 7.5 30 10 36.2 12.3 41.6 20.4 38.6 22.6 30.4Z" opacity=".8" />
                <path d="M25.4 25.6C34.5 25 40.5 30 38 36.2 35.7 41.6 27.6 38.6 25.4 30.4Z" opacity=".8" />
              </g>
              <rect x="22.7" y="14" width="2.6" height="21" rx="1.3" fill="var(--nessa-text)" opacity=".92" />
              <circle cx="24" cy="12.4" r="1.9" fill="var(--nessa-text)" opacity=".92" />
            </svg>
          </span>
          <h3 class="state__title">{{ title() }}</h3>
          <p class="state__desc">{{ description() }}</p>
          @if (actionLabel(); as label) {
            <button type="button" class="btn btn--ghost btn--sm state__action" (click)="action.emit()">
              {{ label }}
            </button>
          }
        </div>
      }
      @case ("error") {
        <div class="panel panel--soft state state--center arrive" role="alert">
          <span class="state__icon state__icon--error">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 4.6 21 19H3Z" />
              <path d="M12 10v4M12 16.6v.2" />
            </svg>
          </span>
          <h3 class="state__title">Algo deu errado</h3>
          <p class="state__desc">Não foi possível carregar estas informações agora.</p>
          <button type="button" class="btn btn--ghost btn--sm state__action" (click)="retry.emit()">
            Tentar novamente
          </button>
        </div>
      }
    }
  `,
  styles: `
    :host {
      display: block;
    }

    .state__row {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 15px 18px;
    }

    .state__row + .state__row {
      border-top: 1px solid var(--nessa-hairline);
    }

    .state__avatar {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      flex: none;
    }

    .state__lines {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .state__line {
      height: 12px;
    }

    .state__line--lg {
      width: min(46%, 300px);
    }

    .state__line--sm {
      width: min(26%, 170px);
    }

    .state--center {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 52px 24px;
    }

    .state__icon {
      display: grid;
      place-items: center;
      width: 52px;
      height: 52px;
      border-radius: var(--radius-full);
      border: 1px solid var(--nessa-hairline);
      background: var(--nessa-surface-2);
      margin-bottom: 16px;
    }

    .state__icon--error {
      color: var(--nessa-warning);
      border-color: color-mix(in srgb, var(--nessa-warning) 35%, transparent);
      background: var(--nessa-warning-soft);
    }

    .state__title {
      margin: 0;
      font-family: var(--nessa-font-display);
      font-size: 16.5px;
      font-weight: 650;
      color: var(--nessa-text);
    }

    .state__desc {
      margin: 7px 0 0;
      max-width: 44ch;
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--nessa-text-muted);
    }

    .state__action {
      margin-top: 18px;
    }
  `,
})
export class StateViewComponent {
  readonly kind = input.required<StateKind>();
  readonly title = input("");
  readonly description = input("");
  readonly actionLabel = input("");
  readonly rows = input<number[]>([0, 1, 2, 3, 4]);
  readonly action = output<void>();
  readonly retry = output<void>();
}

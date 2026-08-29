import { Component, input } from "@angular/core";

/** Cabeçalho padrão das páginas internas: título, descrição e ações. */
@Component({
  selector: "app-page-header",
  standalone: true,
  template: `
    <header class="phead arrive">
      <div class="phead__text">
        <h1 class="phead__title">{{ title() }}</h1>
        <p class="phead__desc">{{ description() }}</p>
      </div>
      <div class="phead__actions">
        <ng-content select="[actions]"></ng-content>
      </div>
    </header>
  `,
  styles: `
    :host {
      display: block;
    }

    .phead {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 26px;
    }

    .phead__title {
      margin: 0;
      font-family: var(--nessa-font-display);
      font-size: clamp(24px, 3.2vw, 30px);
      font-weight: 650;
      letter-spacing: -0.02em;
      line-height: 1.15;
      color: var(--nessa-text);
    }

    .phead__desc {
      margin: 7px 0 0;
      max-width: 62ch;
      font-size: 14px;
      line-height: 1.6;
      color: var(--nessa-text-muted);
    }

    .phead__actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  `,
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}

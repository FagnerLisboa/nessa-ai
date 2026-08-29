import { Component, signal } from "@angular/core";

import { PageHeaderComponent } from "../../shared/components/page-header.component";

const FILTERS = ["Tudo", "Notícias", "Acadêmico", "Código"];

@Component({
  selector: "app-research-page",
  standalone: true,
  imports: [PageHeaderComponent],
  template: `
    <section class="page">
      <app-page-header title="Pesquisa" description="Pesquise na web e obtenha respostas com fontes."></app-page-header>

      <form class="searchrow arrive" style="animation-delay: 60ms" (ngSubmit)="search()">
        <label class="visually-hidden" for="research-query">Pesquisar na web</label>
        <div class="searchrow__field">
          <svg class="searchrow__icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="6" />
            <path d="m19.5 19.5-4-4" />
          </svg>
          <input
            id="research-query"
            class="input searchrow__input"
            type="text"
            placeholder="O que você quer descobrir?"
            [value]="query()"
            (input)="onQuery($event)"
          />
        </div>
        <button type="submit" class="btn btn--primary" [disabled]="query().trim().length === 0">Pesquisar</button>
      </form>

      <div class="filters arrive" style="animation-delay: 100ms" role="group" aria-label="Filtros de pesquisa">
        @for (filter of filters; track filter) {
          <button
            type="button"
            class="chip"
            [class.is-on]="activeFilter() === filter"
            [attr.aria-pressed]="activeFilter() === filter"
            (click)="activeFilter.set(filter)"
          >
            {{ filter }}
          </button>
        }
      </div>

      <div class="results arrive" style="animation-delay: 140ms">
        @if (searched()) {
          <div class="connect panel panel--soft" role="status">
            <span class="connect__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="8.2" />
                <path d="M12 11v5M12 7.8v.2" />
              </svg>
            </span>
            <div class="connect__text">
              <p class="connect__title">A pesquisa na web será conectada nas próximas etapas.</p>
              <p class="connect__desc">
                Resultados com síntese e citações de fontes aparecem aqui assim que o motor estiver ativo.
              </p>
            </div>
          </div>
        } @else {
          <div class="hint panel panel--soft">
            <span class="hint__ghost" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="8.2" />
                <path d="m15.2 8.8-1.8 4.6-4.6 1.8 1.8-4.6Z" />
              </svg>
            </span>
            <p class="hint__title">Comece uma pesquisa</p>
            <p class="hint__desc">A NESSA varre as fontes, cruza as informações e devolve uma resposta com referências.</p>
          </div>
        }

        <div class="sources">
          <p class="u-eyebrow sources__title">Fontes</p>
          <div class="panel panel--soft sources__empty">
            <p class="sources__hint">As referências consultadas aparecem aqui.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
    }

    .searchrow {
      display: flex;
      gap: 10px;
      align-items: stretch;
      margin-bottom: 16px;
    }

    .searchrow__field {
      position: relative;
      flex: 1;
    }

    .searchrow__icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--nessa-text-muted);
      pointer-events: none;
    }

    .searchrow__input {
      padding-left: 38px;
      height: 42px;
      font-size: 14px;
    }

    .searchrow .btn {
      height: 42px;
    }

    .filters {
      display: flex;
      gap: 7px;
      flex-wrap: wrap;
      margin-bottom: 22px;
    }

    .connect {
      display: flex;
      align-items: flex-start;
      gap: 14px;
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

    .hint {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 6px;
      padding: 44px 24px;
    }

    .hint__ghost {
      color: var(--nessa-text-muted);
      opacity: 0.6;
      margin-bottom: 6px;
    }

    .hint__title {
      margin: 0;
      font-family: var(--nessa-font-display);
      font-size: 16px;
      font-weight: 650;
      color: var(--nessa-text);
    }

    .hint__desc {
      margin: 0;
      max-width: 46ch;
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--nessa-text-muted);
    }

    .sources {
      margin-top: 28px;
    }

    .sources__title {
      margin-bottom: 12px;
    }

    .sources__empty {
      padding: 22px;
    }

    .sources__hint {
      margin: 0;
      font-size: 13px;
      color: var(--nessa-text-muted);
    }
  `,
})
export class ResearchPage {
  protected readonly filters = FILTERS;
  protected readonly query = signal("");
  protected readonly activeFilter = signal("Tudo");
  protected readonly searched = signal(false);

  protected onQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected search(): void {
    if (this.query().trim().length === 0) return;
    this.searched.set(true);
  }
}

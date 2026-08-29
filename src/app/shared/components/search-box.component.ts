import { Component, input, output } from "@angular/core";

/** Campo de pesquisa com ícone e botão de limpar. */
@Component({
  selector: "app-search-box",
  standalone: true,
  template: `
    <div class="search">
      <svg
        class="search__icon"
        viewBox="0 0 24 24"
        width="15"
        height="15"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="6" />
        <path d="m19.5 19.5-4-4" />
      </svg>

      <input
        class="input search__input"
        type="text"
        [placeholder]="placeholder()"
        [value]="value()"
        [attr.aria-label]="placeholder()"
        (input)="onInput($event)"
      />

      @if (value().length > 0) {
        <button type="button" class="search__clear" (click)="clear()" aria-label="Limpar pesquisa">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round">
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      }
    </div>
  `,
  styles: `
    :host {
      display: block;
    }

    .search {
      position: relative;
      width: 100%;
    }

    .search__icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--nessa-text-muted);
      pointer-events: none;
    }

    .search__input {
      padding-left: 36px;
      padding-right: 34px;
    }

    .search__clear {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      display: grid;
      place-items: center;
      width: 26px;
      height: 26px;
      border: 0;
      border-radius: var(--radius-xs);
      background: transparent;
      color: var(--nessa-text-muted);
      cursor: pointer;
      transition: background var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
    }

    .search__clear:hover {
      background: var(--nessa-surface-hover);
      color: var(--nessa-text);
    }
  `,
})
export class SearchBoxComponent {
  readonly value = input("");
  readonly placeholder = input("Pesquisar");
  readonly valueChange = output<string>();

  protected onInput(event: Event): void {
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  protected clear(): void {
    this.valueChange.emit("");
  }
}

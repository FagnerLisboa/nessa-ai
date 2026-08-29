import { Component, ElementRef, HostListener, input, output, signal } from "@angular/core";

export interface MenuAction {
  id: string;
  label: string;
  danger?: boolean;
}

/** Menu de ações (⋯) — fecha com Esc, clique fora ou seleção. */
@Component({
  selector: "app-action-menu",
  standalone: true,
  template: `
    <div class="menu-wrap">
      <button
        type="button"
        class="menu__trigger"
        (click)="toggle()"
        aria-haspopup="menu"
        [attr.aria-expanded]="open()"
        [attr.aria-label]="ariaLabel()"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.6" />
          <circle cx="12" cy="12" r="1.6" />
          <circle cx="19" cy="12" r="1.6" />
        </svg>
      </button>

      @if (open()) {
        <div class="menu__panel" role="menu">
          @for (action of actions(); track action.id) {
            <button
              type="button"
              role="menuitem"
              class="menu__item"
              [class.is-danger]="action.danger"
              (click)="pick(action.id)"
            >
              {{ action.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .menu-wrap {
      position: relative;
    }

    .menu__trigger {
      display: grid;
      place-items: center;
      width: 30px;
      height: 30px;
      border: 0;
      border-radius: var(--radius-xs);
      background: transparent;
      color: var(--nessa-text-muted);
      cursor: pointer;
      transition: background var(--t-fast) var(--ease-out), color var(--t-fast) var(--ease-out);
    }

    .menu__trigger:hover {
      background: var(--nessa-surface-hover);
      color: var(--nessa-text);
    }

    .menu__panel {
      position: absolute;
      right: 0;
      top: calc(100% + 6px);
      z-index: 60;
      min-width: 168px;
      padding: 5px;
      border: 1px solid var(--nessa-hairline);
      border-radius: var(--radius-md);
      background: var(--nessa-surface-2);
      box-shadow: var(--shadow-pop);
      animation: menu-pop 0.16s var(--ease-out) both;
    }

    @keyframes menu-pop {
      from { opacity: 0; transform: translateY(5px) scale(0.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .menu__item {
      display: block;
      width: 100%;
      padding: 8px 11px;
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

    .menu__item:hover {
      background: var(--nessa-surface-hover);
    }

    .menu__item.is-danger {
      color: var(--nessa-danger);
    }

    /* Mobile: o painel nunca toca as bordas da viewport. */
    @media (max-width: 479.98px) {
      .menu__panel {
        max-width: calc(100vw - 32px);
      }
    }
  `,
})
export class ActionMenuComponent {
  readonly actions = input.required<MenuAction[]>();
  readonly ariaLabel = input("Ações");
  readonly action = output<string>();

  protected readonly open = signal(false);

  constructor(private readonly host: ElementRef<HTMLElement>) {}

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected pick(id: string): void {
    this.open.set(false);
    this.action.emit(id);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) return;
    const target = event.target;
    if (target instanceof Node && !this.host.nativeElement.contains(target)) {
      this.open.set(false);
    }
  }

  @HostListener("document:keydown.escape")
  onEscape(): void {
    this.open.set(false);
  }
}

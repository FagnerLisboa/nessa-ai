import { Component, input, output } from "@angular/core";

export interface SegmentedOption {
  value: string;
  label: string;
}

/** Interruptor (switch) acessível com rótulo e descrição. */
@Component({
  selector: "app-toggle",
  standalone: true,
  template: `
    <button
      type="button"
      class="toggle"
      role="switch"
      [attr.aria-checked]="checked()"
      (click)="checkedChange.emit(!checked())"
    >
      <span class="toggle__text">
        <span class="toggle__label">{{ label() }}</span>
        @if (description(); as desc) {
          <span class="toggle__desc">{{ desc }}</span>
        }
      </span>
      <span class="toggle__track" [class.is-on]="checked()">
        <span class="toggle__thumb"></span>
      </span>
    </button>
  `,
  styles: `
    .toggle {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      width: 100%;
      padding: 10px 2px;
      border: 0;
      background: transparent;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
    }

    .toggle__text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .toggle__label {
      font-size: 13.5px;
      font-weight: 600;
      color: var(--nessa-text);
    }

    .toggle__desc {
      font-size: 12.5px;
      line-height: 1.5;
      color: var(--nessa-text-muted);
    }

    .toggle__track {
      position: relative;
      width: 40px;
      height: 22px;
      flex: none;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-full);
      background: var(--nessa-surface-2);
      transition: background var(--t-base) var(--ease-out), border-color var(--t-base) var(--ease-out);
    }

    .toggle__track.is-on {
      background: var(--nessa-primary);
      border-color: var(--nessa-primary);
    }

    .toggle__thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--nessa-text);
      box-shadow: var(--shadow-xs);
      transition: transform var(--t-base) var(--ease-spring);
    }

    .toggle__track.is-on .toggle__thumb {
      transform: translateX(18px);
    }
  `,
})
export class ToggleComponent {
  readonly checked = input(false);
  readonly label = input.required<string>();
  readonly description = input("");
  readonly checkedChange = output<boolean>();
}

/** Controle segmentado para opções exclusivas. */
@Component({
  selector: "app-segmented",
  standalone: true,
  template: `
    <div class="seg" role="radiogroup" [attr.aria-label]="ariaLabel()">
      @for (option of options(); track option.value) {
        <button
          type="button"
          class="seg__opt"
          role="radio"
          [attr.aria-checked]="option.value === value()"
          (click)="valueChange.emit(option.value)"
        >
          {{ option.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .seg {
      display: inline-flex;
      width: 100%;
      padding: 4px;
      border: 1px solid var(--nessa-border);
      border-radius: var(--radius-sm);
      background: var(--nessa-surface-2);
    }

    .seg__opt {
      flex: 1;
      padding: 7px 12px;
      border: 0;
      border-radius: 6px;
      background: transparent;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 600;
      color: var(--nessa-text-muted);
      cursor: pointer;
      transition: color var(--t-fast) var(--ease-out), background var(--t-fast) var(--ease-out);
    }

    .seg__opt:hover {
      color: var(--nessa-text);
    }

    .seg__opt[aria-checked="true"] {
      background: var(--nessa-surface-hover);
      color: var(--nessa-text);
      box-shadow: var(--shadow-xs);
    }
  `,
})
export class SegmentedComponent {
  readonly options = input.required<SegmentedOption[]>();
  readonly value = input.required<string>();
  readonly ariaLabel = input("Opções");
  readonly valueChange = output<string>();
}

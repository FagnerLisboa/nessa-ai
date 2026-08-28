/* ============================================================
   NESSA AI — Controles de formulário (shared/ui)
   Base do Reactive Forms da plataforma (Etapa 1: preferências).
   ============================================================ */
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { cn } from "../../core/utils";

/* ---------- Field (label + erro + hint) ---------- */

interface FieldProps {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string | null;
  children: ReactNode;
}

export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-[var(--nessa-text)]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-[12px] font-medium text-[var(--nessa-danger)]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-[var(--nessa-text-muted)]">{hint}</p>
      ) : null}
    </div>
  );
}

/* ---------- TextInput ---------- */

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export function TextInput({ invalid = false, className, ...rest }: TextInputProps) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-[var(--radius-sm)] border bg-[var(--nessa-surface-2)] px-3 text-[13.5px] text-[var(--nessa-text)] shadow-[var(--shadow-inset)] outline-none transition-colors duration-[var(--t-fast)] placeholder:text-[var(--nessa-text-muted)]/70 focus:border-[var(--nessa-accent)]",
        invalid ? "border-[var(--nessa-danger)]" : "border-[var(--nessa-border)]",
        className,
      )}
      {...rest}
    />
  );
}

/* ---------- SelectInput ---------- */

interface SelectInputProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export function SelectInput({ options, className, ...rest }: SelectInputProps) {
  return (
    <select
      className={cn(
        "h-10 w-full appearance-none rounded-[var(--radius-sm)] border border-[var(--nessa-border)] bg-[var(--nessa-surface-2)] px-3 text-[13.5px] text-[var(--nessa-text)] shadow-[var(--shadow-inset)] outline-none transition-colors duration-[var(--t-fast)] focus:border-[var(--nessa-accent)]",
        className,
      )}
      {...rest}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

/* ---------- Toggle ---------- */

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex w-full items-center justify-between gap-4 rounded-[var(--radius-sm)] px-1 py-1 text-left"
    >
      {(label || description) && (
        <span className="flex flex-col">
          {label && <span className="text-[13px] font-semibold text-[var(--nessa-text)]">{label}</span>}
          {description && <span className="text-[12px] text-[var(--nessa-text-muted)]">{description}</span>}
        </span>
      )}
      <span
        className={cn(
          "relative h-[22px] w-[40px] flex-none rounded-full border transition-colors duration-[var(--t-base)] ease-[var(--ease-out)]",
          checked
            ? "border-[var(--nessa-primary)] bg-[var(--nessa-primary)]"
            : "border-[var(--nessa-border)] bg-[var(--nessa-surface-2)] group-hover:border-[var(--nessa-text-muted)]",
        )}
      >
        <span
          className={cn(
            "absolute top-[2px] left-[2px] h-[16px] w-[16px] rounded-full bg-[var(--nessa-text)] shadow-[var(--shadow-xs)] transition-transform duration-[var(--t-base)] ease-[var(--ease-spring)]",
            checked && "translate-x-[18px]",
          )}
        />
      </span>
    </button>
  );
}

/* ---------- Segmented ---------- */

interface SegmentedProps<T extends string> {
  value: T;
  onChange: (next: T) => void;
  options: Array<{ value: T; label: string }>;
}

export function Segmented<T extends string>({ value, onChange, options }: SegmentedProps<T>) {
  return (
    <div className="inline-flex w-full rounded-[var(--radius-sm)] border border-[var(--nessa-border)] bg-[var(--nessa-surface-2)] p-1 shadow-[var(--shadow-inset)]">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex-1 rounded-[6px] px-3 py-1.5 text-[12.5px] font-semibold transition-all duration-[var(--t-fast)] ease-[var(--ease-out)]",
              active
                ? "bg-[var(--nessa-surface-hover)] text-[var(--nessa-text)] shadow-[var(--shadow-xs)]"
                : "text-[var(--nessa-text-muted)] hover:text-[var(--nessa-text)]",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

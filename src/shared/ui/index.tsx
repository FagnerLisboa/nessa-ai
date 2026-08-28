/* ============================================================
   NESSA AI — Primitivos de UI (shared/ui)
   Estilizados exclusivamente com tokens do design system.
   ============================================================ */
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../core/utils";

/* ---------- Button ---------- */

type ButtonVariant = "primary" | "outline" | "ghost" | "subtle";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md";
}

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--nessa-primary)] text-[var(--nessa-text)] shadow-[var(--shadow-sm)] hover:bg-[var(--nessa-primary-hover)] hover:shadow-[var(--shadow-glow)]",
  outline:
    "border border-[var(--nessa-border)] bg-transparent text-[var(--nessa-text)] hover:border-[var(--nessa-accent)] hover:bg-[var(--nessa-surface-hover)]",
  ghost:
    "bg-transparent text-[var(--nessa-text-muted)] hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]",
  subtle:
    "bg-[var(--nessa-surface-2)] text-[var(--nessa-text)] border border-[var(--nessa-hairline)] hover:bg-[var(--nessa-surface-hover)]",
};

export function Button({ variant = "primary", size = "md", className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] font-semibold transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45",
        size === "sm" ? "h-8 px-3 text-[12.5px]" : "h-10 px-4 text-[13.5px]",
        BUTTON_VARIANTS[variant],
        className,
      )}
      {...rest}
    />
  );
}

/* ---------- Badge ---------- */

type BadgeTone = "neutral" | "primary" | "success" | "warning" | "danger";

const BADGE_TONES: Record<BadgeTone, { chip: string; dot: string }> = {
  neutral: {
    chip: "bg-[var(--nessa-surface-2)] text-[var(--nessa-text-muted)] border-[var(--nessa-hairline)]",
    dot: "bg-[var(--nessa-text-muted)]",
  },
  primary: {
    chip: "bg-[var(--nessa-primary-soft)] text-[var(--nessa-accent)] border-[var(--nessa-primary-ring)]",
    dot: "bg-[var(--nessa-accent)]",
  },
  success: {
    chip: "bg-[var(--nessa-success-soft)] text-[var(--nessa-success)] border-[rgba(34,197,94,0.3)]",
    dot: "bg-[var(--nessa-success)]",
  },
  warning: {
    chip: "bg-[var(--nessa-warning-soft)] text-[var(--nessa-warning)] border-[rgba(245,158,11,0.3)]",
    dot: "bg-[var(--nessa-warning)]",
  },
  danger: {
    chip: "bg-[var(--nessa-danger-soft)] text-[var(--nessa-danger)] border-[rgba(239,68,68,0.3)]",
    dot: "bg-[var(--nessa-danger)]",
  },
};

interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", dot = false, pulse = false, children, className }: BadgeProps) {
  const t = BADGE_TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px] font-semibold tracking-wide",
        t.chip,
        className,
      )}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", t.dot)} />}
          <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", t.dot)} />
        </span>
      )}
      {children}
    </span>
  );
}

/* ---------- Kbd ---------- */

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-[20px] min-w-[20px] items-center justify-center rounded-[5px] border border-[var(--nessa-border)] bg-[var(--nessa-surface-2)] px-1.5 font-sans text-[10.5px] font-semibold text-[var(--nessa-text-muted)] shadow-[var(--shadow-inset)]">
      {children}
    </kbd>
  );
}

/* ---------- Chip (valores técnicos) ---------- */

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <code
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] px-2 py-0.5 font-mono text-[11.5px] text-[var(--nessa-text-muted)]",
        className,
      )}
    >
      {children}
    </code>
  );
}

/* ---------- SectionHeading ---------- */

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  aside?: ReactNode;
}

export function SectionHeading({ eyebrow, title, aside }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="u-label mb-1.5">{eyebrow}</p>
        <h2 className="font-display text-lg font-bold tracking-tight text-[var(--nessa-text)]">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

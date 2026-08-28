/* ============================================================
   NESSA AI — Identidade (shared/components)
   A borboleta: símbolo minimalista e tecnológico da marca.
   ============================================================ */
import { useId } from "react";
import { cn } from "../../core/utils";

interface ButterflyMarkProps {
  size?: number;
  className?: string;
  /** Asas "respiram" suavemente quando ativo. */
  alive?: boolean;
}

export function ButterflyMark({ size = 24, className, alive = false }: ButterflyMarkProps) {
  const gradientId = useId();
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--nessa-primary)" />
          <stop offset="1" stopColor="var(--nessa-accent)" />
        </linearGradient>
      </defs>
      <g
        style={
          alive
            ? { transformOrigin: "24px 24px", animation: "nessa-wing 3.2s var(--ease-out) infinite" }
            : undefined
        }
      >
        <g fill={`url(#${gradientId})`}>
          <path d="M22.6 20.5C16.5 8.5 5.5 5.5 4.6 12.6 3.8 18.9 12 23.6 22.6 23.4Z" opacity="0.96" />
          <path d="M25.4 20.5C31.5 8.5 42.5 5.5 43.4 12.6 44.2 18.9 36 23.6 25.4 23.4Z" opacity="0.96" />
          <path d="M22.6 25.6C13.5 25 7.5 30 10 36.2 12.3 41.6 20.4 38.6 22.6 30.4Z" opacity="0.78" />
          <path d="M25.4 25.6C34.5 25 40.5 30 38 36.2 35.7 41.6 27.6 38.6 25.4 30.4Z" opacity="0.78" />
        </g>
      </g>
      <rect x="22.7" y="14" width="2.6" height="21" rx="1.3" fill="var(--nessa-text)" opacity="0.92" />
      <circle cx="24" cy="12.4" r="1.9" fill="var(--nessa-text)" opacity="0.92" />
      <path
        d="M22.6 11.5C20.8 8 18.4 6.2 15.8 5.4M25.4 11.5C27.2 8 29.6 6.2 32.2 5.4"
        stroke="var(--nessa-accent)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <circle cx="15.4" cy="5.2" r="1" fill="var(--nessa-accent)" />
      <circle cx="32.6" cy="5.2" r="1" fill="var(--nessa-accent)" />
    </svg>
  );
}

interface WordmarkProps {
  compact?: boolean;
  className?: string;
}

export function Wordmark({ compact = false, className }: WordmarkProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ButterflyMark size={compact ? 22 : 26} alive />
      <span className="sidebar-brand__text inline-flex items-baseline overflow-hidden">
        <span className="font-display text-[15px] font-extrabold tracking-[0.22em] text-[var(--nessa-text)]">
          NESSA
        </span>
        <span className="ml-1.5 rounded-[5px] border border-[var(--nessa-hairline)] bg-[var(--nessa-primary-soft)] px-1 py-px text-[9px] font-bold tracking-[0.18em] text-[var(--nessa-accent)]">
          AI
        </span>
      </span>
    </span>
  );
}

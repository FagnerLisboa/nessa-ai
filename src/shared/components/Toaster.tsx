/* ============================================================
   NESSA AI — Toasts (shared/components)
   Feedback global real, alimentado pelo store de signals.
   ============================================================ */
import type { ToastTone } from "../../core/models";
import { dismissToast, useUi } from "../../core/state/workspace.store";
import { cn } from "../../core/utils";
import { Icon, type IconName } from "./Icons";

const TONE_META: Record<ToastTone, { icon: IconName; accent: string }> = {
  success: { icon: "check", accent: "text-[var(--nessa-success)] bg-[var(--nessa-success-soft)]" },
  info: { icon: "info", accent: "text-[var(--nessa-accent)] bg-[var(--nessa-primary-soft)]" },
  danger: { icon: "alert", accent: "text-[var(--nessa-danger)] bg-[var(--nessa-danger-soft)]" },
};

export function Toaster() {
  const { toasts } = useUi();
  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed right-4 bottom-4 left-4 z-[var(--z-toast)] flex flex-col items-end gap-2 sm:left-auto"
      aria-live="polite"
    >
      {toasts.map((t) => {
        const meta = TONE_META[t.tone];
        return (
          <div
            key={t.id}
            className="toast-anim pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[var(--radius-md)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] p-3.5 shadow-[var(--shadow-md)]"
          >
            <span className={cn("mt-px grid h-7 w-7 flex-none place-items-center rounded-full", meta.accent)}>
              <Icon name={meta.icon} size={14} strokeWidth={2} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-[var(--nessa-text)]">{t.title}</p>
              {t.description && (
                <p className="mt-0.5 text-[12px] leading-relaxed text-[var(--nessa-text-muted)]">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="grid h-6 w-6 flex-none place-items-center rounded-[var(--radius-xs)] text-[var(--nessa-text-muted)] transition-colors hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]"
              aria-label="Fechar notificação"
            >
              <Icon name="close" size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

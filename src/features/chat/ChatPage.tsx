/* ============================================================
   NESSA AI — Chat (features/chat)
   Estado vazio elegante: o motor de IA chega na Etapa 3.
   Nenhuma conversa é simulada.
   ============================================================ */
import { Link } from "react-router-dom";
import { EmptyState } from "../../shared/components/EmptyState";
import { Icon } from "../../shared/components/Icons";

export default function ChatPage() {
  return (
    <EmptyState
      title="Em breve"
      description="A conversa com a NESSA começa quando o motor de IA estiver conectado. Nenhuma resposta é simulada — este espaço permanece honestamente vazio até lá."
    >
      <Link
        to="/"
        className="inline-flex h-9 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--nessa-border)] px-4 text-[13px] font-semibold text-[var(--nessa-text)] transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] hover:border-[var(--nessa-accent)] hover:bg-[var(--nessa-surface-hover)] active:scale-[0.97]"
        aria-label="Voltar para o início"
      >
        <Icon name="arrow-right" size={14} className="rotate-180" />
        Voltar ao início
      </Link>
    </EmptyState>
  );
}

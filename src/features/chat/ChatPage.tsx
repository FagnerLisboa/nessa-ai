/* ============================================================
   NESSA AI — Chat (features/chat)
   Superfície estruturada e honesta: o motor de IA chega na
   Etapa 3. Nenhuma resposta é simulada.
   ============================================================ */
import { useReveal } from "../../shared/directives/hooks";
import { cn } from "../../core/utils";
import { Icon } from "../../shared/components/Icons";
import { EmptyState } from "../../shared/components/EmptyState";
import { Badge, Chip, Kbd } from "../../shared/ui";
import { Button } from "../../shared/ui";

export default function ChatPage() {
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>(0.08);

  return (
    <div className="flex h-full flex-col gap-6">
      <div ref={head.ref} className={cn("reveal", head.shown && "is-visible")}>
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="u-label">Principal</p>
          <span className="h-px w-6 bg-[var(--nessa-border)]" aria-hidden="true" />
          <Badge tone="primary" dot>
            Motor de IA · Etapa 3
          </Badge>
        </div>
        <h1 className="font-display mt-3 text-[clamp(28px,4.5vw,40px)] font-extrabold leading-[1.05] tracking-tight text-[var(--nessa-text)]">
          Chat
        </h1>
        <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-[var(--nessa-text-muted)]">
          A superfície de conversa já está desenhada e roteada. Quando o motor de IA for conectado,
          este espaço exibirá o diálogo em streaming — sem nada simulado antes disso.
        </p>
      </div>

      <div
        ref={body.ref}
        className={cn("reveal flex flex-1 flex-col gap-4", body.shown && "is-visible")}
      >
        <EmptyState
          icon="chat"
          title="Nenhuma conversa ativa"
          description="As mensagens reais começam quando o motor de IA estiver online, na Etapa 3. Até lá, esta área permanece vazia — a NESSA não inventa respostas."
          className="min-h-[34vh] flex-1"
        >
          <Chip>
            <Icon name="lock" size={12} />
            aguardando motor real
          </Chip>
        </EmptyState>

        {/* Composer estruturado (inerte por design nesta etapa) */}
        <div className="rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] shadow-[var(--shadow-sm)] transition-colors duration-[var(--t-base)] focus-within:border-[var(--nessa-primary-ring)]">
          <textarea
            rows={2}
            disabled
            placeholder="Converse com a NESSA…"
            aria-label="Mensagem (disponível na Etapa 3)"
            className="w-full resize-none bg-transparent px-4 pt-3.5 text-[14px] text-[var(--nessa-text)] outline-none placeholder:text-[var(--nessa-text-muted)]/60 disabled:cursor-not-allowed"
          />
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--nessa-hairline)] px-3 py-2.5">
            <Chip>streaming</Chip>
            <Chip>contexto persistente</Chip>
            <Chip>citações</Chip>

            <span className="ml-auto hidden items-center gap-2 text-[11.5px] text-[var(--nessa-text-muted)] sm:flex">
              <Kbd>⏎</Kbd> enviar · disponível na Etapa 3
            </span>

            <Button size="sm" disabled title="Disponível quando o motor de IA for conectado">
              <Icon name="send" size={14} />
              Enviar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

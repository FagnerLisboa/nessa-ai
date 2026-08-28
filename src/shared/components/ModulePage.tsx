/* ============================================================
   NESSA AI — Scaffold de módulo (shared/components)
   Página-base das features em fundação: cabeçalho real do
   registro de módulos + estado vazio honesto + plano do módulo.
   ============================================================ */
import type { ModuleId } from "../../core/models";
import { getModule } from "../../core/models/modules";
import { cn } from "../../core/utils";
import { useReveal } from "../directives/hooks";
import { Badge, Chip } from "../ui";
import { EmptyState } from "./EmptyState";
import { Icon, type IconName } from "./Icons";

interface ModulePageProps {
  moduleId: ModuleId;
}

export function ModulePage({ moduleId }: ModulePageProps) {
  const module = getModule(moduleId);
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-7">
      <div ref={head.ref} className={cn("reveal", head.shown && "is-visible")}>
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="u-label">{module.group}</p>
          <span className="h-px w-6 bg-[var(--nessa-border)]" aria-hidden="true" />
          {module.ready ? (
            <Badge tone="success" dot pulse>
              Base operacional
            </Badge>
          ) : (
            <Badge tone="primary" dot>
              Motor na Etapa {module.stage}
            </Badge>
          )}
        </div>
        <h1 className="font-display mt-3 text-[clamp(28px,4.5vw,40px)] font-extrabold leading-[1.05] tracking-tight text-[var(--nessa-text)]">
          {module.label}
        </h1>
        <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-[var(--nessa-text-muted)]">
          {module.summary}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Chip>
            <Icon name="route" size={12} />
            {module.path}
          </Chip>
          <Chip>lazy-loaded</Chip>
          <Chip>standalone</Chip>
        </div>
      </div>

      <div
        ref={body.ref}
        className={cn("reveal grid gap-5 lg:grid-cols-[1.5fr_1fr]", body.shown && "is-visible")}
      >
        <EmptyState
          icon={module.icon as IconName}
          title={`O espaço de ${module.label.toLowerCase()} está pronto`}
          description="A fundação deste módulo foi registrada no roteador e no design system. Nenhum dado simulado é exibido — o conteúdo real chega quando o motor correspondente for conectado."
        >
          <Badge tone="neutral" dot>
            Aguardando conexão real
          </Badge>
        </EmptyState>

        <aside className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-[var(--card-pad)] shadow-[var(--shadow-xs)]">
          <p className="u-label mb-4">Planejado para este módulo</p>
          <ul className="flex flex-col gap-3">
            {module.capabilities.map((capability) => (
              <li key={capability} className="flex items-start gap-2.5 text-[13.5px] text-[var(--nessa-text)]">
                <span className="mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center rounded-full bg-[var(--nessa-primary-soft)] text-[var(--nessa-accent)]">
                  <Icon name="check" size={11} strokeWidth={2.2} />
                </span>
                {capability}
              </li>
            ))}
          </ul>
          <div className="mt-auto border-t border-[var(--nessa-hairline)] pt-4">
            <p className="text-[12px] leading-relaxed text-[var(--nessa-text-muted)]">
              A estrutura interna já existe — rotas, modelos, serviços e tokens. A complexidade fica
              aqui; a superfície permanece simples.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

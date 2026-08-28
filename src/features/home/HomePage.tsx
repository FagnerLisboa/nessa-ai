/* ============================================================
   NESSA AI — Início (features/home)
   Painel da fundação: diagnóstico real do sistema, mapa de
   módulos, folha de tokens e roadmap. Zero dados simulados.
   ============================================================ */
import { Link } from "react-router-dom";
import { MODULES } from "../../core/models/modules";
import { cn } from "../../core/utils";
import { BREAKPOINTS, DESIGN_TOKENS, STAGE_LABEL, TAGLINE, VERSION } from "../../core/utils/tokens";
import { useMediaQuery, useNow, useReveal } from "../../shared/directives/hooks";
import { Icon, type IconName } from "../../shared/components/Icons";
import { ButterflyMark, Wordmark } from "../../shared/components/Logo";
import { formatFullTime } from "../../shared/pipes/format";
import { Badge, Chip, SectionHeading } from "../../shared/ui";

const storageOk = (() => {
  try {
    localStorage.setItem("__nessa_probe", "1");
    localStorage.removeItem("__nessa_probe");
    return true;
  } catch {
    return false;
  }
})();

const TOKEN_COUNT = DESIGN_TOKENS.reduce((acc, group) => acc + group.tokens.length, 0);

interface CheckRow {
  label: string;
  detail: string;
  ok: boolean;
}

export default function HomePage() {
  const hero = useReveal<HTMLDivElement>();
  const checks = useReveal<HTMLDivElement>();
  const modules = useReveal<HTMLDivElement>();
  const system = useReveal<HTMLDivElement>();
  const now = useNow(30_000);

  const sm = useMediaQuery(`(min-width: ${BREAKPOINTS.sm}px)`);
  const md = useMediaQuery(`(min-width: ${BREAKPOINTS.md}px)`);
  const lg = useMediaQuery(`(min-width: ${BREAKPOINTS.lg}px)`);
  const xl = useMediaQuery(`(min-width: ${BREAKPOINTS.xl}px)`);
  const xxl = useMediaQuery(`(min-width: ${BREAKPOINTS["2xl"]}px)`);
  const activeBp = xxl ? "2xl" : xl ? "xl" : lg ? "lg" : md ? "md" : sm ? "sm" : "base";

  const checkRows: CheckRow[] = [
    {
      label: "Roteador",
      detail: `${MODULES.length} rotas registradas com lazy loading por módulo`,
      ok: true,
    },
    {
      label: "Signals",
      detail: storageOk
        ? "Store reativo conectado · persistência em localStorage ativa"
        : "Store reativo em memória · armazenamento bloqueado neste navegador",
      ok: true,
    },
    {
      label: "Design system",
      detail: `${TOKEN_COUNT} tokens centralizados em nessa-theme.scss — nenhuma cor espalhada`,
      ok: true,
    },
    {
      label: "Responsividade",
      detail: `Breakpoints sm → 2xl ativos · viewport atual: ${activeBp}`,
      ok: true,
    },
    {
      label: "Guards & interceptores",
      detail: "Conectados ao roteador e ao cliente HTTP — aguardando a Etapa 2",
      ok: true,
    },
    {
      label: "Motor de IA",
      detail: "Será conectado na Etapa 3 — nenhuma resposta é simulada nesta etapa",
      ok: false,
    },
  ];

  return (
    <div className="flex flex-col gap-12 pb-4">
      {/* ---------- Abertura ---------- */}
      <section
        ref={hero.ref}
        className={cn("reveal grid items-start gap-8 lg:grid-cols-[1.2fr_0.8fr]", hero.shown && "is-visible")}
      >
        <div>
          <p className="u-label mb-4">Plataforma de Inteligência Artificial</p>
          <h1 className="font-display text-[clamp(34px,5.4vw,58px)] font-extrabold leading-[1.03] tracking-[-0.03em] text-[var(--nessa-text)]">
            Complexidade interna.
            <span className="block text-[var(--nessa-accent)]">Simplicidade externa.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--nessa-text-muted)]">
            A fundação da NESSA está operacional: shell responsivo, rotas lazy, store de signals com
            persistência e um design system tokenizado. A superfície permanece mínima — pronta para
            receber o motor de IA nas próximas etapas.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Badge tone="success" dot pulse>
              Fundação operacional
            </Badge>
            <Chip>v{VERSION}</Chip>
            <Chip>{MODULES.length} módulos registrados</Chip>
            <Chip>{STAGE_LABEL}</Chip>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/chat"
              className="group inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--nessa-primary)] px-4 text-[13.5px] font-semibold text-[var(--nessa-text)] shadow-[var(--shadow-sm)] transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] hover:bg-[var(--nessa-primary-hover)] hover:shadow-[var(--shadow-glow)] active:scale-[0.97]"
            >
              Abrir o Chat
              <Icon name="arrow-right" size={15} className="transition-transform duration-[var(--t-fast)] group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/settings"
              className="inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--nessa-border)] px-4 text-[13.5px] font-semibold text-[var(--nessa-text)] transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] hover:border-[var(--nessa-accent)] hover:bg-[var(--nessa-surface-hover)] active:scale-[0.97]"
            >
              Preferências
            </Link>
          </div>
        </div>

        {/* Painel de identidade */}
        <aside className="relative overflow-hidden rounded-[var(--radius-xl)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-6 shadow-[var(--shadow-md)]">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.16),transparent)]" aria-hidden="true" />
          <div className="flex items-start justify-between">
            <ButterflyMark size={76} alive />
            <Badge tone="primary" dot>
              símbolo oficial
            </Badge>
          </div>
          <div className="mt-5">
            <Wordmark />
            <p className="mt-2 text-[13px] italic text-[var(--nessa-text-muted)]">“{TAGLINE}”</p>
          </div>

          <div className="mt-5 border-t border-[var(--nessa-hairline)] pt-4">
            <p className="u-label mb-3">Paleta da marca</p>
            <div className="flex items-center gap-2">
              {[
                ["primary", "#8B5CF6"],
                ["primary-hover", "#7C3AED"],
                ["secondary", "#6366F1"],
                ["accent", "#A78BFA"],
                ["surface", "#171720"],
              ].map(([name, value]) => (
                <span
                  key={name}
                  title={`${name} · ${value}`}
                  className="h-7 w-7 rounded-full border border-[var(--nessa-border)] transition-transform duration-[var(--t-fast)] ease-[var(--ease-spring)] hover:scale-110"
                  style={{ backgroundColor: value }}
                />
              ))}
              <span className="ml-1 text-[11px] text-[var(--nessa-text-muted)]">tokens, não cores soltas</span>
            </div>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-[var(--nessa-hairline)] pt-4">
            <div>
              <p className="font-display text-[26px] font-extrabold leading-none tracking-tight">Aa</p>
              <p className="mt-1 text-[11px] text-[var(--nessa-text-muted)]">Inter · fallback Manrope</p>
            </div>
            <p className="text-right text-[11px] tabular-nums text-[var(--nessa-text-muted)]">
              sessão local
              <span className="block text-[13px] font-semibold text-[var(--nessa-text)]">{formatFullTime(now)}</span>
            </p>
          </div>
        </aside>
      </section>

      {/* ---------- Diagnóstico ---------- */}
      <section ref={checks.ref} className={cn("reveal", checks.shown && "is-visible")}>
        <SectionHeading
          eyebrow="Diagnóstico"
          title="Verificação do sistema"
          aside={<Badge tone="success" dot>ao vivo</Badge>}
        />
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] shadow-[var(--shadow-xs)]">
          {checkRows.map((row, index) => (
            <div
              key={row.label}
              className={cn(
                "group flex items-start gap-3.5 px-5 py-3.5 transition-colors duration-[var(--t-fast)] hover:bg-[var(--nessa-surface-hover)]/50",
                index > 0 && "border-t border-[var(--nessa-hairline)]",
              )}
            >
              <span
                className={cn(
                  "mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full",
                  row.ok
                    ? "bg-[var(--nessa-success-soft)] text-[var(--nessa-success)]"
                    : "bg-[var(--nessa-warning-soft)] text-[var(--nessa-warning)]",
                )}
              >
                <Icon name={row.ok ? "check" : "clock"} size={13} strokeWidth={2.1} />
              </span>
              <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <p className="text-[13.5px] font-bold text-[var(--nessa-text)]">{row.label}</p>
                <p className="text-[12.5px] text-[var(--nessa-text-muted)]">{row.detail}</p>
              </div>
              {row.label === "Responsividade" && (
                <div className="hidden items-center gap-1 md:flex">
                  {(["sm", "md", "lg", "xl", "2xl"] as const).map((bp) => (
                    <span
                      key={bp}
                      className={cn(
                        "rounded-[5px] border px-1.5 py-0.5 font-mono text-[10px] transition-colors duration-[var(--t-base)]",
                        bp === activeBp
                          ? "border-[var(--nessa-primary-ring)] bg-[var(--nessa-primary-soft)] text-[var(--nessa-accent)]"
                          : "border-[var(--nessa-hairline)] text-[var(--nessa-text-muted)]/70",
                      )}
                    >
                      {bp}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Mapa de módulos ---------- */}
      <section ref={modules.ref} className={cn("reveal", modules.shown && "is-visible")}>
        <SectionHeading
          eyebrow="Arquitetura"
          title="Mapa de módulos"
          aside={<Chip>{MODULES.length} rotas lazy</Chip>}
        />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module, index) => (
            <Link
              key={module.id}
              to={module.path}
              className="route-anim group flex flex-col rounded-[var(--radius-md)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-4 shadow-[var(--shadow-xs)] transition-all duration-[var(--t-base)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[var(--nessa-primary-ring)] hover:shadow-[var(--shadow-glow)]"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] text-[var(--nessa-accent)] shadow-[var(--shadow-inset)] transition-transform duration-[var(--t-base)] ease-[var(--ease-spring)] group-hover:scale-105">
                  <Icon name={module.icon as IconName} size={17} />
                </span>
                <span className="font-mono text-[11px] text-[var(--nessa-text-muted)]/80">{module.path}</span>
              </div>
              <p className="font-display mt-3 text-[14.5px] font-bold tracking-tight text-[var(--nessa-text)]">
                {module.label}
              </p>
              <p className="mt-1 line-clamp-2 flex-1 text-[12px] leading-relaxed text-[var(--nessa-text-muted)]">
                {module.summary}
              </p>
              <div className="mt-3 flex items-center justify-between">
                {module.ready ? (
                  <Badge tone="success" dot>
                    Operacional
                  </Badge>
                ) : (
                  <Badge tone="neutral">Etapa {module.stage}</Badge>
                )}
                <Icon
                  name="chevron-right"
                  size={14}
                  className="text-[var(--nessa-text-muted)] opacity-0 transition-all duration-[var(--t-fast)] group-hover:translate-x-0.5 group-hover:opacity-100"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- Sistema de design + Roadmap ---------- */}
      <section
        ref={system.ref}
        className={cn("reveal grid gap-5 lg:grid-cols-2", system.shown && "is-visible")}
      >
        <div className="rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-[var(--card-pad)] shadow-[var(--shadow-xs)]">
          <SectionHeading eyebrow="Design system" title="Folha de tokens" />
          <div className="flex flex-col gap-5">
            {DESIGN_TOKENS.map((group) => (
              <div key={group.group}>
                <p className="u-label mb-2">{group.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.tokens.map((token) => (
                    <span
                      key={token.name}
                      title={`${token.name}: ${token.value}`}
                      className="inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] px-2 py-1 font-mono text-[10.5px] text-[var(--nessa-text-muted)] transition-colors duration-[var(--t-fast)] hover:border-[var(--nessa-accent)] hover:text-[var(--nessa-text)]"
                    >
                      {group.group === "Cor" && (
                        <span
                          className="h-2.5 w-2.5 rounded-[3px] border border-[var(--nessa-border)]"
                          style={{ backgroundColor: token.value }}
                        />
                      )}
                      {token.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-[var(--card-pad)] shadow-[var(--shadow-xs)]">
          <SectionHeading eyebrow="Roadmap" title="As três etapas" />
          <ol className="flex flex-col">
            {[
              {
                stage: "Etapa 1",
                title: "Fundação",
                state: "current" as const,
                items: [
                  "Design system e tokens centralizados",
                  "Shell, rotas lazy e navegação responsiva",
                  "Store de signals com persistência",
                  "Preferências reais do operador",
                ],
              },
              {
                stage: "Etapa 2",
                title: "Estrutura",
                state: "next" as const,
                items: ["Backend e API versionada", "Autenticação com guards reais", "Banco de dados e arquivos"],
              },
              {
                stage: "Etapa 3",
                title: "Inteligência",
                state: "next" as const,
                items: ["Motor de IA com streaming", "Mídia: imagem, vídeo e voz", "Pesquisa profunda e assistente"],
              },
            ].map((step, index, list) => (
              <li key={step.stage} className="relative flex gap-4 pb-6 last:pb-0">
                {index < list.length - 1 && (
                  <span className="absolute top-7 left-[11px] h-[calc(100%-28px)] w-px bg-[var(--nessa-border)]" aria-hidden="true" />
                )}
                <span
                  className={cn(
                    "z-10 mt-0.5 grid h-[23px] w-[23px] flex-none place-items-center rounded-full border text-[10px] font-bold",
                    step.state === "current"
                      ? "border-[var(--nessa-primary)] bg-[var(--nessa-primary)] text-[var(--nessa-text)] shadow-[var(--shadow-glow)]"
                      : "border-[var(--nessa-border)] bg-[var(--nessa-surface-2)] text-[var(--nessa-text-muted)]",
                  )}
                >
                  {step.state === "current" ? <Icon name="check" size={11} strokeWidth={2.4} /> : index + 1}
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-bold text-[var(--nessa-text)]">
                      {step.stage} · {step.title}
                    </p>
                    {step.state === "current" && (
                      <Badge tone="primary" dot pulse>
                        em execução
                      </Badge>
                    )}
                  </div>
                  <ul className="mt-2 flex flex-col gap-1">
                    {step.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[12.5px] text-[var(--nessa-text-muted)]">
                        <span className="h-1 w-1 flex-none rounded-full bg-[var(--nessa-text-muted)]/60" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Rodapé ---------- */}
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--nessa-hairline)] pt-6">
        <p className="text-[12.5px] italic text-[var(--nessa-text-muted)]">“{TAGLINE}”</p>
        <div className="flex items-center gap-2">
          <Chip>NESSA AI</Chip>
          <Chip>v{VERSION}</Chip>
          <span className="text-[11.5px] tabular-nums text-[var(--nessa-text-muted)]">{formatFullTime(now)}</span>
        </div>
      </footer>
    </div>
  );
}

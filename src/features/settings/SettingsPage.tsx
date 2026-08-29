/* ============================================================
   NESSA AI — Configurações (features/settings)
   Formulário reativo com validação, estado touched/dirty e
   persistência real via store de signals + localStorage.
   ============================================================ */
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { SettingsState } from "../../core/models";
import {
  DEFAULT_SETTINGS,
  resetSettings,
  toast,
  updateSettings,
  useOperatorName,
  useSettings,
} from "../../core/state/workspace.store";
import { cn } from "../../core/utils";
import { STORAGE_KEYS } from "../../core/utils/tokens";
import { useReveal } from "../../shared/directives/hooks";
import { Icon } from "../../shared/components/Icons";
import { initials, formatFullTime } from "../../shared/pipes/format";
import { Badge, Button, Chip, SectionHeading } from "../../shared/ui";
import { Field, Segmented, SelectInput, TextInput, Toggle } from "../../shared/ui/controls";

interface FormErrors {
  displayName?: string;
  role?: string;
}

function validate(form: SettingsState): FormErrors {
  const errors: FormErrors = {};
  const name = form.displayName.trim();
  if (name.length > 0 && name.length < 2) errors.displayName = "Use ao menos 2 caracteres.";
  if (name.length > 40) errors.displayName = "Máximo de 40 caracteres.";
  if (form.role.trim().length > 48) errors.role = "Máximo de 48 caracteres.";
  return errors;
}

export default function SettingsPage() {
  const settings = useSettings();
  const operatorNameValue = useOperatorName();
  const head = useReveal<HTMLDivElement>();
  const body = useReveal<HTMLDivElement>(0.06);

  const [form, setForm] = useState<SettingsState>(settings);
  const [touched, setTouched] = useState<{ displayName?: boolean; role?: boolean }>({});
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const errors = useMemo(() => validate(form), [form]);
  const dirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(settings), [form, settings]);
  const differsFromDefault = useMemo(
    () => JSON.stringify(settings) !== JSON.stringify(DEFAULT_SETTINGS),
    [settings],
  );
  const canSave = dirty && Object.keys(errors).length === 0;

  const set = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setTouched({ displayName: true, role: true });
    if (!canSave) {
      if (Object.keys(errors).length > 0) {
        toast("Revise os campos destacados", "danger", "Há valores fora das regras de validação.");
      }
      return;
    }
    updateSettings({ ...form, displayName: form.displayName.trim(), role: form.role.trim() });
    const moment = new Date();
    setSavedAt(moment);
    toast("Preferências salvas", "success", "Persistidas localmente neste navegador.");
  }

  function handleReset() {
    resetSettings();
    setTouched({});
    setSavedAt(null);
    toast("Padrão restaurado", "info", "As preferências voltaram ao estado original.");
  }

  return (
    <div className="flex flex-col gap-7">
      <div ref={head.ref} className={cn("reveal", head.shown && "is-visible")}>
        <div className="flex flex-wrap items-center gap-2.5">
          <p className="u-label">Sistema</p>
          <span className="h-px w-6 bg-[var(--nessa-border)]" aria-hidden="true" />
          <Badge tone="success" dot pulse>
            persistência ativa
          </Badge>
        </div>
        <h1 className="font-display mt-3 text-[clamp(28px,4.5vw,40px)] font-extrabold leading-[1.05] tracking-tight text-[var(--nessa-text)]">
          Configurações
        </h1>
        <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-[var(--nessa-text-muted)]">
          Preferências do operador e da interface. Tudo é validado como um formulário reativo e
          persistido neste navegador — recarregue a página para confirmar.
        </p>
      </div>

      <div
        ref={body.ref}
        className={cn("reveal grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]", body.shown && "is-visible")}
      >
        {/* ---------- Formulário ---------- */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] shadow-[var(--shadow-xs)]"
        >
          <div className="border-b border-[var(--nessa-hairline)] px-[var(--card-pad)] py-4">
            <SectionHeading eyebrow="Perfil" title="Operador" />
          </div>

          <div className="flex flex-col gap-5 px-[var(--card-pad)] py-6">
            <Field
              label="Nome de exibição"
              htmlFor="nessa-name"
              error={touched.displayName ? errors.displayName : null}
              hint="Como a plataforma se refere a você. Mínimo de 2 caracteres."
            >
              <TextInput
                id="nessa-name"
                value={form.displayName}
                invalid={Boolean(touched.displayName && errors.displayName)}
                onChange={(e) => set("displayName", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, displayName: true }))}
                placeholder="ex. Ada Lovelace"
                autoComplete="name"
                maxLength={60}
              />
            </Field>

            <Field
              label="Função"
              htmlFor="nessa-role"
              error={touched.role ? errors.role : null}
              hint="Opcional — aparece sob o seu nome na sidebar."
            >
              <TextInput
                id="nessa-role"
                value={form.role}
                invalid={Boolean(touched.role && errors.role)}
                onChange={(e) => set("role", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, role: true }))}
                placeholder="ex. Pesquisadora de IA"
                maxLength={60}
              />
            </Field>

            <div className="border-t border-[var(--nessa-hairline)] pt-5">
              <SectionHeading eyebrow="Interface" title="Preferências da superfície" />
            </div>

            <Field
              label="Tema"
              hint="O modo escuro é a identidade da NESSA — o modo claro usa os mesmos tokens."
            >
              <Segmented
                value={form.theme}
                onChange={(value) => set("theme", value)}
                options={[
                  { value: "dark", label: "Escuro" },
                  { value: "light", label: "Claro" },
                ]}
              />
            </Field>

            <Field
              label="Idioma da interface"
              htmlFor="nessa-language"
              hint="Aplica-se à formatação de datas, horas e números."
            >
              <SelectInput
                id="nessa-language"
                value={form.language}
                onChange={(e) => set("language", e.target.value as SettingsState["language"])}
                options={[
                  { value: "pt-BR", label: "Português (Brasil)" },
                  { value: "en", label: "English" },
                ]}
              />
            </Field>

            <Field label="Densidade" hint="Altera o espaçamento do shell em tempo real — experimente.">
              <Segmented
                value={form.density}
                onChange={(value) => set("density", value)}
                options={[
                  { value: "comfortable", label: "Confortável" },
                  { value: "compact", label: "Compacta" },
                ]}
              />
            </Field>

            <div className="rounded-[var(--radius-sm)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] px-3 py-2">
              <Toggle
                checked={form.reduceMotion}
                onChange={(value) => set("reduceMotion", value)}
                label="Reduzir movimento"
                description="Desativa animações e transições em toda a plataforma."
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--nessa-hairline)] px-[var(--card-pad)] py-4">
            {dirty ? (
              <Badge tone="warning" dot>
                alterações não salvas
              </Badge>
            ) : (
              <Badge tone="success" dot>
                sincronizado
              </Badge>
            )}
            <span className="flex-1" />
            <Button type="button" variant="ghost" onClick={handleReset} disabled={!differsFromDefault}>
              Restaurar padrão
            </Button>
            <Button type="submit" disabled={!canSave}>
              <Icon name="check" size={15} strokeWidth={2.2} />
              Salvar preferências
            </Button>
          </div>
        </form>

        {/* ---------- Coluna de contexto ---------- */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-[var(--card-pad)] shadow-[var(--shadow-xs)]">
            <p className="u-label mb-4">Operador ativo</p>
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--nessa-primary-ring)] bg-[var(--nessa-primary-soft)] text-[13px] font-bold text-[var(--nessa-accent)]">
                {initials(operatorNameValue)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-[14px] font-bold text-[var(--nessa-text)]">{operatorNameValue}</p>
                <p className="truncate text-[12px] text-[var(--nessa-text-muted)]">
                  {settings.role.trim() || "Workspace pessoal"}
                </p>
              </div>
            </div>
            {savedAt && (
              <p className="mt-4 flex items-center gap-2 border-t border-[var(--nessa-hairline)] pt-3 text-[12px] text-[var(--nessa-text-muted)]">
                <Icon name="check" size={13} className="text-[var(--nessa-success)]" />
                Salvo às <span className="font-semibold tabular-nums text-[var(--nessa-text)]">{formatFullTime(savedAt)}</span>
              </p>
            )}
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--nessa-hairline)] bg-[var(--nessa-surface)] p-[var(--card-pad)] shadow-[var(--shadow-xs)]">
            <p className="u-label mb-4">Persistência</p>
            <div className="flex flex-col gap-2.5 text-[12.5px] text-[var(--nessa-text-muted)]">
              <div className="flex items-center justify-between gap-3">
                <span>Chave de armazenamento</span>
                <Chip>{STORAGE_KEYS.settings}</Chip>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Escopo</span>
                <span className="font-semibold text-[var(--nessa-text)]">este navegador</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>Backend próprio</span>
                <Badge tone="neutral">Etapa 2</Badge>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

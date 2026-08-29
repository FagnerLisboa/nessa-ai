/* ============================================================
   NESSA AI — NessaComposer (shared/components)
   O principal elemento de interação da plataforma.
   Ações essenciais: + (menu contextual) · anexar · modelo · enviar.
   Nenhuma funcionalidade é simulada.
   ============================================================ */
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../core/utils";
import { useClickOutside } from "../directives/hooks";
import { formatBytes } from "../pipes/format";
import { Icon, type IconName } from "./Icons";

const CONTEXT_ACTIONS: Array<{ label: string; icon: IconName; to: string }> = [
  { label: "Criar imagem", icon: "image", to: "/images" },
  { label: "Criar vídeo", icon: "play", to: "/videos" },
  { label: "Usar voz", icon: "wave", to: "/voice" },
  { label: "Pesquisar", icon: "compass", to: "/research" },
  { label: "Analisar arquivo", icon: "doc", to: "/files" },
];

const ENGINE_NOTICE =
  "A NESSA ainda não responde — o motor de IA será conectado na próxima etapa.";

interface Attachment {
  name: string;
  size: number;
}

interface NessaComposerProps {
  value: string;
  onChange: (next: string) => void;
  /** Incrementar para focar o campo (ex.: ao escolher uma sugestão). */
  focusTick?: number;
  className?: string;
}

export function NessaComposer({ value, onChange, focusTick = 0, className }: NessaComposerProps) {
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const modelRef = useRef<HTMLDivElement | null>(null);
  const plusBtnRef = useRef<HTMLButtonElement | null>(null);
  const modelBtnRef = useRef<HTMLButtonElement | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [notice, setNotice] = useState(false);
  const noticeTimer = useRef<number | undefined>(undefined);

  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);
  useClickOutside(modelRef, () => setModelOpen(false), modelOpen);

  /* Auto-altura do campo */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  /* Foco externo (sugestões) */
  useEffect(() => {
    if (focusTick > 0) textareaRef.current?.focus();
  }, [focusTick]);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const hasContent = value.trim().length > 0;

  function showNotice() {
    setNotice(true);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(false), 4600);
  }

  function handleSend() {
    if (!hasContent) {
      textareaRef.current?.focus();
      return;
    }
    showNotice();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setAttachments((prev) => [
      ...prev,
      ...Array.from(files).map((file) => ({ name: file.name, size: file.size })),
    ]);
    event.target.value = "";
  }

  function runAction(to: string) {
    setMenuOpen(false);
    navigate(to);
  }

  function onMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.stopPropagation();
      setMenuOpen(false);
      plusBtnRef.current?.focus();
      return;
    }
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']") ?? [],
    );
    if (items.length === 0) return;
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      event.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  function openMenu() {
    setMenuOpen(true);
    window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLButtonElement>("[role='menuitem']")?.focus();
    }, 0);
  }

  return (
    <div className={cn("w-full max-w-[var(--composer-max)]", className)}>
      <div className="composer relative">
        {/* Anexos selecionados */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pt-3.5">
            {attachments.map((file, index) => (
              <span
                key={`${file.name}-${index}`}
                className="pop-anim inline-flex items-center gap-1.5 rounded-full border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] py-1 pr-1.5 pl-3 text-[11.5px] font-medium text-[var(--nessa-text-muted)]"
              >
                <Icon name="clip" size={11} />
                <span className="max-w-[160px] truncate">{file.name}</span>
                <span className="tabular-nums opacity-70">{formatBytes(file.size)}</span>
                <button
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== index))}
                  className="grid h-4.5 w-4.5 place-items-center rounded-full transition-colors hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]"
                  aria-label={`Remover anexo ${file.name}`}
                >
                  <Icon name="close" size={10} />
                </button>
              </span>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte qualquer coisa para a NESSA..."
          aria-label="Mensagem para a NESSA"
          className="composer__textarea"
        />

        {/* Barra de ações */}
        <div className="flex items-center gap-1 px-3 pb-3">
          {/* Menu contextual "+" */}
          <div ref={menuRef} className="relative">
            <button
              ref={plusBtnRef}
              onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
              className="header-icon-btn"
              aria-label="Abrir ações de criação"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title="Criar"
            >
              <Icon
                name="plus"
                size={18}
                className={cn(
                  "transition-transform duration-[var(--t-base)] ease-[var(--ease-spring)]",
                  menuOpen && "rotate-45",
                )}
              />
            </button>
            {menuOpen && (
              <div
                className="popover pop-anim bottom-[calc(100%+8px)] left-0"
                role="menu"
                aria-label="Ações de criação"
                onKeyDown={onMenuKeyDown}
              >
                {CONTEXT_ACTIONS.map((action) => (
                  <button
                    key={action.to}
                    role="menuitem"
                    className="menu-item"
                    onClick={() => runAction(action.to)}
                  >
                    <span className="menu-item__icon">
                      <Icon name={action.icon} size={16} />
                    </span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Anexar */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFiles}
            aria-hidden="true"
            tabIndex={-1}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="header-icon-btn"
            aria-label="Anexar arquivo"
            title="Anexar"
          >
            <Icon name="clip" size={16} />
          </button>

          {/* Modelo */}
          <div ref={modelRef} className="relative ml-1">
            <button
              ref={modelBtnRef}
              onClick={() => setModelOpen((open) => !open)}
              className="flex h-[34px] items-center gap-1.5 rounded-[var(--radius-sm)] px-2.5 text-[12.5px] font-semibold text-[var(--nessa-text-muted)] transition-colors duration-[var(--t-fast)] hover:bg-[var(--nessa-surface-hover)] hover:text-[var(--nessa-text)]"
              aria-haspopup="dialog"
              aria-expanded={modelOpen}
              aria-label="Selecionar modelo"
            >
              <Icon name="spark" size={13} className="text-[var(--nessa-accent)]" />
              <span className="hidden sm:inline">Modelo</span>
              <Icon name="chevron-down" size={12} />
            </button>
            {modelOpen && (
              <div
                className="popover pop-anim bottom-[calc(100%+8px)] left-0 w-[250px]"
                role="dialog"
                aria-label="Modelos de IA"
              >
                <div className="px-3 py-2.5">
                  <p className="text-[12.5px] font-bold text-[var(--nessa-text)]">Nenhum motor conectado</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-[var(--nessa-text-muted)]">
                    Os modelos de IA serão ativados quando o motor for conectado, na próxima etapa.
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-[var(--nessa-primary-ring)] bg-[var(--nessa-primary-soft)] px-2 py-0.5 text-[10.5px] font-semibold text-[var(--nessa-accent)]">
                    <span className="h-1 w-1 rounded-full bg-[var(--nessa-accent)]" />
                    previsto para a Etapa 3
                  </span>
                </div>
              </div>
            )}
          </div>

          <span className="flex-1" />

          {/* Enviar */}
          <button
            onClick={handleSend}
            aria-disabled={!hasContent}
            aria-label="Enviar mensagem"
            title="Enviar (Enter)"
            className={cn(
              "grid h-9 w-9 place-items-center rounded-[var(--radius-sm)] transition-all duration-[var(--t-fast)] ease-[var(--ease-out)] active:scale-95",
              hasContent
                ? "bg-[var(--nessa-primary)] text-[var(--nessa-text)] shadow-[var(--shadow-sm)] hover:bg-[var(--nessa-primary-hover)] hover:shadow-[var(--shadow-glow)]"
                : "cursor-default bg-[var(--nessa-surface-2)] text-[var(--nessa-text-muted)]/50",
            )}
          >
            <Icon name="send" size={16} />
          </button>
        </div>
      </div>

      {/* Feedback honesto — sem respostas simuladas */}
      <div
        className={cn(
          "grid transition-all duration-[var(--t-base)] ease-[var(--ease-out)]",
          notice ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        aria-live="polite"
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex w-fit max-w-full items-center gap-2.5 rounded-full border border-[var(--nessa-hairline)] bg-[var(--nessa-surface-2)] px-4 py-2 shadow-[var(--shadow-sm)]">
            <Icon name="info" size={14} className="flex-none text-[var(--nessa-accent)]" />
            <p className="text-[12px] font-medium text-[var(--nessa-text-muted)]">{ENGINE_NOTICE}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   NESSA AI — Sugestões (shared/components)
   Máximo de 4, discretas. Preparam o composer — nada simulado.
   ============================================================ */
import type { IconName } from "./Icons";
import { Icon } from "./Icons";

interface Suggestion {
  label: string;
  icon: IconName;
  prefill: string;
}

const SUGGESTIONS: Suggestion[] = [
  { label: "Criar algo", icon: "image", prefill: "Quero criar " },
  { label: "Pesquisar", icon: "compass", prefill: "Pesquise sobre " },
  { label: "Programar", icon: "code", prefill: "Me ajude a programar " },
  { label: "Analisar", icon: "doc", prefill: "Analise " },
];

interface SuggestionsProps {
  onPick: (prefill: string) => void;
}

export function Suggestions({ onPick }: SuggestionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Sugestões de início">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion.label}
          onClick={() => onPick(suggestion.prefill)}
          className="suggestion"
          aria-label={`Sugestão: ${suggestion.label}`}
        >
          <Icon name={suggestion.icon} size={13} />
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}

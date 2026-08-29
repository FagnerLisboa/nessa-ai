/* ============================================================
   NESSA AI — Home (features/home)
   Extremamente limpa: borboleta · marca · promessa · composer.
   "O usuário olha e entende: posso conversar com a NESSA aqui."
   ============================================================ */
import { useState } from "react";
import { ButterflyMark } from "../../shared/components/Logo";
import { NessaComposer } from "../../shared/components/NessaComposer";
import { Suggestions } from "../../shared/components/Suggestions";

export default function HomePage() {
  const [text, setText] = useState("");
  const [focusTick, setFocusTick] = useState(0);

  function handleSuggestion(prefill: string) {
    setText(prefill);
    setFocusTick((tick) => tick + 1);
  }

  return (
    <section className="home-stage">
      {/* Identidade — entrada única e calma */}
      <div className="arrive" style={{ animationDelay: "0ms" }}>
        <ButterflyMark size={56} className="mx-auto" />
      </div>

      <p
        className="arrive font-display mt-5 text-[17px] font-bold tracking-[0.42em] text-[var(--nessa-text)] uppercase"
        style={{ animationDelay: "70ms" }}
      >
        Nessa
      </p>

      <h2
        className="arrive font-display mt-6 max-w-xl text-[clamp(24px,4vw,34px)] font-semibold leading-[1.18] tracking-[-0.02em] text-[var(--nessa-text)]"
        style={{ animationDelay: "140ms" }}
      >
        Inteligência que entende você.
      </h2>

      <p
        className="arrive mt-3 max-w-md text-[14.5px] leading-relaxed text-[var(--nessa-text-muted)]"
        style={{ animationDelay: "210ms" }}
      >
        Converse, crie, pesquise e transforme ideias em resultados.
      </p>

      {/* Composer — o protagonista */}
      <div className="arrive mt-9 w-full" style={{ animationDelay: "300ms" }}>
        <div className="mx-auto flex w-full justify-center">
          <NessaComposer value={text} onChange={setText} focusTick={focusTick} />
        </div>
      </div>

      <div className="arrive mt-5" style={{ animationDelay: "380ms" }}>
        <Suggestions onPick={handleSuggestion} />
      </div>
    </section>
  );
}

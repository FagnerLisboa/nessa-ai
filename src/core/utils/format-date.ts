/* ============================================================
   NESSA AI — Formatação de datas (core/utils)
   Rótulos curtos em pt-BR para exibição ("Hoje, 14:32").
   ============================================================ */

/** Converte um ISO string em um rótulo curto de exibição. */
export function formatDisplayDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const time = date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  if (date.toDateString() === now.toDateString()) {
    return `Hoje, ${time}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Ontem, ${time}`;
  }

  const month = date
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  return `${date.getDate()} ${month}, ${time}`;
}

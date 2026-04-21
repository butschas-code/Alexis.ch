import type { AdminDashboardCounts } from "@/cms/services/dashboard-client";

type Props = {
  counts: AdminDashboardCounts;
  /** When false, omit the submissions card (editor role). */
  showSubmissions?: boolean;
};

const allCards: { key: keyof AdminDashboardCounts; label: string; hint: string }[] = [
  { key: "publishedPosts", label: "Veröffentlicht", hint: "Live-Beiträge" },
  { key: "draftPosts", label: "Entwürfe", hint: "Noch nicht public" },
  { key: "categories", label: "Kategorien", hint: "Themen" },
  { key: "authors", label: "Autor:innen", hint: "Profile" },
  { key: "submissions", label: "Eingänge", hint: "Formulare" },
];

function formatCount(n: number) {
  return new Intl.NumberFormat("de-CH").format(n);
}

export function DashboardSummaryCards({ counts, showSubmissions = true }: Props) {
  const items = showSubmissions ? allCards : allCards.filter((i) => i.key !== "submissions");
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <li
          key={item.key}
          className="rounded-2xl border border-black/[0.07] bg-white px-5 py-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
        >
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--apple-text-tertiary)]">
            {item.label}
          </p>
          <p className="mt-2 font-serif text-3xl font-medium tabular-nums tracking-tight text-[var(--apple-text)]">
            {formatCount(counts[item.key])}
          </p>
          <p className="mt-1 text-xs text-[var(--apple-text-secondary)]">{item.hint}</p>
        </li>
      ))}
    </ul>
  );
}

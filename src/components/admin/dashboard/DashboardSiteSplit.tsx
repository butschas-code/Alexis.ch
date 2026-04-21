import type { AdminDashboardSitePostCounts } from "@/cms/services/dashboard-client";

type Props = {
  postsBySite: AdminDashboardSitePostCounts;
};

const rows: { site: keyof AdminDashboardSitePostCounts; title: string; subtitle: string }[] = [
  { site: "abexis", title: "abexis.ch", subtitle: "Zuweisung «abexis»" },
  { site: "search", title: "Executive Search", subtitle: "Zuweisung «search»" },
  { site: "both", title: "Beide Auftritte", subtitle: "Zuweisung «both»" },
];

function formatCount(n: number) {
  return new Intl.NumberFormat("de-CH").format(n);
}

/**
 * Optional overview: post documents per `site` field (any status).
 */
export function DashboardSiteSplit({ postsBySite }: Props) {
  const total = postsBySite.abexis + postsBySite.search + postsBySite.both;

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-[color-mix(in_srgb,var(--apple-bg-elevated)_88%,var(--apple-bg-subtle))] p-6">
      <h2 className="font-serif text-lg font-medium text-[var(--apple-text)]">Beiträge nach Website</h2>
      <p className="mt-1 text-sm text-[var(--apple-text-secondary)]">
        Anzahl Beiträge je Ziel ({formatCount(total)} gesamt, alle Status).
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {rows.map((row) => (
          <li
            key={row.site}
            className="rounded-xl border border-black/[0.06] bg-white/90 px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.03)]"
          >
            <p className="text-sm font-medium text-[var(--apple-text)]">{row.title}</p>
            <p className="mt-2 font-serif text-2xl font-medium tabular-nums text-[var(--apple-text)]">
              {formatCount(postsBySite[row.site])}
            </p>
            <p className="mt-1 text-xs text-[var(--apple-text-tertiary)]">{row.subtitle}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

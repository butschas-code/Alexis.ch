import Link from "next/link";

export type CategoryFilterItem = { id: string; label: string };

type Props = {
  categories: CategoryFilterItem[];
  activeCategoryId: string | null;
};

export function InsightsCategoryFilter({ categories, activeCategoryId }: Props) {
  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-black/[0.06] pb-8">
      <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">Themen</span>
      <Link
        href="/blog"
        className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
          activeCategoryId == null
            ? "bg-[var(--brand-900)] text-white shadow-sm"
            : "bg-white text-[#515154] ring-1 ring-black/[0.08] hover:ring-[var(--brand-500)]/40"
        }`}
      >
        Alle
      </Link>
      {categories.map((c) => {
        const on = activeCategoryId === c.id;
        return (
          <Link
            key={c.id}
            href={`/blog?category=${encodeURIComponent(c.id)}`}
            className={`rounded-full px-4 py-2 text-[13px] font-medium transition ${
              on
                ? "bg-[var(--brand-900)] text-white shadow-sm"
                : "bg-white text-[#515154] ring-1 ring-black/[0.08] hover:ring-[var(--brand-500)]/40"
            }`}
          >
            {c.label}
          </Link>
        );
      })}
    </div>
  );
}

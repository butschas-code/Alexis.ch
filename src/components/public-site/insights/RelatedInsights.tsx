import Link from "next/link";
import type { PublishedPostWithId } from "@/public-site/cms";

type Props = {
  posts: PublishedPostWithId[];
};

export function RelatedInsights({ posts }: Props) {
  if (posts.length === 0) return null;

  return (
    <aside className="mt-16 border-t border-black/[0.08] pt-14 md:mt-20 md:pt-16">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Weiterlesen</p>
      <h2 className="mt-2 font-serif text-[22px] font-medium tracking-[-0.02em] text-[#1d1d1f] md:text-[24px]">
        Passende Artikel
      </h2>
      <ul className="mt-8 grid list-none gap-6 sm:grid-cols-3">
        {posts.map((p) => {
          const dateStr = p.publishedAt
            ? new Date(p.publishedAt).toLocaleDateString("de-CH", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : null;
          return (
            <li key={p.id}>
              <Link
                href={`/blog/${encodeURIComponent(p.slug)}`}
                className="group block rounded-2xl border border-black/[0.06] bg-white/90 p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/[0.03] transition hover:border-[var(--brand-500)]/22 hover:shadow-md"
              >
                {dateStr ? (
                  <time className="text-[10px] font-medium uppercase tracking-[0.14em] text-[#a1a1a6]">{dateStr}</time>
                ) : null}
                <h3 className="mt-2 font-serif text-[17px] font-medium leading-snug tracking-[-0.02em] text-[#1d1d1f] transition group-hover:text-[var(--brand-900)] line-clamp-3">
                  {p.title}
                </h3>
                {p.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-[#6e6e73]">{p.excerpt}</p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

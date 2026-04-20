import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { getAllBlogPosts } from "@/data/pages";
import { getBlogListCoverByIndex } from "@/data/site-images";

export const metadata = { title: "Insights" };

export default function BlogIndexPage() {
  const allSorted = getAllBlogPosts().slice().sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1));
  const posts = allSorted;

  return (
    <div className="apple-section-mesh min-h-screen">
      <section className="border-b border-black/[0.06]">
        <div className="mx-auto max-w-[1068px] px-6 py-14 md:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Insights</p>
          <h1 className="mt-3 max-w-[14ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] md:text-[48px]">
            Blog
          </h1>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-[#6e6e73]">
            Unseren informativen Blog finden Sie hier — sämtliche Beiträge aus der bisherigen Website, inhaltlich
            übernommen.
          </p>
        </div>
      </section>

      <MotionSection className="pb-20 md:pb-28">
        <div className="mx-auto max-w-[1068px] px-6">
          <ul className="grid gap-6 sm:grid-cols-2">
            {posts.map((p) => {
              const cover = getBlogListCoverByIndex(allSorted.findIndex((x) => x.slug === p.slug));
              return (
                <li key={p.slug} className="list-none">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-white shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)]"
                  >
                    <div className="relative aspect-[16/9] w-full bg-[#f5f5f7]">
                      <Image
                        src={cover}
                        alt=""
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        sizes="(min-width: 640px) 45vw, 100vw"
                      />
                    </div>
                    <article className="flex flex-1 flex-col px-6 pb-7 pt-5">
                      <time className="text-[11px] font-medium uppercase tracking-widest text-[#86868b]">
                        {p.publishedISO ? new Date(p.publishedISO).toLocaleDateString("de-CH") : ""}
                      </time>
                      <h2 className="mt-2 flex-1 text-[21px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] group-hover:text-brand-900">
                        {p.title}
                      </h2>
                      {p.tags?.length ? (
                        <p className="mt-3 text-[12px] text-[#86868b]">{p.tags.slice(0, 5).join(" · ")}</p>
                      ) : null}
                    </article>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </MotionSection>
    </div>
  );
}

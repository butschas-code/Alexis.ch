import Image from "next/image";
import Link from "next/link";
import { fokusthemenMeta } from "@/data/pages";
import { serviceCardImages } from "@/data/site-images";

type ServiceSlug = keyof typeof serviceCardImages;

type BentoItem = {
  s: (typeof fokusthemenMeta)[number];
  img: string;
  i: number;
};

function indexLabel(i: number) {
  return String(i + 1).padStart(2, "0");
}

function buildItems(): BentoItem[] {
  return fokusthemenMeta.map((s, i) => ({
    s,
    img: serviceCardImages[s.slug as ServiceSlug],
    i,
  }));
}

export function LeistungenBentoGrid() {
  const items = buildItems();
  const [featured, rightTop, rightBottom, bottomLeft, bottomMid, bottomRight] = items;

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-12 lg:grid-rows-[minmax(248px,1fr)_minmax(248px,1fr)_auto]">
      {/* Featured */}
      <Link
        href={featured.s.href}
        className="group relative isolate flex min-h-[340px] overflow-hidden rounded-[28px] ring-1 ring-black/[0.06] sm:min-h-[380px] lg:col-span-8 lg:row-span-2 lg:row-start-1 lg:col-start-1 lg:min-h-0 lg:rounded-[32px]"
      >
        <Image
          src={featured.img}
          alt=""
          fill
          className="object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          sizes="(min-width: 1024px) 58vw, 100vw"
          priority
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#26337c]/95 via-[#0f1428]/55 to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#26337c]/65 via-transparent to-[#45b3e2]/12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220%200%20256%20256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.07%22/%3E%3C/svg%3E')]"
          aria-hidden
        />
        <span className="absolute right-5 top-5 font-mono text-[10px] font-medium tabular-nums tracking-[0.2em] text-white/35 sm:right-7 sm:top-7">
          {indexLabel(featured.i)}
        </span>
        <div className="relative z-10 mt-auto flex flex-col p-7 sm:p-9 lg:p-10 lg:pb-11">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">{featured.s.subtitle}</p>
          <h2 className="mt-2 max-w-[22ch] text-balance text-[26px] font-semibold leading-[1.12] tracking-[-0.03em] text-white sm:text-[30px] lg:text-[34px]">
            {featured.s.title}
          </h2>
          <p className="mt-4 line-clamp-3 max-w-xl text-[14px] leading-relaxed text-white/78 sm:text-[15px]">{featured.s.excerpt}</p>
          <span className="mt-7 inline-flex items-center gap-2 text-[14px] font-semibold text-white transition group-hover:gap-3">
            Mehr erfahren
            <span aria-hidden className="translate-y-px text-lg leading-none">
              →
            </span>
          </span>
        </div>
      </Link>

      <BentoSideTile item={rightTop} className="lg:col-span-4 lg:row-start-1 lg:col-start-9" />
      <BentoSideTile item={rightBottom} className="lg:col-span-4 lg:row-start-2 lg:col-start-9" />

      <BentoWideTile item={bottomLeft} className="lg:col-span-4 lg:row-start-3 lg:col-start-1" />
      <BentoWideTile item={bottomMid} variant="accent" className="lg:col-span-4 lg:row-start-3 lg:col-start-5" />
      <BentoWideTile item={bottomRight} className="lg:col-span-4 lg:row-start-3 lg:col-start-9" />
    </div>
  );
}

function BentoSideTile({ item, className }: { item: BentoItem; className?: string }) {
  const { s, img, i } = item;
  return (
    <Link
      href={s.href}
      className={`group relative flex flex-col overflow-hidden rounded-[24px] bg-white/90 shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,var(--apple-shadow)] ring-1 ring-black/[0.05] backdrop-blur-md transition duration-500 hover:-translate-y-0.5 hover:shadow-[var(--apple-shadow-lg)] hover:ring-black/[0.07] lg:min-h-0 lg:rounded-[28px] ${className ?? ""}`}
    >
      <div className="relative aspect-[16/11] w-full shrink-0 overflow-hidden bg-[#ececf0] lg:aspect-[16/10]">
        <Image
          src={img}
          alt=""
          fill
          className="object-cover transition duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          sizes="(min-width: 1024px) 32vw, 100vw"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.12] to-transparent opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
      </div>
      <div className="flex flex-1 flex-col px-6 pb-7 pt-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#86868b]">{s.subtitle}</p>
          <span className="shrink-0 font-mono text-[10px] font-medium tabular-nums tracking-[0.15em] text-[#c7c7cc]">
            {indexLabel(i)}
          </span>
        </div>
        <h2 className="mt-2 text-[17px] font-semibold leading-snug tracking-[-0.02em] text-[#1d1d1f] transition group-hover:text-brand-900 lg:text-[18px]">
          {s.title}
        </h2>
        <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-relaxed text-[#6e6e73]">{s.excerpt}</p>
        <span className="mt-4 text-[13px] font-semibold text-brand-900 opacity-90 group-hover:text-brand-500 group-hover:opacity-100">
          Weiter
        </span>
      </div>
    </Link>
  );
}

type WideProps = {
  item: BentoItem;
  variant?: "default" | "accent";
  className?: string;
};

function BentoWideTile({ item, variant = "default", className }: WideProps) {
  const { s, img, i } = item;
  const isAccent = variant === "accent";

  return (
    <Link
      href={s.href}
      className={`group relative isolate flex min-h-[200px] flex-col overflow-hidden rounded-[24px] ring-1 ring-inset transition duration-500 hover:-translate-y-0.5 sm:min-h-[220px] lg:min-h-[240px] lg:flex-row lg:rounded-[28px] ${
        isAccent
          ? "bg-gradient-to-br from-[#26337c] via-[#1c2548] to-[#0f1428] ring-white/[0.1] shadow-[0_24px_60px_-24px_rgba(38,51,124,0.45)] hover:ring-brand-500/30"
          : "bg-white/95 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,var(--apple-shadow)] ring-black/[0.06] hover:shadow-[var(--apple-shadow-lg)]"
      } ${className ?? ""}`}
    >
      <div
        className={`relative aspect-[2/1] w-full shrink-0 overflow-hidden lg:aspect-auto lg:h-full lg:w-[44%] ${
          isAccent ? "" : "bg-[#ececf0]"
        }`}
      >
        <Image
          src={img}
          alt=""
          fill
          className={`object-cover transition duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] ${
            isAccent ? "opacity-90 saturate-[0.95] group-hover:opacity-100" : ""
          }`}
          sizes="(min-width: 1024px) 18vw, 100vw"
        />
        {isAccent ? (
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0f1419]/80 via-transparent to-transparent mix-blend-multiply"
            aria-hidden
          />
        ) : null}
      </div>
      <div
        className={`relative flex flex-1 flex-col justify-center px-6 py-6 lg:px-7 lg:py-7 ${
          isAccent ? "text-white" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
              isAccent ? "text-white/45" : "text-[#86868b]"
            }`}
          >
            {s.subtitle}
          </p>
          <span
            className={`shrink-0 font-mono text-[10px] font-medium tabular-nums tracking-[0.15em] ${
              isAccent ? "text-white/30" : "text-[#d2d2d7]"
            }`}
          >
            {indexLabel(i)}
          </span>
        </div>
        <h2
          className={`mt-2 text-[16px] font-semibold leading-snug tracking-[-0.02em] transition lg:text-[17px] ${
            isAccent ? "text-white group-hover:text-brand-500" : "text-[#1d1d1f] group-hover:text-brand-900"
          }`}
        >
          {s.title}
        </h2>
        <p
          className={`mt-2 line-clamp-2 text-[13px] leading-relaxed lg:line-clamp-3 ${
            isAccent ? "text-white/65" : "text-[#6e6e73]"
          }`}
        >
          {s.excerpt}
        </p>
        <span
          className={`mt-4 text-[13px] font-semibold ${
            isAccent ? "text-brand-500 group-hover:text-[#7dd4f0]" : "text-brand-900"
          }`}
        >
          Mehr erfahren →
        </span>
      </div>
    </Link>
  );
}

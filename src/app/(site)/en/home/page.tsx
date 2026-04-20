import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { fokusthemenMeta, siteConfig } from "@/data/pages";
import { homeEn } from "@/data/home-en";

export const metadata = { title: "Home (English)" };

export default function EnglishHomePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand2)]">English</p>
      <h1 className="mt-4 font-serif text-4xl text-[var(--brand)]">Abexis Consulting</h1>
      <p className="mt-6 text-lg leading-relaxed text-[var(--muted)]">{homeEn.lead}</p>
      <ul className="mt-8 space-y-2 border-l border-[var(--brand)]/20 pl-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
        {homeEn.pillars.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <MotionSection className="mt-14">
        <h2 className="font-serif text-2xl text-[var(--brand)]">About us</h2>
        <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">{homeEn.about}</p>
      </MotionSection>

      <MotionSection className="mt-14">
        <h2 className="font-serif text-2xl text-[var(--brand)]">Topics</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">
          The detailed English topic pages remain available under the legacy paths on abexis.ch; the German
          consulting pages are the primary reference on this build.
        </p>
        <ul className="mt-6 space-y-2 text-sm">
          {fokusthemenMeta.map((t) => (
            <li key={t.slug}>
              <a
                className="text-[var(--brand)] underline"
                href={`https://www.abexis.ch/en/fokusthemen/${slugToEn(t.slug)}`}
              >
                {t.title}
              </a>
            </li>
          ))}
        </ul>
      </MotionSection>

      <MotionSection className="mt-14 border-t border-[var(--line)] pt-10">
        <p className="text-sm text-[var(--muted)]">We look forward to hearing from you.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          You are also welcome to arrange a non-binding introductory call via calendly:{" "}
          <a className="font-semibold text-[var(--brand)] underline" href={siteConfig.bookingUrlEn}>
            Schedule an appointment
          </a>
          .
        </p>
        <Link href="/" className="mt-8 inline-block text-sm font-semibold text-[var(--brand)] underline">
          ← Deutsch
        </Link>
      </MotionSection>
    </div>
  );
}

function slugToEn(slug: string) {
  if (slug === "digitale-transformation") return "digital-transformation";
  return slug;
}

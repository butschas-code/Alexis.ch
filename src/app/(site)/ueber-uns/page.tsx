import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { footerPartners, homeAboutTeaser, teamOrder, teamProfiles } from "@/data/pages";

export const metadata = { title: "Über uns" };

export default function UeberUnsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand2)]">Über uns</p>
      <h1 className="mt-4 max-w-3xl font-serif text-4xl text-[var(--brand)]">Begleitung mit Erfahrung und Substanz</h1>
      <p className="mt-6 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">
        {homeAboutTeaser}
      </p>

      <MotionSection className="mt-16">
        <h2 className="font-serif text-2xl text-[var(--brand)]">Team</h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {teamOrder.map((slug) => {
            const p = teamProfiles[slug];
            return (
              <article key={slug} className="border border-[var(--line)] bg-white/80 p-6">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-[var(--line)]">
                    <Image src={p.image} alt={p.name} fill className="object-cover" sizes="96px" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-[var(--brand)]">
                      <Link href={`/${slug}`} className="hover:underline decoration-[var(--brand2)] underline-offset-8">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-xs text-[var(--muted)]">{p.title}</p>
                  </div>
                </div>
                <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">{p.body}</p>
                <Link href={`/${slug}`} className="mt-4 inline-block text-xs font-semibold text-[var(--brand)] hover:underline">
                  Vollständige Vorstellung
                </Link>
              </article>
            );
          })}
        </div>
      </MotionSection>

      <MotionSection className="mt-16 border-t border-[var(--line)] pt-12">
        <h2 className="font-serif text-2xl text-[var(--brand)]">Partnerschaften</h2>
        <p className="mt-3 max-w-3xl text-sm text-[var(--muted)]">
          Wir arbeiten mit verschiedenen namhaften Unternehmen zusammen und haben strategische Partnerschaften aufgebaut.
          Auch sind wir Mitglied verschiedener Verbände und Fachvereine:
        </p>
        <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {footerPartners.map((p) => (
            <li key={p.href}>
              <a href={p.href} className="text-[var(--brand)] underline-offset-4 hover:underline" rel="noopener noreferrer">
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </MotionSection>
    </div>
  );
}

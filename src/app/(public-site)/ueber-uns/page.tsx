import Image from "next/image";
import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { footerPartners, homeAboutTeaser, teamOrder, teamProfiles } from "@/data/pages";

export const metadata = { title: "Über uns" };

export default function UeberUnsPage() {
  return (
    <InteriorPageLayout
      eyebrow="Über uns"
      title="Begleitung mit Erfahrung und Substanz"
      description={<p className="whitespace-pre-line">{homeAboutTeaser}</p>}
    >
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Team</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {teamOrder.map((slug) => {
          const p = teamProfiles[slug];
          return (
            <article
              key={slug}
              className="overflow-hidden rounded-[28px] bg-white p-6 shadow-[var(--apple-shadow)] ring-1 ring-black/[0.04] transition-shadow duration-300 hover:shadow-[var(--apple-shadow-lg)] hover:ring-brand-500/20"
            >
              <div className="flex gap-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#f5f5f7] ring-1 ring-black/[0.06]">
                  <Image src={p.image} alt={p.name} fill className="object-cover" sizes="96px" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-[20px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">
                    <Link
                      href={`/${slug}`}
                      className="transition-colors duration-200 hover:text-brand-900 hover:underline hover:decoration-brand-500/60 hover:underline-offset-4"
                    >
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-[13px] font-medium text-[#86868b]">{p.title}</p>
                </div>
              </div>
              <p className="mt-5 whitespace-pre-line text-[15px] leading-relaxed text-[#6e6e73]">{p.body}</p>
              <Link
                href={`/${slug}`}
                className="mt-5 inline-flex text-[14px] font-medium text-brand-900 transition-colors duration-200 hover:text-brand-500 hover:underline"
              >
                Vollständige Vorstellung →
              </Link>
            </article>
          );
        })}
      </div>

      <MotionSection className="mt-16 border-t border-black/[0.06] pt-14">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Partnerschaften</h2>
        <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-[#6e6e73]">
          Wir arbeiten mit verschiedenen namhaften Unternehmen zusammen und haben strategische Partnerschaften aufgebaut.
          Auch sind wir Mitglied verschiedener Verbände und Fachvereine:
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-[15px]">
          {footerPartners.map((p) => (
            <li key={p.href}>
              <a
                href={p.href}
                className="font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
                rel="noopener noreferrer"
              >
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </MotionSection>
    </InteriorPageLayout>
  );
}

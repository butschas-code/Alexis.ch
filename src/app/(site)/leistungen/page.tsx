import Image from "next/image";
import Link from "next/link";
import { LeistungenBentoGrid } from "@/components/leistungen/LeistungenBentoGrid";
import { MotionSection } from "@/components/motion/MotionSection";
import { siteConfig } from "@/data/pages";
import { fokusPageHeroImages, projectFitVisual } from "@/data/site-images";

export const metadata = {
  title: "Leistungen",
};

export default function LeistungenPage() {
  return (
    <div>
      <section className="apple-section-mesh border-b border-black/[0.06]">
        <div className="mx-auto grid max-w-[1068px] gap-12 px-6 py-16 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-24">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Leistungen</p>
            <h1 className="mt-3 max-w-[20ch] text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] md:text-[48px]">
              Beratung mit Substanz
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[#6e6e73]">
              Die folgenden Schwerpunkte entsprechen den bisherigen «Fokusthemen» auf abexis.ch — inhaltlich vollständig
              auf den jeweiligen Themenseiten dokumentiert.
            </p>
            <div className="mt-10 rounded-2xl bg-[#f5f5f7] p-6 ring-1 ring-black/[0.05]">
              <p className="text-[15px] font-semibold text-[#1d1d1f]">Executive Search</p>
              <p className="mt-2 text-[14px] leading-relaxed text-[#6e6e73]">
                Für Executive Search verweisen wir auf{" "}
                <a className="font-medium text-brand-900 hover:text-brand-500 hover:underline" href={siteConfig.searchSite}>
                  Abexis Search
                </a>{" "}
                (eigenständiges Profil auf abexis-search.ch).
              </p>
              <Link
                href="/leistungen/executive-search"
                className="mt-4 inline-flex text-[14px] font-medium text-brand-900 transition-colors duration-200 hover:text-brand-500 hover:underline"
              >
                Kurzinfo & Link
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#f5f5f7] shadow-[var(--apple-shadow-lg)] ring-1 ring-black/[0.05]">
            <Image
              src={fokusPageHeroImages["digitale-transformation"]}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      <MotionSection className="relative overflow-hidden py-16 md:py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_-10%,rgba(38,51,124,0.11),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_50%,rgba(69,179,226,0.1),transparent_45%),linear-gradient(180deg,#fbfbfd_0%,#f0f3fb_40%,#fbfbfd_100%)]"
        />
        <div className="relative mx-auto max-w-[1140px] px-5 sm:px-6">
          <div className="mb-10 max-w-[52ch] md:mb-14">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Schwerpunkte</p>
            <h2 className="mt-2 text-[32px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">
              Beratungsfelder im Überblick
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[#6e6e73] md:text-[16px]">
              Jedes Feld verweist auf die vollständige Themenseite mit Originalinhalt — hier als kompakte Orientierung.
            </p>
          </div>
          <LeistungenBentoGrid />
        </div>
      </MotionSection>

      <MotionSection className="border-t border-black/[0.06] bg-white py-16 md:py-20">
        <div className="mx-auto max-w-[1068px] overflow-hidden rounded-[28px] bg-[#f5f5f7] px-6 ring-1 ring-black/[0.06] md:px-0">
          <div className="grid md:grid-cols-[minmax(0,220px)_1fr] md:grid-rows-1 md:items-stretch">
            <div className="relative mx-auto mt-8 min-h-[180px] w-full max-w-sm md:mx-0 md:mt-0 md:min-h-0 md:h-full md:max-w-none">
              <Image
                src={projectFitVisual}
                alt=""
                fill
                className="object-cover md:rounded-l-[28px]"
                sizes="220px"
              />
            </div>
            <div className="py-10 text-center md:flex md:flex-col md:justify-center md:px-10 md:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">Angebot</p>
              <p className="mt-2 text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]">Project Fit Check</p>
              <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6e6e73] md:mx-0">
                Strukturierte Projekt-Reviews in klar definierten Paketen — weiterführend auf der bestehenden Seite.
              </p>
              <Link
                href="/projectfitcheck"
                className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#1d1d1f] px-8 text-[15px] font-medium text-white transition-all duration-200 ease-out hover:bg-[#2d2d2f] hover:shadow-lg hover:shadow-black/25 hover:-translate-y-0.5 active:translate-y-0 md:self-start"
              >
                Zum Project Fit Check
              </Link>
            </div>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}

import Image from "next/image";
import { homeCustomerStatements } from "@/data/site-images";

/**
 * «Stimmen» wie auf der Originalseite: genau die sechs eingebetteten Kundenstatement-Grafiken
 * (keine generierten Texte, keine Initialen-Platzhalter).
 */
export function TestimonialsSection() {
  return (
    <section className="relative overflow-hidden border-y border-black/[0.06] py-16 md:py-24">
      <div
        className="absolute inset-0 bg-[linear-gradient(165deg,#f0f3fb_0%,#ffffff_45%,#eef8fc_100%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-[1200px] px-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86868b]">Stimmen</p>
        <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-[#1d1d1f] md:text-[40px]">Was unsere Kunden sagen</h2>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[#6e6e73] md:text-[16px]">
          Die folgenden sechs Aussagen entsprechen 1:1 den Kundenstatements der bisherigen Abexis-Startseite — inklusive
          Typografie und Signatur, wie vom Kunden freigegeben.
        </p>

        <ul className="mt-12 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4">
          {homeCustomerStatements.map((src, idx) => (
            <li key={src}>
              <figure className="group h-full border-2 border-[#1a1a1a] bg-[#e4e4e8] p-2 shadow-[0_2px_0_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_-8px_rgba(38,51,124,0.2)] sm:min-w-0">
                <div className="relative aspect-[5/3] w-full overflow-hidden rounded-lg bg-[#f2f2f4]">
                  <Image
                    src={src}
                    alt={`Kundenstimme ${idx + 1} — Originalgrafik von abexis.ch`}
                    fill
                    className="object-contain object-center transition duration-500 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 16vw"
                  />
                </div>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

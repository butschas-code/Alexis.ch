import Link from "next/link";
import { MotionSection } from "@/components/motion/MotionSection";
import { siteConfig } from "@/data/pages";

export const metadata = { title: "Kontakt" };

export default function KontaktPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand2)]">Kontakt</p>
      <h1 className="mt-4 font-serif text-4xl text-[var(--brand)]">Wir freuen uns auf Ihre Kontaktaufnahme</h1>
      <p className="mt-5 text-sm leading-relaxed text-[var(--muted)]">
        Gerne können Sie auch einen Termin für einen unverbindlichen Austausch vereinbaren.
      </p>

      <MotionSection className="mt-10 border border-[var(--line)] bg-white p-8">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Anschrift</dt>
            <dd className="mt-1 text-[var(--ink)]">
              Abexis GmbH
              <br />
              Zihlstrasse 25
              <br />
              8340 Hinwil
              <br />
              Schweiz
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">E-Mail</dt>
            <dd className="mt-1">
              <a className="text-[var(--brand)] underline" href={`mailto:${siteConfig.emailPrimary}`}>
                {siteConfig.emailPrimary}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Telefon</dt>
            <dd className="mt-1">
              <a className="text-[var(--brand)] underline" href={`tel:${siteConfig.phoneTel}`}>
                {siteConfig.phoneDisplay}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Termin</dt>
            <dd className="mt-1">
              <a className="font-semibold text-[var(--brand)] underline" href={siteConfig.bookingUrlDe}>
                Termin planen (Outlook)
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Social</dt>
            <dd className="mt-1 flex gap-4">
              <a className="text-[var(--brand)] underline" href={siteConfig.linkedin}>
                LinkedIn
              </a>
              <a className="text-[var(--brand)] underline" href={siteConfig.xing}>
                Xing
              </a>
            </dd>
          </div>
        </dl>
      </MotionSection>

      <p className="mt-8 text-xs text-[var(--muted)]">
        Hinweis: Impressum mit Registerangaben und weiterer Adresse:{" "}
        <Link className="underline" href="/legal-policy">
          Impressum
        </Link>
        .
      </p>
    </div>
  );
}

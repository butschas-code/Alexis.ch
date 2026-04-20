import Link from "next/link";
import { siteConfig } from "@/data/pages";

export const metadata = {
  title: "Executive Search (Hinweis)",
};

export default function ExecutiveSearchReferralPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand2)]">Verwandtes Angebot</p>
      <h1 className="mt-4 font-serif text-3xl text-[var(--brand)]">Executive Search</h1>
      <p className="mt-6 text-sm leading-relaxed text-[var(--muted)]">
        Executive Search wird über die eigenständige Marke und Domain{" "}
        <strong className="text-[var(--ink)]">Abexis Search</strong> geführt. Auf abexis.ch dokumentieren wir
        vorrangig die Managementberatung; Personalberatung und Suchmandate finden Sie dort, wo sie fachlich und
        kommunikativ hingehören: auf{" "}
        <a className="font-semibold text-[var(--brand)] underline" href={siteConfig.searchSite}>
          abexis-search.ch
        </a>
        .
      </p>
      <a
        href={siteConfig.searchSite}
        className="mt-10 inline-flex rounded-lg border border-[var(--brand)] bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent hover:text-[var(--brand)] hover:shadow-md active:translate-y-0"
        rel="noopener noreferrer"
      >
        Weiter zu Abexis Search
      </a>
      <p className="mt-8 text-sm text-[var(--muted)]">
        Zurück zur{" "}
        <Link className="font-semibold text-[var(--brand)] underline" href="/leistungen">
          Leistungsübersicht
        </Link>{" "}
        der Beratung.
      </p>
    </div>
  );
}

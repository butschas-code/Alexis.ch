import { siteConfig } from "@/data/pages";

export const metadata = { title: "Termin buchen" };

export default function TerminPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16 md:py-24">
      <h1 className="font-serif text-3xl text-[var(--brand)]">Termin buchen</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">
        Für einen unverbindlichen Austausch können Sie direkt einen Termin über die bestehende Kalenderfunktion
        wählen.
      </p>
      <a
        href={siteConfig.bookingUrlDe}
        className="mt-8 inline-flex rounded-lg border border-[var(--brand)] bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-transparent hover:text-[var(--brand)] hover:shadow-md active:translate-y-0"
        rel="noreferrer"
      >
        Termin planen
      </a>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col justify-center px-5 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--brand2)]">404</p>
      <h1 className="mt-4 font-serif text-3xl text-[var(--brand)]">Seite nicht gefunden</h1>
      <p className="mt-4 text-sm text-[var(--muted)]">Der angeforderte Pfad existiert nicht oder wurde verschoben.</p>
      <Link href="/" className="mt-8 inline-block text-sm font-semibold text-[var(--brand)] underline">
        Zur Startseite
      </Link>
    </div>
  );
}

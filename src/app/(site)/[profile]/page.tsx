import Image from "next/image";
import { notFound } from "next/navigation";
import { MotionSection } from "@/components/motion/MotionSection";
import { siteConfig, teamOrder, teamProfiles, type TeamSlug } from "@/data/pages";

type Props = { params: Promise<{ profile: string }> };

function isTeamSlug(s: string): s is TeamSlug {
  return (teamOrder as readonly string[]).includes(s);
}

export function generateStaticParams() {
  return teamOrder.map((profile) => ({ profile }));
}

export async function generateMetadata({ params }: Props) {
  const { profile } = await params;
  if (!isTeamSlug(profile)) return {};
  return { title: teamProfiles[profile].name };
}

export default async function TeamProfilePage({ params }: Props) {
  const { profile } = await params;
  if (!isTeamSlug(profile)) notFound();
  const p = teamProfiles[profile];

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-10 md:flex-row">
        <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden border border-[var(--line)] md:mx-0">
          <Image src={p.image} alt={p.name} fill className="object-cover" sizes="160px" />
        </div>
        <div>
          <h1 className="font-serif text-3xl text-[var(--brand)]">{p.name}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{p.title}</p>
          {p.phone ? (
            <p className="mt-4 text-sm">
              <a className="text-[var(--brand)] underline" href={`tel:${p.phone.replace(/\s/g, "")}`}>
                {p.phone}
              </a>
            </p>
          ) : null}
          {p.email ? (
            <p className="mt-1 text-sm">
              <a className="text-[var(--brand)] underline" href={`mailto:${p.email}`}>
                {p.email}
              </a>
            </p>
          ) : null}
          {p.links?.length ? (
            <ul className="mt-4 flex gap-4 text-sm">
              {p.links.map((l) => (
                <li key={l.href}>
                  <a className="text-[var(--brand)] underline" href={l.href}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          <a
            href={siteConfig.bookingUrlDe}
            className="mt-6 inline-flex rounded-lg border-2 border-[var(--brand)] px-4 py-2 text-xs font-semibold text-[var(--brand)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--brand)] hover:text-white hover:shadow-md active:translate-y-0"
            rel="noreferrer"
          >
            Unverbindlicher Termin vereinbaren
          </a>
        </div>
      </div>
      <MotionSection className="py-10">
        <div className="whitespace-pre-line text-sm leading-relaxed text-[var(--muted)]">{p.body}</div>
      </MotionSection>
    </article>
  );
}

import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/content/SafeHtml";
import { MotionSection } from "@/components/motion/MotionSection";
import { fokusthemenMeta, getFokusthemaHtml, normalizeFokusSlug } from "@/data/pages";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return fokusthemenMeta.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const meta = fokusthemenMeta.find((m) => m.slug === normalizeFokusSlug(slug));
  return { title: meta?.title ?? "Fokusthema" };
}

export default async function FokusthemaPage({ params }: Props) {
  const { slug } = await params;
  const n = normalizeFokusSlug(slug);
  const html = getFokusthemaHtml(n);
  if (!html) notFound();

  return (
    <article className="mx-auto max-w-4xl px-5 py-14 md:py-18">
      <MotionSection>
        <SafeHtml html={html} />
      </MotionSection>
    </article>
  );
}

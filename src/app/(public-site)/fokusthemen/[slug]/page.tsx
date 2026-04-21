import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/content/SafeHtml";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { fokusthemenMeta, getFokusthemaHtml, normalizeFokusSlug } from "@/data/pages";
import { fokusPageHeroImages, homeHeroImage } from "@/data/site-images";

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

  const meta = fokusthemenMeta.find((m) => m.slug === n);
  const heroKey = n as keyof typeof fokusPageHeroImages;
  const heroImage = heroKey in fokusPageHeroImages ? fokusPageHeroImages[heroKey] : homeHeroImage;

  return (
    <InteriorPageLayout
      eyebrow={meta?.subtitle ?? "Fokusthemen"}
      title={meta?.title ?? "Thema"}
      description={meta ? <p>{meta.excerpt}</p> : undefined}
      maxWidth="1068"
      contentMaxWidth="4xl"
      contentClassName="pt-10 md:pt-12"
      heroImage={heroImage}
    >
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}

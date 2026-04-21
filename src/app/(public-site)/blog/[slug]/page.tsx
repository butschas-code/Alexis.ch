import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogBody } from "@/components/content/BlogBody";
import { CmsBlogPostView } from "@/components/public-site/insights/CmsBlogPostView";
import { MotionSection } from "@/components/motion/MotionSection";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";
import { getAllBlogPosts, getBlogPostBySlug } from "@/data/pages";
import { getBlogListCoverByIndex } from "@/data/site-images";
import {
  buildCmsPostMetadata,
  getPublishedCmsPosts,
  getPublishedPostBySlug,
  loadPublishedPostPageData,
  loadRelatedPublishedPosts,
} from "@/public-site/cms";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export async function generateStaticParams() {
  const staticPosts = getAllBlogPosts().map((p) => ({ slug: p.slug }));
  let cms: { slug: string }[] = [];
  try {
    const published = await getPublishedCmsPosts(400);
    cms = published.map((p) => ({ slug: p.slug }));
  } catch {
    /* Admin SDK may be unavailable at build time */
  }
  const seen = new Set<string>();
  return [...staticPosts, ...cms].filter((x) => {
    if (seen.has(x.slug)) return false;
    seen.add(x.slug);
    return true;
  });
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cms = await getPublishedPostBySlug(slug);
  if (cms) {
    return buildCmsPostMetadata(cms, `/blog/${encodeURIComponent(slug)}`);
  }
  const legacy = getBlogPostBySlug(slug);
  if (!legacy) return { title: "Insights" };
  return {
    title: legacy.title,
    description: undefined,
    alternates: { canonical: `/blog/${encodeURIComponent(slug)}` },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const pageData = await loadPublishedPostPageData(slug);
  if (pageData) {
    const related = await loadRelatedPublishedPosts(pageData.post, 3);
    return <CmsBlogPostView data={pageData} related={related} />;
  }

  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const dateStr = post.publishedISO ? new Date(post.publishedISO).toLocaleDateString("de-CH") : "";
  const hasMeta = Boolean(dateStr || post.tags?.length);
  const allPosts = getAllBlogPosts();
  const coverIdx = allPosts.findIndex((x) => x.slug === post.slug);
  const heroImage = getBlogListCoverByIndex(coverIdx >= 0 ? coverIdx : 0);

  return (
    <InteriorPageLayout
      eyebrow="Insights"
      title={post.title}
      maxWidth="1068"
      contentMaxWidth="3xl"
      heroImage={heroImage}
      wrapContentInMotion={false}
      contentClassName="pt-10 md:pt-12"
      description={
        hasMeta ? (
          <>
            {dateStr ? (
              <time className="text-[12px] font-medium uppercase tracking-widest text-[#86868b]">{dateStr}</time>
            ) : null}
            {post.tags?.length ? (
              <p className={`text-[14px] text-[#86868b] ${dateStr ? "mt-3" : ""}`}>
                Stichwörter: {post.tags.join(" · ")}
              </p>
            ) : null}
          </>
        ) : undefined
      }
    >
      <Link
        href="/blog"
        className="inline-flex text-[15px] font-medium text-brand-900 underline-offset-4 transition-colors hover:text-brand-500 hover:underline"
      >
        ← Alle Beiträge
      </Link>
      <MotionSection className="mt-10 border-t border-black/[0.06] pt-10">
        <BlogBody storedBody={post.bodyHtml} />
      </MotionSection>
    </InteriorPageLayout>
  );
}

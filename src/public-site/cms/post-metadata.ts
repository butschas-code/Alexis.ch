import type { Metadata } from "next";
import type { PublishedPostWithId } from "@/public-site/cms/get-published-posts";

/**
 * SEO + Open Graph (+ Twitter card) for a CMS blog post.
 * Relies on root `metadataBase` for relative path resolution.
 */
export function buildCmsPostMetadata(post: PublishedPostWithId, path: string): Metadata {
  const title = (post.seoTitle?.trim() || post.title).trim();
  const description = (post.seoDescription?.trim() || post.excerpt?.trim() || "").trim() || undefined;
  const hero = post.heroImageUrl?.trim();

  const md: Metadata = {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt ?? undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };

  if (hero) {
    md.openGraph = {
      ...md.openGraph,
      images: [{ url: hero, alt: title }],
    };
    md.twitter = {
      ...md.twitter,
      images: [hero],
    };
  }

  return md;
}

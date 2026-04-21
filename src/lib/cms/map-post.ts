import type { DocumentSnapshot } from "firebase-admin/firestore";
import type { PostStatus } from "@/cms/types/enums";
import type { CmsPost } from "@/cms/types/post";

function readHeroPath(d: Record<string, unknown>): string | null {
  if (d.heroImagePath != null) return String(d.heroImagePath);
  if (d.heroStoragePath != null) return String(d.heroStoragePath);
  return null;
}

function readTags(d: Record<string, unknown>): string[] {
  if (!Array.isArray(d.tags)) return [];
  return d.tags.map((t) => String(t)).filter(Boolean);
}

function readFeatured(d: Record<string, unknown>): boolean {
  return d.featured === true;
}

function readStatus(d: Record<string, unknown>): PostStatus {
  const s = d.status;
  if (s === "published" || s === "archived" || s === "draft") return s;
  return "draft";
}

/** Map Firestore `posts` document to `CmsPost` (ISO date strings). */
export function mapPostDoc(id: string, snap: DocumentSnapshot): CmsPost | null {
  const d = snap.data();
  if (!d) return null;
  const toIso = (v: unknown) => {
    if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
      return (v as { toDate: () => Date }).toDate().toISOString();
    }
    if (typeof v === "string") return v;
    return null;
  };
  return {
    title: String(d.title ?? ""),
    slug: String(d.slug ?? id),
    excerpt: String(d.excerpt ?? ""),
    body: String(d.body ?? ""),
    heroImageUrl: d.heroImageUrl != null ? String(d.heroImageUrl) : null,
    heroImagePath: readHeroPath(d as Record<string, unknown>),
    authorId: String(d.authorId ?? ""),
    categoryIds: Array.isArray(d.categoryIds) ? d.categoryIds.map(String) : [],
    tags: readTags(d as Record<string, unknown>),
    site: d.site === "search" || d.site === "both" || d.site === "abexis" ? d.site : "abexis",
    status: readStatus(d as Record<string, unknown>),
    seoTitle: d.seoTitle != null ? String(d.seoTitle) : null,
    seoDescription: d.seoDescription != null ? String(d.seoDescription) : null,
    featured: readFeatured(d as Record<string, unknown>),
    publishedAt: toIso(d.publishedAt),
    createdAt: toIso(d.createdAt) ?? new Date().toISOString(),
    updatedAt: toIso(d.updatedAt) ?? new Date().toISOString(),
  };
}

import type { Firestore } from "firebase-admin/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { CmsPost } from "@/cms/types/post";
import { getAdminFirestore } from "@/firebase/server";
import { mapPostDoc } from "@/lib/cms/map-post";
import { getResolvedPublicDeploymentSite, visiblePostSitesInClause } from "@/public-site/site";

export type PublishedPostWithId = CmsPost & { id: string };

/** Low-level query when you already hold an Admin Firestore instance (e.g. Route Handlers). */
export async function listPublishedPostsFromDb(db: Firestore, limit = 20): Promise<PublishedPostWithId[]> {
  const deployment = await getResolvedPublicDeploymentSite();
  const sites = visiblePostSitesInClause(deployment);
  const snap = await db
    .collection(COLLECTIONS.posts)
    .where("status", "==", "published")
    .where("site", "in", sites)
    .orderBy("publishedAt", "desc")
    .limit(Math.min(50, Math.max(1, limit)))
    .get();

  return snap.docs
    .map((doc) => {
      const post = mapPostDoc(doc.id, doc);
      return post ? { id: doc.id, ...post } : null;
    })
    .filter(Boolean) as PublishedPostWithId[];
}

/**
 * Server helper: Admin SDK + deployment site filter. Returns [] if Admin is not configured.
 */
export async function getPublishedCmsPosts(limit = 20): Promise<PublishedPostWithId[]> {
  const db = getAdminFirestore();
  if (!db) return [];
  return listPublishedPostsFromDb(db, limit);
}

/**
 * Single published post visible on this deployment (abexis/search + `both`), by public slug.
 */
export async function getPublishedPostBySlug(slug: string): Promise<PublishedPostWithId | null> {
  const db = getAdminFirestore();
  if (!db) return null;
  const deployment = await getResolvedPublicDeploymentSite();
  const allowed = new Set(visiblePostSitesInClause(deployment));
  const snap = await db.collection(COLLECTIONS.posts).where("slug", "==", slug.trim()).limit(40).get();
  for (const doc of snap.docs) {
    const post = mapPostDoc(doc.id, doc);
    if (!post || post.status !== "published") continue;
    if (!allowed.has(post.site)) continue;
    return { id: doc.id, ...post };
  }
  return null;
}

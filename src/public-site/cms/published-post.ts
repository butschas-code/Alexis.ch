import type { CmsPost } from "@/cms/types/post";

/** Published CMS post as returned from Firestore readers (Admin or Web SDK). */
export type PublishedPostWithId = CmsPost & { id: string };

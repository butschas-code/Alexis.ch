/**
 * Where the file came from in the product (drives Storage path prefix + filters).
 * `submission` / `source` are ready for Search-Brief / form uploads from APIs or admin.
 */
export type MediaKind = "hero" | "body" | "general" | "submission";

export type MediaListItem = {
  id: string;
  storagePath: string;
  downloadUrl: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
  postId: string | null;
  source: string | null;
  createdAt: string | null;
};

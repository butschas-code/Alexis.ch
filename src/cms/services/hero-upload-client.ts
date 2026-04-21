"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { recordMediaAsset } from "@/cms/services/media-client";
import { getCmsStorage } from "@/firebase/storage";

function safeFileSegment(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

/**
 * Upload a hero image for a post. Storage rules must allow `cms/heroes/{postId}/*` for authed users.
 * Registers the asset in the `media` collection for the Medienbibliothek.
 */
export async function uploadHeroImage(postId: string, file: File): Promise<{ url: string; path: string }> {
  const storage = getCmsStorage();
  if (!storage) throw new Error("Firebase Storage ist nicht konfiguriert.");
  const path = `cms/heroes/${postId}/${Date.now()}-${safeFileSegment(file.name)}`;
  const r = ref(storage, path);
  await uploadBytes(r, file, { contentType: file.type || "application/octet-stream" });
  const url = await getDownloadURL(r);
  try {
    await recordMediaAsset({
      storagePath: path,
      downloadUrl: url,
      originalFileName: file.name,
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      kind: "hero",
      postId,
      source: null,
    });
  } catch {
    /* Medien-Metadaten optional — Upload bleibt gültig */
  }
  return { url, path };
}

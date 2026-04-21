"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { recordMediaAsset } from "@/cms/services/media-client";
import { getCmsStorage } from "@/firebase/storage";

function safeFileSegment(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

/**
 * Inline images in post body (Storage path separate from hero banner).
 * Registers `kind: body` in `media` for the Medienbibliothek.
 */
export async function uploadPostBodyImage(postId: string, file: File): Promise<string> {
  const storage = getCmsStorage();
  if (!storage) throw new Error("Firebase Storage ist nicht konfiguriert.");
  const path = `cms/posts/${postId}/body/${Date.now()}-${safeFileSegment(file.name)}`;
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
      kind: "body",
      postId,
      source: null,
    });
  } catch {
    /* optional metadata */
  }
  return url;
}

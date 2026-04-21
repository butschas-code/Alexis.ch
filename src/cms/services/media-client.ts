"use client";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { COLLECTIONS } from "../firestore/collections";
import type { MediaKind, MediaListItem } from "../types/media";
import { getCmsFirestore } from "@/firebase/firestore";
import { getCmsStorage } from "@/firebase/storage";

export type { MediaKind, MediaListItem } from "../types/media";

export type RecordMediaAssetInput = {
  storagePath: string;
  downloadUrl: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: MediaKind;
  postId?: string | null;
  /** e.g. executive_search, contact — for form/brief pipelines */
  source?: string | null;
};

function safeFileSegment(name: string) {
  return name.replace(/[^\w.\-]+/g, "_").slice(0, 120);
}

function folderForKind(kind: MediaKind): string {
  if (kind === "general") return "library";
  return kind;
}

function toIso(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string") return v;
  return null;
}

/**
 * Writes a `media` Firestore row after a successful Storage upload (or registers legacy paths).
 */
export async function recordMediaAsset(input: RecordMediaAssetInput): Promise<string> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firestore ist nicht konfiguriert.");
  const refDoc = await addDoc(collection(db, COLLECTIONS.media), {
    storagePath: input.storagePath,
    downloadUrl: input.downloadUrl,
    originalFileName: input.originalFileName,
    mimeType: input.mimeType,
    sizeBytes: input.sizeBytes,
    kind: input.kind,
    postId: input.postId ?? null,
    source: input.source ?? null,
    createdAt: serverTimestamp(),
  });
  return refDoc.id;
}

export type ListMediaOptions = {
  kind?: MediaKind | "all";
  max?: number;
};

export async function listMediaForAdmin(opts: ListMediaOptions = {}): Promise<MediaListItem[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const max = opts.max ?? 150;
  const constraints: QueryConstraint[] = [];
  if (opts.kind && opts.kind !== "all") {
    constraints.push(where("kind", "==", opts.kind));
  }
  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(max));
  const snap = await getDocs(query(collection(db, COLLECTIONS.media), ...constraints));
  return snap.docs.map((d) => {
    const x = d.data() as Record<string, unknown>;
    const kindRaw = x.kind;
    const kind: MediaKind =
      kindRaw === "hero" || kindRaw === "body" || kindRaw === "submission" || kindRaw === "general"
        ? kindRaw
        : "general";
    return {
      id: d.id,
      storagePath: String(x.storagePath ?? ""),
      downloadUrl: String(x.downloadUrl ?? ""),
      originalFileName: String(x.originalFileName ?? ""),
      mimeType: String(x.mimeType ?? "application/octet-stream"),
      sizeBytes: typeof x.sizeBytes === "number" ? x.sizeBytes : 0,
      kind,
      postId: x.postId != null ? String(x.postId) : null,
      source: x.source != null ? String(x.source) : null,
      createdAt: toIso(x.createdAt),
    };
  });
}

export async function deleteMediaAsset(docId: string): Promise<void> {
  const db = getCmsFirestore();
  const storage = getCmsStorage();
  if (!db || !storage) throw new Error("Firebase ist nicht konfiguriert.");
  const dref = doc(db, COLLECTIONS.media, docId);
  const snap = await getDoc(dref);
  if (!snap.exists()) return;
  const data = snap.data() as { storagePath?: string };
  const path = data.storagePath;
  if (path) {
    try {
      await deleteObject(ref(storage, path));
    } catch {
      /* already removed or rule edge */
    }
  }
  await deleteDoc(dref);
}

export type UploadMediaOptions = {
  kind: MediaKind;
  postId?: string | null;
  source?: string | null;
  onProgress?: (percent: number) => void;
};

/**
 * Uploads to `cms/media/{library|hero|body|submission}/…` and creates the `media` document.
 */
export async function uploadMediaFile(file: File, opts: UploadMediaOptions): Promise<{ id: string; url: string; path: string }> {
  const storage = getCmsStorage();
  if (!storage) throw new Error("Firebase Storage ist nicht konfiguriert.");

  const folder = folderForKind(opts.kind);
  const path = `cms/media/${folder}/${Date.now()}-${safeFileSegment(file.name)}`;
  const r = ref(storage, path);
  const task = uploadBytesResumable(r, file, {
    contentType: file.type || "application/octet-stream",
  });

  await new Promise<void>((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        const total = snap.totalBytes;
        const pct = total > 0 ? Math.round((100 * snap.bytesTransferred) / total) : 0;
        opts.onProgress?.(pct);
      },
      reject,
      () => resolve(),
    );
  });

  const url = await getDownloadURL(task.snapshot.ref);
  const id = await recordMediaAsset({
    storagePath: path,
    downloadUrl: url,
    originalFileName: file.name,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    kind: opts.kind,
    postId: opts.postId ?? null,
    source: opts.source ?? null,
  });
  opts.onProgress?.(100);
  return { id, url, path };
}

"use client";

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { AUTHOR_DOCUMENT_FIELDS } from "../firestore/schema";
import { COLLECTIONS } from "../firestore/collections";
import type { Author } from "../types/author";
import { getCmsFirestore } from "@/firebase/firestore";

function toIso(v: unknown): string {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string" && v.length > 0) return v;
  return new Date().toISOString();
}

export function mapAuthorDoc(id: string, data: Record<string, unknown>): Author & { id: string } {
  const imageUrlRaw = data[AUTHOR_DOCUMENT_FIELDS.imageUrl];
  return {
    id,
    name: String(data[AUTHOR_DOCUMENT_FIELDS.name] ?? id),
    role: String(data[AUTHOR_DOCUMENT_FIELDS.role] ?? ""),
    imageUrl: imageUrlRaw != null && String(imageUrlRaw).length > 0 ? String(imageUrlRaw) : null,
    bio: data[AUTHOR_DOCUMENT_FIELDS.bio] == null ? null : String(data[AUTHOR_DOCUMENT_FIELDS.bio]),
    slug:
      data[AUTHOR_DOCUMENT_FIELDS.slug] != null && String(data[AUTHOR_DOCUMENT_FIELDS.slug]).length > 0
        ? String(data[AUTHOR_DOCUMENT_FIELDS.slug])
        : undefined,
    email: data[AUTHOR_DOCUMENT_FIELDS.email] == null ? null : String(data[AUTHOR_DOCUMENT_FIELDS.email]),
    authUid:
      data[AUTHOR_DOCUMENT_FIELDS.authUid] == null ? null : String(data[AUTHOR_DOCUMENT_FIELDS.authUid]),
    createdAt: toIso(data[AUTHOR_DOCUMENT_FIELDS.createdAt]),
    updatedAt: toIso(data[AUTHOR_DOCUMENT_FIELDS.updatedAt]),
  };
}

function snapToRow(snap: QueryDocumentSnapshot): Author & { id: string } {
  return mapAuthorDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function listAuthorsAdmin(max = 500): Promise<Array<Author & { id: string }>> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(collection(db, COLLECTIONS.authors), limit(max));
  const snap = await getDocs(q);
  const rows = snap.docs.map(snapToRow);
  rows.sort((a, b) => a.name.localeCompare(b.name, "de"));
  return rows;
}

export async function getAuthorForAdmin(id: string): Promise<(Author & { id: string }) | null> {
  const db = getCmsFirestore();
  if (!db) return null;
  const ref = doc(db, COLLECTIONS.authors, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapAuthorDoc(snap.id, snap.data() as Record<string, unknown>);
}

export type AuthorUpsertInput = {
  id: string;
  name: string;
  role: string;
  imageUrl: string | null;
  bio: string;
};

export async function saveAuthor(input: AuthorUpsertInput): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");

  const ref = doc(db, COLLECTIONS.authors, input.id);
  const existing = await getDoc(ref);

  const payload: Record<string, unknown> = {
    [AUTHOR_DOCUMENT_FIELDS.name]: input.name.trim(),
    [AUTHOR_DOCUMENT_FIELDS.role]: input.role.trim(),
    [AUTHOR_DOCUMENT_FIELDS.imageUrl]: input.imageUrl?.trim() || null,
    [AUTHOR_DOCUMENT_FIELDS.bio]: input.bio.trim() || null,
    [AUTHOR_DOCUMENT_FIELDS.updatedAt]: serverTimestamp(),
  };

  if (!existing.exists()) {
    payload[AUTHOR_DOCUMENT_FIELDS.createdAt] = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
}

export function newAuthorId(): string {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  return doc(collection(db, COLLECTIONS.authors)).id;
}

export async function deleteAuthor(id: string): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  await deleteDoc(doc(db, COLLECTIONS.authors, id));
}

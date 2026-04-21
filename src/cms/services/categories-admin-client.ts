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
import { CATEGORY_DOCUMENT_FIELDS } from "../firestore/schema";
import { COLLECTIONS } from "../firestore/collections";
import type { Category } from "../types/category";
import type { CategorySiteKey } from "../types/category-site";
import { getCmsFirestore } from "@/firebase/firestore";
import { normalizeCategorySite } from "@/lib/cms/normalize-category-site";

function toIso(v: unknown): string {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string" && v.length > 0) return v;
  return new Date().toISOString();
}

export function mapCategoryDoc(
  id: string,
  data: Record<string, unknown>,
): Category & { id: string } {
  const siteRaw = String(data[CATEGORY_DOCUMENT_FIELDS.site] ?? data.siteScope ?? "abexis");
  return {
    id,
    name: String(data[CATEGORY_DOCUMENT_FIELDS.name] ?? id),
    slug: String(data[CATEGORY_DOCUMENT_FIELDS.slug] ?? id),
    site: normalizeCategorySite(siteRaw),
    description:
      data[CATEGORY_DOCUMENT_FIELDS.description] == null
        ? null
        : String(data[CATEGORY_DOCUMENT_FIELDS.description]),
    sortOrder:
      typeof data[CATEGORY_DOCUMENT_FIELDS.sortOrder] === "number"
        ? (data[CATEGORY_DOCUMENT_FIELDS.sortOrder] as number)
        : 0,
    createdAt: toIso(data[CATEGORY_DOCUMENT_FIELDS.createdAt]),
    updatedAt: toIso(data[CATEGORY_DOCUMENT_FIELDS.updatedAt]),
  };
}

function snapToRow(snap: QueryDocumentSnapshot): Category & { id: string } {
  return mapCategoryDoc(snap.id, snap.data() as Record<string, unknown>);
}

export async function listCategoriesAdmin(max = 500): Promise<Array<Category & { id: string }>> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(collection(db, COLLECTIONS.categories), limit(max));
  const snap = await getDocs(q);
  const rows = snap.docs.map(snapToRow);
  rows.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name, "de"));
  return rows;
}

export async function getCategoryForAdmin(id: string): Promise<(Category & { id: string }) | null> {
  const db = getCmsFirestore();
  if (!db) return null;
  const ref = doc(db, COLLECTIONS.categories, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return mapCategoryDoc(snap.id, snap.data() as Record<string, unknown>);
}

export type CategoryUpsertInput = {
  id: string;
  name: string;
  slug: string;
  site: CategorySiteKey;
};

export async function saveCategory(input: CategoryUpsertInput): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");

  const ref = doc(db, COLLECTIONS.categories, input.id);
  const existing = await getDoc(ref);

  const payload: Record<string, unknown> = {
    [CATEGORY_DOCUMENT_FIELDS.name]: input.name.trim(),
    [CATEGORY_DOCUMENT_FIELDS.slug]: input.slug.trim().toLowerCase(),
    [CATEGORY_DOCUMENT_FIELDS.site]: input.site,
    [CATEGORY_DOCUMENT_FIELDS.updatedAt]: serverTimestamp(),
  };

  if (!existing.exists()) {
    payload[CATEGORY_DOCUMENT_FIELDS.createdAt] = serverTimestamp();
    payload[CATEGORY_DOCUMENT_FIELDS.description] = null;
    payload[CATEGORY_DOCUMENT_FIELDS.sortOrder] = 0;
  }

  await setDoc(ref, payload, { merge: true });
}

export function newCategoryId(): string {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  return doc(collection(db, COLLECTIONS.categories)).id;
}

export async function deleteCategory(id: string): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");
  await deleteDoc(doc(db, COLLECTIONS.categories, id));
}

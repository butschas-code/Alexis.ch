"use client";

import { collection, getDocs, limit, query } from "firebase/firestore";
import { COLLECTIONS } from "../firestore/collections";
import { getCmsFirestore } from "@/firebase/firestore";
import { normalizeCategorySite } from "@/lib/cms/normalize-category-site";
import type { CategorySiteKey } from "@/cms/types/category-site";

export type AuthorOption = { id: string; name: string };
export type CategoryOption = { id: string; name: string; site: CategorySiteKey };

export async function listAuthorsForAdmin(max = 100): Promise<AuthorOption[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(collection(db, COLLECTIONS.authors), limit(max));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => ({
    id: d.id,
    name: String((d.data() as { name?: string }).name ?? d.id),
  }));
  rows.sort((a, b) => a.name.localeCompare(b.name, "de"));
  return rows.slice(0, max);
}

export async function listCategoriesForAdmin(max = 100): Promise<CategoryOption[]> {
  const db = getCmsFirestore();
  if (!db) return [];
  const q = query(collection(db, COLLECTIONS.categories), limit(max));
  const snap = await getDocs(q);
  const rows = snap.docs.map((d) => {
    const data = d.data() as { name?: string; site?: string; siteScope?: string; sortOrder?: number };
    const site = normalizeCategorySite(data.site ?? data.siteScope);
    return {
      id: d.id,
      name: String(data.name ?? d.id),
      site,
      sortOrder: typeof data.sortOrder === "number" ? data.sortOrder : 0,
    };
  });
  rows.sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name));
  return rows.slice(0, max).map((row) => ({ id: row.id, name: row.name, site: row.site }));
}

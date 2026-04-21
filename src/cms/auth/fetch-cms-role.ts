"use client";

import { doc, getDoc } from "firebase/firestore";
import { COLLECTIONS } from "@/cms/firestore/collections";
import type { AppUserRole } from "@/cms/types/enums";
import { getCmsFirestore } from "@/firebase/firestore";

/**
 * Loads `users/{uid}.role` from Firestore (shape: `AppUser` in `src/cms/types/user.ts`).
 * Returns `null` if the document does not exist.
 * Missing profile: callers may default to `"editor"` so bestehende Konten nicht ausgesperrt werden.
 * TODO: optionally merge Custom Claims `role` if introduced for consistency with server checks.
 */
export async function fetchCmsUserRole(uid: string): Promise<AppUserRole | null> {
  const db = getCmsFirestore();
  if (!db) return null;
  const ref = doc(db, COLLECTIONS.users, uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const raw = snap.data()?.role;
  if (raw === "admin" || raw === "editor" || raw === "viewer") return raw;
  return null;
}

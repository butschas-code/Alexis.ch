"use client";

/**
 * Firestore helpers (client SDK). Security rules enforce access.
 *
 * Console: Firestore Database → Rules; Indexes → composite indexes from repo.
 */

import type { Firestore } from "firebase/firestore";
import { getFirebaseFirestore, isFirebaseClientConfigured } from "./client";

export function getCmsFirestore(): Firestore | null {
  return getFirebaseFirestore();
}

export function isCmsFirestoreAvailable(): boolean {
  return isFirebaseClientConfigured() && getFirebaseFirestore() != null;
}

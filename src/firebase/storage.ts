"use client";

/**
 * Storage helpers (client SDK). Upload rules must allow authenticated paths.
 *
 * Console: Storage → Rules; CORS only if uploading from another origin.
 */

import type { FirebaseStorage } from "firebase/storage";
import { getFirebaseStorage, isFirebaseClientConfigured } from "./client";

export function getCmsStorage(): FirebaseStorage | null {
  return getFirebaseStorage();
}

export function isCmsStorageAvailable(): boolean {
  return isFirebaseClientConfigured() && getFirebaseStorage() != null;
}

"use client";

import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { parseSiteSettingsReplace } from "@/cms/schema";
import { SETTINGS_DOCUMENT_FIELDS } from "../firestore/schema";
import { COLLECTIONS } from "../firestore/collections";
import type { SiteSettingsReplaceInput } from "../types/dto";
import { CMS_SETTINGS_GLOBAL_DOC_ID } from "../types/settings";
import { getCmsFirestore } from "@/firebase/firestore";
import { mergeSiteSettingsForForm } from "@/lib/cms/site-settings-defaults";

const EMPTY_CONTACT = {
  businessName: null,
  email: null,
  phone: null,
  addressLines: [] as string[],
  headline: null,
};

const EMPTY_SEO = {
  defaultTitle: null,
  defaultMetaDescription: null,
  titleSuffix: null,
  ogType: "website" as const,
};

function migrateFirestoreSettings(rest: Record<string, unknown>): Record<string, unknown> {
  const o = { ...rest };

  if (!o.footer || typeof o.footer !== "object") {
    o.footer = { copyrightHtml: null, legalLinks: [], columns: [] };
  }
  if (!Array.isArray(o.socialLinks)) o.socialLinks = [];
  if (!Array.isArray(o.switchBarLinks)) o.switchBarLinks = [];

  const seoBy = o.seoBySite as Record<string, unknown> | undefined;
  const hasSeo = seoBy && (seoBy.abexis != null || seoBy.search != null);
  if (!hasSeo && o.defaultSeo && typeof o.defaultSeo === "object") {
    const ds = o.defaultSeo as Record<string, unknown>;
    const block = {
      defaultTitle: null,
      defaultMetaDescription: ds.defaultDescription ?? null,
      titleSuffix: ds.titleSuffix ?? null,
      ogType: ds.ogType === "article" ? ("article" as const) : ("website" as const),
    };
    o.seoBySite = { abexis: { ...block }, search: { ...block } };
  }
  if (!o.seoBySite || typeof o.seoBySite !== "object") o.seoBySite = {};

  const seoSite = o.seoBySite as Record<string, unknown>;
  const nextSeo: Record<string, unknown> = {};
  for (const k of ["abexis", "search"] as const) {
    const block = seoSite[k];
    if (block != null && typeof block === "object") {
      nextSeo[k] = { ...EMPTY_SEO, ...(block as object) };
    }
  }
  o.seoBySite = nextSeo;

  const cbs = { ...((o.contactBySite ?? {}) as Record<string, unknown>) };
  for (const k of ["abexis", "search"] as const) {
    const block = cbs[k];
    if (block != null && typeof block === "object") {
      cbs[k] = { ...EMPTY_CONTACT, ...(block as object) };
    }
  }
  o.contactBySite = cbs;

  return o;
}

function toIso(v: unknown): string | null {
  if (v && typeof (v as { toDate?: () => Date }).toDate === "function") {
    return (v as { toDate: () => Date }).toDate().toISOString();
  }
  if (typeof v === "string" && v.length > 0) return v;
  return null;
}

function coerceContactEmailAndNulls(input: SiteSettingsReplaceInput): SiteSettingsReplaceInput {
  const next = structuredClone(input);
  const trimOrNull = (s: string | null | undefined): string | null => {
    if (s == null) return null;
    const t = s.trim();
    return t === "" ? null : t;
  };

  for (const site of ["abexis", "search"] as const) {
    const b = next.contactBySite?.[site];
    if (b) {
      b.businessName = trimOrNull(b.businessName);
      b.email = trimOrNull(b.email);
      b.phone = trimOrNull(b.phone);
      b.headline = trimOrNull(b.headline);
      b.addressLines = (b.addressLines ?? []).map((line) => line.trim()).filter((line) => line.length > 0);
    }
  }

  for (const site of ["abexis", "search"] as const) {
    const s = next.seoBySite?.[site];
    if (s) {
      s.defaultTitle = trimOrNull(s.defaultTitle);
      s.defaultMetaDescription = trimOrNull(s.defaultMetaDescription);
      s.titleSuffix = trimOrNull(s.titleSuffix);
    }
  }

  if (next.footer) {
    next.footer.copyrightHtml = trimOrNull(next.footer.copyrightHtml);
    next.footer.legalLinks = (next.footer.legalLinks ?? []).map((l) => ({
      label: l.label.trim(),
      href: l.href.trim(),
    }));
    next.footer.columns = (next.footer.columns ?? []).map((c) => ({
      title: trimOrNull(c.title),
      bodyHtml: trimOrNull(c.bodyHtml),
    }));
  }

  next.socialLinks = (next.socialLinks ?? []).map((l, i) => ({
    label: l.label.trim(),
    href: l.href.trim(),
    order: typeof l.order === "number" ? l.order : i,
  }));

  next.switchBarLinks = (next.switchBarLinks ?? []).map((l, i) => ({
    label: l.label.trim(),
    href: l.href.trim(),
    site: l.site,
    order: typeof l.order === "number" ? l.order : i,
  }));

  if (next.defaultSeo) {
    next.defaultSeo.titleSuffix = trimOrNull(next.defaultSeo.titleSuffix);
    next.defaultSeo.defaultDescription = trimOrNull(next.defaultSeo.defaultDescription);
  }

  return next;
}

export type LoadedSiteSettings = {
  settings: SiteSettingsReplaceInput;
  createdAt: string | null;
  updatedAt: string | null;
};

export async function getSiteSettingsForAdmin(): Promise<LoadedSiteSettings | null> {
  const db = getCmsFirestore();
  if (!db) return null;

  const ref = doc(db, COLLECTIONS.settings, CMS_SETTINGS_GLOBAL_DOC_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }

  const raw = snap.data() as Record<string, unknown>;
  const createdAt = toIso(raw[SETTINGS_DOCUMENT_FIELDS.createdAt]);
  const updatedAt = toIso(raw[SETTINGS_DOCUMENT_FIELDS.updatedAt]);

  const rest: Record<string, unknown> = { ...raw };
  delete rest[SETTINGS_DOCUMENT_FIELDS.createdAt];
  delete rest[SETTINGS_DOCUMENT_FIELDS.updatedAt];
  const migrated = migrateFirestoreSettings(rest);
  const parsed = parseSiteSettingsReplace(migrated);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    return {
      settings: mergeSiteSettingsForForm(null),
      createdAt,
      updatedAt,
    };
  }

  return {
    settings: mergeSiteSettingsForForm(parsed.data),
    createdAt,
    updatedAt,
  };
}

export async function saveSiteSettings(
  input: SiteSettingsReplaceInput,
  options: { hadExistingDoc: boolean },
): Promise<void> {
  const db = getCmsFirestore();
  if (!db) throw new Error("Firebase ist nicht konfiguriert.");

  const coerced = coerceContactEmailAndNulls(input);
  const parsed = parseSiteSettingsReplace(coerced);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((e) => e.message).join(" · ");
    throw new Error(msg || "Validierung fehlgeschlagen.");
  }

  const ref = doc(db, COLLECTIONS.settings, CMS_SETTINGS_GLOBAL_DOC_ID);
  const d = parsed.data;
  const payload: Record<string, unknown> = {
    [SETTINGS_DOCUMENT_FIELDS.contactBySite]: d.contactBySite,
    [SETTINGS_DOCUMENT_FIELDS.footer]: d.footer,
    [SETTINGS_DOCUMENT_FIELDS.seoBySite]: d.seoBySite,
    [SETTINGS_DOCUMENT_FIELDS.socialLinks]: d.socialLinks,
    [SETTINGS_DOCUMENT_FIELDS.switchBarLinks]: d.switchBarLinks,
    [SETTINGS_DOCUMENT_FIELDS.updatedAt]: serverTimestamp(),
  };

  if (d.defaultSeo !== undefined) {
    payload[SETTINGS_DOCUMENT_FIELDS.defaultSeo] = d.defaultSeo;
  }

  if (!options.hadExistingDoc) {
    payload[SETTINGS_DOCUMENT_FIELDS.createdAt] = serverTimestamp();
  }

  await setDoc(ref, payload, { merge: true });
}

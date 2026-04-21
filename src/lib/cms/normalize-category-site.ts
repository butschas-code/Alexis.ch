import type { CategorySiteKey } from "@/cms/types/category-site";

/** Maps Firestore / legacy values to `CategorySiteKey`. */
export function normalizeCategorySite(raw: string | undefined | null): CategorySiteKey {
  const s = String(raw ?? "").trim().toLowerCase();
  if (s === "abexis" || s === "search" || s === "shared") return s;
  if (s === "both") return "shared";
  return "abexis";
}

export function categorySiteLabel(key: CategorySiteKey): string {
  if (key === "abexis") return "abexis";
  if (key === "search") return "search";
  return "shared";
}

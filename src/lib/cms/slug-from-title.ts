/**
 * Builds a URL slug from a human title (German-friendly, unicode letters).
 * Result should satisfy `slugSegment` in `@/cms/schema/common` in typical cases.
 */
export function slugFromTitle(title: string, maxLength = 200): string {
  const raw = title
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u00C0-\u024F\u1E00-\u1EFF]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const base = raw.slice(0, maxLength).replace(/^-|-$/g, "");
  return base || "beitrag";
}

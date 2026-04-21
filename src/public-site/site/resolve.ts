import type { PublicDeploymentSite } from "./keys";
import { headers } from "next/headers";

const ENV_CMS_SITE = "NEXT_PUBLIC_CMS_SITE_ID" as const;

/** Optional comma-separated **substrings** matched against `Host` / `X-Forwarded-Host` (case-insensitive). */
const ENV_SEARCH_HOSTS = "NEXT_PUBLIC_SEARCH_SITE_HOST_HINTS" as const;

/**
 * Default substrings that imply the **search** deployment when seen in the request hostname.
 * Override or extend with `NEXT_PUBLIC_SEARCH_SITE_HOST_HINTS` (comma-separated).
 */
const DEFAULT_SEARCH_HOST_HINTS = ["abexis-search", "search.abexis"] as const;

function normalizeHost(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const first = raw.split(",")[0]?.trim();
  if (!first) return null;
  return first.toLowerCase();
}

function parseHintList(): string[] {
  const extra = process.env[ENV_SEARCH_HOSTS];
  if (!extra?.trim()) return [];
  return extra
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * If the hostname suggests the Executive Search surface, return `search`.
 * Safe for local dev: set env or add `localhost` hints only if needed.
 */
export function resolveDeploymentSiteFromHost(host: string | null | undefined): PublicDeploymentSite | null {
  const h = normalizeHost(host);
  if (!h) return null;

  const hints = [...DEFAULT_SEARCH_HOST_HINTS, ...parseHintList()];
  for (const hint of hints) {
    if (h.includes(hint)) return "search";
  }
  return null;
}

/**
 * **Config-first** deployment key — always available (build, API, Workers without request).
 * Set per project: `NEXT_PUBLIC_CMS_SITE_ID=abexis` | `search`.
 */
export function getDeploymentSiteFromEnv(): PublicDeploymentSite {
  const v = process.env[ENV_CMS_SITE];
  if (v === "search") return "search";
  return "abexis";
}

/**
 * **Full resolution (async):** request hostname (when in a Next.js Server context) → env fallback.
 * Use for Firestore filters on public pages so preview domains / split hostnames work without redeploying.
 *
 * - Tries `x-forwarded-host` then `host`.
 * - If host matches search hints → `search`.
 * - Otherwise uses **`getDeploymentSiteFromEnv()`** (canonical for static builds).
 */
export async function getResolvedPublicDeploymentSite(): Promise<PublicDeploymentSite> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host");
    const fromHost = resolveDeploymentSiteFromHost(host);
    if (fromHost) return fromHost;
  } catch {
    /* `headers()` unavailable outside a request (e.g. some scripts) */
  }
  return getDeploymentSiteFromEnv();
}

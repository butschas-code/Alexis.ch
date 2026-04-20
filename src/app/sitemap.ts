import type { MetadataRoute } from "next";
import { fokusthemenMeta, getAllBlogPosts, teamOrder } from "@/data/pages";

const base = "https://www.abexis.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "/",
    "/leistungen",
    "/leistungen/executive-search",
    "/blog",
    "/ueber-uns",
    "/kontakt",
    "/termin",
    "/projectfitcheck",
    "/legal-policy",
    "/privacy-policy",
    "/en/home",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "/" ? 1 : 0.7,
  }));

  const fokus = fokusthemenMeta.map((f) => ({
    url: `${base}${f.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const team = teamOrder.map((p) => ({
    url: `${base}/${p}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.55,
  }));

  const posts = getAllBlogPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.publishedISO ? new Date(p.publishedISO) : new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...fokus, ...team, ...posts];
}

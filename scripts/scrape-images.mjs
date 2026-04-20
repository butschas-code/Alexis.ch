/**
 * Extrahiert Bild-URLs (img src, background-image) von zentralen abexis.ch-Seiten.
 * Ausgabe: src/data/scraped-images-raw.json
 */
import { writeFileSync } from "node:fs";
import { load } from "cheerio";

const urls = [
  "https://www.abexis.ch/",
  "https://www.abexis.ch/fokusthemen/digitale-transformation",
  "https://www.abexis.ch/fokusthemen/unternehmensstrategie",
  "https://www.abexis.ch/fokusthemen/vertriebmarketing",
  "https://www.abexis.ch/fokusthemen/ver%C3%A4nderungsmanagement",
  "https://www.abexis.ch/fokusthemen/prozessoptimierung",
  "https://www.abexis.ch/fokusthemen/projektmanagement",
  "https://www.abexis.ch/projectfitcheck",
  "https://www.abexis.ch/blog",
  "https://www.abexis.ch/danielsengstag",
];

function abs(u) {
  if (!u) return null;
  if (u.startsWith("//")) return "https:" + u;
  if (u.startsWith("/")) return "https://www.abexis.ch" + u;
  return u;
}

function extract(html) {
  const $ = load(html);
  const set = new Set();
  const add = (u) => {
    const a = abs(u);
    if (!a) return;
    if (!a.includes("hoststar") && !a.includes("designer")) return;
    set.add(a.split("?")[0]);
  };
  $("img[src]").each((_, el) => add($(el).attr("src")));
  $("img[data-src]").each((_, el) => add($(el).attr("data-src")));
  $("[style*='background-image']").each((_, el) => {
    const s = $(el).attr("style") || "";
    const m = s.match(/url\(['"]?([^'")\s]+)['"]?\)/i);
    if (m) add(m[1]);
  });
  return [...set];
}

async function main() {
  const out = {};
  for (const u of urls) {
    const html = await (await fetch(u)).text();
    out[u] = extract(html);
    console.log(u, out[u].length);
  }
  writeFileSync(new URL("../src/data/scraped-images-raw.json", import.meta.url), JSON.stringify(out, null, 2));
  console.log("Wrote scraped-images-raw.json");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

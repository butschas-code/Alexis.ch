/**
 * Bild-URLs von abexis.ch (files.designer.hoststar.ch), per Scrape der Live-Seiten ermittelt.
 * Rohdaten: `src/data/scraped-images-raw.json` (z. B. mit `node scripts/scrape-images.mjs` erneuern).
 */
import scrapedRaw from "./scraped-images-raw.json";

const scraped = scrapedRaw as Record<string, string[]>;
const HOME = scraped["https://www.abexis.ch/"]!;
const BLOG_PAGE = scraped["https://www.abexis.ch/blog"]!;

/** Logo oben links (Original-Website) */
export const logoUrl = HOME[0];

/** Dekoratives Element von der Startseite (optional als Textur) */
export const homeTextureBar = HOME[1];

/** Kachel-Bilder der sechs Fokusthemen, Reihenfolge wie auf der alten Startseite */
export const serviceCardImages = {
  "digitale-transformation": HOME[2],
  unternehmensstrategie: HOME[3],
  vertriebmarketing: HOME[4],
  veränderungsmanagement: HOME[5],
  prozessoptimierung: HOME[6],
  projektmanagement: HOME[7],
} as const;

/** Breites Teaser-Bild unter der Blog-Liste (nicht HOME[8] / 68671b2e — dort früheres Blog-Teaser) */
export const homeBlogTeaserImage = HOME[29];

/**
 * Sechs «Kundenstatement»-Grafiken aus der Startseiten-Slideshow (Reihenfolge wie auf abexis.ch).
 * Entspricht den `responsiveslideshow`-Figuren auf der Live-Seite — Zitat und Signatur sind im Bild enthalten.
 */
export const homeCustomerStatements = HOME.slice(9, 15);

/** Team-Portraits (Reihenfolge wie auf der alten Startseite) */
export const teamPortraitOrder = HOME.slice(15, 21);

/**
 * Partner-Logos für «Partnerschaften»-Banner, in derselben Reihenfolge wie `footerPartners` in `pages.ts`.
 * Quelle: Homepage-Scrape (PNG-Reihe + Referenzlogos + ergänzende Assets).
 */
export const partnershipBannerLogos = [
  HOME[22],
  HOME[23],
  HOME[24],
  HOME[25],
  HOME[26],
  HOME[32],
  ...HOME.slice(9, 15),
  HOME[27],
  HOME[28],
  HOME[29],
] as const;

/** Grosse Hero-Fotos aus den Fokusthemen-Detailseiten (ohne Logo) */
export const fokusPageHeroImages = {
  "digitale-transformation": (scraped["https://www.abexis.ch/fokusthemen/digitale-transformation"] as string[])[1],
  unternehmensstrategie: (scraped["https://www.abexis.ch/fokusthemen/unternehmensstrategie"] as string[])[1],
  vertriebmarketing: (scraped["https://www.abexis.ch/fokusthemen/vertriebmarketing"] as string[])[1],
  veränderungsmanagement: (scraped["https://www.abexis.ch/fokusthemen/ver%C3%A4nderungsmanagement"] as string[])[1],
  prozessoptimierung: (scraped["https://www.abexis.ch/fokusthemen/prozessoptimierung"] as string[])[1],
  projektmanagement: (scraped["https://www.abexis.ch/fokusthemen/projektmanagement"] as string[])[1],
} as const;

/** Startseiten-Hero: markantes Bild aus «Digitale Transformation» */
export const homeHeroImage = fokusPageHeroImages["digitale-transformation"];

/** Project Fit Check – Visual aus der Originalseite */
export const projectFitVisual = (scraped["https://www.abexis.ch/projectfitcheck"] as string[])[2];

/** Blog-Übersicht: Cover-Thumbnails in Listenreihenfolge (ohne Logo) */
const blogCovers = BLOG_PAGE.filter((u) => !u.includes("9fa6de2e-48f4-4837-8a9b-43f06f5ecc7f"));

export function getBlogListCoverByIndex(index: number): string {
  return blogCovers[index % blogCovers.length] ?? homeBlogTeaserImage;
}

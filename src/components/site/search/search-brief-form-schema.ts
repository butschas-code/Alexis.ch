import { z } from "zod";

/** Mirrors server upload limits in `src/app/api/cms/v1/form-submissions/upload/route.ts`. */
export const SEARCH_BRIEF_MAX_FILES = 5;
export const SEARCH_BRIEF_MAX_BYTES_PER_FILE = 10 * 1024 * 1024;

export const ALLOWED_BRIEF_FILE_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "text/plain",
]);

export const searchBriefFormValuesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Bitte geben Sie Ihren Namen an.")
    .max(200, "Name ist zu lang."),
  company: z.string().trim().max(200, "Firmenname ist zu lang."),
  email: z.string().trim().email("Bitte geben Sie eine gültige E-Mail-Adresse an.").max(320),
  phone: z.string().trim().max(40),
  message: z
    .string()
    .trim()
    .min(40, "Bitte beschreiben Sie kurz Ihr Anliegen (mindestens ein paar Sätze).")
    .max(8000, "Text ist zu lang."),
  privacyAccepted: z.boolean().refine((v) => v === true, {
    message: "Bitte bestätigen Sie die Kenntnisnahme zur Datenschutzerklärung.",
  }),
});

export type SearchBriefFormValues = z.infer<typeof searchBriefFormValuesSchema>;

export function validateBriefFiles(files: File[]): string | null {
  if (files.length > SEARCH_BRIEF_MAX_FILES) {
    return `Maximal ${SEARCH_BRIEF_MAX_FILES} Dateien.`;
  }
  for (const f of files) {
    if (f.size > SEARCH_BRIEF_MAX_BYTES_PER_FILE) {
      return `Die Datei «${f.name}» überschreitet 10 MB.`;
    }
    const type = f.type || "application/octet-stream";
    if (!ALLOWED_BRIEF_FILE_MIME.has(type)) {
      return `Dateityp nicht erlaubt: ${f.name}. Erlaubt: PDF, Word, gängige Bildformate, TXT.`;
    }
  }
  return null;
}

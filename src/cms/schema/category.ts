import { z } from "zod";
import { categorySiteKeySchema, idString, slugSegment } from "./common";

export const categoryCreateInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  slug: slugSegment,
  site: categorySiteKeySchema,
  description: z.union([z.string().max(5000), z.null()]).default(null),
  sortOrder: z.number().int().min(0).max(1_000_000).default(0),
});

export const categoryUpdateInputSchema = categoryCreateInputSchema
  .partial()
  .extend({ id: idString })
  .refine((v) => Object.keys(v).length > 1, { message: "Mindestens ein Feld neben id muss gesetzt sein." });

export const categoryOutputSchema = categoryCreateInputSchema.extend({
  id: idString,
  createdAt: z.string().min(10).max(40),
  updatedAt: z.string().min(10).max(40),
});

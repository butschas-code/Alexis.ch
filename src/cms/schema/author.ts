import { z } from "zod";
import { idString, slugSegment } from "./common";

const nullableEmail = z.union([z.string().email().max(320), z.null()]).optional();

export const authorCreateInputSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  imageUrl: z.union([z.string().url().max(2000), z.null()]).default(null),
  bio: z.union([z.string().max(20_000), z.null()]).default(null),
  slug: slugSegment.optional(),
  email: nullableEmail,
  authUid: z.union([idString, z.null()]).optional(),
});

export const authorUpdateInputSchema = authorCreateInputSchema
  .partial()
  .extend({ id: idString })
  .refine((v) => Object.keys(v).length > 1, { message: "Mindestens ein Feld neben id muss gesetzt sein." });

export const authorOutputSchema = authorCreateInputSchema.extend({
  id: idString,
  createdAt: z.string().min(10).max(40),
  updatedAt: z.string().min(10).max(40),
});

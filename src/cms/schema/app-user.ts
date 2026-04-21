import { z } from "zod";
import { appUserRoleSchema, idString } from "./common";

export const appUserCreateInputSchema = z.object({
  uid: idString,
  email: z.string().email().max(320),
  role: appUserRoleSchema.default("viewer"),
  displayName: z.string().trim().min(1).max(200),
});

export const appUserUpdateInputSchema = appUserCreateInputSchema
  .omit({ uid: true })
  .partial()
  .extend({ uid: idString })
  .refine((v) => Object.keys(v).length > 1, { message: "Mindestens ein Feld neben uid muss gesetzt sein." });

export const appUserOutputSchema = appUserCreateInputSchema.extend({
  createdAt: z.string().min(10).max(40),
  updatedAt: z.string().min(10).max(40),
});

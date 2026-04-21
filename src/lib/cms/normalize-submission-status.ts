import type { CmsSubmissionStatus } from "@/cms/types/enums";
import { CMS_SUBMISSION_STATUSES } from "@/cms/types/enums";

/** Map legacy Firestore values to the current status union. */
export function normalizeSubmissionStatus(raw: unknown): CmsSubmissionStatus {
  const s = String(raw ?? "").trim();
  if ((CMS_SUBMISSION_STATUSES as readonly string[]).includes(s)) return s as CmsSubmissionStatus;
  if (s === "in_review") return "reviewed";
  if (s === "closed") return "archived";
  return "new";
}

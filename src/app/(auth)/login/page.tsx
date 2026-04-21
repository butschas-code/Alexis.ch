import { CMS_PATHS } from "@/admin/paths";
import { redirect } from "next/navigation";

/** Canonical CMS login is under `/admin`. */
export default function LegacyLoginRedirectPage() {
  redirect(CMS_PATHS.authLogin);
}

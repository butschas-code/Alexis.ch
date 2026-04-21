import { redirect } from "next/navigation";
import { CMS_PATHS } from "@/admin/paths";

export default function AdminFormsRedirectPage() {
  redirect(CMS_PATHS.adminSubmissions);
}

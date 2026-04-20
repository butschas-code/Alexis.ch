import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";

export const metadata = { title: "Impressum" };

export default function LegalPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/impressum-body.html"), "utf8");
  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <SafeHtml html={html} />
    </article>
  );
}

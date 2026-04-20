import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";

export const metadata = { title: "Datenschutzerklärung" };

export default function PrivacyPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/privacy-bodies.html"), "utf8");
  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <SafeHtml html={html} />
    </article>
  );
}

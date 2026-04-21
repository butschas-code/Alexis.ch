import { readFileSync } from "node:fs";
import path from "node:path";
import { SafeHtml } from "@/components/content/SafeHtml";
import { InteriorPageLayout } from "@/components/site/InteriorPageLayout";

export const metadata = { title: "Datenschutzerklärung" };

export default function PrivacyPolicyPage() {
  const html = readFileSync(path.join(process.cwd(), "src/data/privacy-bodies.html"), "utf8");
  return (
    <InteriorPageLayout
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      maxWidth="1068"
      contentMaxWidth="3xl"
      contentClassName="pt-10 md:pt-12"
    >
      <SafeHtml html={html} />
    </InteriorPageLayout>
  );
}

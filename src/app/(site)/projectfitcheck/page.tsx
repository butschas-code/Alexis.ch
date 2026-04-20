import { notFound } from "next/navigation";
import { SafeHtml } from "@/components/content/SafeHtml";
import { MotionSection } from "@/components/motion/MotionSection";
import { getFokusthemaHtml } from "@/data/pages";

export const metadata = { title: "Project Fit Check" };

export default function ProjectFitCheckPage() {
  const html = getFokusthemaHtml("projectfitcheck");
  if (!html) {
    notFound();
  }
  return (
    <article className="mx-auto max-w-4xl px-5 py-14 md:py-18">
      <MotionSection>
        <SafeHtml html={html} />
      </MotionSection>
    </article>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import { SafeHtml } from "@/components/content/SafeHtml";
import { MotionSection } from "@/components/motion/MotionSection";
import { getAllBlogPosts, getBlogPostBySlug } from "@/data/pages";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  return { title: post?.title ?? "Blog" };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-5 py-14">
      <Link href="/blog" className="text-xs font-semibold uppercase tracking-widest text-[var(--brand2)] hover:underline">
        ← Blog
      </Link>
      <header className="mt-6 border-b border-[var(--line)] pb-8">
        <time className="text-xs uppercase tracking-widest text-[var(--muted)]">
          {post.publishedISO ? new Date(post.publishedISO).toLocaleDateString("de-CH") : ""}
        </time>
        <h1 className="mt-3 font-serif text-3xl text-[var(--brand)] md:text-4xl">{post.title}</h1>
        {post.tags?.length ? (
          <p className="mt-4 text-xs text-[var(--muted)]">
            Stichwörter: {post.tags.join(" · ")}
          </p>
        ) : null}
      </header>
      <MotionSection className="py-10">
        <SafeHtml html={post.bodyHtml} />
      </MotionSection>
    </article>
  );
}

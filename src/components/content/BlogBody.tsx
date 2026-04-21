import { parsePostBody } from "@/lib/cms/post-body-storage";
import { sanitizeBlogHtml } from "@/lib/cms/sanitize-blog-html";

type Props = {
  /** Firestore `posts.body` — JSON envelope or legacy HTML. */
  storedBody: string;
  className?: string;
};

/**
 * Renders CMS blog/article HTML with a predictable allowlist and typography.
 * Prefer this over `SafeHtml` for post bodies from the editor.
 */
export function BlogBody({ storedBody, className }: Props) {
  const { html } = parsePostBody(storedBody ?? "");
  const clean = sanitizeBlogHtml(html);
  return (
    <article
      className={className ?? "blog-prose legacy-prose max-w-none"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

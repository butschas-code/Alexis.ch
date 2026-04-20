import DOMPurify from "isomorphic-dompurify";

type Props = {
  html: string;
  className?: string;
};

/**
 * Sanitized legacy HTML (eigener migrierter Content).
 */
export function SafeHtml({ html, className }: Props) {
  const clean = DOMPurify.sanitize(html, {
    ADD_ATTR: ["style", "target", "rel", "datetime", "itemprop", "itemscope", "itemtype"],
    ALLOWED_URI_REGEXP:
      /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i,
  });
  return (
    <div
      className={className ?? "legacy-prose max-w-none"}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}

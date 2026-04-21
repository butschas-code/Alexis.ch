import DOMPurify from "isomorphic-dompurify";

/**
 * Strict allowlist for blog HTML from the CMS editor and legacy imports.
 * Keep in sync with TipTap output (StarterKit + Link + Image).
 */
const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "img",
  "span",
];

const ALLOWED_ATTR = ["href", "target", "rel", "src", "alt", "title", "class"];

const ALLOWED_URI_REGEXP =
  /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i;

export function sanitizeBlogHtml(html: string): string {
  return DOMPurify.sanitize(html || "", {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ADD_ATTR: ["loading"],
  });
}

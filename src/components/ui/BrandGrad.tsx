import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** `light`: dunkles Indigo → Cyan auf hellem Grund. `dark`: helles Gradient auf Hero. `banner`: auf farbigem CTA-Band. */
  variant?: "light" | "dark" | "banner";
  className?: string;
};

export function BrandGrad({ children, variant = "light", className = "" }: Props) {
  const base = "inline pb-[0.08em] leading-[inherit]";
  const byVariant =
    variant === "dark"
      ? "text-gradient-brand-hero"
      : variant === "banner"
        ? "bg-gradient-to-r from-white via-[#e8f8ff] to-[#8fe5f5] bg-clip-text text-transparent"
        : "text-gradient-brand";
  return <span className={`${base} ${byVariant} ${className}`.trim()}>{children}</span>;
}

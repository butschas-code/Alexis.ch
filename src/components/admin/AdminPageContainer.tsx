/**
 * Page chrome for CMS screens: consistent width and vertical rhythm (editorial, calm spacing).
 */

type AdminPageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminPageContainer({ children, className = "" }: AdminPageContainerProps) {
  return <div className={`mx-auto w-full max-w-[1180px] space-y-9 ${className}`}>{children}</div>;
}

type AdminPageHeaderProps = {
  title: string;
  description?: string;
  /** e.g. primary action button */
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, description, actions }: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-black/[0.05] pb-9 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 max-w-2xl space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--apple-text-tertiary)]">
          Redaktion
        </p>
        <h1 className="font-serif text-[1.65rem] font-medium leading-[1.15] tracking-[-0.02em] text-[var(--apple-text)] sm:text-[1.85rem]">
          {title}
        </h1>
        {description ? (
          <p className="max-w-prose text-[15px] leading-relaxed text-[var(--apple-text-secondary)]">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2.5 sm:gap-3">{actions}</div>
      ) : null}
    </div>
  );
}

type AdminPageSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function AdminPageSection({ children, className = "" }: AdminPageSectionProps) {
  return <section className={`space-y-5 ${className}`}>{children}</section>;
}

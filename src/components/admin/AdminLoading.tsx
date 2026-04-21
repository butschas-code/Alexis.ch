type AdminLoadingProps = {
  message?: string;
  /** Tighter vertical padding for tables or embedded use */
  compact?: boolean;
};

/**
 * Inline / full-region loading state with a soft pulse (no spinners).
 */
export function AdminLoading({ message = "Wird geladen…", compact }: AdminLoadingProps) {
  return (
    <div
      className={
        compact
          ? "flex flex-col items-center justify-center gap-3 py-10"
          : "flex min-h-[32vh] flex-col items-center justify-center gap-4 py-16"
      }
      role="status"
      aria-live="polite"
    >
      <div
        className="h-1 w-28 overflow-hidden rounded-full bg-black/[0.07]"
        aria-hidden
      >
        <div className="h-full w-2/5 rounded-full bg-[var(--brand-900)]/25 animate-pulse" />
      </div>
      <p className="text-sm text-[var(--apple-text-secondary)]">{message}</p>
    </div>
  );
}

type AdminContentSkeletonProps = {
  lines?: number;
};

/** Neutral blocks for dashboard cards or detail shells. */
export function AdminContentSkeleton({ lines = 3 }: AdminContentSkeletonProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm" aria-hidden>
      <div className="h-4 w-1/3 max-w-[200px] rounded-md bg-black/[0.06]" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 rounded-md bg-black/[0.05]"
          style={{ width: `${88 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

/** Full-width boot placeholder inside the admin chrome (auth or role resolution). */
export function AdminProtectedBootSkeleton({ title }: { title?: string }) {
  return (
    <div className="space-y-8">
      <AdminLoading message={title ?? "Wird geladen…"} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminContentSkeleton lines={5} />
        <AdminContentSkeleton lines={5} />
      </div>
    </div>
  );
}

/** Summary cards row while aggregate counts load. */
export function AdminDashboardSummarySkeleton() {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      aria-hidden
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-black/[0.06] bg-white px-5 py-5 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
        >
          <div className="h-3 w-24 rounded-md bg-black/[0.06]" />
          <div className="mt-3 h-8 w-16 rounded-md bg-black/[0.05]" />
          <div className="mt-2 h-3 w-28 rounded-md bg-black/[0.05]" />
        </div>
      ))}
    </div>
  );
}

/** Full dashboard placeholder (counts + site block + recent lists). */
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-live="polite">
      <AdminDashboardSummarySkeleton />
      <AdminContentSkeleton lines={3} />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminContentSkeleton lines={5} />
        <AdminContentSkeleton lines={5} />
      </div>
    </div>
  );
}

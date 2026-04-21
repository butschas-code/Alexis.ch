"use client";

import { useCmsAuth } from "@/cms/auth/cms-auth-context";
import { isCmsAdminRole } from "@/cms/auth/permissions";
import { LogoutButton } from "./LogoutButton";

type AdminHeaderProps = {
  onOpenMenu: () => void;
};

function roleLabel(role: string | null | undefined) {
  if (role === "admin") return "Administrator:in";
  if (role === "editor") return "Redakteur:in";
  if (role === "viewer") return "Leser:in";
  return "";
}

export function AdminHeader({ onOpenMenu }: AdminHeaderProps) {
  const { user, role } = useCmsAuth();
  const adminBadge = isCmsAdminRole(role);
  const email = user?.email ?? "";

  return (
    <header className="sticky top-0 z-30 flex h-[3.25rem] shrink-0 items-center justify-between gap-3 border-b border-black/[0.06] bg-[color-mix(in_srgb,var(--apple-bg-elevated)_92%,transparent)] px-4 backdrop-blur-[14px] supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--apple-bg-elevated)_78%,transparent)] lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-black/[0.07] bg-white/90 text-[var(--apple-text)] shadow-[0_1px_0_rgba(0,0,0,0.04)] lg:hidden"
          aria-label="Menü öffnen"
        >
          <span className="flex flex-col gap-1.5" aria-hidden>
            <span className="block h-px w-4 bg-current" />
            <span className="block h-px w-4 bg-current" />
            <span className="block h-px w-4 bg-current" />
          </span>
        </button>
        <div className="hidden min-w-0 sm:block lg:hidden">
          <p className="truncate text-xs font-medium uppercase tracking-[0.12em] text-[var(--apple-text-tertiary)]">
            Abexis Redaktion
          </p>
        </div>
      </div>

      <div className="flex min-w-0 max-w-[min(100%,420px)] flex-1 items-center justify-end gap-3 sm:gap-4">
        <div className="min-w-0 text-right">
          {email ? (
            <p className="truncate text-sm font-medium text-[var(--apple-text)]">{email}</p>
          ) : (
            <p className="text-sm text-[var(--apple-text-secondary)]">Angemeldet</p>
          )}
          {role ? (
            <p className="mt-0.5 truncate text-xs text-[var(--apple-text-tertiary)]">
              {roleLabel(role)}
              {adminBadge ? (
                <span className="ml-2 inline-block rounded border border-[var(--brand-900)]/20 bg-[var(--brand-900)]/[0.06] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-900)]">
                  Admin
                </span>
              ) : null}
            </p>
          ) : null}
        </div>
        <LogoutButton />
      </div>
    </header>
  );
}

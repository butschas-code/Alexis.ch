"use client";

import type { ReactNode } from "react";
import { LogoutButton } from "@/components/admin/LogoutButton";
import { useCmsAuth } from "./cms-auth-context";
import type { CmsPermission } from "./permissions";
import { roleHasPermission } from "./permissions";

type CmsPermissionGateProps = {
  /** All listed permissions must be satisfied (AND). */
  requireAll?: readonly CmsPermission[];
  /** Any listed permission is enough (OR). Ignored if `requireAll` is set. */
  requireAny?: readonly CmsPermission[];
  children: ReactNode;
  /** Optional title for the denial screen. */
  title?: string;
};

/**
 * Guards **client-rendered** CMS subtrees. Prefer explicit `requireAll` / `requireAny` over ad-hoc role strings.
 * Pair with server-side rules for sensitive writes (TODO in permissions.ts).
 */
export function CmsPermissionGate({
  requireAll,
  requireAny,
  children,
  title = "Kein Zugriff",
}: CmsPermissionGateProps) {
  const { user, role, ready } = useCmsAuth();

  if (!ready || user === undefined) {
    return (
      <div className="flex min-h-[32vh] items-center justify-center text-sm text-[var(--apple-text-secondary)]">
        Berechtigung wird geprüft…
      </div>
    );
  }

  let ok = false;
  if (requireAll !== undefined) {
    ok = requireAll.length > 0 && requireAll.every((p) => roleHasPermission(role, p));
  } else if (requireAny !== undefined) {
    ok = requireAny.length > 0 && requireAny.some((p) => roleHasPermission(role, p));
  } else {
    ok = false;
  }

  if (!ok) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200/90 bg-amber-50/95 p-8 shadow-sm">
        <h1 className="text-lg font-semibold text-amber-950">{title}</h1>
        <p className="mt-2 text-sm text-amber-900/90">
          Für diesen Bereich ist eine Administrator:in erforderlich. Wenden Sie sich bei Bedarf an die zuständige
          Person bei Abexis.
        </p>
        {user?.email ? (
          <p className="mt-4 text-xs text-amber-900/70">Angemeldet als: {user.email}</p>
        ) : null}
        <div className="mt-6">
          <LogoutButton label="Abmelden" variant="secondary" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

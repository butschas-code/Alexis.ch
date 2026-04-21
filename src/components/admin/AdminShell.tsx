"use client";

import { CmsAuthProvider } from "@/cms/auth/cms-auth-context";
import { AdminAuthGate } from "@/components/admin/AdminAuthGate";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--apple-bg)] text-[var(--apple-text)]">
      <CmsAuthProvider>
        <AdminAuthGate>{children}</AdminAuthGate>
      </CmsAuthProvider>
    </div>
  );
}

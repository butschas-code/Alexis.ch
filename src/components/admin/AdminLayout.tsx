"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const openMobileNav = useCallback(() => setMobileNavOpen(true), []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = () => {
      if (mq.matches) setMobileNavOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <div className="hidden w-[244px] shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 z-20 flex w-[244px] flex-col border-r border-black/[0.06] bg-[color-mix(in_srgb,#f6f4ef_94%,#faf9f6)]">
          <AdminSidebar />
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileNavOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-[#1d1d1f]/25 backdrop-blur-[2px] lg:hidden"
          aria-label="Menü schließen"
          onClick={closeMobileNav}
        />
      ) : null}

      <div
        className={
          mobileNavOpen
            ? "fixed inset-y-0 left-0 z-50 flex w-[min(288px,88vw)] shadow-[var(--apple-shadow-lg)] lg:hidden"
            : "hidden"
        }
      >
        <AdminSidebar onNavigate={closeMobileNav} className="h-full w-full shadow-none" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader onOpenMenu={openMobileNav} />
        <div
          className="flex-1 bg-[var(--apple-bg)]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(38, 51, 124, 0.06), transparent 55%)",
          }}
        >
          <div className="mx-auto max-w-[1400px] px-4 py-10 sm:px-6 lg:px-10 lg:py-12">{children}</div>
        </div>
      </div>
    </div>
  );
}

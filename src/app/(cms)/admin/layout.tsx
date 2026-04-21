import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CMS",
  robots: { index: false, follow: false },
};

/** Root admin segment: `/admin/login` stays public; see `(protected)/layout.tsx` for the auth shell. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

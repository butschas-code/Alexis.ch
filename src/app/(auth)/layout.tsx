export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--apple-bg)] text-[var(--apple-text)]">
      <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-12">{children}</main>
    </div>
  );
}

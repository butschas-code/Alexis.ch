import { AdminContentSkeleton, AdminLoading } from "@/components/admin/AdminLoading";

export default function AdminProtectedLoading() {
  return (
    <div className="space-y-8">
      <AdminLoading message="Seite wird vorbereitet…" />
      <div className="grid gap-4 sm:grid-cols-2">
        <AdminContentSkeleton lines={4} />
        <AdminContentSkeleton lines={4} />
      </div>
    </div>
  );
}

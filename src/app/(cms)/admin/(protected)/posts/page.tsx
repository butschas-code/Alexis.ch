"use client";

import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/AdminLoading";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminPostsManager } from "@/components/admin/posts/AdminPostsManager";

function PostsFallback() {
  return (
    <AdminPageContainer>
      <AdminLoading message="Beiträge werden geladen…" />
    </AdminPageContainer>
  );
}

export default function AdminPostsPage() {
  return (
    <Suspense fallback={<PostsFallback />}>
      <AdminPostsManager />
    </Suspense>
  );
}

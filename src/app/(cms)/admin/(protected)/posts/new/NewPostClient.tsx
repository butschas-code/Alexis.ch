"use client";

import { useMemo } from "react";
import { PostForm } from "@/components/admin/PostForm";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { newPostId } from "@/cms/services/post-write-client";

export default function NewPostClient() {
  const prepared = useMemo(() => {
    try {
      return { ok: true as const, id: newPostId() };
    } catch {
      return { ok: false as const, message: "Firebase/Firestore ist nicht konfiguriert." };
    }
  }, []);

  if (!prepared.ok) {
    return (
      <AdminPageContainer>
        <p className="text-sm text-red-700">{prepared.message}</p>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer>
      <PostForm mode="new" postId={prepared.id} />
    </AdminPageContainer>
  );
}

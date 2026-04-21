"use client";

import { useMemo } from "react";
import { AuthorForm } from "@/components/admin/authors/AuthorForm";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { newAuthorId } from "@/cms/services/authors-admin-client";

export default function NewAuthorClient() {
  const prepared = useMemo(() => {
    try {
      return { ok: true as const, id: newAuthorId() };
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

  return <AuthorForm mode="new" authorId={prepared.id} />;
}

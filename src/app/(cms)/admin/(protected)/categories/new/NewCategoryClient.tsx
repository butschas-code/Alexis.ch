"use client";

import { useMemo } from "react";
import { CategoryForm } from "@/components/admin/categories/CategoryForm";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { newCategoryId } from "@/cms/services/categories-admin-client";

export default function NewCategoryClient() {
  const prepared = useMemo(() => {
    try {
      return { ok: true as const, id: newCategoryId() };
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

  return <CategoryForm mode="new" categoryId={prepared.id} />;
}

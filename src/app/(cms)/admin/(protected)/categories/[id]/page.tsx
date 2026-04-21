import { CategoryForm } from "@/components/admin/categories/CategoryForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  return <CategoryForm mode="edit" categoryId={id} />;
}

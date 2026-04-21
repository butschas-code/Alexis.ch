import { AuthorForm } from "@/components/admin/authors/AuthorForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditAuthorPage({ params }: Props) {
  const { id } = await params;
  return <AuthorForm mode="edit" authorId={id} />;
}

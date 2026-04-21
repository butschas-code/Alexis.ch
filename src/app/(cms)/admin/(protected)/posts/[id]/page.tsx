import { PostForm } from "@/components/admin/PostForm";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminPageContainer>
      <PostForm mode="edit" postId={id} />
    </AdminPageContainer>
  );
}

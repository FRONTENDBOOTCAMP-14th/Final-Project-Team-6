import { getCurrentUser } from "@/utils/supabase/get-current-user";
import getPostContents from "./_actions/get-post-contents-id";
import EditForm from "./_components/edit-form";

interface Props {
  params: Promise<{ postId: string }>;
}

export default async function ChatDetailPage({ params }: Props) {
  const { postId } = await params;

  const currentUser = await getCurrentUser();
  if (currentUser === null) throw new Error("로그인이 필요합니다.");

  const postData = await getPostContents(postId);
  if (!(currentUser.id === postData.author_id))
    throw new Error("게시글 작성자가 아닙니다.");
  if (postData.is_expired)
    throw new Error("게시글이 만료되어 수정할 수 없습니다.");
  if (postData.is_completed)
    throw new Error("러닝완료된 게시글은 수정할 수 없습니다.");

  return (
    <div>
      <h1 className="pt-10 mb-8 text-2xl font-semibold">작성한 게시글 편집</h1>
      <EditForm postData={postData} />
    </div>
  );
}

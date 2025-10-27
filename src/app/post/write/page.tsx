import PostWriteForm from "@/app/post/write/_components/post-write-form";
import { createClient } from "@/utils/supabase/server";
export default async function PostWritePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("글을 작성하려면 로그인이 필요합니다.");
  }

  return (
    <div className="w-full max-w-md mx-auto pt-10">
      <h1 className="sr-only">동행 신청 페이지</h1>
      <PostWriteForm />
    </div>
  );
}

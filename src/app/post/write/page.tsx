import PostWriteForm from "@/app/post/write/_components/post-write-form";
import { createMetadata } from "@/utils";
import { getCurrentUser } from "@/utils/supabase/get-current-user";

export const metadata = {
  ...createMetadata("POST_WRITE"),
  robots: { index: false, follow: false },
};

export default async function PostWritePage() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요한 페이지 입니다.");

  return (
    <div className="w-full max-w-md mx-auto pt-10">
      <h1 className="sr-only">동행 신청 페이지</h1>
      <PostWriteForm />
    </div>
  );
}

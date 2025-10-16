import type { PostWithAuthor } from "@/app/post/type";
import { createClient } from "@/utils/supabase/server";
import PostCard from "./components/list-card";

// 내가 쓴 글 목록 가져오기
async function getMyPosts(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*)")
    .eq("author_id", userId)
    .neq("status", "deleted") // 👇 'deleted' 상태가 아닌 게시글만 필터링
    .order("created_at", { ascending: false });
  return data;
}

// 다른 사람이 쓴 글 목록 가져오기
async function getOtherPosts(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*, author:profiles(*)")
    .neq("author_id", userId)
    .neq("status", "deleted") // 👇 'deleted' 상태가 아닌 게시글만 필터링
    .order("created_at", { ascending: false });
  return data;
}

// --- 메인 페이지 컴포넌트 (이 아래는 수정할 필요 없어!) ---
export default async function PostListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  const myPosts = (await getMyPosts(user.id)) as PostWithAuthor[] | null;
  const otherPosts = (await getOtherPosts(user.id)) as PostWithAuthor[] | null;

  return (
    <main className="p-4 flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">내가 작성한 목록</h1>
        <div className="flex flex-col gap-4">
          {myPosts && myPosts.length > 0 ? (
            myPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-[var(--color-site-gray)]">
              작성한 게시글이 없습니다.
            </p>
          )}
        </div>
      </section>

      <section>
        <h1 className="text-2xl font-bold mb-4">동반주자 목록</h1>
        <div className="flex flex-col gap-4">
          {otherPosts && otherPosts.length > 0 ? (
            otherPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-[var(--color-site-gray)]">
              다른 동반주자들이 남긴 목록이 없습니다.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

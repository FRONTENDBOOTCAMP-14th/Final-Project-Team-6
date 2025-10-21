import type { PostWithAuthor } from "@/app/post/type";
import IconFilter from "@/components/common/icons/icon-filter";
import Pagination from "@/components/pagination/pagination";
import { createClient } from "@/utils/supabase/server";
import PostCard from "./_components/list-card";

async function getAllPosts(page: number, postsPerPage: number) {
  const supabase = await createClient();
  const from = (page - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  const { data, count } = await supabase
    .from("posts")
    .select("*, author:profiles(*)", { count: "exact" })
    .neq("status", "deleted")
    .order("is_completed", { ascending: true })
    .order("is_expired", { ascending: true })
    .order("status", { ascending: false })
    .order("meeting_time", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  return { data, count };
}

export default async function PostListPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <p>로그인이 필요합니다.</p>;
  }

  const currentPage = Number(searchParams?.page) || 1;
  const POSTS_PER_PAGE = 4;

  const { data, count: totalCount } = await getAllPosts(
    currentPage,
    POSTS_PER_PAGE,
  );
  const allPosts = data as PostWithAuthor[] | null;

  const totalPages = totalCount ? Math.ceil(totalCount / POSTS_PER_PAGE) : 0;

  return (
    <main className="flex flex-col gap-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">전체 동반주자 목록</h1>
        <div className="flex flex-col gap-4">
          {allPosts && allPosts.length > 0 ? (
            allPosts.map((post) => <PostCard key={post.id} post={post} />)
          ) : (
            <p className="text-[var(--color-site-gray)]">게시글이 없습니다.</p>
          )}
        </div>
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </main>
  );
}

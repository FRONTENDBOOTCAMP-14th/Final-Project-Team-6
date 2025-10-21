import ActivityLog from "@/app/post/list/_components/activity-log";
import PostCard from "@/app/post/list/_components/list-card";
import PostListHeader from "@/app/post/list/_components/post-list-header";
import type { PostWithAuthor } from "@/app/post/type";
import Pagination from "@/components/pagination/pagination";
import { createClient } from "@/utils/supabase/server";

async function getAllPosts(
  page: number,
  postsPerPage: number,
  runnerType?: string,
) {
  const supabase = await createClient();
  const from = (page - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  let query = supabase
    .from("posts")
    .select("*, author:profiles!inner(*)", { count: "exact" })
    .neq("status", "deleted");

  if (runnerType === "guide_runner" || runnerType === "blind_runner") {
    query = query.eq("author.runner_type", runnerType);
  }

  const { data, count } = await query
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
  searchParams?: Promise<{ page?: string; runner_type?: string }>;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;
  const currentPage = Number(resolvedParams?.page) || 1;
  const postsPerPage = 4;
  const runnerTypeFilter = resolvedParams?.runner_type;

  const { data, count: totalCount } = await getAllPosts(
    currentPage,
    postsPerPage,
    runnerTypeFilter,
  );
  const allPosts = data as PostWithAuthor[] | null;

  const totalPages = totalCount ? Math.ceil(totalCount / postsPerPage) : 0;

  return (
    <main>
      <div className="mb-5">
        <ActivityLog />
      </div>
      <section>
        <PostListHeader />
        <div className="flex flex-col gap-3">
          {allPosts && allPosts.length > 0 ? (
            allPosts.map((post) => (
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
            ))
          ) : (
            <p className="text-[var(--color-site-gray)]">
              조건에 맞는 게시글이 없습니다.
            </p>
          )}
        </div>
        <div className="mt-8">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </main>
  );
}

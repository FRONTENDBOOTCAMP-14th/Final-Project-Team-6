import Image from "next/image";
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

  const { data, count, error } = await query
    .order("is_completed", { ascending: true })
    .order("is_expired", { ascending: true })
    .order("status", { ascending: false })
    .order("meeting_time", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("전체 게시글 조회 에러:", error);
    throw new Error("전체 게시글 조회 중 오류가 발생했습니다.");
  }

  return { data, count: count || 0 };
}

async function getMyPosts(userId: string, page: number, postsPerPage: number) {
  const supabase = await createClient();
  const from = (page - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  const { data, count, error } = await supabase
    .from("posts")
    .select("*, author:profiles!inner(*)", { count: "exact" })
    .eq("author_id", userId)
    .neq("status", "deleted")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("내가 작성한 글 조회 에러:", error);
    throw new Error("내가 작성한 글 조회 중 오류가 발생했습니다.");
  }

  return { data, count: count || 0 };
}

async function getMyApplications(
  userId: string,
  page: number,
  postsPerPage: number,
) {
  const supabase = await createClient();
  const from = (page - 1) * postsPerPage;
  const to = from + postsPerPage - 1;

  const { data, count, error } = await supabase
    .from("posts")
    .select(
      `
      *, 
      author:profiles!inner(*),
      matches!inner(*)
    `,
      { count: "exact" },
    )
    .eq("matches.matched_runner_id", userId)
    .eq("matches.status", "matched")
    .neq("status", "deleted")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("내가 신청한 글 조회 에러:", error);
    throw new Error("내가 신청한 글 조회 중 오류가 발생했습니다.");
  }

  return { data, count: count || 0 };
}

export default async function PostListPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    runner_type?: string;
    list_type?: string;
  }>;
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
  const listType = resolvedParams?.list_type || "all";

  let allPosts: PostWithAuthor[] | null = null;
  let totalCount = 0;
  let emptyMessage = "조건에 맞는 게시글이 없습니다.";

  // 드롭다운 선택에 따라 다른 데이터 가져오기
  switch (listType) {
    case "my_posts": {
      if (!user) {
        emptyMessage = "로그인 후 이용할 수 있습니다.";
        break;
      }
      const myPostsResult = await getMyPosts(
        user.id,
        currentPage,
        postsPerPage,
      );
      allPosts = myPostsResult.data as PostWithAuthor[] | null;
      totalCount = myPostsResult.count;
      emptyMessage = "작성한 글이 없습니다.";
      break;
    }

    case "my_applications": {
      if (!user) {
        emptyMessage = "로그인 후 이용할 수 있습니다.";
        break;
      }
      const myApplicationsResult = await getMyApplications(
        user.id,
        currentPage,
        postsPerPage,
      );
      allPosts = myApplicationsResult.data as PostWithAuthor[] | null;
      totalCount = myApplicationsResult.count;
      emptyMessage = "신청한 글이 없습니다.";
      break;
    }
    default: {
      // "all"
      const allPostsResult = await getAllPosts(
        currentPage,
        postsPerPage,
        runnerTypeFilter,
      );
      allPosts = allPostsResult.data as PostWithAuthor[] | null;
      totalCount = allPostsResult.count;
      emptyMessage = "조건에 맞는 게시글이 없습니다.";
      break;
    }
  }

  const totalPages = totalCount ? Math.ceil(totalCount / postsPerPage) : 0;

  return (
    <div className="pt-15">
      <p className="text-3xl font-bold mb-7">
        빛나는 동반주자 연결고리
        <br />
        ‘눈길’ 입니다.
      </p>
      {isLoggedIn ? (
        <div className="mb-15">
          <ActivityLog userId={user.id} />
        </div>
      ) : (
        <div className="mb-15">
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/images/list-main-image.png"
              alt=""
              width={440}
              height={178}
              sizes="100vw"
              style={{ width: "100%", height: "auto" }}
            />
          </div>
        </div>
      )}
      <section>
        <PostListHeader />
        <div className="flex flex-col gap-3">
          {allPosts && allPosts.length > 0 ? (
            allPosts.map((post) => (
              <PostCard key={post.id} post={post} isLoggedIn={isLoggedIn} />
            ))
          ) : (
            <p className="text-site-gray text-lg text-center mt-5">
              {emptyMessage}
            </p>
          )}
        </div>
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </section>
    </div>
  );
}

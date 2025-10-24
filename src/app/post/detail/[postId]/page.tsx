// post/detail/[postId]/page.tsx

import { notFound } from "next/navigation";
import ActionButtons from "@/app/post/detail/_components/action-buttons";
import AuthorProfile from "@/app/post/detail/_components/author-profile";
import PostInfo from "@/app/post/detail/_components/post-info";
import type { Match, PostWithAuthor, RunnerType } from "@/app/post/type";
import { createClient } from "@/utils/supabase/server";

import {
  cancelMatch,
  completePost,
  createMatchAndChat,
  deletePost,
} from "./action";

async function getPostById(id: string) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(`*, author:profiles(id, nickname, runner_type, profile_image_url)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("[Server] getPostById DB Error:", error.message);
  }

  if (post && post.status === "deleted") {
    console.log(`[Server] Post ${id} is marked as deleted.`);
    return null;
  }

  return post;
}

async function getMatchForPost(postId: string) {
  console.log(`\n--- [getMatchForPost] postId: ${postId}의 활성 매치 조회 ---`);

  const supabase = await createClient();

  const { data: activeMatch, error } = await supabase
    .from("matches")
    .select("*, applicant:profiles(*)")
    .eq("post_id", postId)
    .eq("status", "matched")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[Server] getMatchForPost 쿼리 에러:", error.message);
  }

  console.log("[Server] DB에서 가져온 활성 매치 기록:", activeMatch);

  return activeMatch;
}

async function getCurrentUserProfile(userId: string) {
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("runner_type")
    .eq("id", userId)
    .single();
  return profile;
}

// --- 메인 페이지 컴포넌트 ---
export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const post = (await getPostById(postId)) as PostWithAuthor | null;

  if (!post) {
    notFound();
  }

  // post.status가 'matched'일 때만 'matches' 테이블 조회
  const match =
    post.status === "matched"
      ? ((await getMatchForPost(postId)) as Match | null)
      : null;

  const currentUserProfile = authUser
    ? await getCurrentUserProfile(authUser.id)
    : null;

  const isAuthor = authUser?.id === post.author_id;
  const isApplicant = authUser?.id === match?.matched_runner_id;

  return (
    <div className="flex flex-col mt-10">
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">{post.title}</h2>
        <AuthorProfile author={post.author} created_at={post.created_at} />
      </div>
      <hr className="w-full border-t border-[var(--color-site-lightblack)] mt-6 mb-6" />
      <PostInfo post={post} className="mb-10" />

      <ActionButtons
        post={post}
        match={match}
        isAuthor={isAuthor}
        isApplicant={isApplicant}
        currentUserRunnerType={currentUserProfile?.runner_type as RunnerType}
        actions={{
          completePost,
          createMatchAndChat,
          deletePost,
          cancelMatch,
        }}
      />
    </div>
  );
}

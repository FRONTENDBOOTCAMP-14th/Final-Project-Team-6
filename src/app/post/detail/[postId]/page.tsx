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

export const dynamic = "force-dynamic";

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

  return post;
}

async function getMatchForPost(postId: string) {
  console.log(`\n--- [디버깅 시작] postId: ${postId} ---`);

  const supabase = await createClient();

  const { data: latestMatch, error } = await supabase
    .from("matches")
    .select("*, applicant:profiles(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[디버깅] Supabase 쿼리 에러:", error.message);
  }

  console.log("[디버깅] DB에서 가져온 최신 매치 기록:", latestMatch);

  if (latestMatch && latestMatch.status === "cancelled") {
    console.log(
      "[디버깅] 결정: 최신 기록이 'cancelled'이므로 null을 리턴합니다.",
    );
    return null;
  }

  console.log("[디버깅] 결정: 유효한 매치 정보를 리턴합니다.");
  return latestMatch;
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

  // 수정된 getMatchForPost 함수를 통해 '현재 유효한' 매치 정보만 가져온다.
  const [post, match] = await Promise.all([
    getPostById(postId) as Promise<PostWithAuthor | null>,
    getMatchForPost(postId) as Promise<Match | null>,
  ]);

  if (!post) {
    notFound();
  }

  const currentUserProfile = authUser
    ? await getCurrentUserProfile(authUser.id)
    : null;

  const isAuthor = authUser?.id === post.author_id;
  const isApplicant = authUser?.id === match?.matched_runner_id;

  return (
    <div className="flex flex-col gap-6 p-4">
      <AuthorProfile author={post.author} created_at={post.created_at} />
      <PostInfo post={post} />
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

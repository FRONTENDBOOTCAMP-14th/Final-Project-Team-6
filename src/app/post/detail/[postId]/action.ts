"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function createMatchAndChat({
  postId,
  authorId,
}: {
  postId: string;
  authorId: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }
  if (user.id === authorId) {
    throw new Error("자신의 글에는 매칭을 신청할 수 없습니다.");
  }

  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update({ status: "matched" })
    .eq("id", postId)
    .eq("status", "open")
    .select("id")
    .single();

  if (updateError || !updatedPost) {
    throw new Error("이미 매칭이 완료되었거나 매칭할 수 없는 상태입니다.");
  }

  const matchData = {
    post_id: postId,
    matched_runner_id: user.id,
    status: "matched",
  };

  const { data: newMatch, error: matchError } = await supabase
    .from("matches")
    .insert(matchData)
    .select("id")
    .single();

  if (matchError || !newMatch) {
    await supabase.from("posts").update({ status: "open" }).eq("id", postId);
    const errorMessage = matchError
      ? matchError.message
      : "매칭 정보를 생성하지 못했습니다.";
    throw new Error(errorMessage);
  }

  redirect(`/chat/detail/${newMatch.id}`);
}

export async function cancelMatch(matchId: string, postId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: match } = await supabase
    .from("matches")
    .select("*, post:posts(author_id)")
    .eq("id", matchId)
    .single();

  if (!match) {
    throw new Error("존재하지 않는 매칭입니다.");
  }

  const isAuthor = match.post?.author_id === user.id;
  const isApplicant = match.matched_runner_id === user.id;

  if (!isAuthor && !isApplicant) {
    throw new Error("매칭을 취소할 권한이 없습니다.");
  }

  const [matchUpdateResult, postUpdateResult] = await Promise.all([
    supabase.from("matches").update({ status: "cancelled" }).eq("id", matchId),
    supabase.from("posts").update({ status: "open" }).eq("id", postId),
  ]);

  if (matchUpdateResult.error || postUpdateResult.error) {
    const errorMessage =
      matchUpdateResult.error?.message || postUpdateResult.error?.message;
    throw new Error(errorMessage ?? "알 수 없는 에러");
  }

  revalidatePath(`/post/detail/${postId}`);
  redirect(`/post/detail/${postId}`);
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const postId = formData.get("postId") as string;

  if (!postId) {
    throw new Error("잘못된 요청입니다.");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (postError || !post || post.author_id !== user.id) {
    throw new Error("게시글을 삭제할 권한이 없습니다.");
  }

  const { error } = await supabase
    .from("posts")
    .update({ status: "deleted" })
    .eq("id", postId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/post/list");
}

export async function completePost(postId: string, matchId: string) {
  if (!postId || !matchId) {
    throw new Error("잘못된 요청입니다.");
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const { data: match } = await supabase
    .from("matches")
    .select("*, post:posts(author_id)")
    .eq("id", matchId)
    .single();

  if (!match) {
    throw new Error("존재하지 않는 매칭입니다.");
  }

  const isAuthor = match.post?.author_id === user.id;
  const isApplicant = match.matched_runner_id === user.id;

  if (!isAuthor && !isApplicant) {
    throw new Error("완료할 권한이 없습니다.");
  }

  const [matchUpdateResult, postUpdateResult] = await Promise.all([
    supabase.from("matches").update({ status: "completed" }).eq("id", matchId),
    supabase.from("posts").update({ is_completed: true }).eq("id", postId),
  ]);

  if (matchUpdateResult.error || postUpdateResult.error) {
    const errorMessage =
      matchUpdateResult.error?.message || postUpdateResult.error?.message;
    throw new Error(errorMessage ?? "알 수 없는 에러");
  }

  revalidatePath(`/post/detail/${postId}`);
  redirect(`/post/detail/${postId}`);
}

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
    return redirect(
      `/error?message=${encodeURIComponent(
        "자신의 글에는 매칭을 신청할 수 없습니다.",
      )}`,
    );
  }

  // 1. 먼저 post의 상태가 'open'인 경우에만 'matched'로 원자적으로 업데이트 시도
  const { data: updatedPost, error: updateError } = await supabase
    .from("posts")
    .update({ status: "matched" })
    .eq("id", postId)
    .eq("status", "open") // 'open' 상태일 때만 업데이트 되도록
    .select("id")
    .single();

  // 업데이트에 실패했다면 (이미 다른 사람이 매칭했거나, 글 상태가 open이 아닌 경우)
  if (updateError || !updatedPost) {
    return redirect(
      `/error?message=${encodeURIComponent(
        "이미 매칭이 완료되었거나 매칭할 수 없는 상태입니다.",
      )}`,
    );
  }

  // 2. 포스트 상태 업데이트에 성공한 경우에만 매치 정보 생성
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
    return redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
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

  // 매칭 정보를 가져와서 글 작성자나 신청자가 맞는지 확인
  const { data: match } = await supabase
    .from("matches")
    .select("*, post:posts(author_id)")
    .eq("id", matchId)
    .single();

  if (!match) {
    return redirect(
      `/error?message=${encodeURIComponent("존재하지 않는 매칭입니다.")}`,
    );
  }

  const isAuthor = match.post?.author_id === user.id;
  const isApplicant = match.matched_runner_id === user.id;

  if (!isAuthor && !isApplicant) {
    return redirect(
      `/error?message=${encodeURIComponent("매칭을 취소할 권한이 없습니다.")}`,
    );
  }

  const [matchUpdateResult, postUpdateResult] = await Promise.all([
    supabase.from("matches").update({ status: "cancelled" }).eq("id", matchId),
    supabase.from("posts").update({ status: "open" }).eq("id", postId),
  ]);

  if (matchUpdateResult.error || postUpdateResult.error) {
    const errorMessage =
      matchUpdateResult.error?.message || postUpdateResult.error?.message;
    return redirect(
      `/error?message=${encodeURIComponent(errorMessage ?? "알 수 없는 에러")}`,
    );
  }

  revalidatePath(`/post/detail/${postId}`);
  redirect(`/post/detail/${postId}`);
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient();
  const postId = formData.get("postId") as string;

  if (!postId) {
    return redirect(
      `/error?message=${encodeURIComponent("잘못된 요청입니다.")}`,
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // 삭제하려는 post의 작성자가 현재 로그인한 사용자인지 확인
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (postError || !post || post.author_id !== user.id) {
    return redirect(
      `/error?message=${encodeURIComponent("게시글을 삭제할 권한이 없습니다.")}`,
    );
  }

  const { error } = await supabase
    .from("posts")
    .update({ status: "deleted" })
    .eq("id", postId);

  if (error) {
    return redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  redirect("/post/list");
}

export async function completePost(postId: string, matchId: string) {
  if (!postId || !matchId) {
    return redirect("/error?message=Invalid_ID");
  }
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  // 매칭 정보를 가져와서 글 작성자나 신청자가 맞는지 확인
  const { data: match } = await supabase
    .from("matches")
    .select("*, post:posts(author_id)")
    .eq("id", matchId)
    .single();

  if (!match) {
    return redirect(
      `/error?message=${encodeURIComponent("존재하지 않는 매칭입니다.")}`,
    );
  }

  const isAuthor = match.post?.author_id === user.id;
  const isApplicant = match.matched_runner_id === user.id;

  if (!isAuthor && !isApplicant) {
    return redirect(
      `/error?message=${encodeURIComponent("완료할 권한이 없습니다.")}`,
    );
  }

  const [matchUpdateResult, postUpdateResult] = await Promise.all([
    supabase.from("matches").update({ status: "completed" }).eq("id", matchId),
    supabase.from("posts").update({ is_completed: true }).eq("id", postId),
  ]);

  if (matchUpdateResult.error || postUpdateResult.error) {
    const errorMessage =
      matchUpdateResult.error?.message || postUpdateResult.error?.message;
    return redirect(
      `/error?message=${encodeURIComponent(errorMessage ?? "알 수 없는 에러")}`,
    );
  }

  revalidatePath(`/post/detail/${postId}`);
  redirect(`/post/detail/${postId}`);
}

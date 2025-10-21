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

  // 이 postId로 이미 'matched' 상태인 데이터가 있는지 확인한다.
  const { data: existingMatch, error: existingMatchError } = await supabase
    .from("matches")
    .select("id")
    .eq("post_id", postId)
    .eq("status", "matched")
    .maybeSingle(); // 결과가 없거나 하나일 수 있으므로 maybeSingle() 사용

  if (existingMatchError) {
    // 쿼리 자체에서 에러가 발생한 경우
    return redirect(
      `/error?message=${encodeURIComponent(existingMatchError.message)}`,
    );
  }

  if (existingMatch) {
    // 이미 매칭된 데이터가 존재하는 경우
    return redirect(
      `/error?message=${encodeURIComponent("이미 매칭이 완료된 게시물입니다.")}`,
    );
  }

  const matchData = {
    post_id: postId,
    matched_runner_id: user.id,
    status: "matched",
  };

  const { data, error } = await supabase
    .from("matches")
    .insert(matchData)
    .select("id")
    .single();

  if (error || !data) {
    const errorMessage = error
      ? error.message
      : "매칭 정보를 생성하지 못했습니다.";
    return redirect(`/error?message=${encodeURIComponent(errorMessage)}`);
  }

  redirect(`/chat/detail/${data.id}`);
}

export async function cancelMatch(matchId: string, postId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("matches")
    .update({ status: "cancelled" })
    .eq("id", matchId);

  if (error) {
    return redirect(`/error?message=${encodeURIComponent(error.message)}`);
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

  const { error: matchError } = await supabase
    .from("matches")
    .update({ status: "completed" })
    .eq("id", matchId);

  if (matchError) {
    return redirect(`/error?message=${encodeURIComponent(matchError.message)}`);
  }

  const { error: postError } = await supabase
    .from("posts")
    .update({ is_completed: true })
    .eq("id", postId);

  if (postError) {
    return redirect(`/error?message=${encodeURIComponent(postError.message)}`);
  }

  revalidatePath(`/post/detail/${postId}`);
  redirect(`/post/detail/${postId}`);
}

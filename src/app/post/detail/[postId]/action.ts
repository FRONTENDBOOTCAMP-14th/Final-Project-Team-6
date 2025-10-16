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

export async function completePost(postId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("posts")
    .update({ is_completed: true })
    .eq("id", postId);

  if (error) {
    return redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath(`/post/detail/${postId}`);
}

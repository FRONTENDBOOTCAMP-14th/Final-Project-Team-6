"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TablesInsert } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";

export async function createPost(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/auth/login");
  }

  const postData: TablesInsert<"posts"> = {
    title: formData.get("title") as string,
    meeting_place: formData.get("meeting_place") as string,
    meeting_time: formData.get("meeting_time") as string,
    author_id: user.id,
    // 타입 오류 해결을 위해 필수 필드에 기본값 추가
    meeting_detail_place: "",
    goal_km: 0,
    pace: 0,
    description: "",
    is_completed: false,
    is_expired: false,
  };

  const { data, error } = await supabase
    .from("posts")
    .insert([postData])
    .select("id")
    .single();

  if (error) {
    console.error("Supabase DB 저장 오류:", error);
    return redirect(`/error?message=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  redirect(`/post/detail/${data.id}`);
}

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

  const paceValue = formData.get("pace") as string;
  const paceNumber = Number(paceValue);

  if (Number.isNaN(paceNumber)) {
    console.error("Pace 값이 유효한 숫자가 아닙니다:", paceValue);
    return redirect(`/error?message=페이스는 숫자로만 입력해야 합니다.`);
  }

  const postData: TablesInsert<"posts"> = {
    title: formData.get("title") as string,
    meeting_place: formData.get("meeting_place") as string,
    meeting_detail_place: formData.get("meeting_detail_place") as string,
    meeting_time: formData.get("meeting_time") as string,
    goal_km: Number(formData.get("goal_km")),
    pace: paceNumber,
    description: formData.get("description") as string,
    author_id: user.id,
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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export default async function updatePost(formData: FormData) {
  const postId = formData.get("postId") as string;
  const utcTime = formData.get("utcTime") as string;

  const updateData = {
    title: formData.get("title") as string,
    meeting_place: formData.get("meeting_place") as string,
    meeting_detail_place: formData.get("meeting_detail_place") as string,
    meeting_time: utcTime,
    goal_km: Number(formData.get("goal_km")),
    pace: Number(formData.get("pace")),
    description: formData.get("description") as string,
    updated_at: new Date().toISOString(),
  };

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update(updateData)
    .eq("id", postId);

  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect(`/post/detail/${postId}`);
}

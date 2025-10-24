"use server";

import { createClient } from "@/utils/supabase/server";

export async function checkNickname(formData: FormData) {
  const nickname = formData.get("nickname") as string;

  if (!nickname) {
    return { available: false, error: "닉네임을 입력해주세요." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("nickname", nickname)
    .maybeSingle();

  if (error) {
    console.error("Supabase profiles 에러:", error);
    return { available: false, error: "닉네임 확인 중 오류가 발생했습니다." };
  }

  return { available: !data };
}

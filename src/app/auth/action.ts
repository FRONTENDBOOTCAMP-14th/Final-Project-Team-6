"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  // 편의를 위해 여기에 타입 캐스팅(type-casting)
  // 실제로 입력을 검증 필요
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  // 레이아웃 경로 재검증
  // 레이아웃을 공유하는 모든 URL이 다음 페이지 방문 시 재검증
  revalidatePath("/", "layout");
  redirect("/");
}

// 회원가입 서버 액션
export async function signUp(formData: FormData) {
  const supabase = await createClient();

  // 편의를 위해 여기에 타입 캐스팅
  // 실제로 입력을 검증 필요
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        nickname: formData.get("nickname") as string,
        runner_type: formData.get("runner_type") as string,
      },
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  // 레이아웃 경로 재검증
  // 레이아웃을 공유하는 모든 URL이 다음 페이지 방문 시 재검증
  revalidatePath("/", "layout");
  redirect("/auth/check-email-screen");
}

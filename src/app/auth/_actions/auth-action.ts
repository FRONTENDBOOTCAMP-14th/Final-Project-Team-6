"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

// 로그인 서버 액션
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
    console.error("로그인 오류:", error);
    return { error: true };
  }

  // 레이아웃 경로 재검증
  // 레이아웃을 공유하는 모든 URL이 다음 페이지 방문 시 재검증
  revalidatePath("/", "layout");
  redirect("/profile/my-profile");
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

// 프로필 수정 서버 액션
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/auth/login");
  }

  const nickname = formData.get("nickname") as string;
  const profileImageUrl = formData.get("profile_image_url") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      nickname: nickname,
      profile_image_url: profileImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("프로필 업데이트 오류:", error);
    redirect("/profile/profile-edit?error=update_failed");
  }

  revalidatePath("/profile", "layout");
  redirect("/profile/my-profile");
}

// pr올릴때 나중에 삭제 하기(로그아웃)
export async function signOut() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/auth/login");
}

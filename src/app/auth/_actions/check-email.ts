"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function checkEmail(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    return { available: false, error: "이메일을 입력해주세요." };
  }

  const supabase = createAdminClient();

  const { data, error } = await supabase.auth.admin.listUsers();

  if (error) {
    console.error("Supabase listUsers 에러:", error);
    return { available: false, error: "이메일 확인 중 오류가 발생했습니다." };
  }

  const exists = data.users.some((user) => user.email === email);

  return { available: !exists };
}

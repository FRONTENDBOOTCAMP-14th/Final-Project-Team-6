import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ available: false }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // 서버전용키
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error("Supabase 환경변수가 설정되지 않았습니다.");
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Supabase listUsers 에러:", error);
      return NextResponse.json({ available: false }, { status: 500 });
    }

    const exists = data.users.some((user) => user.email === email);

    return NextResponse.json({ available: !exists });
  } catch (error) {
    console.error("이메일 확인 오류:", error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}

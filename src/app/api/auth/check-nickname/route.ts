import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { nickname } = await request.json();
    if (!nickname)
      return NextResponse.json({ available: false }, { status: 400 });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // 서버전용키
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key)
      throw new Error("Supabase 환경변수가 설정되지 않았습니다.");

    const supabase = createClient(url, key);

    const { data, error } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("nickname", nickname)
      .maybeSingle();

    if (error) {
      console.error("Supabase profiles 에러:", error);
      return NextResponse.json({ available: false }, { status: 500 });
    }

    return NextResponse.json({ available: !data });
  } catch (err) {
    console.error("check-nickname catch 에러:", err);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}

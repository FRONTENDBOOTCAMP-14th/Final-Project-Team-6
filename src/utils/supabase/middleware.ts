import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

// 세션 업데이트 함수
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_API_KEY;

  if (!url || !key) {
    throw new Error("Supabase 환경 변수가 설정되지 않았습니다.");
  }

  // 서버 클라이언트 생성
  const supabase = createServerClient(url, key, {
    // 쿠키 설정
    cookies: {
      // 모두 가져오기
      getAll() {
        return request.cookies.getAll();
      },
      // 모두 설정하기
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        supabaseResponse = NextResponse.next({
          request,
        });
        for (const { name, value, options } of cookiesToSet) {
          supabaseResponse.cookies.set(name, value, options);
        }
      },
    },
  });

  // createServerClient()와 supabase.auth.getUser() 사이에 코드를 실행하지 마세요.
  // 단순 실수로 인해 사용자가 무작위로 로그아웃되는 문제를 디버깅하기 매우 어려울 수 있습니다.

  // [중요] auth.getUser()를 삭제하지 마세요!

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    // 사용자가 없을 경우, 로그인 페이지로 리디렉션하여 응답할 가능성 있음
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // [중요] supabaseResponse 객체를 그대로 반환해야 합니다!
  // NextResponse.next()로 새 응답(response) 객체를 생성하는 경우 다음을 수행해야 합니다.
  //
  // 1. 요청을 다음과 같이 전달합니다.
  //    const myNewResponse = NextResponse.next({ request })
  //
  // 2. 쿠키 위에 이렇게 복사하세요.
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  //
  // 3. 필요에 맞게 myNewResponse 객체를 변경하되, 쿠키는 변경하지 마세요!
  //
  // 4. myNewResponse 객체를 반환합니다.
  //    return myNewResponse
  //
  // 이 작업이 완료되지 않으면 브라우저와 서버가 동기화되지 않아 사용자 세션이 조기 종료될 수 있습니다!

  return supabaseResponse;
}

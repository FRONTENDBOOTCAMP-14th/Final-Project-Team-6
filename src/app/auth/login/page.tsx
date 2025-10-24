import { tw } from "@/utils";
import { createClient } from "@/utils/supabase/server";
import LoginForm from "../_components/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    throw new Error("비정상적인 접근 경로입니다. \n로그인이 필요합니다.");
  }

  return (
    <div className="mt-[3.75rem]">
      <h2 className="sr-only">로그인 페이지</h2>
      <h3
        className={tw(
          "text-[2rem] leading-[1.5] font-bold mb-[3.75rem] break-keep",
        )}
      >
        어서오세요 :&#41;
        <br />
        함께 달리는 동행 ‘눈길’ 입니다.
      </h3>
      <LoginForm />
    </div>
  );
}

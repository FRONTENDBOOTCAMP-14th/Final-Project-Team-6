import { createMetadata, tw } from "@/utils";
import { getCurrentUser } from "@/utils/supabase/get-current-user";
import LoginForm from "../_components/login-form";

export const metadata = {
  ...createMetadata("LOGIN"),
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) throw new Error("로그인이 필요한 페이지 입니다.");

  return (
    <div className="mt-[3.75rem]">
      <h1 className="sr-only">로그인 페이지</h1>
      <h2
        className={tw(
          "text-[2rem] leading-[1.5] font-bold mb-[3.75rem] break-keep",
        )}
      >
        어서오세요 :&#41;
        <br />
        함께 달리는 동행 ‘눈길’ 입니다.
      </h2>
      <LoginForm />
    </div>
  );
}

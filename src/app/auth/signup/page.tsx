import { createMetadata, tw } from "@/utils";
import { getCurrentUser } from "@/utils/supabase/get-current-user";
import SignupForm from "../_components/signup-form";

export const metadata = {
  ...createMetadata("SIGNUP"),
  robots: { index: false, follow: false },
};

export default async function SiginUpPage() {
  const user = await getCurrentUser();
  if (user) throw new Error("로그인이 필요한 페이지 입니다.");

  return (
    <div className="mt-[3.75rem]">
      <h1 className="sr-only">회원가입 페이지</h1>
      <h2 className={tw("text-[2rem] leading-[1.5] font-bold mb-10")}>
        회원가입
      </h2>
      <SignupForm />
    </div>
  );
}

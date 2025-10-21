import { signIn } from "@/app/auth/action";
import { Button, Input, Link } from "@/components/common";
import { IconLockOpen } from "@/components/common/icons";
import { tw } from "@/utils";
import PasswordInput from "../_components/password-input";

export default function LoginPage() {
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
      <form className="flex flex-col gap-6">
        <Input
          label="이메일"
          name="email"
          type="email"
          placeholder="이메일 주소를 입력해주세요."
          required
        />
        <PasswordInput label="비밀번호" />
        <Button
          type="submit"
          formAction={signIn}
          // onClick={toggle}
          height="medium"
          fullWidth={true}
        >
          로그인
          {/* {isLoggedIn ? "로그아웃" : "로그인"} */}
          <IconLockOpen />
        </Button>
        <div className="flex justify-center gap-2 mt-6">
          <p className="text-[var(--color-site-gray)]">회원이 아니신가요?</p>
          <Link href="/auth/signup" className="underline font-bold">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}

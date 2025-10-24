"use client";

import { signIn } from "@/app/auth/_actions/auth-action";
import { Button, Input, Link } from "@/components/common";
import { IconLockOpen } from "@/components/common/icons";
import { useDialog } from "@/stores/use-dialog";
import PasswordInput from "../_components/password-input";

export default function LoginForm() {
  const { openDialog } = useDialog();

  const handleSubmit = async (formData: FormData) => {
    const result = await signIn(formData);

    // 로그인 실패 시에만 알럿창 표시
    if (result?.error) {
      openDialog("alert", {
        message: "이메일 주소와 비밀번호가 맞지 않습니다. 다시 확인해주세요.",
      });
    }
  };

  return (
    <form className="flex flex-col gap-6">
      <Input
        label="이메일"
        name="email"
        type="email"
        placeholder="이메일 주소를 입력해주세요."
        required
      />
      <PasswordInput label="비밀번호" name="password" required />
      <Button
        type="submit"
        formAction={handleSubmit}
        className="mt-4"
        height="medium"
        fullWidth={true}
      >
        로그인
        <IconLockOpen />
      </Button>
      <div className="flex justify-center gap-2">
        <p className="text-[var(--color-site-gray)]">회원이 아니신가요?</p>
        <Link href="/auth/signup" className="underline font-bold">
          회원가입
        </Link>
      </div>
    </form>
  );
}

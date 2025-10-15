import { Button, Link } from "@/components/common";
import { IconArrowRight, IconLetter } from "@/components/common/icons";

export default function CheckEmailScreenPage() {
  return (
    <div className="mt-[3.75rem]">
      <div className="flex justify-center items-center w-[3.25rem] h-[3.25rem] rounded-full bg-[var(--color-site-lightblack)] m-auto">
        <IconLetter />
      </div>
      <h2 className="text-[1.5rem] text-center mt-[1.9375rem]">
        회원가입이 완료됐습니다.
      </h2>
      <p className="text-center mt-4 leading-[1.5]">
        인증 메일이 발송되었습니다.
        <br />
        확인하여 회원가입을 완료해주세요.
      </p>
      <Link href="/auth/login" className="block mt-10">
        <Button type="button" height="medium" fullWidth={true}>
          로그인 페이지로 이동
          <IconArrowRight />
        </Button>
      </Link>
    </div>
  );
}

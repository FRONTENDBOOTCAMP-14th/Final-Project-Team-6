import { Button, Input } from "@/components/common";
import { IconCheck } from "@/components/common/icons";
import { tw } from "@/utils";
import { signUp } from "../action";
import PasswordInput from "../component/password-input";

export default function SiginUpPage() {
  return (
    <div className="mt-[3.75rem]">
      <h1 className={tw("text-[2rem] leading-[1.5] font-bold mb-10")}>
        회원가입
      </h1>
      <form className={tw("flex flex-col gap-6")}>
        <div className={tw("relative")}>
          <Input
            style={{ height: "52px" }}
            label="이메일"
            name="email"
            type="email"
            placeholder="이메일 주소를 입력해주세요."
            required
          />
          <Button type="button" className={tw("absolute right-1.5 bottom-1.5")}>
            중복 확인
          </Button>
        </div>
        <PasswordInput label="비밀번호" />
        <PasswordInput label="비밀번호 확인" />
        <fieldset>
          <label
            htmlFor="guide_runner"
            className={`block text-sm font-medium mb-[4px] text-[var(--color-site-gray)] cursor-pointer`}
          >
            러너타입
          </label>
          <div className="flex gap-2">
            <label className="flex-1 cursor-pointer">
              <input
                className="peer appearance-none absolute"
                type="radio"
                id="guide_runner"
                name="runner_type"
                value="guide_runner"
                aria-label="가이드러너"
              />
              <div className="flex justify-center items-center w-full h-[52px] px-4 font-bold rounded-lg border-1 border-[var(--color-site-gray)] text-[var(--color-site-gray)] peer-checked:bg-[var(--color-site-yellow)] peer-checked:border-[var(--color-site-yellow)] peer-checked:text-[var(--color-site-black)] transition">
                가이드러너
              </div>
            </label>
            <label className="flex-1 cursor-pointer">
              <input
                className="peer appearance-none absolute"
                type="radio"
                id="blind_runner"
                name="runner_type"
                value="blind_runner"
                aria-label="시각장애인"
              />
              <div className="flex justify-center items-center w-full h-[52px] px-4 font-bold rounded-lg border-1 border-[var(--color-site-gray)] text-[var(--color-site-gray)] peer-checked:bg-[var(--color-site-yellow)] peer-checked:border-[var(--color-site-yellow)] peer-checked:text-[var(--color-site-black)] transition">
                시각장애인
              </div>
            </label>
          </div>
        </fieldset>
        <div className={tw("relative")}>
          <Input
            style={{ height: "52px" }}
            label="닉네임"
            name="nickname"
            type="text"
            placeholder="닉네임을 입력해주세요."
            required
          />
          <Button type="button" className={tw("absolute right-1.5 bottom-1.5")}>
            중복 확인
          </Button>
        </div>
        <Button
          type="submit"
          formAction={signUp}
          height="medium"
          fullWidth={true}
        >
          회원가입
          <IconCheck />
        </Button>
      </form>
    </div>
  );
}

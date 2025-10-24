"use client";

import { useState } from "react";
import { checkEmail } from "@/app/auth/_actions/check-email";
import { checkNickname } from "@/app/auth/_actions/check-nickname";
import { Button } from "@/components/common";
import { IconCheck } from "@/components/common/icons";
import { tw } from "@/utils";
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from "@/utils/validators";
import { signUp } from "../_actions/auth-action";
import DuplicateCheckInput from "./duplicate-check-input";
import PasswordInput from "./password-input";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  // 이메일 중복 확인
  const handleEmailCheck = async (email: string) => {
    const formData = new FormData();
    formData.append("email", email);
    return await checkEmail(formData);
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async (nickname: string) => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    return await checkNickname(formData);
  };

  // 패스워드
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const validation = validatePassword(value);
    setPasswordError(validation.isValid ? "" : validation.message);
  };

  // 패스워드 확인
  const handlePasswordConfirmChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setPasswordConfirm(value);

    const validation = validatePasswordConfirm(password, value);
    setPasswordConfirmError(validation.isValid ? "" : validation.message);
  };

  return (
    <form className={tw("flex flex-col gap-6")}>
      {/* 이메일 입력 */}
      <DuplicateCheckInput
        label="이메일"
        name="email"
        type="email"
        placeholder="이메일 주소를 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onCheck={handleEmailCheck}
        validate={validateEmail}
        required
      />

      {/* 비밀번호 */}
      <PasswordInput
        label="비밀번호"
        name="password"
        value={password}
        onChange={handlePasswordChange}
        isError={passwordError !== ""}
        errorMessage={passwordError}
        required
      />
      <PasswordInput
        label="비밀번호 확인"
        name="password_confirm"
        value={passwordConfirm}
        onChange={handlePasswordConfirmChange}
        isError={passwordConfirmError !== ""}
        errorMessage={passwordConfirmError}
        required
      />

      {/* 러너타입 */}
      <fieldset>
        <label
          htmlFor="guide_runner"
          className={tw(
            "block text-sm font-medium mb-[4px] text-[var(--color-site-gray)] cursor-pointer",
          )}
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
              defaultChecked
              required
            />
            <div
              className={tw(
                "flex justify-center items-center",
                "w-full h-[52px] px-4",
                "rounded-lg border-1 border-[var(--color-site-gray)]",
                "font-bold  text-[var(--color-site-gray)]",
                "peer-checked:bg-[var(--color-site-yellow)] peer-checked:border-[var(--color-site-yellow)] peer-checked:text-[var(--color-site-black)] transition",
              )}
            >
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
              required
            />
            <div
              className={tw(
                "flex justify-center items-center",
                "w-full h-[52px] px-4 rounded-lg border-1 border-[var(--color-site-gray)]",
                "font-bold text-[var(--color-site-gray)]",
                "peer-checked:bg-[var(--color-site-yellow)] peer-checked:border-[var(--color-site-yellow)] peer-checked:text-[var(--color-site-black)] transition",
              )}
            >
              시각장애인
            </div>
          </label>
        </div>
      </fieldset>

      {/* 닉네임 입력 */}
      <DuplicateCheckInput
        label="닉네임"
        name="nickname"
        type="text"
        placeholder="닉네임을 입력해주세요."
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        onCheck={handleNicknameCheck}
        validate={validateNickname}
        required
      />

      {/* 회원가입 버튼 */}
      <Button
        type="submit"
        formAction={signUp}
        className="mt-4"
        height="medium"
        fullWidth={true}
      >
        회원가입
        <IconCheck />
      </Button>
    </form>
  );
}

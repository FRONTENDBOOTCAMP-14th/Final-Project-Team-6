"use client";

import { useState } from "react";
import { checkEmail } from "@/app/auth/_actions/check-email";
import { checkNickname } from "@/app/auth/_actions/check-nickname";
import { Button } from "@/components/common";
import { IconCheck } from "@/components/common/icons";
import { useDialog } from "@/stores/use-dialog";
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

  // 중복확인 완료 상태
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // dialog
  const { openDialog } = useDialog();

  // 이메일 중복 확인
  const handleEmailCheck = async (email: string) => {
    const formData = new FormData();
    formData.append("email", email);
    const result = await checkEmail(formData);

    if (result?.available) {
      setIsEmailChecked(true);
    }

    return result;
  };

  // 이메일 변경 시 중복확인 상태 초기화
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailChecked(false);
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async (nickname: string) => {
    const formData = new FormData();
    formData.append("nickname", nickname);
    const result = await checkNickname(formData);

    if (result?.available) {
      setIsNicknameChecked(true);
    }

    return result;
  };

  // 닉네임 변경 시 중복확인 상태 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameChecked(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isEmailChecked) {
      openDialog("alert", {
        message: "이메일 중복확인을 해주세요.",
      });
      return;
    }

    if (!isNicknameChecked) {
      openDialog("alert", {
        message: "닉네임 중복확인을 해주세요.",
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    await signUp(formData);
  };

  return (
    <form className={tw("flex flex-col gap-6")} onSubmit={handleSubmit}>
      {/* 이메일 입력 */}
      <DuplicateCheckInput
        label="이메일"
        name="email"
        type="email"
        placeholder="이메일 주소를 입력해주세요."
        value={email}
        onChange={handleEmailChange}
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
        onChange={handleNicknameChange}
        onCheck={handleNicknameCheck}
        validate={validateNickname}
        required
      />

      {/* 회원가입 버튼 */}
      <Button type="submit" className="mt-4" height="medium" fullWidth={true}>
        회원가입
        <IconCheck />
      </Button>
    </form>
  );
}

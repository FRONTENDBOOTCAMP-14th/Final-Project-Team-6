"use client";

import { useState } from "react";
import { checkEmail } from "@/app/auth/_actions/check-email";
import { checkNickname } from "@/app/auth/_actions/check-nickname";
import { Button, Input } from "@/components/common";
import { IconCheck } from "@/components/common/icons";
import { tw } from "@/utils";
import {
  validateEmail,
  validateNickname,
  validatePassword,
  validatePasswordConfirm,
} from "@/utils/validators";
import { signUp } from "../_actions/auth-action";
import PasswordInput from "./password-input";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState("");
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingNickname, setIsCheckingNickname] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setEmailCheckMessage(validation.message);
      setIsEmailChecked(false);
      return;
    }

    setIsCheckingEmail(true);

    try {
      const formData = new FormData();
      formData.append("email", email);

      const result = await checkEmail(formData);

      if (result.available) {
        setIsEmailChecked(true);
        setEmailCheckMessage("사용 가능한 이메일입니다.");
      } else {
        setIsEmailChecked(false);
        setEmailCheckMessage(result.error || "이미 사용 중인 이메일입니다.");
      }
    } catch {
      setIsEmailChecked(false);
      setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // 이메일 중복 확인 초기화
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setIsEmailChecked(false);
    setEmailCheckMessage("");
  };

  // 닉네임 중복 확인
  const handleNicknameCheck = async () => {
    const validation = validateNickname(nickname);
    if (!validation.isValid) {
      setNicknameCheckMessage(validation.message);
      setIsNicknameChecked(false);
      return;
    }

    setIsCheckingNickname(true);

    try {
      const formData = new FormData();
      formData.append("nickname", nickname);

      const result = await checkNickname(formData);

      if (result.available) {
        setIsNicknameChecked(true);
        setNicknameCheckMessage("사용 가능한 닉네임입니다.");
      } else {
        setIsNicknameChecked(false);
        setNicknameCheckMessage(result.error || "이미 사용 중인 닉네임입니다.");
      }
    } catch {
      setIsNicknameChecked(false);
      setNicknameCheckMessage("닉네임 확인 중 오류가 발생했습니다.");
    } finally {
      setIsCheckingNickname(false);
    }
  };

  // 닉네임 중복 확인 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value);
    setIsNicknameChecked(false);
    setNicknameCheckMessage("");
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
      <div className={tw("relative")}>
        <Input
          style={{ height: "52px" }}
          label="이메일"
          name="email"
          type="email"
          placeholder="이메일 주소를 입력해주세요."
          value={email}
          onChange={handleEmailChange}
          isError={emailCheckMessage !== "" && !isEmailChecked}
          errorMessage={emailCheckMessage}
          suffixButton={
            <Button
              type="button"
              onClick={handleEmailCheck}
              disabled={isCheckingEmail}
            >
              {isCheckingEmail ? "확인 중..." : "중복 확인"}
            </Button>
          }
          required
        />
        {isEmailChecked && emailCheckMessage && (
          <p className={tw("text-sm mt-1 text-green-600")}>
            {emailCheckMessage}
          </p>
        )}
      </div>

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
              required
            />
            <div className="flex justify-center items-center w-full h-[52px] px-4 font-bold rounded-lg border-1 border-[var(--color-site-gray)] text-[var(--color-site-gray)] peer-checked:bg-[var(--color-site-yellow)] peer-checked:border-[var(--color-site-yellow)] peer-checked:text-[var(--color-site-black)] transition">
              시각장애인
            </div>
          </label>
        </div>
      </fieldset>

      {/* 닉네임 입력 */}
      <div className={tw("relative")}>
        <Input
          style={{ height: "52px" }}
          label="닉네임"
          name="nickname"
          type="text"
          placeholder="닉네임을 입력해주세요."
          value={nickname}
          onChange={handleNicknameChange}
          isError={nicknameCheckMessage !== "" && !isNicknameChecked}
          errorMessage={nicknameCheckMessage}
          suffixButton={
            <Button
              type="button"
              onClick={handleNicknameCheck}
              disabled={isCheckingNickname}
            >
              {isCheckingNickname ? "확인 중..." : "중복 확인"}
            </Button>
          }
          required
        />
        {isNicknameChecked && nicknameCheckMessage && (
          <p className={tw("text-sm mt-1 text-green-600")}>
            {nicknameCheckMessage}
          </p>
        )}
      </div>

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

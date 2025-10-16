"use client";

import { type InputHTMLAttributes, useState } from "react";
import { Input } from "@/components/common";
import { IconEye, IconEyeOff } from "@/components/common/icons";

interface PasswordProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  isError?: boolean;
  errorMessage?: string;
  suffixButton?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export default function PasswordInput({ label }: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Input
      label={label}
      name="password"
      type={showPassword ? "text" : "password"}
      placeholder="비밀번호를 입력해주세요."
      suffixIcon={
        <button
          type="button"
          aria-label={showPassword ? "비밀번호 보기" : "비밀번호 숨기기"}
          onClick={togglePassword}
        >
          {showPassword ? <IconEye /> : <IconEyeOff />}
        </button>
      }
      required
    />
  );
}

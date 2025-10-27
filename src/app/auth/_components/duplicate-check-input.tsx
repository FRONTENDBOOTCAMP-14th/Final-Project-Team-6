"use client";

import { useState } from "react";
import { Button, Input } from "@/components/common";
import { tw } from "@/utils";

interface DuplicateCheckInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck: (value: string) => Promise<{ available: boolean; error?: string }>;
  validate: (value: string) => { isValid: boolean; message: string };
  required?: boolean;
}

export default function DuplicateCheckInput({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  onCheck,
  validate,
  required = false,
}: DuplicateCheckInputProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = async () => {
    const validation = validate(value);
    if (!validation.isValid) {
      setCheckMessage(validation.message);
      setIsChecked(false);
      return;
    }

    setIsChecking(true);

    try {
      const result = await onCheck(value);

      if (result.available) {
        setIsChecked(true);
        setCheckMessage(`사용 가능한 ${label}입니다.`);
      } else {
        setIsChecked(false);
        setCheckMessage(result.error || `이미 사용 중인 ${label}입니다.`);
      }
    } catch {
      setIsChecked(false);
      setCheckMessage(`${label} 확인 중 오류가 발생했습니다.`);
    } finally {
      setIsChecking(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    setIsChecked(false);
    setCheckMessage("");
  };

  return (
    <div className={tw("relative")}>
      <Input
        style={{ height: "52px" }}
        label={label}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        isError={checkMessage !== "" && !isChecked}
        errorMessage={checkMessage}
        suffixButton={
          <Button type="button" onClick={handleCheck} disabled={isChecking}>
            {isChecking ? "확인 중..." : "중복 확인"}
          </Button>
        }
        required={required}
      />
      {isChecked && checkMessage && (
        <p className={tw("text-sm mt-1 text-green-600")}>{checkMessage}</p>
      )}
    </div>
  );
}

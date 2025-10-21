"use client";

import type React from "react";
import { useState } from "react";
import DaumPostcode from "@/app/post/write/_components/daum-post-search";
import type { Address } from "@/app/post/write/address-type";
import { Button, Input } from "@/components/common/index";

interface MeetingPlaceInputProps {
  value: string;
  // readOnly라 실제 호출되진 않지만, Input의 타입 일관성을 위해 추가
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressSelect: (address: string) => void;
}

export default function MeetingPlaceInput({
  value,
  onChange,
  onAddressSelect,
}: MeetingPlaceInputProps) {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const handleOpenPostcode = () => setIsPostcodeOpen(true);
  const handleClosePostcode = () => setIsPostcodeOpen(false);

  const handleCompletePostcode = (data: Address) => {
    const fullAddress = data.roadAddress || data.jibunAddress;
    onAddressSelect(fullAddress);
    handleClosePostcode();
  };

  return (
    <>
      <Input
        label="만남 장소"
        name="meeting_place" // 폼 전송을 위한 name
        type="text"
        placeholder="주소를 입력해주세요."
        value={value}
        onChange={onChange}
        suffixButton={
          <Button type="button" onClick={handleOpenPostcode}>
            찾기
          </Button>
        }
        required
        readOnly // 주소 검색으로만 입력
      />

      {isPostcodeOpen && (
        <DaumPostcode
          onComplete={handleCompletePostcode}
          onClose={handleClosePostcode}
        />
      )}
    </>
  );
}

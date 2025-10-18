"use client";

import { useState } from "react";
import DaumPostcode from "@/app/post/write/_components/daum-post-search";
import { createPost } from "@/app/post/write/action";
import { Button, Input } from "@/components/common/index";
import type { Address } from "./address-type";

export default function PostWritePage() {
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

  const [meetingPlace, setMeetingPlace] = useState("");

  const handleOpenPostcode = () => {
    setIsPostcodeOpen(true);
  };

  const handleClosePostcode = () => {
    setIsPostcodeOpen(false);
  };

  const handleCompletePostcode = (data: Address) => {
    const fullAddress = data.roadAddress || data.jibunAddress;
    setMeetingPlace(fullAddress);
    handleClosePostcode();
  };

  return (
    <main className="w-full max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">동행 신청 페이지</h1>

      <form action={createPost} className="flex flex-col gap-5">
        <Input
          label="제목"
          name="title"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
        <Input
          label="만남 장소"
          name="meeting_place"
          type="text"
          placeholder="주소를 입력해주세요."
          value={meetingPlace}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMeetingPlace(e.target.value)
          }
          suffixButton={
            <Button type="button" onClick={handleOpenPostcode}>
              찾기
            </Button>
          }
          required
          readOnly
        />
        <Input
          label="상세 장소"
          name="meeting_detail_place"
          type="text"
          placeholder="예시) OOO역 3번 출구"
          required
        />
        <Input
          label="시간"
          name="meeting_time"
          type="datetime-local"
          required
          className="date-input"
        />
        <Input
          label="목표 거리 (km)"
          name="goal_km"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="숫자만 입력 (예: 10)"
          suffixText="km"
          required
        />
        <Input
          label="페이스 (km당 분)"
          name="pace"
          type="text"
          placeholder="예시) 5분 30초"
          required
        />

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-[4px] text-[var(--color-site-gray)]"
          >
            상세한 러닝 내용
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            placeholder="상세한 러닝 계획을 알려주세요."
            required
            className="focus:outline-none w-full bg-transparent border border-[var(--color-site-gray)] focus:border-[var(--color-site-white)] rounded-md p-[12px] text-[var(--color-site-gray) resize-none ]"
          />
        </div>

        <Button type="submit" fullWidth>
          작성완료
        </Button>
      </form>

      {isPostcodeOpen && (
        <DaumPostcode
          onComplete={handleCompletePostcode}
          onClose={handleClosePostcode}
        />
      )}
    </main>
  );
}

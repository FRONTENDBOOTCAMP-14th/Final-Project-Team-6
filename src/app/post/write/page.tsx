"use client";

import type React from "react";
import { useState } from "react";
import MeetingPlaceInput from "@/app/post/write/_components/meeting-place-input";
import PaceInput from "@/app/post/write/_components/pace-input";
import TextAreaInput from "@/app/post/write/_components/text-area-input";
import { createPost } from "@/app/post/write/action";
import { Button, Input } from "@/components/common/index";

export default function PostWritePage() {
  const [meetingPlace, setMeetingPlace] = useState("");
  const [goalKm, setGoalKm] = useState("");
  const [description, setDescription] = useState("");

  const handleGoalKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setGoalKm(value);
    }
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

        <MeetingPlaceInput
          value={meetingPlace}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMeetingPlace(e.target.value)
          }
          onAddressSelect={setMeetingPlace}
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
          value={goalKm}
          onChange={handleGoalKmChange}
        />

        <PaceInput />

        <TextAreaInput
          label="상세한 러닝 내용"
          id="description"
          name="description"
          placeholder="상세한 러닝 계획을 알려주세요."
          required
          rows={5}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Button type="submit" fullWidth>
          작성완료
        </Button>
      </form>
    </main>
  );
}

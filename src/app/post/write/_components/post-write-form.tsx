"use client";

import type React from "react";
import { useState } from "react";
import { createPost } from "@/app/post/write/action";
import { Button, Input } from "@/components/common/index";
import MeetingPlaceInput from "./meeting-place-input";
import PaceInput from "./pace-input";
import TextAreaInput from "./text-area-input";

export default function PostWriteForm() {
  const [meetingPlace, setMeetingPlace] = useState("");
  const [goalKm, setGoalKm] = useState("");
  const [description, setDescription] = useState("");

  const [localTime, setLocalTime] = useState("");
  const utcTime = localTime ? new Date(localTime).toISOString() : "";

  const handleGoalKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setGoalKm(value);
    }
  };

  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

  return (
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
        name="meeting_time_local"
        type="datetime-local"
        required
        className="date-input"
        min={minDateTime}
        value={localTime}
        onChange={(e) => setLocalTime(e.target.value)}
      />

      <input
        type="hidden"
        name="meeting_time" // 서버 액션이 실제 받는 이름
        value={utcTime} // UTC로 변환된 값
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
        className="break-all"
      />

      <Button type="submit" fullWidth height="medium">
        작성 완료
      </Button>
    </form>
  );
}

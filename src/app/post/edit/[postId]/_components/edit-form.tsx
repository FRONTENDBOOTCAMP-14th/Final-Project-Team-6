"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import MeetingPlaceInput from "@/app/post/write/_components/meeting-place-input";
import PaceInput from "@/app/post/write/_components/pace-input";
import TextAreaInput from "@/app/post/write/_components/text-area-input";
import { Button, Input } from "@/components/common";
import { IconClose, IconEdit } from "@/components/common/icons";
import { siteHexColor } from "@/constant";
import type { PostData } from "../_actions/type";
import updatePost from "../_actions/update-post";

interface Props {
  postData: PostData;
}

function formatDateTime(isoString: string) {
  const date = new Date(isoString);

  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );

  return offsetDate.toISOString().slice(0, 16);
}

export default function EditForm({ postData }: Props) {
  const router = useRouter();

  const [meetingPlace, setMeetingPlace] = useState(postData.meeting_place);
  const [goalKm, setGoalKm] = useState(`${postData.goal_km}`);
  const [description, setDescription] = useState(postData.description);

  const handleGoalKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      setGoalKm(value);
    }
  };

  const handleFormAction = async (formData: FormData) => {
    formData.append("postId", postData.id);
    await updatePost(formData);
  };

  return (
    <form action={handleFormAction} className="flex flex-col gap-5">
      <Input
        label="제목"
        name="title"
        type="text"
        defaultValue={postData.title}
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
        defaultValue={postData.meeting_detail_place}
        placeholder="예시) OOO역 3번 출구"
        required
      />
      <Input
        label="시간"
        name="meeting_time"
        type="datetime-local"
        required
        className="date-input"
        defaultValue={formatDateTime(postData.meeting_time)}
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

      <PaceInput initValue={postData.pace} />

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

      <div className="flex gap-3">
        <Button type="submit" fullWidth height="medium">
          편집완료
          <IconEdit />
        </Button>
        <Button
          type="button"
          fullWidth
          height="medium"
          buttonColor={siteHexColor.gray}
          onClick={() => {
            router.back();
          }}
        >
          취소
          <IconClose />
        </Button>
      </div>
    </form>
  );
}

"use client";

import { type ChangeEvent, useState } from "react";
import { sendMessage } from "./action";
import FormContents from "./send-message-form-content";

interface Props {
  roomId: string;
  currentUserId: string;
  matchedStatus: string;
}

export default function SendMessageForm({
  roomId,
  currentUserId,
  matchedStatus,
}: Props) {
  const [msgBody, setMsgBody] = useState("");
  const handleMsgBody = (e: ChangeEvent<HTMLInputElement>) => {
    setMsgBody(e.target.value);
  };
  const handleFormAction = async (formData: FormData) => {
    formData.append("roomId", roomId);
    formData.append("currentUserId", currentUserId);
    await sendMessage(formData);
    setMsgBody("");
  };

  return (
    <div className="bg-site-lightblack px-3 h-18 fixed bottom-0 w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 rounded-t-xl">
      {matchedStatus === "matched" && (
        <form
          action={handleFormAction}
          autoComplete="off"
          className="flex items-center h-full gap-3"
        >
          <FormContents
            msgBody={msgBody}
            handleMsgBody={handleMsgBody}
            disabled={msgBody.trim().length === 0}
          />
        </form>
      )}
      {matchedStatus === "cancelled" && (
        <p className="h-full flex items-center justify-center text-lg text-site-gray">
          매칭이 취소 되었습니다.
        </p>
      )}
      {matchedStatus === "completed" && (
        <p className="h-full flex items-center justify-center text-lg text-site-gray">
          러닝이 완료 되었습니다.
        </p>
      )}
    </div>
  );
}

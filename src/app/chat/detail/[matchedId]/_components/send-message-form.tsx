"use client";

import { type ChangeEvent, useState } from "react";
import wait from "@/utils/wait";
import { sendMessage } from "./action";
import FormContents from "./send-message-form-content";

interface Props {
  roomId: string;
  currentUserId: string;
}

export default function SendMessageForm({ roomId, currentUserId }: Props) {
  const [msgBody, setMsgBody] = useState("");

  const handleMsgBody = (e: ChangeEvent<HTMLInputElement>) => {
    setMsgBody(e.target.value);
  };

  const handleFormAction = async (formData: FormData) => {
    await wait(2);
    formData.append("roomId", roomId);
    formData.append("currentUserId", currentUserId);
    await sendMessage(formData);
    setMsgBody("");
  };

  return (
    <div className="bg-site-lightblack px-3 h-18 fixed bottom-0 w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 rounded-t-xl">
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
    </div>
  );
}

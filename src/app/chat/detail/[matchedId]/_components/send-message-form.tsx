"use client";

import { type ChangeEvent, useState } from "react";
import { IconPaperPlane } from "@/components/common/icons";
import { tw } from "@/utils";
import { sendMessage } from "./action";

interface Props {
  roomId: string;
  currentUserId: string;
}

export default function SendMessageForm({ roomId, currentUserId }: Props) {
  const [msgBody, setMsgBody] = useState("");
  const handleMsgBody = (e: ChangeEvent<HTMLInputElement>) =>
    setMsgBody(e.target.value);

  const handleFormAction = async (formData: FormData) => {
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
        <label htmlFor="message-body" className="sr-only">
          보낼 메세지
        </label>
        <input
          id="message-body"
          type="text"
          name="message-body"
          value={msgBody}
          onChange={handleMsgBody}
          placeholder="보낼 메세지를 입력해주세요."
          className={tw(
            "w-full h-11 rounded-full pl-5 pr-2 bg-site-black/50",
            "focus:bg-site-black focus:outline-0",
            "transition-[background-color] duration-300",
          )}
          required
        />
        <button
          type="submit"
          aria-label="메세지 보내기"
          className={tw(
            "w-11 aspect-square px-0 flex-shrink-0 flex items-center justify-center rounded-full",
            "cursor-pointer bg-site-blue",
            "disabled:cursor-not-allowed disabled:bg-site-gray",
            "transition-[background-color] duration-300",
          )}
          disabled={msgBody.trim().length === 0}
        >
          <IconPaperPlane />
        </button>
      </form>
    </div>
  );
}

"use client";

import { type ChangeEvent, useState } from "react";
import { useFormStatus } from "react-dom";
import { IconLoading, IconPaperPlane } from "@/components/common/icons";
import { tw } from "@/utils";
import wait from "@/utils/wait";
import { sendMessage } from "./action";

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
    await wait(5);
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
        <MessageInput msgBody={msgBody} handleMsgBody={handleMsgBody} />
        <SubmitButton disabled={msgBody.trim().length === 0} />
      </form>
    </div>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-label="메세지 보내기"
      disabled={disabled || pending}
      className={tw(
        "w-11 aspect-square flex items-center justify-center rounded-full bg-site-blue",
        "disabled:cursor-not-allowed disabled:bg-site-gray",
        "transition-[background-color] duration-300",
        pending && "disabled:bg-site-blue",
      )}
    >
      {pending ? <IconLoading size={12} /> : <IconPaperPlane />}
    </button>
  );
}

function MessageInput({
  msgBody,
  handleMsgBody,
}: {
  msgBody: string;
  handleMsgBody: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { pending } = useFormStatus();

  return (
    <>
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
          "disabled:opacity-70",
        )}
        required
        disabled={pending}
      />
    </>
  );
}

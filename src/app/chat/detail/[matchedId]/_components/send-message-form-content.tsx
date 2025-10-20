import { type ChangeEvent, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { IconLoading, IconPaperPlane } from "@/components/common/icons";
import { tw } from "@/utils";

export default function FormContents({
  msgBody,
  handleMsgBody,
  disabled,
}: {
  msgBody: string;
  disabled: boolean;
  handleMsgBody: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const { pending } = useFormStatus();
  const msgInputRef = useRef<HTMLInputElement>(null);
  const wasPendingRef = useRef(false);

  useEffect(() => {
    if (wasPendingRef.current && !pending) {
      msgInputRef.current?.focus();
    }
    wasPendingRef.current = pending;
  }, [pending]);

  return (
    <>
      <label htmlFor="message-body" className="sr-only">
        보낼 메세지
      </label>
      <input
        ref={msgInputRef}
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
    </>
  );
}

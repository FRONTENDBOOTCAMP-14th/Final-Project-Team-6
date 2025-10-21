"use client";

import { type ChangeEvent, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendMessage } from "./action";
import FormContents from "./send-message-form-content";

interface Props {
  roomId: string;
  currentUserId: string;
  matchedStatus: string;
  matchedId: string;
}

export default function SendMessageForm({
  roomId,
  currentUserId,
  matchedStatus,
  matchedId,
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

  const [currentMatchesStatus, setCurrentMatchesStatus] =
    useState(matchedStatus);
  useEffect(() => {
    const supabase = createClient();

    const matchesStatusChannel = supabase
      .channel(`${matchedId}-matches-status`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matches",
          filter: `id=eq.${matchedId}`,
        },
        (payload) => {
          setCurrentMatchesStatus(payload.new.status);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchesStatusChannel);
    };
  }, [matchedId]);

  return (
    <div className="bg-site-lightblack px-3 h-18 fixed bottom-0 w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 rounded-t-xl">
      {currentMatchesStatus === "matched" && (
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
      {currentMatchesStatus === "cancelled" && (
        <p className="h-full flex items-center justify-center text-lg text-site-gray">
          매칭이 취소 되었습니다.
        </p>
      )}
      {currentMatchesStatus === "completed" && (
        <p className="h-full flex items-center justify-center text-lg text-site-gray">
          러닝이 완료 되었습니다.
        </p>
      )}
    </div>
  );
}

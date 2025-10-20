"use client";

import { useEffect, useRef } from "react";
import MsgList from "./msg-list";
import MsgRealTime from "./msg-real-time";

interface Props {
  currentUserId: string;
  roomId: string;
  messagesData: {
    id: string;
    body: string;
    created_at: string;
    sender_id: string;
    profiles: {
      nickname: string;
      profile_image_url: string | null;
      runner_type: string;
    };
  }[];
}

export default function MsgScrollContainer({
  currentUserId,
  roomId,
  messagesData,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, []);

  return (
    <div
      ref={scrollRef}
      className="fixed top-[150px] overflow-y-auto h-[calc(100vh-222px)] w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 px-5 custom-scrollbar"
    >
      <ul className="flex flex-col gap-8 py-6">
        <MsgList messagesData={messagesData} currentUserId={currentUserId} />
        <MsgRealTime roomId={roomId} currentUserId={currentUserId} />
      </ul>
    </div>
  );
}

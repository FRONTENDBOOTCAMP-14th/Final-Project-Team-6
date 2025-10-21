"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import MsgList from "./msg-list";
import MsgRealTime from "./msg-real-time";

export interface NewMsgData {
  nickname: string;
  profile_image_url: string | null;
  body: string;
  created_at: string;
  id: string;
  room_id: string;
  sender_id: string;
  runner_type: string;
}

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
  const supabase = createClient();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [newMsgData, setNewMsgData] = useState<NewMsgData[]>([]);

  useEffect(() => {
    const msgRealTimeChannel = supabase
      .channel(`room-${roomId}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        setNewMsgData((prev) => [...prev, payload.payload as NewMsgData]);

        setTimeout(() => {
          const el = scrollRef.current;
          if (!el) return;

          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }, 50);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgRealTimeChannel);
    };
  }, [supabase, roomId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, []);

  return (
    <div
      ref={scrollRef}
      className="fixed top-[150px] overflow-y-auto h-[calc(100vh-222px)] w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 px-5 custom-scrollbar"
    >
      <ul className="flex flex-col gap-8 py-6">
        <MsgList messagesData={messagesData} currentUserId={currentUserId} />
        <MsgRealTime newMsgData={newMsgData} currentUserId={currentUserId} />
      </ul>
    </div>
  );
}

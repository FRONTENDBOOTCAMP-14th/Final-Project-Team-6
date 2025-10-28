"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { RoomChatMessage } from "../_actions/type";
import MessageListInitial from "./message-list-initial";
import MessageListRealtime from "./message-list-realtime";

interface Props {
  currentUserId: string;
  roomId: string;
  messagesData: RoomChatMessage[];
}

export default function MessageScrollContainer({
  currentUserId,
  roomId,
  messagesData,
}: Props) {
  const router = useRouter();
  useEffect(() => {
    const handlePopState = () => router.refresh();
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [router]);

  const scrollRef = useRef<HTMLDivElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: messagesData change triggers scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "auto" });
  }, [messagesData]);

  return (
    <div
      ref={scrollRef}
      className="fixed top-[150px] overflow-y-auto h-[calc(100dvh-222px)] w-full max-w-(--viewport-size) left-1/2 -translate-x-1/2 px-5 custom-scrollbar"
    >
      <ul className="flex flex-col gap-8 py-6">
        <MessageListInitial
          messagesData={messagesData}
          currentUserId={currentUserId}
        />
        <MessageListRealtime
          scrollRef={scrollRef}
          roomId={roomId}
          currentUserId={currentUserId}
        />
      </ul>
    </div>
  );
}

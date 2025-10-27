"use client";

import { type RefObject, useEffect, useState } from "react";
import { formatUTCtoKST } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import type { RoomNewMessage } from "../_actions/type";
import MessageItemPartner from "./message-item-partner";
import MessageItemSelf from "./message-item-self";

interface Props {
  currentUserId: string;
  scrollRef: RefObject<HTMLDivElement | null>;
  roomId: string;
}

export default function MessageListRealtime({
  scrollRef,
  roomId,
  currentUserId,
}: Props) {
  const [newMessage, setNewMessage] = useState<RoomNewMessage[]>([]);

  const supabase = createClient();
  useEffect(() => {
    const newMessageChannel = supabase
      .channel(`room-${roomId}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        setNewMessage((prev) => [...prev, payload.payload as RoomNewMessage]);

        setTimeout(() => {
          const el = scrollRef.current;
          if (!el) return;

          el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
        }, 50);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(newMessageChannel);
    };
  }, [supabase, roomId, scrollRef]);

  return (
    <>
      {newMessage.map(
        ({
          nickname,
          profile_image_url,
          body,
          created_at,
          id,
          sender_id,
          runner_type,
        }) => {
          const sendedDate = formatUTCtoKST(created_at);
          const isBlindRunner = runner_type === "blind_runner";

          if (sender_id === currentUserId) {
            return (
              <MessageItemSelf key={id} body={body} sendedDate={sendedDate} />
            );
          } else {
            return (
              <MessageItemPartner
                key={id}
                body={body}
                sendedDate={sendedDate}
                nickname={nickname}
                profile_image_url={profile_image_url}
                isBlindRunner={isBlindRunner}
              />
            );
          }
        },
      )}
    </>
  );
}

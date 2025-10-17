"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface Props {
  roomId: string;
  currentUserId: string;
}

interface NewMsgData {
  nickname: string;
  profile_image_url: string | null;
  body: string;
  created_at: string;
  id: string;
  room_id: string;
  sender_id: string;
}

export default function MsgRealTime({ roomId, currentUserId }: Props) {
  const supabase = createClient();
  const [newMsgData, setNewMsgData] = useState<NewMsgData[]>([]);

  useEffect(() => {
    const msgRealTimeChannel = supabase
      .channel(`room-${roomId}`)
      .on("broadcast", { event: "new_message" }, (payload) => {
        setNewMsgData((prev) => [...prev, payload.payload as NewMsgData]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(msgRealTimeChannel);
    };
  }, [supabase, roomId]);

  return (
    <>
      {newMsgData.map((i) => {
        console.log(i);
        if (i.sender_id === currentUserId) {
          return <li key={i.id}>{i.body}</li>;
        } else {
          return <li key={i.id}>{i.body}</li>;
        }
      })}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { formatUTCtoKST } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import MsgPartnerItem from "./msg-partner-item";
import MsgSelfItem from "./msg-self-item";

interface NewMsgData {
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
  roomId: string;
  currentUserId: string;
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
      {newMsgData.map(
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
            return <MsgSelfItem key={id} body={body} sendedDate={sendedDate} />;
          } else {
            return (
              <MsgPartnerItem
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

"use client";

import { formatUTCtoKST } from "@/utils";
import MsgPartnerItem from "./msg-partner-item";
import type { NewMsgData } from "./msg-scroll-container";
import MsgSelfItem from "./msg-self-item";

interface Props {
  currentUserId: string;
  newMsgData: NewMsgData[];
}

export default function MsgRealTime({ newMsgData, currentUserId }: Props) {
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

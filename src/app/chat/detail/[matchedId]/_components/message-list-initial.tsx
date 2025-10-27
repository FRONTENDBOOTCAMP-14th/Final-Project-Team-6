import { formatUTCtoKST } from "@/utils";
import type { RoomChatMessage } from "../_actions/type";
import MessageItemPartner from "./message-item-partner";
import MessageItemSelf from "./message-item-self";

interface Props {
  messagesData: RoomChatMessage[];
  currentUserId: string;
}

export default function MessageListInitial({
  messagesData,
  currentUserId,
}: Props) {
  return (
    <>
      {messagesData.map(({ id, body, created_at, sender_id, profiles }) => {
        const sendedDate = formatUTCtoKST(created_at);
        const isBlindRunner = profiles.runner_type === "blind_runner";

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
              nickname={profiles.nickname}
              profile_image_url={profiles?.profile_image_url}
              isBlindRunner={isBlindRunner}
            />
          );
        }
      })}
    </>
  );
}

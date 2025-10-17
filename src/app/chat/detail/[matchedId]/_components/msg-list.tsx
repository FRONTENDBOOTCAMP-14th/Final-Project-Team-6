import { formatUTCtoKST } from "@/utils";
import { MsgPartnerIten } from ".";
import MsgSelfItem from "./msg-self-item";

interface Props {
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
  currentUserId: string;
}

export default async function MsgList({ messagesData, currentUserId }: Props) {
  return (
    <>
      {messagesData.map(({ id, body, created_at, sender_id, profiles }) => {
        const sendedDate = formatUTCtoKST(created_at);
        const isBlindRunner = profiles.runner_type === "blind_runner";

        if (sender_id === currentUserId) {
          return <MsgSelfItem key={id} body={body} sendedDate={sendedDate} />;
        } else {
          return (
            <MsgPartnerIten
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

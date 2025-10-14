import { formatUTCtoKST, tw } from "@/utils";
import Message from "./message";

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
    } | null;
  }[];
  currentUserId: string;
}

export default async function MsgList({ messagesData, currentUserId }: Props) {
  return (
    <ul className="flex flex-col gap-8 py-6">
      {messagesData.map(({ id, body, created_at, sender_id, profiles }) => {
        const sendedDate = formatUTCtoKST(created_at);
        const isBlindRunner = profiles?.runner_type === "blind_runner";

        if (sender_id === currentUserId) {
          return (
            <li key={id}>
              <h2 className="sr-only">내가 보낸 메세지</h2>
              <div className="flex flex-row justify-end gap-2">
                <Message body={body} sendedDate={sendedDate} />
              </div>
            </li>
          );
        } else {
          return (
            <li key={id} className="flex flex-wrap flex-row items-start gap-2">
              <div
                className="rounded-full w-11 aspect-square bg-center bg-cover"
                style={{
                  backgroundImage: `url("/images/${profiles?.profile_image_url}")`,
                }}
              ></div>
              <div className="flex flex-col gap-2 max-w-[calc(100%_-_52px)]">
                <h2 className="font-bold text-sm flex items-center gap-2">
                  {profiles?.nickname}
                  <span
                    className={tw(
                      "text-xs px-1.5 py-[3px] rounded-sm font-bold",
                      `${isBlindRunner ? "text-site-black bg-site-yellow" : "bg-site-blue"}`,
                    )}
                  >
                    {isBlindRunner ? "시각장애인" : "가이드러너"}
                  </span>
                  <span className="sr-only">님이 보낸 메세지</span>
                </h2>
                <div className="flex flex-row flex-wrap gap-2">
                  <Message body={body} sendedDate={sendedDate} sender />
                </div>
              </div>
            </li>
          );
        }
      })}
    </ul>
  );
}

import { tw } from "@/utils";
import Message from "./message";

interface Props {
  body: string;
  sendedDate: string;
  profile_image_url: string | null;
  nickname: string;
  isBlindRunner: boolean;
}

export default function MsgPartnerItem({
  body,
  sendedDate,
  profile_image_url,
  nickname,
  isBlindRunner,
}: Props) {
  return (
    <li className="flex flex-wrap flex-row items-start gap-2">
      <div
        className="rounded-full w-11 aspect-square bg-center bg-cover"
        style={{
          backgroundImage: `url("/images/${profile_image_url}")`,
        }}
      ></div>
      <div className="flex flex-col gap-2 max-w-[calc(100%_-_52px)]">
        <h2 className="font-bold text-sm flex items-center gap-2">
          {nickname}
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

import Image from "next/image";
import formatChatTime from "@/app/chat/list/_libs/format-chat-time";
import type { ChatItemData } from "@/app/chat/list/_types";
import Link from "@/components/common/link";
import tw from "@/utils/tw";

type ChatItemProps = Omit<ChatItemData, "roomId">;

export default function ChatItem({
  matchedId,
  opponent_nickname,
  runnerType,
  postTitle,
  lastMessage,
  lastMessageTime,
  imgSrc,
}: ChatItemProps) {
  // 프로필 이미지 경로 설정
  const src = `/images/${imgSrc}`;

  // 러너 타입 텍스트 변환
  const runnerTypeText =
    runnerType === "blind_runner" ? "시각장애인" : "가이드러너";

  // 러너 타입에 따른 스타일링
  const runnerTypeStyle =
    runnerType === "blind_runner"
      ? "bg-site-yellow text-site-black"
      : "bg-site-blue text-site-white";

  // UTC 시간을 KST로 변환
  const utcDate = new Date(lastMessageTime);
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  // 마지막 메시지 시간 포맷팅 (예: "6분 전")
  const formatTime = formatChatTime(kstDate);

  return (
    <li className="border-b-1 border-site-lightblack">
      <Link
        href={`/chat/detail/${matchedId}`}
        className="flex flex-row gap-y-3 py-5 w-full"
        aria-label={`${runnerTypeText} ${opponent_nickname}님과의 채팅방이고 마지막 대화는 ${formatTime}에 "${lastMessage}"입니다. 관련 게시글 제목은 "${postTitle}"입니다.`}
      >
        <Image
          src={src}
          alt=""
          width={50}
          height={50}
          className="w-12.5 h-12.5 rounded-full"
        />
        <div className="flex flex-col ms-4 gap-y-3 min-w-0 w-full">
          <div className="flex flex-col relative gap-y-2">
            <div className="flex flex-row gap-x-2">
              <h2 className="text-site-white text-sm font-semibold">
                {opponent_nickname}
              </h2>
              <span
                className={tw(
                  "self-center rounded-sm px-1.5 py-[0.1875rem] text-[0.625rem] font-semibold",
                  runnerTypeStyle,
                )}
              >
                {runnerTypeText}
              </span>
            </div>
            <p className="text-[1rem] text-site-gray truncate">{lastMessage}</p>
            <time
              dateTime={lastMessageTime}
              className="absolute right-0 text-site-gray text-sm"
            >
              {formatTime}
            </time>
          </div>
          <p className="bg-site-lightblack px-2 py-1 rounded-sm text-site-gray text-[0.625rem] max-w-fit truncate">
            {postTitle}
          </p>
        </div>
      </Link>
    </li>
  );
}

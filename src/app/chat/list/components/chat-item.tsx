import Image from "next/image";
import Link from "@/components/common/link";
import tw from "@/utils/tw";

interface ChatItemProps {
  roomId: string;
  nickname: string;
  runnerType: "blind_runner" | "guide_runner";
  postTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  imgSrc: string;
}

export default function ChatItem({
  roomId,
  nickname,
  runnerType,
  postTitle,
  lastMessage,
  lastMessageTime,
  imgSrc,
}: ChatItemProps) {
  // 프로필 이미지 경로 설정
  const src = `/assets/${imgSrc}`;

  // 러너 타입 텍스트 변환
  const runnerTypeText =
    runnerType === "blind_runner" ? "시각장애인" : "가이드러너";

  // 러너 타입에 따른 스타일링
  const runnerTypeStyle =
    runnerType === "blind_runner"
      ? "bg-site-yellow text-site-black"
      : "bg-site-blue text-site-white";

  // 마지막 메시지 시간 포맷팅 (예: "6분 전")
  const formatTime = (time: string) => {
    const now = new Date();
    const messageTime = new Date(time);
    const diffInMinutes = Math.floor(
      (now.getTime() - messageTime.getTime()) / 60000,
    );

    if (diffInMinutes < 1) {
      return "방금 전";
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  return (
    <Link
      href={`/chat/detail/${roomId}`}
      className="flex flex-row gap-y-3 py-5 w-full"
    >
      <Image
        src={src}
        alt="상대방 프로필"
        width={50}
        height={50}
        className="w-12.5 h-12.5"
        blurDataURL=""
      />
      <div className="flex flex-col ms-4 gap-y-3 min-w-0 w-full">
        <div className="flex flex-col relative gap-y-2">
          <div className="flex flex-row gap-x-2">
            <h2 className="text-site-white text-sm font-semibold">
              {nickname}
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
          <span className="absolute right-0 text-site-gray text-sm">
            {formatTime(lastMessageTime)}
          </span>
        </div>
        <p className="bg-site-lightblack px-2 py-1 rounded-sm text-site-gray text-[0.625rem] max-w-fit truncate">
          {postTitle}
        </p>
      </div>
    </Link>
  );
}

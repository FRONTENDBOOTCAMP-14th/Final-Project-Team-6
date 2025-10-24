import Image from "next/image";
import formatChatTime from "@/app/chat/list/_libs/format-chat-time";
import type { ChatItemData } from "@/app/chat/list/_types";
import Link from "@/components/common/link";
import RunnerTypeBadge from "@/components/common/runner-type-badge";

type ChatItemProps = Omit<ChatItemData, "roomId">;

// blur placeholder - base64 데이터 URL
const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCACyALIDASIAAhEBAxEB/8QAFwABAQEBAAAAAAAAAAAAAAAAAQACBP/EABUQAQEAAAAAAAAAAAAAAAAAAAAB/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDtSSiSQIFAEkCBQgSSgRAJJAUkgiCKkkCSQiIQpQIJJAkkARQgBSgRAJJAkkgiEKUkCSQJJAiCCSIJJAgUARQjKKUAKAIhBJIVJIEkgRCAkEEUQSRAIoAigZRQjKIAIgUJIEkgSSESSFJBgEiNQEUQBRABoAA0AZDQBkNAACAQIBJICkhCYIYK1DBGoCjQhBFEAigZDQBkVqs0GaGqKDIIBAgEkgKREUaghgpjUEagGERqAiiARQMhoAzWa3WaDNZrVFBmg0AAQCSQEpKhjUZjURTGoI1AMaghgFIggUAFaAMUVqs0GazW6zQZrNaooMgoQJIGiCoYYI1EDGoI1BTGozGoBIIJEABWgDNZrVFBis1us0GazWqzQAIESSUaSIKNQQxBqNRmNQVqGCNQCQQSSACtCgzWa1RQYrNbrNBiitVmiMgpQJIGiCBjUZjUQMajMagrUajMagEggkUABFAVmtVmgzWa1WaDNZrVZogBCiSQEpAY1EkDGokK1GokBKQFJIAVJQVmpAzWakDNZqQAJKiSQP/Z";

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
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
        <div className="flex flex-col ms-4 gap-y-3 min-w-0 w-full">
          <div className="flex flex-col relative gap-y-2">
            <div className="flex flex-row gap-x-2">
              <h2 className="text-site-white text-sm font-semibold">
                {opponent_nickname}
              </h2>
              <RunnerTypeBadge runnerType={runnerType} />
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

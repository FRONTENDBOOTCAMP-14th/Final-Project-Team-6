"use client";

import { useChatListStore } from "@/stores/chat-list-store";
import ChatItem from "./chat-item";
import ChatItemSkeleton from "./chat-item-skeleton";

export default function ChatListContent({ isPending }: { isPending: boolean }) {
  const { chatItems } = useChatListStore();

  // 로딩 중 → 스켈레톤 표시
  if (isPending) {
    return (
      <ul>
        {Array.from({ length: 5 }).map((_, i) => (
          <ChatItemSkeleton key={`skeleton-${String(i)}`} />
        ))}
      </ul>
    );
  }

  return (
    <ul>
      {chatItems.map((room) => (
        <ChatItem
          key={room.roomId}
          matchedId={room.matchedId}
          opponent_nickname={room.opponent_nickname}
          runnerType={room.runnerType}
          postTitle={room.postTitle}
          lastMessage={room.lastMessage}
          lastMessageTime={room.lastMessageTime}
          imgSrc={room.imgSrc}
        />
      ))}
    </ul>
  );
}

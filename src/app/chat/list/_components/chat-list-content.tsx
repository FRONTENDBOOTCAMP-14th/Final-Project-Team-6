"use client";

import { useChatListStore } from "@/stores/chat-list-store";
import ChatItem from "./chat-item";

export default function ChatListContent() {
  const { chatItems } = useChatListStore();

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

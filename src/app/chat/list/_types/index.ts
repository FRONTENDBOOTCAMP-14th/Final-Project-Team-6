export interface ChatItemData {
  roomId: string;
  matchedId: string;
  opponent_nickname: string;
  runnerType: "blind_runner" | "guide_runner";
  postTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  imgSrc: string;
}

export type ChatItemsState = ChatItemData[];

import { fetchChatRoomsData, fetchOpponentData } from "../_libs";
import ChatItem from "./chat-item";

type ChatListProps = {
  userId: string;
  currentPage: number;
  limit: number;
};

export default async function ChatList({
  userId,
  currentPage,
  limit,
}: ChatListProps) {
  // 불러올 데이터의 시작점 계산
  // 예: limit=5, currentPage=1 -> offset=0 / 1페이지
  // 예: limit=5, currentPage=2 -> offset=5 / 2페이지
  // 예: limit=5, currentPage=3 -> offset=10 / 3페이지
  const offset = (currentPage - 1) * limit;

  // ----------------------------------------------------------------
  // 1. 각 room_id마다 가장 최근 메시지 1개만 가져오기
  // 2. 최신 메시지들을 created_at 기준으로 정렬 + 페이지네이션 적용
  // 3. 추출된 room_id 목록으로 채팅방 정보 불러오기
  const { latestMessages, roomIds, rooms } = await fetchChatRoomsData({
    offset,
    limit,
  });

  // ----------------------------------------------------------------
  // 4. room_id 순서대로 rooms 배열 정렬(supabase in()은 순서를 보장하지 않음)
  const sortedRooms = roomIds
    .map((id) => rooms.find((r) => r.id === id))
    .filter(Boolean) as typeof rooms;

  // ----------------------------------------------------------------
  // 5. 각 방의 상대방 ID 계산 및 필요한 데이터 매핑
  const { opponents, mappedRooms } = await fetchOpponentData({
    sortedRooms,
    userId,
  });

  // ----------------------------------------------------------------
  // 6. 최종 데이터 병합
  const chatItems = mappedRooms.map((room) => {
    const opponent = opponents.find((p) => p.id === room.opponentId);
    const lastMsg = latestMessages.find((m) => m.room_id === room.roomId);

    return {
      matchedId: room.matchedId,
      opponent_nickname: opponent?.nickname ?? "알 수 없음",
      runnerType:
        (opponent?.runner_type as "blind_runner" | "guide_runner") ??
        "guide_runner",
      postTitle: room.postTitle,
      lastMessage: lastMsg?.body ?? "메시지가 없습니다.",
      lastMessageTime: lastMsg?.created_at ?? "",
      imgSrc: opponent?.profile_image_url ?? "default-profile-image.png",
    };
  });

  return (
    <ul>
      {chatItems.map((room) => (
        <ChatItem
          key={room.matchedId}
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

import { createClient } from "@/utils/supabase/server";
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

  const supabase = await createClient();

  // ----------------------------------------------------------------
  // 1. 각 room_id마다 가장 최근 메시지 1개만 가져오기
  const { data: latestMessages, error: latestError } = await supabase.rpc(
    "get_latest_messages_per_room",
  );

  if (latestError) {
    throw new Error("최신 메시지 목록을 불러오지 못했습니다.");
  }

  // ----------------------------------------------------------------
  // 2. 최신 메시지들을 created_at 기준으로 정렬 + 페이지네이션 적용
  const paged = (latestMessages ?? [])
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(offset, offset + limit);

  const roomIds = paged.map((m) => m.room_id);

  // ----------------------------------------------------------------
  // 3. 추출된 room_id 목록으로 채팅방 정보 불러오기
  const { data: rooms, error: roomsError } = await supabase
    .from("chat_rooms")
    .select(`
    id,
    posts (
      title,
      author_id
    ),
    matches:matches!chat_rooms_matches_id_fkey (
      id,
      matched_runner_id
    )
  `)
    .in("id", roomIds); // 오프셋과 개수로 불러 올 데이터 범위 지정

  if (roomsError) {
    throw new Error("채팅방 정보를 불러오지 못했습니다.");
  }

  // ----------------------------------------------------------------
  // 4. room_id 순서대로 rooms 배열 정렬(supabase in()은 순서를 보장하지 않음)
  const sortedRooms = roomIds
    .map((id) => rooms.find((r) => r.id === id))
    .filter(Boolean) as typeof rooms;

  // ----------------------------------------------------------------
  // 5. 각 방의 상대방 ID 계산 및 필요한 데이터 매핑
  const mappedRooms = sortedRooms.map((room) => {
    const authorId = room.posts.author_id;
    const matchedId = room.matches.matched_runner_id;
    const isAuthor = authorId === userId;
    const opponentId = isAuthor ? matchedId : authorId; // 내가 작성자면 상대는 매칭된 러너, 내가 매칭된 러너면 상대는 작성자

    return {
      roomId: room.id,
      matchedId: room.matches.id,
      opponentId,
      postTitle: room.posts.title,
    };
  });

  const opponentIds = mappedRooms.map((room) => room.opponentId);

  const { data: opponents, error: profileError } = await supabase
    .from("profiles")
    .select("id, nickname, runner_type, profile_image_url")
    .in("id", opponentIds);

  if (profileError) {
    console.error(profileError);
    throw new Error("상대방 프로필 정보를 불러오지 못했습니다.");
  }

  // ----------------------------------------------------------------
  // 6. 최종 데이터 병합
  const chatItems = mappedRooms.map((room) => {
    const opponent = opponents.find((p) => p.id === room.opponentId);
    const lastMsg = latestMessages.find((m) => m.room_id === room.roomId);

    return {
      matchedId: room.matchedId,
      nickname: opponent?.nickname ?? "알 수 없음",
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
          nickname={room.nickname}
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

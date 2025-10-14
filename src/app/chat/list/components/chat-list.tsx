import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import ChatItem from "./chat-item";

export default async function ChatList() {
  const supabase = await createClient();

  // 현재 로그인한 사용자 정보
  const user = await getCurrentUser();

  if (!user) {
    // throw new Error("로그인 정보를 불러오지 못했습니다.");
    return <div>로그인이 필요합니다.</div>;
  }

  const myId = user.id;

  // -------------------------------------------------------------------------------
  // 1. 채팅방 리스트 불러오기 (채팅방의 사용자 ID, 포스트 제목 등 필요한 정보들 함께 불러오기)
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
  `);

  if (roomsError) {
    throw new Error("채팅방 정보를 불러오지 못했습니다.");
  }

  // -------------------------------------------------------------------------------
  // 2. 각 방의 상대방 ID 계산
  const mappedRooms = rooms.map((room) => {
    const authorId = room.posts.author_id;
    const matchedId = room.matches.matched_runner_id;
    const isAuthor = authorId === myId;
    const opponentId = isAuthor ? matchedId : authorId; // 내가 작성자면 상대는 매칭된 러너, 내가 매칭된 러너면 상대는 작성자

    return {
      roomId: room.id,
      matchedId: room.matches.id,
      opponentId,
      postTitle: room.posts.title,
    };
  });

  // -------------------------------------------------------------------------------
  // 3. 상대방 프로필 데이터 가져오기
  const opponentIds = mappedRooms.map((room) => room.opponentId);
  const { data: opponents, error: profileError } = await supabase
    .from("profiles")
    .select("id, nickname, runner_type, profile_image_url")
    .in("id", opponentIds);

  if (profileError) {
    console.error(profileError);
    throw new Error("상대방 프로필 정보를 불러오지 못했습니다.");
  }

  // -------------------------------------------------------------------------------
  // 4. 각 채팅방의 가장 최근 메시지 가져오기
  const roomIds = rooms.map((room) => room.id) ?? [];

  // 4-1. 모든 메시지 불러오기
  const { data: allMessages, error: messageError } = await supabase
    .from("chat_messages")
    .select("room_id, body, created_at")
    .in("room_id", roomIds)
    .order("created_at", { ascending: false });

  if (messageError) {
    throw new Error("메시지를 불러오지 못했습니다.");
  }

  // 4-2. 각 room_id별로 가장 최근 메시지 1개만 추리기
  const latestByRoom = allMessages.reduce(
    (acc, msg) => {
      if (!acc[msg.room_id]) acc[msg.room_id] = msg; // 첫 번째(가장 최근)만 저장
      return acc;
    },
    {} as Record<string, { body: string; created_at: string }>, // room_id를 키로, 메시지 객체를 값으로
  );

  // -------------------------------------------------------------------------------
  // 5. 최종 데이터 병합
  const chatItems = mappedRooms.map((room) => {
    const opponent = opponents.find((p) => p.id === room.opponentId);
    const lastMsg = latestByRoom[room.roomId];

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

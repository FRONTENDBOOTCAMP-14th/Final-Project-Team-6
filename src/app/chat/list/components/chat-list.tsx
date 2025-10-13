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

  // 채팅방 리스트 불러오기
  // join으로 posts, profiles, matches 테이블에서 필요한 정보들 함께 불러오기
  const { data: rooms, error: roomsError } = await supabase
    .from("chat_rooms")
    .select(`
    id,
    posts (
      title,
      author:profiles!posts_author_id_fkey (
        id,
        nickname,
        runner_type,
        profile_image_url
      )
    ),
    matches:matches!chat_rooms_matches_id_fkey (
      id,
      matched_runner:profiles!matches_runner_id_fkey (
        id,
        nickname,
        runner_type,
        profile_image_url
      )
    )
  `);

  if (roomsError) {
    throw new Error("채팅방 정보를 불러오지 못했습니다.");
  }

  // 방 id 배열 만들기
  const roomIds = rooms?.map((room) => room.id) ?? [];

  // 각 채팅방의 가장 최근 메시지 가져오기
  const { data: allMessages, error: messageError } = await supabase
    .from("chat_messages")
    .select("room_id, body, created_at")
    .in("room_id", roomIds)
    .order("created_at", { ascending: false });

  if (messageError) {
    throw new Error("메시지를 불러오지 못했습니다.");
  }

  // 각 room_id별로 가장 최근 메시지 1개만 추리기
  const latestByRoom = allMessages?.reduce(
    (acc, msg) => {
      if (!acc[msg.room_id]) acc[msg.room_id] = msg; // 첫 번째(가장 최근)만 저장
      return acc;
    },
    {} as Record<string, { body: string; created_at: string }>, // room_id를 키로, 메시지 객체를 값으로
  );

  const chatItems = rooms.map((room) => {
    const post = room.posts;
    const postAuthor = post.author;
    const matchesId = room.matches.id;
    const matchedRunner = room.matches?.matched_runner;
    const lastMsg = latestByRoom?.[room.id];

    // 현재 로그인한 유저가 author인지 matched_runner인지 판별
    // 상대 유저 정보 띄워주기 위함
    const isAuthor = postAuthor?.id === myId;
    const opponent = isAuthor ? matchedRunner : postAuthor;

    return {
      matchedId: matchesId,
      nickname: opponent.nickname,
      runnerType: opponent.runner_type as "blind_runner" | "guide_runner",
      postTitle: post.title,
      lastMessage: lastMsg.body,
      lastMessageTime: lastMsg.created_at,
      imgSrc: opponent.profile_image_url ?? "default-profile-image.png",
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

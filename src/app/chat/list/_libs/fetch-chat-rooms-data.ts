import { createClient } from "@/utils/supabase/server";

type FetchChatRoomsDataProps = {
  offset: number;
  limit: number;
};

export default async function fetchChatRoomsData({
  offset,
  limit,
}: FetchChatRoomsDataProps) {
  const supabase = await createClient();

  // ----------------------------------------------------------------
  // 각 room_id마다 가장 최근 메시지 1개만 가져오기
  const { data: latestMessages, error: latestError } = await supabase.rpc(
    "get_latest_messages_per_room",
  );

  if (latestError) {
    throw new Error("최신 메시지 목록을 불러오지 못했습니다.");
  }

  // ----------------------------------------------------------------
  // 최신 메시지들을 created_at 기준으로 정렬 + 페이지네이션 적용
  const paged = (latestMessages ?? [])
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .slice(offset, offset + limit);

  const roomIds = paged.map((m) => m.room_id);

  // ----------------------------------------------------------------
  // 추출된 room_id 목록으로 채팅방 정보 불러오기
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

  return { latestMessages, roomIds, rooms };
}

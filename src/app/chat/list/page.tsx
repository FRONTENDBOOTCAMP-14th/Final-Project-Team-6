import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import {
  ChatListRealTime,
  ChatListWrapper,
  EmptyChatList,
} from "./_components";
import { fetchChatRoomsData, fetchOpponentData } from "./_libs";
import type { ChatItemsState } from "./_types";

type ChatListPageProps = {
  searchParams: Promise<{
    page: string;
  }>;
};

export default async function ChatListPage({
  searchParams,
}: ChatListPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1; // URL에서 page 추출
  const limit = 5; // 한 페이지에 보여줄 아이템 수

  // -------------------------------------------------------------------------------
  // 현재 로그인한 사용자 정보
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("비정상적인 접근 경로 입니다. 로그인이 필요합니다.");
  }

  // -------------------------------------------------------------------------------
  // 전체 채팅방 수 가져오기
  const supabase = await createClient();

  const { count, error } = await supabase
    .from("chat_rooms")
    .select("*", { count: "exact", head: true });

  if (error) {
    throw new Error("채팅방 수를 불러오는 중에 오류가 발생했습니다.");
  }

  // 전체 페이지 수 계산
  // count ?? 0 을 ()로 감싸지 않으면, null 병합 연산자 우선순위가 나누기 연산자보다 낮아서 예상과 다른 결과가 나옴
  const totalPages = Math.ceil((count ?? 0) / limit);

  // 채팅방이 하나도 없을 때
  if (!count || count === 0) {
    return (
      <>
        <h1 className="sr-only">채팅 리스트 페이지</h1>
        <EmptyChatList />
      </>
    );
  }

  // 불러올 데이터의 시작점 계산
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
    userId: user.id,
  });

  // ----------------------------------------------------------------
  // 6. 최종 데이터 병합
  const initialChatItems: ChatItemsState = mappedRooms.map((room) => {
    const opponent = opponents.find((p) => p.id === room.opponentId);
    const lastMsg = latestMessages.find((m) => m.room_id === room.roomId);

    return {
      roomId: room.roomId,
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
    <>
      <h1 className="sr-only">채팅 리스트 페이지</h1>
      <div className="flex flex-col gap-y-6">
        <ChatListRealTime userId={user.id} initialItems={initialChatItems} />
        <ChatListWrapper currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}

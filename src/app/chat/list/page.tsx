import Pagination from "@/components/pagination/pagination";
import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import ChatList from "./components/chat-list";

type ChatListPageProps = {
  searchParams: {
    page?: string;
  };
};

export default async function ChatListPage({
  searchParams,
}: ChatListPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1; // URL에서 page 추출
  const limit = 2; // 한 페이지에 보여줄 아이템 수

  // -------------------------------------------------------------------------------
  // 현재 로그인한 사용자 정보
  const user = await getCurrentUser();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  // -------------------------------------------------------------------------------
  // 전체 채팅방 수 가져오기
  const supabase = await createClient();
  const { count } = await supabase
    .from("chat_rooms")
    .select("*", { count: "exact", head: true }); // head: true 는 데이터는 가져오지 않고 count만 가져옴

  // 전체 페이지 수 계산
  // count ?? 0 을 ()로 감싸지 않으면, null 병합 연산자 우선순위가 나누기 연산자보다 낮아서 예상과 다른 결과가 나옴
  const totalPages = Math.ceil((count ?? 0) / limit);

  return (
    <div>
      <h1 className="sr-only">채팅 리스트 페이지</h1>
      <div className="flex flex-col gap-y-6">
        <ChatList userId={user.id} currentPage={currentPage} limit={limit} />
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}

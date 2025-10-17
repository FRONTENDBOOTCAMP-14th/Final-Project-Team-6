import { createClient } from "@/utils/supabase/server";

type FetchOpponentDataProps = {
  sortedRooms: Array<{
    id: string;
    posts: {
      title: string;
      author_id: string;
    };
    matches: {
      id: string;
      matched_runner_id: string;
    };
  }>;
  userId: string;
};

export default async function fetchOpponentData({
  sortedRooms,
  userId,
}: FetchOpponentDataProps) {
  const supabase = await createClient();

  // 각 방의 상대방 ID 계산 및 필요한 데이터 매핑
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

  return { opponents, mappedRooms };
}

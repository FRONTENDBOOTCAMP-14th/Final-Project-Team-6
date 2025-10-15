import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";

interface Props {
  matchedId: string;
}

export default async function ChatDetailTitle({ matchedId }: Props) {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  const { data, error } = await supabase
    .from("matches")
    .select(`post_id, profiles:matched_runner_id (nickname, id)`)
    .eq("id", matchedId)
    .single();
  if (error || !data) {
    throw new Error("매칭 정보를 불러오지 못했습니다.");
  }

  let partnerNickname = "default";

  if (data.profiles?.id === currentUser?.id) {
    const { data: authorData, error: authorError } = await supabase
      .from("posts")
      .select(`author_id:profiles (nickname)`)
      .eq("id", data.post_id)
      .single();
    if (authorError || !authorData) {
      throw new Error("게시글 작성자 정보를 불러오지 못했습니다.");
    }

    partnerNickname = authorData.author_id.nickname;
  } else {
    partnerNickname = data.profiles.nickname;
  }

  return (
    <>
      {partnerNickname}
      <span className="sr-only">님과의 채팅방</span>
    </>
  );
}

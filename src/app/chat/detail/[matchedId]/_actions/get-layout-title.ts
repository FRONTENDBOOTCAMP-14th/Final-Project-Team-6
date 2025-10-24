import { createClient } from "@/utils/supabase/server";

export default async function getLayoutTitle(
  currentUserId: string,
  matchedId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("matches")
    .select(`post_id, profiles (nickname, id)`)
    .eq("id", matchedId)
    .single();
  if (error || !data) throw new Error("매칭 정보를 불러올 수 없습니다.");

  let partnerNickname = "default";

  if (data.profiles?.id === currentUserId) {
    const { data: authorData, error: authorError } = await supabase
      .from("posts")
      .select(`author_id:profiles (nickname)`)
      .eq("id", data.post_id)
      .single();
    if (authorError || !authorData)
      throw new Error("게시글 작성자 정보를 불러올 수 없습니다.");
    partnerNickname = authorData.author_id.nickname;
  } else {
    partnerNickname = data.profiles.nickname;
  }

  return partnerNickname;
}

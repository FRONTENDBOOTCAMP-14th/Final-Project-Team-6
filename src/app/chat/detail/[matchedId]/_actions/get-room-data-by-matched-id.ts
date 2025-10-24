import { createClient } from "@/utils/supabase/server";

export default async function getRoomDataByMatchedId(matchedId: string) {
  const supabase = await createClient();

  const { data } = await supabase
    .from("chat_rooms")
    .select(`
        id,
        chat_messages(
          id,
          body,
          created_at,
          sender_id,
          profiles (
            nickname,
            profile_image_url,
            runner_type
          )
        ),
        posts(id, title, goal_km, meeting_place, meeting_time),
        matches(status)
      `)
    .eq("matches_id", matchedId)
    .single();
  if (!data) throw new Error(`매칭된 채팅방 데이터를 가져올 수 없습니다.`);

  return {
    roomId: data.id,
    messagesData: data.chat_messages,
    postData: data.posts,
    matchedStatus: data.matches.status,
  };
}

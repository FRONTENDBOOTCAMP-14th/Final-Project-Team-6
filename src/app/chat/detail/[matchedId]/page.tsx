import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import { MsgList, PostLink, SendMessage } from "./components";

interface Props {
  params: Promise<{ matchedId: string }>;
}

export default async function ChatDetailPage({ params }: Props) {
  const { matchedId } = await params;

  const supabase = await createClient();

  const currentUser = await getCurrentUser();
  if (currentUser === null) throw new Error("로그인이 필요합니다.");

  const { data: chatRoomData, error: chatRoomError } = await supabase
    .from("chat_rooms")
    .select(`
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
        posts(title, goal_km, meeting_place, meeting_time)
      `)
    .eq("matches_id", matchedId)
    .single();
  if (chatRoomError) throw new Error("메세지를 불러오기 오류");

  console.log(chatRoomData);

  const messagesData = chatRoomData.chat_messages;
  const postData = chatRoomData.posts;

  return (
    <div className="pt-20 pb-15">
      <PostLink postData={postData} />
      <MsgList messagesData={messagesData} currentUserId={currentUser.id} />
      <SendMessage />
    </div>
  );
}

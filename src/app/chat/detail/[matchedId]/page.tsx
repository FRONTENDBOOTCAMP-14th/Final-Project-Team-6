import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import { MsgList, PostLink, SendMessageForm } from "./components";
import MsgRealTime from "./components/msg-real-time";

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
        posts(id, title, goal_km, meeting_place, meeting_time)
      `)
    .eq("matches_id", matchedId)
    .single();
  if (chatRoomError)
    throw new Error(`메세지 불러오기 오류 : ${chatRoomError.message}`);

  const messagesData = chatRoomData.chat_messages;
  const postData = chatRoomData.posts;
  const currentUserId = currentUser.id;
  const roomId = chatRoomData.id;

  return (
    <div className="pt-20 pb-18">
      <PostLink postData={postData} />
      <ul className="flex flex-col gap-8 py-6">
        <MsgList messagesData={messagesData} currentUserId={currentUserId} />
        <MsgRealTime roomId={roomId} currentUserId={currentUserId} />
      </ul>
      <SendMessageForm roomId={roomId} currentUserId={currentUserId} />
    </div>
  );
}

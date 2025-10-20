import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import { PostLink, SendMessageForm } from "./_components";
import MsgScrollContainer from "./_components/msg-scroll-container";

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
    <>
      <PostLink postData={postData} />
      <MsgScrollContainer
        currentUserId={currentUserId}
        roomId={roomId}
        messagesData={messagesData}
      ></MsgScrollContainer>
      <SendMessageForm roomId={roomId} currentUserId={currentUserId} />
    </>
  );
}

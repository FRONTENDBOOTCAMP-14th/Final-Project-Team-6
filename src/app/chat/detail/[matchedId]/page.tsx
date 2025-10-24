import { getCurrentUser } from "@/utils/supabase/get-current-user";
import getRoomDataByMatchedId from "./_actions/get-room-data-by-matched-id";
import MessageScrollContainer from "./_components/message-scroll-container";
import PostLink from "./_components/post-link";
import SendMessageForm from "./_components/send-message-form";

interface Props {
  params: Promise<{ matchedId: string }>;
}

export default async function ChatDetailPage({ params }: Props) {
  const { matchedId } = await params;

  const currentUser = await getCurrentUser();
  if (currentUser === null) throw new Error("로그인이 필요합니다.");

  const { messagesData, postData, roomId, matchedStatus } =
    await getRoomDataByMatchedId(matchedId);

  return (
    <>
      <PostLink postData={postData} />
      <MessageScrollContainer
        currentUserId={currentUser.id}
        roomId={roomId}
        messagesData={messagesData}
      />
      <SendMessageForm
        roomId={roomId}
        currentUserId={currentUser.id}
        matchedId={matchedId}
        matchedStatus={matchedStatus}
      />
    </>
  );
}

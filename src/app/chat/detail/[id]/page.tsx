import MsgList from "./components/msg-list";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ChatDetailPage({ params }: Props) {
  const { id: roomId } = await params;

  return (
    <div>
      <h2>채팅방: {roomId}</h2>
      <MsgList roomId={roomId} />
    </div>
  );
}

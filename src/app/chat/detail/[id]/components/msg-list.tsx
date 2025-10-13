import { createClient } from "@/utils/supabase/server";

interface Props {
  roomId: string;
}

export default async function MsgList({ roomId }: Props) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("room_id", roomId);
  if (error) {
    throw new Error("메세지를 불러오지 못했습니다.");
  }

  return (
    <ul>
      {data.map((i) => (
        <li key={i.id}>{i.body}</li>
      ))}
    </ul>
  );
}

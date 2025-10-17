"use server";

import { createClient } from "@/utils/supabase/server";

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();

  const currentUserId = formData.get("currentUserId") as string;
  const roomId = formData.get("roomId") as string;
  const body = formData.get("message-body") as string;

  const { data: newMessage, error: sendNewMessageError } = await supabase
    .from("chat_messages")
    .insert({ room_id: roomId, sender_id: currentUserId, body })
    .select()
    .single();

  if (sendNewMessageError)
    throw new Error(`메세지 보내기 오류 : ${sendNewMessageError.message}`);

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("nickname, profile_image_url")
    .eq("id", currentUserId)
    .single();

  if (profileError)
    throw new Error(
      `메세지 보낸 유저 프로필 가져오기 오류 : ${profileError.message}`,
    );

  await supabase.channel(`room-${roomId}`).send({
    type: "broadcast",
    event: "new_message",
    payload: {
      ...newMessage,
      nickname: profileData?.nickname,
      profile_image_url: profileData?.profile_image_url,
    },
  });
}

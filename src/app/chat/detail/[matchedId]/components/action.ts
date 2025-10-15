"use server";

import { createClient } from "@/utils/supabase/server";

export async function sendMessage(formData: FormData) {
  const supabase = await createClient();

  const currentUserId = formData.get("currentUserId") as string;
  const roomId = formData.get("roomId") as string;
  const body = formData.get("message-body") as string;

  const { error } = await supabase.from("chat_messages").insert({
    room_id: roomId,
    sender_id: currentUserId,
    body,
  });

  if (error) throw new Error(error.message);
}

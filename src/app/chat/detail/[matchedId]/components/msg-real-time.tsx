// "use client";

// import { useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";

// interface Props {
//   roomId: string;
// }

// export default function MsgRealTime({ roomId }: Props) {
//   const supabase = createClient();

//   useEffect(() => {
//     const channel = supabase
//       .channel("chat-room")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "chat_messages",
//           filter: `room_id=eq.${roomId}`,
//         },
//         (payload) => {
//           console.log("실시간 메세지 감지");
//         },
//       )
//       .subscribe();

//     return () => supabase.removeChannel(channel);
//   }, [roomId, supabase]);

//   return <li>asdasd</li>;
// }

export interface RoomChatMessage {
  id: string;
  body: string;
  created_at: string;
  sender_id: string;
  profiles: {
    nickname: string;
    profile_image_url: string | null;
    runner_type: string;
  };
}

export interface RoomPost {
  id: string;
  title: string;
  goal_km: number;
  meeting_place: string;
  meeting_time: string;
}

export interface RoomMatchs {
  status: string;
}

export interface RoomData {
  id: string;
  chat_messages: RoomChatMessage[];
  posts: RoomPost;
  matches: RoomMatchs;
}

export interface RoomNewMessage {
  nickname: string;
  profile_image_url: string | null;
  runner_type: string;
  body: string;
  created_at: string;
  id: string;
  room_id: string;
  sender_id: string;
}

// @/app/post/type.ts

export type RunnerType = "guide_runner" | "blind_runner";

export interface Post {
  id: string;
  author_id: string;
  created_at: string;
  updated_at?: string;
  title: string;
  meeting_place: string;
  meeting_detail_place: string;
  meeting_time: string;
  goal_km: number;
  pace: number;
  description: string;
  is_completed: boolean;
  is_expired: boolean;
  // v--- [추가] 이 줄을 넣어줘 ---v
  status: "open" | "matched" | "completed" | "deleted";
  // ^--- ---^
}

export interface PostWithAuthor extends Post {
  author: {
    id: string;
    nickname: string;
    runner_type: RunnerType;
    profile_image_url: string | null;
  } | null;
}

export interface Match {
  id: string;
  post_id: string;
  matched_runner_id: string;
}

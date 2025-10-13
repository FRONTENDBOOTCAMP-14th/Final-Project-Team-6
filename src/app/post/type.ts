export interface Post {
  // === 기본 정보 ===
  id: string;
  author_id: string;
  created_at: string;
  updated_at?: string;

  // === 사용자 입력 정보 ===
  title: string;
  meeting_place: string;
  meeting_detail_place: string;
  meeting_time: string;
  goal_km: number;
  pace: number;
  description: string;

  // === 상태 정보 ===
  is_completed: boolean;
  is_expired: boolean;
}

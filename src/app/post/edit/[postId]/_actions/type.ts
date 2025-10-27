export interface PostData {
  author_id: string;
  created_at: string;
  description: string;
  goal_km: number;
  id: string;
  is_completed: boolean;
  is_expired: boolean;
  meeting_detail_place: string;
  meeting_place: string;
  meeting_time: string;
  pace: number;
  status: string;
  title: string;
  updated_at: string | null;
}

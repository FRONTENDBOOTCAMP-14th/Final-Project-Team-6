import Link from "next/link";
import { Button } from "@/components/common";
import { createClient } from "@/utils/supabase/server";

async function getActivityData(userId: string) {
  const supabase = await createClient();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("created_at, nickname, total_join")
    .eq("id", userId)
    .single();

  const { data: postsData, error: postsError } = await supabase
    .from("posts")
    .select("goal_km, is_completed")
    .eq("author_id", userId);

  if (profileError || postsError) {
    console.error("데이터 조회 중 에러:", profileError || postsError);
    return null;
  }

  // 총 달린 거리 계산 (완료된 러닝만)
  const totalDistance = postsData
    .filter((post) => post.is_completed)
    .reduce((sum, post) => sum + post.goal_km, 0);

  // 활동일 계산 (가입일부터 오늘까지)
  const startDate = new Date(profileData.created_at);
  const today = new Date();
  const activityDays = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  return {
    nickname: profileData.nickname,
    totalPosts: profileData.total_join ?? 0,
    totalDistance,
    activityDays,
  };
}

export default async function ActivityLog() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // 비로그인 상태일 때 (이미지)
    return (
      <section className="p-6 rounded-lg bg-site-lightblack text-center">
        <p className="mb-4 text-site-gray">
          원활한 서비스 이용을 위해 사용자 인증이 필요합니다.
        </p>
        <Link href="/login">
          <Button>인증하러가기 &gt;</Button>
        </Link>
      </section>
    );
  }

  // 로그인 상태일 때
  const activityData = await getActivityData(user.id);

  if (!activityData) {
    return (
      <section className="p-6 rounded-lg bg-site-lightblack">
        <p className="text-site-gray">활동 내역을 불러올 수 없습니다.</p>
      </section>
    );
  }

  const { nickname, totalPosts, totalDistance, activityDays } = activityData;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">
        <span className="text-site-blue">{nickname}</span>님의 활동 내역
      </h2>
      <div className="grid grid-cols-3 gap-4 p-6 rounded-lg bg-site-lightblack text-center">
        <div>
          <p className="text-sm text-site-gray mb-1">총 참여 횟수</p>
          <p className="text-3xl font-bold">
            {totalPosts}
            <span className="text-lg font-normal">회</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-site-gray mb-1">총 달린 거리</p>
          <p className="text-3xl font-bold">
            {totalDistance}
            <span className="text-lg font-normal">km</span>
          </p>
        </div>
        <div>
          <p className="text-sm text-site-gray mb-1">활동일</p>
          <p className="text-3xl font-bold">
            {activityDays}
            <span className="text-lg font-normal">일</span>
          </p>
        </div>
      </div>
    </section>
  );
}

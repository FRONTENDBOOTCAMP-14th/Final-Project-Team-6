import { createClient } from "@/utils/supabase/server";

async function getActivityData(userId: string) {
  const supabase = await createClient();

  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("created_at, nickname, total_join, total_mileage")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw new Error("데이터 조회 중 에러:", profileError);
  }

  // 총 달린 거리
  const totalDistance = profileData?.total_mileage ?? 0;

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
interface ActivityLogProps {
  userId: string;
}

export default async function ActivityLog({ userId }: ActivityLogProps) {
  // 로그인 상태일 때
  const activityData = await getActivityData(userId);

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
            <span className="text-lg font-normal ml-1">일</span>
          </p>
        </div>
      </div>
    </section>
  );
}

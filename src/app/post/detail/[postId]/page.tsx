import Image from "next/image";
import { notFound } from "next/navigation";
import formatUTCtoKST from "@/utils/fomat-utc-to-kst";
import { createClient } from "@/utils/supabase/server";

// --- 데이터 가져오는 함수 ---
async function getPostById(id: string) {
  const supabase = await createClient();
  const { data: post, error } = await supabase
    .from("posts")
    .select(`*, author:profiles(id, nickname, runner_type, profile_image_url)`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("[Server] getPostById DB Error:", error.message);
  }

  return post;
}

// --- 메인 페이지 컴포넌트 ---
export default async function PostDetailPage({
  params,
}: {
  params: { postId: string };
}) {
  const { postId } = params;
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 작성자 프로필 */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 overflow-hidden rounded-full">
          <Image
            src="/assets/default-profile.png"
            alt={`${post.author?.nickname}님의 프로필 사진`}
            fill
            className="object-cover bg-[var(--color-site-lightblack)]"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-bold text-[var(--color-site-white)]">
            {post.author?.nickname}
          </p>
          <p className="text-sm text-[var(--color-site-gray)]">
            {post.author?.runner_type === "guide_runner"
              ? "가이드러너"
              : "시각장애인 러너"}
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold">{post.title}</h2>
      <div className="w-full aspect-video bg-[var(--color-site-lightblack)] rounded-lg flex items-center justify-center">
        <p className="text-[var(--color-site-gray)]">지도 영역</p>
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-site-gray)]">러닝 희망 장소</span>
          <span className="font-semibold text-[var(--color-site-white)]">
            {post.meeting_place}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-site-gray)]">러닝 시작 시간</span>
          <span className="font-semibold text-[var(--color-site-white)]">
            {formatUTCtoKST(post.meeting_time)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-site-gray)]">목표 거리</span>
          <span className="font-semibold text-[var(--color-site-white)]">
            {post.goal_km}km
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[var(--color-site-gray)]">목표 페이스</span>
          <span className="font-semibold text-[var(--color-site-white)]">
            {post.pace}분/km
          </span>
        </div>
      </div>
      <p className="text-base leading-relaxed text-[var(--color-site-gray)]">
        {post.description}
      </p>

      {/* --- 액션 버튼 영역 (추후 구현) --- */}
    </div>
  );
}

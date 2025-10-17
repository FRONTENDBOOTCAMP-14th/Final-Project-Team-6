import type { PostWithAuthor } from "@/app/post/type";
import formatUTCtoKST from "@/utils/fomat-utc-to-kst";

interface PostInfoProps {
  post: PostWithAuthor;
}

function InfoItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[var(--color-site-gray)]">{label}</span>
      <span className="font-semibold text-[var(--color-site-white)]">
        {value}
      </span>
    </div>
  );
}

export default function PostInfo({ post }: PostInfoProps) {
  return (
    <>
      <h2 className="text-2xl font-bold">{post.title}</h2>
      <div className="w-full aspect-video bg-[var(--color-site-lightblack)] rounded-lg flex items-center justify-center">
        <p className="text-[var(--color-site-gray)]">지도 영역</p>
      </div>
      <div className="flex flex-col gap-4 text-sm">
        <InfoItem label="러닝 희망 장소" value={post.meeting_place} />
        <InfoItem
          label="러닝 시작 시간"
          value={formatUTCtoKST(post.meeting_time)}
        />
        <InfoItem label="목표 거리" value={`${post.goal_km}km`} />
        <InfoItem label="목표 페이스" value={`${post.pace}분/km`} />
      </div>
      <p className="text-base leading-relaxed text-[var(--color-site-gray)]">
        {post.description}
      </p>
    </>
  );
}

import type { PostWithAuthor } from "@/app/post/type";
import formatUTCtoKST from "@/utils/fomat-utc-to-kst";

interface PostInfoProps {
  post: PostWithAuthor;
}

function InfoItem({
  label,
  value,
}: {
  label: string | number;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[var(--color-site-gray)] text-sm">{label}</span>
      <span className=" text-[var(--color-site-white)] text-base">{value}</span>
    </div>
  );
}

export default function PostInfo({ post }: PostInfoProps) {
  const address = post.meeting_place;
  const encodedAddress = encodeURIComponent(address);
  const mapSrc = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <>
      <h2 className="text-2xl font-bold">{post.title}</h2>

      <div className="w-full aspect-video bg-[var(--color-site-lightblack)] rounded-lg overflow-hidden">
        <iframe
          title="러닝 희망 장소 지도"
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <div className="flex flex-col gap-4 text-sm">
        <InfoItem label="러닝 희망 장소" value={post.meeting_place} />
        <InfoItem
          label="러닝 시작 시간"
          value={formatUTCtoKST(post.meeting_time)}
        />
        <InfoItem label="목표 거리" value={`${post.goal_km}km`} />
        <InfoItem
          label="목표 페이스"
          value={`${Math.floor(post.pace / 60)}분 ${post.pace % 60}초/km`}
        />
      </div>
      <div className="flex flex-col gap-2">
        <h4 className=" text-[var(--color-site-gray)] text-sm">
          상세 러닝 내용
        </h4>
        <p className="text-base leading-relaxed text-[var(--color-site-white)]">
          {post.description}
        </p>
      </div>
    </>
  );
}

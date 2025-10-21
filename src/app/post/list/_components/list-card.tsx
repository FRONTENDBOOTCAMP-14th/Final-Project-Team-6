import Image from "next/image";
import Link from "next/link";
import type { PostWithAuthor } from "@/app/post/type";
import RunnerTypeBadge from "@/components/common/runner-type-badge";

interface Props {
  post: PostWithAuthor;
}

const formatMeetingTime = (timeString: string) => {
  const date = new Date(timeString);
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}`;
};

export default function ListCard({ post }: Props) {
  const runnerType = post.author?.runner_type;
  const formattedMeetingTime = post.meeting_time
    ? formatMeetingTime(post.meeting_time)
    : "";

  let overlayText = "";
  if (post.is_expired) {
    overlayText = "기간 종료";
  } else if (post.status === "matched") {
    overlayText = "매칭 중 ...";
  }

  const titleMaxLength = 20;
  let displayTitle = post.title;

  if (post.title.length > titleMaxLength) {
    displayTitle = `${post.title.slice(0, titleMaxLength)}...`;
  }

  return (
    <Link
      href={`/post/detail/${post.id}`}
      className="relative block rounded-lg bg-[var(--color-site-lightblack)]"
    >
      <div className="flex items-start gap-4 p-5">
        {/* 프로필 이미지 */}
        <Image
          src="/assets/default-profile.png"
          alt="기본 프로필 이미지"
          width={50}
          height={50}
          className="rounded-full flex-shrink-0"
        />

        <div className="flex flex-col">
          {/* 제목 */}
          <h3 className="font-bold text-xl text-[var(--color-site-white)]">
            {displayTitle}
          </h3>

          {/* 닉네임 & 러너 타입 배지 */}
          <div className="mt-1 flex items-center gap-2 text-sm font-bold text-[var(--color-site-white)]">
            <span className="truncate">
              {post.author?.nickname || "알 수 없음"}
            </span>
            {runnerType && (
              <RunnerTypeBadge
                runnerType={
                  runnerType === "guide_runner"
                    ? "guide_runner"
                    : "blind_runner"
                }
              />
            )}
          </div>

          {/* 약속일자 */}
          {formattedMeetingTime && (
            <p className="text-sm text-[var(--color-site-gray)] mt-4">
              {formattedMeetingTime}
            </p>
          )}

          {/* 해시태그 */}
          <div className=" text-sm text-[var(--color-site-gray)]">
            <span># {post.meeting_place}</span>
            <span className="ml-2"># {post.goal_km}km</span>
          </div>
        </div>
      </div>

      {/* '기간 종료' 또는 '매칭 중' 상태일 때 표시될 오버레이 */}
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.8)] rounded-lg">
          <span className="text-white text-xl font-bold">{overlayText}</span>
        </div>
      )}
    </Link>
  );
}

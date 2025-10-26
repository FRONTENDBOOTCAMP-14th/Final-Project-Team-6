import Image from "next/image";
import Link from "next/link";
import type { PostWithAuthor } from "@/app/post/type";
import RunnerTypeBadge from "@/components/common/runner-type-badge";

interface Props {
  post: PostWithAuthor;
  isLoggedIn: boolean;
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

export default function ListCard({ post, isLoggedIn }: Props) {
  const runnerType = post.author?.runner_type;
  const formattedMeetingTime = post.meeting_time
    ? formatMeetingTime(post.meeting_time)
    : "";

  let overlayText = "";
  if (post.is_completed) {
    overlayText = "완료된 러닝입니다.";
  } else if (post.is_expired) {
    overlayText = "기간 종료";
  } else if (post.status === "matched") {
    overlayText = "매칭 중 ...";
  }

  const titleMaxLength = 20;
  let displayTitle = post.title;

  if (post.title.length > titleMaxLength) {
    displayTitle = `${post.title.slice(0, titleMaxLength)}...`;
  }

  // [추가] 프로필 이미지 경로를 동적으로 설정하는 로직
  // 1. DB에 저장된 파일명을 가져옴 (author가 없거나 url이 비어있으면 기본 이미지 파일명 사용)
  const profileImageName =
    post.author?.profile_image_url || "default-profile-image.png";

  // 2. 'ProfileEditContent' 컴포넌트와 동일하게 /images/ 경로를 붙여줌
  const profileImagePath = `/images/${profileImageName}`;

  const CardContent = (
    <>
      <div className="flex items-start gap-4 p-5">
        {/* [수정] Image 컴포넌트의 src와 alt 속성을 동적 변수로 변경 */}
        <Image
          src={profileImagePath}
          alt={
            post.author?.nickname
              ? `${post.author.nickname}님의 프로필 이미지`
              : "프로필 이미지"
          }
          width={50}
          height={50}
          className="rounded-full flex-shrink-0"
        />
        <div className="flex flex-col">
          <h3 className="font-semibold text-xl text-site-white">
            {displayTitle}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm font-bold text-site-white">
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
          {formattedMeetingTime && (
            <p className="text-sm text-site-gray mt-4">
              {formattedMeetingTime}
            </p>
          )}
          <div className=" text-sm text-site-gray">
            <span># {post.meeting_place}</span>
            <span className="ml-2"># {post.goal_km}km</span>
          </div>
        </div>
      </div>
      {overlayText && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-lg">
          <span className="text-white text-xl font-bold">{overlayText}</span>
        </div>
      )}
    </>
  );

  if (isLoggedIn) {
    return (
      <Link
        href={`/post/detail/${post.id}`}
        className="relative block rounded-lg bg-site-lightblack"
      >
        {CardContent}
      </Link>
    );
  }

  return (
    <div className="relative block rounded-lg bg-site-lightblack cursor-not-allowed">
      {CardContent}
    </div>
  );
}

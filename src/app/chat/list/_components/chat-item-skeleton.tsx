import tw from "@/utils/tw";

/**
 * ChatItemSkeleton 컴포넌트
 *
 * - ChatItem과 동일한 레이아웃 구조
 * - CSS 애니메이션으로 자연스러운 로딩 표현
 */
export default function ChatItemSkeleton() {
  return (
    <li className="border-b-1 border-site-gray/10">
      <div className="flex flex-row gap-y-3 py-5 w-full">
        {/* 프로필 이미지 스켈레톤 */}
        <div
          className={tw(
            "w-12.5 h-12.5 rounded-full flex-shrink-0",
            "bg-gradient-to-r from-site-gray/15 to-site-lightblack/50",
            "animate-pulse",
          )}
        />

        <div className="flex flex-col ms-4 gap-y-3 min-w-0 w-full">
          {/* 닉네임 + 러너타입 영역 */}
          <div className="flex flex-col gap-y-2 relative">
            <div className="flex flex-row gap-x-2">
              {/* 닉네임 스켈레톤 */}
              <div
                className={tw(
                  "h-5 w-24 rounded",
                  "bg-gradient-to-r from-site-gray/15 to-site-lightblack/50",
                  "animate-pulse",
                )}
              />
              {/* 러너 타입 배지 스켈레톤 */}
              <div
                className={tw(
                  "h-5 w-12 rounded-sm",
                  "bg-gradient-to-r from-site-gray/15 to-site-lightblack/50",
                  "animate-pulse self-center",
                )}
              />
            </div>

            {/* 마지막 메시지 스켈레톤 */}
            <div
              className={tw(
                "h-[19.19px] w-3/4 rounded",
                "bg-gradient-to-r from-site-gray/15 to-site-lightblack/50",
                "animate-pulse",
              )}
            />

            {/* 마지막 메시지 시간 스켈레톤 */}
            <div
              className={tw(
                "h-5 w-12 flex rounded ",
                "bg-gradient-to-r from-site-gray/15 to-site-lightblack/50",
                "animate-pulse absolute right-0",
              )}
            />
          </div>

          {/* 게시글 제목 스켈레톤 */}
          <div
            className={tw(
              "h-5 w-1/2 rounded-sm",
              "bg-gradient-to-r from-site-gray/15 to-site-lightblack/50",
              "animate-pulse",
            )}
          />
        </div>
      </div>
    </li>
  );
}

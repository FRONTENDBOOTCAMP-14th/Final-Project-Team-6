import Image from "next/image";
import type { PostWithAuthor } from "@/app/post/type";
import RunnerTypeBadge from "@/components/common/runner-type-badge";

interface AuthorProfileProps {
  author: PostWithAuthor["author"];
  created_at?: string;
}

export default function AuthorProfile({
  author,
  created_at,
}: AuthorProfileProps) {
  if (!author) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString)
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\s/g, "")
      .slice(0, -1);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="z-0 relative w-12 h-12 overflow-hidden rounded-full">
        <Image
          src="/assets/default-profile.png"
          alt={`${author.nickname}님의 프로필 사진`}
          fill
          className="object-cover bg-[var(--color-site-lightblack)]"
          sizes="40px"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <p className="font-bold text-[var(--color-site-white)]">
            {author.nickname}
          </p>
          <RunnerTypeBadge runnerType={author.runner_type} />
        </div>

        {created_at && (
          <p className="text-sm text-[var(--color-site-gray)]">
            작성일 {formatDate(created_at)}
          </p>
        )}
      </div>
    </div>
  );
}

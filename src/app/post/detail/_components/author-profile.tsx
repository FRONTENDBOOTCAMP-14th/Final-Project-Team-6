import Image from "next/image";
import type { PostWithAuthor } from "@/app/post/type";

interface AuthorProfileProps {
  author: PostWithAuthor["author"];
}

export default function AuthorProfile({ author }: AuthorProfileProps) {
  if (!author) return null;

  return (
    <div className="flex items-center gap-3">
      <div className="relative w-12 h-12 overflow-hidden rounded-full">
        <Image
          src="/assets/default-profile.png"
          alt={`${author.nickname}님의 프로필 사진`}
          fill
          className="object-cover bg-[var(--color-site-lightblack)]"
          sizes="40px"
        />
      </div>
      <div>
        <p className="font-bold text-[var(--color-site-white)]">
          {author.nickname}
        </p>
        <p className="text-sm text-[var(--color-site-gray)]">
          {author.runner_type === "guide_runner"
            ? "가이드러너"
            : "시각장애인 러너"}
        </p>
      </div>
    </div>
  );
}

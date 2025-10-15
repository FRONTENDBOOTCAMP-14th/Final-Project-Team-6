import Image from "next/image";
import Link from "next/link";
import type { PostWithAuthor } from "@/app/post/type";

interface Props {
  post: PostWithAuthor;
}

export default function ListCard({ post }: Props) {
  return (
    <Link
      href={`/post/detail/${post.id}`}
      className="block p-4 rounded-lg bg-[var(--color-site-lightblack)]"
    >
      <div className="flex items-center gap-3">
        <Image
          src="/assets/default-profile.png"
          alt="기본 프로필 이미지"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-bold truncate">{post.title}</h3>
          <div className="flex items-center gap-2 text-sm text-[var(--color-site-gray)]">
            <span>{post.author?.nickname || "알 수 없음"}</span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-site-gray)]"></span>
            <span>
              {post.author?.runner_type === "guide_runner"
                ? "가이드러너"
                : "시각장애인"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs text-[var(--color-site-gray)]">
        <span># {post.meeting_place}</span>
        <span> # {post.goal_km}km</span>
      </div>
    </Link>
  );
}

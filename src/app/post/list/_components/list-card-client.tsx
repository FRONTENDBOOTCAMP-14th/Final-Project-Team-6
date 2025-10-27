"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PostWithAuthor } from "@/app/post/type";
import { useDialog } from "@/stores/use-dialog";

interface Props {
  post: PostWithAuthor;
  children: React.ReactNode;
}

export default function ListCardClient({ post, children }: Props) {
  const router = useRouter();
  const { openDialog } = useDialog();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openDialog("confirm", {
      message: `로그인이 필요한 서비스입니다.\n로그인 하시겠습니까?`,
      onConfirm: () => {
        router.push("/auth/login");
      },
    });
  };

  return (
    <Link
      href={`/post/detail/${post.id}`}
      onClick={handleClick}
      className="relative block rounded-lg bg-site-lightblack"
    >
      {children}
    </Link>
  );
}

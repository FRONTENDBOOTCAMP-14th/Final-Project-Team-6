"use client";

import { Link } from "@/components/common";
import { IconArrowRight } from "@/components/common/icons";

interface Props {
  error: Error & { digest?: string };
}

export default function GlobalError({ error }: Props) {
  return (
    <div
      role="alert"
      className="h-[100dvh] flex flex-col items-center justify-center"
    >
      <h1 className="text-2xl font-bold mb-3 text-center">
        페이지를 표시할 수 없습니다.
      </h1>
      <p className="text-site-gray mb-10">{error.message}</p>
      <Link
        href="/"
        className="flex items-center gap-2 bg-site-blue h-[40px] px-4 rounded-sm"
      >
        홈으로 이동
        <IconArrowRight />
      </Link>
    </div>
  );
}

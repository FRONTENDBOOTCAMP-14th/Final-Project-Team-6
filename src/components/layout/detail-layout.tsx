"use client";

import { useRouter } from "next/navigation";
import { IconRouterBack } from "../common/icons";

interface Props {
  children: React.ReactNode;
  title: string | React.ReactNode;
}

export default function DetailLayout({ children, title }: Props) {
  const router = useRouter();

  return (
    <div className="pt-[70px] min-h-[100dvh]">
      <header className="fixed top-0 w-full border-b border-b-white/10 max-w-(--viewport-size)">
        <div className="flex items-center px-5 h-[70px] relative">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="뒤로 가기"
            className="cursor-pointer"
          >
            <IconRouterBack />
          </button>
          <h1 className="text-xl font-bold absolute top-1/2 left-1/2 -translate-1/2">
            {title}
          </h1>
        </div>
      </header>
      <main className="px-5">{children}</main>
    </div>
  );
}

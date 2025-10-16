"use client";

import { useRouter } from "next/navigation";
import { IconRouterBack } from "@/components/common/icons";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="뒤로 가기"
      className="cursor-pointer"
    >
      <IconRouterBack />
    </button>
  );
}

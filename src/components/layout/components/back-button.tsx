"use client";

import { usePathname, useRouter } from "next/navigation";
import { IconRouterBack } from "@/components/common/icons";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // 채팅방 뒤로가기
    // router.back()은 브라우저 캐시를 복원하여 최신 메시지가 반영되지 않는 문제 발생
    // messageSent 플래그로 메시지 발생 여부 확인 후 조건부 새로고침 적용
    if (pathname.startsWith("/chat/detail")) {
      const messageSent = sessionStorage.getItem("messageSent");

      if (messageSent) {
        // 메시지 발생 후 뒤로가기: 새로고침으로 최신 데이터 반영
        sessionStorage.removeItem("messageSent");
        router.push("/chat/list");
      } else {
        // 메시지 없이 뒤로가기: 기존 UX 유지
        router.back();
      }
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="뒤로 가기"
      className="cursor-pointer"
    >
      <IconRouterBack />
    </button>
  );
}

"use client";

import { useAuthStore } from "@/stores/auth";

// 로그인 테스트 페이지
export default function LoginPage() {
  const { isLoggedIn, toggle } = useAuthStore();

  return (
    <div>
      <p>로그인 페이지</p>
      <button
        type="button"
        onClick={toggle}
        className="px-4 py-2 bg-site-blue text-[0.625rem] rounded"
      >
        {isLoggedIn ? "로그아웃" : "로그인"}
      </button>
    </div>
  );
}

"use client";

import { useAuthStore } from "@/stores/auth";

export default function ProfilePage() {
  const { isLoggedIn, toggle } = useAuthStore();

  return (
    <div>
      <p>내 프로필</p>
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

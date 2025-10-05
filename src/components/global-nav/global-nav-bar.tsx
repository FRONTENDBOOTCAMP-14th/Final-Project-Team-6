"use client";

import {
  IconChat,
  IconNoteSearch,
  IconRequest,
  IconUser,
} from "@/components/common/icons";
import NavLink from "@/components/common/nav-link";
import { useAuthStore } from "@/stores/auth";

// type GlobalNavBarProps = {
//   isLoggedIn: boolean;
// };

export default function GlobalNavBar() {
  // 로그인 상태에 따라 메뉴 항목 변경
  // 현재는 props로 받도록 설계했지만, 추후에 Zustand를 사용하여 isLoggedIn 상태 관리하도록 리팩토링 해야함
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  // 임시 메뉴 항목 정의
  // name: 메뉴 이름, icon: 아이콘 컴포넌트, href: 링크 경로
  // 페이지명 결정되면, href 수정 필요
  const menus = [
    { name: "동행찾기", icon: IconNoteSearch, href: "/post/list" },
    { name: "동행신청", icon: IconRequest, href: "/post/write" },
    { name: "채팅", icon: IconChat, href: "/chat/list" },
    isLoggedIn
      ? { name: "내 정보", icon: IconUser, href: "/profile/my-profile" }
      : { name: "시작하기", icon: IconUser, href: "/auth/login" },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-site-lightblack max-w-(--viewport-size)">
      <ul className="flex justify-around ">
        {menus.map(({ name, icon: Icon, href }) => (
          <li key={name} className=" w-full h-[80px]">
            <NavLink
              href={href}
              className="flex flex-col items-center w-full h-full pt-2.5"
            >
              <div className="p-2">
                <Icon />
              </div>
              <span className="text-xs">{name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

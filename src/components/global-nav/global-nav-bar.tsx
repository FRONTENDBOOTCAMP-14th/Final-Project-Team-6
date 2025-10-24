import { getCurrentUser } from "@/utils/supabase/get-current-user";
import GlobalNavItem from "./global-nav-item";

export default async function GlobalNavBar() {
  const user = await getCurrentUser();

  const isLoggedIn = !!user;

  const menus = [
    {
      name: "동행찾기",
      iconType: "icon-note-search",
      href: "/post/list",
      requiresAuth: false,
    },
    {
      name: "동행신청",
      iconType: "icon-request",
      href: "/post/write",
      requiresAuth: true,
    },
    {
      name: "채팅",
      iconType: "icon-chat",
      href: "/chat/list",
      requiresAuth: true,
    },
    isLoggedIn
      ? {
          name: "내 정보",
          iconType: "icon-user",
          href: "/profile/my-profile",
          requiresAuth: true,
        }
      : {
          name: "시작하기",
          iconType: "icon-user",
          href: "/auth/login",
          requiresAuth: false,
        },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-site-lightblack max-w-(--viewport-size)">
      <ul className="flex justify-around">
        {menus.map(({ name, iconType, href, requiresAuth }) => (
          <GlobalNavItem
            key={name}
            name={name}
            href={href}
            iconType={iconType}
            isLoggedIn={isLoggedIn}
            requiresAuth={requiresAuth}
          />
        ))}
      </ul>
    </nav>
  );
}

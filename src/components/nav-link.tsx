"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, ReactNode } from "react";
import tw from "@/utils/tw";

type Props = ComponentProps<typeof Link> & {
  href: string;
  children: ReactNode;
  activeClassName?: string;
  inactiveClassName?: string;
  exact?: boolean;
};

// GNB를 위한 Link 컴포넌트
export default function NavLink({
  href,
  children,
  className,
  activeClassName = "text-site-yellow",
  inactiveClassName = "text-site-gray",
  exact = false,
  ...props
}: Props) {
  // 현재 경로와 href가 일치하는지 확인해서
  // 일치한다면, activeClassName을 적용
  const pathname = usePathname(); // 해당 함수 사용하기 위해 "use client" 필요

  // 현재 경로와 매칭되는지 확인
  // 단, href가 "/"(홈)이 아닐 때 → 하위 경로까지 active 처리
  const isActive = exact
    ? pathname === href // exact = true → 경로가 정확히 같을 때만 active
    : pathname === href || (href !== "/" && pathname.startsWith(`${href}/`)); // exact = false → 경로가 정확히 같아도 active

  const combinedClassName = tw(
    className,
    isActive ? activeClassName : inactiveClassName,
  );

  return (
    <Link
      href={href}
      className={combinedClassName}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
}

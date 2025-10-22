"use client";

import { useRouter } from "next/navigation";
import {
  IconChat,
  IconNoteSearch,
  IconRequest,
  IconUser,
} from "@/components/common/icons";
import { useDialog } from "@/stores/use-dialog";
import { NavLink } from "../common";

interface Props {
  name: string;
  href: string;
  iconType: string;
  isLoggedIn: boolean;
  requiresAuth: boolean;
}

const iconMap = {
  "icon-note-search": IconNoteSearch,
  "icon-request": IconRequest,
  "icon-chat": IconChat,
  "icon-user": IconUser,
};

export default function GlobalNavItem({
  name,
  href,
  iconType,
  isLoggedIn,
  requiresAuth,
}: Props) {
  const Icon = iconMap[iconType as keyof typeof iconMap];

  const router = useRouter();
  const { openDialog } = useDialog();

  const handleClick = (e: React.MouseEvent) => {
    if (requiresAuth && !isLoggedIn) {
      e.preventDefault();
      openDialog("confirm", {
        message: "로그인이 필요한 서비스입니다. 로그인 하시겠습니까?",
        onConfirm: () => {
          router.push("/auth/login");
        },
      });
    }
  };

  return (
    <li key={name} className=" w-full h-[80px]">
      <NavLink
        href={href}
        onClick={handleClick}
        className="flex flex-col items-center w-full h-full pt-2.5"
      >
        <div className="p-2">
          <Icon />
        </div>
        <span className="text-xs">{name}</span>
      </NavLink>
    </li>
  );
}

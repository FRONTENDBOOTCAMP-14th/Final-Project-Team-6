import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import { IconLogo } from "./icons";
import Link from "./link";

interface HeaderProps {
  user: User | null;
  profile: { profile_image_url: string | null; nickname: string | null } | null;
}

export default async function Header({ user, profile }: HeaderProps) {
  const nickname = profile?.nickname || "눈길 사용자";
  const profileImage = profile?.profile_image_url || "default-profile.png";

  if (!user) {
    return (
      <header className="fixed w-full h-[70px] top-0 z-50 bg-[var(--color-site-black)]  border-b border-[var(--color-site-lightblack)] max-w-(--viewport-size)">
        <div className="h-full flex items-center justify-between px-[20px]">
          <Link href="/">
            <span className="sr-only">눈길</span>
            <IconLogo size={42} />
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-sm text-site-gray">로그인이 필요합니다.</span>
            <Link href={"/auth/login"} aria-label="로그인 페이지로 이동">
              <Image
                src="/images/default-profile-image.png"
                alt=""
                width={36}
                height={36}
                className="rounded-full"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed w-full h-[70px] top-0 z-50 bg-[var(--color-site-black)]  border-b border-[var(--color-site-lightblack)] max-w-(--viewport-size)">
      <div className="h-full flex items-center justify-between px-[20px]">
        <Link href="/">
          <span className="sr-only">눈길</span>
          <IconLogo size={42} />
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-site-gray">
            <span className="text-white">{nickname}</span>
          </span>
          <Link href={"/profile/my-profile"} aria-label="내 정보 페이지로 이동">
            <Image
              src={`/images/${profileImage}`}
              alt=""
              width={36}
              height={36}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

import type { User } from "@supabase/supabase-js";
import Image from "next/image";
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
            <h1 className="text-xl font-bold text-[var(--color-site-white)]">
              눈길
            </h1>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="text-xs">로그인이 필요합니다.</span>
            <Link href={"/auth/login"}>
              <Image
                src="/images/logo.png"
                alt=""
                width={40}
                height={40}
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
          <h1 className="text-xl font-bold text-[var(--color-site-white)]">
            눈길
          </h1>
        </Link>

        <div className="flex items-center gap-2.5">
          <span className="text-xs">
            환영합니다,{" "}
            <span className="text-site-blue font-bold">{nickname}</span>님!
          </span>
          <Link href={"/profile/my-profile"}>
            <Image
              src={`/images/${profileImage}`}
              alt=""
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

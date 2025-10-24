"use client";

import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { RunnerType } from "@/app/post/type";
import { Loading } from "@/components/common";
import { IconArrowRight } from "@/components/common/icons";
import RunnerTypeBadge from "@/components/common/runner-type-badge";
import { tw } from "@/utils";
import { createClient } from "@/utils/supabase/client";
import { signOut } from "../_actions/auth-action";

interface Author {
  id: string;
  nickname: string;
  runner_type: RunnerType;
  profile_image_url: string | null;
}

interface UserProfileWithStats extends Author {
  total_mileage?: number;
  total_join?: number;
  created_at?: string;
}

interface ProfileContentProps {
  user: User;
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const [userProfile, setUserProfile] = useState<UserProfileWithStats | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUserProfile() {
      setLoading(true);

      try {
        const supabase = createClient();

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, nickname, runner_type, profile_image_url, total_join, total_mileage, created_at",
          )
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("프로필 조회 오류:", profileError);
          setUserProfile(null);
          return;
        }

        setUserProfile(profile as UserProfileWithStats);
      } catch (error) {
        console.error("프로필 로드 실패:", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [user]);

  const getProfileImageUrl = (imageUrl: string | null) => {
    if (!imageUrl) {
      return "/images/default-profile-image.png";
    }
    if (imageUrl.startsWith("/") || imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `/images/${imageUrl}`;
  };

  const handleLogout = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    await signOut();
  };

  // 활동일
  const getActivityDays = (createdAt: string) => {
    const created = new Date(createdAt);
    const nowDay = new Date();
    const diff = nowDay.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  useEffect(() => {}, []);

  if (loading) {
    return <Loading />;
  }

  if (!userProfile) {
    return (
      <div className="text-center mt-[3.75rem]">
        <p className="text-[var(--color-site-white)] mb-4">
          프로필 정보를 불러오는 데 실패했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-[3.75rem]">
      <h2 className="sr-only">프로필</h2>
      <figure>
        <picture
          className={tw(
            "overflow-hidden block relative text-center bg-[var(--color-site-gray)] w-[6.25rem] h-[6.25rem] m-auto rounded-full",
          )}
        >
          <img
            src={getProfileImageUrl(userProfile.profile_image_url)}
            alt={userProfile.nickname || "프로필"}
          />
        </picture>
        <figcaption
          className={tw("text-center mt-4 font-semibold text-[1.25rem]")}
        >
          <p className={tw("font-bold text-[var(--color-site-white)]")}>
            {userProfile.nickname || "사용자"}
          </p>
          {userProfile.runner_type && (
            <RunnerTypeBadge
              className={tw("inline-block mt-2")}
              runnerType={userProfile.runner_type}
            />
          )}
        </figcaption>
      </figure>
      <div className="mt-6">
        <div className="grid grid-cols-3 gap-4 p-6 rounded-lg bg-site-lightblack text-center">
          <div>
            <p className="text-sm text-site-gray mb-1">총 참여 횟수</p>
            <p className="text-3xl font-bold">
              {userProfile.total_join}
              <span className="text-lg font-normal">회</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-site-gray mb-1">총 달린 거리</p>
            <p className="text-3xl font-bold">
              {userProfile.total_mileage}
              <span className="text-lg font-normal">km</span>
            </p>
          </div>
          <div>
            <p className="text-sm text-site-gray mb-1">활동일</p>
            <p className="text-3xl font-bold">
              {getActivityDays(user.created_at ?? "")}
              <span className="text-lg font-normal">일</span>
            </p>
          </div>
        </div>
      </div>
      <div
        className={tw(
          "mt-[1.3125rem] rounded-[0.5rem] bg-[var(--color-site-lightblack)]",
        )}
      >
        <ul className={tw("flex flex-col")}>
          <li>
            <Link
              href="/profile/profile-edit"
              className={tw(
                "flex flex-row justify-between items-center h-[3.75rem] px-[1.25rem]",
              )}
            >
              <span>프로필 편집</span>
              <span>
                <IconArrowRight />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                alert("준비중입니다.");
              }}
              className={tw(
                "flex flex-row justify-between items-center h-[3.75rem] px-[1.25rem]",
              )}
            >
              <span>문의하기</span>
              <span>
                <IconArrowRight />
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/auth/login"
              onClick={handleLogout}
              className={tw(
                "flex flex-row justify-between items-center h-[3.75rem] px-[1.25rem]",
              )}
            >
              <span>로그아웃</span>
              <span className="text-sm text-[var(--color-site-gray)] ">
                {user.email || ""}
              </span>
            </Link>
          </li>
          <li>
            <Link
              href="/"
              onClick={(e) => {
                e.preventDefault();
                alert("준비중입니다.");
              }}
              className={tw(
                "flex flex-row justify-between items-center h-[3.75rem] px-[1.25rem] text-[var(--color-site-red)]",
              )}
            >
              <span>회원탈퇴</span>
              <span>
                <IconArrowRight />
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

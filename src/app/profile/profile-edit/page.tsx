import ProfileEditContent from "@/app/auth/_components/profile-edit-content";
import { createMetadata } from "@/utils";
import { getCurrentUser } from "@/utils/supabase/get-current-user";

export const metadata = {
  ...createMetadata("PROFILE_EDIT"),
  robots: { index: false, follow: false },
};

export default async function ProfileEditPage() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요한 페이지 입니다.");

  return (
    <div className="mt-[3.75rem]">
      <ProfileEditContent />
    </div>
  );
}

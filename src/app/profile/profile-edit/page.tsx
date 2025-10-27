import ProfileEditContent from "@/app/auth/_components/profile-edit-content";
import { getCurrentUser } from "@/utils/supabase/get-current-user";

export default async function ProfileEditPage() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요한 페이지 입니다.");

  return (
    <div className="mt-[3.75rem]">
      <ProfileEditContent />
    </div>
  );
}

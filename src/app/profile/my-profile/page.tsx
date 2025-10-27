import ProfileContent from "@/app/auth/_components/profile-content";
import { getCurrentUser } from "@/utils/supabase/get-current-user";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) throw new Error("로그인이 필요한 페이지 입니다.");

  return <ProfileContent user={user} />;
}

import { redirect } from "next/navigation";
import ProfileContent from "@/app/auth/_components/profile-content";
import { getCurrentUser } from "@/utils/supabase/get-current-user";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return <ProfileContent user={user} />;
}

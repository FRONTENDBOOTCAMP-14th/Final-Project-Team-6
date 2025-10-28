import { Footer, Header } from "@/components/common";
import { getCurrentUser } from "@/utils/supabase/get-current-user";
import { createClient } from "@/utils/supabase/server";
import GlobalNavBar from "../global-nav/global-nav-bar";

interface Props {
  children: React.ReactNode;
}

export default async function PageLayout({ children }: Props) {
  const user = await getCurrentUser();
  let profile = null;

  if (user) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("profiles")
      .select("profile_image_url, nickname")
      .eq("id", user.id)
      .single();

    profile = data;
  }

  return (
    <div className="pt-[70px] pb-[80px] flex flex-col min-h-[100dvh]">
      <Header user={user} profile={profile} />
      <main className="px-5">{children}</main>
      <Footer />
      <GlobalNavBar />
    </div>
  );
}

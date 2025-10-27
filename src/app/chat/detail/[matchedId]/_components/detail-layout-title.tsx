import { getCurrentUser } from "@/utils/supabase/get-current-user";
import getLayoutTitle from "../_actions/get-layout-title";

interface Props {
  matchedId: string;
}

export default async function ChatDetailLayoutTitle({ matchedId }: Props) {
  const currentUser = await getCurrentUser();
  if (currentUser === null) throw new Error("로그인이 필요합니다.");

  const partnerNickname = getLayoutTitle(currentUser.id, matchedId);

  return (
    <>
      {partnerNickname}
      <span className="sr-only">님과의 채팅방</span>
    </>
  );
}

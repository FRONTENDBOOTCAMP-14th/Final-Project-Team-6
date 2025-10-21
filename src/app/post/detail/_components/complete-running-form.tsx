import type { PostWithAuthor } from "@/app/post/type";
import { Button } from "@/components/common";

interface CompleteRunningFormProps {
  post: PostWithAuthor;
  completeAction: () => void;
}

export default function CompleteRunningForm({
  post,
  completeAction,
}: CompleteRunningFormProps) {
  return (
    <fieldset disabled={!post.is_expired} className="w-full">
      <form action={completeAction} className="w-full">
        <Button
          type="submit"
          buttonColor="var(--color-site-blue)"
          fullWidth
          disabled={!post.is_expired}
          height="medium"
        >
          {post.is_expired
            ? "러닝 완료"
            : "러닝완료버튼은 기간이 지난 후 가능합니다"}
        </Button>
      </form>
    </fieldset>
  );
}

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
  const isDisabled = !post.is_expired;

  return (
    <fieldset disabled={isDisabled} className="w-full">
      <form action={completeAction} className="w-full">
        <Button
          type="submit"
          buttonColor={
            post.is_expired
              ? "var(--color-site-blue)"
              : "var(--color-site-lightblack)"
          }
          fullWidth
          disabled={isDisabled}
          height="medium"
        >
          {post.is_expired
            ? "러닝 완료"
            : "러닝 완료는 기간이 지난 후 가능합니다"}
        </Button>
      </form>
    </fieldset>
  );
}

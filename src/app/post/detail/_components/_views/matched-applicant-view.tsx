import type { PostWithAuthor } from "@/app/post/type";
import { Button } from "@/components/common";
import CompleteRunningForm from "../complete-running-form";

interface MatchedApplicantViewProps {
  post: PostWithAuthor;
  actions: {
    complete: () => void;
    cancel: () => void;
  };
}

export default function MatchedApplicantView({
  post,
  actions,
}: MatchedApplicantViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <CompleteRunningForm post={post} completeAction={actions.complete} />

      <div className="flex">
        <form action={actions.cancel}>
          <Button type="submit" buttonColor="var(--color-site-lightblack)">
            매칭취소
          </Button>
        </form>
      </div>
    </div>
  );
}

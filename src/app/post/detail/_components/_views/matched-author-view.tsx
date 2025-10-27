import type { PostWithAuthor } from "@/app/post/type";
import { Button } from "@/components/common";
import CompleteRunningForm from "../complete-running-form";

interface MatchedAuthorViewProps {
  post: PostWithAuthor;
  actions: {
    complete: () => void;
    cancel: () => void;
    delete: (formData: FormData) => void;
  };
}

export default function MatchedAuthorView({
  post,
  actions,
}: MatchedAuthorViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <CompleteRunningForm post={post} completeAction={actions.complete} />

      <div className="flex items-center gap-2">
        <form action={actions.cancel}>
          <Button type="submit" buttonColor="var(--color-site-lightblack)">
            매칭취소
          </Button>
        </form>
        <div className="flex-grow" />
        <Button buttonColor="var(--color-site-lightblack)">편집</Button>
        <form action={actions.delete}>
          <input type="hidden" name="postId" value={post.id} />
          <Button type="submit" buttonColor="var(--color-site-red)">
            삭제
          </Button>
        </form>
      </div>
    </div>
  );
}

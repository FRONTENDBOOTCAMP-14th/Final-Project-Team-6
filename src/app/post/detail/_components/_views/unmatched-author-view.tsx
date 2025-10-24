import type { PostWithAuthor } from "@/app/post/type";
import { Button } from "@/components/common";

interface UnmatchedAuthorViewProps {
  post: PostWithAuthor;
  actions: {
    delete: (formData: FormData) => void;
  };
}

export default function UnmatchedAuthorView({
  post,
  actions,
}: UnmatchedAuthorViewProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button disabled fullWidth height="medium">
        매칭을 기다리는 중...
      </Button>
      <div className="flex justify-end gap-2">
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

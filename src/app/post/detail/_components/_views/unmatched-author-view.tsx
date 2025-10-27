import Link from "next/link";
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
  const isEditable = !post.is_completed && !post.is_expired;

  const waitMessage = post.is_expired
    ? "러닝 시작 시간 이후 매칭 불가"
    : "매칭을 기다리는 중...";

  return (
    <div className="flex flex-col gap-2">
      <Button disabled fullWidth height="medium">
        {waitMessage}
      </Button>
      <div className="flex justify-end gap-2">
        {isEditable && (
          <Link href={`/post/edit/${post.id}`}>
            <Button buttonColor="var(--color-site-lightblack)">편집</Button>
          </Link>
        )}

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

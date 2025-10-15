import { Button, Link } from "@/components/common";
import { IconArrowRight } from "@/components/common/icons";

export default function EmptyChatList() {
  return (
    <div className="flex flex-col gap-y-6 items-center justify-center mt-15 text-center">
      <p className="text-2xl font-semibold text-site-white">
        아직 생성된 채팅방이 없어요
      </p>
      <p className="text-sm text-site-gray mb-4">
        게시글을 보고 동행을 찾거나,
        <br />
        직접 동행 신청글을 작성해 보세요!
      </p>
      <div className="flex flex-col gap-y-4 w-full">
        <Link href="/post/list">
          <Button height="medium" fullWidth>
            동행 찾으러 가기
            <IconArrowRight />
          </Button>
        </Link>
        <Link href="/post/write">
          <Button height="medium" fullWidth>
            동행 신청글 작성하기
            <IconArrowRight />
          </Button>
        </Link>
      </div>
    </div>
  );
}

import { createPost } from "@/app/post/action";
import { Button, Input } from "@/components/common/index";

export default function PostWritePage() {
  return (
    <main className="w-full max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">동행 신청 페이지</h1>

      <form action={createPost} className="flex flex-col gap-5">
        <Input
          label="제목"
          name="title"
          type="text"
          placeholder="제목을 입력해주세요."
          required
        />
        <Input
          label="만남 장소"
          name="meeting_place"
          type="text"
          placeholder="주소를 입력해주세요."
          required
        />
        <Input
          label="시간"
          name="meeting_time"
          type="datetime-local"
          required
        />

        <Button type="submit">작성완료</Button>
      </form>
    </main>
  );
}

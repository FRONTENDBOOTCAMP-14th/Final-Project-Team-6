import Button from "@/components/common/button";
import {
  IconArrowRight,
  IconChat,
  IconCheck,
  IconClose,
  IconEdit,
  IconLockOpen,
  IconTrash,
} from "@/components/common/icons";
import { siteHexColor } from "@/utils/site-hex-color";
import DialogTrigger from "./dialog-trigger";

export default function DialogTestPage() {
  return (
    <div className="p-10">
      <div className="mb-20">
        <h1 className="text-4xl font-bold mb-5">다이알로그 테스트</h1>
        <DialogTrigger />
      </div>
      <div className="mb-20">
        <h1 className="text-4xl font-bold mb-5">버튼 테스트</h1>
        <div className="flex gap-5">
          <Button type="submit">
            완료
            <IconCheck />
          </Button>
          <Button type="submit" disabled>
            완료
            <IconCheck />
          </Button>
          <Button type="submit" buttonColor={siteHexColor.gray}>
            취소
            <IconClose />
          </Button>
          <Button type="button" fill={false} buttonColor={siteHexColor.gray}>
            가이드러너
          </Button>
          <Button type="button" aria-label="편집하기">
            <IconEdit />
          </Button>
        </div>
        <Button type="submit" height="medium" fullWidth className="mt-6">
          로그인
          <IconCheck />
        </Button>
      </div>
      <div>
        <h1 className="text-4xl font-bold mb-5">아이콘 테스트</h1>
        <div className="flex gap-5">
          <IconArrowRight />
          <IconClose />
          <IconEdit />
          <IconCheck />
          <IconLockOpen />
          <IconChat />
          <IconTrash />
        </div>
      </div>
    </div>
  );
}

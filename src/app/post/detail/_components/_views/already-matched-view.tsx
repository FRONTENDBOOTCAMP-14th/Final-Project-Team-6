import { Button } from "@/components/common";

interface AlreadyMatchedViewProps {
  isExpired: boolean;
}

export default function AlreadyMatchedView({
  isExpired,
}: AlreadyMatchedViewProps) {
  const buttonText = isExpired
    ? "러닝 일정이 종료된 게시글 입니다."
    : "매칭 중인 게시물입니다.";

  return (
    <Button
      disabled
      fullWidth
      height="medium"
      buttonColor="var(--color-site-lightblack)"
    >
      {buttonText}
    </Button>
  );
}

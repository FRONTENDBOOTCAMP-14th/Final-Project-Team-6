import { Button } from "@/components/common";

interface AlreadyMatchedViewProps {
  isExpired: boolean;
}

export default function AlreadyMatchedView({
  isExpired,
}: AlreadyMatchedViewProps) {
  const buttonText = isExpired
    ? "러닝 시작 시간이 경과된 게시글 입니다"
    : "매칭 중인 게시물입니다.";

  return (
    <Button
      disabled
      fullWidth
      height="medium"
      buttonColor={isExpired ? "var(--color-site-lightblack)" : undefined}
      style={{ cursor: isExpired ? "not-allowed" : undefined }}
    >
      {buttonText}
    </Button>
  );
}

import { Button } from "@/components/common";

export default function SameTypeRunnerView() {
  return (
    <Button
      disabled
      fullWidth
      buttonColor="var(--color-site-lightblack)"
      height="medium"
    >
      같은 타입의 러너와는 매칭할 수 없습니다
    </Button>
  );
}

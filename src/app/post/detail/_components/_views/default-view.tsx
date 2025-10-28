import { Button } from "@/components/common";

interface DefaultViewProps {
  actions: {
    createMatch: () => void;
  };
  isExpired: boolean;
}

export default function DefaultView({ actions, isExpired }: DefaultViewProps) {
  if (isExpired) {
    return (
      <Button
        type="button"
        disabled
        buttonColor="var(--color-site-lightblack)"
        fullWidth
        height="medium"
      >
        러닝 일정이 종료된 게시글 입니다.
      </Button>
    );
  }

  return (
    <form action={actions.createMatch}>
      <Button
        type="submit"
        buttonColor="var(--color-site-blue)"
        fullWidth
        height="medium"
      >
        매칭 신청하기
      </Button>
    </form>
  );
}

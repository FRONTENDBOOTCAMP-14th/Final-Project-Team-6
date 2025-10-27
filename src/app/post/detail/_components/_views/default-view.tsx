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
        buttonColor="var(--color-site-blue)"
        fullWidth
        height="medium"
      >
        러닝 시작 시간 만료 이후 매칭 불가
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

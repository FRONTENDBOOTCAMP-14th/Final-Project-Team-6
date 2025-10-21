import { Button } from "@/components/common";

interface DefaultViewProps {
  actions: {
    createMatch: () => void;
  };
}

export default function DefaultView({ actions }: DefaultViewProps) {
  return (
    <form action={actions.createMatch}>
      <Button type="submit" buttonColor="var(--color-site-blue)" fullWidth>
        매칭 신청하기
      </Button>
    </form>
  );
}

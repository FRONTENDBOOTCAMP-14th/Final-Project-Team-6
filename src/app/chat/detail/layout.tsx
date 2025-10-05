import DetailLayout from "@/components/layout/detail-layout";

interface Props {
  children: React.ReactNode;
}

export default function ChatDetailLayout({ children }: Props) {
  return <DetailLayout title={<ChatDetailTitle />}>{children}</DetailLayout>;
}

function ChatDetailTitle() {
  return (
    <>
      유저이름<span className="sr-only">님과의 채팅방</span>
    </>
  );
}

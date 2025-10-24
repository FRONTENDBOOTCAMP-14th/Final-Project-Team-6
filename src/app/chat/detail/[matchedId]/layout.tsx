import DetailLayout from "@/components/layout/detail-layout";
import ChatDetailLayoutTitle from "./_components/detail-layout-title";

interface Props {
  children: React.ReactNode;
  params: Promise<{ matchedId: string }>;
}

export default async function ChatDetailLayout({ children, params }: Props) {
  const { matchedId } = await params;

  return (
    <DetailLayout title={<ChatDetailLayoutTitle matchedId={matchedId} />}>
      {children}
    </DetailLayout>
  );
}

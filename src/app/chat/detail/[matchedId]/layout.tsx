import DetailLayout from "@/components/layout/detail-layout";
import { ChatDetailTitle } from "./components";

interface Props {
  children: React.ReactNode;
  params: Promise<{ matchedId: string }>;
}

export default async function ChatDetailLayout({ children, params }: Props) {
  const { matchedId } = await params;

  return (
    <DetailLayout title={<ChatDetailTitle matchedId={matchedId} />}>
      {children}
    </DetailLayout>
  );
}

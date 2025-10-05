import PageLayout from "@/components/layout/page-layout";

interface Props {
  children: React.ReactNode;
}

export default function ChatListLayout({ children }: Props) {
  return <PageLayout>{children}</PageLayout>;
}

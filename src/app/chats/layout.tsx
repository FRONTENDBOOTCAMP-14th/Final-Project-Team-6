import PageLayout from "@/components/layout/page-layout";

interface Props {
  children: React.ReactNode;
}

export default function ChatsLayout({ children }: Props) {
  return <PageLayout>{children}</PageLayout>;
}

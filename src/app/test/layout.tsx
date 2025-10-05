import PageLayout from "@/components/layout/page-layout";

interface Props {
  children: React.ReactNode;
}

export default function TestLayout({ children }: Props) {
  return <PageLayout>{children}</PageLayout>;
}

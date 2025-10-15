import DetailLayout from "@/components/layout/detail-layout";

interface Props {
  children: React.ReactNode;
}

export default function PostsDetailLayout({ children }: Props) {
  return <DetailLayout title="동행 찾기 상세">{children}</DetailLayout>;
}

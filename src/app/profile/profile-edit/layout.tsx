import DetailLayout from "@/components/layout/detail-layout";

interface Props {
  children: React.ReactNode;
}

export default function ProfileEditLayout({ children }: Props) {
  return <DetailLayout title="내정보 편집">{children}</DetailLayout>;
}

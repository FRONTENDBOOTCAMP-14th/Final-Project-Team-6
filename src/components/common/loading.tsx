import { IconLoading } from "@/components/common/icons";

export default function ChatDetailLoading() {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-1/2 bg-site-black/80 w-full h-[100dvh] max-w-(--viewport-size) flex items-center justify-center">
      <IconLoading size={40} />
      <p className="sr-only">로딩중...</p>
    </div>
  );
}

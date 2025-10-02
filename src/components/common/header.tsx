import Link from "next/link";
import IconSettings from "@/components/icons/icon-settings";

// 헤더의 경우 현재는 프롭스가 없읍니다만.. 나중에 버거같은거 생길수도 있으니 흔적기관 하나 남겨놓겠읍니다.
interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header
      className={`w-full h-[70px] bg-black flex items-center justify-between fixed px-5 top-0 z-50  ${className}`}
    >
      <Link href="/">
        <h1 className="text-xl font-bold text-white">눈길</h1>
      </Link>

      <button
        type="button"
        aria-label="설정 페이지로 이동"
        className="w-10 h-10 flex items-center justify-center"
      >
        <IconSettings />
      </button>
    </header>
  );
}

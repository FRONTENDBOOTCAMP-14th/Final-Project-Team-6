import Link from "next/link";
import IconSettings from "@/components/common/icons/icon-settings";
import { siteHexColor } from "@/utils/site-hex-color";

// 헤더의 경우 현재는 프롭스가 없읍니다만.. 나중에 버거같은거 생길수도 있으니 흔적기관 하나 남겨놓겠읍니다.
interface HeaderProps {
  className?: string;
}

export default function Header({ className }: HeaderProps) {
  return (
    <header
      className={`fixed w-full h-[70px] flex items-center justify-between px-[20px] top-0 z-50  ${className}`}
      style={{ backgroundColor: siteHexColor.black }}
    >
      <Link className="" href="/">
        <h1 className="text-xl font-bold" style={{ color: siteHexColor.white }}>
          눈길
        </h1>
      </Link>
      <button
        type="button"
        aria-label="설정 페이지로 이동"
        className="w-[40px] h-[40px] flex items-center justify-center"
      >
        <IconSettings />
      </button>
    </header>
  );
}

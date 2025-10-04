import Link from "next/link";
import { siteHexColor } from "@/utils/site-hex-color";

// 흔적기관 + 1 입니다.
interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  function getCurrentYear() {
    return new Date().getFullYear();
  }
  const currentYear = getCurrentYear();

  return (
    <footer
      className={`w-full bottom-0 fixed z-50 ${className}`}
      style={{ backgroundColor: siteHexColor.black }}
    >
      <div
        className="w-full h-[121px] px-[20px] pt-[80px] pb-[20px] flex justify-between items-center text-sm"
        style={{ color: siteHexColor.gray }}
      >
        <div className="flex justify-between items-center gap-[16px]">
          <Link href="/privacy" className="">
            개인정보 처리방침
          </Link>
          <Link href="/terms" className="">
            이용약관
          </Link>
        </div>
        <p>&copy; {currentYear} Eyepath.</p>
      </div>
    </footer>
  );
}

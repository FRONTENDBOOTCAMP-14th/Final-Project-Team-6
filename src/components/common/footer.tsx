import Link from "next/link";

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
    <footer className={`bg-black w-full bottom-0 fixed z-50 ${className}`}>
      <div className="w-full h-[121] px-5 pt-20 pb-5 flex justify-between items-center text-sm text-gray-400">
        <div className="flex justify-between items-center gap-4">
          <Link
            href="/privacy"
            className=" transition-colors focus:outline-none focus:text-white"
          >
            개인정보 처리방침
          </Link>
          <Link
            href="/terms"
            className=" transition-colors focus:outline-none focus:text-white"
          >
            이용약관
          </Link>
        </div>
        <p>&copy; {currentYear} Eyepath.</p>
      </div>
    </footer>
  );
}

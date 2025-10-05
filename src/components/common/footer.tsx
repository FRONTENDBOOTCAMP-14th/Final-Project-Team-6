import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--color-site-black)]">
      <div className="w-full h-[121px] px-[20px] pt-[80px] pb-[20px] flex justify-between items-center text-sm text-[var(--color-site-gray)]">
        <div className="flex justify-between items-center gap-[16px]">
          <Link href="/privacy">개인정보 처리방침</Link>
          <Link href="/terms">이용약관</Link>
        </div>
        <p>&copy; {currentYear} Eyepath.</p>
      </div>
    </footer>
  );
}

import Link from "./link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto">
      <div className="w-full px-5 pt-20 pb-8 flex justify-between items-center text-sm text-[var(--color-site-gray)]">
        <div className="flex justify-between items-center gap-[16px]">
          <Link href="/legal/privacy">개인정보 처리방침</Link>
          <Link href="/legal/terms">이용약관</Link>
        </div>
        <small className="text-sm">&copy; {currentYear} Eyepath.</small>
      </div>
    </footer>
  );
}

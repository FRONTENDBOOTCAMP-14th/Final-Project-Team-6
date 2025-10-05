import Link from "./link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--color-site-black)] mt-auto">
      <div className="w-full px-5 pt-20 pb-8 flex justify-between items-center text-sm text-[var(--color-site-gray)]">
        <div className="flex justify-between items-center gap-[16px]">
          <Link href="/privacy">개인정보 처리방침</Link>
          <Link href="/terms">이용약관</Link>
        </div>
        <p>&copy; {currentYear} Eyepath.</p>
      </div>
    </footer>
  );
}

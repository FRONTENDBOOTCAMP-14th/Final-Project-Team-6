import IconSettings from "@/components/common/icons/icon-settings";
import Link from "./link";

export default function Header() {
  return (
    <header className="fixed w-full h-[70px] top-0 z-50 bg-[var(--color-site-black)]">
      <div className="h-full flex items-center justify-between px-[20px]">
        <Link href="/">
          <h1 className="text-xl font-bold text-[var(--color-site-white)]">
            눈길
          </h1>
        </Link>

        <button
          type="button"
          aria-label="설정 페이지로 이동"
          className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer"
        >
          <IconSettings />
        </button>
      </div>
    </header>
  );
}

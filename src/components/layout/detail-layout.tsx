import BackButton from "./components/back-button";

interface Props {
  children: React.ReactNode;
  title: string | React.ReactNode;
}

export default function DetailLayout({ children, title }: Props) {
  return (
    <div className="pt-[70px] min-h-[100dvh]">
      <header className="z-50 fixed top-0 w-full border-b border-b-white/10 max-w-(--viewport-size) bg-site-black">
        <div className="flex items-center px-5 h-[70px] relative">
          <BackButton />
          <h1 className="text-xl font-bold absolute top-1/2 left-1/2 -translate-1/2">
            {title}
          </h1>
        </div>
      </header>
      <main className="px-5">{children}</main>
    </div>
  );
}

import { Footer, Header } from "@/components/common";
import GlobalNavBar from "../global-nav/global-nav-bar";

interface Props {
  children: React.ReactNode;
}

export default function PageLayout({ children }: Props) {
  return (
    <div className="pt-[70px] pb-[80px] flex flex-col min-h-[100dvh]">
      <Header />
      <main>{children}</main>
      <GlobalNavBar />
      <Footer />
    </div>
  );
}

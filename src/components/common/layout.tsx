import type React from "react";
import Footer from "./footer";
import Header from "./header";
import NavigationBar from "./navigation-bar";

interface LayoutProps {
  children: React.ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-w-[320px] max-w-[480px] flex flex-col min-h-screen pt-[70px] pb-[80px]">
      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
      <NavigationBar />
    </div>
  );
}

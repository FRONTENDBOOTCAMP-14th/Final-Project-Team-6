import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import DialogProvider from "@/components/dialogs/dialog-provider";
import ToastProvider from "@/components/toast/toast-provider";

const pretendard = localFont({
  src: "../../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "빛나는 동반주자 연결고리, 눈길",
  description: "시각장애인 러너와 가이드러너의 매칭 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR">
      <body className={`${pretendard.variable} antialiased`}>
        <div className="max-w-(--viewport-size) mx-auto bg-site-black">
          {children}
        </div>
        <DialogProvider />
        <ToastProvider />
      </body>
    </html>
  );
}

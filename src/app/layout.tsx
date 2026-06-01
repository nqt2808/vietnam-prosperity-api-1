import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VPC Store - Thiết Bị Công Nghệ & Chiếu Sáng Thông Minh Cao Cấp",
  description: "Khám phá các thiết bị chiếu sáng thông minh RGBIC, tai nghe ANC cao cấp, bàn phím cơ custom, và các giải pháp góc làm việc công nghệ đỉnh cao tại VPC Store.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://website-vpc.vercel.app'),
  openGraph: {
    title: "VPC Store - Thiết Bị Công Nghệ Cao Cấp",
    description: "Nhà cung cấp thiết bị chiếu sáng thông minh, âm thanh đỉnh cao và góc làm việc công thái học số 1.",
    url: "/",
    siteName: "VPC Store",
    locale: "vi_VN",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-950 dark:bg-[#030303] dark:text-zinc-50 transition-colors duration-300">
        <Header />
        <main className="flex-1 flex flex-col pt-[122px] max-[980px]:pt-[88px] max-[520px]:pt-[68px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

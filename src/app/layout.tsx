import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vietnam Prosperity Coffee - Trung Nguyên Legend Âu Lạc",
  description: "Trải nghiệm hương vị cà phê năng lượng đích thực cùng 3 nền văn minh cà phê thế giới tại Trung Nguyên Legend Âu Lạc Huế.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://website-vpc.vercel.app'),
  openGraph: {
    title: "Vietnam Prosperity Coffee - Trung Nguyên Legend Âu Lạc",
    description: "Không gian cà phê năng lượng, tỉnh thức và hội tụ tinh hoa 3 nền văn minh cà phê thế giới tại Huế.",
    url: "/",
    siteName: "Vietnam Prosperity Coffee",
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
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}


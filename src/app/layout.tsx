import { siteImages } from "@/lib/site-images";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Tuổi trẻ Khoa Kỹ thuật Cơ khí - CTUT",
  description: "Cổng thông tin & Hoạt động phong trào Đoàn Khoa Kỹ thuật Cơ khí CTUT",
  keywords: [
    "FME",
    "CTUT",
    "Tuổi trẻ Khoa Kỹ thuật Cơ khí",
    "Khoa Kỹ thuật Cơ khí CTUT",
    "Liên chi Hội Sinh viên Khoa Kỹ thuật Cơ khí",
    "Đoàn Khoa Kỹ thuật Cơ khí",
    "hoạt động sinh viên CTUT",
    "cổng thông tin CTUT",
  ],
  icons: {
    icon: siteImages.icon,
    shortcut: siteImages.icon,
    apple: siteImages.icon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="antialiased bg-white text-slate-800">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

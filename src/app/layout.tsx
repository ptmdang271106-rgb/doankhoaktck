import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";

const poppins = Poppins({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tuổi trẻ Khoa Kỹ thuật Cơ khí - CTUT",
  description: "Cổng thông tin & Hoạt động phong trào Đoàn Khoa Kỹ thuật Cơ khí CTUT",
  icons: {
    icon: "/logodk.png",
    shortcut: "/logodk.png",
    apple: "/logodk.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${poppins.className} antialiased bg-white text-slate-800`}>
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import FloatingContact from "@/components/FloatingContact";

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
      <body className="antialiased">
        {children}
        <FloatingContact />
      </body>
    </html>
  );
}

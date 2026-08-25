import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingContact from "@/components/FloatingContact";

export const metadata: Metadata = {
  title: "Tuổi trẻ Khoa Kỹ thuật Cơ khí - CTUT",
  description: "Cổng thông tin Khoa Kỹ thuật Cơ khí CTUT",
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
      <body className="bg-slate-50 text-slate-800 antialiased min-h-screen flex flex-col justify-between">
        <Navbar />
        <div className="flex-1">{children}</div>
        <FloatingContact />
      </body>
    </html>
  );
}

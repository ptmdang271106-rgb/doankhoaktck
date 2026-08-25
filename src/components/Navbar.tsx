"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Lấy thông tin user hiện tại từ LocalStorage
    const storedUser = localStorage.getItem("ctut_current_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
  }, []);

  // Xử lý đăng xuất sạch cả Supabase, Google Session và LocalStorage
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Lỗi đăng xuất:", e);
    }
    localStorage.removeItem("ctut_current_user");
    setUser(null);
    window.location.href = "/dang-nhap";
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tên Đoàn Khoa */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logodk.png"
                alt="Logo Khoa Cơ Khí"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-2 border-orange-500 pl-3">
              <span className="block text-[11px] sm:text-xs font-bold text-blue-900 uppercase tracking-wide">
                Đoàn Trường ĐH Kỹ thuật - Công nghệ Cần Thơ
              </span>
              <span className="block text-sm sm:text-base font-extrabold text-[#E05A10] uppercase">
                Đoàn Khoa Kỹ thuật Cơ khí
              </span>
            </div>
          </Link>

          {/* Menu máy tính */}
          <nav className="hidden md:flex items-center gap-2 font-semibold text-sm text-slate-700">
            <Link
              href="/"
              className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition"
            >
              Trang chủ
            </Link>
            <Link
              href="/tra-cuu"
              className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition"
            >
              Tra cứu ĐRL & CTXH
            </Link>
            <Link
              href="/dang-ky"
              className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition"
            >
              Đăng ký hoạt động
            </Link>

            {/* Trạng thái Người dùng / Đăng nhập */}
            {user ? (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-slate-200">
                <div className="text-right leading-tight">
                  <span className="block text-xs font-bold text-[#004A52]">
                    {user.fullName || user.mssv}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    {user.role === "super_admin"
                      ? "Admin Tối Cao"
                      : user.role === "branch_admin"
                      ? "BCH Chi Đoàn"
                      : user.mssv}
                  </span>
                </div>
                {(user.role === "super_admin" || user.role === "branch_admin") && (
                  <Link
                    href="/admin"
                    className="px-3 py-1.5 rounded-lg bg-[#004A52] hover:bg-[#00343a] text-white text-xs font-bold transition shadow-xs"
                  >
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="ml-3 px-4 py-2 rounded-full bg-[#E05A10] hover:bg-[#c94d0a] text-white font-bold text-xs shadow-sm transition"
              >
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* Nút Mobile Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu xổ xuống trên Điện thoại */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-2 font-medium text-slate-700">
          <Link
            href="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-orange-50"
          >
            Trang chủ
          </Link>
          <Link
            href="/tra-cuu"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-orange-50"
          >
            Tra cứu ĐRL & CTXH
          </Link>
          <Link
            href="/dang-ky"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-lg hover:bg-orange-50"
          >
            Đăng ký hoạt động
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="px-3 py-1">
                <span className="block text-xs font-bold text-[#004A52]">
                  {user.fullName || user.mssv}
                </span>
                <span className="block text-[10px] text-slate-500 font-mono">
                  {user.role === "super_admin"
                    ? "Admin Tối Cao"
                    : user.role === "branch_admin"
                    ? "BCH Chi Đoàn"
                    : user.mssv}
                </span>
              </div>
              {(user.role === "super_admin" || user.role === "branch_admin") && (
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-2 rounded-xl bg-[#004A52] text-white text-xs font-bold"
                >
                  Trang Quản trị
                </Link>
              )}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-center px-4 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <Link
              href="/dang-nhap"
              onClick={() => setIsOpen(false)}
              className="block text-center px-4 py-2 rounded-xl bg-[#E05A10] text-white font-bold text-xs"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

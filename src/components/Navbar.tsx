"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("ctut_current_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
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
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0">
              <Image
                src="/logodk.png"
                alt="Logo Khoa Cơ Khí"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-2 border-orange-500 pl-2.5">
              <span className="block text-[10px] sm:text-xs font-bold text-blue-900 uppercase tracking-wide">
                Đoàn Trường ĐH Kỹ thuật - Công nghệ Cần Thơ
              </span>
              <span className="block text-xs sm:text-base font-extrabold text-[#E05A10] uppercase">
                Đoàn Khoa Kỹ thuật Cơ khí
              </span>
            </div>
          </Link>

          {/* Menu máy tính */}
          <nav className="hidden md:flex items-center gap-1 font-semibold text-sm text-slate-700">
            <Link href="/" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition">
              Trang chủ
            </Link>

            {/* Dropdown Giới thiệu */}
            <div className="relative group" ref={dropdownRef}>
              <div className="flex items-center">
                <Link href="/gioi-thieu" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition font-semibold">
                  Giới thiệu
                </Link>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="p-1 hover:text-[#E05A10] transition"
                  aria-label="Toggle menu"
                >
                  ▾
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700">
                  <Link href="/gioi-thieu" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#E05A10]">
                    Về Đoàn Khoa Cơ Khí
                  </Link>
                  <Link href="/tra-cuu-thong-tin" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#E05A10]">
                    Tra cứu Đoàn viên / Sinh viên
                  </Link>
                </div>
              )}
            </div>

            <Link href="/diem-danh" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition">
              Điểm danh
            </Link>
            <Link href="/tra-cuu" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition">
              Cổng ĐRL & CTXH
            </Link>
            <Link href="/dang-ky" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition">
              Đăng ký hoạt động
            </Link>

            {user ? (
              <div className="flex items-center gap-3 ml-3 pl-3 border-l border-slate-200">
                <div className="text-right leading-tight">
                  <span className="block text-xs font-bold text-[#004A52]">
                    {user.fullName || user.mssv}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    {user.role === "super_admin" ? "Admin Tối Cao" : user.role === "branch_admin" ? "BCH Chi Đoàn" : user.mssv}
                  </span>
                </div>
                {(user.role === "super_admin" || user.role === "branch_admin") && (
                  <Link href="/admin" className="px-3 py-1.5 rounded-lg bg-[#004A52] hover:bg-[#00343a] text-white text-xs font-bold transition shadow-xs">
                    Quản trị
                  </Link>
                )}
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition">
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link href="/dang-nhap" className="ml-3 px-4 py-2 rounded-full bg-[#E05A10] hover:bg-[#c94d0a] text-white font-bold text-xs shadow-sm transition">
                Đăng nhập
              </Link>
            )}
          </nav>

          {/* Nút Mobile Menu (Luôn hiển thị trên màn hình nhỏ) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2.5 rounded-xl bg-orange-50 text-[#E05A10] hover:bg-orange-100 transition focus:outline-none"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu xổ xuống trên Điện thoại (Mobile Drawer) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-3 pb-5 space-y-2 font-semibold text-sm text-slate-700 shadow-lg">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#E05A10]">
            Trang chủ
          </Link>
          <Link href="/gioi-thieu" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#E05A10]">
            Về Đoàn Khoa Cơ Khí
          </Link>
          <Link href="/tra-cuu-thong-tin" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#E05A10]">
            Tra cứu Đoàn viên / Sinh viên
          </Link>
          <Link href="/diem-danh" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#E05A10]">
            Điểm danh QR sự kiện
          </Link>
          <Link href="/tra-cuu" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#E05A10]">
            Cổng Điểm Rèn Luyện (ĐRL)
          </Link>
          <Link href="/dang-ky" onClick={() => setIsOpen(false)} className="block px-3 py-2.5 rounded-xl hover:bg-orange-50 hover:text-[#E05A10]">
            Đăng ký hoạt động
          </Link>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-3">
                <div className="px-3 py-1 bg-slate-50 rounded-xl">
                  <span className="block text-xs font-bold text-[#004A52]">
                    {user.fullName || user.mssv}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-mono">
                    {user.role === "super_admin" ? "Admin Tối Cao" : user.role === "branch_admin" ? "BCH Chi Đoàn" : user.mssv}
                  </span>
                </div>
                {(user.role === "super_admin" || user.role === "branch_admin") && (
                  <Link href="/admin" onClick={() => setIsOpen(false)} className="block text-center px-4 py-2.5 rounded-xl bg-[#004A52] text-white text-xs font-bold uppercase shadow">
                    Trang Quản trị
                  </Link>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-bold"
                >
                  Đăng xuất tài khoản
                </button>
              </div>
            ) : (
              <Link href="/dang-nhap" onClick={() => setIsOpen(false)} className="block text-center px-4 py-3 rounded-xl bg-[#E05A10] text-white font-bold text-xs uppercase shadow">
                Đăng nhập hệ thống
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

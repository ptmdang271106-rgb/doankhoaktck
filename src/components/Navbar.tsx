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
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
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
        setActiveSubMenu(null);
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
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* MENU TRÁI: Điểm danh | Cổng ĐRL | Giới thiệu | Chi đoàn / Chi hội */}
          <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-slate-700">
            <Link
              href="/diem-danh"
              className="bg-[#007A87] hover:bg-[#00606B] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm"
            >
              Điểm danh
            </Link>
            
            <Link
              href="/tra-cuu"
              className="bg-[#00707b] hover:bg-[#005a63] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm"
            >
              Cổng ĐRL
            </Link>

            {/* DROPDOWN GIỚI THIỆU CHUẨN UEH STYLE */}
            <div 
              className="relative py-2" 
              ref={dropdownRef}
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => {
                setIsDropdownOpen(false);
                setActiveSubMenu(null);
              }}
            >
              <div className="flex items-center gap-1 cursor-pointer py-1">
                <Link href="/gioi-thieu" className="hover:text-[#EE6425] transition-colors font-bold text-slate-800">
                  Giới thiệu
                </Link>
                <span className="text-xs">▾</span>
              </div>

              {isDropdownOpen && (
                <div className="absolute left-0 top-full w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700">
                  
                  {/* Mục 1: Cơ cấu nhân sự (Hover hiện sub-menu) */}
                  <div 
                    className="relative px-4 py-3 hover:bg-orange-50 hover:text-[#EE6425] transition cursor-pointer flex justify-between items-center"
                    onMouseEnter={() => setActiveSubMenu("nhansu")}
                  >
                    <span>Cơ cấu nhân sự</span>
                    <span>▶</span>

                    {activeSubMenu === "nhansu" && (
                      <div className="absolute left-full top-0 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700">
                        <Link href="/gioi-thieu" className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#EE6425]">
                          Đoàn khoa KTCK
                        </Link>
                        <Link href="/gioi-thieu" className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#EE6425]">
                          Liên chi hội KTCK
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Mục 2: Chức năng - Tiện ích (Hover hiện sub-menu) */}
                  <div 
                    className="relative px-4 py-3 hover:bg-orange-50 hover:text-[#EE6425] transition cursor-pointer flex justify-between items-center border-t border-slate-50"
                    onMouseEnter={() => setActiveSubMenu("tienich")}
                  >
                    <span>Chức năng - Tiện ích</span>
                    <span>▶</span>

                    {activeSubMenu === "tienich" && (
                      <div className="absolute left-full top-0 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700">
                        <Link href="/tra-cuu-thong-tin" className="block px-4 py-3 hover:bg-orange-50 hover:text-[#EE6425]">
                          Tra cứu thông tin sinh viên
                        </Link>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>

            <a href="#" className="hover:text-[#007A87] transition-colors text-xs font-semibold">
              Chi đoàn / Chi hội
            </a>
          </nav>

          {/* LOGO CHUẨN NGANG BÊN PHẢI */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-44 sm:w-56 h-12 flex-shrink-0">
                <Image
                  src="/logo-doankhoa.png"
                  alt="Logo Khoa Cơ Khí"
                  fill
                  className="object-contain object-right"
                  priority
                />
              </div>
            </Link>

            {/* TÀI KHOẢN ĐĂNG NHẬP */}
            {user ? (
              <div className="hidden sm:flex items-center gap-2 bg-orange-50/80 border border-orange-200 px-3 py-1.5 rounded-2xl shadow-xs">
                <div className="text-right leading-tight">
                  <span className="block text-[11px] font-bold text-[#EE6425]">
                    {user.fullName || user.mssv}
                  </span>
                  <span className="block text-[9px] text-slate-500 font-semibold">
                    {user.role === "super_admin" ? "Admin Tối Cao" : user.role === "branch_admin" ? "Bí thư Chi đoàn" : user.mssv}
                  </span>
                </div>
                {(user.role === "super_admin" || user.role === "branch_admin" || user.role === "admin") && (
                  <Link href="/admin" className="bg-[#004A52] hover:bg-[#00343a] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition">
                    Quản trị
                  </Link>
                )}
                <button onClick={handleLogout} className="text-[10px] text-red-600 font-bold hover:underline">
                  (Đăng xuất)
                </button>
              </div>
            ) : (
              <Link href="/dang-nhap" className="bg-[#EE6425] hover:bg-[#d85216] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm">
                Đăng nhập
              </Link>
            )}

            {/* NÚT MOBILE MENU */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-orange-50 text-[#EE6425]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 text-sm font-semibold text-slate-700 shadow-xl">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-orange-50">Trang chủ</Link>
          <Link href="/gioi-thieu" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-orange-50">Cơ cấu nhân sự (Đoàn khoa & Liên chi hội)</Link>
          <Link href="/tra-cuu-thong-tin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-orange-50">Tra cứu thông tin sinh viên</Link>
          <Link href="/diem-danh" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-orange-50">Điểm danh</Link>
          <Link href="/tra-cuu" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-orange-50">Cổng ĐRL & CTXH</Link>
          <Link href="/dang-ky" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-orange-50">Đăng ký hoạt động</Link>
        </div>
      )}
    </header>
  );
}

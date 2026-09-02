"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function GioiThieuPage() {
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const introDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ctut_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const fetchIntro = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "about_us")
        .maybeSingle();

      if (data && data.value) {
        setContentHtml(data.value);
      } else {
        setContentHtml(`
          <h2 style="color: #004A52; font-weight: 800; font-size: 24px; margin-bottom: 16px;">Về Đoàn Khoa Kỹ thuật Cơ khí - CTUT</h2>
          <p style="margin-bottom: 12px; line-height: 1.6;">Đoàn Thanh niên - Hội Sinh viên Khoa Kỹ thuật Cơ khí là tổ chức chính trị - xã hội của đoàn viên, sinh viên Khoa Kỹ thuật Cơ khí, Trường Đại học Kỹ thuật - Công nghệ Cần Thơ.</p>
        `);
      }
      setLoading(false);
    };
    fetchIntro();

    const handleClickOutside = (e: MouseEvent) => {
      if (introDropdownRef.current && !introDropdownRef.current.contains(e.target as Node)) {
        setIsIntroOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ctut_current_user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
      {/* THANH ĐIỀU HƯỚNG CHUẨN TRANG CHỦ */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* LOGO & TÊN KHOA */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <img
                  src="/logodk.png"
                  alt="Logo Khoa Cơ Khí"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="border-l-2 border-orange-500 pl-3">
                <span className="block text-[11px] sm:text-xs font-bold text-[#0A2540] uppercase tracking-wide">
                  ĐOÀN TRƯỜNG ĐH KỸ THUẬT - CÔNG NGHỆ CẦN THƠ
                </span>
                <span className="block text-sm sm:text-base font-extrabold text-[#E05A10] uppercase">
                  ĐOÀN KHOA KỸ THUẬT CƠ KHÍ
                </span>
              </div>
            </Link>

            {/* MENU TRUNG TÂM & PHẢI (DESKTOP) */}
            <nav className="hidden lg:flex items-center gap-6 font-semibold text-sm text-slate-700">
              <Link href="/" className="hover:text-[#EE6425] transition-colors py-2">
                Trang chủ
              </Link>

              {/* DROPDOWN GIỚI THIỆU */}
              <div className="relative group py-2" ref={introDropdownRef}>
                <div className="flex items-center gap-1 cursor-pointer text-[#EE6425]">
                  <Link href="/gioi-thieu" className="transition-colors">
                    Giới thiệu
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsIntroOpen(!isIntroOpen)}
                    className="p-0.5 text-xs transition"
                  >
                    ▾
                  </button>
                </div>

                <div className={`absolute left-0 top-full w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 text-xs font-bold text-slate-700 transition-all ${
                  isIntroOpen ? "block" : "hidden group-hover:block"
                }`}>
                  <Link
                    href="/gioi-thieu"
                    onClick={() => setIsIntroOpen(false)}
                    className="block px-4 py-3 hover:bg-orange-50 hover:text-[#EE6425] transition"
                  >
                    Giới thiệu Đoàn Khoa
                  </Link>
                  <Link
                    href="/tra-cuu-thong-tin"
                    onClick={() => setIsIntroOpen(false)}
                    className="block px-4 py-3 hover:bg-orange-50 hover:text-[#EE6425] transition border-t border-slate-50"
                  >
                    Tra cứu Đoàn viên / Sinh viên
                  </Link>
                </div>
              </div>

              <Link href="/diem-danh" className="hover:text-[#EE6425] transition-colors py-2">
                Điểm danh
              </Link>
              <Link href="/tra-cuu" className="hover:text-[#EE6425] transition-colors py-2">
                Cổng ĐRL & CTXH
              </Link>
              <Link href="/dang-ky" className="hover:text-[#EE6425] transition-colors py-2">
                Đăng ký hoạt động
              </Link>
            </nav>

            {/* THÔNG TIN TÀI KHOẢN */}
            <div className="hidden lg:flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3 bg-orange-50/80 border border-orange-200 px-4 py-2 rounded-2xl shadow-xs">
                  <div className="text-right leading-tight">
                    <span className="block text-xs font-bold text-[#004A52]">
                      {currentUser.fullName || currentUser.mssv}
                    </span>
                    <span className="block text-[10px] text-slate-500 font-semibold">
                      {currentUser.role === "super_admin" ? "Admin Tối Cao" : currentUser.role === "branch_admin" ? "BCH Chi Đoàn (Bí thư)" : currentUser.mssv}
                    </span>
                  </div>
                  {(currentUser.role === "super_admin" || currentUser.role === "branch_admin" || currentUser.role === "admin") && (
                    <Link
                      href="/admin"
                      className="bg-[#004A52] hover:bg-[#00343a] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs"
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-2 rounded-xl transition"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="bg-[#EE6425] hover:bg-[#d85216] text-white px-5 py-2.5 rounded-2xl text-xs font-bold transition shadow-md"
                >
                  Đăng nhập
                </Link>
              )}
            </div>

            {/* NÚT MOBILE MENU */}
            <button
              onClick={() => setIsIntroOpen(!isIntroOpen)}
              className="lg:hidden p-2 rounded-xl bg-orange-50 text-[#EE6425]"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* MENU PHỤ BÊN DƯỚI */}
        <div className="bg-[#F8FCFC] border-t border-b border-[#E6F4F4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-10 py-2.5 text-xs sm:text-sm font-semibold text-[#007A87] overflow-x-auto whitespace-nowrap">
              <Link href="/dang-ky" className="hover:text-[#004A52] font-bold text-[#EE6425]">
                Hoạt động – Sự kiện Cơ khí
              </Link>
              <Link href="/gioi-thieu" className="hover:text-[#004A52] font-bold">Giới thiệu Đoàn Khoa</Link>
              <Link href="/tra-cuu-thong-tin" className="hover:text-[#004A52] font-bold text-blue-700">Tra cứu Đoàn viên / Sinh viên</Link>
              <a href="#" className="hover:text-[#004A52]">Xem gì hôm nay</a>
              <a href="#" className="hover:text-[#004A52]">Bản tin học thuật</a>
            </div>
          </div>
        </div>
      </header>

      {/* NỘI DUNG TRANG GIỚI THIỆU */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <span className="text-xs font-bold text-[#EE6425] uppercase tracking-wider block mb-1">Giới thiệu chung</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#004A52]">ĐOÀN KHOA KỸ THUẬT CƠ KHÍ</h1>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs">Đang tải nội dung...</div>
          ) : (
            <div 
              className="prose max-w-none text-sm text-slate-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            ></div>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1A252F] text-gray-400 py-8 border-t border-gray-700 text-xs mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="text-white font-bold uppercase">
            ĐOÀN KHOA KỸ THUẬT CƠ KHÍ – TRƯỜNG ĐẠI HỌC KỸ THUẬT - CÔNG NGHỆ CẦN THƠ
          </div>
          <div>Địa chỉ: 256 Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, TP. Cần Thơ</div>
          <div className="text-gray-500 text-[11px]">Bản quyền 2026 CTUT Mechanical Youth Portal.</div>
        </div>
      </footer>
    </div>
  );
}

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
      {/* THANH ĐIỀU HƯỚNG CHUẨN ĐÚNG MẪU HÌNH ẢNH */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40 shadow-xs">
        <div className="w-full px-3 sm:px-6 lg:px-10">
          <div className="py-2.5 sm:py-3 lg:h-24 grid grid-cols-12 items-center text-[13px] font-medium text-[#2C3E50]">
            
            {/* MENU TRÁI (ĐIỂM DANH, CỔNG ĐRL, GIỚI THIỆU, CHI ĐOÀN) */}
            <div className="col-span-8 hidden lg:flex items-center justify-start space-x-4 whitespace-nowrap">
              <Link
                href="/diem-danh"
                className="bg-[#007A87] hover:bg-[#00606B] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors shadow-sm inline-block"
              >
                Điểm danh
              </Link>
              
              <Link
                href="/tra-cuu"
                className="bg-[#00707b] hover:bg-[#005a63] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors inline-block shadow-sm"
              >
                Cổng ĐRL
              </Link>

              {/* DROPDOWN GIỚI THIỆU */}
              <div className="relative group py-2" ref={introDropdownRef}>
                <div className="flex items-center gap-1 cursor-pointer">
                  <Link href="/gioi-thieu" className="hover:text-[#EE6425] transition-colors font-bold text-slate-800">
                    Giới thiệu
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsIntroOpen(!isIntroOpen)}
                    className="p-0.5 hover:text-[#EE6425] text-xs transition"
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

              <a href="#" className="hover:text-[#007A87] transition-colors text-xs font-semibold">
                Chi đoàn / Chi hội
              </a>
            </div>

            {/* LOGO & TÊN KHOA Ở GIỮA/PHẢI */}
            <div className="col-span-12 lg:col-span-4 flex items-center justify-end gap-3 py-1">
              <Link href="/" className="flex items-center gap-3">
                <div className="border-l-2 border-orange-500 pl-3 text-right hidden xl:block">
                  <span className="block text-[10px] font-bold text-[#0A2540] uppercase">
                    ĐOÀN TRƯỜNG ĐH KỸ THUẬT - CÔNG NGHỆ CẦN THƠ
                  </span>
                  <span className="block text-xs font-extrabold text-[#E05A10] uppercase">
                    ĐOÀN KHOA KỸ THUẬT CƠ KHÍ
                  </span>
                </div>
                <img
                  src="/logo-doankhoa.png"
                  alt="Logo Khoa Cơ Khí"
                  className="h-10 sm:h-12 w-auto object-contain cursor-pointer"
                />
              </Link>

              {/* TÀI KHOẢN ĐĂNG NHẬP */}
              {currentUser ? (
                <div className="flex items-center gap-2 bg-orange-50/80 border border-orange-200 px-3 py-1.5 rounded-2xl shadow-xs">
                  <div className="text-right leading-tight">
                    <span className="block text-[11px] font-bold text-[#EE6425]">
                      {currentUser.fullName || currentUser.mssv}
                    </span>
                    <span className="block text-[9px] text-slate-500 font-semibold">
                      {currentUser.role === "super_admin" ? "Admin Tối Cao" : currentUser.role === "branch_admin" ? "Bí thư Chi đoàn" : currentUser.mssv}
                    </span>
                  </div>
                  {(currentUser.role === "super_admin" || currentUser.role === "branch_admin" || currentUser.role === "admin") && (
                    <Link
                      href="/admin"
                      className="bg-[#004A52] hover:bg-[#00343a] text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition"
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-[10px] text-red-600 font-bold hover:underline"
                  >
                    (Đăng xuất)
                  </button>
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="bg-[#EE6425] hover:bg-[#d85216] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-sm"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
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

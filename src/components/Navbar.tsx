"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const introDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ctut_current_user");
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        setCurrentUser(null);
      }
    }

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
    <header className="border-b border-gray-100 bg-white sticky top-0 z-40 shadow-xs font-sans">
      <div className="w-full px-3 sm:px-6 lg:px-10">
        <div className="py-2.5 sm:py-3 lg:h-24 grid grid-cols-12 items-center text-[13px] font-medium text-[#2C3E50]">
          
          {/* 1. MENU TRÁI (DESKTOP) */}
          <div className="col-span-4 hidden lg:flex items-center justify-start space-x-3 whitespace-nowrap">
            <Link
              href="/diem-danh"
              className="bg-[#007A87] hover:bg-[#00606B] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm inline-block"
            >
              Điểm danh
            </Link>
            
            <Link
              href="/tra-cuu"
              className="bg-[#00707b] hover:bg-[#005a63] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors inline-block shadow-sm"
            >
              Cổng ĐRL
            </Link>

            {/* GIỚI THIỆU DROPDOWN (2 MỤC: ĐOÀN KHOA KTCK & LIÊN CHI HỘI KTCK) */}
            <div className="relative group py-2" ref={introDropdownRef}>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="hover:text-[#EE6425] transition-colors text-xs font-semibold pl-1">
                  Giới thiệu
                </span>
                <button
                  type="button"
                  onClick={() => setIsIntroOpen(!isIntroOpen)}
                  className="p-0.5 hover:text-[#EE6425] text-xs transition"
                >
                  ▾
                </button>
              </div>

              <div className={`absolute left-0 top-full w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700 transition-all ${
                isIntroOpen ? "block" : "hidden group-hover:block"
              }`}>
                <Link
                  href="/gioi-thieu?tab=doankhoa"
                  onClick={() => setIsIntroOpen(false)}
                  className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#EE6425] transition"
                >
                  Đoàn khoa KTCK
                </Link>
                <Link
                  href="/gioi-thieu?tab=lienchihoi"
                  onClick={() => setIsIntroOpen(false)}
                  className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#EE6425] transition border-t border-slate-50"
                >
                  Liên chi hội KTCK
                </Link>
              </div>
            </div>

            <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold">
              Chi đoàn / Chi hội
            </a>
          </div>

          {/* 2. LOGO NGANG CHUẨN Ở GIỮA */}
          <div className="col-span-12 lg:col-span-4 flex items-center justify-center py-1">
            <Link href="/">
              <img
                src="/logo-doankhoa.png"
                alt="Tuổi trẻ Khoa Kỹ thuật Cơ khí - Trường Đại học Kỹ thuật - Công nghệ Cần Thơ"
                className="h-10 sm:h-14 lg:h-16 w-auto max-w-[290px] sm:max-w-[420px] object-contain block mx-auto cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
          </div>

          {/* 3. MENU PHẢI (DESKTOP): HỖ TRỢ SINH VIÊN | VĂN PHÒNG ĐIỆN TỬ */}
          <div className="col-span-4 hidden lg:flex items-center justify-end space-x-4 whitespace-nowrap">
            <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold">
              Hỗ trợ sinh viên
            </a>
            
            <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold">
              Văn phòng điện tử
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full shadow-sm">
                <span className="text-xs font-bold text-[#EE6425]">
                  {currentUser.fullName || currentUser.mssv}
                </span>
                {(currentUser.role === "super_admin" || currentUser.role === "branch_admin" || currentUser.role === "admin") && (
                  <Link
                    href="/admin"
                    className="bg-[#007A87] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full hover:bg-[#005a63]"
                  >
                    Quản trị
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[11px] text-slate-400 hover:text-red-600 font-bold ml-1"
                >
                  (Đăng xuất)
                </button>
              </div>
            ) : (
              <Link
                href="/dang-nhap"
                className="bg-[#EE6425] hover:bg-[#d85216] text-white px-4 py-2 rounded-full text-xs font-bold transition-all inline-block shadow-md"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* MENU PHỤ BÊN DƯỚI */}
      <div className="bg-[#F8FCFC] border-t border-b border-[#E6F4F4]">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-10 py-2.5 text-[12.5px] sm:text-[13.5px] font-semibold text-[#007A87] overflow-x-auto whitespace-nowrap">
            <Link href="/dang-ky" className="hover:text-[#004A52] transition-colors font-bold text-[#EE6425]">
              Hoạt động – Sự kiện Cơ khí
            </Link>
            <a href="#" className="hover:text-[#004A52] transition-colors">Xem gì hôm nay</a>
            <a href="#" className="hover:text-[#004A52] transition-colors">Bản tin học thuật</a>
            <a href="#" className="hover:text-[#004A52] transition-colors">Mechanical Signal</a>
            <a href="#" className="hover:text-[#004A52] transition-colors">Gương sáng CTUT</a>
          </div>
        </div>
      </div>
    </header>
  );
}

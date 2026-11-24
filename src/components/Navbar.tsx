"use client";

import { siteImages } from "@/lib/site-images";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { endImageSession, changeUserPassword } from "@/app/dang-nhap/actions";

export default function Navbar() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State đổi mật khẩu
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassLoading, setChangePassLoading] = useState(false);
  const [changePassError, setChangePassError] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState("");

  const introDropdownRef = useRef<HTMLDivElement>(null);
  const branchDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

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
      if (branchDropdownRef.current && !branchDropdownRef.current.contains(e.target as Node)) {
        setIsBranchOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await endImageSession();
    await supabase.auth.signOut({ scope: "local" });
    localStorage.removeItem("ctut_current_user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePassError("");
    setChangePassSuccess("");

    if (!currentPassword.trim() || !newPassword.trim()) {
      setChangePassError("Vui lòng điền đầy đủ mật khẩu cũ và mật khẩu mới.");
      return;
    }
    if (newPassword.length < 4) {
      setChangePassError("Mật khẩu mới phải có tối thiểu 4 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePassError("Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }

    setChangePassLoading(true);
    try {
      const usernameOrMssv = currentUser.username || currentUser.mssv;
      const res = await changeUserPassword({
        usernameOrMssv,
        role: currentUser.role,
        currentPassword,
        newPassword,
      });

      if (res.error) {
        setChangePassError(res.error);
      } else {
        setChangePassSuccess(res.message || "Đổi mật khẩu thành công!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          setIsChangePasswordOpen(false);
          setChangePassSuccess("");
        }, 2000);
      }
    } catch (err: any) {
      setChangePassError("Đã có lỗi xảy ra: " + (err.message || "Vui lòng thử lại"));
    } finally {
      setChangePassLoading(false);
    }
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

            {/* GIỚI THIỆU DROPDOWN */}
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

            {/* CHI ĐOÀN / CHI HỘI DROPDOWN */}
            <div className="relative group py-2" ref={branchDropdownRef}>
              <div className="flex items-center gap-1 cursor-pointer">
                <span className="hover:text-[#EE6425] transition-colors text-xs font-semibold">
                  Chi đoàn / Chi hội
                </span>
                <button
                  type="button"
                  onClick={() => setIsBranchOpen(!isBranchOpen)}
                  className="p-0.5 hover:text-[#EE6425] text-xs transition"
                >
                  ▾
                </button>
              </div>

              <div className={`absolute left-0 top-full w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700 transition-all ${
                isBranchOpen ? "block" : "hidden group-hover:block"
              }`}>
                <Link
                  href="/tra-cuu-thong-tin"
                  onClick={() => setIsBranchOpen(false)}
                  className="block px-4 py-3 hover:bg-orange-50 hover:text-[#EE6425] transition text-blue-700 font-bold"
                >
                  Tra cứu thông tin sinh viên
                </Link>
              </div>
            </div>
          </div>

          {/* 2. LOGO NGANG CHUẨN Ở GIỮA */}
          <div className="col-span-12 lg:col-span-4 relative flex items-center justify-center py-1">
            <Link href="/">
              <img
                src={siteImages.logo}
                alt="Tuổi trẻ Khoa Kỹ thuật Cơ khí - Trường Đại học Kỹ thuật - Công nghệ Cần Thơ"
                className="h-10 sm:h-14 lg:h-16 w-auto max-w-[min(72vw,290px)] sm:max-w-[420px] object-contain block mx-auto cursor-pointer transition-transform hover:scale-105"
              />
            </Link>
            <button
              type="button"
              aria-label={isMobileMenuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="absolute right-0 top-1/2 -translate-y-1/2 lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-[#004A52] shadow-xs transition hover:bg-slate-50 active:scale-95"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* 3. MENU PHẢI (DESKTOP): HỖ TRỢ SINH VIÊN | VĂN PHÒNG ĐIỆN TỬ | USER AVATAR */}
          <div className="col-span-4 hidden lg:flex items-center justify-end space-x-3.5 whitespace-nowrap">
            <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold text-slate-600">
              Hỗ trợ sinh viên
            </a>
            
            <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold text-slate-600">
              Văn phòng điện tử
            </a>

            {currentUser ? (
              /* NÚT AVATAR GỌN GÀNG (CHỈ CÒN AVATAR LOGO KHOA CƠ KHÍ) */
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-0.5 rounded-full border-2 border-orange-200 hover:border-[#EE6425] transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-xs bg-white block flex-shrink-0"
                  title={currentUser.fullName || currentUser.mssv}
                >
                  <img
                    src="/avatar-fme.jpg"
                    alt="Avatar"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover block"
                  />
                </button>

                {/* POPUP DROPDOWN KHI BẤM VÀO AVATAR (GỌN GÀNG, KHÔNG DÙNG ICON) */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-3 px-3.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    {/* THÔNG TIN TÀI KHOẢN */}
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <img
                        src="/avatar-fme.jpg"
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-orange-200 shadow-2xs flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-extrabold text-slate-900 text-xs truncate leading-snug">
                          {currentUser.fullName || currentUser.mssv}
                        </h4>
                        <p className="text-[11px] text-[#007A87] font-semibold truncate mt-0.5">
                          {currentUser.studentClass || "Khoa Kỹ thuật Cơ khí"}
                        </p>
                        <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-[#EE6425] mt-1">
                          {currentUser.role === "super_admin"
                            ? "Admin Tối Cao"
                            : currentUser.role === "branch_admin"
                            ? "Cán bộ Chi đoàn"
                            : "Đoàn viên sinh viên"}
                        </span>
                      </div>
                    </div>

                    {/* DANH SÁCH CHỨC NĂNG (GỌN GÀNG, KHÔNG DÙNG ICON) */}
                    <div className="py-1.5 space-y-0.5">
                      {(currentUser.role === "super_admin" || currentUser.role === "admin") && (
                        <Link
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-3 py-2 rounded-xl text-slate-700 hover:text-[#007A87] hover:bg-slate-50 font-bold transition-colors"
                        >
                          Trang Quản trị Hệ thống
                        </Link>
                      )}

                      {currentUser.role === "branch_admin" && (
                        <Link
                          href="/admin/chi-doan"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-3 py-2 rounded-xl text-slate-700 hover:text-[#007A87] hover:bg-slate-50 font-bold transition-colors"
                        >
                          Quản trị Chi đoàn
                        </Link>
                      )}

                      {/* NÚT ĐỔI MẬT KHẨU */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsChangePasswordOpen(true);
                          setChangePassError("");
                          setChangePassSuccess("");
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:text-[#EE6425] hover:bg-orange-50/70 font-bold transition-colors cursor-pointer"
                      >
                        Đổi mật khẩu
                      </button>
                    </div>

                    {/* NÚT ĐĂNG XUẤT */}
                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-center py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition cursor-pointer"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
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

      {/* MODAL POPUP ĐỔI MẬT KHẨU */}
      {isMobileMenuOpen && (
        <nav aria-label="Điều hướng chính trên điện thoại" className="lg:hidden border-t border-slate-100 px-3 py-3 sm:px-6">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold">
            {[
              ["/diem-danh", "Điểm danh"],
              ["/tra-cuu", "Cổng ĐRL"],
              ["/tra-cuu-thong-tin", "Tra cứu sinh viên"],
              ["/dang-ky", "Hoạt động – sự kiện"],
              ["/gioi-thieu", "Giới thiệu"],
            ].map(([href, label]) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-2 text-[#23545A] transition hover:border-teal-200 hover:bg-teal-50"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 text-xs">
            {currentUser ? (
              <>
                <p className="truncate font-semibold text-slate-600">{currentUser.fullName || currentUser.mssv}</p>
                <div className="flex gap-2">
                  <Link
                    href={currentUser.role === "branch_admin" ? "/admin/chi-doan" : currentUser.role === "super_admin" || currentUser.role === "admin" ? "/admin" : "/tra-cuu"}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex min-h-11 flex-1 items-center justify-center rounded-xl bg-[#004A52] px-3 py-2 font-bold text-white"
                  >
                    {currentUser.role === "branch_admin" || currentUser.role === "super_admin" || currentUser.role === "admin" ? "Trang quản lý" : "Cổng ĐRL"}
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsChangePasswordOpen(true);
                      setChangePassError("");
                      setChangePassSuccess("");
                    }}
                    className="min-h-11 flex-1 rounded-xl border border-slate-200 px-3 py-2 font-bold text-slate-700"
                  >
                    Đổi mật khẩu
                  </button>
                  <button type="button" onClick={handleLogout} className="min-h-11 rounded-xl bg-red-50 px-3 py-2 font-bold text-red-600">
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/dang-nhap"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex min-h-11 items-center justify-center rounded-xl bg-[#EE6425] px-4 py-2 font-bold text-white shadow-sm"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </nav>
      )}

      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/60">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                Đổi mật khẩu tài khoản
              </h3>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="text-slate-400 hover:text-slate-600 w-7 h-7 rounded-full hover:bg-slate-200/60 flex items-center justify-center text-base font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* MODAL BODY */}
            <form onSubmit={handleChangePasswordSubmit} className="p-5 space-y-3.5 text-xs">
              {changePassError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl font-medium">
                  {changePassError}
                </div>
              )}

              {changePassSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium">
                  {changePassSuccess}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mật khẩu hiện tại:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu đang dùng..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#EE6425] transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập mật khẩu mới (tối thiểu 4 ký tự)..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#EE6425] transition"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Xác nhận mật khẩu mới:
                </label>
                <input
                  type="password"
                  required
                  placeholder="Nhập lại mật khẩu mới..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-[#EE6425] transition"
                />
              </div>

              {/* MODAL FOOTER */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={changePassLoading}
                  className="bg-[#EE6425] hover:bg-[#d85216] text-white px-5 py-2 rounded-xl font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {changePassLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENU PHỤ BÊN DƯỚI */}
      <div className="bg-[#F8FCFC] border-t border-b border-[#E6F4F4]">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-10 py-2.5 text-[12.5px] sm:text-[13.5px] font-semibold text-[#007A87] overflow-x-auto whitespace-nowrap">
            <Link href="/dang-ky" className="hover:text-[#004A52] transition-colors font-bold text-[#EE6425]">
              Hoạt động – Sự kiện
            </Link>
            <Link href="/?category=Xem%20g%C3%AC%20h%C3%B4m%20nay#doc-gi-hom-nay" className="hover:text-[#004A52] transition-colors">
              Xem gì hôm nay
            </Link>
            <Link href="/?category=B%E1%BA%A3n%20tin%20h%E1%BB%8Dc%20thu%E1%BA%ADt#doc-gi-hom-nay" className="hover:text-[#004A52] transition-colors">
              Bản tin học thuật
            </Link>
            <Link href="/?category=G%C6%B0%C6%A1ng%20s%C3%A1ng%20FME#doc-gi-hom-nay" className="hover:text-[#004A52] transition-colors">
              Gương sáng FME
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

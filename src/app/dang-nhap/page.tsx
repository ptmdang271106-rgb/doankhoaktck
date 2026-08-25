"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mssv, setMssv] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/";

  // Kiểm tra đuôi email trường (ví dụ: @ctut.edu.vn hoặc @sv.ctut.edu.vn)
  const validateSchoolEmail = (mail: string) => {
    return mail.endsWith("@ctut.edu.vn") || mail.endsWith("@sv.ctut.edu.vn");
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateSchoolEmail(email)) {
      setErrorMessage("Vui lòng sử dụng đúng định dạng Email sinh viên trường (@sv.ctut.edu.vn hoặc @ctut.edu.vn)!");
      return;
    }

    if (isLoginTab) {
      // Giả lập xử lý Đăng nhập thành công
      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1200);
    } else {
      // Giả lập Đăng ký tài khoản mới thành công
      setSuccessMessage("Tạo tài khoản sinh viên thành công! Vui lòng chuyển sang tab Đăng nhập.");
      setIsLoginTab(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sm:p-8">
        
        {/* LOGO & TIÊU ĐỀ */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <Image
              src="/logodk.png"
              alt="Logo Khoa Cơ khí"
              width={64}
              height={64}
              className="mx-auto h-16 w-auto object-contain"
              priority
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight">
            CỔNG DỊCH VỤ SINH VIÊN
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Đoàn Khoa Kỹ thuật Cơ khí - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ
          </p>
        </div>

        {/* CHUYỂN ĐỔI TAB ĐĂNG NHẬP / ĐĂNG KÝ */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-6 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => { setIsLoginTab(true); setErrorMessage(""); setSuccessMessage(""); }}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              isLoginTab
                ? "bg-white text-[#EE6425] shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginTab(false); setErrorMessage(""); setSuccessMessage(""); }}
            className={`flex-1 py-2.5 rounded-lg transition-all ${
              !isLoginTab
                ? "bg-white text-[#EE6425] shadow-sm font-extrabold"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Tạo tài khoản mới
          </button>
        </div>

        {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            ⚠️ {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl font-medium">
            ✓ {successMessage}
          </div>
        )}

        {/* FORM ĐĂNG NHẬP / ĐĂNG KÝ */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          {!isLoginTab && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    MSSV *
                  </label>
                  <input
                    type="text"
                    required
                    value={mssv}
                    onChange={(e) => setMssv(e.target.value)}
                    placeholder="2200101"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Lớp sinh hoạt *
                  </label>
                  <input
                    type="text"
                    required
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    placeholder="CK22A1"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email trường CTUT (@sv.ctut.edu.vn) *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mssv@sv.ctut.edu.vn"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Mật khẩu *
              </label>
              {isLoginTab && (
                <a href="#" className="text-[11px] text-[#EE6425] hover:underline font-semibold">
                  Quên mật khẩu?
                </a>
              )}
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-extrabold py-3 rounded-xl transition shadow-md uppercase tracking-wider text-xs sm:text-sm mt-2 active:scale-95"
          >
            {isLoginTab ? "Đăng nhập hệ thống" : "Tạo tài khoản sinh viên"}
          </button>
        </form>

        {/* NÚT ĐĂNG NHẬP NHANH BẰNG GOOGLE MAIL TRƯỜNG */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400 font-medium mb-3">Hoặc đăng nhập nhanh bằng</p>
          <button
            type="button"
            onClick={() => alert("Đang kết nối cổng OAuth2 Email CTUT...")}
            className="w-full flex items-center justify-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-bold text-xs transition"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Email Sinh viên CTUT (@ctut.edu.vn)
          </button>
        </div>

      </div>
    </main>
  );
}

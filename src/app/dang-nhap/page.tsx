"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

function AuthForm() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mssv, setMssv] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!mssv.trim()) {
      setErrorMessage("Vui lòng nhập Mã số sinh viên (MSSV)!");
      return;
    }

    if (isLoginTab) {
      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } else {
      setSuccessMessage("Đăng ký tài khoản thành công! Vui lòng chuyển sang tab Đăng nhập.");
      setIsLoginTab(true);
    }
  };

  const handleGoogleLogin = () => {
    setSuccessMessage("Đang kết nối tài khoản Google CTUT...");
    setTimeout(() => {
      router.push(redirectUrl);
    }, 1200);
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-8">
      {/* LOGO & TIÊU ĐỀ */}
      <div className="text-center mb-6">
  <Link href="/" className="inline-block mb-4">
    <img
      src="/logo-doankhoa.png"
      alt="Tuổi trẻ Khoa Kỹ thuật Cơ khí CTUT"
      className="h-12 sm:h-14 w-auto max-w-[280px] sm:max-w-[320px] object-contain mx-auto"
    />
  </Link>
  <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#004A52] tracking-tight">
    CỔNG DỊCH VỤ SINH VIÊN
  </h1>
</div>

      {/* CHUYỂN TABS */}
      <div className="flex bg-slate-100/80 p-1 rounded-2xl mb-6 text-xs sm:text-sm font-bold">
        <button
          type="button"
          onClick={() => { setIsLoginTab(true); setErrorMessage(""); setSuccessMessage(""); }}
          className={`flex-1 py-2.5 rounded-xl transition-all ${
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
          className={`flex-1 py-2.5 rounded-xl transition-all ${
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

      {/* FORM NHẬP THÔNG TIN */}
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {!isLoginTab && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lớp *</label>
              <input
                type="text"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="CK22A1"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mã số sinh viên (MSSV) *
          </label>
          <input
            type="text"
            required
            value={mssv}
            onChange={(e) => setMssv(e.target.value)}
            placeholder="Nhập MSSV (VD: 2200101)"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Mật khẩu *</label>
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
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425] focus:ring-1 focus:ring-[#EE6425]"
          />
        </div>

        {/* NÚT ĐĂNG NHẬP / ĐĂNG KÝ HỆ THỐNG */}
        <button
          type="submit"
          className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-extrabold py-3.5 rounded-2xl transition shadow-md hover:shadow-lg uppercase tracking-wider text-sm active:scale-[0.98]"
        >
          {isLoginTab ? "ĐĂNG NHẬP HỆ THỐNG" : "TẠO TÀI KHOẢN SINH VIÊN"}
        </button>
      </form>

      {/* ĐƯỜNG KẺ PHÂN CÁCH */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">
          HOẶC
        </span>
      </div>

      {/* NÚT ĐĂNG NHẬP GOOGLE */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 rounded-2xl transition shadow-sm active:scale-[0.98] text-sm"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Đăng nhập với Google CTUT</span>
      </button>

      <p className="text-center text-[11px] text-slate-400 mt-4">
        Dành riêng cho đoàn viên & sinh viên Khoa Kỹ thuật Cơ khí CTUT
      </p>
    </div>
  );
}

export default function DangNhapPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm font-bold text-slate-500">Đang tải...</div>}>
        <AuthForm />
      </Suspense>
    </main>
  );
}

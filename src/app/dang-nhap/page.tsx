"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

function AuthForm() {
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
      setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    } else {
      setSuccessMessage("Tạo tài khoản sinh viên thành công! Vui lòng chuyển sang tab Đăng nhập.");
      setIsLoginTab(true);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-orange-100 p-6 sm:p-8">
      {/* LOGO */}
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
          Đoàn Khoa Kỹ thuật Cơ khí CTUT
        </p>
      </div>

      {/* TABS */}
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
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">MSSV *</label>
                <input
                  type="text"
                  required
                  value={mssv}
                  onChange={(e) => setMssv(e.target.value)}
                  placeholder="2200101"
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425]"
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
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425]"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Email trường (@sv.ctut.edu.vn) *</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="mssv@sv.ctut.edu.vn"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425]"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu *</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-[#EE6425]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-extrabold py-3 rounded-xl transition shadow-md uppercase tracking-wider text-xs sm:text-sm mt-2"
        >
          {isLoginTab ? "Đăng nhập hệ thống" : "Tạo tài khoản sinh viên"}
        </button>
      </form>
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

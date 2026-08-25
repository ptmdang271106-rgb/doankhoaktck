"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanUser = username.trim().toUpperCase();
    const cleanPass = password.trim();

    // 1. Kiem tra tai khoan Admin dac quyen
    if (
      (cleanUser === "ADMIN" && cleanPass === "ADMIN123") ||
      (cleanUser === "CNDT2411081" && cleanPass === "081")
    ) {
      const adminUser = {
        mssv: cleanUser,
        fullName: "Ban Chấp hành Đoàn Khoa",
        studentClass: "Ban Quản trị",
        role: "admin",
      };
      localStorage.setItem("ctut_current_user", JSON.stringify(adminUser));
      setLoading(false);
      router.push(redirectUrl === "/" ? "/admin" : redirectUrl);
      return;
    }

    // 2. Kiem tra tai khoan Sinh vien tren Supabase Cloud
    try {
      const { data: studentData, error } = await supabase
        .from("students")
        .select("*")
        .eq("mssv", cleanUser)
        .single();

      if (error || !studentData) {
        setLoading(false);
        setErrorMsg("Mã số sinh viên không tồn tại trên hệ thống hoặc chưa được cấp quyền.");
        return;
      }

      // Kiem tra mat khau
      const expectedPassword = studentData.password || cleanUser.slice(-3);
      if (cleanPass !== expectedPassword && cleanPass !== cleanUser.slice(-3)) {
        setLoading(false);
        setErrorMsg("Mật khẩu không chính xác. Mật khẩu mặc định là 3 số cuối MSSV.");
        return;
      }

      // Dang nhap thanh cong
      const loggedInStudent = {
        mssv: studentData.mssv,
        fullName: studentData.full_name,
        studentClass: studentData.student_class,
        email: studentData.email,
        role: "student",
      };

      localStorage.setItem("ctut_current_user", JSON.stringify(loggedInStudent));
      setLoading(false);
      router.push(redirectUrl);
    } catch (err: any) {
      setLoading(false);
      setErrorMsg("Lỗi kết nối cơ sở dữ liệu: " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium leading-relaxed">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Mã số sinh viên (MSSV) *
        </label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="VD: CNDT2411081"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-mono uppercase outline-none focus:border-[#EE6425]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Mật khẩu *
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu (Mặc định: 3 số cuối MSSV)"
          className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#EE6425]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow tracking-wider disabled:bg-slate-300"
      >
        {loading ? "Đang xác thực dữ liệu..." : "Đăng nhập ngay"}
      </button>
    </form>
  );
}

export default function DangNhapPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        
        {/* LOGO VA TIEU DE */}
        <div className="text-center mb-6">
          <Link href="/">
            <img
              src="/logo-doankhoa.png"
              alt="Logo Đoàn Khoa Cơ Khí"
              className="h-14 mx-auto object-contain mb-3 cursor-pointer"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight">
            ĐĂNG NHẬP HỆ THỐNG
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đoàn Khoa Kỹ thuật Cơ khí - CTUET
          </p>
        </div>

        {/* BOC SUSPENSE CHO USE SEARCH PARAMS */}
        <Suspense fallback={<div className="text-center text-xs text-slate-400 py-4">Đang tải trang đăng nhập...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-[#007A87]">
          <Link href="/" className="hover:underline">Về trang chủ</Link>
          <Link href="/tra-cuu" className="hover:underline">Cổng ĐRL</Link>
        </div>
      </div>
    </main>
  );
}

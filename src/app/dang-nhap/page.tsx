"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Client ID chính thức của bạn
const GOOGLE_CLIENT_ID = "1023546806919-3mfg408bq7g9dca8kuc24nqvc40f9ueb.apps.googleusercontent.com";

function AuthForm() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [accountInput, setAccountInput] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/";

  // XỬ LÝ KHI GOOGLE TRẢ TÀI KHOẢN VỀ: ĐỐI CHIẾU DANH SÁCH ADMIN
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.includes("access_token")) {
        const token = new URLSearchParams(hash.replace("#", "?")).get("access_token");
        if (token) {
          fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${token}` },
          })
            .then((res) => res.json())
            .then((googleUser) => {
              const userEmail = (googleUser.email || "").toLowerCase().trim();

              // 1. LẤY DANH SÁCH SINH VIÊN DO ADMIN KHOA QUẢN LÝ
              const storedStudents = JSON.parse(localStorage.getItem("ctut_student_accounts") || "[]");

              // 2. TÌM KIẾM XEM EMAIL NÀY CÓ ĐƯỢC ADMIN CẤP QUYỀN KHÔNG
              const matchedStudent = storedStudents.find((s: any) => {
                const sEmail = (s.email || "").toLowerCase().trim();
                const sMssv = (s.mssv || "").toLowerCase().trim();
                return sEmail === userEmail || userEmail.includes(sMssv);
              });

              // 3. NẾU CÓ TRONG DANH SÁCH KHOA -> CHO PHÉP VÀO
              if (matchedStudent) {
                const currentUser = {
                  mssv: matchedStudent.mssv,
                  fullName: matchedStudent.fullName,
                  studentClass: matchedStudent.studentClass,
                  email: matchedStudent.email || userEmail,
                  avatar: googleUser.picture,
                  role: "student",
                };
                localStorage.setItem("ctut_current_user", JSON.stringify(currentUser));
                setSuccessMessage(`Đăng nhập thành công: ${matchedStudent.fullName} (${matchedStudent.studentClass})`);
                setTimeout(() => router.push(redirectUrl), 1000);
              } else {
                // NẾU KHÔNG CÓ TRONG DANH SÁCH (Khoa khác hoặc đã nghỉ học) -> CHẶN LẠI
                setErrorMessage(
                  `Email (${userEmail}) không thuộc danh sách đoàn viên/sinh viên Khoa Kỹ thuật Cơ khí! Vui lòng liên hệ Ban Chấp hành Đoàn Khoa để được cấp quyền.`
                );
              }
            })
            .catch(() => {
              setErrorMessage("Xác thực Google thất bại, vui lòng thử lại!");
            });
        }
      }
    }
  }, [redirectUrl, router]);

  // CHUYỂN HƯỚNG SANG GOOGLE SSO TRƯỜNG
  const handleGoogleSSOLogin = () => {
    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/dang-nhap` : "";

    const googleAuthUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=openid%20email%20profile` +
      `&hd=student.ctuet.edu.vn` +
      `&prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  // ĐĂNG NHẬP BẰNG MSSV + MẬT KHẨU
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const inputVal = accountInput.trim().toLowerCase();

    // 1. Kiểm tra tài khoản Admin
    if (inputVal === "admin" && password === "admin@ctut2026") {
      const adminUser = {
        mssv: "admin",
        fullName: "Ban Quản Trị (Admin)",
        role: "admin",
      };
      localStorage.setItem("ctut_current_user", JSON.stringify(adminUser));
      setSuccessMessage("Đăng nhập Admin thành công!");
      setTimeout(() => router.push("/admin"), 1000);
      return;
    }

    // 2. Kiểm tra tài khoản sinh viên trong danh sách Admin
    const storedStudents = JSON.parse(localStorage.getItem("ctut_student_accounts") || "[]");
    const foundStudent = storedStudents.find((s: any) => {
      const sMssv = (s.mssv || "").toLowerCase().trim();
      const sEmail = (s.email || "").toLowerCase().trim();
      const validPass = s.password || sMssv.slice(-3);
      return (sMssv === inputVal || sEmail === inputVal) && password === validPass;
    });

    if (foundStudent) {
      localStorage.setItem("ctut_current_user", JSON.stringify(foundStudent));
      setSuccessMessage(`Xin chào ${foundStudent.fullName}! Đang chuyển hướng...`);
      setTimeout(() => router.push(redirectUrl), 1000);
    } else {
      setErrorMessage(
        "Tài khoản không tồn tại trong danh sách Khoa Cơ khí hoặc mật khẩu không đúng! (Mật khẩu mặc định: 3 số cuối MSSV)."
      );
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-orange-100 p-6 sm:p-8">
      {/* LOGO */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-block mb-3">
          <img
            src="/logo-doankhoa.png"
            alt="Tuổi trẻ Khoa Kỹ thuật Cơ khí CTUT"
            className="h-12 sm:h-14 w-auto max-w-[280px] sm:max-w-[320px] object-contain mx-auto"
          />
        </Link>
        <h1 className="text-2xl sm:text-[26px] font-black text-[#004A52] tracking-tight">
          CỔNG DỊCH VỤ SINH VIÊN
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">Dành riêng cho sinh viên Khoa Kỹ thuật Cơ khí</p>
      </div>

      {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
      {errorMessage && (
        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium leading-relaxed">
          ⚠️ {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-2xl font-medium">
          ✓ {successMessage}
        </div>
      )}

      {/* ĐĂNG NHẬP BẰNG GOOGLE CTUET (CÓ ĐỐI CHIẾU ADMIN) */}
      <button
        type="button"
        onClick={handleGoogleSSOLogin}
        className="w-full flex items-center justify-center gap-3 border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition shadow-sm active:scale-[0.98] text-sm"
      >
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Đăng nhập với Google CTUT</span>
      </button>

      {/* PHÂN CÁCH */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">
          HOẶC DÙNG MẬT KHẨU
        </span>
      </div>

      {/* FORM NHẬP TRỰC TIẾP */}
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Email sinh viên hoặc Mã số sinh viên (MSSV) *
          </label>
          <input
            type="text"
            required
            value={accountInput}
            onChange={(e) => setAccountInput(e.target.value)}
            placeholder="VD: CNDT2411081 hoặc admin"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Mật khẩu *</label>
            <span className="text-[11px] text-slate-400 font-medium">
              (Mặc định: 3 số cuối MSSV)
            </span>
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-extrabold py-3.5 rounded-2xl transition shadow-md hover:shadow-lg uppercase tracking-wider text-sm active:scale-[0.98]"
        >
          ĐĂNG NHẬP HỆ THỐNG
        </button>
      </form>

      <div className="mt-5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1">
        <p>🔒 <strong>Kiểm duyệt bảo mật:</strong> Chỉ tài khoản sinh viên có tên trong danh sách do Đoàn Khoa quản lý mới có thể đăng nhập.</p>
        <p>🔑 <strong>Tài khoản Admin:</strong> <code>admin</code> / Mật khẩu: <code>admin@ctut2026</code></p>
      </div>
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

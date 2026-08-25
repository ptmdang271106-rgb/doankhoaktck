"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// Mã Google Client ID chính thức của bạn
const GOOGLE_CLIENT_ID = "1023546806919-3mfg408bq7g9dca8kuc24nqvc40f9ueb.apps.googleusercontent.com";

function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();
}

function generateCtuetEmail(fullName: string, mssv: string): string {
  if (!fullName || !mssv) return "";
  const cleanName = removeVietnameseTones(fullName).toLowerCase();
  const cleanMssv = mssv.trim().toLowerCase();
  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return `${parts[0]}${cleanMssv}@student.ctuet.edu.vn`;

  const initials = parts.slice(0, -1).map((p) => p[0]).join("");
  const lastName = parts[parts.length - 1];

  return `${initials}${lastName}${cleanMssv}@student.ctuet.edu.vn`;
}

function AuthForm() {
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [accountInput, setAccountInput] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const searchParams = useSearchParams();
  const router = useRouter();
  const redirectUrl = searchParams.get("redirect") || "/";

  // Bắt Access Token trả về từ Google sau khi đăng nhập thành công
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
              if (
                googleUser.email.endsWith("@student.ctuet.edu.vn") ||
                googleUser.email.endsWith("@ctuet.edu.vn") ||
                googleUser.email.endsWith("@ctut.edu.vn")
              ) {
                const user = {
                  mssv: googleUser.email.split("@")[0].toUpperCase(),
                  fullName: googleUser.name,
                  email: googleUser.email,
                  avatar: googleUser.picture,
                  role: "student",
                };
                localStorage.setItem("ctut_current_user", JSON.stringify(user));
                setSuccessMessage(`Đăng nhập Google thành công: ${googleUser.email}`);
                setTimeout(() => router.push(redirectUrl), 1000);
              } else {
                setErrorMessage("Vui lòng sử dụng đúng Email do trường cấp (@student.ctuet.edu.vn)!");
              }
            })
            .catch(() => {
              setErrorMessage("Xác thực Google thất bại, vui lòng thử lại!");
            });
        }
      }
    }
  }, [redirectUrl, router]);

  // BẬT TRANG ĐĂNG NHẬP GOOGLE SSO CTUET
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

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const inputVal = accountInput.trim().toLowerCase();

    if (isLoginTab) {
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

      const storedStudents = JSON.parse(localStorage.getItem("ctut_student_accounts") || "[]");
      const foundStudent = storedStudents.find((s: any) => {
        const sMssv = (s.mssv || "").toLowerCase();
        const sEmail = (s.email || "").toLowerCase();
        return (sMssv === inputVal || sEmail === inputVal) && (s.password === password || password === sMssv.slice(-3));
      });

      if (foundStudent) {
        localStorage.setItem("ctut_current_user", JSON.stringify(foundStudent));
        setSuccessMessage(`Xin chào ${foundStudent.fullName}! Đang chuyển hướng...`);
        setTimeout(() => router.push(redirectUrl), 1000);
      } else {
        if (inputVal.endsWith("@student.ctuet.edu.vn") || inputVal.startsWith("cndt") || inputVal.length >= 7) {
          const defaultUser = {
            mssv: inputVal.replace("@student.ctuet.edu.vn", "").toUpperCase(),
            fullName: `Sinh viên CTUET`,
            email: inputVal.includes("@") ? inputVal : `${inputVal}@student.ctuet.edu.vn`,
            role: "student",
          };
          localStorage.setItem("ctut_current_user", JSON.stringify(defaultUser));
          setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
          setTimeout(() => router.push(redirectUrl), 1000);
        } else {
          setErrorMessage("Tài khoản hoặc mật khẩu không chính xác! (Mật khẩu mặc định: 3 số cuối MSSV).");
        }
      }
    } else {
      const storedStudents = JSON.parse(localStorage.getItem("ctut_student_accounts") || "[]");
      const cleanMssv = accountInput.trim().toUpperCase();

      if (storedStudents.some((s: any) => s.mssv.toUpperCase() === cleanMssv)) {
        setErrorMessage("MSSV này đã tồn tại trong hệ thống!");
        return;
      }

      const autoEmail = generateCtuetEmail(fullName, cleanMssv);
      const newStudent = {
        mssv: cleanMssv,
        fullName: fullName.trim(),
        email: autoEmail,
        studentClass: studentClass.trim(),
        password: password,
        role: "student",
        createdAt: new Date().toLocaleDateString("vi-VN"),
      };

      storedStudents.push(newStudent);
      localStorage.setItem("ctut_student_accounts", JSON.stringify(storedStudents));
      setSuccessMessage("Đăng ký thành công! Vui lòng đăng nhập.");
      setIsLoginTab(true);
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
      </div>

      {/* TABS */}
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

      {/* THÔNG BÁO */}
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

      {/* FORM NHẬP */}
      <form onSubmit={handleAuthSubmit} className="space-y-4">
        {!isLoginTab && (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên (có dấu) *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Phạm Thái Minh Đăng"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Lớp *</label>
              <input
                type="text"
                required
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                placeholder="CNKT Tự động hóa K2024"
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425]"
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {isLoginTab ? "Email trường hoặc Mã số sinh viên (MSSV) *" : "Mã số sinh viên (MSSV) *"}
          </label>
          <input
            type="text"
            required
            value={accountInput}
            onChange={(e) => setAccountInput(e.target.value)}
            placeholder={
              isLoginTab
                ? "VD: CNDT2411081 hoặc ptmdangcndt2411081@student.ctuet.edu.vn"
                : "VD: CNDT2411081"
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#EE6425]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-bold text-slate-700">Mật khẩu *</label>
            {isLoginTab && (
              <span className="text-[11px] text-slate-400 font-medium">
                (Mặc định: 3 số cuối MSSV)
              </span>
            )}
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
          {isLoginTab ? "ĐĂNG NHẬP HỆ THỐNG" : "TẠO TÀI KHOẢN SINH VIÊN"}
        </button>
      </form>

      {/* PHÂN CÁCH */}
      <div className="relative my-6 flex items-center justify-center">
        <div className="border-t border-slate-200 w-full"></div>
        <span className="bg-white px-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider absolute">
          HOẶC
        </span>
      </div>

      {/* NÚT GOOGLE SSO */}
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
        <span>Đăng nhập với Google CTUET</span>
      </button>

      <div className="mt-5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-500 space-y-1">
        <p>🔑 <strong>Tài khoản Admin:</strong> <code>admin</code> / Mật khẩu: <code>admin@ctut2026</code></p>
        <p>🎓 <strong>Tài khoản Sinh viên:</strong> Nhập Email trường hoặc MSSV / Mật khẩu: <strong>3 số cuối MSSV</strong></p>
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

"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [loginRole, setLoginRole] = useState<"student" | "admin">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Xu ly callback khi dang nhap Google thanh cong tro ve
  useEffect(() => {
    const handleGoogleAuthCallback = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user?.email) {
        const userEmail = data.user.email.toLowerCase();

        // Kiem tra duoi email truong hoac tai khoan duoc phep
        if (!userEmail.endsWith("@student.ctuet.edu.vn") && !userEmail.endsWith("@ctuet.edu.vn") && !userEmail.includes("gmail.com")) {
          setErrorMsg("Vui lòng sử dụng tài khoản email sinh viên CTUT (@student.ctuet.edu.vn).");
          return;
        }

        const fullName = data.user.user_metadata?.full_name || data.user.user_metadata?.name || userEmail.split("@")[0];
        
        // Trich xuat MSSV neu co trong email (VD: nhbchaucndt2411026 -> CNDT2411026)
        const match = userEmail.match(/(cndt|ck|tdh|cd)\d+/i);
        const mssv = match ? match[0].toUpperCase() : userEmail.split("@")[0].toUpperCase();

        const loggedInUser = {
          mssv: mssv,
          fullName: fullName,
          studentClass: "Khoa Kỹ thuật Cơ khí",
          email: userEmail,
          role: "student",
        };

        // Tu dong dong bo thong tin vao bang students tren Supabase
        await supabase.from("students").upsert([
          {
            mssv: loggedInUser.mssv,
            full_name: loggedInUser.fullName,
            email: loggedInUser.email,
            student_class: loggedInUser.studentClass,
            password: loggedInUser.mssv.slice(-3),
          },
        ], { onConflict: "mssv" });

        localStorage.setItem("ctut_current_user", JSON.stringify(loggedInUser));
        router.push(redirectUrl);
      }
    };

    handleGoogleAuthCallback();
  }, [redirectUrl, router]);

  // Dang nhap bang Google OAuth
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dang-nhap?redirect=" + encodeURIComponent(redirectUrl),
      },
    });
    if (error) {
      setErrorMsg("Lỗi xác thực Google: " + error.message);
      setLoading(false);
    }
  };

  // Dang nhap bang MSSV / Tai khoan Admin
  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanUser = username.trim().toUpperCase();
    const cleanPass = password.trim();

    // 1. Phân quyền Admin
    if (loginRole === "admin") {
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
        router.push("/admin");
        return;
      } else {
        setLoading(false);
        setErrorMsg("Tài khoản hoặc mật khẩu Quản trị viên không chính xác.");
        return;
      }
    }

    // 2. Phân quyền Sinh viên
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

      const expectedPassword = studentData.password || cleanUser.slice(-3);
      if (cleanPass !== expectedPassword && cleanPass !== cleanUser.slice(-3)) {
        setLoading(false);
        setErrorMsg("Mật khẩu không chính xác. Mật khẩu mặc định là 3 số cuối MSSV.");
        return;
      }

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
    <div className="space-y-4">
      {/* TAB CHON VAI TRO: SINH VIEN / QUAN TRI VIEN */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setLoginRole("student");
            setErrorMsg("");
          }}
          className={`py-2 rounded-xl transition ${
            loginRole === "student" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sinh viên
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginRole("admin");
            setErrorMsg("");
          }}
          className={`py-2 rounded-xl transition ${
            loginRole === "admin" ? "bg-[#004A52] text-white shadow" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Quản trị viên
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium leading-relaxed">
          {errorMsg}
        </div>
      )}

      {/* DANG NHAP GOOGLE (CHO SINH VIEN) */}
      {loginRole === "student" && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300 transition text-xs flex items-center justify-center gap-2 shadow-xs"
          >
            Đăng nhập bằng tài khoản Google (@student.ctuet.edu.vn)
          </button>

          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">Hoặc dùng MSSV</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>
      )}

      {/* FORM NHAP TAI KHOAN VA MAT KHAU */}
      <form onSubmit={handleAccountLogin} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {loginRole === "admin" ? "Tên tài khoản Quản trị *" : "Mã số sinh viên (MSSV) *"}
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={loginRole === "admin" ? "Nhập tên tài khoản quản trị" : "VD: CNDT2411081"}
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
            placeholder={loginRole === "admin" ? "Mật khẩu quản trị viên" : "Mật khẩu (Mặc định: 3 số cuối MSSV)"}
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#EE6425]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow tracking-wider disabled:bg-slate-300 ${
            loginRole === "admin" ? "bg-[#004A52] hover:bg-[#00343a]" : "bg-[#EE6425] hover:bg-[#d85216]"
          }`}
        >
          {loading ? "Đang xác thực dữ liệu..." : loginRole === "admin" ? "Đăng nhập Bảng Quản Trị" : "Đăng nhập Sinh viên"}
        </button>
      </form>
    </div>
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
              alt="Logo Đoàn Khoa Kỹ thuật Cơ khí"
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

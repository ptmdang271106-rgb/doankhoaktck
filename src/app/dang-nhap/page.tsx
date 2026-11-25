"use client";

import { siteImages } from "@/lib/site-images";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { endImageSession, loginWithGoogleSession, loginWithPassword } from "./actions";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [loginRole, setLoginRole] = useState<"student" | "admin">("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // LẮNG NGHE SỰ KIỆN XÁC THỰC GOOGLE VÀ ĐỐI CHIẾU VỚI DATABASE
  useEffect(() => {
    let active = true;
    let pending = false;
    async function finishGoogleLogin(accessToken: string, userEmail: string) {
        if (!active || pending) return;
        pending = true;
        setLoading(true);
        setErrorMsg("");

        try {
          const loggedInUser = await loginWithGoogleSession(accessToken);
          if (!active) return;
          if (!loggedInUser) {
            await supabase.auth.signOut();
            localStorage.removeItem("ctut_current_user");

            if (typeof window !== "undefined") {
              window.history.replaceState(null, "", window.location.pathname);
            }

            setErrorMsg(
              `Tài khoản email (${userEmail}) chưa được Quản trị viên/BCH Chi đoàn thêm vào hệ thống. Vui lòng liên hệ cán bộ lớp để được cấp quyền!`
            );
            setLoading(false);
            return;
          }

          localStorage.setItem("ctut_current_user", JSON.stringify(loggedInUser));

          if (typeof window !== "undefined") {
            window.history.replaceState(null, "", window.location.pathname);
          }

          setLoading(false);
          router.push(redirectUrl);
        } catch (err: any) {
          await supabase.auth.signOut();
          localStorage.removeItem("ctut_current_user");
          setErrorMsg("Lỗi kiểm tra dữ liệu: " + err.message);
          setLoading(false);
        } finally {
          pending = false;
        }
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const email = session?.user.email;
      if ((event === "INITIAL_SESSION" || event === "SIGNED_IN") && session && email) {
        setTimeout(() => { void finishGoogleLogin(session.access_token, email); }, 0);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [redirectUrl, router]);

  // XỬ LÝ BẤM NÚT ĐĂNG NHẬP GOOGLE
  const handleGoogleLogin = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      await endImageSession();
      await supabase.auth.signOut();
      localStorage.removeItem("ctut_current_user");

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/dang-nhap?redirect=" + encodeURIComponent(redirectUrl),
          queryParams: {
            prompt: "select_account",
            access_type: "offline",
          },
        },
      });

      if (error) {
        setErrorMsg("Lỗi đăng nhập Google: " + error.message);
        setLoading(false);
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ Google.");
      setLoading(false);
    }
  };

  // XỬ LÝ ĐĂNG NHẬP THỦ CÔNG (MSSV HOẶC ADMIN)
  const handleAccountLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const cleanUser = username.trim();
    const cleanPass = password.trim();

    try {
      const result = await loginWithPassword(cleanUser, cleanPass, loginRole);
      if (!result.user) {
        setErrorMsg(result.error);
        return;
      }
      localStorage.setItem("ctut_current_user", JSON.stringify(result.user));
      if (result.user.role === "branch_admin") {
        router.push("/admin/chi-doan");
      } else {
        router.push(loginRole === "admin" ? "/admin" : redirectUrl);
      }
    } catch {
      setErrorMsg("Không thể kết nối đến máy chủ. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Nút chuyển đổi vai trò */}
      <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
        <button
          type="button"
          onClick={() => {
            setLoginRole("student");
            setErrorMsg("");
            setUsername("");
            setPassword("");
          }}
          className={`py-2 rounded-xl transition ${
            loginRole === "student"
              ? "bg-[#EE6425] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Sinh viên
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginRole("admin");
            setErrorMsg("");
            setUsername("");
            setPassword("");
          }}
          className={`py-2 rounded-xl transition ${
            loginRole === "admin"
              ? "bg-[#004A52] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          BCH / Quản trị
        </button>
      </div>

      {/* Hiển thị thông báo lỗi */}
      {errorMsg && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium leading-relaxed">
          {errorMsg}
        </div>
      )}

      {/* Nút đăng nhập Google */}
      {loginRole === "student" && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white hover:bg-slate-50 text-slate-700 font-bold py-2.5 px-4 rounded-xl border border-slate-300 transition text-xs flex items-center justify-center gap-3 shadow-xs active:scale-95 disabled:bg-slate-100"
          >
            <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{loading ? "Đang xác thực tài khoản..." : "Đăng nhập bằng Google sinh viên (@student.ctuet.edu.vn)"}</span>
          </button>

          <div className="flex items-center my-3">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-400 font-semibold uppercase">
              Hoặc dùng mã sinh viên
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
        </div>
      )}

      {/* Form đăng nhập bằng MSSV / Password */}
      <form onSubmit={handleAccountLogin} className="space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {loginRole === "admin"
              ? "Tên tài khoản Quản trị / BCH Chi đoàn *"
              : "Mã số sinh viên (MSSV) hoặc Email *"}
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={
              loginRole === "admin"
                ? "Tài khoản quản trị hoặc Chi đoàn"
                : "VD: CNDT2411081"
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#EE6425]"
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
            placeholder={
              loginRole === "admin"
                ? "Mật khẩu quản trị"
                : "Mật khẩu (Mặc định: 3 số cuối MSSV)"
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#EE6425]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow tracking-wider disabled:bg-slate-300 ${
            loginRole === "admin"
              ? "bg-[#004A52] hover:bg-[#00343a]"
              : "bg-[#EE6425] hover:bg-[#d85216]"
          }`}
        >
          {loading
            ? "Đang xác thực dữ liệu..."
            : loginRole === "admin"
            ? "Đăng nhập Bảng Quản Trị"
            : "Đăng nhập Sinh viên"}
        </button>
      </form>
    </div>
  );
}

export default function DangNhapPage() {
  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <Link href="/">
            <img
              src={siteImages.logo}
              alt="Logo Đoàn Khoa Kỹ thuật Cơ khí"
              className="h-14 mx-auto object-contain mb-3 cursor-pointer"
            />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight">
            ĐĂNG NHẬP HỆ THỐNG
          </h1>
      
        </div>

        <Suspense fallback={<div className="text-center text-xs text-slate-400 py-4">Đang tải...</div>}>
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

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function TraCuuDrlPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/tra-cuu");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    const fetchProofs = async () => {
      const { data } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", user.mssv)
        .order("created_at", { ascending: false });

      if (data) setProofs(data);
      setLoading(false);
    };

    fetchProofs();
  }, [router]);

  const totalPoints = proofs.reduce((sum, p) => sum + (Number(p.points) || 0), 0);

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo-doankhoa.png" alt="Logo" className="h-12 w-auto object-contain cursor-pointer" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#004A52]">CỔNG TRA CỨU ĐIỂM RÈN LUYỆN</h1>
              <p className="text-xs text-slate-500 mt-0.5">Dữ liệu đồng bộ Realtime từ máy chủ Cloud</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* THONG TIN SINH VIEN & TONG DIEM */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="sm:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Họ và tên:</span>
              <strong className="text-[#004A52] text-sm">{currentUser?.fullName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mã số sinh viên:</span>
              <span className="font-mono font-bold text-slate-700">{currentUser?.mssv}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Lớp sinh hoạt:</span>
              <span className="text-slate-700">{currentUser?.studentClass || "Khoa Cơ Khí"}</span>
            </div>
          </div>

          <div className="bg-[#004A52] text-white p-5 rounded-2xl shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs font-medium text-teal-100">Tổng điểm đã cộng</span>
            <span className="text-3xl font-black text-[#EE6425] mt-1">+{totalPoints}</span>
            <span className="text-[10px] text-teal-200 mt-0.5">Điểm rèn luyện</span>
          </div>
        </div>

        {/* DANH SACH MINH CHUNG & HOAT DONG DA DIEM DANH */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h2 className="text-base font-bold text-[#004A52]">
              Lịch sử tham gia hoạt động & Minh chứng ({proofs.length})
            </h2>
            <Link
              href="/diem-danh"
              className="bg-[#007A87] hover:bg-[#00606B] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow"
            >
              Quét QR Điểm danh
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400">Đang tải dữ liệu từ máy chủ...</div>
          ) : proofs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              Bạn chưa có minh chứng hoặc lượt điểm danh hoạt động nào.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {proofs.map((p, idx) => (
                <div key={p.id || idx} className="py-3.5 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">
                        Mục {p.category_code}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {p.status || "Đã duyệt"}
                      </span>
                    </div>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">{p.title}</h3>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Nguồn: {p.source} • Ngày ghi nhận: {new Date(p.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                      +{p.points} ĐRL
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

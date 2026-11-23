"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

function GioiThieuContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "doankhoa";

  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntro = async () => {
      setLoading(true);
      const dbKey = currentTab === "lienchihoi" ? "about_lienchihoi" : "about_doankhoa";
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", dbKey)
        .maybeSingle();

      if (data && data.value) {
        setContentHtml(data.value);
      } else {
        if (currentTab === "lienchihoi") {
          setContentHtml(`<h2>Liên chi hội KTCK</h2><p>Chưa có nội dung giới thiệu Liên chi hội.</p>`);
        } else {
          setContentHtml(`<h2>Đoàn khoa KTCK</h2><p>Chưa có nội dung giới thiệu Đoàn khoa.</p>`);
        }
      }
      setLoading(false);
    };
    fetchIntro();
  }, [currentTab]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* THANH TAB CHUYỂN ĐỔI GIỮA ĐOÀN KHOA VÀ LIÊN CHI HỘI */}
      <div className="flex gap-3 mb-6">
        <Link
          href="/gioi-thieu?tab=doankhoa"
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            currentTab === "doankhoa" ? "bg-[#EE6425] text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Đoàn khoa KTCK
        </Link>
        <Link
          href="/gioi-thieu?tab=lienchihoi"
          className={`px-5 py-2.5 rounded-xl font-bold text-xs transition ${
            currentTab === "lienchihoi" ? "bg-[#EE6425] text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Liên chi hội KTCK
        </Link>
      </div>

      {/* KHUNG NỘI DUNG CHÍNH */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
        <div className="border-b border-slate-100 pb-6 mb-6">
          <span className="text-xs font-bold text-[#EE6425] uppercase tracking-wider block mb-1">Giới thiệu chung</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#004A52]">
            {currentTab === "lienchihoi" ? "LIÊN CHI HỘI KỸ THUẬT CƠ KHÍ" : "ĐOÀN KHOA KỸ THUẬT CƠ KHÍ"}
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs">Đang tải nội dung...</div>
        ) : (
          <div 
            className="prose max-w-none text-sm text-slate-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          ></div>
        )}
      </div>
    </main>
  );
}

export default function GioiThieuPage() {
  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
      {/* SỬ DỤNG CHUNG NAVBAR CHUẨN ĐỂ ĐỒNG BỘ TUYỆT ĐỐI VỚI TRANG CHỦ */}
      <Navbar />

      <Suspense fallback={<div className="text-center py-20 text-xs text-slate-400">Đang tải...</div>}>
        <GioiThieuContent />
      </Suspense>

      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function GioiThieuPage() {
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIntro = async () => {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "about_us")
        .maybeSingle();

      if (data && data.value) {
        setContentHtml(data.value);
      } else {
        setContentHtml(`
          <h2 style="color: #004A52; font-weight: 800; font-size: 24px; margin-bottom: 16px;">Về Đoàn Khoa Kỹ thuật Cơ khí - CTUT</h2>
          <p style="margin-bottom: 12px; line-height: 1.6;">Đoàn Thanh niên - Hội Sinh viên Khoa Kỹ thuật Cơ khí là tổ chức chính trị - xã hội của đoàn viên, sinh viên Khoa Kỹ thuật Cơ khí, Trường Đại học Kỹ thuật - Công nghệ Cần Thơ.</p>
        `);
      }
      setLoading(false);
    };
    fetchIntro();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <span className="text-xs font-bold text-[#EE6425] uppercase tracking-wider block mb-1">Giới thiệu chung</span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#004A52]">ĐOÀN KHOA KỸ THUẬT CƠ KHÍ</h1>
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
    </div>
  );
}

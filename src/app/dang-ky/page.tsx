"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function DangKyPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#E05A10] transition">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#E05A10] font-semibold">Đăng ký hoạt động</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003B73]">
              Đăng Ký Tham Gia Hoạt Động
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Ghi danh các phong trào Đoàn - Hội Khoa Kỹ thuật Cơ khí
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 bg-emerald-50 rounded-xl border border-emerald-200 p-6">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-emerald-800 mb-1">Đăng ký thành công!</h3>
              <p className="text-sm text-emerald-700">
                Thông tin đã được ghi nhận. Ban Tổ chức sẽ thông báo qua nhóm Zalo hoặc Chi đoàn.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-sm font-semibold text-[#E05A10] hover:underline"
              >
                Gửi thêm đăng ký khác
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Hoạt động tham gia *</label>
                <select required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#E05A10]">
                  <option value="">-- Chọn phong trào --</option>
                  <option value="1">Chiến dịch Mùa hè xanh 2026</option>
                  <option value="2">Giải Bóng đá mini Nam - Nữ Khoa Cơ khí</option>
                  <option value="3">Ngày hội Hiến máu tình nguyện đợt 2</option>
                  <option value="4">Hội thảo Nghiên cứu Khoa học & Hướng nghiệp</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên *</label>
                  <input required type="text" placeholder="Nguyễn Văn A" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#E05A10]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">MSSV *</label>
                  <input required type="text" placeholder="2200101" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#E05A10]" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Lớp sinh hoạt *</label>
                  <input required type="text" placeholder="CK22A1" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#E05A10]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại (Zalo) *</label>
                  <input required type="tel" placeholder="0912345678" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#E05A10]" />
                </div>
              </div>

              <button type="submit" className="w-full bg-[#E05A10] hover:bg-[#c94d0a] text-white font-bold py-3 rounded-xl transition shadow-sm">
                Xác nhận đăng ký
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}

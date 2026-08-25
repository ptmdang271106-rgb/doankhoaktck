"use client";

import React, { useState } from "react";

export default function DangKyPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-2">
          Đăng Ký Hoạt Động & Phong Trào
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Đoàn Khoa Kỹ thuật Cơ khí CTUT
        </p>

        {submitted ? (
          <div className="text-center py-8 bg-emerald-50 rounded-xl border border-emerald-200 p-6">
            <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-bold text-emerald-800 mb-1">Đăng ký thành công!</h3>
            <p className="text-sm text-emerald-700">
              Thông tin của bạn đã được gửi đến Ban Tổ chức hoạt động.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
            >
              Gửi đăng ký khác
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Hoạt động tham gia *</label>
              <select required className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600">
                <option value="">-- Chọn phong trào --</option>
                <option value="1">Chiến dịch Mùa hè xanh 2026</option>
                <option value="2">Giải Bóng đá mini Nam - Nữ Khoa Cơ khí</option>
                <option value="3">Ngày hội Hiến máu tình nguyện</option>
                <option value="4">Hội thảo Khoa học & Hướng nghiệp sinh viên</option>
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Họ và tên *</label>
                <input required type="text" placeholder="Nguyễn Văn A" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">MSSV *</label>
                <input required type="text" placeholder="2200101" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Lớp sinh hoạt *</label>
                <input required type="text" placeholder="CK22A1" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Số điện thoại (Zalo) *</label>
                <input required type="tel" placeholder="0912345678" className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-blue-600" />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition">
              Gửi đăng ký
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

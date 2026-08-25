"use client";

import React, { useState } from "react";
import Link from "next/link";

interface StudentRecord {
  mssv: string;
  hoTen: string;
  lop: string;
  drl: number;
  ctxh: number;
  hoatDong: string[];
}

const MOCK_DATA: Record<string, StudentRecord> = {
  "2200101": {
    mssv: "2200101",
    hoTen: "Nguyễn Văn An",
    lop: "CK22A1",
    drl: 88,
    ctxh: 5,
    hoatDong: [
      "Chiến dịch Mùa hè xanh (+3 ngày CTXH)",
      "Hiến máu tình nguyện đợt 1 (+2 ngày CTXH, +10 ĐRL)",
      "Sinh hoạt Chi đoàn chủ điểm (+5 ĐRL)",
    ],
  },
};

export default function TraCuuPage() {
  const [mssvInput, setMssvInput] = useState("");
  const [result, setResult] = useState<StudentRecord | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMssv = mssvInput.trim().toUpperCase();
    if (!cleanMssv) return;

    setSearched(true);
    setResult(MOCK_DATA[cleanMssv] || null);
  };

  return (
    <main className="py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#E05A10] transition">Trang chủ</Link>
          <span>/</span>
          <span className="text-[#E05A10] font-semibold">Tra cứu ĐRL & CTXH</span>
        </nav>

        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#003B73]">
              Tra Cứu Điểm Rèn Luyện & CTXH
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Dữ liệu phong trào sinh viên Đoàn Khoa Kỹ thuật Cơ khí
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              value={mssvInput}
              onChange={(e) => setMssvInput(e.target.value)}
              placeholder="Nhập Mã số sinh viên (VD: 2200101)..."
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#E05A10] focus:ring-2 focus:ring-orange-100 transition"
              required
            />
            <button
              type="submit"
              className="bg-[#E05A10] hover:bg-[#c94d0a] text-white font-bold px-8 py-3 rounded-xl transition shadow-sm"
            >
              Tra cứu ngay
            </button>
          </form>

          {searched && (
            <div>
              {result ? (
                <div className="bg-orange-50/40 rounded-xl p-5 border border-orange-200/60">
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-orange-200/60">
                    <div>
                      <p className="text-xs text-slate-500">Họ và tên</p>
                      <p className="font-bold text-slate-800">{result.hoTen}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Lớp sinh hoạt</p>
                      <p className="font-bold text-slate-800">{result.lop}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Điểm rèn luyện</p>
                      <p className="text-2xl font-black text-[#003B73]">{result.drl} điểm</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Ngày CTXH</p>
                      <p className="text-2xl font-black text-[#E05A10]">{result.ctxh} ngày</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-slate-800 mt-4 mb-2">Hoạt động đã cộng điểm:</h3>
                  <ul className="space-y-2 text-sm text-slate-600">
                    {result.hoatDong.map((hd, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-[#E05A10] font-bold">✓</span> {hd}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  Không tìm thấy dữ liệu cho MSSV <strong>{mssvInput}</strong>.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

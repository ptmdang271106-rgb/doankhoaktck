"use client";

import React, { useState } from "react";

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
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-slate-100">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-2">
          Tra Cứu Điểm Rèn Luyện & CTXH
        </h1>
        <p className="text-center text-sm text-slate-500 mb-6">
          Đoàn Khoa Kỹ thuật Cơ khí - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={mssvInput}
            onChange={(e) => setMssvInput(e.target.value)}
            placeholder="Nhập MSSV (VD: 2200101)"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-blue-600"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Tra cứu
          </button>
        </form>

        {searched && (
          <div>
            {result ? (
              <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-blue-100">
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
                    <p className="text-xl font-extrabold text-blue-600">{result.drl} điểm</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Ngày CTXH</p>
                    <p className="text-xl font-extrabold text-emerald-600">{result.ctxh} ngày</p>
                  </div>
                </div>
                <h3 className="font-semibold text-sm text-slate-700 mb-2">Hoạt động ghi nhận:</h3>
                <ul className="space-y-1.5 text-sm text-slate-600">
                  {result.hoatDong.map((hd, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-blue-500">✔</span> {hd}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                Không tìm thấy thông tin của MSSV <strong>{mssvInput}</strong>.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

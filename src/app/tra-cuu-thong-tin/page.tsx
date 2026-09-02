"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function TraCuuThongTinPage() {
  const [mssvInput, setMssvInput] = useState("");
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mssvInput.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .ilike("mssv", mssvInput.trim())
        .maybeSingle();

      if (error || !data) {
        setStudentInfo(null);
      } else {
        setStudentInfo(data);
      }
    } catch (err) {
      console.error(err);
      setStudentInfo(null);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 space-y-6">
          <div className="text-center max-w-lg mx-auto space-y-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#004A52] uppercase">
              TRA CỨU THÔNG TIN  SINH VIÊN
            </h1>
            <p className="text-xs text-slate-500">
              Nhập mã số sinh viên (MSSV) để tra cứu thông tin lý lịch sinh viên.
            </p>
          </div>

          <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              required
              value={mssvInput}
              onChange={(e) => setMssvInput(e.target.value)}
              placeholder="Nhập MSSV (VD: CNDT0011099)..."
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono uppercase outline-none focus:border-[#EE6425]"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-[#007A87] hover:bg-[#005a63] text-white font-bold px-6 py-3 rounded-xl text-xs uppercase transition shadow"
            >
              {loading ? "Đang tìm..." : "Tra cứu"}
            </button>
          </form>

          {searched && (
            <div className="max-w-xl mx-auto pt-4">
              {studentInfo ? (
                <div className="bg-orange-50/60 border border-orange-200 rounded-2xl p-6 space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-orange-200 pb-3">
                    <span className="font-extrabold text-[#004A52] text-sm uppercase">{studentInfo.full_name}</span>
                    <span className="font-mono font-bold text-[#EE6425] bg-white px-3 py-1 rounded-lg border border-orange-200">{studentInfo.mssv}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700 font-medium">
                    <div><strong>Lớp sinh hoạt:</strong> {studentInfo.student_class || "Chưa cập nhật"}</div>
                    <div><strong>Nơi sinh:</strong> {studentInfo.birth_place || "Chưa cập nhật"}</div>
                    <div><strong>Ngày vào Đoàn:</strong> {studentInfo.union_date || "Chưa cập nhật"}</div>
                    <div><strong>Ngày vào Đảng:</strong> {studentInfo.party_date || "Chưa kết nạp Đảng"}</div>
                    <div>
                      <strong>Sổ Đoàn:</strong>{" "}
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${studentInfo.so_doan === "Đã nộp" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                        {studentInfo.so_doan || "Chưa nộp"}
                      </span>
                    </div>
                    <div>
                      <strong>Tình trạng Đoàn:</strong>{" "}
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${studentInfo.chua_ket_nap_doan ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                        {studentInfo.chua_ket_nap_doan ? "Chưa kết nạp Đoàn" : "Đã là Đoàn viên"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  Không tìm thấy thông tin sinh viên với mã số <strong>{mssvInput}</strong>.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

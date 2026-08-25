"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ChiDoanDashboard() {
  const router = useRouter();
  const [currentOfficer, setCurrentOfficer] = useState<any>(null);
  const [studentsInClass, setStudentsInClass] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentProofs, setStudentProofs] = useState<any[]>([]);
  const [studentSubmission, setStudentSubmission] = useState<any>(null);
  const [officerFinalScore, setOfficerFinalScore] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("ctut_current_user");
    if (!saved) {
      router.push("/dang-nhap");
      return;
    }
    const user = JSON.parse(saved);
    if (user.role !== "branch_admin" && user.role !== "super_admin") {
      alert("Bạn không có quyền truy cập trang Bí thư Chi đoàn!");
      router.push("/");
      return;
    }
    setCurrentOfficer(user);
    loadClassStudents(user.studentClass);
  }, [router]);

  const loadClassStudents = async (className: string) => {
    setLoading(true);
    try {
      let query = supabase.from("students").select("*");
      if (currentOfficer?.role !== "super_admin") {
        query = query.eq("student_class", className);
      }
      const { data } = await query;
      if (data) setStudentsInClass(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSelectStudent = async (student: any) => {
    setSelectedStudent(student);
    try {
      // 1. Lấy danh sách minh chứng của sinh viên này
      const { data: proofs } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", student.mssv);
      if (proofs) setStudentProofs(proofs);

      // 2. Lấy phiếu điểm rèn luyện sinh viên đã nộp
      const { data: sub } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", student.mssv)
        .maybeSingle();
      
      if (sub) {
        setStudentSubmission(sub);
        setOfficerFinalScore(sub.final_score || sub.self_score || 80);
      } else {
        setStudentSubmission(null);
        setOfficerFinalScore(80);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bí thư duyệt minh chứng
  const handleApproveProof = async (proofId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt";
    await supabase.from("proofs").update({ status: nextStatus }).eq("id", proofId);
    handleSelectStudent(selectedStudent);
  };

  // Bí thư gửi điểm chính thức về cho sinh viên
  const handleSendScoreToStudent = async () => {
    if (!selectedStudent) return;
    if (!confirm(`Xác nhận gửi điểm rèn luyện chính thức (${officerFinalScore} điểm) về cho sinh viên ${selectedStudent.full_name}?`)) return;

    try {
      const updateData = {
        mssv: selectedStudent.mssv,
        student_name: selectedStudent.full_name,
        student_class: selectedStudent.student_class,
        final_score: Number(officerFinalScore),
        status: "BCH Chi đoàn đã duyệt & công bố điểm",
      };

      await supabase.from("drl_submissions").upsert([updateData], { onConflict: "mssv" });
      alert("Đã gửi điểm rèn luyện chính thức về cho sinh viên thành công!");
      loadClassStudents(currentOfficer.studentClass);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  if (!currentOfficer) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-black text-[#004A52] uppercase">
              CỔNG QUẢN LÝ BÍ THƯ CHI ĐOÀN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cán bộ lớp: <strong>{currentOfficer.fullName}</strong> | Lớp quản lý: <strong>{currentOfficer.studentClass}</strong>
            </p>
          </div>
          <Link href="/" className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs">
            Về trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CỘT 1: DANH SÁCH SINH VIÊN TRONG LỚP */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-sm font-black text-[#004A52] uppercase">
              Danh sách sinh viên lớp ({studentsInClass.length})
            </h2>

            {loading ? (
              <div className="text-center py-6 text-xs text-slate-400">Đang tải danh sách...</div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {studentsInClass.map((st, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectStudent(st)}
                    className={`p-3 rounded-2xl border cursor-pointer transition text-xs ${
                      selectedStudent?.mssv === st.mssv
                        ? "bg-orange-50 border-[#EE6425] shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold text-slate-800">{st.full_name}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">{st.mssv}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CỘT 2 & 3: CHI TIẾT DUYỆT MINH CHỨNG & CHẤM ĐIỂM CHO SINH VIÊN ĐƯỢC CHỌN */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStudent ? (
              <>
                {/* THÔNG TIN SINH VIÊN ĐANG CHẤM */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-sm font-black text-[#004A52] uppercase">
                        Đang chấm điểm cho: {selectedStudent.full_name}
                      </h2>
                      <span className="text-xs text-slate-500 font-mono">{selectedStudent.mssv} - {selectedStudent.student_class}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Điểm SV tự chấm:</span>
                      <span className="text-lg font-black text-[#EE6425]">
                        {studentSubmission?.self_score || "--"} điểm
                      </span>
                    </div>
                  </div>

                  {/* DUYỆT MINH CHỨNG CỦA SINH VIÊN */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">
                      Minh chứng sinh viên đã nộp ({studentProofs.length})
                    </h3>
                    {studentProofs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Sinh viên chưa nộp minh chứng nào.</p>
                    ) : (
                      <div className="space-y-2">
                        {studentProofs.map((p, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">{p.activity_title}</span>
                              <span className="text-[11px] text-slate-500">{p.category} (+{p.points}đ)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {p.proof_url && (
                                <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">
                                  Xem tệp
                                </a>
                              )}
                              <button
                                onClick={() => handleApproveProof(p.id, p.status)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                                  p.status === "Đã duyệt"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                }`}
                              >
                                {p.status || "Chờ duyệt"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NHẬP ĐIỂM CHÍNH THỨC & GỬI VỀ CHO SINH VIÊN */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Điểm chính thức:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={officerFinalScore}
                        onChange={(e) => setOfficerFinalScore(Number(e.target.value))}
                        className="w-20 border border-slate-300 rounded-xl px-3 py-2 text-center font-bold text-lg text-[#EE6425] outline-none"
                      />
                      <span className="text-xs text-slate-400">/ 100đ</span>
                    </div>

                    <button
                      onClick={handleSendScoreToStudent}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow transition uppercase tracking-wider"
                    >
                      Gửi điểm chính thức về cho sinh viên
                    </button>
                  </div>

                </div>
              </>
            ) : (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-slate-200 text-center text-slate-400 text-xs">
                ⬅ Vui lòng chọn một sinh viên ở cột bên trái để xem minh chứng và chấm điểm.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

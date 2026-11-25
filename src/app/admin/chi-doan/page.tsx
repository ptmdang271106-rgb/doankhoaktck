"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ProofLinks } from "@/components/ProofLinks";
import { searchStudents } from "@/lib/student-search";
import { DRLStatusBadge, getDRLStatus } from "@/components/DRLStatusBadge";
import { DRL_SECTIONS_FULL } from "@/lib/drl-criteria";

export default function ChiDoanDashboard() {
  const router = useRouter();
  const [currentOfficer, setCurrentOfficer] = useState<any>(null);
  const [studentsInClass, setStudentsInClass] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);
  const [reviewSemester, setReviewSemester] = useState("hk1_2026_2027");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("Tất cả");
  const [reviewSearch, setReviewSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentProofs, setStudentProofs] = useState<any[]>([]);
  const [studentSubmission, setStudentSubmission] = useState<any>(null);
  const [officerScores, setOfficerScores] = useState<Record<string, number>>({});
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const reviewRequest = useRef(0);

  const loadClassData = async (officer: any) => {
    setLoading(true);
    try {
      const assignedClass = officer?.studentClass?.trim() || "";

      // Load students
      let studentQuery = supabase.from("students").select("*").order("full_name", { ascending: true });
      if (officer?.role !== "super_admin" && assignedClass) {
        studentQuery = studentQuery.eq("student_class", assignedClass);
      }
      const { data: stData, error: stError } = await studentQuery;
      if (stError) console.error("Load students error:", stError.message);
      if (stData) setStudentsInClass(stData);

      // Load semesters
      const { data: semData } = await supabase
        .from("drl_semesters")
        .select("*")
        .order("created_at", { ascending: false });
      if (semData && semData.length > 0) {
        setSemesters(semData);
        setReviewSemester((prev) => semData.some((s: any) => s.id === prev) ? prev : semData[0].id);
      }

      // Load submissions — không filter theo student_class vì bảng không có cột đó
      // Filter phía client dựa trên mssv của sinh viên trong lớp
      const { data: subs, error: subError } = await supabase
        .from("drl_submissions")
        .select("mssv,semester_id,status,final_score,self_score,student_class");
      if (subError) console.error("Load submissions error:", subError.message);
      if (subs) {
        const map: Record<string, any> = {};
        subs.forEach((s: any) => {
          // Nếu có semester_id thì dùng key kép, luôn lưu cả key đơn để tương thích
          if (s.semester_id) {
            map[`${s.mssv}_${s.semester_id}`] = s;
          }
          // Luôn lưu key mssv đơn để fallback
          if (!map[s.mssv]) map[s.mssv] = s;
        });
        setSubmissionsMap(map);
      }
    } catch (e) {
      console.error("loadClassData error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("ctut_current_user");
    if (!saved) {
      router.push("/dang-nhap?redirect=/admin/chi-doan");
      return;
    }
    const user = JSON.parse(saved);
    if (user.role !== "branch_admin" && user.role !== "super_admin") {
      alert("Bạn không có quyền truy cập trang Bí thư Chi đoàn!");
      router.push("/");
      return;
    }
    setCurrentOfficer(user);
    loadClassData(user);
  }, [router]);

  const getStudentSub = (mssv: string) => {
    return submissionsMap[`${mssv}_${reviewSemester}`] || submissionsMap[mssv];
  };

  const chuaNopCount = studentsInClass.filter(st => getDRLStatus(getStudentSub(st.mssv)) === "Chưa nộp").length;
  const daNopCount = studentsInClass.filter(st => getDRLStatus(getStudentSub(st.mssv)) === "Đã nộp").length;
  const daDuyetCount = studentsInClass.filter(st => getDRLStatus(getStudentSub(st.mssv)) === "Đã duyệt").length;

  const statusFilteredStudents = studentsInClass.filter(st => {
    if (reviewStatusFilter === "Tất cả") return true;
    return getDRLStatus(getStudentSub(st.mssv)) === reviewStatusFilter;
  });

  const matchingStudents = searchStudents(statusFilteredStudents, reviewSearch);

  const handleSelectStudent = async (st: any) => {
    if (
      currentOfficer?.role !== "super_admin" &&
      st.student_class?.trim() !== currentOfficer?.studentClass?.trim()
    ) {
      alert("Bạn chỉ được xem và chấm điểm cho sinh viên thuộc lớp mình quản lý!");
      return;
    }
    const request = ++reviewRequest.current;
    setSelectedStudent(null);
    try {
      const { data: proofs } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", st.mssv)
        .eq("semester_id", reviewSemester);

      const { data: sub } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", st.mssv)
        .eq("semester_id", reviewSemester)
        .maybeSingle();

      if (request !== reviewRequest.current) return;
      setSelectedStudent(st);
      setStudentProofs(proofs || []);
      if (sub) {
        setStudentSubmission(sub);
        setOfficerScores(sub.scores_detail || {});
      } else {
        setStudentSubmission(null);
        setOfficerScores({});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveProof = async (proofId: string, currentStatus: string) => {
    const request = reviewRequest.current;
    const nextStatus = currentStatus === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt";
    await supabase.from("proofs").update({ status: nextStatus }).eq("id", proofId);
    if (request === reviewRequest.current && selectedStudent) {
      handleSelectStudent(selectedStudent);
    }
  };

  const handleDeleteProof = async (proofId: string, title: string) => {
    if (!confirm(`Xác nhận xóa minh chứng "${title}" của sinh viên này?`)) return;
    const request = reviewRequest.current;
    await supabase.from("proofs").delete().eq("id", proofId);
    if (request === reviewRequest.current && selectedStudent) {
      handleSelectStudent(selectedStudent);
    }
  };

  const getOfficerSectionScore = (section: any) => {
    const rawSum = section.items.reduce((sum: number, it: any) => sum + (Number(officerScores[it.id]) || 0), 0);
    return Math.min(rawSum, section.maxPoints);
  };

  const grandOfficerTotalScore = DRL_SECTIONS_FULL.reduce((total, sec) => total + getOfficerSectionScore(sec), 0);

  const handleSendFinalScore = async () => {
    const request = reviewRequest.current;
    if (!selectedStudent) return;
    if (
      currentOfficer?.role !== "super_admin" &&
      selectedStudent.student_class?.trim() !== currentOfficer?.studentClass?.trim()
    ) {
      alert("Bạn không có quyền chấm điểm cho sinh viên ngoài lớp quản lý!");
      return;
    }
    if (!confirm(`Xác nhận gửi bảng điểm rèn luyện chính thức (${grandOfficerTotalScore} điểm) về cho sinh viên ${selectedStudent.full_name}?`)) return;

    try {
      const submissionData = {
        mssv: selectedStudent.mssv,
        student_name: selectedStudent.full_name,
        student_class: selectedStudent.student_class,
        semester_id: reviewSemester,
        self_score: studentSubmission?.self_score || 0,
        final_score: Number(grandOfficerTotalScore),
        scores_detail: officerScores,
        proofs_detail: studentSubmission?.proofs_detail || {},
        status: "Đã duyệt",
      };

      const { error } = await supabase.from("drl_submissions").upsert([submissionData], { onConflict: "mssv,semester_id" });
      if (error) {
        alert("Lỗi khi gửi điểm: " + error.message);
      } else {
        setSubmissionsMap((prev) => ({
          ...prev,
          [`${selectedStudent.mssv}_${reviewSemester}`]: submissionData,
        }));
        alert("Đã gửi điểm rèn luyện chính thức về cho sinh viên thành công!");
        if (request === reviewRequest.current) {
          handleSelectStudent(selectedStudent);
        }
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ctut_current_user");
    router.push("/dang-nhap");
  };

  if (!currentOfficer) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-[#004A52] uppercase">
              CỔNG QUẢN LÝ BÍ THƯ CHI ĐOÀN
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Cán bộ lớp: <strong className="text-[#EE6425]">{currentOfficer.fullName}</strong> | Lớp quản lý: <strong>{currentOfficer.studentClass}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link href="/" className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition">
              Về trang chủ
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs transition">
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CỘT TRÁI: DANH SÁCH SINH VIÊN LỚP */}
          <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 gap-2">
              <h3 className="text-sm font-black text-[#004A52] uppercase">Danh sách sinh viên lớp</h3>
              <select
                value={reviewSemester}
                onChange={e => { reviewRequest.current++; setSelectedStudent(null); setReviewSemester(e.target.value); }}
                className="border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-[#EE6425] outline-none bg-white max-w-[180px]"
              >
                {semesters.length > 0 ? (
                  semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))
                ) : (
                  <option value="hk1_2026_2027">Học kỳ 1 (Năm học 2026 - 2027)</option>
                )}
              </select>
            </div>

            {/* CHỌN TRẠNG THÁI PHIẾU */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái phiếu</label>
              <select
                value={reviewStatusFilter}
                onChange={e => { reviewRequest.current++; setSelectedStudent(null); setReviewStatusFilter(e.target.value); }}
                className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-[#EE6425]"
              >
                <option value="Tất cả">Tất cả ({studentsInClass.length})</option>
                <option value="Chưa nộp">Chưa nộp ({chuaNopCount})</option>
                <option value="Đã nộp">Đã nộp phiếu ({daNopCount})</option>
                <option value="Đã duyệt">Đã duyệt ({daDuyetCount})</option>
              </select>
            </div>

            {/* NÚT LỌC NHANH TRẠNG THÁI */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: "Tất cả", label: "Tất cả", count: studentsInClass.length },
                { id: "Chưa nộp", label: "Chưa nộp", count: chuaNopCount },
                { id: "Đã nộp", label: "Đã nộp", count: daNopCount },
                { id: "Đã duyệt", label: "Đã duyệt", count: daDuyetCount },
              ].map(item => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { reviewRequest.current++; setSelectedStudent(null); setReviewStatusFilter(item.id); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    reviewStatusFilter === item.id
                      ? "bg-[#007A87] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>

            {/* TÌM KIẾM THEO TÊN HOẶC MSSV */}
            <div>
              <input
                type="search"
                aria-label="Tìm sinh viên theo tên hoặc MSSV"
                placeholder="Tìm theo họ tên hoặc MSSV..."
                value={reviewSearch}
                onChange={e => setReviewSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
              />
            </div>

            {/* DANH SÁCH SINH VIÊN */}
            {loading ? (
              <div className="text-center py-6 text-xs text-slate-400">Đang tải danh sách...</div>
            ) : (
              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {!matchingStudents.length && (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    {reviewSearch.trim() || reviewStatusFilter !== "Tất cả" ? "Không tìm thấy sinh viên phù hợp." : "Chưa có sinh viên trong danh sách này."}
                  </p>
                )}
                {matchingStudents.map(st => {
                  const sub = getStudentSub(st.mssv);
                  const stStatus = getDRLStatus(sub);
                  return (
                    <div
                      key={st.mssv}
                      onClick={() => handleSelectStudent(st)}
                      className={`p-3 rounded-2xl border cursor-pointer transition text-xs flex justify-between items-center gap-2 ${
                        selectedStudent?.mssv === st.mssv
                          ? "bg-orange-50 border-[#EE6425] shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 truncate">{st.full_name}</div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">{st.mssv} - {st.student_class}</div>
                      </div>
                      <DRLStatusBadge status={stStatus} size="sm" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CỘT PHẢI: CHI TIẾT DUYỆT MINH CHỨNG & BẢNG CHẤM ĐIỂM CHI TIẾT */}
          <div className="lg:col-span-8 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {selectedStudent ? (
              <>
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-sm font-black text-[#004A52] uppercase">
                        Chấm điểm cho: {selectedStudent.full_name}
                      </h2>
                      <DRLStatusBadge status={getDRLStatus(studentSubmission)} size="sm" />
                    </div>
                    <span className="text-xs text-slate-500 font-mono">{selectedStudent.mssv} | {selectedStudent.student_class}</span>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="text-xs text-slate-400 block">Điểm SV tự chấm:</span>
                    <span className="text-lg font-black text-[#EE6425]">{studentSubmission?.self_score || 0} đ</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Minh chứng sinh viên nộp ({studentProofs.length})</h3>
                  {studentProofs.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Sinh viên chưa nộp minh chứng nào trong học kỳ này.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {studentProofs.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <div>
                            <span className="font-bold text-slate-800 block">{p.title}</span>
                            <span className="text-[11px] text-slate-500">{p.category_code} (+{p.points}đ)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <ProofLinks value={p.image} />
                            <button
                              onClick={() => handleApproveProof(p.id, p.status)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                                p.status === "Đã duyệt" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                              }`}
                            >
                              {p.status || "Chờ duyệt"}
                            </button>
                            <button
                              onClick={() => handleDeleteProof(p.id, p.title)}
                              className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                              title="Xóa minh chứng"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-[#004A52] uppercase">Bảng chấm điểm chi tiết (BCH Chi đoàn / Lớp chấm):</h3>

                  <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                    {DRL_SECTIONS_FULL.map((section) => {
                      const secScore = getOfficerSectionScore(section);
                      return (
                        <div key={section.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                          <div className="bg-slate-100 p-3 sm:p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-black text-[#004A52]">
                            <span>{section.title} (Tối đa {section.maxPoints} đ)</span>
                            <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-[#EE6425] self-start sm:self-auto">
                              Lớp chấm phần này: {secScore} / {section.maxPoints} đ
                            </span>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs min-w-[500px]">
                              <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                                  <th className="py-2.5 px-3 w-5/12">Nội dung đánh giá</th>
                                  <th className="py-2.5 px-2 text-center w-24">Quy định</th>
                                  <th className="py-2.5 px-2 text-center w-20">SV tự chấm</th>
                                  <th className="py-2.5 px-3 text-center w-28 text-[#EE6425]">Lớp chấm (đ)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {section.items.map((item) => {
                                  const svVal = studentSubmission?.scores_detail?.[item.id] || 0;
                                  const classVal = officerScores[item.id] !== undefined ? officerScores[item.id] : svVal;

                                  return (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                      <td className="py-3 px-3 text-slate-700">
                                        <span className="font-bold block text-slate-800 leading-snug">{item.title}</span>
                                        <span className="block text-[11px] italic text-slate-500 mt-1 leading-relaxed">{item.subtext}</span>
                                      </td>
                                      <td className="py-3 px-2 text-center font-bold text-slate-600 align-top pt-4">
                                        {item.maxLabel}
                                      </td>
                                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-600 align-top pt-4">
                                        {svVal} đ
                                      </td>
                                      <td className="py-3 px-3 text-center align-top pt-3">
                                        <div className="flex flex-col items-center">
                                          <input
                                            type="number"
                                            min="0"
                                            max={item.max}
                                            value={classVal}
                                            onChange={(e) => {
                                              const val = Math.max(0, Number(e.target.value) || 0);
                                              setOfficerScores((prev) => ({ ...prev, [item.id]: val }));
                                            }}
                                            className="w-16 border border-slate-300 rounded-lg py-1.5 text-center font-bold text-[#EE6425] outline-none"
                                          />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-orange-50/50 p-4 rounded-2xl">
                  <div>
                    <span className="text-xs text-slate-500 block">TỔNG ĐIỂM LỚP CHẤM CHÍNH THỨC:</span>
                    <span className="text-2xl font-black text-[#EE6425]">{grandOfficerTotalScore} / 100 điểm</span>
                  </div>

                  <button
                    onClick={handleSendFinalScore}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow transition uppercase tracking-wider"
                  >
                    Gửi bảng điểm chính thức về cho sinh viên
                  </button>
                </div>
              </>
            ) : (
              <div className="py-24 text-center text-xs text-slate-400">
                Vui lòng chọn một sinh viên ở danh sách bên trái để xem phiếu điểm và chấm điểm chi tiết.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

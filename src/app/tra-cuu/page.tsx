"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CongDRLPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"proof" | "form" | "result">("proof");

  // Dữ liệu minh chứng & hoạt động
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form nộp minh chứng ngoài khoa
  const [proofTitle, setProofTitle] = useState("");
  const [proofCategory, setProofCategory] = useState("Mục 1: Ý thức học tập");
  const [proofPoints, setProofPoints] = useState<number>(2);
  const [proofUrl, setProofUrl] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);

  // Trạng thái phiếu ĐRL
  const [drlScoreSelf, setDrlScoreSelf] = useState<number>(85);
  const [drlStatus, setDrlStatus] = useState<string>("Chưa nộp");
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ctut_current_user");
    if (!saved) {
      router.push("/dang-nhap?redirect=/tra-cuu");
      return;
    }
    const user = JSON.parse(saved);
    setCurrentUser(user);
    loadData(user.mssv);
  }, [router]);

  const loadData = async (mssv: string) => {
    setLoading(true);
    try {
      // 1. Lấy danh sách minh chứng & điểm danh hoạt động
      const { data: proofData } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", mssv)
        .order("created_at", { ascending: false });

      if (proofData) setProofs(proofData);

      // 2. Lấy tình trạng phiếu ĐRL đã nộp
      const { data: drlData } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", mssv)
        .maybeSingle();

      if (drlData) {
        setDrlStatus(drlData.status || "Đã nộp, chờ BCH duyệt");
        setFinalScore(drlData.final_score);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Nộp minh chứng hoạt động ngoài khoa
  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle || !proofUrl) {
      alert("Vui lòng điền đầy đủ tên hoạt động và đường link hình ảnh minh chứng!");
      return;
    }

    setSubmittingProof(true);
    try {
      const newProof = {
        mssv: currentUser.mssv,
        student_name: currentUser.fullName,
        student_class: currentUser.studentClass,
        activity_title: proofTitle,
        category: proofCategory,
        points: Number(proofPoints),
        proof_url: proofUrl,
        source: "Hoạt động ngoài khoa",
        status: "Chờ duyệt",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("proofs").insert([newProof]);
      if (error) throw error;

      alert("Nộp minh chứng thành công! Đã chuyển thông tin đến BCH Chi đoàn thẩm định.");
      setProofTitle("");
      setProofUrl("");
      loadData(currentUser.mssv);
    } catch (err: any) {
      alert("Lỗi khi nộp: " + err.message);
    }
    setSubmittingProof(false);
  };

  // Nộp toàn bộ phiếu ĐRL về BCH Chi đoàn
  const handleSubmitDRLForm = async () => {
    if (!confirm("Bạn có chắc chắn muốn nộp Phiếu đánh giá Điểm Rèn Luyện về BCH Chi đoàn lớp?")) return;

    try {
      const submission = {
        mssv: currentUser.mssv,
        student_name: currentUser.fullName,
        student_class: currentUser.studentClass,
        self_score: drlScoreSelf,
        status: "Đã nộp - Chờ BCH Chi đoàn duyệt",
        submitted_at: new Date().toISOString(),
      };

      await supabase.from("drl_submissions").upsert([submission], { onConflict: "mssv" });
      setDrlStatus("Đã nộp - Chờ BCH Chi đoàn duyệt");
      alert("Nộp phiếu ĐRL thành công!");
    } catch (err: any) {
      alert("Lỗi nộp phiếu: " + err.message);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER CHUẨN ĐẸP KHÔNG VỠ LAYOUT */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Logo & Tên trường */}
            <div className="flex items-center gap-3">
              <img
                src="/logo-doankhoa.png"
                alt="Logo Đoàn Khoa Kỹ thuật Cơ khí"
                className="w-14 h-14 object-contain flex-shrink-0"
              />
              <div className="border-l-2 border-orange-500 pl-3">
                <span className="block text-[11px] font-bold text-blue-900 uppercase">
                  Đoàn Trường ĐH Kỹ thuật - Công nghệ Cần Thơ
                </span>
                <span className="block text-sm font-black text-[#E05A10] uppercase">
                  Đoàn Khoa Kỹ thuật Cơ khí
                </span>
              </div>
            </div>

            {/* Tiêu đề Cổng */}
            <div className="text-center md:text-left">
              <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight uppercase">
                CỔNG ĐIỂM RÈN LUYỆN
              </h1>
            </div>

            {/* Nút về trang chủ */}
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* THÔNG TIN SINH VIÊN TỔNG QUAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-2">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs text-slate-500 font-medium">Họ và tên:</span>
              <span className="text-sm font-bold text-slate-800">{currentUser.fullName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs text-slate-500 font-medium">Mã số sinh viên:</span>
              <span className="text-sm font-bold text-[#EE6425] font-mono">{currentUser.mssv}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Lớp sinh hoạt:</span>
              <span className="text-sm font-bold text-slate-800">{currentUser.studentClass}</span>
            </div>
          </div>

          <div className="bg-[#004A52] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs font-semibold text-teal-100 uppercase tracking-wider">
              Điểm rèn luyện chính thức
            </span>
            <span className="text-4xl font-black my-1 text-white">
              {finalScore !== null ? finalScore : "--"}
            </span>
            <span className="text-[11px] text-teal-200 font-medium">
              Trạng thái: {drlStatus}
            </span>
          </div>
        </div>

        {/* 3 TAB CHỨC NĂNG CHÍNH */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => setActiveTab("proof")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "proof"
                  ? "bg-[#EE6425] text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              1. Nộp & Quản lý Minh chứng
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "form"
                  ? "bg-[#EE6425] text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              2. Nộp Phiếu Điểm Rèn Luyện
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "result"
                  ? "bg-[#EE6425] text-white shadow"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              3. Kết quả Điểm Rèn Luyện
            </button>
          </div>
        </div>

        {/* ================= NỘI DUNG TAB 1: NỘP MINH CHỨNG ================= */}
        {activeTab === "proof" && (
          <div className="space-y-6">
            {/* Form nộp minh chứng ngoài khoa */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-[#004A52] uppercase mb-4">
                Nộp minh chứng hoạt động ngoài khoa
              </h2>
              <form onSubmit={handleUploadProof} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên hoạt động / Phong trào *</label>
                  <input
                    type="text"
                    required
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="VD: Hiến máu nhân đạo, Tiếp sức mùa thi..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Hạng mục tiêu chí ĐRL *</label>
                  <select
                    value={proofCategory}
                    onChange={(e) => setProofCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  >
                    <option>Mục 1: Ý thức tham gia học tập</option>
                    <option>Mục 2: Ý thức chấp hành nội quy, quy chế</option>
                    <option>Mục 3: Hoạt động chính trị, xã hội, văn thể mỹ</option>
                    <option>Mục 4: Phẩm chất công dân & cộng đồng</option>
                    <option>Mục 5: Ý thức cán bộ lớp, thành tích đặc biệt</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Điểm cộng đề xuất</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={proofPoints}
                    onChange={(e) => setProofPoints(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Link hình ảnh / File minh chứng *</label>
                  <input
                    type="url"
                    required
                    value={proofUrl}
                    onChange={(e) => setProofUrl(e.target.value)}
                    placeholder="https://drive.google.com/... hoặc link ảnh"
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submittingProof}
                    className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition shadow"
                  >
                    {submittingProof ? "Đang gửi duyệt..." : "Tải lên & Gửi minh chứng cho BCH Chi đoàn"}
                  </button>
                </div>
              </form>
            </div>

            {/* Bảng danh sách minh chứng & lượt điểm danh tự động */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-[#004A52] uppercase">
                  Danh sách minh chứng & Điểm danh đã lưu ({proofs.length})
                </h2>
                <Link
                  href="/diem-danh"
                  className="px-3 py-1.5 rounded-lg bg-[#007A87] hover:bg-[#00606a] text-white font-bold text-xs"
                >
                  Quét QR Điểm danh sự kiện
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-6 text-xs text-slate-400">Đang tải minh chứng...</div>
              ) : proofs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Chưa có minh chứng hoặc lượt điểm danh nào. Hãy tham gia hoạt động hoặc nộp minh chứng ngoài khoa bên trên!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Hoạt động / Minh chứng</th>
                        <th className="py-2.5">Hạng mục</th>
                        <th className="py-2.5">Điểm</th>
                        <th className="py-2.5">Nguồn</th>
                        <th className="py-2.5">Trạng thái</th>
                        <th className="py-2.5 text-right">Xem</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {proofs.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 font-semibold text-slate-800">{p.activity_title}</td>
                          <td className="py-3 text-slate-600">{p.category}</td>
                          <td className="py-3 font-bold text-[#EE6425]">+{p.points}</td>
                          <td className="py-3 text-slate-500">{p.source || "Sự kiện Khoa"}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              p.status === "Đã duyệt" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {p.status || "Đã ghi nhận"}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {p.proof_url && (
                              <a
                                href={p.proof_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline font-bold"
                              >
                                Link ảnh
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= NỘI DUNG TAB 2: NỘP PHIẾU ĐIỂM RÈN LUYỆN ================= */}
        {activeTab === "form" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#004A52] uppercase">
                PHIẾU ĐÁNH GIÁ ĐIỂM RÈN LUYỆN HỌC KỲ
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Dữ liệu minh chứng đã lưu sẽ tự động được đối chiếu vào từng mục. Sinh viên kiểm tra, tự chấm và bấm nộp cho BCH Chi đoàn.
              </p>
            </div>

            {/* Bảng phiếu đánh giá từng tiêu chí */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>I. Đánh giá về ý thức tham gia học tập (Tối đa 20đ)</span>
                  <span className="text-[#EE6425]">18 / 20đ</span>
                </div>
                <p className="text-[11px] text-slate-500">Minh chứng: Điểm danh học tập, không vi phạm quy chế thi cử.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>II. Đánh giá về ý thức chấp hành nội quy, quy chế (Tối đa 25đ)</span>
                  <span className="text-[#EE6425]">25 / 25đ</span>
                </div>
                <p className="text-[11px] text-slate-500">Minh chứng: Chấp hành tốt quy định của Nhà trường và Pháp luật.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>III. Đánh giá về ý thức tham gia hoạt động CT - XH, VH - VN - TT (Tối đa 20đ)</span>
                  <span className="text-[#EE6425]">20 / 20đ</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Minh chứng kéo từ Tab 1: Đã tham gia {proofs.length} hoạt động được ghi nhận.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>IV. Đánh giá về phẩm chất công dân và quan hệ cộng đồng (Tối đa 25đ)</span>
                  <span className="text-[#EE6425]">22 / 25đ</span>
                </div>
                <p className="text-[11px] text-slate-500">Minh chứng: Tham gia giữ gìn vệ sinh, lối sống lành mạnh.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between font-bold text-slate-800">
                  <span>V. Ý thức tham gia công tác phụ trách lớp, đoàn thể (Tối đa 10đ)</span>
                  <span className="text-[#EE6425]">0 / 10đ</span>
                </div>
                <p className="text-[11px] text-slate-500">Minh chứng: Cán bộ Đoàn - Hội, Ban Cán sự lớp.</p>
              </div>
            </div>

            {/* Tổng điểm tự chấm & nút nộp */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-slate-500 block">Tổng điểm sinh viên tự chấm:</span>
                <span className="text-2xl font-black text-[#EE6425]">{drlScoreSelf} / 100 điểm</span>
              </div>

              <button
                onClick={handleSubmitDRLForm}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow-md transition"
              >
                NỘP PHIẾU ĐIỂM RÈN LUYỆN VỀ BCH CHI ĐOÀN
              </button>
            </div>
          </div>
        )}

        {/* ================= NỘI DUNG TAB 3: KẾT QUẢ ĐIỂM RÈN LUYỆN ================= */}
        {activeTab === "result" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
            <h2 className="text-base font-black text-[#004A52] uppercase">
              KẾT QUẢ ĐIỂM RÈN LUYỆN CHÍNH THỨC
            </h2>

            <div className="py-6">
              <span className="text-5xl font-black text-[#EE6425]">
                {finalScore !== null ? finalScore : drlScoreSelf}
              </span>
              <span className="block text-xs font-bold text-slate-500 mt-2">
                Xếp loại: { (finalScore || drlScoreSelf) >= 90 ? "Xuất sắc" : (finalScore || drlScoreSelf) >= 80 ? "Tốt" : "Khá" }
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 max-w-md mx-auto text-xs text-teal-800 font-medium leading-relaxed">
              Trạng thái xét duyệt: <strong>{drlStatus}</strong>. Sau khi BCH Chi đoàn lớp và Đoàn Khoa thẩm định hoàn tất, điểm chính thức sẽ được công bố tại đây.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

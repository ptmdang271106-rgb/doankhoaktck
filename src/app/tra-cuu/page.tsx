"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// BẢNG ĐẦY ĐỦ 100% CÁC TIÊU CHÍ VÀ ĐIỂM TỐI ĐA THEO QUYẾT ĐỊNH 147/QĐ-ĐHKTCN
export const FULL_CRITERIA_LIST = [
  // TIÊU CHÍ I (Tối đa 20đ)
  { code: "I.1", label: "I.1 Điểm TB học tập tích lũy thang điểm 4 (TB: 2đ, Khá: 3đ, Giỏi: 4đ, Xuất sắc: 5đ)", max: 5 },
  { code: "I.2", label: "I.2 Giấy chứng nhận tham gia học lớp chuyên đề kỹ năng học tập", max: 3 },
  { code: "I.3", label: "I.3 Hội thảo / Tọa đàm do Khoa hoặc Trường tổ chức (Trực tiếp: 3đ, Trực tuyến: 1đ)", max: 3 },
  { code: "I.4", label: "I.4 Cuộc thi học thuật cấp Khoa/Trường (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 3đ, Khuyến khích: 4đ, Nhì/Ba: 5đ, Nhất: 6đ, Đặc biệt: 7đ)", max: 7 },
  { code: "I.5", label: "I.5 Cuộc thi học thuật ngoài Trường (Cổ vũ: 2đ, BTC: 3đ, Tham gia: 4đ, Khuyến khích: 5đ, Nhì/Ba: 6đ, Nhất: 7đ, Đặc biệt: 8đ)", max: 8 },
  { code: "I.6", label: "I.6 Báo cáo khoa học cấp Khoa (TB: 3đ, Khá: 4đ, Tốt: 6đ, Xuất sắc: 8đ)", max: 8 },
  { code: "I.7", label: "I.7 Tham gia đề tài NCKH cấp Trường (TB: 5đ, Khá: 6đ, Tốt: 8đ, Xuất sắc: 10đ)", max: 10 },
  { code: "I.8", label: "I.8 Viết bài báo khoa học trong và ngoài Trường (Kỷ yếu: 5đ, Tạp chí: 8đ)", max: 8 },
  { code: "I.9", label: "I.9 Cuộc thi khởi nghiệp do Trường tổ chức (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 3đ, Khuyến khích: 4đ, Nhì/Ba: 5đ, Nhất: 6đ, Đặc biệt: 7đ)", max: 7 },
  { code: "I.10", label: "I.10 Cuộc thi khởi nghiệp ngoài Trường (Cổ vũ: 2đ, BTC: 3đ, Tham gia: 4đ, Khuyến khích: 5đ, Nhì/Ba: 6đ, Nhất: 7đ, Đặc biệt: 8đ)", max: 8 },
  { code: "I.11", label: "I.11 Thành viên các câu lạc bộ học thuật cấp Khoa, Trường (2đ/học kỳ)", max: 2 },
  { code: "I.12", label: "I.12 Các hoạt động học thuật khác (Trực tiếp: 3đ, Trực tuyến: 1đ)", max: 3 },

  // TIÊU CHÍ II (Tối đa 25đ)
  { code: "II.1", label: "II.1 Ý thức, thái độ trong học tập (Đi học đầy đủ 5đ, nghỉ ko phép -3đ, trễ/bỏ tiết -1đ)", max: 5 },
  { code: "II.2", label: "II.2 Chấp hành nội quy, quy chế Nhà trường (Tốt: 5đ, kỷ luật: -5đ)", max: 5 },
  { code: "II.3", label: "II.3 Chấp hành quy chế thi cử, cuộc thi (Tốt: 5đ, kỷ luật: -5đ)", max: 5 },
  { code: "II.4", label: "II.4 Chấp hành quy định của Thư viện (Tốt: 5đ, kỷ luật: -5đ)", max: 5 },
  { code: "II.5", label: "II.5 Chấp hành quy định phòng học, phòng máy, xưởng thực hành (Tốt: 5đ, kỷ luật: -5đ)", max: 5 },
  { code: "II.6", label: "II.6 Thực hiện đăng ký ngoại trú đúng hạn (Tốt: 5đ, kỷ luật: -5đ)", max: 5 },
  { code: "II.7", label: "II.7 Mặc đồng phục đúng quy định (Tốt: 5đ, kỷ luật: -5đ)", max: 5 },
  { code: "II.8", label: "II.8 Sinh hoạt lớp với Cố vấn học tập (Tham gia: 5đ, vắng ko lý do: -5đ)", max: 5 },

  // TIÊU CHÍ III (Tối đa 20đ)
  { code: "III.1", label: "III.1 Hoạt động bắt buộc do Khoa hoặc Trường tổ chức (Tham gia: +3đ, vắng: -3đ)", max: 3 },
  { code: "III.2", label: "III.2 Đại hội Chi đoàn/Chi hội, sinh hoạt Chi đoàn/Chi hội (Tham gia: +3đ, vắng: -3đ)", max: 3 },
  { code: "III.3", label: "III.3 Báo cáo chuyên đề do Trường tổ chức (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 4đ)", max: 4 },
  { code: "III.4", label: "III.4 Ngoại khóa / Cuộc thi do CLB, Khoa, Trường tổ chức (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 3đ, KK: 4đ, Nhì/Ba: 5đ, Nhất: 6đ, ĐB: 7đ)", max: 7 },
  { code: "III.5", label: "III.5 Ngoại khóa / Cuộc thi từ cấp Thành phố trở lên (Cổ vũ: 1đ, BTC: 3đ, Tham gia: 4đ, KK: 5đ, Nhì/Ba: 6đ, Nhất: 7đ, ĐB: 8đ)", max: 8 },
  { code: "III.6", label: "III.6 Được kết nạp Đoàn (Cộng 5đ vào học kỳ kết nạp)", max: 5 },
  { code: "III.7", label: "III.7 Được kết nạp Đảng (Cộng 8đ vào học kỳ kết nạp)", max: 8 },
  { code: "III.8", label: "III.8 Hoạt động phong trào do Đoàn/Hội điều động (Tham gia: 2đ, BTC: 4đ)", max: 4 },
  { code: "III.9", label: "III.9 Thành viên CLB, đội, nhóm thuộc Đoàn - Hội (2đ/học kỳ)", max: 2 },
  { code: "III.10", label: "III.10 Hoạt động học tập các bài lý luận chính trị (4đ/lần)", max: 4 },
  { code: "III.11", label: "III.11 Hoạt động đền ơn đáp nghĩa, Thắp nến tri ân (3đ/lần)", max: 3 },
  { code: "III.12", label: "III.12 Hoạt động lao động tình nguyện tại Trường (3đ/lần)", max: 3 },
  { code: "III.13", label: "III.13 Khen thưởng phong trào cá nhân (Giấy khen: 5đ, Bằng khen: 7đ)", max: 7 },
  { code: "III.14", label: "III.14 Tập thể được khen thưởng phong trào (1đ/SV)", max: 1 },
  { code: "III.15", label: "III.15 Các hoạt động phong trào khác (Trực tiếp: 3đ, Trực tuyến: 1đ)", max: 3 },

  // TIÊU CHÍ IV (Tối đa 25đ)
  { code: "IV.1", label: "IV.1 Chấp hành pháp luật Nhà nước (Tốt: 10đ, có thông báo công an: -5đ)", max: 10 },
  { code: "IV.2", label: "IV.2 Hành vi tốt, tinh thần sẻ chia, giúp đỡ người yếu thế có xác nhận (5đ/lần)", max: 5 },
  { code: "IV.3", label: "IV.3 Biểu dương, khen thưởng hoạt động xã hội ngoài trường (5đ/lần)", max: 5 },
  { code: "IV.4", label: "IV.4 Chương trình Giao lưu các CLB, Đội, Nhóm trực thuộc (Tham gia: 3đ, BTC: 5đ)", max: 5 },
  { code: "IV.5", label: "IV.5 Chương trình Tư vấn tuyển sinh (5đ/lần)", max: 5 },
  { code: "IV.6", label: "IV.6 Công tác hỗ trợ nhập học sinh viên mới (5đ/lần)", max: 5 },
  { code: "IV.7", label: "IV.7 Công tác khám sức khỏe sinh viên đầu khóa (5đ/lần)", max: 5 },
  { code: "IV.8", label: "IV.8 Công tác tổ chức Ngày hội việc làm (5đ/lần)", max: 5 },
  { code: "IV.9", label: "IV.9 Công tác hỗ trợ Lễ Tốt nghiệp (5đ/lần)", max: 5 },
  { code: "IV.10", label: "IV.10 Công tác kiểm tra hồ sơ sinh viên (5đ/lần)", max: 5 },
  { code: "IV.11", label: "IV.11 Tham gia các phiên giao dịch việc làm (Tư vấn: 1đ, TT DVVL: 2đ, Khu vực: 3đ)", max: 3 },
  { code: "IV.12", label: "IV.12 Hiến máu tình nguyện (Tham gia: 10đ, BTC: 5đ)", max: 10 },
  { code: "IV.13", label: "IV.13 Chương trình Xuân tình nguyện (Tham gia: 4đ, BTC: 5đ)", max: 5 },
  { code: "IV.14", label: "IV.14 Chiến dịch Tình nguyện Mùa hè xanh (Tham gia: 5đ, BTC: 7đ)", max: 7 },
  { code: "IV.15", label: "IV.15 Chương trình Ngày Chủ nhật xanh (Tham gia: 3đ, BTC: 5đ)", max: 5 },
  { code: "IV.16", label: "IV.16 Chương trình Thứ Bảy tình nguyện (Tham gia: 3đ, BTC: 5đ)", max: 5 },
  { code: "IV.17", label: "IV.17 Chương trình Chào đón tân sinh viên (Tham gia: 3đ, BTC: 5đ)", max: 5 },
  { code: "IV.18", label: "IV.18 Hoạt động trách nhiệm xã hội & phát triển bền vững (Trực tiếp: 3đ, Online: 1đ)", max: 3 },

  // TIÊU CHÍ V (Tối đa 10đ)
  { code: "V.1", label: "V.1 Tham gia tích cực phong trào Lớp, Đoàn, Hội (3đ/học kỳ)", max: 3 },
  { code: "V.2", label: "V.2 Cán bộ Lớp/Đoàn/Hội hoàn thành tốt nhiệm vụ (Lớp trưởng/BCH Đoàn: 5đ, UVBCH Chi đoàn: 3đ, Đội phó/Phó CLB: 4đ)", max: 5 },
  { code: "V.3", label: "V.3 Sinh viên đạt giải học tập, NCKH (Cấp TP: KK 3đ, Ba 4đ, Nhì 5đ, Nhất 6đ; Toàn quốc: KK 4đ, Ba 5đ, Nhì 6đ, Nhất 7đ)", max: 7 },
  { code: "V.4", label: "V.4 Bằng khen của UBND Tỉnh, Thành phố trở lên (5đ/lần)", max: 5 },
  { code: "V.5", label: "V.5 Sinh viên 5 Tốt cấp Trường, Đoàn viên tiêu biểu, Thanh niên tiên tiến làm theo lời Bác (6đ/lần)", max: 6 },
  { code: "V.6", label: "V.6 Sinh viên 5 Tốt cấp Thành/Trung ương, Giải thưởng Sao Tháng Giêng (10đ/lần)", max: 10 },
  { code: "V.7", label: "V.7 Đạt danh hiệu Đoàn viên ưu tú (6đ/lần)", max: 6 },
  { code: "V.8", label: "V.8 Giấy khen tập thể của Đoàn trao tặng (2đ/SV)", max: 2 },
];

export default function CongDRLPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"proof" | "sheet" | "result">("proof");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Dữ liệu Minh chứng (Tab 1)
  const [proofs, setProofs] = useState<any[]>([]);
  const [proofTitle, setProofTitle] = useState("");
  const [proofCategory, setProofCategory] = useState("III.8");
  const [proofPoints, setProofPoints] = useState<number>(4);
  const [maxAllowedPoints, setMaxAllowedPoints] = useState<number>(4);
  const [proofImage, setProofImage] = useState("");

  // Dữ liệu Phiếu tự chấm (Tab 2)
  const [selfScores, setSelfScores] = useState<{ [key: string]: number }>({
    "II.1": 5, "II.2": 5, "II.3": 5, "II.4": 5, "II.5": 5, "IV.1": 10
  });
  const [submittedSheet, setSubmittedSheet] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/tra-cuu");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // Tải danh sách minh chứng
    const allProofs = JSON.parse(localStorage.getItem("ctut_student_proofs") || "[]");
    const myProofs = allProofs.filter((p: any) => p.mssv === user.mssv);
    setProofs(myProofs);

    // Tính điểm tự động từ minh chứng đã duyệt
    const initialScores: any = { "II.1": 5, "II.2": 5, "II.3": 5, "II.4": 5, "II.5": 5, "IV.1": 10 };
    myProofs.forEach((p: any) => {
      if (p.status === "Đã duyệt" || p.source === "Điểm danh QR") {
        initialScores[p.categoryCode] = (initialScores[p.categoryCode] || 0) + Number(p.points);
      }
    });
    setSelfScores(initialScores);

    // Tải phiếu đã nộp
    const allSheets = JSON.parse(localStorage.getItem("ctut_submitted_sheets") || "[]");
    const mySheet = allSheets.find((s: any) => s.mssv === user.mssv);
    if (mySheet) setSubmittedSheet(mySheet);
  }, [router]);

  // KHI ĐỔI HẠNG MỤC: TỰ ĐỘNG CẬP NHẬT ĐIỂM ĐỀ XUẤT BẰNG ĐIỂM TỐI ĐA CỦA HẠNG MỤC ĐÓ
  const handleCategoryChange = (selectedCode: string) => {
    setProofCategory(selectedCode);
    const item = FULL_CRITERIA_LIST.find((c) => c.code === selectedCode);
    if (item) {
      setProofPoints(item.max);
      setMaxAllowedPoints(item.max);
    }
  };

  const handleUploadProofImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProofImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAddProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle) return alert("Vui lòng nhập tên hoạt động / minh chứng!");

    if (proofPoints > maxAllowedPoints) {
      return alert(`Điểm đề xuất không được vượt quá mức tối đa (${maxAllowedPoints} điểm) của hạng mục này!`);
    }

    const newProof = {
      id: "proof-" + Date.now().toString(),
      mssv: currentUser.mssv,
      fullName: currentUser.fullName,
      title: proofTitle,
      categoryCode: proofCategory,
      points: Number(proofPoints),
      image: proofImage || "",
      source: "Sinh viên tự nộp",
      status: "Chờ BCH Chi đoàn duyệt",
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const allProofs = JSON.parse(localStorage.getItem("ctut_student_proofs") || "[]");
    const updated = [newProof, ...allProofs];
    localStorage.setItem("ctut_student_proofs", JSON.stringify(updated));

    setProofs([newProof, ...proofs]);
    setProofTitle("");
    setProofImage("");
    alert("Đã nộp minh chứng thành công! Đang chờ BCH Chi đoàn xem xét.");
  };

  // Tính tổng điểm chuẩn 5 tiêu chí
  const calculateTotalScore = () => {
    const sections = [
      { prefix: "I.", max: 20 },
      { prefix: "II.", max: 25 },
      { prefix: "III.", max: 20 },
      { prefix: "IV.", max: 25 },
      { prefix: "V.", max: 10 },
    ];

    let grandTotal = 0;
    sections.forEach((sec) => {
      let secSum = 0;
      FULL_CRITERIA_LIST.filter((c) => c.code.startsWith(sec.prefix)).forEach((item) => {
        secSum += selfScores[item.code] || 0;
      });
      grandTotal += Math.min(secSum, sec.max);
    });
    return Math.min(grandTotal, 100);
  };

  const handleSubmitScoreSheet = () => {
    const total = calculateTotalScore();
    const sheetData = {
      mssv: currentUser.mssv,
      fullName: currentUser.fullName,
      studentClass: currentUser.studentClass || "CK24A1",
      scores: selfScores,
      totalScore: total,
      status: "Đã nộp - Chờ BCH Chi đoàn duyệt",
      submittedAt: new Date().toLocaleDateString("vi-VN"),
    };

    const allSheets = JSON.parse(localStorage.getItem("ctut_submitted_sheets") || "[]");
    const filtered = allSheets.filter((s: any) => s.mssv !== currentUser.mssv);
    const updated = [sheetData, ...filtered];

    localStorage.setItem("ctut_submitted_sheets", JSON.stringify(updated));
    setSubmittedSheet(sheetData);
    alert(`Đã nộp Phiếu ĐRL lên BCH Chi đoàn với tổng điểm tự đánh giá: ${total} điểm!`);
    setActiveTab("result");
  };

  const getRank = (score: number) => {
    if (score >= 90) return { text: "Xuất sắc", color: "text-purple-600 bg-purple-50" };
    if (score >= 80) return { text: "Tốt", color: "text-emerald-600 bg-emerald-50" };
    if (score >= 65) return { text: "Khá", color: "text-blue-600 bg-blue-50" };
    if (score >= 50) return { text: "Trung bình", color: "text-amber-600 bg-amber-50" };
    return { text: "Yếu / Kém", color: "text-red-600 bg-red-50" };
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img src="/logo-doankhoa.png" alt="Logo" className="h-12 w-auto object-contain cursor-pointer" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#004A52]">CỔNG ĐIỂM RÈN LUYỆN (ĐRL)</h1>
              <p className="text-xs text-slate-500">Ban hành theo QĐ 147/QĐ-ĐHKTCN Trường ĐH Kỹ thuật - Công nghệ Cần Thơ</p>
            </div>
          </div>
          <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">← Về trang chủ</Link>
        </div>

        {/* 3 TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("proof")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === "proof" ? "bg-[#EE6425] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            1. Nộp & Quản lý Minh chứng ({proofs.length})
          </button>
          <button
            onClick={() => setActiveTab("sheet")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === "sheet" ? "bg-[#EE6425] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            2. Phiếu Tự Đánh Giá ĐRL (Theo QĐ 147)
          </button>
          <button
            onClick={() => setActiveTab("result")}
            className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition ${
              activeTab === "result" ? "bg-[#EE6425] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200"
            }`}
          >
            3. Kết Quả & Điểm Rèn Luyện
          </button>
        </div>

        {/* TAB 1: NỘP MINH CHỨNG VỚI DANH SÁCH 100% CÁC HẠNG MỤC */}
        {activeTab === "proof" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-[#004A52] mb-1 uppercase">Nộp minh chứng hoạt động</h2>
              <p className="text-[11px] text-slate-500 mb-4">Chọn đúng hạng mục theo Quyết định 147 để được cộng điểm chính xác.</p>
              
              <form onSubmit={handleAddProof} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên hoạt động / Minh chứng *</label>
                  <input
                    type="text"
                    required
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="VD: Tham gia Hội thao Cơ khí, Giấy chứng nhận hiến máu..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                {/* DROPDOWN TOÀN BỘ CÁC HẠNG MỤC */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạng mục quy định *</label>
                  <select
                    value={proofCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-medium outline-none focus:border-[#EE6425]"
                  >
                    <optgroup label="TIÊU CHÍ I: Ý THỨC HỌC TẬP (TỐI ĐA 20 ĐIỂM)">
                      {FULL_CRITERIA_LIST.filter((c) => c.code.startsWith("I.")).map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </optgroup>

                    <optgroup label="TIÊU CHÍ II: NỘI QUY & QUY CHẾ (TỐI ĐA 25 ĐIỂM)">
                      {FULL_CRITERIA_LIST.filter((c) => c.code.startsWith("II.")).map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </optgroup>

                    <optgroup label="TIÊU CHÍ III: HOẠT ĐỘNG CHÍNH TRỊ - XÃ HỘI (TỐI ĐA 20 ĐIỂM)">
                      {FULL_CRITERIA_LIST.filter((c) => c.code.startsWith("III.")).map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </optgroup>

                    <optgroup label="TIÊU CHÍ IV: QUAN HỆ CỘNG ĐỒNG & TÌNH NGUYỆN (TỐI ĐA 25 ĐIỂM)">
                      {FULL_CRITERIA_LIST.filter((c) => c.code.startsWith("IV.")).map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </optgroup>

                    <optgroup label="TIÊU CHÍ V: CÁN BỘ LỚP & THÀNH TÍCH ĐẶC BIỆT (TỐI ĐA 10 ĐIỂM)">
                      {FULL_CRITERIA_LIST.filter((c) => c.code.startsWith("V.")).map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Ô ĐIỂM ĐỀ XUẤT: TỰ NHẬP ĐIỂM MAX & GIỚI HẠN CHÍNH XÁC */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">Điểm cộng đề xuất *</label>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                      Tối đa theo mục: {maxAllowedPoints} điểm
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={maxAllowedPoints}
                    required
                    value={proofPoints}
                    onChange={(e) => setProofPoints(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-[#EE6425] outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh chụp minh chứng (Bằng khen, Giấy xác nhận, Ảnh check-in)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadProofImage}
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-orange-50 file:text-[#EE6425]"
                  />
                  {proofImage && (
                    <img src={proofImage} alt="Preview" className="mt-2 h-28 w-auto rounded-lg object-contain border border-slate-200" />
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow tracking-wider"
                >
                  Nộp minh chứng
                </button>
              </form>
            </div>

            {/* DANH SÁCH MINH CHỨNG */}
            <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
              <h2 className="text-sm font-bold text-[#004A52] mb-3 uppercase">Kho lưu trữ minh chứng ({proofs.length})</h2>
              {proofs.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center">Chưa có minh chứng nào.</p>
              ) : (
                <div className="space-y-3">
                  {proofs.map((p) => (
                    <div key={p.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">Mục {p.categoryCode}</span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">+{p.points} Điểm</span>
                          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">{p.status}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 mt-1">{p.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">Nguồn: {p.source} • Ngày: {p.createdAt}</p>
                      </div>
                      {p.image && (
                        <a href={p.image} target="_blank" rel="noreferrer" className="text-xs font-bold text-[#007A87] hover:underline flex-shrink-0">
                          Xem ảnh
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PHIẾU ĐIỂM THEO ĐẦY ĐỦ 5 TIÊU CHÍ */}
        {activeTab === "sheet" && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-4">
              <div>
                <h2 className="text-base font-black text-[#004A52]">PHIẾU ĐÁNH GIÁ KẾT QUẢ RÈN LUYỆN SINH VIÊN</h2>
                <p className="text-xs text-slate-500">Họ và tên: <strong>{currentUser?.fullName}</strong> • MSSV: <strong>{currentUser?.mssv}</strong> • Lớp: <strong>{currentUser?.studentClass || "Khoa Cơ Khí"}</strong></p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500 block">Tổng điểm tự chấm:</span>
                <span className="text-2xl font-black text-[#EE6425]">{calculateTotalScore()} / 100 Điểm</span>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { prefix: "I.", title: "I. Đánh giá về ý thức tham gia học tập", maxSec: 20 },
                { prefix: "II.", title: "II. Đánh giá về ý thức chấp hành nội quy, quy chế Nhà trường", maxSec: 25 },
                { prefix: "III.", title: "III. Ý thức tham gia hoạt động chính trị, xã hội, văn hóa, thể thao", maxSec: 20 },
                { prefix: "IV.", title: "IV. Đánh giá về ý thức công dân trong quan hệ cộng đồng", maxSec: 25 },
                { prefix: "V.", title: "V. Ý thức và kết quả khi tham gia công tác cán bộ lớp, đoàn thể", maxSec: 10 },
              ].map((sec) => (
                <div key={sec.prefix} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <div className="bg-slate-100 p-3 font-bold text-xs text-[#004A52] flex justify-between">
                    <span>{sec.title}</span>
                    <span className="text-orange-600">Tối đa: {sec.maxSec} điểm</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {FULL_CRITERIA_LIST.filter((c) => c.code.startsWith(sec.prefix)).map((item) => (
                      <div key={item.code} className="p-3 flex items-center justify-between gap-4 hover:bg-slate-50">
                        <span className="flex-1 text-slate-700">{item.label}</span>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[11px] text-slate-400">(Tối đa {item.max}đ)</span>
                          <input
                            type="number"
                            min="0"
                            max={item.max}
                            value={selfScores[item.code] || 0}
                            onChange={(e) => setSelfScores({ ...selfScores, [item.code]: Number(e.target.value) })}
                            className="w-16 border border-slate-300 rounded-lg p-1.5 text-center font-bold text-[#004A52] outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t flex justify-end">
              <button
                onClick={handleSubmitScoreSheet}
                className="bg-[#EE6425] hover:bg-[#d85216] text-white font-black px-8 py-3 rounded-2xl transition shadow-md uppercase text-xs tracking-wider"
              >
                ✓ Nộp phiếu điểm lên BCH Chi đoàn lớp
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: KẾT QUẢ ĐIỂM */}
        {activeTab === "result" && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-lg font-black text-[#004A52] uppercase">KẾT QUẢ ĐIỂM RÈN LUYỆN HỌC KỲ</h2>
            
            {submittedSheet ? (
              <div className="space-y-4">
                <div className="p-6 bg-orange-50 border border-orange-200 rounded-3xl inline-block w-full">
                  <span className="text-xs font-bold text-slate-500 uppercase">Tổng điểm ghi nhận</span>
                  <div className="text-5xl font-black text-[#EE6425] my-2">{submittedSheet.totalScore} <span className="text-xl">/ 100</span></div>
                  <span className={`inline-block text-xs font-black px-3.5 py-1 rounded-full uppercase ${getRank(submittedSheet.totalScore).color}`}>
                    Xếp loại: {getRank(submittedSheet.totalScore).text}
                  </span>
                </div>

                <div className="text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
                  <p>Sinh viên: <strong>{submittedSheet.fullName}</strong> ({submittedSheet.mssv})</p>
                  <p>Lớp: <strong>{submittedSheet.studentClass}</strong></p>
                  <p>Ngày nộp: <strong>{submittedSheet.submittedAt}</strong></p>
                  <p className="text-emerald-700 font-bold">Trạng thái: {submittedSheet.status}</p>
                </div>
              </div>
            ) : (
              <div className="py-8 text-xs text-slate-400">
                Bạn chưa nộp phiếu điểm rèn luyện nào. Hãy hoàn thành tại Tab <strong>"2. Phiếu Tự Đánh Giá ĐRL"</strong>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

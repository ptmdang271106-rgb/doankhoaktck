"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Cấu trúc bảng tiêu chí đánh giá ĐRL chuẩn CTUET
const DRL_SECTIONS = [
  {
    id: "sec1",
    title: "I. Đánh giá về ý thức tham gia học tập",
    maxPoints: 20,
    items: [
      { id: "1_1", text: "1. Điểm trung bình học tập tích lũy hệ 4 (TB: 2đ, Khá: 3đ, Giỏi: 4đ, Xuất sắc: 5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "" },
      { id: "1_2", text: "2. Giấy chứng nhận tham gia học các lớp kỹ năng học tập", max: 3, maxLabel: "3 đ/kỳ", minus: "" },
      { id: "1_3", text: "3. Hội thảo / Tọa đàm Khoa hoặc Trường (Trực tiếp: 3đ, Online: 1đ)", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "1_4", text: "4. Cuộc thi học thuật cấp Khoa/Trường (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 3đ, Giải: 4-7đ)", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "1_5", text: "5. Cuộc thi học thuật bên ngoài Trường (Cổ vũ: 2đ, BTC: 3đ, Tham gia: 4đ, Giải: 5-8đ)", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_6", text: "6. Báo cáo khoa học cấp Khoa (TB: 3đ, Khá: 4đ, Tốt: 6đ, Xuất sắc: 8đ)", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_7", text: "7. Đề tài NCKH cấp Trường (TB: 5đ, Khá: 6đ, Tốt: 8đ, Xuất sắc: 10đ)", max: 10, maxLabel: "10 đ/lần", minus: "" },
      { id: "1_8", text: "8. Viết bài báo khoa học (Kỷ yếu: 5đ, Tạp chí: 8đ)", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_9", text: "9. Cuộc thi khởi nghiệp cấp Trường (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 3đ, Giải: 4-7đ)", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "1_10", text: "10. Cuộc thi khởi nghiệp bên ngoài Trường (Cổ vũ: 2đ, BTC: 3đ, Tham gia: 4đ, Giải: 5-8đ)", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_11", text: "11. Thành viên CLB học thuật cấp Khoa/Trường", max: 2, maxLabel: "2 đ/kỳ", minus: "" },
      { id: "1_12", text: "12. Các hoạt động học tập khác (Trực tiếp: 3đ, Trực tuyến: 1đ)", max: 3, maxLabel: "3 đ/lần", minus: "" },
    ],
  },
  {
    id: "sec2",
    title: "II. Ý thức chấp hành nội quy, quy chế và các quy định của Nhà trường",
    maxPoints: 25,
    items: [
      { id: "2_1", text: "1. Ý thức, thái độ học tập (Đi học đầy đủ +5đ; Nghỉ K.phép -3đ/b; Muộn/Bỏ tiết -1đ; Cấm thi -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_2", text: "2. Chấp hành tốt nội quy, quy chế trường (+5đ; Kỷ luật -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_3", text: "3. Thực hiện tốt quy chế khi tham gia các kỳ thi (+5đ; Vi phạm -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_4", text: "4. Chấp hành quy định của Thư viện (+5đ; Vi phạm -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_5", text: "5. Chấp hành quy định phòng học, phòng máy, xưởng (+5đ; Vi phạm -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_6", text: "6. Thực hiện đăng ký ngoại trú đúng hạn (+5đ; Không đăng ký -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_7", text: "7. Mặc đồng phục đúng quy định (+5đ; Vi phạm -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_8", text: "8. Sinh hoạt lớp với Cố vấn học tập (+5đ; Vắng không phép -5đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
    ],
  },
  {
    id: "sec3",
    title: "III. Ý thức tham gia hoạt động chính trị, XH, VH-VN-TT, phòng chống tệ nạn",
    maxPoints: 20,
    items: [
      { id: "3_1", text: "1. Hoạt động bắt buộc do Khoa/Trường tổ chức (+3đ/lần; Vắng -3đ/lần)", max: 3, maxLabel: "3 đ/lần", minus: "-3 đ/lần" },
      { id: "3_2", text: "2. Đại hội Chi Đoàn/Chi Hội; sinh hoạt Chi Đoàn (+3đ/lần; Vắng -3đ/lần)", max: 3, maxLabel: "3 đ/lần", minus: "-3 đ/lần" },
      { id: "3_3", text: "3. Báo cáo chuyên đề Trường tổ chức (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 4đ)", max: 4, maxLabel: "4 đ/lần", minus: "" },
      { id: "3_4", text: "4. Ngoại khóa/Cuộc thi cấp CLB, Khoa, Trường (Cổ vũ: 1đ, BTC: 2đ, Tham gia: 3đ, Giải: 4-7đ)", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "3_5", text: "5. Ngoại khóa/Cuộc thi cấp Thành phố trở lên (Cổ vũ: 1đ, BTC: 3đ, Tham gia: 4đ, Giải: 5-8đ)", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "3_6", text: "6. Được kết nạp Đoàn trong học kỳ", max: 5, maxLabel: "5 đ/kỳ", minus: "" },
      { id: "3_7", text: "7. Được kết nạp Đảng trong học kỳ", max: 8, maxLabel: "8 đ/kỳ", minus: "" },
      { id: "3_8", text: "8. Phong trào do Đoàn/Hội điều động (Tham gia: 2đ, BTC: 4đ)", max: 4, maxLabel: "4 đ/lần", minus: "" },
      { id: "3_9", text: "9. Thành viên CLB, Đội, Nhóm thuộc Đoàn Thanh niên - Hội Sinh viên", max: 2, maxLabel: "2 đ/kỳ", minus: "" },
      { id: "3_10", text: "10. Hoạt động 'Học tập các bài lý luận chính trị'", max: 4, maxLabel: "4 đ/lần", minus: "" },
      { id: "3_11", text: "11. Đền ơn đáp nghĩa, Thắp nến tri ân", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "3_12", text: "12. Hoạt động lao động tình nguyện tại Trường", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "3_13", text: "13. Được khen thưởng phong trào (Giấy khen: 5đ, Bằng khen: 7đ)", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "3_14", text: "14. Tập thể được khen thưởng trong phong trào", max: 1, maxLabel: "1 đ/lần", minus: "" },
      { id: "3_15", text: "15. Các hoạt động phong trào khác (Trực tiếp: 3đ, Online: 1đ)", max: 3, maxLabel: "3 đ/lần", minus: "" },
    ],
  },
  {
    id: "sec4",
    title: "IV. Đánh giá về ý thức công dân trong quan hệ cộng đồng",
    maxPoints: 25,
    items: [
      { id: "4_1", text: "1. Chấp hành pháp luật, an toàn giao thông (+10đ; Công an báo về: -5đ)", max: 10, maxLabel: "10 đ/lần", minus: "-5 đ/lần" },
      { id: "4_2", text: "2. Hành vi tốt, giúp đỡ người yếu thế có giấy chứng nhận từ cấp xã/trường", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_3", text: "3. Khen thưởng hoạt động xã hội cộng đồng ngoài trường", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_4", text: "4. Chương trình Giao lưu các CLB, Đội, Nhóm (Tham gia: 3đ, BTC: 5đ)", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_5", text: "5. Tham gia hỗ trợ 'Tư vấn tuyển sinh'", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_6", text: "6. Tham gia hỗ trợ Công tác nhập học tân sinh viên", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_7", text: "7. Tham gia hỗ trợ Khám sức khỏe sinh viên đầu khóa", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_8", text: "8. Tham gia hỗ trợ Ngày hội việc làm", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_9", text: "9. Tham gia hỗ trợ Lễ Tốt nghiệp", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_10", text: "10. Tham gia hỗ trợ Công tác kiểm tra hồ sơ sinh viên", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_11", text: "11. Tham gia phiên giao dịch việc làm (Tư vấn: 1đ, Cà phê VL: 2đ, Khu vực: 3đ)", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "4_12", text: "12. Hiến máu tình nguyện (Tham gia hiến máu: 10đ, BTC: 5đ)", max: 10, maxLabel: "10 đ/lần", minus: "" },
      { id: "4_13", text: "13. Chương trình 'Xuân tình nguyện' (Tham gia: 4đ, BTC: 5đ)", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_14", text: "14. Chiến dịch tình nguyện 'Mùa hè xanh' (Tham gia: 5đ, BTC: 7đ)", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "4_15", text: "15. Chương trình 'Ngày Chủ nhật xanh' (Tham gia: 3đ, BTC: 5đ)", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_16", text: "16. Chương trình 'Thứ Bảy tình nguyện' (Tham gia: 3đ, BTC: 5đ)", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_17", text: "17. Chương trình 'Chào đón tân sinh viên' (Tham gia: 3đ, BTC: 5đ)", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_18", text: "18. Hoạt động trách nhiệm xã hội, phát triển bền vững (Trực tiếp: 3đ, Online: 1đ)", max: 3, maxLabel: "3 đ/lần", minus: "" },
    ],
  },
  {
    id: "sec5",
    title: "V. Ý thức và kết quả khi tham gia công tác cán bộ lớp, Đoàn thể hoặc thành tích đặc biệt",
    maxPoints: 10,
    items: [
      { id: "5_1", text: "1. Tham gia tích cực phong trào Lớp, Đoàn, Hội (+1đ/hoạt động)", max: 3, maxLabel: "3 đ/kỳ", minus: "" },
      { id: "5_2", text: "2. Hoàn thành tốt nhiệm vụ cán bộ (Lớp trưởng/Chủ nhiệm CLB: 5đ; Phó: 4đ; BCH/Tổ: 3đ)", max: 5, maxLabel: "5 đ/kỳ", minus: "" },
      { id: "5_3", text: "3. Đạt giải NCKH/Học thuật (Cấp TP: 3-6đ, Cấp Toàn quốc: 4-7đ)", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "5_4", text: "4. Bằng khen UBND Tỉnh/Thành phố về thành tích đột xuất, cứu người, trật tự xã hội", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "5_5", text: "5. Sinh viên 5 tốt cấp Trường, Thanh niên tiên tiến làm theo lời Bác", max: 6, maxLabel: "6 đ/lần", minus: "" },
      { id: "5_6", text: "6. Sinh viên 5 tốt cấp Thành / Toàn quốc, giải thưởng Sao Tháng Giêng", max: 10, maxLabel: "10 đ/lần", minus: "" },
      { id: "5_7", text: "7. Đạt danh hiệu Đoàn viên ưu tú", max: 6, maxLabel: "6 đ/lần", minus: "" },
      { id: "5_8", text: "8. Giấy khen tập thể của Đoàn (Mỗi SV trong chi đoàn được 2đ)", max: 2, maxLabel: "2 đ/SV", minus: "" },
    ],
  },
];

export default function CongDRLPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"proof" | "form" | "result">("proof");

  // Danh sách minh chứng
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form nộp minh chứng
  const [proofTitle, setProofTitle] = useState("");
  const [proofCategory, setProofCategory] = useState("I. Học tập, NCKH & Kỹ năng");
  const [proofPoints, setProofPoints] = useState<number>(3);
  const [proofUrl, setProofUrl] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);

  // Điểm tự chấm cho từng tiêu chí chi tiết { "1_1": 5, "2_1": 5, ... }
  const [scores, setScores] = useState<{ [key: string]: number }>({
    "1_1": 3,
    "2_1": 5,
    "2_2": 5,
    "2_3": 5,
    "2_4": 5,
    "2_5": 5,
    "2_6": 5,
    "2_7": 5,
    "2_8": 5,
    "3_1": 3,
    "3_2": 3,
    "4_1": 10,
    "5_1": 3,
  });

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
      const { data: proofData } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", mssv)
        .order("created_at", { ascending: false });

      if (proofData) setProofs(proofData);

      const { data: drlData } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", mssv)
        .maybeSingle();

      if (drlData) {
        setDrlStatus(drlData.status || "Đã nộp, chờ BCH duyệt");
        setFinalScore(drlData.final_score);
        if (drlData.scores_detail) {
          setScores(drlData.scores_detail);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleScoreChange = (itemId: string, val: number, maxVal: number) => {
    const safeVal = Math.min(Math.max(0, val || 0), maxVal);
    setScores((prev) => ({ ...prev, [itemId]: safeVal }));
  };

  // Tính điểm từng phần có khống chế max
  const getSectionScore = (section: any) => {
    const rawSum = section.items.reduce((sum: number, it: any) => sum + (Number(scores[it.id]) || 0), 0);
    return Math.min(rawSum, section.maxPoints);
  };

  // Tổng điểm rèn luyện toàn bộ 5 phần (Max 100)
  const grandTotalScore = DRL_SECTIONS.reduce((total, sec) => total + getSectionScore(sec), 0);

  // Nộp minh chứng ngoài khoa
  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle || !proofUrl) {
      alert("Vui lòng nhập tên hoạt động và link minh chứng!");
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

      alert("Nộp minh chứng thành công! Đã gửi đến BCH Chi đoàn thẩm định.");
      setProofTitle("");
      setProofUrl("");
      loadData(currentUser.mssv);
    } catch (err: any) {
      alert("Lỗi khi nộp minh chứng: " + err.message);
    }
    setSubmittingProof(false);
  };

  // Nộp phiếu ĐRL hoàn chỉnh
  const handleSubmitDRLForm = async () => {
    if (!confirm(`Bạn có chắc chắn muốn nộp Phiếu ĐRL với tổng điểm tự đánh giá là ${grandTotalScore}/100 điểm về BCH Chi đoàn?`)) return;

    try {
      const submission = {
        mssv: currentUser.mssv,
        student_name: currentUser.fullName,
        student_class: currentUser.studentClass,
        self_score: grandTotalScore,
        scores_detail: scores,
        status: "Đã nộp - Chờ BCH Chi đoàn duyệt",
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("drl_submissions").upsert([submission], { onConflict: "mssv" });
      if (error) throw error;

      setDrlStatus("Đã nộp - Chờ BCH Chi đoàn duyệt");
      alert("Nộp phiếu đánh giá ĐRL thành công!");
    } catch (err: any) {
      alert("Lỗi nộp phiếu: " + err.message);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER ĐÃ XÓA CHỮ DƯ & ẢNH BANNER CHUẨN */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img
                src="/logo-doankhoa.png"
                alt="Logo Đoàn Khoa Kỹ thuật Cơ khí"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight uppercase">
                CỔNG ĐIỂM RÈN LUYỆN
              </h1>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* THÔNG TIN TỔNG QUAN */}
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

        {/* 3 TAB CHỨC NĂNG */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => setActiveTab("proof")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "proof" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              1. Nộp & Quản lý Minh chứng
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "form" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              2. Nộp Phiếu Điểm Rèn Luyện
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "result" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              3. Kết quả Điểm Rèn Luyện
            </button>
          </div>
        </div>

        {/* ================= TAB 1: MINH CHỨNG ================= */}
        {activeTab === "proof" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-[#004A52] uppercase mb-4">
                Nộp minh chứng hoạt động ngoài khoa
              </h2>
              <form onSubmit={handleUploadProof} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên hoạt động / Sự kiện *</label>
                  <input
                    type="text"
                    required
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="VD: Hiến máu tình nguyện đợt 1, Tiếp sức mùa thi..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thuộc hạng mục tiêu chí *</label>
                  <select
                    value={proofCategory}
                    onChange={(e) => setProofCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  >
                    <option>I. Học tập, NCKH & Kỹ năng</option>
                    <option>II. Chấp hành Nội quy, Quy chế</option>
                    <option>III. Hoạt động CT-XH, Văn thể mỹ, Đoàn - Hội</option>
                    <option>IV. Ý thức công dân, Tình nguyện & Cộng đồng</option>
                    <option>V. Cán bộ lớp & Thành tích đặc biệt</option>
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
                  <label className="block font-bold text-slate-700 mb-1">Link hình ảnh / Minh chứng *</label>
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
                    {submittingProof ? "Đang gửi..." : "Tải lên & Gửi minh chứng cho BCH Chi đoàn"}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-[#004A52] uppercase">
                  Danh sách minh chứng & Điểm danh ({proofs.length})
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
                  Chưa có minh chứng hoặc lượt điểm danh nào.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Hoạt động</th>
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
                              <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">
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

        {/* ================= TAB 2: PHIẾU ĐÁNH GIÁ ĐẦY ĐỦ TỪNG MỤC CHUẨN FILE EXCEL ================= */}
        {activeTab === "form" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#004A52] uppercase">
                PHIẾU ĐÁNH GIÁ ĐIỂM RÈN LUYỆN HỌC KỲ (THEO QUYẾT ĐỊNH 147/QĐ-ĐHKTCN)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Sinh viên điền điểm tự đánh giá cho từng dòng tiêu chí. Hệ thống tự động tính điểm từng phần theo mức khống chế tối đa.
              </p>
            </div>

            {/* BẢNG TỪNG PHẦN CHI TIẾT */}
            <div className="space-y-6">
              {DRL_SECTIONS.map((section) => {
                const sectionScore = getSectionScore(section);
                return (
                  <div key={section.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    {/* TIÊU ĐỀ PHẦN & TỔNG ĐIỂM PHẦN */}
                    <div className="bg-slate-100 p-3.5 flex justify-between items-center text-xs font-black text-[#004A52]">
                      <span>{section.title}</span>
                      <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-[#EE6425]">
                        Tổng phần: {sectionScore} / {section.maxPoints} đ
                      </span>
                    </div>

                    {/* BẢNG CHI TIẾT TIÊU CHÍ */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                            <th className="py-2.5 px-4 w-3/5">Nội dung đánh giá</th>
                            <th className="py-2.5 px-2 text-center w-24">Điểm Tối đa</th>
                            <th className="py-2.5 px-2 text-center w-20">Điểm trừ</th>
                            <th className="py-2.5 px-4 text-center w-28">SV Tự chấm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {section.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-4 text-slate-700 font-medium leading-relaxed">
                                {item.text}
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold text-slate-600">
                                {item.maxLabel}
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold text-red-500">
                                {item.minus || "-"}
                              </td>
                              <td className="py-2.5 px-4 text-center">
                                <input
                                  type="number"
                                  min="0"
                                  max={item.max}
                                  value={scores[item.id] !== undefined ? scores[item.id] : 0}
                                  onChange={(e) => handleScoreChange(item.id, Number(e.target.value), item.max)}
                                  className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-center font-bold text-[#EE6425] outline-none focus:border-[#EE6425]"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* TỔNG KẾT VÀ NỘP PHIẾU */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-orange-50/50 p-4 rounded-2xl">
              <div>
                <span className="text-xs text-slate-500 block">TỔNG ĐIỂM RÈN LUYỆN TOÀN BỘ 5 PHẦN:</span>
                <span className="text-2xl font-black text-[#EE6425]">
                  {grandTotalScore} / 100 điểm
                </span>
                <span className="block text-[11px] text-slate-600 mt-0.5">
                  Xếp loại dự kiến: {grandTotalScore >= 90 ? "Xuất sắc" : grandTotalScore >= 80 ? "Tốt" : grandTotalScore >= 65 ? "Khá" : grandTotalScore >= 50 ? "Trung bình" : "Yếu"}
                </span>
              </div>

              <button
                onClick={handleSubmitDRLForm}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow-md transition uppercase tracking-wider"
              >
                NỘP PHIẾU ĐIỂM RÈN LUYỆN VỀ BCH CHI ĐOÀN
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: KẾT QUẢ CHÍNH THỨC ================= */}
        {activeTab === "result" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
            <h2 className="text-base font-black text-[#004A52] uppercase">
              KẾT QUẢ ĐIỂM RÈN LUYỆN CHÍNH THỨC
            </h2>

            <div className="py-6">
              <span className="text-5xl font-black text-[#EE6425]">
                {finalScore !== null ? finalScore : grandTotalScore}
              </span>
              <span className="block text-xs font-bold text-slate-500 mt-2">
                Xếp loại: { (finalScore || grandTotalScore) >= 90 ? "Xuất sắc" : (finalScore || grandTotalScore) >= 80 ? "Tốt" : (finalScore || grandTotalScore) >= 65 ? "Khá" : (finalScore || grandTotalScore) >= 50 ? "Trung bình" : "Yếu" }
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 max-w-md mx-auto text-xs text-teal-800 font-medium leading-relaxed">
              Trạng thái xét duyệt: <strong>{drlStatus}</strong>. Sau khi BCH Chi đoàn lớp và Đoàn Khoa thẩm định hoàn tất, kết quả chính thức sẽ được công bố tại đây.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

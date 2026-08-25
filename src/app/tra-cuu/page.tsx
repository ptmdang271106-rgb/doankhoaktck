"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const DRL_SECTIONS = [
  {
    id: "sec1",
    title: "I. Đánh giá về ý thức tham gia học tập",
    maxPoints: 20,
    items: [
      { id: "1_1", title: "1. Sinh viên có điểm trung bình học tập tích lũy với thang điểm 4", subtext: "Loại Trung bình: 2đ | Khá: 3đ | Giỏi: 4đ | Xuất sắc: 5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "" },
      { id: "1_2", title: "2. Giấy chứng nhận tham gia lớp kỹ năng học tập", subtext: "Có giấy xác nhận, chứng nhận, giấy khen", max: 3, maxLabel: "3 đ/kỳ", minus: "" },
      { id: "1_3", title: "3. Hội thảo / Tọa đàm Khoa hoặc Trường", subtext: "Trực tiếp: 3đ | Trực tuyến: 1đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "1_4", title: "4. Cuộc thi học thuật cấp Khoa/Trường", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 3đ | Giải: 4-7đ", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "1_5", title: "5. Cuộc thi học thuật ngoài Trường", subtext: "Cổ vũ: 2đ | BTC: 3đ | Tham gia: 4đ | Giải: 5-8đ", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_6", title: "6. Báo cáo khoa học cấp Khoa", subtext: "TB: 3đ | Khá: 4đ | Tốt: 6đ | Xuất sắc: 8đ", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_7", title: "7. Đề tài Nghiên cứu khoa học Trường", subtext: "TB: 5đ | Khá: 6đ | Tốt: 8đ | Xuất sắc: 10đ", max: 10, maxLabel: "10 đ/lần", minus: "" },
      { id: "1_8", title: "8. Viết bài báo khoa học", subtext: "Kỷ yếu: 5đ | Tạp chí: 8đ", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_9", title: "9. Cuộc thi khởi nghiệp cấp Trường", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 3đ | Giải: 4-7đ", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "1_10", title: "10. Cuộc thi khởi nghiệp ngoài Trường", subtext: "Cổ vũ: 2đ | BTC: 3đ | Tham gia: 4đ | Giải: 5-8đ", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "1_11", title: "11. Thành viên CLB học thuật cấp Khoa/Trường", subtext: "Minh chứng thành viên CLB", max: 2, maxLabel: "2 đ/kỳ", minus: "" },
      { id: "1_12", title: "12. Các hoạt động học tập khác", subtext: "Trực tiếp: 3đ | Trực tuyến: 1đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
    ],
  },
  {
    id: "sec2",
    title: "II. Ý thức chấp hành nội quy, quy chế Nhà trường",
    maxPoints: 25,
    items: [
      { id: "2_1", title: "1. Ý thức, thái độ học tập", subtext: "Đi học đủ: +5đ | Nghỉ K.phép: -3đ | Muộn/Bỏ tiết: -1đ | Cấm thi: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_2", title: "2. Chấp hành tốt nội quy, quy chế trường", subtext: "Chấp hành tốt: +5đ | Kỷ luật: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_3", title: "3. Thực hiện tốt quy chế thi", subtext: "Thực hiện tốt: +5đ | Vi phạm: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_4", title: "4. Chấp hành quy định Thư viện", subtext: "Chấp hành tốt: +5đ | Vi phạm: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_5", title: "5. Chấp hành quy định phòng học, xưởng", subtext: "Chấp hành tốt: +5đ | Vi phạm: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_6", title: "6. Thực hiện đăng ký ngoại trú", subtext: "Thực hiện đúng hạn: +5đ | Không làm: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_7", title: "7. Mặc đồng phục đúng quy định", subtext: "Thực hiện đúng: +5đ | Vi phạm: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
      { id: "2_8", title: "8. Sinh hoạt lớp với Cố vấn học tập", subtext: "Tham gia đủ: +5đ | Vắng không phép: -5đ", max: 5, maxLabel: "5 đ/kỳ", minus: "-5 đ" },
    ],
  },
  {
    id: "sec3",
    title: "III. Hoạt động chính trị, XH, VH-VN-TT, phong trào",
    maxPoints: 20,
    items: [
      { id: "3_1", title: "1. Hoạt động bắt buộc do Khoa/Trường tổ chức", subtext: "Tham gia: +3đ | Vắng: -3đ", max: 3, maxLabel: "3 đ/lần", minus: "-3 đ/lần" },
      { id: "3_2", title: "2. Đại hội / Sinh hoạt Chi Đoàn - Chi Hội", subtext: "Tham gia: +3đ | Vắng: -3đ", max: 3, maxLabel: "3 đ/lần", minus: "-3 đ/lần" },
      { id: "3_3", title: "3. Báo cáo chuyên đề Trường tổ chức", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 4đ", max: 4, maxLabel: "4 đ/lần", minus: "" },
      { id: "3_4", title: "4. Hoạt động/Cuộc thi CLB, Khoa, Trường", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 3đ | Giải: 4-7đ", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "3_5", title: "5. Hoạt động/Cuộc thi cấp Thành phố trở lên", subtext: "Cổ vũ: 1đ | BTC: 3đ | Tham gia: 4đ | Giải: 5-8đ", max: 8, maxLabel: "8 đ/lần", minus: "" },
      { id: "3_6", title: "6. Được kết nạp Đoàn trong kỳ", subtext: "Cộng 1 lần vào kỳ kết nạp: 5đ", max: 5, maxLabel: "5 đ", minus: "" },
      { id: "3_7", title: "7. Được kết nạp Đảng trong kỳ", subtext: "Cộng 1 lần vào kỳ kết nạp: 8đ", max: 8, maxLabel: "8 đ", minus: "" },
      { id: "3_8", title: "8. Hoạt động do Đoàn/Hội điều động", subtext: "Tham gia: 2đ | BTC: 4đ", max: 4, maxLabel: "4 đ/lần", minus: "" },
      { id: "3_9", title: "9. Thành viên CLB, Đội, Nhóm Đoàn - Hội", subtext: "Minh chứng thành viên", max: 2, maxLabel: "2 đ/kỳ", minus: "" },
      { id: "3_10", title: "10. Học tập các bài lý luận chính trị", subtext: "Hoàn thành bài kiểm tra: 4đ", max: 4, maxLabel: "4 đ/lần", minus: "" },
      { id: "3_11", title: "11. Đền ơn đáp nghĩa, Thắp nến tri ân", subtext: "Viếng nghĩa trang, tri ân: 3đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "3_12", title: "12. Lao động tình nguyện tại Trường", subtext: "Dọn dẹp giảng đường, xưởng: 3đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "3_13", title: "13. Khen thưởng phong trào", subtext: "Giấy khen: 5đ | Bằng khen: 7đ", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "3_14", title: "14. Tập thể được khen thưởng phong trào", subtext: "Mỗi SV trong tập thể: 1đ", max: 1, maxLabel: "1 đ/lần", minus: "" },
      { id: "3_15", title: "15. Hoạt động phong trào khác", subtext: "Trực tiếp: 3đ | Online: 1đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
    ],
  },
  {
    id: "sec4",
    title: "IV. Ý thức công dân trong quan hệ cộng đồng",
    maxPoints: 25,
    items: [
      { id: "4_1", title: "1. Chấp hành luật pháp, quy định Nhà nước", subtext: "Chấp hành tốt: +10đ | Công an báo về: -5đ", max: 10, maxLabel: "10 đ/lần", minus: "-5 đ/lần" },
      { id: "4_2", title: "2. Hành vi tốt, giúp đỡ người yếu thế", subtext: "Giấy khen/chứng nhận cấp xã/trường: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_3", title: "3. Khen thưởng hoạt động xã hội ngoài trường", subtext: "Minh chứng khen thưởng: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_4", title: "4. Giao lưu các CLB, Đội, Nhóm trực thuộc", subtext: "Tham gia: 3đ | BTC: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_5", title: "5. Chương trình Tư vấn tuyển sinh", subtext: "Hỗ trợ tư vấn tuyển sinh: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_6", title: "6. Công tác nhập học tân sinh viên", subtext: "Hỗ trợ làm thủ tục: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_7", title: "7. Khám sức khỏe sinh viên đầu khóa", subtext: "Hỗ trợ khám sức khỏe: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_8", title: "8. Công tác Ngày hội việc làm", subtext: "Hỗ trợ ngày hội: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_9", title: "9. Công tác tổ chức Lễ Tốt nghiệp", subtext: "Hỗ trợ lễ tốt nghiệp: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_10", title: "10. Công tác kiểm tra hồ sơ sinh viên", subtext: "Hỗ trợ rà soát hồ sơ: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_11", title: "11. Tham gia phiên giao dịch việc làm", subtext: "Tư vấn: 1đ | Cà phê VL: 2đ | Khu vực: 3đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
      { id: "4_12", title: "12. Hiến máu tình nguyện", subtext: "Trực tiếp hiến máu: 10đ | BTC: 5đ", max: 10, maxLabel: "10 đ/lần", minus: "" },
      { id: "4_13", title: "13. Chương trình Xuân tình nguyện", subtext: "Tham gia: 4đ | BTC: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_14", title: "14. Chiến dịch tình nguyện Mùa hè xanh", subtext: "Tham gia: 5đ | BTC: 7đ", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "4_15", title: "15. Chương trình Ngày Chủ nhật xanh", subtext: "Tham gia: 3đ | BTC: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_16", title: "16. Chương trình Thứ Bảy tình nguyện", subtext: "Tham gia: 3đ | BTC: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_17", title: "17. Chương trình Chào đón tân sinh viên", subtext: "Tham gia: 3đ | BTC: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "4_18", title: "18. Hoạt động trách nhiệm xã hội, bền vững", subtext: "Trực tiếp: 3đ | Online: 1đ", max: 3, maxLabel: "3 đ/lần", minus: "" },
    ],
  },
  {
    id: "sec5",
    title: "V. Cán bộ lớp, Đoàn thể & Thành tích đặc biệt",
    maxPoints: 10,
    items: [
      { id: "5_1", title: "1. Tham gia tích cực phong trào Lớp, Đoàn, Hội", subtext: "+1đ/hoạt động (Tối đa 3đ)", max: 3, maxLabel: "3 đ/kỳ", minus: "" },
      { id: "5_2", title: "2. Hoàn thành tốt nhiệm vụ cán bộ", subtext: "Lớp trưởng/Chủ nhiệm CLB: 5đ | Phó: 4đ | BCH/Tổ: 3đ", max: 5, maxLabel: "5 đ/kỳ", minus: "" },
      { id: "5_3", title: "3. Sinh viên đạt giải học thuật, NCKH", subtext: "Cấp TP: 3-6đ | Toàn quốc: 4-7đ", max: 7, maxLabel: "7 đ/lần", minus: "" },
      { id: "5_4", title: "4. Bằng khen UBND Tỉnh/Thành phố", subtext: "Khen thưởng đột xuất, cứu người: 5đ", max: 5, maxLabel: "5 đ/lần", minus: "" },
      { id: "5_5", title: "5. SV 5 tốt cấp Trường, Thanh niên tiên tiến", subtext: "Minh chứng công nhận: 6đ", max: 6, maxLabel: "6 đ/lần", minus: "" },
      { id: "5_6", title: "6. SV 5 tốt cấp Thành/TW, Sao Tháng Giêng", subtext: "Minh chứng công nhận: 10đ", max: 10, maxLabel: "10 đ/lần", minus: "" },
      { id: "5_7", title: "7. Đạt danh hiệu Đoàn viên ưu tú", subtext: "Công nhận trong kỳ: 6đ", max: 6, maxLabel: "6 đ/lần", minus: "" },
      { id: "5_8", title: "8. Giấy khen tập thể của Đoàn", subtext: "Mỗi SV trong tập thể: 2đ", max: 2, maxLabel: "2 đ/SV", minus: "" },
    ],
  },
];

export default function CongDRLPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"proof" | "form" | "result">("proof");

  // Quản lý học kỳ
  const [semesters, setSemesters] = useState<any[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string>("hk1_2026_2027");
  const [isSemesterOpen, setIsSemesterOpen] = useState<boolean>(true);

  // Dữ liệu minh chứng
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form Tab 1
  const [proofTitle, setProofTitle] = useState("");
  const [proofCategory, setProofCategory] = useState("I.1. Điểm trung bình học tập tích lũy hệ 4");
  const [proofPoints, setProofPoints] = useState<number>(5);
  const [proofUrl, setProofUrl] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Tab 2
  const [itemProofs, setItemProofs] = useState<{ [key: string]: string }>({});
  const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

  // Điểm tự chấm
  const [scores, setScores] = useState<{ [key: string]: number }>({
    "1_1": 3, "2_1": 5, "2_2": 5, "2_3": 5, "2_4": 5, "2_5": 5, "2_6": 5, "2_7": 5, "2_8": 5,
    "3_1": 3, "3_2": 3, "4_1": 10, "5_1": 3,
  });

  const [drlStatus, setDrlStatus] = useState<string>("Chưa nộp");
  const [finalScore, setFinalScore] = useState<number | null>(null);

  // Load danh sách học kỳ
  useEffect(() => {
    const fetchSemesters = async () => {
      const { data } = await supabase.from("drl_semesters").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        setSemesters(data);
        const active = data.find((s) => s.is_active) || data[0];
        setSelectedSemester(active.id);
        checkSemesterStatus(active);
      }
    };
    fetchSemesters();
  }, []);

  const checkSemesterStatus = (sem: any) => {
    if (!sem) return;
    const now = new Date();
    const start = new Date(sem.start_date);
    const end = new Date(sem.end_date);
    const isOpen = sem.is_active && now >= start && now <= end;
    setIsSemesterOpen(isOpen);
  };

  useEffect(() => {
    const saved = localStorage.getItem("ctut_current_user");
    if (!saved) {
      router.push("/dang-nhap?redirect=/tra-cuu");
      return;
    }
    const user = JSON.parse(saved);
    setCurrentUser(user);
    if (selectedSemester) {
      loadData(user.mssv, selectedSemester);
    }
  }, [selectedSemester, router]);

  const loadData = async (mssv: string, semesterId: string) => {
    setLoading(true);
    try {
      // 1. Lọc minh chứng theo đúng học kỳ
      const { data: proofData } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", mssv)
        .eq("semester_id", semesterId)
        .order("created_at", { ascending: false });

      if (proofData) {
        setProofs(proofData);
        const proofMap: { [key: string]: string } = {};
        proofData.forEach((p) => {
          if (p.item_id && p.proof_url) proofMap[p.item_id] = p.proof_url;
        });
        setItemProofs(proofMap);
      }

      // 2. Lọc phiếu ĐRL theo đúng học kỳ
      const { data: drlData } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", mssv)
        .eq("semester_id", semesterId)
        .maybeSingle();

      if (drlData) {
        setDrlStatus(drlData.status || "Đã nộp, chờ BCH duyệt");
        setFinalScore(drlData.final_score);
        if (drlData.scores_detail) setScores(drlData.scores_detail);
        if (drlData.proofs_detail) setItemProofs(drlData.proofs_detail);
      } else {
        setDrlStatus("Chưa nộp");
        setFinalScore(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSelectSemester = (semId: string) => {
    setSelectedSemester(semId);
    const sem = semesters.find((s) => s.id === semId);
    checkSemesterStatus(sem);
  };

  const handleScoreChange = (itemId: string, val: number, maxVal: number) => {
    if (!isSemesterOpen) return;
    const safeVal = Math.min(Math.max(0, val || 0), maxVal);
    setScores((prev) => ({ ...prev, [itemId]: safeVal }));
  };

  const handleFileUploadTab1 = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.mssv}_${selectedSemester}_${Date.now()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error } = await supabase.storage.from("documents").upload(filePath, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
        setProofUrl(urlData.publicUrl);
        alert("Tải file thành công!");
      }
    } catch (err: any) {
      alert("Lỗi tải file: " + err.message);
    }
    setUploadingFile(false);
  };

  const handleFileUploadItem = async (itemId: string, itemTitle: string, itemMax: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingItemId(itemId);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.mssv}_${selectedSemester}_${itemId}_${Date.now()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error } = await supabase.storage.from("documents").upload(filePath, file);
      if (!error) {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
        const uploadedUrl = urlData.publicUrl;

        setItemProofs((prev) => ({ ...prev, [itemId]: uploadedUrl }));

        const newProof = {
          mssv: currentUser.mssv,
          student_name: currentUser.fullName,
          student_class: currentUser.studentClass,
          activity_title: itemTitle,
          category: itemTitle,
          item_id: itemId,
          semester_id: selectedSemester,
          points: scores[itemId] || itemMax,
          proof_url: uploadedUrl,
          source: "Phiếu đánh giá ĐRL",
          status: "Đã nạp theo phiếu",
          created_at: new Date().toISOString(),
        };

        await supabase.from("proofs").insert([newProof]);
        loadData(currentUser.mssv, selectedSemester);
        alert("Nạp minh chứng thành công!");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
    setUploadingItemId(null);
  };

  const getSectionScore = (section: any) => {
    const rawSum = section.items.reduce((sum: number, it: any) => sum + (Number(scores[it.id]) || 0), 0);
    return Math.min(rawSum, section.maxPoints);
  };

  const grandTotalScore = DRL_SECTIONS.reduce((total, sec) => total + getSectionScore(sec), 0);

  const handleUploadProofTab1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSemesterOpen) {
      alert("Học kỳ này đã đóng cổng đánh giá, không thể nộp thêm!");
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
        semester_id: selectedSemester,
        points: Number(proofPoints),
        proof_url: proofUrl,
        source: "Hoạt động ngoài khoa",
        status: "Chờ duyệt",
        created_at: new Date().toISOString(),
      };

      await supabase.from("proofs").insert([newProof]);
      alert("Nộp minh chứng thành công!");
      setProofTitle("");
      setProofUrl("");
      loadData(currentUser.mssv, selectedSemester);
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
    setSubmittingProof(false);
  };

  const handleSubmitDRLForm = async () => {
    if (!isSemesterOpen) {
      alert("Học kỳ này đã kết thúc thời gian đánh giá!");
      return;
    }

    try {
      const submission = {
        mssv: currentUser.mssv,
        student_name: currentUser.fullName,
        student_class: currentUser.studentClass,
        semester_id: selectedSemester,
        self_score: grandTotalScore,
        scores_detail: scores,
        proofs_detail: itemProofs,
        status: "Đã nộp - Chờ BCH Chi đoàn duyệt",
        submitted_at: new Date().toISOString(),
      };

      await supabase.from("drl_submissions").upsert([submission], { onConflict: "mssv,semester_id" });
      setDrlStatus("Đã nộp - Chờ BCH Chi đoàn duyệt");
      alert("Nộp phiếu ĐRL thành công!");
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
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

        {/* THANH CHỌN HỌC KỲ VÀ THÔNG BÁO THỜI HẠN */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Đang xem học kỳ:</span>
            <select
              value={selectedSemester}
              onChange={(e) => handleSelectSemester(e.target.value)}
              className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-[#004A52] outline-none focus:border-[#EE6425] bg-slate-50"
            >
              {semesters.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} {s.is_active ? "(Đang mở)" : "(Đã đóng)"}
                </option>
              ))}
            </select>
          </div>

          <div>
            {isSemesterOpen ? (
              <span className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Cổng đang mở nộp minh chứng & đánh giá
              </span>
            ) : (
              <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5">
                🔒 Học kỳ đã đóng cổng (Chỉ xem lịch sử điểm)
              </span>
            )}
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
              Điểm rèn luyện kỳ này
            </span>
            <span className="text-4xl font-black my-1 text-white">
              {finalScore !== null ? finalScore : "--"}
            </span>
            <span className="text-[11px] text-teal-200 font-medium">
              Trạng thái: {drlStatus}
            </span>
          </div>
        </div>

        {/* 3 TAB */}
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

        {/* TAB 1 */}
        {activeTab === "proof" && (
          <div className="space-y-6">
            {isSemesterOpen && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-[#004A52] uppercase mb-4">
                  Nộp minh chứng hoạt động ngoài khoa
                </h2>
                <form onSubmit={handleUploadProofTab1} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tên hoạt động / Sự kiện *</label>
                    <input
                      type="text"
                      required
                      value={proofTitle}
                      onChange={(e) => setProofTitle(e.target.value)}
                      placeholder="VD: Hiến máu tình nguyện đợt 1..."
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Thuộc hạng mục tiêu chí *</label>
                    <select
                      value={proofCategory}
                      onChange={(e) => setProofCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425] bg-white text-slate-700"
                    >
                      <option>I.1. Điểm trung bình học tập tích lũy hệ 4</option>
                      <option>I.4. Cuộc thi học thuật cấp Khoa hoặc Trường</option>
                      <option>III.1. Hoạt động bắt buộc do Khoa/Trường tổ chức</option>
                      <option>IV.12. Hiến máu tình nguyện</option>
                      <option>IV.14. Chiến dịch tình nguyện Mùa hè xanh</option>
                      <option>V.1. Tham gia tích cực phong trào Lớp, Đoàn, Hội</option>
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
                      className="w-full border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-[#EE6425] outline-none focus:border-[#EE6425]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Link hình ảnh hoặc Tải file *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={proofUrl}
                        onChange={(e) => setProofUrl(e.target.value)}
                        placeholder="Dán link hoặc tải file ->"
                        className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-[#EE6425]"
                      />
                      <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition flex-shrink-0 text-xs">
                        <span>{uploadingFile ? "Đang tải..." : "Tải tệp"}</span>
                        <input type="file" accept="image/*,.pdf" onChange={handleFileUploadTab1} className="hidden" />
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      disabled={submittingProof || uploadingFile}
                      className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition shadow"
                    >
                      {submittingProof ? "Đang gửi..." : "Tải lên & Gửi minh chứng"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-[#004A52] uppercase mb-4">
                Danh sách minh chứng ({proofs.length}) - {selectedSemester}
              </h2>

              {loading ? (
                <div className="text-center py-6 text-xs text-slate-400">Đang tải minh chứng...</div>
              ) : proofs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Học kỳ này chưa có minh chứng nào được lưu.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Hoạt động / Sự kiện</th>
                        <th className="py-2.5">Hạng mục</th>
                        <th className="py-2.5">Điểm</th>
                        <th className="py-2.5">Trạng thái</th>
                        <th className="py-2.5 text-right">Minh chứng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {proofs.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 font-semibold text-slate-800">{p.activity_title}</td>
                          <td className="py-3 text-slate-600">{p.category}</td>
                          <td className="py-3 font-bold text-[#EE6425]">+{p.points}</td>
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
                                Xem tệp
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

        {/* TAB 2 */}
        {activeTab === "form" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#004A52] uppercase">
                PHIẾU ĐÁNH GIÁ ĐIỂM RÈN LUYỆN ({selectedSemester})
              </h2>
            </div>

            <div className="space-y-6">
              {DRL_SECTIONS.map((section) => {
                const sectionScore = getSectionScore(section);
                return (
                  <div key={section.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <div className="bg-slate-100 p-3.5 flex justify-between items-center text-xs font-black text-[#004A52]">
                      <span>{section.title}</span>
                      <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-[#EE6425]">
                        Tổng phần: {sectionScore} / {section.maxPoints} đ
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                            <th className="py-2.5 px-4 w-5/12">Nội dung đánh giá</th>
                            <th className="py-2.5 px-2 text-center w-20">Điểm Max</th>
                            <th className="py-2.5 px-2 text-center w-20">SV Tự chấm</th>
                            <th className="py-2.5 px-4 text-center w-4/12">Minh chứng đính kèm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {section.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80">
                              <td className="py-3 px-4 text-slate-700">
                                <span className="font-bold block text-slate-800 leading-snug">{item.title}</span>
                                <span className="block text-[11px] italic text-slate-500 mt-1 leading-relaxed">{item.subtext}</span>
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-slate-600 align-top pt-4">
                                {item.maxLabel}
                              </td>
                              <td className="py-3 px-2 text-center align-top pt-3">
                                <input
                                  type="number"
                                  disabled={!isSemesterOpen}
                                  min="0"
                                  max={item.max}
                                  value={scores[item.id] !== undefined ? scores[item.id] : 0}
                                  onChange={(e) => handleScoreChange(item.id, Number(e.target.value), item.max)}
                                  className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-center font-bold text-[#EE6425] outline-none focus:border-[#EE6425] disabled:bg-slate-100"
                                />
                              </td>
                              <td className="py-3 px-4 align-top pt-3">
                                {isSemesterOpen ? (
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="text"
                                      value={itemProofs[item.id] || ""}
                                      onChange={(e) => setItemProofs((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                      placeholder="Link Drive/ảnh..."
                                      className="flex-1 border border-slate-300 rounded-lg px-2 py-1 text-[11px] outline-none focus:border-[#EE6425]"
                                    />
                                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 px-2 py-1 rounded-lg flex items-center justify-center gap-1 text-[11px] font-bold transition flex-shrink-0">
                                      <span>{uploadingItemId === item.id ? "..." : "Tải tệp"}</span>
                                      <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={(e) => handleFileUploadItem(item.id, item.title, item.max, e)}
                                        className="hidden"
                                      />
                                    </label>
                                  </div>
                                ) : (
                                  itemProofs[item.id] && (
                                    <a href={itemProofs[item.id]} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-[11px] font-bold">
                                      Xem file minh chứng
                                    </a>
                                  )
                                )}
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

            {/* Nút nộp */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-orange-50/50 p-4 rounded-2xl">
              <div>
                <span className="text-xs text-slate-500 block">TỔNG ĐIỂM TỰ CHẤM:</span>
                <span className="text-2xl font-black text-[#EE6425]">{grandTotalScore} / 100 điểm</span>
              </div>

              {isSemesterOpen ? (
                <button
                  onClick={handleSubmitDRLForm}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow-md transition uppercase tracking-wider"
                >
                  NỘP PHIẾU ĐIỂM RÈN LUYỆN VỀ BCH CHI ĐOÀN
                </button>
              ) : (
                <span className="text-xs font-bold text-slate-500">Học kỳ này đã kết thúc đợt nộp</span>
              )}
            </div>
          </div>
        )}

        {/* TAB 3 */}
        {activeTab === "result" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
            <h2 className="text-base font-black text-[#004A52] uppercase">
              KẾT QUẢ ĐIỂM RÈN LUYỆN ({selectedSemester})
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
              Trạng thái xét duyệt: <strong>{drlStatus}</strong>.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

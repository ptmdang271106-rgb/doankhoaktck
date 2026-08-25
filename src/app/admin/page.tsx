"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const EVENT_CRITERIA_OPTIONS = [
  { code: "I.1", label: "I.1 Điểm TB học tập tích lũy thang 4", max: 5 },
  { code: "I.2", label: "I.2 Giấy chứng nhận lớp kỹ năng học tập", max: 3 },
  { code: "I.3", label: "I.3 Hội thảo / Tọa đàm cấp Khoa, Trường", max: 3 },
  { code: "I.4", label: "I.4 Cuộc thi học thuật cấp Khoa / Trường", max: 7 },
  { code: "I.5", label: "I.5 Cuộc thi học thuật ngoài Trường", max: 8 },
  { code: "I.6", label: "I.6 Báo cáo khoa học cấp Khoa", max: 8 },
  { code: "I.7", label: "I.7 Tham gia đề tài NCKH cấp Trường", max: 10 },
  { code: "I.8", label: "I.8 Viết bài báo khoa học", max: 8 },
  { code: "I.9", label: "I.9 Cuộc thi khởi nghiệp cấp Trường", max: 7 },
  { code: "I.10", label: "I.10 Cuộc thi khởi nghiệp ngoài Trường", max: 8 },
  { code: "I.11", label: "I.11 Thành viên CLB học thuật", max: 2 },
  { code: "I.12", label: "I.12 Các hoạt động học thuật khác", max: 3 },

  { code: "II.1", label: "II.1 Ý thức, thái độ trong học tập", max: 5 },
  { code: "II.2", label: "II.2 Chấp hành nội quy, quy chế Trường", max: 5 },
  { code: "II.3", label: "II.3 Chấp hành quy chế thi cử", max: 5 },
  { code: "II.4", label: "II.4 Chấp hành quy định thư viện", max: 5 },
  { code: "II.5", label: "II.5 Chấp hành quy định phòng học, xưởng", max: 5 },
  { code: "II.6", label: "II.6 Thực hiện đăng ký ngoại trú", max: 5 },
  { code: "II.7", label: "II.7 Mặc đồng phục đúng quy định", max: 5 },
  { code: "II.8", label: "II.8 Sinh hoạt lớp với CVHT", max: 5 },

  { code: "III.1", label: "III.1 Hoạt động bắt buộc do Khoa/Trường tổ chức", max: 3 },
  { code: "III.2", label: "III.2 Đại hội Chi đoàn/Chi hội, sinh hoạt Chi đoàn", max: 3 },
  { code: "III.3", label: "III.3 Báo cáo chuyên đề do Trường tổ chức", max: 4 },
  { code: "III.4", label: "III.4 Hoạt động ngoại khóa / Cuộc thi cấp CLB/Khoa/Trường", max: 7 },
  { code: "III.5", label: "III.5 Ngoại khóa / Cuộc thi từ cấp Thành phố trở lên", max: 8 },
  { code: "III.6", label: "III.6 Được kết nạp Đoàn", max: 5 },
  { code: "III.7", label: "III.7 Được kết nạp Đảng", max: 8 },
  { code: "III.8", label: "III.8 Hoạt động phong trào do Đoàn/Hội điều động", max: 4 },
  { code: "III.9", label: "III.9 Thành viên CLB, đội, nhóm Đoàn - Hội", max: 2 },
  { code: "III.10", label: "III.10 Học tập các bài lý luận chính trị", max: 4 },
  { code: "III.11", label: "III.11 Đền ơn đáp nghĩa, Thắp nến tri ân", max: 3 },
  { code: "III.12", label: "III.12 Lao động tình nguyện tại Trường", max: 3 },
  { code: "III.13", label: "III.13 Khen thưởng phong trào cá nhân", max: 7 },
  { code: "III.14", label: "III.14 Tập thể được khen thưởng phong trào", max: 1 },
  { code: "III.15", label: "III.15 Các hoạt động phong trào khác", max: 3 },

  { code: "IV.1", label: "IV.1 Chấp hành pháp luật Nhà nước", max: 10 },
  { code: "IV.2", label: "IV.2 Hành vi tốt, tinh thần sẻ chia, giúp đỡ người yếu thế", max: 5 },
  { code: "IV.3", label: "IV.3 Biểu dương, khen thưởng hoạt động xã hội ngoài trường", max: 5 },
  { code: "IV.4", label: "IV.4 Giao lưu các CLB, Đội, Nhóm trực thuộc", max: 5 },
  { code: "IV.5", label: "IV.5 Chương trình Tư vấn tuyển sinh", max: 5 },
  { code: "IV.6", label: "IV.6 Công tác hỗ trợ nhập học sinh viên mới", max: 5 },
  { code: "IV.7", label: "IV.7 Công tác khám sức khỏe sinh viên", max: 5 },
  { code: "IV.8", label: "IV.8 Công tác tổ chức Ngày hội việc làm", max: 5 },
  { code: "IV.9", label: "IV.9 Công tác tổ chức Lễ Tốt nghiệp", max: 5 },
  { code: "IV.10", label: "IV.10 Công tác kiểm tra hồ sơ sinh viên", max: 5 },
  { code: "IV.11", label: "IV.11 Tham gia các phiên giao dịch việc làm", max: 3 },
  { code: "IV.12", label: "IV.12 Hiến máu tình nguyện", max: 10 },
  { code: "IV.13", label: "IV.13 Chương trình Xuân tình nguyện", max: 5 },
  { code: "IV.14", label: "IV.14 Chiến dịch Tình nguyện Mùa hè xanh", max: 7 },
  { code: "IV.15", label: "IV.15 Chương trình Ngày Chủ nhật xanh", max: 5 },
  { code: "IV.16", label: "IV.16 Chương trình Thứ Bảy tình nguyện", max: 5 },
  { code: "IV.17", label: "IV.17 Chương trình Chào đón tân sinh viên", max: 5 },
  { code: "IV.18", label: "IV.18 Trách nhiệm xã hội & phát triển bền vững", max: 3 },

  { code: "V.1", label: "V.1 Tham gia tích cực phong trào Lớp, Đoàn, Hội", max: 3 },
  { code: "V.2", label: "V.2 Cán bộ Lớp/Đoàn/Hội hoàn thành tốt nhiệm vụ", max: 5 },
  { code: "V.3", label: "V.3 Sinh viên đạt giải học tập, NCKH", max: 7 },
  { code: "V.4", label: "V.4 Bằng khen UBND Tỉnh/Thành phố trở lên", max: 5 },
  { code: "V.5", label: "V.5 Sinh viên 5 Tốt cấp Trường, Đoàn viên tiêu biểu", max: 6 },
  { code: "V.6", label: "V.6 Sinh viên 5 Tốt cấp Thành/Trung ương, Sao Tháng Giêng", max: 10 },
  { code: "V.7", label: "V.7 Đạt danh hiệu Đoàn viên ưu tú", max: 6 },
  { code: "V.8", label: "V.8 Giấy khen tập thể của Đoàn trao tặng", max: 2 },
];

function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();
}

export function generateCtuetEmail(fullName: string, mssv: string): string {
  if (!fullName || !mssv) return "";
  const cleanName = removeVietnameseTones(fullName).toLowerCase();
  const cleanMssv = mssv.trim().toLowerCase();
  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return `${parts[0]}${cleanMssv}@student.ctuet.edu.vn`;

  const initials = parts.slice(0, -1).map((p) => p[0]).join("");
  const lastName = parts[parts.length - 1];

  return `${initials}${lastName}${cleanMssv}@student.ctuet.edu.vn`;
}

export function generatePasswordFromMssv(mssv: string): string {
  const clean = mssv.trim();
  if (clean.length < 3) return clean || "123";
  return clean.slice(-3);
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"events" | "posts" | "students">("events");
  const [students, setStudents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // State bài viết
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Phong trào");
  const [postCoverImage, setPostCoverImage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  // State tạo sự kiện
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Phong trào");
  const [eventCategoryCode, setEventCategoryCode] = useState("III.8");
  const [eventPoints, setEventPoints] = useState<number>(4);
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("Hội trường A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  
  // Tọa độ GPS & Cấu hình bán kính
  const [eventLat, setEventLat] = useState<number>(10.0469);
  const [eventLng, setEventLng] = useState<number>(105.7681);
  const [gpsRadiusMode, setGpsRadiusMode] = useState<"none" | "100" | "200">("200");

  // State sinh viên
  const [pasteData, setPasteData] = useState("");

  // Popup mã QR
  const [activeQrEvent, setActiveQrEvent] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/admin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang quản trị!");
      router.push("/");
      return;
    }

    setStudents(JSON.parse(localStorage.getItem("ctut_student_accounts") || "[]"));
    setPosts(JSON.parse(localStorage.getItem("ctut_custom_posts") || "[]"));
    setEvents(JSON.parse(localStorage.getItem("ctut_custom_events") || "[]"));
    setRegistrations(JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]"));
  }, [router]);

  const handleSelectCriteria = (selectedCode: string) => {
    setEventCategoryCode(selectedCode);
    const item = EVENT_CRITERIA_OPTIONS.find((c) => c.code === selectedCode);
    if (item) setEventPoints(item.max);
  };

  // LẤY TỌA ĐỘ GPS HIỆN TẠI TỰ ĐỘNG
  const handleGetCurrentGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setEventLat(pos.coords.latitude);
          setEventLng(pos.coords.longitude);
          alert(`Đã lấy vị trí hiện tại:\nVĩ độ: ${pos.coords.latitude}\nKinh độ: ${pos.coords.longitude}`);
        },
        () => alert("Vui lòng cấp quyền truy cập vị trí trên trình duyệt!")
      );
    }
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const criteriaItem = EVENT_CRITERIA_OPTIONS.find((c) => c.code === eventCategoryCode);

    const newEvent = {
      id: "ev-" + Date.now().toString(),
      title: eventTitle,
      category: eventCategory,
      categoryCode: eventCategoryCode,
      categoryLabel: criteriaItem?.label || eventCategoryCode,
      points: Number(eventPoints),
      time: eventTime || "07:30 - Ngày 30/08/2026",
      location: eventLocation,
      deadline: eventDeadline || "23:59 - Ngày 29/08/2026",
      description: eventDesc,
      lat: eventLat,
      lng: eventLng,
      gpsRadius: gpsRadiusMode,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const updated = [newEvent, ...events];
    setEvents(updated);
    localStorage.setItem("ctut_custom_events", JSON.stringify(updated));

    setEventTitle("");
    setEventDesc("");
    setEventTime("");
    setEventDeadline("");
    alert(`Đã tạo sự kiện và ghim tọa độ Google Maps thành công!`);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa sự kiện này?")) {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      localStorage.setItem("ctut_custom_events", JSON.stringify(updated));
    }
  };

  const handleProcessPasteData = () => {
    if (!pasteData.trim()) return alert("Vui lòng dán dữ liệu!");
    const rows = pasteData.split(/\r\n|\n/).filter((r) => r.trim() !== "");
    const imported: any[] = [];

    for (const row of rows) {
      const cols = row.split(/\t|,/).map((c) => c.trim().replace(/^"|"$/g, ""));
      if (cols.length >= 2 && cols[0] && !cols[0].toLowerCase().includes("mssv")) {
        const mssv = cols[0].replace(/\s+/g, "");
        const fullName = cols[1];
        const studentClass = cols[2] || "CNKT Tự động hóa K2024";
        const password = generatePasswordFromMssv(mssv);
        const email = generateCtuetEmail(fullName, mssv);

        imported.push({
          mssv,
          fullName,
          email,
          studentClass,
          password,
          createdAt: new Date().toLocaleDateString("vi-VN"),
        });
      }
    }

    if (imported.length > 0) {
      const currentMssvs = new Set(students.map((s) => s.mssv));
      const newUnique = imported.filter((s) => !currentMssvs.has(s.mssv));
      const updated = [...newUnique, ...students];
      setStudents(updated);
      localStorage.setItem("ctut_student_accounts", JSON.stringify(updated));
      setPasteData("");
      alert(`Đã thêm thành công ${newUnique.length} sinh viên!`);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInsertBodyImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => document.execCommand("insertImage", false, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = editorRef.current ? editorRef.current.innerHTML : "";
    const newPost = {
      id: Date.now().toString(),
      title: postTitle,
      category: postCategory,
      coverImage: postCoverImage || "",
      contentHtml: contentHtml,
      content: editorRef.current ? editorRef.current.innerText : "",
      date: new Date().toLocaleDateString("vi-VN"),
    };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("ctut_custom_posts", JSON.stringify(updated));
    setPostTitle("");
    setPostCoverImage("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    alert("Đăng bài viết mới thành công!");
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#004A52]">BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN</h1>
            <p className="text-xs text-slate-500 mt-0.5">Quản lý bài viết, sự kiện & Ghim tọa độ GPS Google Maps</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">
              ← Về trang chủ
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("ctut_current_user");
                router.push("/");
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "events"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Đăng Sự Kiện & Ghim GPS ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "posts"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Bài viết & Bản tin ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "students"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            🎓 Quản lý Sinh viên ({students.length})
          </button>
        </div>

        {/* TAB 1: SỰ KIỆN & GHIM GPS */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo Sự Kiện Mới & Ghim Địa Điểm</h2>
              <form onSubmit={handleAddEvent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên sự kiện / Hoạt động *</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="VD: Hội thảo AI trong thiết kế CAD/CAM..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục</label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option value="Phong trào">Phong trào</option>
                      <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                      <option value="Tình nguyện">Tình nguyện</option>
                      <option value="Hội thảo Cơ khí">Hội thảo Cơ khí</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mục ĐRL (QĐ 147)</label>
                    <select
                      value={eventCategoryCode}
                      onChange={(e) => handleSelectCriteria(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs outline-none"
                    >
                      {EVENT_CRITERIA_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Điểm rèn luyện cộng *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={eventPoints}
                    onChange={(e) => setEventPoints(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-[#EE6425] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian diễn ra *</label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="07:30 - Ngày 30/08/2026"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Địa chỉ / Tên phòng tổ chức *</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Hội trường A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                {/* KHỐI CẤU HÌNH GPS GOOGLE MAPS */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#004A52]">📍 Ghim GPS Google Maps:</span>
                    <button
                      type="button"
                      onClick={handleGetCurrentGps}
                      className="text-[11px] bg-teal-50 text-[#007A87] hover:bg-teal-100 font-bold px-2.5 py-1 rounded-lg border border-teal-200"
                    >
                      🎯 Lấy GPS tại đây
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Vĩ độ (Lat):</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={eventLat}
                        onChange={(e) => setEventLat(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Kinh độ (Lng):</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={eventLng}
                        onChange={(e) => setEventLng(Number(e.target.value))}
                        className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-500 block mb-1">Quy định bán kính điểm danh:</span>
                    <select
                      value={gpsRadiusMode}
                      onChange={(e: any) => setGpsRadiusMode(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                    >
                      <option value="100">Bán kính 100 mét quanh địa điểm</option>
                      <option value="200">Bán kính 200 mét quanh địa điểm (Khuyên dùng)</option>
                      <option value="none">Bỏ qua kiểm tra GPS (Điểm danh tự do)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hạn chót đăng ký *</label>
                  <input
                    type="text"
                    required
                    value={eventDeadline}
                    onChange={(e) => setEventDeadline(e.target.value)}
                    placeholder="23:59 - Ngày 29/08/2026"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow tracking-wider"
                >
                  Đăng sự kiện lên hệ thống
                </button>
              </form>
            </div>

            {/* DANH SÁCH SỰ KIỆN */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-[#004A52] mb-3">Các sự kiện đang mở ({events.length})</h2>
                {events.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có sự kiện nào.</p>
                ) : (
                  <div className="divide-y divide-slate-100 space-y-4">
                    {events.map((ev) => (
                      <div key={ev.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">
                              {ev.category}
                            </span>
                            <span className="text-[10px] font-bold text-[#EE6425] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                              Mục: {ev.categoryCode} (+{ev.points} ĐRL)
                            </span>
                            <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                              {ev.gpsRadius === "none" ? "Bỏ qua GPS" : `GPS: ${ev.gpsRadius}m`}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 mt-1">{ev.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{ev.time} • {ev.location}</p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setActiveQrEvent(ev)}
                            className="bg-[#007A87] hover:bg-[#005a63] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5"
                          >
                            <span>📲</span> Bật Mã QR
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="text-red-500 hover:text-red-700 text-xs font-bold px-2 py-1"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LƯỢT ĐĂNG KÝ */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <h2 className="text-base font-bold text-[#004A52] mb-3">
                  Danh sách sinh viên đã đăng ký tham gia ({registrations.length})
                </h2>
                {registrations.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có sinh viên nào đăng ký.</p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">MSSV</th>
                        <th className="p-2.5">Họ tên</th>
                        <th className="p-2.5">Lớp</th>
                        <th className="p-2.5">Sự kiện</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registrations.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#007A87]">{r.mssv}</td>
                          <td className="p-2.5 font-medium text-slate-800">{r.fullName}</td>
                          <td className="p-2.5 text-slate-600">{r.studentClass}</td>
                          <td className="p-2.5 text-[#EE6425] font-semibold">{r.eventTitle}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BÀI VIẾT */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo bài viết / Hoạt động mới</h2>
              <form onSubmit={handleAddPost} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục *</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                  >
                    <option value="Phong trào">Phong trào</option>
                    <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                    <option value="Tổ chức - Đoàn thể">Tổ chức - Đoàn thể</option>
                    <option value="Hội thảo Cơ khí">Hội thảo Cơ khí</option>
                    <option value="Tình nguyện">Tình nguyện</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh bìa (16:9)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#EE6425]"
                  />
                  {postCoverImage && (
                    <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                      <img src={postCoverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung bài viết</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                    <button type="button" onClick={() => formatText("bold")} className="px-2.5 py-1 bg-white border border-slate-200 rounded font-black">B</button>
                    <button type="button" onClick={() => formatText("italic")} className="px-2.5 py-1 bg-white border border-slate-200 rounded italic">I</button>
                    <button type="button" onClick={() => formatText("underline")} className="px-2.5 py-1 bg-white border border-slate-200 rounded underline">U</button>
                    <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded cursor-pointer flex items-center gap-1">
                      📷 Chèn hình
                      <input type="file" accept="image/*" onChange={handleInsertBodyImage} className="hidden" />
                    </label>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    className="w-full min-h-[160px] max-h-[300px] overflow-y-auto border border-t-0 border-slate-300 rounded-b-xl p-4 text-sm outline-none bg-white"
                  ></div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow"
                >
                  Xuất bản bài viết
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Bài viết đã xuất bản ({posts.length})</h2>
              <div className="divide-y divide-slate-100 space-y-3">
                {posts.map((p) => (
                  <div key={p.id} className="pt-3 first:pt-0">
                    <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">{p.category}</span>
                    <h3 className="text-xs font-bold text-slate-800 mt-1">{p.title}</h3>
                    <span className="text-[10px] text-slate-400 mt-1 block">Ngày: {p.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SINH VIÊN */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/20 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-800 mb-1">📋 Dán trực tiếp từ bảng Excel</h3>
              <p className="text-[11px] text-slate-500 mb-2">Quét chọn (MSSV, Họ tên, Lớp) từ Excel rồi dán vào đây:</p>
              <textarea
                rows={5}
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder="CNDT2411081	Phạm Thái Minh Đăng	CNKT Tự động hóa K2024"
                className="w-full border border-emerald-300 rounded-xl p-3 text-xs font-mono bg-white outline-none"
              ></textarea>
              <button
                type="button"
                onClick={handleProcessPasteData}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition text-xs uppercase"
              >
                ✓ Thêm danh sách sinh viên ngay
              </button>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <h2 className="text-base font-bold text-[#004A52] mb-3">Danh sách sinh viên ({students.length})</h2>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">MSSV</th>
                    <th className="p-2.5">Họ và tên</th>
                    <th className="p-2.5">Email (@student.ctuet.edu.vn)</th>
                    <th className="p-2.5">Lớp</th>
                    <th className="p-2.5">Mật khẩu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-[#007A87]">{s.mssv}</td>
                      <td className="p-2.5 font-medium text-slate-800">{s.fullName}</td>
                      <td className="p-2.5 text-[#EE6425] font-mono text-[11px] font-semibold">{s.email || generateCtuetEmail(s.fullName, s.mssv)}</td>
                      <td className="p-2.5 text-slate-600">{s.studentClass}</td>
                      <td className="p-2.5 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block my-1">{s.password}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* POPUP MÀN HÌNH MÁY CHIẾU */}
      {activeQrEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-[#EE6425] text-center animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-orange-100 text-[#EE6425] font-black text-xs px-3 py-1 rounded-full uppercase">
                MÀN HÌNH TRÌNH CHIẾU ĐIỂM DANH
              </span>
              <button
                onClick={() => setActiveQrEvent(null)}
                className="text-slate-400 hover:text-slate-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-[#004A52] leading-snug">
              {activeQrEvent.title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Mục ĐRL: <strong>{activeQrEvent.categoryCode}</strong> • Điểm cộng: <strong>+{activeQrEvent.points} Điểm</strong>
            </p>

            <div className="my-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
                  activeQrEvent.id
                )}`}
                alt="QR Code Điểm danh"
                className="w-56 h-56 sm:w-64 sm:h-64 mx-auto rounded-xl"
              />
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">
              <p><strong>Địa điểm:</strong> {activeQrEvent.location}</p>
              <p>
                <strong>Tọa độ ghim:</strong> {activeQrEvent.lat}, {activeQrEvent.lng} (
                <a
                  href={`https://www.google.com/maps?q=${activeQrEvent.lat},${activeQrEvent.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#007A87] font-bold underline ml-1"
                >
                  Mở Google Maps
                </a>
                )
              </p>
              <p className="text-[#EE6425] font-bold">
                Quy định GPS: {activeQrEvent.gpsRadius === "none" ? "Bỏ qua GPS" : `Bán kính ${activeQrEvent.gpsRadius}m`}
              </p>
            </div>

            <button
              onClick={() => setActiveQrEvent(null)}
              className="mt-6 w-full bg-[#004A52] hover:bg-[#00343a] text-white font-bold py-3 rounded-xl text-xs uppercase"
            >
              Đóng màn hình điểm danh
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

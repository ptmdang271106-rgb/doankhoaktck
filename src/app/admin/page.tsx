"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const [activeTab, setActiveTab] = useState<"posts" | "events" | "students">("events");
  const [students, setStudents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // State tạo sinh viên
  const [pasteData, setPasteData] = useState("");
  const [newMssv, setNewMssv] = useState("");
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("");

  // State bài viết
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Phong trào");
  const [postCoverImage, setPostCoverImage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  // State tạo sự kiện
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Phong trào");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("Hội trường A - CTUET");
  const [eventPoints, setEventPoints] = useState("+5 ĐRL");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventDesc, setEventDesc] = useState("");

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

  // TẠO SỰ KIỆN MỚI CHO SINH VIÊN ĐĂNG KÝ
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent = {
      id: "ev-" + Date.now().toString(),
      title: eventTitle,
      category: eventCategory,
      time: eventTime || "07:30 - Ngày 30/08/2026",
      location: eventLocation,
      points: eventPoints,
      deadline: eventDeadline || "23:59 - Ngày 29/08/2026",
      description: eventDesc,
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const updated = [newEvent, ...events];
    setEvents(updated);
    localStorage.setItem("ctut_custom_events", JSON.stringify(updated));

    setEventTitle("");
    setEventDesc("");
    setEventTime("");
    setEventDeadline("");
    alert("Đã đăng sự kiện thành công! Sinh viên có thể vào trang Hoạt động để đăng ký.");
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa sự kiện này?")) {
      const updated = events.filter((e) => e.id !== id);
      setEvents(updated);
      localStorage.setItem("ctut_custom_events", JSON.stringify(updated));
    }
  };

  // QUẢN LÝ SINH VIÊN
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

  // SOẠN BÀI VIẾT
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
            <p className="text-xs text-slate-500 mt-0.5">Quản lý bài viết, sự kiện & danh sách đăng ký của sinh viên</p>
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
            Đăng & Quản lý Sự kiện ({events.length})
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

        {/* TAB 1: SỰ KIỆN MỞ ĐĂNG KÝ */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo Sự Kiện Mới Cho Sinh Viên Đăng Ký</h2>
              <form onSubmit={handleAddEvent} className="space-y-3">
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
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                    >
                      <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                      <option value="Phong trào">Phong trào</option>
                      <option value="Tình nguyện">Tình nguyện</option>
                      <option value="Hội thảo Cơ khí">Hội thảo Cơ khí</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Điểm rèn luyện</label>
                    <input
                      type="text"
                      value={eventPoints}
                      onChange={(e) => setEventPoints(e.target.value)}
                      placeholder="+5 ĐRL"
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                    />
                  </div>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Địa điểm tổ chức *</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Hội trường A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
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

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mô tả tóm tắt nội dung</label>
                  <textarea
                    rows={3}
                    value={eventDesc}
                    onChange={(e) => setEventDesc(e.target.value)}
                    placeholder="Mục đích chương trình, quyền lợi khi tham gia..."
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-[#EE6425]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-2.5 rounded-xl transition text-xs uppercase shadow"
                >
                  Đăng sự kiện lên hệ thống
                </button>
              </form>
            </div>

            {/* DANH SÁCH SỰ KIỆN & LƯỢT ĐĂNG KÝ */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-[#004A52] mb-3">Các sự kiện đang mở ({events.length})</h2>
                {events.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có sự kiện nào được tạo.</p>
                ) : (
                  <div className="divide-y divide-slate-100 space-y-3">
                    {events.map((ev) => (
                      <div key={ev.id} className="pt-3 first:pt-0 flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">
                              {ev.category}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              {ev.points}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 mt-1">{ev.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{ev.time} • {ev.location}</p>
                          <p className="text-[11px] text-red-500 font-semibold mt-0.5">⏳ Hạn: {ev.deadline}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="text-red-500 hover:text-red-700 text-xs font-bold"
                        >
                          Xóa
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DANH SÁCH SINH VIÊN ĐÃ ĐĂNG KÝ */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-[#004A52]">
                    Danh sách sinh viên đã đăng ký tham gia ({registrations.length})
                  </h2>
                  {registrations.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm("Xóa lịch sử đăng ký?")) {
                          setRegistrations([]);
                          localStorage.removeItem("ctut_event_registrations");
                        }
                      }}
                      className="text-xs text-red-500 hover:underline font-bold"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                {registrations.length === 0 ? (
                  <p className="text-xs text-slate-400">Chưa có sinh viên nào đăng ký.</p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">MSSV</th>
                        <th className="p-2.5">Họ tên</th>
                        <th className="p-2.5">Lớp</th>
                        <th className="p-2.5">Sự kiện tham gia</th>
                        <th className="p-2.5">Thời gian ĐK</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {registrations.map((r, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#007A87]">{r.mssv}</td>
                          <td className="p-2.5 font-medium text-slate-800">{r.fullName}</td>
                          <td className="p-2.5 text-slate-600">{r.studentClass}</td>
                          <td className="p-2.5 text-[#EE6425] font-semibold">{r.eventTitle}</td>
                          <td className="p-2.5 text-slate-400 text-[11px]">{r.createdAt}</td>
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
                    placeholder="VD: Hội nghị Khoa học Cơ khí 2026..."
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
                      Chèn hình
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
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase"
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
              <h3 className="text-sm font-bold text-emerald-800 mb-1"> Dán trực tiếp từ bảng Excel</h3>
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
    </main>
  );
}

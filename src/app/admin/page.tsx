"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const EVENT_CRITERIA_OPTIONS = [
  { code: "I.1", label: "I.1 Diem TB hoc tap tich luy thang 4", max: 5 },
  { code: "I.2", label: "I.2 Giay chung nhan lop ky nang hoc tap", max: 3 },
  { code: "I.3", label: "I.3 Hoi thao / Toa dam cap Khoa, Truong", max: 3 },
  { code: "I.4", label: "I.4 Cuoc thi hoc thuat cap Khoa / Truong", max: 7 },
  { code: "I.5", label: "I.5 Cuoc thi hoc thuat ngoai Truong", max: 8 },
  { code: "I.6", label: "I.6 Bao cao khoa hoc cap Khoa", max: 8 },
  { code: "I.7", label: "I.7 Tham gia de tai NCKH cap Truong", max: 10 },
  { code: "I.8", label: "I.8 Viet bai bao khoa hoc", max: 8 },
  { code: "I.9", label: "I.9 Cuoc thi khoi nghiep cap Truong", max: 7 },
  { code: "I.10", label: "I.10 Cuoc thi khoi nghiep ngoai Truong", max: 8 },
  { code: "I.11", label: "I.11 Thanh vien CLB hoc thuat", max: 2 },
  { code: "I.12", label: "I.12 Cac hoat dong hoc thuat khac", max: 3 },

  { code: "II.1", label: "II.1 Y thuc, thai do trong hoc tap", max: 5 },
  { code: "II.2", label: "II.2 Chap hanh noi quy, quy che Truong", max: 5 },
  { code: "II.3", label: "II.3 Chap hanh quy che thi cu", max: 5 },
  { code: "II.4", label: "II.4 Chap hanh quy dinh thu vien", max: 5 },
  { code: "II.5", label: "II.5 Chap hanh quy dinh phong hoc, xuong", max: 5 },
  { code: "II.6", label: "II.6 Thuc hien dang ky ngoai tru", max: 5 },
  { code: "II.7", label: "II.7 Mac dong phuc dung quy dinh", max: 5 },
  { code: "II.8", label: "II.8 Sinh hoat lop voi CVHT", max: 5 },

  { code: "III.1", label: "III.1 Hoat dong bat buoc do Khoa/Truong to chuc", max: 3 },
  { code: "III.2", label: "III.2 Dai hoi Chi doan/Chi hoi, sinh hoat Chi doan", max: 3 },
  { code: "III.3", label: "III.3 Bao cao chuyen de do Truong to chuc", max: 4 },
  { code: "III.4", label: "III.4 Hoat dong ngoai khoa / Cuoc thi cap CLB/Khoa/Truong", max: 7 },
  { code: "III.5", label: "III.5 Ngoai khoa / Cuoc thi tu cap Thanh pho tro len", max: 8 },
  { code: "III.6", label: "III.6 Duoc ket nap Doan", max: 5 },
  { code: "III.7", label: "III.7 Duoc ket nap Dang", max: 8 },
  { code: "III.8", label: "III.8 Hoat dong phong trao do Doan/Hoi dieu dong", max: 4 },
  { code: "III.9", label: "III.9 Thanh vien CLB, doi, nhom Doan - Hoi", max: 2 },
  { code: "III.10", label: "III.10 Hoc tap cac bai ly luan chinh tri", max: 4 },
  { code: "III.11", label: "III.11 Den on dap nghia, Thap nen tri an", max: 3 },
  { code: "III.12", label: "III.12 Lao dong tinh nguyen tai Truong", max: 3 },
  { code: "III.13", label: "III.13 Khen thuong phong trao ca nhan", max: 7 },
  { code: "III.14", label: "III.14 Tap the duoc khen thuong phong trao", max: 1 },
  { code: "III.15", label: "III.15 Cac hoat dong phong trao khac", max: 3 },

  { code: "IV.1", label: "IV.1 Chap hanh phap luat Nha nuoc", max: 10 },
  { code: "IV.2", label: "IV.2 Hanh vi tot, tinh than se chia, giup do nguoi yeu the", max: 5 },
  { code: "IV.3", label: "IV.3 Bieu duong, khen thuong hoat dong xa hoi ngoai truong", max: 5 },
  { code: "IV.4", label: "IV.4 Giao luu cac CLB, Doi, Nhom truc thuoc", max: 5 },
  { code: "IV.5", label: "IV.5 Chuong trinh Tu van tuyen sinh", max: 5 },
  { code: "IV.6", label: "IV.6 Cong tac ho tro nhap hoc sinh vien moi", max: 5 },
  { code: "IV.7", label: "IV.7 Cong tac kham suc khoe sinh vien", max: 5 },
  { code: "IV.8", label: "IV.8 Cong tac to chuc Ngay hoi viec lam", max: 5 },
  { code: "IV.9", label: "IV.9 Cong tac to chuc Le Tot nghiep", max: 5 },
  { code: "IV.10", label: "IV.10 Cong tac kiem tra ho so sinh vien", max: 5 },
  { code: "IV.11", label: "IV.11 Tham gia cac phien giao dich viec lam", max: 3 },
  { code: "IV.12", label: "IV.12 Hien mau tinh nguyen", max: 10 },
  { code: "IV.13", label: "IV.13 Chuong trinh Xuan tinh nguyen", max: 5 },
  { code: "IV.14", label: "IV.14 Chien dich Tinh nguyen Mua he xanh", max: 7 },
  { code: "IV.15", label: "IV.15 Chuong trinh Ngay Chu nhat xanh", max: 5 },
  { code: "IV.16", label: "IV.16 Chuong trinh Thu Bay tinh nguyen", max: 5 },
  { code: "IV.17", label: "IV.17 Chuong trinh Chao don tan sinh vien", max: 5 },
  { code: "IV.18", label: "IV.18 Trach nhiem xa hoi va phat trien ben vung", max: 3 },

  { code: "V.1", label: "V.1 Tham gia tich cuc phong trao Lop, Doan, Hoi", max: 3 },
  { code: "V.2", label: "V.2 Can bo Lop/Doan/Hoi hoan thanh tot nhiem vu", max: 5 },
  { code: "V.3", label: "V.3 Sinh vien dat giai hoc tap, NCKH", max: 7 },
  { code: "V.4", label: "V.4 Bang khen UBND Tinh/Thanh pho tro len", max: 5 },
  { code: "V.5", label: "V.5 Sinh vien 5 Tot cap Truong, Doan vien tieu bieu", max: 6 },
  { code: "V.6", label: "V.6 Sinh vien 5 Tot cap Thanh/Trung uong, Sao Thang Gieng", max: 10 },
  { code: "V.7", label: "V.7 Dat danh hieu Doan vien uu tu", max: 6 },
  { code: "V.8", label: "V.8 Giay khen tap the cua Doan trao tang", max: 2 },
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

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"students" | "events" | "posts">("students");
  const [students, setStudents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);

  // State sinh vien
  const [pasteData, setPasteData] = useState("");

  // State su kien
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Phong trào");
  const [eventCategoryCode, setEventCategoryCode] = useState("III.8");
  const [eventPoints, setEventPoints] = useState<number>(4);
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("Hội trường A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [eventLat, setEventLat] = useState<number>(10.0469);
  const [eventLng, setEventLng] = useState<number>(105.7681);
  const [gpsRadiusMode, setGpsRadiusMode] = useState<"none" | "100" | "200">("200");
  const [activeQrEvent, setActiveQrEvent] = useState<any>(null);

  // State bai viet
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Phong trào");
  const [postCoverImage, setPostCoverImage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const fetchAllData = async () => {
    const { data: stdData } = await supabase.from("students").select("*").order("id", { ascending: false });
    if (stdData) setStudents(stdData);

    const { data: postData } = await supabase.from("posts").select("*").order("id", { ascending: false });
    if (postData) setPosts(postData);

    const { data: evData } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (evData) setEvents(evData);

    const { data: regData } = await supabase.from("registrations").select("*").order("id", { ascending: false });
    if (regData) setRegistrations(regData);
  };

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/admin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      alert("Khong co quyen truy cap trang quan tri!");
      router.push("/");
      return;
    }

    fetchAllData();
  }, [router]);

  // ================= 1. QUAN LY SINH VIEN =================
  const handleProcessPasteData = async () => {
    if (!pasteData.trim()) return alert("Vui long dan du lieu!");
    const rows = pasteData.split(/\r\n|\n/).filter((r) => r.trim() !== "");
    const imported: any[] = [];

    for (const row of rows) {
      const cols = row.split(/\t|,/).map((c) => c.trim().replace(/^"|"$/g, ""));
      if (cols.length >= 2 && cols[0] && !cols[0].toLowerCase().includes("mssv")) {
        const mssv = cols[0].replace(/\s+/g, "").toUpperCase();
        const full_name = cols[1];
        const student_class = cols[2] || "CNKT Tu dong hoa K2024";
        const password = mssv.slice(-3);
        const email = generateCtuetEmail(full_name, mssv);

        imported.push({
          mssv,
          full_name,
          email,
          student_class,
          password,
        });
      }
    }

    if (imported.length > 0) {
      const { error } = await supabase.from("students").upsert(imported, { onConflict: "mssv" });
      if (error) {
        alert("Loi luu du lieu: " + error.message);
      } else {
        alert(`Da luu ${imported.length} sinh vien.`);
        fetchAllData();
        setPasteData("");
      }
    }
  };

  const handleDeleteSingleStudent = async (mssv: string, name: string) => {
    if (confirm(`Xac nhan xoa sinh vien: ${name} (MSSV: ${mssv})?`)) {
      const { error } = await supabase.from("students").delete().eq("mssv", mssv);
      if (error) {
        alert("Loi khi xoa: " + error.message);
      } else {
        setStudents(students.filter((s) => s.mssv !== mssv));
      }
    }
  };

  const handleDeleteAllStudents = async () => {
    if (students.length === 0) return alert("Danh sach hien dang trong!");
    if (confirm("CANH BAO: Xac nhan XOA TOAN BO danh sach sinh vien tren he thong?")) {
      if (confirm("Hanh dong nay khong the khoi phuc. Tiep tuc xoa?")) {
        const { error } = await supabase.from("students").delete().neq("id", 0);
        if (error) {
          alert("Loi khi xoa: " + error.message);
        } else {
          setStudents([]);
          alert("Da xoa toan bo danh sach sinh vien thanh cong.");
        }
      }
    }
  };

  // ================= 2. QUAN LY SU KIEN =================
  const handleSelectCriteria = (selectedCode: string) => {
    setEventCategoryCode(selectedCode);
    const item = EVENT_CRITERIA_OPTIONS.find((c) => c.code === selectedCode);
    if (item) setEventPoints(item.max);
  };

  const handleGetCurrentGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setEventLat(pos.coords.latitude);
          setEventLng(pos.coords.longitude);
          alert(`Toa do hien tai: ${pos.coords.latitude}, ${pos.coords.longitude}`);
        },
        () => alert("Khong the truy cap vi tri GPS.")
      );
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const criteriaItem = EVENT_CRITERIA_OPTIONS.find((c) => c.code === eventCategoryCode);

    const newEvent = {
      id: "ev-" + Date.now().toString(),
      title: eventTitle,
      category: eventCategory,
      category_code: eventCategoryCode,
      category_label: criteriaItem?.label || eventCategoryCode,
      points: Number(eventPoints),
      time: eventTime || "07:30 - Ngay 30/08/2026",
      location: eventLocation,
      deadline: eventDeadline || "23:59 - Ngay 29/08/2026",
      description: eventDesc,
      lat: eventLat,
      lng: eventLng,
      gps_radius: gpsRadiusMode,
    };

    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      alert("Loi them su kien: " + error.message);
    } else {
      alert("Them su kien thanh cong.");
      fetchAllData();
      setEventTitle("");
      setEventDesc("");
      setEventTime("");
      setEventDeadline("");
    }
  };

  const handleDeleteSingleEvent = async (id: string, title: string) => {
    if (confirm(`Xac nhan xoa su kien: "${title}"?`)) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) {
        alert("Loi khi xoa: " + error.message);
      } else {
        setEvents(events.filter((e) => e.id !== id));
      }
    }
  };

  const handleDeleteAllEvents = async () => {
    if (events.length === 0) return alert("Danh sach su kien dang trong!");
    if (confirm("CANH BAO: Xac nhan XOA TOAN BO tat ca su kien tren he thong?")) {
      if (confirm("Toan bo su kien se bi xoa vinh vien. Tiep tuc?")) {
        const { error } = await supabase.from("events").delete().neq("id", "none");
        if (error) {
          alert("Loi khi xoa: " + error.message);
        } else {
          setEvents([]);
          alert("Da xoa toan bo danh sach su kien.");
        }
      }
    }
  };

  // ================= 3. QUAN LY BAI VIET =================
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

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = editorRef.current ? editorRef.current.innerHTML : "";
    const newPost = {
      title: postTitle,
      category: postCategory,
      cover_image: postCoverImage || "",
      content_html: contentHtml,
      content: editorRef.current ? editorRef.current.innerText : "",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    const { error } = await supabase.from("posts").insert([newPost]);
    if (error) {
      alert("Loi dang bai: " + error.message);
    } else {
      alert("Xuat ban bai viet thanh cong.");
      fetchAllData();
      setPostTitle("");
      setPostCoverImage("");
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
  };

  const handleDeleteSinglePost = async (id: number, title: string) => {
    if (confirm(`Xac nhan xoa bai viet: "${title}"?`)) {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) {
        alert("Loi khi xoa: " + error.message);
      } else {
        setPosts(posts.filter((p) => p.id !== id));
      }
    }
  };

  const handleDeleteAllPosts = async () => {
    if (posts.length === 0) return alert("Danh sach bai viet dang trong!");
    if (confirm("CANH BAO: Xac nhan XOA TOAN BO tat ca bai viet tren he thong?")) {
      if (confirm("Toan bo bai viet se bi xoa khoi trang chu. Tiep tuc?")) {
        const { error } = await supabase.from("posts").delete().neq("id", 0);
        if (error) {
          alert("Loi khi xoa: " + error.message);
        } else {
          setPosts([]);
          alert("Da xoa toan bo bai viet thanh cong.");
        }
      }
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#004A52]">BANG DIEU KHIEN QUAN TRI VIEN</h1>
            <p className="text-xs text-slate-500 mt-0.5">Quan ly he thong: Sinh vien, Su kien, Bai viet</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">
              Ve trang chu
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("ctut_current_user");
                router.push("/");
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Dang xuat
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "students"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quan ly Sinh vien ({students.length})
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "events"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Su kien va Diem danh ({events.length})
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "posts"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Bai viet ({posts.length})
          </button>
        </div>

        {/* TAB 1: QUAN LY SINH VIEN */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/20 shadow-sm">
              <h3 className="text-sm font-bold text-emerald-800 mb-1">Dan danh sach sinh vien tu Excel</h3>
              <p className="text-[11px] text-slate-500 mb-2">Chon 3 cot (MSSV, Ho ten, Lop) tu file Excel roi dan vao day:</p>
              <textarea
                rows={6}
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
                placeholder="CNDT2411081	Pham Thai Minh Dang	CNKT Tu dong hoa K2024"
                className="w-full border border-emerald-300 rounded-xl p-3 text-xs font-mono bg-white outline-none"
              ></textarea>
              <button
                type="button"
                onClick={handleProcessPasteData}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition text-xs uppercase shadow"
              >
                Luu danh sach sinh vien
              </button>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
                <h2 className="text-base font-bold text-[#004A52]">
                  Danh sach sinh vien ({students.length})
                </h2>
                {students.length > 0 && (
                  <button
                    onClick={handleDeleteAllStudents}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow"
                  >
                    Xoa tat ca danh sach
                  </button>
                )}
              </div>

              {students.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Chua co sinh vien nao trong danh sach.
                </div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">MSSV</th>
                      <th className="p-2.5">Ho va ten</th>
                      <th className="p-2.5">Email (@student.ctuet.edu.vn)</th>
                      <th className="p-2.5">Lop</th>
                      <th className="p-2.5">Mat khau</th>
                      <th className="p-2.5 text-center">Thao tac</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-[#007A87]">{s.mssv}</td>
                        <td className="p-2.5 font-medium text-slate-800">{s.full_name}</td>
                        <td className="p-2.5 text-[#EE6425] font-mono text-[11px] font-semibold">{s.email}</td>
                        <td className="p-2.5 text-slate-600">{s.student_class}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block my-1">{s.password}</td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => handleDeleteSingleStudent(s.mssv, s.full_name)}
                            className="text-red-600 hover:text-red-800 font-bold hover:underline"
                          >
                            Xoa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SU KIEN */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tao Su Kien Moi</h2>
              <form onSubmit={handleAddEvent} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ten su kien / Hoat dong *</label>
                  <input
                    type="text"
                    required
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="VD: Hoi thao AI trong thiet ke CAD/CAM..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chuyen muc</label>
                    <select
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none"
                    >
                      <option value="Phong trào">Phong trao</option>
                      <option value="Học thuật - NCKH">Hoc thuat - NCKH</option>
                      <option value="Tình nguyện">Tinh nguyen</option>
                      <option value="Hội thảo Cơ khí">Hoi thao Co khi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Muc DRL (QD 147)</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Diem ren luyen cong *</label>
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thoi gian dien ra *</label>
                  <input
                    type="text"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="07:30 - Ngay 30/08/2026"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dia chi to chuc *</label>
                  <input
                    type="text"
                    required
                    value={eventLocation}
                    onChange={(e) => setEventLocation(e.target.value)}
                    placeholder="Hoi truong A - Truong DH Ky thuat - Cong nghe Can Tho"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#004A52]">Ghim GPS Google Maps:</span>
                    <button
                      type="button"
                      onClick={handleGetCurrentGps}
                      className="text-[11px] bg-teal-50 text-[#007A87] hover:bg-teal-100 font-bold px-2.5 py-1 rounded-lg border border-teal-200"
                    >
                      Lay GPS tai day
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <input
                      type="number"
                      step="0.0001"
                      value={eventLat}
                      onChange={(e) => setEventLat(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                    />
                    <input
                      type="number"
                      step="0.0001"
                      value={eventLng}
                      onChange={(e) => setEventLng(Number(e.target.value))}
                      className="w-full border border-slate-300 rounded-lg p-1.5 bg-white text-xs"
                    />
                  </div>
                  <select
                    value={gpsRadiusMode}
                    onChange={(e: any) => setGpsRadiusMode(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-1.5 text-xs bg-white font-semibold"
                  >
                    <option value="100">Ban kinh 100 met</option>
                    <option value="200">Ban kinh 200 met (Khuyen dung)</option>
                    <option value="none">Bo qua GPS (Diem danh tu do)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Han chot dang ky *</label>
                  <input
                    type="text"
                    required
                    value={eventDeadline}
                    onChange={(e) => setEventDeadline(e.target.value)}
                    placeholder="23:59 - Ngay 29/08/2026"
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow tracking-wider"
                >
                  Dang su kien len he thong
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-200">
                  <h2 className="text-base font-bold text-[#004A52]">Su kien tren he thong ({events.length})</h2>
                  {events.length > 0 && (
                    <button
                      onClick={handleDeleteAllEvents}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow"
                    >
                      Xoa tat ca su kien
                    </button>
                  )}
                </div>

                {events.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">Chua co su kien nao.</p>
                ) : (
                  <div className="divide-y divide-slate-100 space-y-4">
                    {events.map((ev) => (
                      <div key={ev.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">{ev.category}</span>
                            <span className="text-[10px] font-bold text-[#EE6425] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded">
                              Muc: {ev.category_code} (+{ev.points} DRL)
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 mt-1">{ev.title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Thoi gian: {ev.time} | Dia diem: {ev.location}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setActiveQrEvent(ev)}
                            className="bg-[#007A87] hover:bg-[#005a63] text-white font-bold text-xs px-3.5 py-2 rounded-xl transition shadow"
                          >
                            Mo Ma QR
                          </button>
                          <button
                            onClick={() => handleDeleteSingleEvent(ev.id, ev.title)}
                            className="text-red-600 hover:text-red-800 text-xs font-bold px-2 py-1 hover:underline"
                          >
                            Xoa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* LUOT DANG KY */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
                <h2 className="text-base font-bold text-[#004A52] mb-3">
                  Danh sach sinh vien da dang ky ({registrations.length})
                </h2>
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">MSSV</th>
                      <th className="p-2.5">Ho ten</th>
                      <th className="p-2.5">Lop</th>
                      <th className="p-2.5">Su kien</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {registrations.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-[#007A87]">{r.mssv}</td>
                        <td className="p-2.5 font-medium text-slate-800">{r.full_name}</td>
                        <td className="p-2.5 text-slate-600">{r.student_class}</td>
                        <td className="p-2.5 text-[#EE6425] font-semibold">{r.event_title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: BAI VIET */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tao bai viet moi</h2>
              <form onSubmit={handleAddPost} className="space-y-4">
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Tieu de bai viet..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                />
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none"
                >
                  <option value="Phong trào">Phong trao</option>
                  <option value="Học thuật - NCKH">Hoc thuat - NCKH</option>
                  <option value="Tổ chức - Đoàn thể">To chuc - Doan the</option>
                  <option value="Hội thảo Cơ khí">Hoi thao Co khi</option>
                  <option value="Tình nguyện">Tinh nguyen</option>
                </select>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500"
                />
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                  <button type="button" onClick={() => formatText("bold")} className="px-2.5 py-1 bg-white border border-slate-200 rounded font-black">B</button>
                  <button type="button" onClick={() => formatText("italic")} className="px-2.5 py-1 bg-white border border-slate-200 rounded italic">I</button>
                  <button type="button" onClick={() => formatText("underline")} className="px-2.5 py-1 bg-white border border-slate-200 rounded underline">U</button>
                  <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded cursor-pointer">
                    Chen hinh
                    <input type="file" accept="image/*" onChange={handleInsertBodyImage} className="hidden" />
                  </label>
                </div>
                <div
                  ref={editorRef}
                  contentEditable
                  className="w-full min-h-[160px] border border-t-0 border-slate-300 rounded-b-xl p-4 text-sm outline-none bg-white"
                ></div>
                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl text-xs uppercase"
                >
                  Xuat ban bai viet
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-2 border-b border-slate-200">
                <h2 className="text-base font-bold text-[#004A52]">Bai viet da xuat ban ({posts.length})</h2>
                {posts.length > 0 && (
                  <button
                    onClick={handleDeleteAllPosts}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow"
                  >
                    Xoa tat ca bai viet
                  </button>
                )}
              </div>

              {posts.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">Chua co bai viet nao.</p>
              ) : (
                <div className="divide-y divide-slate-100 space-y-3">
                  {posts.map((p) => (
                    <div key={p.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">{p.category}</span>
                        <h3 className="text-xs font-bold text-slate-800 mt-1">{p.title}</h3>
                        <span className="text-[10px] text-slate-400 mt-1 block">Ngay: {p.date}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteSinglePost(p.id, p.title)}
                        className="text-red-600 hover:text-red-800 text-xs font-bold hover:underline flex-shrink-0"
                      >
                        Xoa
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* POPUP MA QR */}
      {activeQrEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-[#EE6425] text-center">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-orange-100 text-[#EE6425] font-black text-xs px-3 py-1 rounded-full uppercase">
                MAN HINH TRINH CHIEU DIEM DANH
              </span>
              <button onClick={() => setActiveQrEvent(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#004A52]">{activeQrEvent.title}</h2>
            <div className="my-6 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 inline-block">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(activeQrEvent.id)}`}
                alt="QR Code"
                className="w-56 h-56 mx-auto rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-600">Dia diem: {activeQrEvent.location}</p>
            <p className="text-xs text-[#007A87] font-bold mt-1">Ma Check-in: <code className="text-[#EE6425]">{activeQrEvent.id}</code></p>
            <button
              onClick={() => setActiveQrEvent(null)}
              className="mt-6 w-full bg-[#004A52] text-white font-bold py-3 rounded-xl text-xs uppercase"
            >
              Dong man hinh
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

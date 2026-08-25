"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SuKienHoatDongPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registeredTitles, setRegisteredTitles] = useState<string[]>([]);
  const [selectedEventToRegister, setSelectedEventToRegister] = useState<any>(null);
  const [note, setNote] = useState("");
  const [successToast, setSuccessToast] = useState("");

  const loadData = async (user: any) => {
    // 1. Tải danh sách sự kiện từ Supabase
    const { data: evData } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (evData && evData.length > 0) {
      setEvents(evData);
    } else {
      setEvents([
        {
          id: "ev-1",
          title: "Hội thảo: Ứng dụng AI tạo sinh trong thiết kế CAD/CAM SolidWorks 2026",
          category: "Học thuật - NCKH",
          category_code: "I.3",
          points: 3,
          time: "07:30 - Ngày 28/08/2026",
          location: "Hội trường Khu A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ",
          deadline: "23:59 - Ngày 27/08/2026",
          description: "Chuỗi hội thảo nâng cao năng lực ứng dụng AI vào thiết kế đồ họa kỹ thuật.",
        },
      ]);
    }

    // 2. Tải danh sách đã đăng ký của user này từ Cloud
    if (user) {
      const { data: regData } = await supabase
        .from("registrations")
        .select("event_title")
        .eq("mssv", user.mssv);
      if (regData) {
        setRegisteredTitles(regData.map((r) => r.event_title));
      }
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    let user = null;
    if (userStr) {
      user = JSON.parse(userStr);
      setCurrentUser(user);
    }
    loadData(user);
  }, []);

  const handleOpenRegisterModal = (ev: any) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập tài khoản sinh viên trước khi đăng ký!");
      router.push("/dang-nhap?redirect=/dang-ky");
      return;
    }
    setSelectedEventToRegister(ev);
    setNote("");
  };

  const handleConfirmRegister = async () => {
    if (!selectedEventToRegister || !currentUser) return;

    const newReg = {
      event_id: selectedEventToRegister.id,
      event_title: selectedEventToRegister.title,
      mssv: currentUser.mssv,
      full_name: currentUser.fullName,
      student_class: currentUser.studentClass || "Khoa Cơ Khí",
    };

    const { error } = await supabase.from("registrations").insert([newReg]);
    if (error) {
      alert("Lỗi khi đăng ký: " + error.message);
      return;
    }

    setRegisteredTitles([...registeredTitles, selectedEventToRegister.title]);
    setSelectedEventToRegister(null);
    setSuccessToast(`Đăng ký thành công hoạt động: ${selectedEventToRegister.title}`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      <div className="border-b border-gray-100 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo-doankhoa.png" alt="Logo Đoàn Khoa" className="h-10 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-4 text-xs font-semibold">
            {currentUser ? (
              <span className="text-[#006674]">{currentUser.fullName} ({currentUser.mssv})</span>
            ) : (
              <Link href="/dang-nhap?redirect=/dang-ky" className="bg-[#EE6425] text-white px-3.5 py-1.5 rounded-full">
                Đăng nhập
              </Link>
            )}
            <Link href="/" className="text-[#007A87] hover:underline">← Trang chủ</Link>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex items-center gap-2 text-sm font-bold text-[#006674] mb-8">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-400 font-normal">›</span>
          <span className="text-slate-600">Sự kiện</span>
        </nav>

        {successToast && (
          <div className="mb-6 p-4 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-between">
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast("")}>✕</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 divide-y divide-gray-100">
            {events.map((ev, idx) => {
              const isRegistered = registeredTitles.includes(ev.title);

              return (
                <div key={ev.id || idx} className="py-8 first:pt-0 group">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                    <div className="sm:col-span-4 aspect-video sm:aspect-square w-full rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      <img
                        src={ev.cover_image || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60"}
                        alt={ev.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    <div className="sm:col-span-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">
                            {ev.category}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Mục {ev.category_code} (+{ev.points} ĐRL)
                          </span>
                        </div>

                        <h2 className="text-base sm:text-[17px] font-black text-[#004A52] leading-snug group-hover:text-[#EE6425] transition-colors cursor-pointer">
                          {ev.title}
                        </h2>

                        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mt-2">
                          {ev.description}
                        </p>

                        <div className="mt-3 text-xs text-slate-500 space-y-1 font-medium">
                          <div><strong>Thời gian:</strong> {ev.time}</div>
                          <div><strong>Địa điểm:</strong> {ev.location}</div>
                          <div className="text-red-600 font-semibold text-[11px]">⏳ <strong>Hạn chót:</strong> {ev.deadline}</div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3">
                        {isRegistered ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-lg">
                            ✓ Đã đăng ký tham gia
                          </span>
                        ) : (
                          <button
                            onClick={() => handleOpenRegisterModal(ev)}
                            className="bg-[#EE6425] hover:bg-[#d85216] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition shadow active:scale-95 uppercase tracking-wider"
                          >
                            Đăng ký tham gia
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h3 className="text-center font-extrabold text-[#004A52] text-sm uppercase tracking-wider mb-4">
                THỜI GIAN DIỄN RA SỰ KIỆN
              </h3>
              <div className="bg-[#FFFDF9] border border-orange-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-4 px-2">
                  <span>Tháng 8, 2026</span>
                </div>
                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-600 mb-3">
                  <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
                </div>
                <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-2.5 items-center">
                  <span className="text-slate-300">26</span><span className="text-slate-300">27</span><span className="text-slate-300">28</span><span className="text-slate-300">29</span><span className="text-slate-300">30</span><span className="text-slate-300">31</span>
                  <span className="text-slate-700">1</span><span className="text-slate-700">2</span><span className="text-slate-700">3</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">4</span>
                  <span className="text-slate-700">5</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">6</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">7</span>
                  <span className="text-slate-700">8</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">9</span>
                  <span className="text-slate-700">10</span><span className="text-slate-700">11</span><span className="text-slate-700">12</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">13</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">14</span>
                  <span className="text-slate-700">15</span><span className="text-slate-700">16</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">17</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">18</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">19</span>
                  <span className="text-slate-700">20</span><span className="text-slate-700">21</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">22</span>
                  <span className="text-slate-700">23</span><span className="text-slate-700">24</span><span className="text-slate-700">25</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">26</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">27</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">28</span>
                  <span className="text-slate-700">29</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">30</span>
                  <span className="w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold">31</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL POPUP */}
      {selectedEventToRegister && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-orange-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-[#004A52] uppercase">Xác Nhận Đăng Ký Tham Gia</h3>
              <button onClick={() => setSelectedEventToRegister(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-orange-50 rounded-xl border border-orange-200">
                <p className="font-bold text-slate-800 text-sm">{selectedEventToRegister.title}</p>
                <p className="text-slate-600 mt-1">{selectedEventToRegister.time}</p>
                <p className="text-emerald-700 font-bold">Mục {selectedEventToRegister.category_code} (+{selectedEventToRegister.points} ĐRL)</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="font-bold text-[#004A52]">{currentUser?.fullName}</p>
                <p className="text-slate-600 font-mono">MSSV: {currentUser?.mssv} • Lớp: {currentUser?.studentClass}</p>
              </div>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ghi chú thêm (nếu có)..."
                className="w-full border border-slate-300 rounded-lg p-2.5 outline-none"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelectedEventToRegister(null)} className="flex-1 bg-slate-100 py-2.5 rounded-lg text-xs font-bold text-slate-600">
                Hủy
              </button>
              <button onClick={handleConfirmRegister} className="flex-1 bg-[#EE6425] hover:bg-[#d85216] text-white py-2.5 rounded-lg text-xs font-bold uppercase">
                Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

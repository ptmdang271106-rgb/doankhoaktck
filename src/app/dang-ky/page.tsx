"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Dữ liệu sự kiện mặc định nếu admin chưa đăng
const DEFAULT_EVENTS = [
  {
    id: "ev-default-1",
    title: "Workshop: Ứng dụng AI tạo sinh trong tối ưu thiết kế CAD/CAM SolidWorks",
    category: "Học thuật - NCKH",
    time: "07:30 - Thứ Bảy, 30/08/2026",
    location: "Hội trường lớn Khu A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ",
    points: "+5 Điểm ĐRL",
    deadline: "23:59 - 29/08/2026",
    description: "Trang bị cho sinh viên Khoa Cơ khí kỹ năng ứng dụng trí tuệ nhân tạo vào thiết kế kỹ thuật và tự động hóa sản xuất.",
  },
  {
    id: "ev-default-2",
    title: "Chiến dịch Tình nguyện: Sửa chữa thiết bị điện - máy công cụ tại Quận Ninh Kiều",
    category: "Phong trào",
    time: "07:00 - Chủ Nhật, 31/08/2026",
    location: "UBND Phường An Khánh, Ninh Kiều, Cần Thơ",
    points: "+10 Điểm ĐRL",
    deadline: "17:00 - 30/08/2026",
    description: "Phát huy tinh thần xung kích, vận dụng kiến thức chuyên môn cơ khí hỗ trợ người dân địa phương.",
  },
  {
    id: "ev-default-3",
    title: "Hội thi Sáng tạo Thiết kế Mô hình Cơ điện tử & Tự động hóa CTUET 2026",
    category: "Học thuật - NCKH",
    time: "13:30 - Ngày 05/09/2026",
    location: "Xưởng thực hành Cơ khí - CTUET",
    points: "+8 Điểm ĐRL",
    deadline: "23:59 - 03/09/2026",
    description: "Sân chơi học thuật bổ ích giúp sinh viên thể hiện đam mê và chế tạo các mô hình cơ cấu truyền động.",
  },
];

export default function SuKienHoatDongPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  // State Hộp thoại xác nhận đăng ký (Modal)
  const [selectedEventToRegister, setSelectedEventToRegister] = useState<any>(null);
  const [note, setNote] = useState("");
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    // 1. Kiểm tra tài khoản đã đăng nhập
    const userStr = localStorage.getItem("ctut_current_user");
    if (userStr) {
      setCurrentUser(JSON.parse(userStr));
    }

    // 2. Lấy danh sách sự kiện do Admin đăng + mặc định
    const adminEvents = JSON.parse(localStorage.getItem("ctut_custom_events") || "[]");
    setEvents([...adminEvents, ...DEFAULT_EVENTS]);

    // 3. Lấy danh sách sự kiện user này đã đăng ký
    const allRegs = JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]");
    if (userStr) {
      const u = JSON.parse(userStr);
      const myRegTitles = allRegs.filter((r: any) => r.mssv === u.mssv).map((r: any) => r.eventTitle);
      setRegisteredIds(myRegTitles);
    }
  }, []);

  // Xử lý khi bấm nút "Đăng ký tham gia"
  const handleOpenRegisterModal = (ev: any) => {
    if (!currentUser) {
      alert("Vui lòng đăng nhập tài khoản sinh viên trước khi đăng ký sự kiện!");
      router.push("/dang-nhap?redirect=/dang-ky");
      return;
    }
    setSelectedEventToRegister(ev);
    setNote("");
  };

  // Xác nhận đăng ký chính thức
  const handleConfirmRegister = () => {
    if (!selectedEventToRegister || !currentUser) return;

    const allRegs = JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]");

    const newReg = {
      id: Date.now().toString(),
      mssv: currentUser.mssv,
      fullName: currentUser.fullName,
      studentClass: currentUser.studentClass || "Khoa Cơ Khí",
      eventTitle: selectedEventToRegister.title,
      category: selectedEventToRegister.category,
      note: note,
      createdAt: new Date().toLocaleString("vi-VN"),
      status: "Đã đăng ký thành công",
    };

    const updated = [newReg, ...allRegs];
    localStorage.setItem("ctut_event_registrations", JSON.stringify(updated));

    setRegisteredIds([...registeredIds, selectedEventToRegister.title]);
    setSelectedEventToRegister(null);
    setSuccessToast(`✓ Đăng ký thành công hoạt động: ${selectedEventToRegister.title}`);
    setTimeout(() => setSuccessToast(""), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased py-8 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img
                src="/logo-doankhoa.png"
                alt="Logo Đoàn Khoa"
                className="h-12 w-auto object-contain cursor-pointer"
              />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#004A52]">
                HOẠT ĐỘNG – SỰ KIỆN CƠ KHÍ
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Cổng đăng ký tham gia phong trào & Tích lũy Điểm Rèn Luyện (ĐRL)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full">
                <span className="text-xs font-bold text-[#EE6425]">
                  {currentUser.fullName || currentUser.mssv}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">({currentUser.studentClass || currentUser.mssv})</span>
              </div>
            ) : (
              <Link
                href="/dang-nhap?redirect=/dang-ky"
                className="bg-[#EE6425] hover:bg-[#d85216] text-white text-xs font-bold px-4 py-2 rounded-full transition shadow"
              >
                Đăng nhập ngay
              </Link>
            )}
            <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">
              ← Về trang chủ
            </Link>
          </div>
        </div>

        {/* THÔNG BÁO THÀNH CÔNG */}
        {successToast && (
          <div className="mb-6 p-4 bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-between animate-bounce">
            <span>{successToast}</span>
            <button onClick={() => setSuccessToast("")} className="text-white text-base">✕</button>
          </div>
        )}

        {/* DANH SÁCH THẺ SỰ KIỆN (ĐẦY ĐỦ THÔNG TIN ĐỂ SINH VIÊN BIẾT MÀ ĐĂNG KÝ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev, idx) => {
            const isRegistered = registeredIds.includes(ev.title);

            return (
              <div
                key={ev.id || idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                {/* PHẦN ĐẦU THẺ */}
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2.5 py-1 rounded-full">
                      {ev.category}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {ev.points || "+5 ĐRL"}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {ev.description || "Chương trình hoạt động phong trào thường niên của Khoa Kỹ thuật Cơ khí."}
                  </p>

                  {/* THÔNG TIN CHI TIẾT */}
                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Thời gian:</span>
                      <span className="font-semibold text-slate-800">{ev.time}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-slate-400 flex-shrink-0">Địa điểm:</span>
                      <span className="font-semibold text-slate-800">{ev.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-red-600 font-bold text-[11px]">
                      <span>⏳ Hạn chót:</span>
                      <span>{ev.deadline}</span>
                    </div>
                  </div>
                </div>

                {/* NÚT BẤM ĐĂNG KÝ */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  {isRegistered ? (
                    <button
                      disabled
                      className="w-full bg-emerald-100 text-emerald-700 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 cursor-default"
                    >
                      ✓ Bạn đã đăng ký sự kiện này
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenRegisterModal(ev)}
                      className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-2.5 rounded-xl text-xs transition shadow active:scale-98 uppercase tracking-wider"
                    >
                      Đăng ký tham gia ngay
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* POPUP XÁC NHẬN ĐĂNG KÝ NHANH (KHÔNG CẦN ĐĂNG NHẬP LẠI) */}
      {selectedEventToRegister && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black text-[#004A52] uppercase">
                Xác Nhận Đăng Ký Hoạt Động
              </h3>
              <button
                onClick={() => setSelectedEventToRegister(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl">
                <span className="text-[10px] font-bold text-[#EE6425] uppercase block">Sự kiện đăng ký:</span>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedEventToRegister.title}</p>
                <p className="text-slate-600 mt-1">{selectedEventToRegister.time}</p>
                <p className="text-slate-600">{selectedEventToRegister.location}</p>
                <p className="text-emerald-700 font-bold mt-1">Điểm rèn luyện: {selectedEventToRegister.points}</p>
              </div>

              {/* THÔNG TIN SINH VIÊN ĐƯỢC TỰ ĐIỀN SẴN */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Thông tin sinh viên:</span>
                <p className="font-bold text-[#004A52]">{currentUser?.fullName}</p>
                <p className="text-slate-600 font-mono">MSSV: {currentUser?.mssv} • Lớp: {currentUser?.studentClass}</p>
                <p className="text-slate-500 font-mono text-[11px]">{currentUser?.email}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi chú thêm (nếu có):</label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Đăng ký tham gia tiết mục văn nghệ, đi theo nhóm..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 outline-none focus:border-[#EE6425]"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setSelectedEventToRegister(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmRegister}
                className="flex-1 bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-2.5 rounded-xl text-xs uppercase shadow tracking-wider"
              >
                ✓ Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

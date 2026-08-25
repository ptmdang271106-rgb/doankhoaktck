"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DangKySuKienPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [note, setNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredList, setRegisteredList] = useState<any[]>([]);

  useEffect(() => {
    // 1. Kiểm tra trạng thái đăng nhập
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      // Nếu chưa đăng nhập thì mới chuyển hướng kèm redirect
      router.push("/dang-nhap?redirect=/dang-ky");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    // 2. Lấy danh sách sự kiện từ bài viết của Admin + các sự kiện mặc định
    const customPosts = JSON.parse(localStorage.getItem("ctut_custom_posts") || "[]");
    const defaultEvents = [
      { id: "ev-1", title: "Hội thảo: Ứng dụng AI trong thiết kế CAD/CAM 2026", category: "Học thuật - NCKH" },
      { id: "ev-2", title: "Chiến dịch Tình nguyện sửa chữa máy móc thiết bị Ninh Kiều", category: "Phong trào" },
      { id: "ev-3", title: "Hội thi Sáng tạo Mô hình Cơ điện tử CTUET 2026", category: "Học thuật - NCKH" },
    ];
    
    const combined = [...customPosts, ...defaultEvents];
    setEvents(combined);
    if (combined.length > 0) setSelectedEvent(combined[0].title);

    // 3. Lấy lịch sử sự kiện sinh viên này đã đăng ký
    const allRegistrations = JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]");
    const myRegistrations = allRegistrations.filter((r: any) => r.mssv === user.mssv);
    setRegisteredList(myRegistrations);
  }, [router]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) {
      alert("Vui lòng chọn sự kiện!");
      return;
    }

    const allRegistrations = JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]");
    
    // Kiểm tra xem đã đăng ký sự kiện này chưa
    const already = allRegistrations.some(
      (r: any) => r.mssv === currentUser.mssv && r.eventTitle === selectedEvent
    );

    if (already) {
      alert("Bạn đã đăng ký tham gia sự kiện này rồi!");
      return;
    }

    const newReg = {
      id: Date.now().toString(),
      mssv: currentUser.mssv,
      fullName: currentUser.fullName,
      studentClass: currentUser.studentClass || "Khoa Cơ Khí",
      eventTitle: selectedEvent,
      note: note,
      createdAt: new Date().toLocaleString("vi-VN"),
      status: "Đã xác nhận",
    };

    const updated = [newReg, ...allRegistrations];
    localStorage.setItem("ctut_event_registrations", JSON.stringify(updated));
    setRegisteredList([newReg, ...registeredList]);
    setIsSuccess(true);
    setNote("");
    setTimeout(() => setIsSuccess(false), 3000);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-sm font-bold text-[#007A87]">Đang kiểm tra thông tin tài khoản...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img
                src="/logo-doankhoa.png"
                alt="Logo Đoàn Khoa Cơ Khí"
                className="h-12 w-auto object-contain cursor-pointer"
              />
            </Link>
            <div>
              <h1 className="text-xl font-black text-[#004A52]">ĐĂNG KÝ THAM GIA HOẠT ĐỘNG – SỰ KIỆN</h1>
              <p className="text-xs text-slate-500">Đoàn Khoa Kỹ thuật Cơ khí CTUET</p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-[#007A87] hover:underline"
          >
            ← Về trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* CỘT FORM ĐĂNG KÝ */}
          <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-[#EE6425] mb-4 uppercase tracking-wider">
              Phiếu Đăng Ký Trực Tuyến
            </h2>

            {isSuccess && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl">
                ✓ Đăng ký tham gia sự kiện thành công!
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Sinh viên đăng ký</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-[#004A52]">{currentUser.fullName}</p>
                  <p className="text-slate-500 font-mono">MSSV: {currentUser.mssv} {currentUser.studentClass && `• Lớp: ${currentUser.studentClass}`}</p>
                  <p className="text-slate-500 font-mono text-[11px]">{currentUser.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chọn Hoạt động / Sự kiện *</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs font-semibold outline-none focus:border-[#EE6425]"
                >
                  {events.map((ev, idx) => (
                    <option key={idx} value={ev.title}>
                      [{ev.category || "Sự kiện"}] {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ghi chú / Yêu cầu thêm</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Đăng ký tham gia theo nhóm, cần hỗ trợ thiết bị..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs outline-none focus:border-[#EE6425]"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-2xl transition shadow text-xs uppercase tracking-wider"
              >
                Xác nhận đăng ký
              </button>
            </form>
          </div>

          {/* CỘT DANH SÁCH SỰ KIỆN ĐÃ ĐĂNG KÝ */}
          <div className="md:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-base font-bold text-[#004A52] mb-4 uppercase tracking-wider">
              Lịch sử đã đăng ký ({registeredList.length})
            </h2>

            {registeredList.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                Bạn chưa đăng ký hoạt động nào.
              </div>
            ) : (
              <div className="space-y-3">
                {registeredList.map((item, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl">
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.status}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">
                      {item.eventTitle}
                    </h4>
                    {item.note && <p className="text-[11px] text-slate-500 mt-1 italic">"{item.note}"</p>}
                    <span className="text-[10px] text-slate-400 mt-1.5 block">
                      Đăng ký lúc: {item.createdAt}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

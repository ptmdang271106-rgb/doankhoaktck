"use client";

import { siteImages } from "@/lib/site-images";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import DOMPurify from "dompurify";
import { eventWithImages } from "@/lib/event-images";
import Footer from "@/components/Footer";

export default function SuKienHoatDongPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [registeredTitles, setRegisteredTitles] = useState<string[]>([]);
  const [selectedEventToRegister, setSelectedEventToRegister] = useState<any>(null);
  const [note, setNote] = useState("");
  const [successToast, setSuccessToast] = useState("");

  // State cho Lịch sự kiện tự động
  const today = new Date();
  const [calMonth, setCalMonth] = useState<number>(today.getMonth() + 1);
  const [calYear, setCalYear] = useState<number>(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Hàm bóc tách ngày tháng năm từ chuỗi thời gian sự kiện
  function parseEventDate(timeStr?: string, createdAt?: string): { day: number; month: number; year: number } | null {
    if (timeStr) {
      // Khớp DD/MM/YYYY hoặc DD-MM-YYYY
      const dmy = timeStr.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
      if (dmy) {
        return {
          day: parseInt(dmy[1], 10),
          month: parseInt(dmy[2], 10),
          year: parseInt(dmy[3], 10),
        };
      }
      // Khớp YYYY-MM-DD
      const ymd = timeStr.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
      if (ymd) {
        return {
          day: parseInt(ymd[3], 10),
          month: parseInt(ymd[2], 10),
          year: parseInt(ymd[1], 10),
        };
      }
      // Khớp Ngày DD tháng MM năm YYYY
      const textDmy = timeStr.match(/ngày\s*(\d{1,2})\s*tháng\s*(\d{1,2})(?:\s*năm\s*(\d{4}))?/i);
      if (textDmy) {
        return {
          day: parseInt(textDmy[1], 10),
          month: parseInt(textDmy[2], 10),
          year: textDmy[3] ? parseInt(textDmy[3], 10) : new Date().getFullYear(),
        };
      }
      // Khớp DD/MM
      const dm = timeStr.match(/(\d{1,2})[\/\-](\d{1,2})/);
      if (dm) {
        return {
          day: parseInt(dm[1], 10),
          month: parseInt(dm[2], 10),
          year: new Date().getFullYear(),
        };
      }
    }
    if (createdAt) {
      const d = new Date(createdAt);
      if (!isNaN(d.getTime())) {
        return {
          day: d.getDate(),
          month: d.getMonth() + 1,
          year: d.getFullYear(),
        };
      }
    }
    return null;
  }

  const loadData = async (user: any) => {
    // 1. Tải danh sách sự kiện từ Supabase
    const { data: evData } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    const evList = evData && evData.length > 0
      ? evData.map(eventWithImages).map(event => ({
          ...event,
          description_html: DOMPurify.sanitize(event.description_html || "", { USE_PROFILES: { html: true } }),
        }))
      : [
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
        ];

    setEvents(evList);

    // Tự động mở lịch vào tháng có sự kiện gần nhất
    const firstParsed = evList.map(e => parseEventDate(e.time, e.created_at)).find(Boolean);
    if (firstParsed) {
      setCalMonth(firstParsed.month);
      setCalYear(firstParsed.year);
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

  // Map sự kiện theo tháng đang chọn
  const eventsInCurrentMonth = events
    .map((e) => ({
      ...e,
      parsedDate: parseEventDate(e.time, e.created_at),
    }))
    .filter((e) => e.parsedDate && e.parsedDate.month === calMonth && e.parsedDate.year === calYear);

  const daysWithEvents = new Map<number, any[]>();
  eventsInCurrentMonth.forEach((e) => {
    if (e.parsedDate) {
      const d = e.parsedDate.day;
      if (!daysWithEvents.has(d)) daysWithEvents.set(d, []);
      daysWithEvents.get(d)!.push(e);
    }
  });

  const displayedEvents = selectedDay
    ? events.filter((e) => {
        const pd = parseEventDate(e.time, e.created_at);
        return pd && pd.day === selectedDay && pd.month === calMonth && pd.year === calYear;
      })
    : events;

  // Tính toán lưới ngày trong tháng
  const daysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDayOfWeek = new Date(calYear, calMonth - 1, 1).getDay(); // 0 = CN, 1 = T2,...
  const prevMonthDays = new Date(calYear, calMonth - 1, 0).getDate();

  const prevMonthCells: number[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    prevMonthCells.push(prevMonthDays - i);
  }

  const currentMonthCells: number[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    currentMonthCells.push(d);
  }

  const totalCellsSoFar = prevMonthCells.length + currentMonthCells.length;
  const nextMonthCellsCount = (7 - (totalCellsSoFar % 7)) % 7;
  const nextMonthCells: number[] = [];
  for (let d = 1; d <= nextMonthCellsCount; d++) {
    nextMonthCells.push(d);
  }

  const handlePrevMonth = () => {
    setSelectedDay(null);
    if (calMonth === 1) {
      setCalMonth(12);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const handleNextMonth = () => {
    setSelectedDay(null);
    if (calMonth === 12) {
      setCalMonth(1);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const handleToday = () => {
    const d = new Date();
    setCalMonth(d.getMonth() + 1);
    setCalYear(d.getFullYear());
    setSelectedDay(d.getDate());
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
            <img src={siteImages.logo} alt="Logo Đoàn Khoa" className="h-10 w-auto object-contain" />
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
            {selectedDay && (
              <div className="mb-4 pb-2 flex items-center justify-between bg-orange-50 border border-orange-200 px-4 py-2.5 rounded-xl text-xs">
                <span className="font-bold text-[#004A52]">
                  Lọc sự kiện ngày {selectedDay}/{calMonth}/{calYear} ({displayedEvents.length} sự kiện)
                </span>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-xs font-semibold text-[#EE6425] hover:underline"
                >
                  Xem tất cả
                </button>
              </div>
            )}

            {displayedEvents.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-200 my-4">
                <p className="text-sm font-bold text-slate-600 mb-2">Không có sự kiện nào trong ngày {selectedDay}/{calMonth}/{calYear}</p>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-xs font-bold text-white bg-[#006674] px-4 py-2 rounded-lg hover:bg-[#004A52] transition"
                >
                  Xem tất cả sự kiện
                </button>
              </div>
            ) : (
              displayedEvents.map((ev, idx) => {
                const isRegistered = registeredTitles.includes(ev.title);

                return (
                  <div key={ev.id || idx} className="py-8 first:pt-0 group">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
                      <div className="sm:col-span-4 aspect-video sm:aspect-square w-full rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        <img
                          src={ev.cover_image || siteImages.event}
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

                          {ev.description_html ? (
                            <div className="text-xs text-slate-600 leading-relaxed mt-2 [&_img]:max-w-full" dangerouslySetInnerHTML={{ __html: ev.description_html }} />
                          ) : (
                            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mt-2">{ev.description}</p>
                          )}

                          <div className="mt-3 text-xs text-slate-500 space-y-1 font-medium">
                            <div><strong>Thời gian:</strong> {ev.time}</div>
                            <div><strong>Địa điểm:</strong> {ev.location}</div>
                            <div className="text-red-600 font-semibold text-[11px]"><strong>Hạn chót:</strong> {ev.deadline}</div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3">
                          {isRegistered ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-lg">
                              Đã đăng ký tham gia
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
              })
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-4">
              <h3 className="text-center font-extrabold text-[#004A52] text-sm uppercase tracking-wider">
                THỜI GIAN DIỄN RA SỰ KIỆN
              </h3>
              <div className="bg-[#FFFDF9] border border-orange-100 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-4 px-1">
                  <button
                    onClick={handlePrevMonth}
                    aria-label="Tháng trước"
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-100 text-slate-600 font-black text-sm transition"
                  >
                    ‹
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[#004A52] font-black">Tháng {calMonth}, {calYear}</span>
                    <button
                      onClick={handleToday}
                      className="text-[10px] font-bold text-[#006674] bg-teal-50 px-2 py-0.5 rounded border border-teal-200 hover:bg-teal-100 transition"
                    >
                      Hôm nay
                    </button>
                  </div>
                  <button
                    onClick={handleNextMonth}
                    aria-label="Tháng sau"
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-100 text-slate-600 font-black text-sm transition"
                  >
                    ›
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-600 mb-3">
                  <span>CN</span><span>T2</span><span>T3</span><span>T4</span><span>T5</span><span>T6</span><span>T7</span>
                </div>

                <div className="grid grid-cols-7 text-center text-xs font-semibold gap-y-2.5 items-center">
                  {prevMonthCells.map((d, i) => (
                    <span key={`prev-${i}`} className="text-slate-300 py-1">{d}</span>
                  ))}

                  {currentMonthCells.map((d) => {
                    const hasEv = daysWithEvents.has(d);
                    const isSelected = selectedDay === d;
                    const today = new Date();
                    const isToday = d === today.getDate() && calMonth === today.getMonth() + 1 && calYear === today.getFullYear();

                    if (hasEv) {
                      return (
                        <button
                          key={`cur-${d}`}
                          onClick={() => setSelectedDay(isSelected ? null : d)}
                          title={`${daysWithEvents.get(d)!.length} sự kiện vào ngày ${d}/${calMonth}`}
                          className={`w-7 h-7 mx-auto rounded-full bg-[#E96E3F] text-white flex items-center justify-center font-bold text-xs shadow-sm transition-all hover:scale-110 active:scale-95 ${
                            isSelected ? "ring-2 ring-offset-2 ring-[#006674] font-black" : ""
                          }`}
                        >
                          {d}
                        </button>
                      );
                    }

                    if (isToday) {
                      return (
                        <button
                          key={`cur-${d}`}
                          onClick={() => setSelectedDay(isSelected ? null : d)}
                          className={`w-7 h-7 mx-auto rounded-full border-2 border-[#006674] text-[#006674] font-black flex items-center justify-center text-xs transition ${
                            isSelected ? "bg-[#006674] text-white" : "hover:bg-teal-50"
                          }`}
                        >
                          {d}
                        </button>
                      );
                    }

                    return (
                      <span key={`cur-${d}`} className="text-slate-700 py-1">{d}</span>
                    );
                  })}

                  {nextMonthCells.map((d, i) => (
                    <span key={`next-${i}`} className="text-slate-300 py-1">{d}</span>
                  ))}
                </div>

                <div className="mt-5 pt-3 border-t border-orange-100 flex items-center justify-around text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E96E3F]"></span>
                    <span>Có sự kiện</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#006674]"></span>
                    <span>Hôm nay</span>
                  </div>
                </div>
              </div>

              {selectedDay && daysWithEvents.has(selectedDay) && (
                <div className="bg-white border border-teal-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-[#004A52] uppercase">
                      Sự kiện ngày {selectedDay}/{calMonth}:
                    </h4>
                    <button
                      onClick={() => setSelectedDay(null)}
                      className="text-[11px] text-slate-400 hover:text-slate-600 font-bold"
                    >
                      ✕ Đóng
                    </button>
                  </div>
                  <div className="space-y-2">
                    {daysWithEvents.get(selectedDay)!.map((ev: any, idx: number) => (
                      <div key={idx} className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-100 text-xs">
                        <p className="font-bold text-[#004A52] line-clamp-2">{ev.title}</p>
                        <p className="text-[11px] text-slate-600 mt-1">{ev.time}</p>
                        <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">+{ev.points} ĐRL</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

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

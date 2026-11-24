"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteImages } from "@/lib/site-images";
import { supabase } from "@/lib/supabase";

export interface BannerItem {
  id: string;
  image: string;
  title?: string;
  link?: string;
}

const DEFAULT_BANNERS: BannerItem[] = [
  {
    id: "default-1",
    image: siteImages.banner,
    link: "/dang-ky",
  },
];

const DEFAULT_MONTHLY_EVENTS = [
  {
    id: "ev-1",
    title: "Hội thảo: Ứng dụng AI tạo sinh trong thiết kế CAD/CAM SolidWorks",
    time: "07:30 - 28/11/2026",
    location: "Hội trường Khu A - CTUT",
    points: 3,
    day: "28",
    month: "Th.11",
    status: "Đang mở",
  },
  {
    id: "ev-2",
    title: "Cuộc thi Sáng tạo Robot Mini & Xe tiết kiệm nhiên liệu FME 2026",
    time: "13:30 - 30/11/2026",
    location: "Xưởng Thực hành Cơ khí",
    points: 5,
    day: "30",
    month: "Th.11",
    status: "Sắp diễn ra",
  },
  {
    id: "ev-3",
    title: "Tọa đàm Hướng nghiệp & Kết nối Doanh nghiệp Kỹ thuật Cơ khí",
    time: "08:00 - 05/12/2026",
    location: "Hội trường Lớn CTUT",
    points: 3,
    day: "05",
    month: "Th.12",
    status: "Sắp mở",
  },
];

export default function BannerSlider() {
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>(DEFAULT_MONTHLY_EVENTS);

  // Tải danh sách Banner từ Supabase
  useEffect(() => {
    async function loadBanners() {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "site:banners")
          .maybeSingle();

        if (data?.value) {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBanners(parsed);
          }
        }
      } catch (err) {
        console.error("Error loading banners:", err);
      }
    }
    loadBanners();
  }, []);

  // Tải sự kiện tháng này từ bảng events
  useEffect(() => {
    async function loadEvents() {
      try {
        const { data } = await supabase
          .from("events")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(3);

        if (data && data.length > 0) {
          const parsedEvents = data.map((item, idx) => {
            // Tách ngày tháng hiển thị
            let day = "15";
            let month = "Th.11";
            if (item.time) {
              const match = item.time.match(/(\d{1,2})[\/\-](\d{1,2})/);
              if (match) {
                day = match[1].padStart(2, "0");
                month = `Th.${match[2]}`;
              }
            } else if (item.created_at) {
              const d = new Date(item.created_at);
              day = String(d.getDate()).padStart(2, "0");
              month = `Th.${d.getMonth() + 1}`;
            }

            return {
              id: item.id || `ev-${idx}`,
              title: item.title,
              time: item.time || "Thời gian thông báo sau",
              location: item.location || "Trường ĐH KT-CN Cần Thơ",
              points: item.points || 3,
              day,
              month,
              status: "Đang mở",
            };
          });
          setEvents(parsedEvents);
        }
      } catch (err) {
        console.error("Error loading monthly events:", err);
      }
    }
    loadEvents();
  }, []);

  // Tự động chuyển slide sau mỗi 5 giây
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length, isPaused]);

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStart(null);
  };

  const currentMonthNumber = new Date().getMonth() + 1;
  const currentYearNumber = new Date().getFullYear();

  return (
    <section
      className="w-full bg-[#0A2540] flex justify-center items-center relative py-2 sm:py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 items-stretch">
          
          {/* CỘT TRÁI: BANNER SLIDER CHÍNH (8 CỘT TRÊN MÀN HÌNH LỚN) */}
          <div className="lg:col-span-8 relative">
            <div className="relative w-full h-full min-h-[220px] sm:min-h-[300px] md:min-h-[360px] overflow-hidden rounded-xl sm:rounded-2xl shadow-sm group bg-slate-900 flex items-center">
              {/* TRACK CAROUSEL TRƯỢT MƯỢT MÀ */}
              <div
                className="flex transition-transform duration-500 ease-out w-full h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {banners.map((banner, idx) => (
                  <div key={banner.id || idx} className="w-full h-full flex-shrink-0 relative flex items-center justify-center">
                    <img
                      src={banner.image}
                      alt="Banner Khoa Kỹ thuật Cơ khí"
                      className="w-full h-full object-cover sm:object-contain select-none pointer-events-none block"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>

              {/* NÚT CHUYỂN BANNER TRƯỚC / TIẾP THEO */}
              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer text-base sm:text-xl font-bold"
                    title="Banner trước"
                    aria-label="Banner trước"
                  >
                    ❮
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer text-base sm:text-xl font-bold"
                    title="Banner tiếp theo"
                    aria-label="Banner tiếp theo"
                  >
                    ❯
                  </button>

                  {/* CHẤM ĐIỀU HƯỚNG (DOTS) */}
                  <div className="absolute bottom-2 sm:bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-20">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentIndex === idx
                            ? "w-6 sm:w-7 bg-[#EE6425]"
                            : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                        }`}
                        aria-label={`Chuyển tới banner ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: BANNER NHỎ HIỆN SỰ KIỆN THÁNG NÀY (4 CỘT TRÊN MÀN HÌNH LỚN) */}
          <div className="lg:col-span-4 flex flex-col justify-between">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-md border border-slate-100 p-3.5 sm:p-4 flex flex-col justify-between h-full">
              
              {/* HEADER SỰ KIỆN THÁNG NÀY */}
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[#FFF2EB] text-[#EE6425] flex items-center justify-center text-sm font-bold shadow-2xs">
                      📅
                    </span>
                    <div>
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 tracking-tight uppercase flex items-center gap-1.5">
                        Sự kiện tháng này
                      </h3>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Tháng {currentMonthNumber}/{currentYearNumber} • Đoàn Khoa Kỹ thuật Cơ khí
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dang-ky"
                    className="text-[11px] font-bold text-[#EE6425] hover:text-[#d85216] hover:underline"
                  >
                    Xem tất cả ›
                  </Link>
                </div>

                {/* DANH SÁCH SỰ KIỆN */}
                <div className="space-y-2.5">
                  {events.map((ev, i) => (
                    <Link
                      key={ev.id || i}
                      href="/dang-ky"
                      className="group flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100 block cursor-pointer"
                    >
                      {/* KHỐI NGÀY THÁNG */}
                      <div className="w-11 h-11 rounded-lg bg-gradient-to-b from-[#006674] to-[#004A52] text-white flex flex-col items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                        <span className="text-xs font-black leading-none">{ev.day}</span>
                        <span className="text-[8px] font-bold tracking-tight opacity-90 leading-tight mt-0.5">
                          {ev.month}
                        </span>
                      </div>

                      {/* CHI TIẾT SỰ KIỆN */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-[#EE6425] transition-colors leading-snug">
                          {ev.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5 truncate">
                          <span>📍 {ev.location}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-50 text-[#EE6425] border border-orange-100">
                            +{ev.points}đ ĐRL
                          </span>
                          <span className="text-[9px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            {ev.status || "Đang mở"}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* FOOTER ACTION BUTTON */}
              <div className="pt-3 mt-2 border-t border-slate-100">
                <Link
                  href="/dang-ky"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white text-xs font-bold py-2 px-3 rounded-xl transition shadow flex items-center justify-center gap-1.5 active:scale-98"
                >
                  <span>📝 Đăng ký tham gia ngay</span>
                  <span className="text-xs">→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

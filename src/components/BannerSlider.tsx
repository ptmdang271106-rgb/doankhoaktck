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
    title: "Chương trình Chào đón Tân sinh viên Khóa 2026",
    link: "/dang-ky",
  },
];

export default function BannerSlider() {
  const [banners, setBanners] = useState<BannerItem[]>(DEFAULT_BANNERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

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

  return (
    <section className="w-full bg-white border-b border-gray-100 py-3 sm:py-5 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* CỘT TRÁI: BANNER SLIDER (khoảng 72-75% theo bố cục CTUT) */}
          <div
            className="lg:col-span-8 xl:col-span-9 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="relative w-full h-[230px] sm:h-[340px] md:h-[400px] lg:h-[430px] overflow-hidden rounded-xl border border-gray-200/90 shadow-xs bg-slate-50 group">
              {/* SLIDER CAROUSEL TRACK */}
              <div
                className="flex transition-transform duration-500 ease-out h-full w-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {banners.map((banner, idx) => (
                  <div
                    key={banner.id || idx}
                    className="w-full h-full flex-shrink-0 relative overflow-hidden bg-slate-100"
                  >
                    {banner.link ? (
                      banner.link.startsWith("http") ? (
                        <a
                          href={banner.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full h-full cursor-pointer"
                        >
                          <img
                            src={banner.image}
                            alt={banner.title || "Banner CTUT FME"}
                            className="w-full h-full object-cover object-center"
                          />
                        </a>
                      ) : (
                        <Link href={banner.link} className="block w-full h-full cursor-pointer">
                          <img
                            src={banner.image}
                            alt={banner.title || "Banner CTUT FME"}
                            className="w-full h-full object-cover object-center"
                          />
                        </Link>
                      )
                    ) : (
                      <img
                        src={banner.image}
                        alt={banner.title || "Banner CTUT FME"}
                        className="w-full h-full object-cover object-center"
                      />
                    )}

                    {banner.title && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 sm:p-4 text-white text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="line-clamp-1">{banner.title}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* NÚT CHUYỂN SLIDE TRÁI / PHẢI KIỂU CTUT */}
              {banners.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/75 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer text-base sm:text-lg font-bold"
                    title="Banner trước"
                    aria-label="Banner trước"
                  >
                    ❮
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/75 hover:bg-white text-gray-800 shadow-md flex items-center justify-center transition-all opacity-85 group-hover:opacity-100 hover:scale-105 active:scale-95 z-20 cursor-pointer text-base sm:text-lg font-bold"
                    title="Banner tiếp theo"
                    aria-label="Banner tiếp theo"
                  >
                    ❯
                  </button>

                  {/* CHẤM ĐIỀU HƯỚNG (DOTS) */}
                  <div className="absolute bottom-2.5 sm:bottom-3 inset-x-0 flex justify-center items-center gap-1.5 z-20">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                          currentIndex === idx
                            ? "w-6 sm:w-7 bg-[#006674]"
                            : "w-2 sm:w-2.5 bg-white/80 hover:bg-white shadow-xs"
                        }`}
                        aria-label={`Chuyển tới banner ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: CỔNG THÔNG TIN & CÁC PHÒNG CHỨC NĂNG (THEO CHUẨN CTUT) */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-between gap-3 sm:gap-4">
            
            {/* Box 1: Cổng thông tin */}
            <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-100">
                  <span className="w-1.5 h-4 bg-[#006674] rounded-full inline-block"></span>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight uppercase">
                    Cổng thông tin
                  </h3>
                </div>
                <ul className="space-y-1 sm:space-y-1.5 text-xs text-gray-700">
                  <li>
                    <a
                      href="https://sinhvien.ctuet.edu.vn/sinh-vien-dang-nhap.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-teal-50 hover:text-[#006674] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium">Sinh viên, phụ huynh</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://eoffice.ctuet.edu.vn/login.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-teal-50 hover:text-[#006674] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium">Viên chức, giảng viên</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://elearning.ctuet.edu.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-teal-50 hover:text-[#006674] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium">Dạy học trực tuyến</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://thuvienso.ctuet.edu.vn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-teal-50 hover:text-[#006674] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium">Thư viện trường</span>
                    </a>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-teal-50 hover:text-[#006674] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium">Đoàn thanh niên</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Box 2: Các phòng chức năng */}
            <div className="bg-white rounded-xl border border-gray-200/90 shadow-xs p-3.5 flex flex-col flex-1 justify-between">
              <div>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-100">
                  <span className="w-1.5 h-4 bg-[#EE6425] rounded-full inline-block"></span>
                  <h3 className="font-bold text-gray-900 text-xs sm:text-sm tracking-tight uppercase">
                    Các phòng chức năng
                  </h3>
                </div>
                <ul className="space-y-1 sm:space-y-1.5 text-xs text-gray-700">
                  <li>
                    <a
                      href="http://pdaotao.ctuet.edu.vn/?MenuID=319"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-orange-50 hover:text-[#EE6425] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium truncate">Phòng Quản lý đào tạo</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://phongdbcl.ctuet.edu.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-orange-50 hover:text-[#EE6425] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium truncate">Phòng Khảo thí - ĐBCL</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://phongctct.ctuet.edu.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-orange-50 hover:text-[#EE6425] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium truncate">Phòng CTSV - Khởi nghiệp</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="http://phongnckh.ctuet.edu.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-orange-50 hover:text-[#EE6425] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium truncate">Phòng QLKH & HTQT</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://phongtchc.ctuet.edu.vn/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-orange-50 hover:text-[#EE6425] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium truncate">Phòng Tổ chức - Hành chính</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://ctuet.edu.vn"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-orange-50 hover:text-[#EE6425] transition-colors group"
                    >
                      <span className="text-[#c77b06] text-xs font-bold group-hover:translate-x-0.5 transition-transform">❯</span>
                      <span className="font-medium truncate">Phòng Quản trị - Thiết bị</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

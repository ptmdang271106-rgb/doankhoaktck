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

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex] || banners[0] || DEFAULT_BANNERS[0];

  const renderBannerContent = (banner: BannerItem) => (
    <div className="relative w-full overflow-hidden rounded-none sm:rounded-2xl shadow-sm group">
      <img
        src={banner.image}
        alt={banner.title || "Banner Khoa Kỹ thuật Cơ khí"}
        className="w-full h-auto max-h-[500px] object-cover sm:object-contain mx-auto transition-transform duration-500 group-hover:scale-[1.01]"
      />
      {banner.title && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 text-white text-xs sm:text-base font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="line-clamp-1">{banner.title}</p>
        </div>
      )}
    </div>
  );

  return (
    <section
      className="w-full bg-[#0A2540] flex justify-center items-center relative py-1 sm:py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 relative">
        {/* BANNER ẢNH CHÍNH */}
        {currentBanner.link ? (
          currentBanner.link.startsWith("http") ? (
            <a
              href={currentBanner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block cursor-pointer"
            >
              {renderBannerContent(currentBanner)}
            </a>
          ) : (
            <Link href={currentBanner.link} className="block cursor-pointer">
              {renderBannerContent(currentBanner)}
            </Link>
          )
        ) : (
          renderBannerContent(currentBanner)
        )}

        {/* NÚT CHUYỂN QUA LẠI */}
        {banners.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer"
              title="Banner trước"
              aria-label="Banner trước"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer"
              title="Banner tiếp theo"
              aria-label="Banner tiếp theo"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* CHẤM ĐIỀU HƯỚNG (DOTS) */}
            <div className="absolute bottom-3 sm:bottom-6 inset-x-0 flex justify-center items-center gap-2 z-20">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? "w-7 sm:w-8 bg-[#EE6425]"
                      : "w-2 sm:w-2.5 bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`Chuyển tới banner ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}


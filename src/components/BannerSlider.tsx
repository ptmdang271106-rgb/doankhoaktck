"use client";

import React, { useState, useEffect } from "react";
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
    <section
      className="w-full bg-[#0A2540] flex justify-center items-center relative py-1 sm:py-4 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 relative">
        <div className="relative w-full overflow-hidden rounded-none sm:rounded-lg shadow-sm group">
          {/* TRACK CAROUSEL TRƯỢT MƯỢT MÀ */}
          <div
            className="flex transition-transform duration-500 ease-out w-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {banners.map((banner, idx) => (
              <div key={banner.id || idx} className="w-full flex-shrink-0 relative">
                <img
                  src={banner.image}
                  alt="Banner Khoa Kỹ thuật Cơ khí"
                  className="w-full h-auto block select-none pointer-events-none"
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
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer text-base sm:text-xl font-bold"
                title="Banner trước"
                aria-label="Banner trước"
              >
                ❮
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition backdrop-blur-xs shadow-lg hover:scale-110 active:scale-95 z-20 cursor-pointer text-base sm:text-xl font-bold"
                title="Banner tiếp theo"
                aria-label="Banner tiếp theo"
              >
                ❯
              </button>

              {/* CHẤM ĐIỀU HƯỚNG (DOTS) */}
              <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex justify-center items-center gap-1.5 sm:gap-2 z-20">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx
                        ? "w-6 sm:w-8 bg-[#EE6425]"
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
    </section>
  );
}

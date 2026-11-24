"use client";

import React, { useState, useEffect } from "react";

export default function FloatingContact() {
  const facebookUrl = "https://www.facebook.com/profile.php?id=61559867482732";
  const messengerUrl = "https://m.me/doankhoaktck.ctut";
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 250);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-sm:bottom-4 max-sm:right-3 max-sm:gap-2">
      {/* Nút về đầu trang */}
      {showTopBtn && (
        <button
          type="button"
          onClick={scrollToTop}
          className="flex items-center justify-center w-12 h-12 max-sm:w-10 max-sm:h-10 bg-white text-[#004A52] hover:text-white hover:bg-[#EE6425] border border-slate-200 rounded-full shadow-lg hover:scale-110 transition duration-300 relative group animate-fade-in"
          title="Về đầu trang"
          aria-label="Về đầu trang"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="absolute right-14 bg-gray-900 text-white text-xs px-2.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none shadow">
            Về đầu trang
          </span>
        </button>
      )}

      {/* Nút Facebook Fanpage */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 max-sm:w-10 max-sm:h-10 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-full shadow-lg hover:scale-110 transition duration-300 relative group"
        title="Fanpage Facebook Đoàn Khoa"
        aria-label="Fanpage Facebook Đoàn Khoa"
      >
        <svg className="w-5 h-5 max-sm:w-4 max-sm:h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-2.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none shadow">
          Fanpage Facebook
        </span>
      </a>

      {/* Nút Facebook Messenger */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 max-sm:w-10 max-sm:h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-full shadow-lg hover:scale-110 transition duration-300 relative group"
        title="Nhắn tin Messenger Đoàn Khoa"
        aria-label="Nhắn tin Messenger Đoàn Khoa"
      >
        <svg className="w-6 h-6 max-sm:w-5 max-sm:h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.735 7.152V22l3.411-1.874c.907.251 1.868.388 2.854.388 5.523 0 10-4.145 10-9.256C22 6.145 17.523 2 12 2zm1.066 12.443l-2.614-2.788-5.1 2.788 5.61-5.957 2.679 2.788 5.035-2.788-5.61 5.957z" />
        </svg>
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-2.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none shadow">
          Nhắn tin Messenger
        </span>
      </a>
    </div>
  );
}

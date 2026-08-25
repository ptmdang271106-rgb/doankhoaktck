"use client";

import React from "react";

export default function FloatingContact() {
  const facebookUrl = "https://m.me/doankhoaktck.ctut";
  const zaloUrl = "https://zalo.me/0900000000";

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      {/* Nút Zalo */}
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition duration-300 relative group"
        title="Liên hệ Zalo Đoàn Khoa"
      >
        <span className="font-bold text-xs">Zalo</span>
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-2.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200">
          Hỗ trợ Zalo
        </span>
      </a>

      {/* Nút Facebook Messenger */}
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white rounded-full shadow-lg hover:scale-110 transition duration-300 relative group"
        title="Nhắn tin Facebook Đoàn Khoa"
      >
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.518 3.735 7.152V22l3.411-1.874c.907.251 1.868.388 2.854.388 5.523 0 10-4.145 10-9.256C22 6.145 17.523 2 12 2zm1.066 12.443l-2.614-2.788-5.1 2.788 5.61-5.957 2.679 2.788 5.035-2.788-5.61 5.957z" />
        </svg>
        <span className="absolute right-14 bg-gray-900 text-white text-xs px-2.5 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition duration-200">
          Fanpage Đoàn Khoa
        </span>
      </a>
    </div>
  );
}

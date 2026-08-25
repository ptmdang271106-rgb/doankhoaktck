"use client";
import { supabase } from "@/lib/supabase";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Tên Đoàn Khoa */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/logodk.png"
                alt="Logo Khoa Cơ Khí"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div className="border-l-2 border-orange-500 pl-3">
              <span className="block text-xs font-bold text-blue-900 uppercase tracking-wide">
                Đoàn Trường ĐH Kỹ thuật - Công nghệ Cần Thơ
              </span>
              <span className="block text-sm sm:text-base font-extrabold text-[#E05A10] uppercase">
                Đoàn Khoa Kỹ thuật Cơ khí
              </span>
            </div>
          </Link>

          {/* Menu máy tính */}
          <nav className="hidden md:flex items-center gap-1 font-semibold text-sm text-slate-700">
            <Link href="/" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition">
              Trang chủ
            </Link>
            <Link href="/tra-cuu" className="px-3 py-2 rounded-lg hover:text-[#E05A10] hover:bg-orange-50 transition">
              Tra cứu ĐRL & CTXH
            </Link>
            <Link
              href="/dang-ky"
              className="ml-3 px-4 py-2 rounded-full bg-[#E05A10] hover:bg-[#c94d0a] text-white shadow-sm transition"
            >
              Đăng ký hoạt động
            </Link>
          </nav>

          {/* Nút Mobile Menu */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu xổ xuống trên Điện thoại */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 pt-2 pb-4 space-y-2 font-medium text-slate-700">
          <Link href="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-orange-50">
            Trang chủ
          </Link>
          <Link href="/tra-cuu" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg hover:bg-orange-50">
            Tra cứu ĐRL & CTXH
          </Link>
          <Link
            href="/dang-ky"
            onClick={() => setIsOpen(false)}
            className="block text-center px-4 py-2 rounded-xl bg-[#E05A10] text-white font-bold"
          >
            Đăng ký hoạt động
          </Link>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function CTUTYouthPortal() {
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activeTabRank, setActiveTabRank] = useState("Nổi bật");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const introDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("ctut_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const fetchPosts = async () => {
      const { data } = await supabase.from("posts").select("*").order("id", { ascending: false });
      if (data && data.length > 0) {
        setAllPosts(data);
      }
    };
    fetchPosts();

    const handleClickOutside = (e: MouseEvent) => {
      if (introDropdownRef.current && !introDropdownRef.current.contains(e.target as Node)) {
        setIsIntroOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ctut_current_user");
    setCurrentUser(null);
    window.location.reload();
  };

  const categories = [
    { name: "Tất cả", color: "bg-[#F39C12] text-white" },
    { name: "Phong trào", color: "bg-[#D35400] text-white" },
    { name: "Học thuật - NCKH", color: "bg-[#16A085] text-white" },
    { name: "Tổ chức - Đoàn thể", color: "bg-[#E67E22] text-white" },
    { name: "Hội thảo Cơ khí", color: "bg-[#2C3E50] text-white" },
    { name: "Tình nguyện", color: "bg-[#7F8C8D] text-white" },
  ];

  const filteredPosts = activeCategory === "Tất cả"
    ? allPosts
    : allPosts.filter((post) => post.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
      {/* 1. THANH ĐIỀU HƯỚNG CHÍNH */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="w-full px-3 sm:px-6 lg:px-10">
          <div className="py-2.5 sm:py-3 lg:h-24 grid grid-cols-12 items-center text-[13px] font-medium text-[#2C3E50]">
            
            {/* MENU TRÁI (DESKTOP) */}
            <div className="col-span-4 hidden lg:flex items-center justify-start space-x-3 whitespace-nowrap">
              <Link
                href="/diem-danh"
                className="bg-[#007A87] hover:bg-[#00606B] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors shadow-sm inline-block"
              >
                Điểm danh
              </Link>
              
              <Link
                href="/tra-cuu"
                className="bg-[#00707b] hover:bg-[#005a63] text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition-colors inline-block shadow-sm"
              >
                Cổng ĐRL
              </Link>

              {/* DROPDOWN GIỚI THIỆU CHUẨN PHONG CÁCH UEH */}
              <div className="relative group py-2" ref={introDropdownRef}>
                <div className="flex items-center">
                  <Link
                    href="/gioi-thieu"
                    className="hover:text-[#EE6425] transition-colors text-xs font-bold pl-1 py-1"
                  >
                    Giới thiệu
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsIntroOpen(!isIntroOpen)}
                    className="p-1 hover:text-[#EE6425] transition"
                  >
                    ▾
                  </button>
                </div>

                {/* MENU XỔ XUỐNG KHI RÊ CHUỘT HOẶC BẤM */}
                <div className={`absolute left-0 top-full w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 text-xs font-bold text-slate-700 transition-all ${
                  isIntroOpen ? "block" : "hidden group-hover:block"
                }`}>
                  <Link
                    href="/gioi-thieu"
                    onClick={() => setIsIntroOpen(false)}
                    className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#EE6425] transition"
                  >
                    Về Đoàn Khoa Cơ Khí
                  </Link>
                  <Link
                    href="/tra-cuu-thong-tin"
                    onClick={() => setIsIntroOpen(false)}
                    className="block px-4 py-2.5 hover:bg-orange-50 hover:text-[#EE6425] transition"
                  >
                    Tra cứu Đoàn viên / Sinh viên
                  </Link>
                </div>
              </div>

              <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold">
                Chi đoàn / Chi hội
              </a>
            </div>

            {/* LOGO */}
            <div className="col-span-12 lg:col-span-4 flex items-center justify-center py-1">
              <Link href="/">
                <img
                  src="/logo-doankhoa.png"
                  alt="Tuổi trẻ Khoa Kỹ thuật Cơ khí - Trường Đại học Kỹ thuật - Công nghệ Cần Thơ"
                  className="h-10 sm:h-14 lg:h-16 w-auto max-w-[290px] sm:max-w-[420px] object-contain block mx-auto cursor-pointer transition-transform hover:scale-105"
                />
              </Link>
            </div>

            {/* MENU PHẢI (DESKTOP) */}
            <div className="col-span-4 hidden lg:flex items-center justify-end space-x-4 whitespace-nowrap">
              <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold">
                Hỗ trợ sinh viên
              </a>
              
              <a href="#" className="hover:text-[#007A87] transition-colors flex items-center gap-1 text-xs font-semibold">
                Văn phòng điện tử
              </a>

              {currentUser ? (
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full shadow-sm">
                  <span className="text-xs font-bold text-[#EE6425]">
                    {currentUser.fullName || currentUser.mssv}
                  </span>
                  {(currentUser.role === "super_admin" || currentUser.role === "branch_admin" || currentUser.role === "admin") && (
                    <Link
                      href="/admin"
                      className="bg-[#007A87] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full hover:bg-[#005a63]"
                    >
                      Quản trị
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-[11px] text-slate-400 hover:text-red-600 font-bold ml-1"
                  >
                    (Đăng xuất)
                  </button>
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="bg-[#EE6425] hover:bg-[#d85216] text-white px-4 py-2 rounded-full text-xs font-bold transition-all inline-block shadow-md hover:shadow-lg active:scale-95"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>

          {/* MOBILE QUICK BAR */}
          <div className="flex lg:hidden items-center justify-between gap-1.5 py-2 border-t border-slate-100 overflow-x-auto whitespace-nowrap">
            <div className="flex items-center gap-1.5">
              <Link
                href="/diem-danh"
                className="bg-[#007A87] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-xs"
              >
                Điểm danh
              </Link>
              <Link
                href="/tra-cuu"
                className="bg-[#00707b] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-xs"
              >
                Cổng ĐRL
              </Link>
              <Link
                href="/gioi-thieu"
                className="bg-orange-500 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-xs"
              >
                Giới thiệu
              </Link>
              <Link
                href="/tra-cuu-thong-tin"
                className="bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-xs"
              >
                Tra cứu ĐV
              </Link>
              <Link
                href="/dang-ky"
                className="bg-emerald-600 text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-xs"
              >
                Sự kiện
              </Link>
            </div>

            <div>
              {currentUser ? (
                <div className="flex items-center gap-1 bg-orange-50 border border-orange-200 px-2 py-1 rounded-lg text-[11px] font-bold text-[#EE6425]">
                  <span className="truncate max-w-[90px]">{currentUser.fullName?.split(" ").slice(-1)[0] || currentUser.mssv}</span>
                  {(currentUser.role === "super_admin" || currentUser.role === "branch_admin" || currentUser.role === "admin") && (
                    <Link href="/admin" className="bg-[#007A87] text-white text-[9px] px-1.5 py-0.5 rounded">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 ml-0.5 font-bold">✕</button>
                </div>
              ) : (
                <Link
                  href="/dang-nhap"
                  className="bg-[#EE6425] text-white px-2.5 py-1.5 rounded-lg text-[11px] font-bold shadow-xs inline-block"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* MENU PHỤ */}
        <div className="bg-[#F8FCFC] border-t border-b border-[#E6F4F4]">
          <div className="w-full px-4 sm:px-6 lg:px-10">
            <div className="flex justify-start sm:justify-center space-x-6 sm:space-x-10 py-2.5 text-[12.5px] sm:text-[13.5px] font-semibold text-[#007A87] overflow-x-auto whitespace-nowrap">
              <Link href="/dang-ky" className="hover:text-[#004A52] transition-colors font-bold text-[#EE6425]">
                Hoạt động – Sự kiện Cơ khí
              </Link>
              <Link href="/gioi-thieu" className="hover:text-[#004A52] transition-colors">
                Giới thiệu Đoàn Khoa
              </Link>
              <Link href="/tra-cuu-thong-tin" className="hover:text-[#004A52] transition-colors font-bold text-blue-700">
                Tra cứu Đoàn viên / Sinh viên
              </Link>
              <a href="#" className="hover:text-[#004A52] transition-colors">Xem gì hôm nay</a>
              <a href="#" className="hover:text-[#004A52] transition-colors">Bản tin học thuật</a>
              <a href="#" className="hover:text-[#004A52] transition-colors">Mechanical Signal</a>
            </div>
          </div>
        </div>
      </header>

      {/* BANNER */}
      <section className="w-full bg-[#0A2540] flex justify-center items-center">
        <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-8 py-1 sm:py-4">
          <img
            src="/banner-ctut.png"
            alt="Chương trình Chào đón Tân sinh viên"
            className="w-full h-auto block rounded-none sm:rounded-lg shadow-sm"
          />
        </div>
      </section>

      {/* NỘI DUNG CHÍNH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-gray-100 pb-4 gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#006674] tracking-tight">
            Đọc gì hôm nay
          </h2>

          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat.name)}
                className={`text-xs font-semibold px-3 py-1.5 rounded transition-transform active:scale-95 ${
                  activeCategory === cat.name
                    ? `${cat.color} shadow-sm`
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-8 space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                Chưa có bài viết nào thuộc danh mục này.
              </div>
            ) : (
              filteredPosts.map((post, idx) => (
                <Link
                  key={post.id || idx}
                  href={`/tin-tuc/${post.id}`}
                  className="group grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 bg-white p-3.5 sm:p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer block"
                >
                  <div className="sm:col-span-5 relative aspect-video rounded-lg overflow-hidden bg-gradient-to-tr from-[#006674] to-[#16A085] flex items-center justify-center">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <span className="text-white text-sm sm:text-base font-black uppercase tracking-wider text-center px-2">
                        CTUT MECHANICAL
                      </span>
                    )}
                    <span className="absolute top-2 left-2 bg-[#007A87] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                      {post.category || "Tin tức"}
                    </span>
                  </div>

                  <div className="sm:col-span-7 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug group-hover:text-[#EE6425] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {post.content ? post.content.replace(/<[^>]*>?/gm, "") : ""}
                      </p>
                    </div>
                    <div className="text-[11px] text-gray-400 font-medium mt-2">
                      {post.date} • Cổng thông tin CTUT
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="border-b border-gray-200 flex space-x-6 text-sm font-bold pb-2">
              <button
                onClick={() => setActiveTabRank("Nổi bật")}
                className={`pb-2 transition-all ${
                  activeTabRank === "Nổi bật"
                    ? "text-[#D35400] border-b-2 border-[#D35400]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Nổi bật
              </button>
              <button
                onClick={() => setActiveTabRank("Xem nhiều")}
                className={`pb-2 transition-all ${
                  activeTabRank === "Xem nhiều"
                    ? "text-[#D35400] border-b-2 border-[#D35400]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Xem nhiều
              </button>
            </div>

            <div className="divide-y divide-gray-100 mt-2">
              {[
                { title: "[Thông báo] Mở cổng tự đánh giá Điểm Rèn Luyện Học kỳ II", date: "25/08/2026" },
                { title: "Kế hoạch tổ chức Hội thi Thiết kế xe tiết kiệm nhiên liệu CTUT 2026", date: "23/08/2026" },
                { title: "Danh sách sinh viên Khoa Cơ khí nhận học bổng Khuyến khích Tài năng đợt 1", date: "21/08/2026" },
              ].map((post, i) => (
                <div key={i} className="py-3 group cursor-pointer">
                  <h4 className="text-xs font-semibold text-gray-800 leading-snug group-hover:text-[#007A87] transition-colors">
                    {post.title}
                  </h4>
                  <span className="text-[10px] text-gray-400 mt-1 block">
                    {post.date}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#006674] text-white p-4 rounded-xl text-center space-y-2">
              <div className="text-xs font-bold uppercase tracking-wide">Cổng Dịch Vụ Sinh Viên</div>
              <p className="text-[11px] text-teal-100">Tra cứu kết quả rèn luyện & Check-in sự kiện bằng mã QR</p>
              <Link
                href="/tra-cuu"
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-bold py-2 rounded transition-colors uppercase inline-block"
              >
                Tra cứu ĐRL ngay
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#1A252F] text-gray-400 py-8 border-t border-gray-700 text-xs">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="text-white font-bold uppercase">
            ĐOÀN KHOA KỸ THUẬT CƠ KHÍ – TRƯỜNG ĐẠI HỌC KỸ THUẬT - CÔNG NGHỆ CẦN THƠ
          </div>
          <div>Địa chỉ: 256 Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều, TP. Cần Thơ</div>
          <div className="text-gray-500 text-[11px]">Bản quyền 2026 CTUT Mechanical Youth Portal.</div>
        </div>
      </footer>
    </div>
  );
}

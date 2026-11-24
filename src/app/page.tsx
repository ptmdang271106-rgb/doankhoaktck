"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import BannerSlider from "@/components/BannerSlider";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

const separateHomeSections = [
  {
    name: "Xem gì hôm nay",
    slug: "xem-gi-hom-nay",
    id: "xem-gi-hom-nay",
    heading: "text-[#007A87]",
    badge: "bg-teal-50 text-[#007A87]",
  },
  {
    name: "Bản tin học thuật",
    slug: "ban-tin-hoc-thuat",
    id: "ban-tin-hoc-thuat",
    heading: "text-blue-700",
    badge: "bg-blue-50 text-blue-700",
  },
  {
    name: "Gương sáng FME",
    slug: "guong-sang-fme",
    id: "guong-sang-fme",
    heading: "text-purple-700",
    badge: "bg-purple-50 text-purple-700",
  },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [activeTabRank, setActiveTabRank] = useState("Nổi bật");
  const [allPosts, setAllPosts] = useState<any[]>([]);

  useEffect(() => {
    if (categoryParam) {
      const separateSection = separateHomeSections.find((section) => section.name === categoryParam);
      if (separateSection) {
        requestAnimationFrame(() => {
          document.getElementById(separateSection.id)?.scrollIntoView({ behavior: "smooth" });
        });
      } else {
        setActiveCategory(categoryParam);
      }
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase.from("posts").select("*").order("id", { ascending: false });
      if (data && data.length > 0) {
        setAllPosts(data);
      }
    };
    fetchPosts();
  }, []);

  const categories = [
    { name: "Tất cả", color: "bg-[#F39C12] text-white" },
    { name: "Phong trào", color: "bg-[#D35400] text-white" },
    { name: "Học thuật - NCKH", color: "bg-[#16A085] text-white" },
    { name: "Tổ chức - Đoàn thể", color: "bg-[#E67E22] text-white" },
    { name: "Tình nguyện", color: "bg-[#7F8C8D] text-white" },
  ];

  const separateCategoryNames = new Set(separateHomeSections.map((section) => section.name));
  const generalPosts = allPosts.filter((post) => !separateCategoryNames.has(post.category));
  const filteredPosts = activeCategory === "Tất cả"
    ? generalPosts
    : generalPosts.filter((post) => post.category === activeCategory);

  // Danh sách bài viết Nổi bật & Xem nhiều (lấy từ dữ liệu thật)
  const featuredPosts = generalPosts.slice(0, 5);
  const popularPosts = [...generalPosts].reverse().slice(0, 5);
  const sidePosts = activeTabRank === "Nổi bật" ? featuredPosts : popularPosts;

  return (
    <div className="min-h-screen bg-white text-[#333333] font-sans antialiased">
      <Navbar />

      {/* BANNER SLIDER */}
      <BannerSlider />

      {/* NỘI DUNG CHÍNH */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div id="doc-gi-hom-nay" className="scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b-2 border-gray-100 pb-4 gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#006674] tracking-tight">
              Đọc gì hôm nay
            </h2>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full sm:flex-wrap">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded transition-transform active:scale-95 whitespace-nowrap flex-shrink-0 ${
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-8 space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm">
                Chưa có bài viết nào thuộc chuyên mục "{activeCategory}".
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
                      {post.date} • Cổng thông tin Liên chi Hội Sinh viên Khoa Kỹ thuật Cơ khí
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
              {sidePosts.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  Đang tải danh sách bài viết...
                </div>
              ) : (
                sidePosts.map((post, i) => (
                  <Link
                    key={post.id || i}
                    href={`/tin-tuc/${post.id}`}
                    className="py-3 group cursor-pointer block hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5 shadow-2xs ${
                          i === 0
                            ? "bg-[#EE6425] text-white"
                            : i === 1
                            ? "bg-[#007A87] text-white"
                            : i === 2
                            ? "bg-[#16A085] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 leading-snug group-hover:text-[#EE6425] transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          {post.date && <span>{post.date}</span>}
                          {post.category && (
                            <span className="text-[#007A87] font-semibold">
                              • {post.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="mt-6 bg-[#006674] text-white p-4 rounded-xl text-center space-y-2">
              <div className="text-xs font-bold uppercase tracking-wide">Cổng Dịch Vụ Sinh Viên</div>
              <p className="text-[11px] text-teal-100">Tra cứu kết quả rèn luyện & Điểm danh hoạt động bằng mã QR</p>
              <Link
                href="/tra-cuu"
                className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-xs font-bold py-2 rounded transition-colors uppercase inline-block"
              >
                Tra cứu Điểm rèn luyện ngay
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 space-y-10">
          {separateHomeSections.map((section) => {
            const sectionPosts = allPosts.filter((post) => post.category === section.name);

            return (
              <section key={section.name} id={section.id} className="scroll-mt-32 border-t border-slate-100 pt-7">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${section.heading}`}>Chuyên mục riêng</p>
                    <Link href={`/chuyen-muc/${section.slug}`} className={`mt-1 inline-block text-xl font-extrabold hover:underline sm:text-2xl ${section.heading}`}>{section.name}</Link>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{sectionPosts.length} bài viết</span>
                </div>

                {sectionPosts.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                    Nội dung sẽ được cập nhật sớm.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {sectionPosts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/tin-tuc/${post.id}`}
                        className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="relative aspect-video overflow-hidden bg-gradient-to-tr from-[#006674] to-[#16A085]">
                          {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm font-black tracking-wider text-white">CTUT MECHANICAL</div>
                          )}
                          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold ${section.badge}`}>
                            {section.name}
                          </span>
                        </div>
                        <div className="p-4">
                          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition group-hover:text-[#EE6425] sm:text-base">
                            {post.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">
                            {post.content ? post.content.replace(/<[^>]*>?/gm, "") : ""}
                          </p>
                          <p className="mt-3 text-[11px] font-medium text-slate-400">{post.date}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CTUTYouthPortal() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
      <HomeContent />
    </Suspense>
  );
}

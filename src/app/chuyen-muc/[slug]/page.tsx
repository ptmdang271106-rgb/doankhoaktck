"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { siteImages } from "@/lib/site-images";
import Footer from "@/components/Footer";

const categoryMap: Record<string, { name: string; accent: string; soft: string }> = {
  "xem-gi-hom-nay": { name: "Xem gì hôm nay", accent: "text-[#007A87]", soft: "bg-teal-50 text-[#007A87]" },
  "ban-tin-hoc-thuat": { name: "Bản tin học thuật", accent: "text-blue-700", soft: "bg-blue-50 text-blue-700" },
  "guong-sang-fme": { name: "Gương sáng FME", accent: "text-purple-700", soft: "bg-purple-50 text-purple-700" },
};

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const category = useMemo(() => categoryMap[params?.slug || ""], [params?.slug]);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) {
      setLoading(false);
      return;
    }

    const loadPosts = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("category", category.name)
        .order("id", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };

    loadPosts();
  }, [category]);

  if (!category) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20 text-center font-sans">
        <h1 className="text-xl font-black text-[#004A52]">Không tìm thấy chuyên mục</h1>
        <Link href="/" className="mt-4 inline-block text-sm font-bold text-[#007A87] hover:underline">Về trang chủ</Link>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans antialiased">
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <img src={siteImages.logo} alt="Tuổi trẻ Khoa Kỹ thuật Cơ khí" className="h-10 w-auto object-contain" />
          </Link>
          <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">← Trang chủ</Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm font-bold text-[#006674]">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="font-normal text-slate-400">›</span>
          <span className="text-slate-600">{category.name}</span>
        </nav>

        <div className="mb-8 border-b border-slate-100 pb-5">
          <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${category.accent}`}>Chuyên mục</p>
          <h1 className={`mt-1 text-2xl font-black sm:text-3xl ${category.accent}`}>{category.name}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Các bài viết mới nhất từ Liên chi Hội Sinh viên Khoa Kỹ thuật Cơ khí.
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm text-slate-400">Đang tải bài viết...</div>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-16 text-center text-sm text-slate-400">
            Chưa có bài viết trong chuyên mục này.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {posts.map((post) => (
              <Link key={post.id} href={`/tin-tuc/${post.id}`} className="group grid grid-cols-1 gap-5 rounded-2xl border border-slate-100 bg-white p-3.5 transition hover:shadow-md sm:grid-cols-5">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gradient-to-tr from-[#006674] to-[#16A085] sm:col-span-2 sm:aspect-square">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center px-3 text-center text-xs font-black tracking-wider text-white">CTUT MECHANICAL</div>
                  )}
                  <span className={`absolute left-2 top-2 rounded px-2 py-1 text-[10px] font-bold ${category.soft}`}>{category.name}</span>
                </div>
                <div className="flex flex-col justify-between py-1 sm:col-span-3">
                  <div>
                    <h2 className="line-clamp-3 text-base font-black leading-snug text-[#004A52] transition group-hover:text-[#EE6425]">{post.title}</h2>
                    <p className="mt-2 line-clamp-4 text-xs leading-relaxed text-slate-600">{post.content ? post.content.replace(/<[^>]*>?/gm, "") : ""}</p>
                  </div>
                  <p className="mt-4 text-[11px] font-medium text-slate-400">{post.date} · Cổng thông tin Liên chi Hội Sinh viên Khoa Kỹ thuật Cơ khí</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

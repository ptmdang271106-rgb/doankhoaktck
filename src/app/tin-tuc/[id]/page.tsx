"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ChiTietTinTucPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const customPosts = JSON.parse(localStorage.getItem("ctut_custom_posts") || "[]");
    const found = customPosts.find((p: any) => p.id === id);
    if (found) {
      setPost(found);
    } else {
      // Dữ liệu mẫu nếu bấm vào bài mặc định
      setPost({
        title: "Thông tin chi tiết bài viết - Đoàn Khoa Cơ khí CTUT",
        category: "Tin tức",
        coverImage: "",
        date: "25/08/2026",
        contentHtml: "<p>Nội dung chi tiết đang được Ban biên tập cập nhật...</p>",
      });
    }
  }, [id]);

  if (!post) return <div className="p-8 text-center text-sm font-bold text-slate-500">Đang tải bài viết...</div>;

  return (
    <main className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-xs font-bold text-[#007A87] mb-6">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span>›</span>
          <span className="text-slate-400">{post.category}</span>
        </nav>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#EE6425] leading-snug mb-3">
          {post.title}
        </h1>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-medium mb-6 pb-4 border-b border-slate-100">
          <span>📅 Ngày đăng: {post.date}</span>
          <span>•</span>
          <span>Khoa Kỹ thuật Cơ khí CTUT</span>
        </div>

        {post.coverImage && (
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm mb-8 bg-slate-900">
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* NỘI DUNG VÀ HÌNH ẢNH MINH HỌA DO ADMIN SOẠN */}
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-sm sm:text-base space-y-4 [&_img]:rounded-xl [&_img]:my-4 [&_img]:mx-auto [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#004A52]"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center">
          <Link
            href="/"
            className="text-xs font-bold text-[#007A87] hover:underline"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </main>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";

export const EVENTS = [
  {
    id: "ipmc-2026",
    title: "Khoa Kỹ thuật Cơ khí CTUT tổ chức Mechanical Innovation & Tech Festival 2026",
    date: "25/10/2026",
    time: "08:00 - 17:00",
    location: "Hội trường A - Đại học KT-CN Cần Thơ",
    desc: "Ngày hội Sáng tạo & Trình diễn Công nghệ Cơ khí 2026. Quy tụ các mô hình robot tự hành, cánh tay robot công nghiệp và sản phẩm công nghệ xuất sắc của sinh viên CTUT.",
    deadline: "20/10/2026",
    badge: "Sự kiện trọng điểm",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "nckh-ck-2026",
    title: "Hội nghị Sinh viên Nghiên cứu Khoa học & Đổi mới sáng tạo Khối Kỹ thuật 2026",
    date: "15/11/2026",
    time: "07:30 - 11:30",
    location: "Khu thực hành Xưởng Cơ khí CTUT",
    desc: "Báo cáo các đề tài NCKH xuất sắc về Tự động hóa, Thiết kế máy và Năng lượng mới. Cơ hội nhận học bổng tài năng và điểm rèn luyện nghiên cứu khoa học.",
    deadline: "05/11/2026",
    badge: "Học thuật - NCKH",
    image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "mua-he-xanh-2026",
    title: "Lễ ra quân Chiến dịch Tình nguyện Mùa hè xanh & Ngày hội Kỹ thuật vì cộng đồng",
    date: "05/12/2026",
    time: "06:30 - 16:30",
    location: "Huyện Phong Điền, TP. Cần Thơ",
    desc: "Chiến dịch tình nguyện chuyên ngành: Sửa chữa điện gia dụng, bảo dưỡng máy móc nông nghiệp miễn phí cho bà con nông dân và thắp sáng tuyến đường quê.",
    deadline: "28/11/2026",
    badge: "Tình nguyện CTXH",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&auto=format&fit=crop&q=60",
  },
];

export default function SuKienPage() {
  const [selectedDay, setSelectedDay] = useState(25);

  return (
    <main className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation chuẩn UEH */}
        <nav className="flex items-center gap-2 text-sm text-[#006674] font-medium mb-8">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-400">›</span>
          <span className="text-[#006674] font-bold">Hoạt động & Sự kiện Cơ khí</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CỘT TRÁI: DANH SÁCH SỰ KIỆN */}
          <div className="lg:col-span-8 divide-y divide-gray-100 space-y-8">
            {EVENTS.map((event) => (
              <div key={event.id} className="pt-6 first:pt-0 flex flex-col sm:flex-row gap-6 group">
                <div className="w-full sm:w-56 h-36 relative flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 shadow-sm">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-[#007A87] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {event.badge}
                  </span>
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link
                      href={`/su-kien/${event.id}`}
                      className="text-lg sm:text-xl font-bold text-[#EE6425] hover:underline leading-snug transition-colors line-clamp-2"
                    >
                      {event.title}
                    </Link>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 my-2">
                      <span className="flex items-center gap-1 text-[#007A87]">
                        📅 Ngày diễn ra: {event.date}
                      </span>
                      <span>⏰ Hạn đăng ký: {event.deadline}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                      {event.desc}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-4">
                    <Link
                      href={`/su-kien/${event.id}`}
                      className="text-xs font-bold text-[#007A87] hover:underline"
                    >
                      Xem chi tiết bài viết →
                    </Link>
                    <Link
                      href={`/dang-nhap?redirect=/su-kien/${event.id}`}
                      className="text-xs font-bold text-white bg-[#EE6425] hover:bg-[#d85216] px-3.5 py-1.5 rounded-lg shadow-sm transition"
                    >
                      Đăng ký tham gia
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CỘT PHẢI: LỊCH SỰ KIỆN UEH STYLE */}
          <div className="lg:col-span-4">
            <div className="bg-[#FFFBF7] rounded-xl border border-orange-100 p-5 shadow-sm sticky top-24">
              <h3 className="text-center font-bold text-sm tracking-wider uppercase text-[#004A52] mb-4">
                THỜI GIAN DIỄN RA SỰ KIỆN
              </h3>

              <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3 px-2">
                <button className="hover:text-orange-600">‹</button>
                <span className="text-slate-800">Tháng 8, 2026</span>
                <button className="hover:text-orange-600">›</button>
              </div>

              {/* Lưới ngày */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d, i) => (
                  <div key={i} className="py-1 text-slate-400 font-bold">{d}</div>
                ))}

                {[
                  26, 27, 28, 29, 30, 31, 1,
                  2, 3, 4, 5, 6, 7, 8,
                  9, 10, 11, 12, 13, 14, 15,
                  16, 17, 18, 19, 20, 21, 22,
                  23, 24, 25, 26, 27, 28, 29,
                  30, 31, 1, 2, 3, 4, 5
                ].map((day, idx) => {
                  const isEventDay = [25, 28, 15].includes(day);
                  const isSelected = selectedDay === day;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedDay(day)}
                      className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full transition-all text-xs ${
                        isEventDay
                          ? "bg-[#EE6425] text-white font-bold shadow-sm"
                          : isSelected
                          ? "bg-slate-200 font-bold"
                          : "text-slate-700 hover:bg-orange-50"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-orange-100 flex items-center gap-2 text-[11px] text-slate-500 justify-center">
                <span className="w-2.5 h-2.5 bg-[#EE6425] rounded-full inline-block"></span>
                <span>Ngày có sự kiện Đoàn - Hội</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

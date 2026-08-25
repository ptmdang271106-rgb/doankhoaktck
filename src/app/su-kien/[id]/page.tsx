"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const EVENT_DETAILS: Record<string, any> = {
  "ipmc-2026": {
    title: "Khoa Kỹ thuật Cơ khí CTUT tổ chức Mechanical Innovation & Tech Festival 2026: Tôn vinh sáng tạo và giải pháp cơ khí hiện đại",
    date: "25 tháng 10 2026",
    time: "08:00 - 17:00",
    location: "Hội trường A & Sân cờ Trường ĐH Kỹ thuật - Công nghệ Cần Thơ",
    banner: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&auto=format&fit=crop&q=80",
    subHeading: "Mechanical Innovation Festival – Nơi tuổi trẻ cơ khí kiến tạo tương lai số",
    content: [
      "Với thông điệp 'Kiến tạo tương lai cùng công nghệ Cơ khí thông minh', Tech Festival 2026 được định hướng trở thành ngày hội triển lãm, tranh tài quy mô lớn nhất trong năm học của Đoàn Khoa Kỹ thuật Cơ khí.",
      "Sự kiện quy tụ hơn 30 gian hàng trưng bày sản phẩm khoa học ứng dụng của sinh viên các ngành: Kỹ thuật Cơ khí, Cơ điện tử, Kỹ thuật Hệ thống công nghiệp, cùng các hội thảo chuyên đề từ các tập đoàn chế tạo máy hàng đầu.",
      "Sinh viên tham gia trọn vẹn sự kiện sẽ được cấp Giấy chứng nhận và ghi nhận +15 Điểm Rèn Luyện (Mục Hoạt động Học thuật - Kỹ năng) & +1 Ngày Công tác xã hội.",
    ],
  },
};

export default function ChiTietSuKienPage() {
  const params = useParams();
  const id = (params?.id as string) || "ipmc-2026";
  const event = EVENT_DETAILS[id] || EVENT_DETAILS["ipmc-2026"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <main className="min-h-screen bg-white text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-[#006674] font-medium mb-6">
          <Link href="/" className="hover:underline">Trang chủ</Link>
          <span className="text-slate-400">›</span>
          <Link href="/dang-ky" className="hover:underline">Sự kiện</Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CỘT CHÍNH: NỘI DUNG BÀI VIẾT VÀ NÚT ĐĂNG KÝ (8 CỘT) */}
          <div className="lg:col-span-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#D35400] leading-snug mb-4">
              {event.title}
            </h1>

            {/* NÚT ĐĂNG KÝ HOẠT ĐỘNG SANG TRỌNG (THAY THẾ CHỖ 3 Ô VUÔNG LHQ) */}
            <div className="my-6 p-4 rounded-xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wide">
                  Đang mở cổng ghi danh
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Thời gian: <strong>{event.time} | {event.date}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-[#E05A10] hover:bg-[#c94d0a] text-white text-sm font-extrabold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 whitespace-nowrap uppercase tracking-wider"
              >
                👉 Đăng ký tham gia ngay
              </button>
            </div>

            {/* BANNER SỰ KIỆN */}
            <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-sm mb-6 bg-slate-900">
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
            </div>

            {/* NỘI DUNG BÀI VIẾT */}
            <h2 className="text-xl font-bold text-[#006674] mb-3">{event.subHeading}</h2>
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              {event.content.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* NÚT ĐĂNG KÝ THÊM Ở DƯỚI CUỐI BÀI */}
            <div className="mt-10 pt-6 border-t border-slate-200 text-center">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#007A87] hover:bg-[#005a63] text-white font-bold px-8 py-3.5 rounded-xl shadow transition"
              >
                Ghi danh tham dự sự kiện này
              </button>
            </div>
          </div>

          {/* CỘT PHẢI: SỰ KIỆN SẮP TỚI (4 CỘT) */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h3 className="text-xl font-bold text-[#004A52] pb-3 border-b-2 border-slate-100 mb-4">
                Sự kiện sắp tới
              </h3>
              <div className="divide-y divide-slate-100 space-y-4">
                {[
                  {
                    title: "Hội thảo quốc tế Sinh viên nghiên cứu khoa học & Chuyển giao công nghệ 2026",
                    date: "10 tháng 10 2026",
                    img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&auto=format&fit=crop&q=60",
                  },
                  {
                    title: "Ngày hội Cựu sinh viên Khoa Kỹ thuật Cơ khí - Kết nối Doanh nghiệp CTUT",
                    date: "03 tháng 11 2026",
                    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&auto=format&fit=crop&q=60",
                  },
                  {
                    title: "Giải Bóng đá truyền thống Cúp Cơ Khí Mở rộng 2026",
                    date: "25 tháng 11 2026",
                    img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=60",
                  },
                ].map((item, index) => (
                  <div key={index} className="pt-4 first:pt-0 flex gap-3 group cursor-pointer">
                    <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-[#E05A10] leading-snug line-clamp-2">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 mt-1 block font-medium">
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL POPUP FORM ĐĂNG KÝ THAM GIA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold text-xl"
            >
              ✕
            </button>

            {submitted ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-black">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-slate-800">Đăng ký thành công!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Hẹn gặp bạn tại <strong>{event.title}</strong>!
                </p>
                <button
                  onClick={() => { setSubmitted(false); setIsModalOpen(false); }}
                  className="mt-6 bg-[#007A87] text-white text-xs font-bold px-6 py-2.5 rounded-xl"
                >
                  Đóng
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                className="space-y-4"
              >
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-[#004A52]">Đăng Ký Tham Gia Sự Kiện</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{event.title}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input required placeholder="Nguyễn Văn A" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#E05A10]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">MSSV *</label>
                    <input required placeholder="2200101" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#E05A10]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Lớp *</label>
                    <input required placeholder="CK22A1" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#E05A10]" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại / Zalo *</label>
                  <input required type="tel" placeholder="0912345678" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#E05A10]" />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E05A10] hover:bg-[#c94d0a] text-white font-bold py-3 rounded-xl transition shadow"
                >
                  Xác nhận ghi danh
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

"use client";

import React from "react";
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
      "Sự kiện quy tụ hơn 30 gian hàng trưng bày sản phẩm khoa học ứng dụng của sinh viên các ngành: Kỹ thuật Cơ khí, Cơ điện tử, Kỹ thuật Hệ thống công nghiệp, cùng các hội thảo chuyên đề từ các doanh nghiệp hàng đầu.",
      "Sinh viên tham gia trọn vẹn sự kiện sẽ được cấp Giấy chứng nhận và ghi nhận +15 Điểm Rèn Luyện & +1 Ngày Công tác xã hội.",
    ],
  },
};

export default function ChiTietSuKienPage() {
  const params = useParams();
  const id = (params?.id as string) || "ipmc-2026";
  const event = EVENT_DETAILS[id] || EVENT_DETAILS["ipmc-2026"];

  return (
    <main className="min-h-screen bg-white text-slate-800 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation chuẩn UEH */}
        <nav className="flex items-center gap-2 text-sm text-[#006674] font-medium mb-6">
          <Link href="/" className="hover:underline text-[#006674]">Trang chủ</Link>
          <span className="text-[#006674]">›</span>
          <Link href="/dang-ky" className="hover:underline text-[#006674]">Sự kiện</Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* CỘT CHÍNH */}
          <div className="lg:col-span-8">
            {/* Tiêu đề chuẩn tone cam & font UEH */}
            <h1 className="text-2xl sm:text-[32px] font-extrabold text-[#EE6425] leading-tight tracking-tight mb-5">
              {event.title}
            </h1>

            {/* THANH ĐĂNG KÝ (BẤM VÀO CHUYỂN HƯỚNG ĐẾN TRANG /dang-nhap) */}
            <div className="my-6 p-4 sm:p-5 rounded-2xl bg-[#FFF9F5] border border-[#FDE6D7] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div>
                <span className="text-xs font-bold text-[#EE6425] uppercase tracking-wider block">
                  ĐANG MỞ CỔNG GHI DANH
                </span>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Thời gian: <strong className="text-slate-800">{event.time} | {event.date}</strong>
                </p>
              </div>
              <Link
                href={`/dang-nhap?redirect=/su-kien/${id}`}
                className="w-full sm:w-auto bg-[#EE6425] hover:bg-[#d85216] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-xl shadow-md transition-all active:scale-95 uppercase tracking-wider whitespace-nowrap text-center inline-block"
              >
                ĐĂNG KÝ THAM GIA NGAY
              </Link>
            </div>

            {/* BANNER SỰ KIỆN */}
            <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden shadow-sm mb-6 bg-slate-900">
              <img src={event.banner} alt={event.title} className="w-full h-full object-cover" />
            </div>

            {/* NỘI DUNG */}
            <h2 className="text-xl font-bold text-[#006674] mb-3">{event.subHeading}</h2>
            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              {event.content.map((p: string, idx: number) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* NÚT ĐĂNG KÝ THÊM DƯỚI CUỐI BÀI */}
            <div className="mt-10 pt-6 border-t border-slate-200 text-center">
              <Link
                href={`/dang-nhap?redirect=/su-kien/${id}`}
                className="bg-[#007A87] hover:bg-[#005a63] text-white font-bold px-8 py-3.5 rounded-xl shadow transition inline-block text-center text-sm"
              >
                Ghi danh tham dự sự kiện này
              </Link>
            </div>
          </div>

          {/* CỘT PHẢI: SỰ KIỆN SẮP TỚI */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold text-[#006674] pb-2 mb-4 tracking-tight">
                Sự kiện sắp tới
              </h3>
              <div className="divide-y divide-slate-100 space-y-4">
                {[
                  {
                    title: "Hội thảo quốc tế Sinh viên nghiên cứu khoa học các Trường Đại học Kỹ thuật (SR-ICYREB 2026)",
                    date: "10 tháng 10 2026",
                    img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=200&auto=format&fit=crop&q=60",
                  },
                  {
                    title: "UEH Alumni Homecoming Day 2026: Ngày hội trở về dành cho cựu sinh viên toàn quốc",
                    date: "03 tháng 10 2026",
                    img: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=200&auto=format&fit=crop&q=60",
                  },
                  {
                    title: "[Diễn đàn] VIỆT LÀ VƯỢT: Phiên đối thoại Khát vọng Tuổi trẻ Công nghệ",
                    date: "25 tháng 08 2026",
                    img: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=60",
                  },
                ].map((item, index) => (
                  <div key={index} className="pt-4 first:pt-0 flex gap-3 group cursor-pointer">
                    <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-800 group-hover:text-[#EE6425] leading-snug line-clamp-2">
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
    </main>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { siteImages } from "@/lib/site-images";

export default function Footer() {
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: React.ReactNode;
  } | null>(null);

  const openPrivacy = () => {
    setModalContent({
      title: "Chính sách bảo mật",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            Cổng thông tin Đoàn Thanh niên - Liên chi hội Sinh viên Khoa Kỹ thuật
            Cơ khí (Trường Đại học Kỹ thuật - Công nghệ Cần Thơ) cam kết bảo mật
            thông tin cá nhân của toàn thể đoàn viên, hội viên và sinh viên:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Dữ liệu sinh viên (MSSV, Họ tên, Chi đoàn, Email, Điểm rèn luyện)
              chỉ sử dụng cho công tác đoàn thể, quản lý rèn luyện và phong trào
              nội bộ.
            </li>
            <li>
              Tài liệu, hình ảnh minh chứng được lưu trữ an toàn và chỉ cán bộ phụ
              trách/BCH có thẩm quyền xét duyệt mới có quyền truy cập.
            </li>
            <li>
              Hệ thống áp dụng các biện pháp xác thực bảo mật hiện đại qua tài
              khoản sinh viên trường.
            </li>
          </ul>
        </div>
      ),
    });
  };

  const openTerms = () => {
    setModalContent({
      title: "Nội quy sử dụng",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p>
            Đoàn viên, sinh viên khi sử dụng hệ thống trực tuyến của Đoàn Khoa -
            Liên chi hội cần tuân thủ các quy định:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Cung cấp thông tin trung thực, chính xác khi khai báo điểm rèn
              luyện và nộp minh chứng hoạt động.
            </li>
            <li>
              Nghiêm cấm các hành vi giả mạo giấy chứng nhận, chỉnh sửa ảnh minh
              chứng hoặc khai khống điểm số.
            </li>
            <li>
              Bảo quản thông tin tài khoản cá nhân, không chia sẻ cho bên ngoài.
            </li>
            <li>
              Chấp hành đúng thời hạn mở/đóng đợt nộp ĐRL theo thông báo của từng
              học kỳ.
            </li>
          </ul>
        </div>
      ),
    });
  };

  const openGuide = () => {
    setModalContent({
      title: "Hướng dẫn sử dụng",
      content: (
        <div className="space-y-3 text-xs leading-relaxed text-slate-600">
          <p className="font-bold text-slate-800">
            Quy trình nộp & tra cứu Điểm rèn luyện (ĐRL):
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              <strong>Đăng nhập:</strong> Sử dụng tài khoản sinh viên (MSSV / Mật
              khẩu mặc định 3 số cuối MSSV hoặc đăng nhập qua Google Email trường).
            </li>
            <li>
              <strong>Cổng ĐRL:</strong> Chọn học kỳ hiện tại đang mở đợt đánh
              giá.
            </li>
            <li>
              <strong>Tab 1 - Minh chứng:</strong> Đính kèm hình ảnh/tệp minh
              chứng tham gia hoạt động, sự kiện, nghiên cứu khoa học...
            </li>
            <li>
              <strong>Tab 2 - Phiếu ĐRL:</strong> Nhập số điểm tự chấm theo từng
              tiêu chí quy định và nhấn nút nộp phiếu.
            </li>
            <li>
              <strong>Tab 3 - Kết quả:</strong> Theo dõi trạng thái xét duyệt
              (Chưa nộp → Đã nộp → Đã duyệt) và kết quả điểm chính thức do BCH Chi
              đoàn/Đoàn Khoa công bố.
            </li>
          </ol>
        </div>
      ),
    });
  };

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs mt-auto font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* CỘT 1: LOGO */}
          <div className="md:col-span-4 flex items-center justify-center md:justify-start">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <img
                src={siteImages.logo}
                alt="ĐOÀN THANH NIÊN - LIÊN CHI HỘI SINH VIÊN KHOA KỸ THUẬT CƠ KHÍ - TRƯỜNG ĐẠI HỌC KỸ THUẬT - CÔNG NGHỆ CẦN THƠ"
                className="h-12 sm:h-14 w-auto max-w-[290px] sm:max-w-[340px] object-contain"
              />
            </Link>
          </div>

          {/* CỘT 2: THÔNG TIN TỔ CHỨC */}
          <div className="md:col-span-5 space-y-2 text-center md:text-left">
            <h3 className="font-bold text-[#004A52] text-xs sm:text-[13px] uppercase leading-snug tracking-wide">
              ĐOÀN THANH NIÊN - LIÊN CHI HỘI SINH VIÊN KHOA KỸ THUẬT CƠ KHÍ - TRƯỜNG
              ĐẠI HỌC KỸ THUẬT - CÔNG NGHỆ CẦN THƠ
            </h3>
            <div className="text-[11px] sm:text-xs text-slate-500 space-y-1">
              <p className="flex items-center justify-center md:justify-start gap-1.5">
                <span>
                  📍 Địa chỉ: 256 Nguyễn Văn Cừ, Phường An Hòa, Quận Ninh Kiều,
                  TP. Cần Thơ
                </span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-1.5">
                <span>📞 Điện thoại: 0292.3898.167</span>
              </p>
              <p className="flex items-center justify-center md:justify-start gap-1.5">
                <span>✉️ Email:</span>
                <a
                  href="mailto:doankhoaktck@ctuet.edu.vn"
                  className="text-[#EE6425] hover:underline font-semibold"
                >
                  doankhoaktck@ctuet.edu.vn
                </a>
              </p>
            </div>
          </div>

          {/* CỘT 3: CÁC LIÊN KẾT NHANH */}
          <div className="md:col-span-3 flex flex-col items-center md:items-end space-y-2 text-xs">
            <button
              type="button"
              onClick={openPrivacy}
              className="text-slate-600 hover:text-[#EE6425] transition font-medium"
            >
              Chính sách bảo mật
            </button>
            <button
              type="button"
              onClick={openTerms}
              className="text-slate-600 hover:text-[#EE6425] transition font-medium"
            >
              Nội quy sử dụng
            </button>
            <a
              href="https://m.me/doankhoaktck.ctut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-[#EE6425] transition font-medium"
            >
              Trung tâm trợ giúp
            </a>
            <button
              type="button"
              onClick={openGuide}
              className="text-slate-600 hover:text-[#EE6425] transition font-medium"
            >
              Hướng dẫn sử dụng
            </button>
          </div>
        </div>

        {/* BẢN QUYỀN CUỐI */}
        <div className="border-t border-slate-100 mt-6 pt-4 text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} Đoàn Thanh niên - Liên chi hội Sinh viên
          Khoa Kỹ thuật Cơ khí - Trường Đại học Kỹ thuật - Công nghệ Cần Thơ.
        </div>
      </div>

      {/* MODAL CHI TIẾT */}
      {modalContent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setModalContent(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="text-sm font-black text-[#004A52] uppercase">
                {modalContent.title}
              </h4>
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm transition"
              >
                ✕
              </button>
            </div>
            {modalContent.content}
            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="px-5 py-2 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}

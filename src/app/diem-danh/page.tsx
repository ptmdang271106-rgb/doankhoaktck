"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Tọa độ ghim mặc định tại Hội trường CTUET
const EVENT_GPS = { lat: 10.0469, lng: 105.7681 }; 

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function DiemDanhPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [gpsDistance, setGpsDistance] = useState<number | null>(null);
  const [gpsStatus, setGpsStatus] = useState("Đang kiểm tra vị trí...");
  const [successInfo, setSuccessInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/diem-danh");
      return;
    }
    setCurrentUser(JSON.parse(userStr));

    // Lấy tọa độ GPS người dùng
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const dist = getDistanceFromLatLonInMeters(
            pos.coords.latitude,
            pos.coords.longitude,
            EVENT_GPS.lat,
            EVENT_GPS.lng
          );
          setGpsDistance(Math.round(dist));
          setGpsStatus(`Khoảng cách đến sự kiện: ~${Math.round(dist)}m (Hợp lệ trong bán kính 200m)`);
        },
        () => setGpsStatus("Không bật GPS (Chấp nhận chế độ bỏ qua GPS)")
      );
    }
  }, [router]);

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessInfo(null);

    const cleanCode = qrCodeInput.trim();
    if (!cleanCode) return setErrorMsg("Vui lòng nhập hoặc quét mã QR sự kiện!");

    // 1. Kiểm tra sự kiện
    const allEvents = JSON.parse(localStorage.getItem("ctut_custom_events") || "[]");
    const matchedEvent = allEvents.find((ev: any) => ev.id === cleanCode || ev.title.toLowerCase().includes(cleanCode.toLowerCase())) || {
      id: cleanCode,
      title: cleanCode,
      categoryCode: "III.8",
      points: 2,
    };

    // 2. Kiểm tra xem sinh viên có đăng ký tham gia trước không
    const allRegs = JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]");
    const hasRegistered = allRegs.some(
      (r: any) => r.mssv === currentUser.mssv && (r.eventTitle === matchedEvent.title || r.eventTitle.includes(cleanCode))
    );

    if (!hasRegistered) {
      return setErrorMsg("Bạn chưa đăng ký tham gia sự kiện này trên hệ thống nên không thể điểm danh!");
    }

    // 3. Tự động chuyển dữ liệu về mục Nộp Minh Chứng
    const newProof = {
      id: "proof-" + Date.now().toString(),
      mssv: currentUser.mssv,
      fullName: currentUser.fullName,
      title: `Được điểm danh hoạt động Tại sự kiện "${matchedEvent.title}"`,
      categoryCode: matchedEvent.categoryCode || "III.8",
      points: Number(matchedEvent.points) || 2,
      source: "Điểm danh QR",
      status: "Đã duyệt",
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    const allProofs = JSON.parse(localStorage.getItem("ctut_student_proofs") || "[]");
    localStorage.setItem("ctut_student_proofs", JSON.stringify([newProof, ...allProofs]));

    setSuccessInfo({
      eventTitle: matchedEvent.title,
      points: newProof.points,
      code: newProof.categoryCode,
    });
    setQrCodeInput("");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
        <div className="text-center mb-6">
          <img src="/logo-doankhoa.png" alt="Logo" className="h-12 mx-auto object-contain mb-3" />
          <h1 className="text-xl font-black text-[#004A52]">QUÉT MÃ QR ĐIỂM DANH</h1>
          <p className="text-xs text-slate-500 mt-1">Đoàn Khoa Kỹ thuật Cơ khí CTUET</p>
        </div>

        {/* THÔNG TIN SINH VIÊN */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs mb-4">
          <p>👤 Sinh viên: <strong>{currentUser?.fullName}</strong></p>
          <p className="text-slate-500 font-mono">MSSV: {currentUser?.mssv} • Lớp: {currentUser?.studentClass}</p>
          <p className="text-[11px] text-teal-700 font-semibold mt-1">📍 {gpsStatus}</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {successInfo && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl space-y-1">
            <p className="font-bold text-sm">✓ Điểm danh thành công!</p>
            <p>Sự kiện: <strong>{successInfo.eventTitle}</strong></p>
            <p>Đã tự động cộng <strong>+{successInfo.points} Điểm</strong> vào mục <strong>{successInfo.code}</strong> trong Cổng ĐRL.</p>
          </div>
        )}

        <form onSubmit={handleCheckin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nhập mã QR hoặc Quét từ Camera *</label>
            <input
              type="text"
              required
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
              placeholder="VD: ev-1 hoặc tên sự kiện..."
              className="w-full border border-slate-300 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-[#007A87]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#007A87] hover:bg-[#00606B] text-white font-black py-3 rounded-2xl transition shadow text-xs uppercase"
          >
            Xác nhận điểm danh
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/tra-cuu" className="text-xs font-bold text-[#EE6425] hover:underline">
            → Xem minh chứng tại Cổng ĐRL
          </Link>
        </div>
      </div>
    </main>
  );
}

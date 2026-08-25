"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Tọa độ ghim tại trường ĐH Kỹ thuật - Công nghệ Cần Thơ (CTUET)
const CTUET_COORDS = { lat: 10.0469, lng: 105.7681 };

function getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function DiemDanhPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [qrCodeInput, setQrCodeInput] = useState("");
  const [useGpsCheck, setUseGpsCheck] = useState(false);
  const [gpsDistance, setGpsDistance] = useState<number | null>(null);
  const [gpsStatusText, setGpsStatusText] = useState("Chế độ: Điểm danh tự do (Bỏ qua GPS)");
  const [successInfo, setSuccessInfo] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/diem-danh");
      return;
    }
    setCurrentUser(JSON.parse(userStr));
  }, [router]);

  const handleToggleGps = (enable: boolean) => {
    setUseGpsCheck(enable);
    if (enable) {
      if (navigator.geolocation) {
        setGpsStatusText("Đang định vị tọa độ GPS...");
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const dist = getDistanceFromLatLonInMeters(
              pos.coords.latitude,
              pos.coords.longitude,
              CTUET_COORDS.lat,
              CTUET_COORDS.lng
            );
            setGpsDistance(dist);
            if (dist <= 200) {
              setGpsStatusText(`Vị trí hợp lệ (~${dist}m so với hội trường)`);
            } else {
              setGpsStatusText(`Bạn đang cách sự kiện ~${dist}m (Ngoài bán kính 200m)`);
            }
          },
          () => {
            setGpsStatusText("Không lấy được GPS. Đã chuyển sang Bỏ qua GPS.");
            setUseGpsCheck(false);
          }
        );
      }
    } else {
      setGpsStatusText("Chế độ: Điểm danh tự do (Bỏ qua GPS)");
    }
  };

  // THỰC HIỆN ĐIỂM DANH KHI QUÉT MÃ QR
  const handleCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessInfo(null);

    const checkCode = qrCodeInput.trim();
    if (!checkCode) return setErrorMsg("Vui lòng nhập hoặc quét mã QR sự kiện!");

    // 1. Tìm thông tin sự kiện do Admin đã tạo
    const allEvents = JSON.parse(localStorage.getItem("ctut_custom_events") || "[]");
    const matchedEvent = allEvents.find(
      (ev: any) => ev.id === checkCode || ev.title.toLowerCase().includes(checkCode.toLowerCase())
    );

    if (!matchedEvent) {
      return setErrorMsg("Mã QR sự kiện không hợp lệ hoặc sự kiện này chưa được Admin bật điểm danh!");
    }

    // 2. Kiểm tra sinh viên có trong danh sách đăng ký hay không
    const allRegistrations = JSON.parse(localStorage.getItem("ctut_event_registrations") || "[]");
    const isRegistered = allRegistrations.some(
      (r: any) => r.mssv === currentUser.mssv && (r.eventTitle === matchedEvent.title || r.eventTitle.includes(matchedEvent.title))
    );

    if (!isRegistered) {
      return setErrorMsg(
        `Bạn chưa đăng ký tham gia sự kiện "${matchedEvent.title}"! Vui lòng đăng ký trước khi điểm danh.`
      );
    }

    // 3. Kiểm tra khoảng cách GPS (nếu bật)
    if (useGpsCheck && gpsDistance !== null && gpsDistance > 200) {
      return setErrorMsg(`Bạn đang ở cách sự kiện ${gpsDistance}m (vượt quá bán kính cho phép 200m)!`);
    }

    // 4. Kiểm tra đã điểm danh chưa
    const allProofs = JSON.parse(localStorage.getItem("ctut_student_proofs") || "[]");
    const alreadyCheckedIn = allProofs.some(
      (p: any) => p.mssv === currentUser.mssv && p.title.includes(matchedEvent.title)
    );

    if (alreadyCheckedIn) {
      return setErrorMsg(`Bạn đã được điểm danh sự kiện "${matchedEvent.title}" trước đó rồi!`);
    }

    // 5. Tự động chuyển minh chứng và cộng điểm vào Cổng ĐRL
    const newProof = {
      id: "proof-" + Date.now().toString(),
      mssv: currentUser.mssv,
      fullName: currentUser.fullName,
      title: `Được điểm danh hoạt động Tại sự kiện "${matchedEvent.title}"`,
      categoryCode: matchedEvent.categoryCode || "III.8",
      points: Number(matchedEvent.points) || 4,
      source: "Điểm danh QR",
      status: "Đã duyệt",
      createdAt: new Date().toLocaleDateString("vi-VN"),
    };

    localStorage.setItem("ctut_student_proofs", JSON.stringify([newProof, ...allProofs]));

    setSuccessInfo({
      eventTitle: matchedEvent.title,
      points: newProof.points,
      code: newProof.categoryCode,
    });
    setQrCodeInput("");
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans antialiased">
      <div className="max-w-lg mx-auto bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
        
        {/* HEADER */}
        <div className="text-center mb-6">
          <Link href="/">
            <img src="/logo-doankhoa.png" alt="Logo" className="h-12 mx-auto object-contain mb-3 cursor-pointer" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-[#004A52]">QUÉT MÃ QR ĐIỂM DANH</h1>
          <p className="text-xs text-slate-500 mt-1">Đoàn Khoa Kỹ thuật Cơ khí, Trường Đại học Kỹ thuật - Công nghệ Cần Thơ</p>
        </div>

        {/* THÔNG TIN SINH VIÊN */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs mb-5 space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-500">Sinh viên:</span>
            <strong className="text-[#004A52]">{currentUser?.fullName}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">MSSV / Lớp:</span>
            <span className="font-mono font-bold text-slate-700">{currentUser?.mssv} • {currentUser?.studentClass || "Khoa Cơ Khí"}</span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-200 text-[11px]">
            <span className="text-slate-400">Định vị GPS:</span>
            <span className="text-[#EE6425] font-semibold">{gpsStatusText}</span>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {successInfo && (
          <div className="mb-5 p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-sm">
              <span>✓</span> Điểm danh thành công!
            </div>
            <p>Sự kiện: <strong>{successInfo.eventTitle}</strong></p>
            <p className="text-emerald-800">
              Đã tự động cộng <strong>+{successInfo.points} Điểm</strong> tại <strong>Mục {successInfo.code}</strong> trong Cổng ĐRL.
            </p>
            <Link href="/tra-cuu" className="inline-block font-bold text-[#007A87] hover:underline pt-1">
              → Xem minh chứng tại Cổng ĐRL
            </Link>
          </div>
        )}

        {/* FORM NHẬP / QUÉT MÃ QR */}
        <form onSubmit={handleCheckinSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nhập mã sự kiện trên máy chiếu (hoặc quét mã QR) *
            </label>
            <input
              type="text"
              required
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
              placeholder="VD: ev-1740000000000..."
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-xs font-mono outline-none focus:border-[#007A87]"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-700">Bật kiểm tra khoảng cách GPS (200m)</span>
            <input
              type="checkbox"
              checked={useGpsCheck}
              onChange={(e) => handleToggleGps(e.target.checked)}
              className="w-4 h-4 accent-[#007A87] cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#007A87] hover:bg-[#00606B] text-white font-extrabold py-3.5 rounded-2xl transition shadow-md uppercase text-xs tracking-wider"
          >
            XÁC NHẬN ĐIỂM DANH
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-xs font-bold text-[#007A87]">
          <Link href="/dang-ky" className="hover:underline">← Xem danh sách sự kiện</Link>
          <Link href="/tra-cuu" className="hover:underline">Cổng ĐRL →</Link>
        </div>
      </div>
    </main>
  );
}

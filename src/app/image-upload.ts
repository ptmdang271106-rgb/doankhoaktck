"use server";

import { createHash, randomUUID } from "node:crypto";
import { hasUploadSession, startUploadSession } from "@/lib/upload-session";
import { supabase } from "@/lib/supabase";
import qrcode from "qrcode-generator";

function signatureFor(params: Record<string, string>, secret: string) {
  const canonical = Object.entries(params).sort(([a], [b]) => a.localeCompare(b))
    .map(([name, value]) => `${name}=${value}`).join("&");
  return createHash("sha256").update(canonical + secret).digest("hex");
}

export async function signUpload(kind: "image" | "pdf") {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret) {
    return { error: "Máy chủ chưa cấu hình Cloudinary." } as const;
  }
  if (!(await hasUploadSession(secret))) {
    await startUploadSession();
  }

  const params = {
    allowed_formats: kind === "pdf" ? "pdf" : "jpg,jpeg,png,webp,gif,avif,heic,heif,bmp,tiff,ico",
    overwrite: "false",
    public_id: `doankhoaktck/${randomUUID()}`,
    timestamp: String(Math.floor(Date.now() / 1000)),
  };
  const signature = signatureFor(params, secret);
  return { cloudName, fields: { ...params, api_key: apiKey, signature } } as const;
}

export async function getEventQr(id: string) {
  const secret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  if (!secret || !cloudName || !apiKey) {
    return { error: "Vui lòng kiểm tra cấu hình Cloudinary." };
  }
  if (!(await hasUploadSession(secret))) {
    await startUploadSession();
  }
  if (typeof id !== "string" || !/^[\w-]{1,128}$/.test(id)) return { error: "Mã sự kiện không hợp lệ." };
  const { data } = await supabase.from("events").select("id").eq("id", id).maybeSingle();
  if (!data) return { error: "Không tìm thấy sự kiện." };
  const qr = qrcode(0, "M");
  qr.addData(id);
  qr.make();
  const params = { overwrite: "false", public_id: `doankhoaktck/qr/${id}`, timestamp: String(Math.floor(Date.now()/1000)) };
  const body = new URLSearchParams({ ...params, signature: signatureFor(params, secret), api_key: apiKey, file: qr.createDataURL(8) });
  const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, { method: "POST", body });
  const result = await response.json();
  if (!response.ok || !result.secure_url) return { error: "Không lưu được mã QR trên Cloudinary." };
  return { url: String(result.secure_url) };
}

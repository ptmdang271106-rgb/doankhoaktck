import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "ctut_image_session";
const lifetime = 7 * 24 * 60 * 60;

function sessionSignature(expires: string, secret: string) {
  return createHmac("sha256", secret).update(`ctut-image-session:${expires}`).digest("hex");
}

export async function startUploadSession() {
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!secret) return;
  const expires = String(Math.floor(Date.now() / 1000) + lifetime);
  (await cookies()).set(cookieName, `${expires}.${sessionSignature(expires, secret)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: lifetime,
  });
}

export async function hasUploadSession(secret: string) {
  const token = (await cookies()).get(cookieName)?.value;
  const match = token?.match(/^(\d+)\.([a-f0-9]{64})$/);
  if (!match || Number(match[1]) <= Date.now() / 1000) return false;
  return timingSafeEqual(Buffer.from(match[2], "hex"), Buffer.from(sessionSignature(match[1], secret), "hex"));
}

export async function clearUploadSession() {
  (await cookies()).delete(cookieName);
}

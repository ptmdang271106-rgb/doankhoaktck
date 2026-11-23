import { signUpload } from "@/app/image-upload";

export async function uploadImage(image: Blob): Promise<string> {
  if (!image.type.startsWith("image/")) {
    throw new Error("Vui lòng chọn tệp hình ảnh.");
  }

  return uploadFile(image, "image");
}

export async function uploadProofFile(file: File): Promise<string> {
  if (file.type.startsWith("image/")) return uploadImage(file);
  if (file.type === "application/pdf" || (!file.type && /\.pdf$/i.test(file.name))) {
    return uploadFile(file, "pdf");
  }
  throw new Error("Vui lòng chọn ảnh hoặc tệp PDF.");
}

export async function storeRemoteImage(url: string): Promise<string> {
  if (/^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(url)) return url;
  if (!/^https?:\/\//i.test(url)) throw new Error("Đường dẫn ảnh không hợp lệ.");
  return uploadFile(url, "image");
}

async function uploadFile(file: Blob | string, kind: "image" | "pdf"): Promise<string> {
  const signed = await signUpload(kind);
  if (signed.error) throw new Error(signed.error);

  const body = new FormData();
  body.append("file", file);
  for (const [name, value] of Object.entries(signed.fields)) body.append(name, value);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signed.cloudName)}/image/upload`,
    { method: "POST", body },
  );
  const result = await response.json().catch(() => null);
  if (!response.ok || typeof result?.secure_url !== "string" || !result.secure_url.startsWith("https://")) {
    throw new Error(result?.error?.message || "Không tải được tệp lên Cloudinary. Vui lòng thử lại.");
  }
  return result.secure_url;
}

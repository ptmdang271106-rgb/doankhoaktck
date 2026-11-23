import { removeVietnameseTones } from "./student-search";

export function generateCtuetEmail(fullName: string, mssv: string): string {
  if (!fullName || !mssv) return "";
  const cleanName = removeVietnameseTones(fullName).toLowerCase();
  const cleanMssv = mssv.trim().toLowerCase();
  const parts = cleanName.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return `${parts[0]}${cleanMssv}@student.ctuet.edu.vn`;

  const initials = parts.slice(0, -1).map((p) => p[0]).join("");
  const lastName = parts[parts.length - 1];

  return `${initials}${lastName}${cleanMssv}@student.ctuet.edu.vn`;
}

import React from "react";

export type DRLStatusType = "Chưa nộp" | "Đã nộp" | "Đã duyệt";

export function getDRLStatus(submission: any): DRLStatusType {
  if (!submission) return "Chưa nộp";
  const st = String(submission.status || "").toLowerCase().trim();
  if (
    st === "đã duyệt" ||
    st.includes("đã duyệt") ||
    st.includes("công bố") ||
    (submission.final_score !== null &&
      submission.final_score !== undefined &&
      submission.final_score !== "")
  ) {
    return "Đã duyệt";
  }
  if (!st || st === "chưa nộp") return "Chưa nộp";
  return "Đã nộp";
}

export function DRLStatusBadge({
  status,
  size = "md",
}: {
  status: DRLStatusType | string;
  size?: "sm" | "md" | "lg";
}) {
  const norm =
    status === "Đã duyệt" || String(status).toLowerCase().includes("duyệt")
      ? "Đã duyệt"
      : status === "Đã nộp" || String(status).toLowerCase().includes("nộp")
      ? "Đã nộp"
      : "Chưa nộp";

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-xs sm:text-sm",
  }[size];

  if (norm === "Đã duyệt") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs whitespace-nowrap ${sizeClasses}`}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        Đã duyệt
      </span>
    );
  }

  if (norm === "Đã nộp") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300 shadow-2xs whitespace-nowrap ${sizeClasses}`}
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        Đã nộp
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-300 shadow-2xs whitespace-nowrap ${sizeClasses}`}
    >
      <span className="w-2 h-2 rounded-full bg-slate-400"></span>
      Chưa nộp
    </span>
  );
}

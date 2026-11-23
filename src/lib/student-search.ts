export function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").replace(/[^a-zA-Z0-9\s]/g, "").trim();
}

export function searchStudents<T extends { full_name?: string; mssv?: string }>(students: T[], query: string): T[] {
  const normalize = (value: string) => removeVietnameseTones(value).toLowerCase().replace(/\s+/g, " ");
  const term = normalize(query);
  if (!term) return students;
  return students.filter(student =>
    normalize(student.full_name || "").includes(term) || normalize(student.mssv || "").includes(term)
  );
}

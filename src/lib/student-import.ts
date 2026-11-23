export function studentColumns(row: string, className: string): string[] {
  const line = row.trim().replace(/\\$/, "").trimEnd();
  if (/[\t,]/.test(line)) {
    return line.split(/\t|,/).map(cell => cell.trim().replace(/^"|"$/g, ""));
  }
  const match = line.match(/^(\S*\d\S*)\s+(.+)$/u);
  if (!match) return [];
  const name = match[2].normalize("NFC").replace(/\s+/g, " ").trim();
  const suffix = " " + className.normalize("NFC").trim().replace(/\s+/g, " ");
  const fullName = name.toLocaleLowerCase("vi").endsWith(suffix.toLocaleLowerCase("vi"))
    ? name.slice(0, -suffix.length)
    : name;
  return [match[1], fullName];
}

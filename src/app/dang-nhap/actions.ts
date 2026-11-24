"use server";

import { supabase } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";
import { generateCtuetEmail } from "@/lib/student-email";
import { clearUploadSession, startUploadSession } from "@/lib/upload-session";

function authenticateAdmin(username: string, password: string) {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (
    !adminUsername ||
    !adminPassword ||
    typeof username !== "string" ||
    username.toLowerCase() !== adminUsername.toLowerCase() ||
    password !== adminPassword
  ) {
    return null;
  }

  return {
    mssv: adminUsername.toUpperCase(),
    username: adminUsername,
    fullName: "Ban Chấp hành Đoàn Khoa (Admin Tối Cao)",
    studentClass: "Đoàn Khoa Cơ Khí",
    role: "super_admin",
  };
}

export async function loginWithPassword(username: string, password: string, role: "admin" | "student") {
  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return { error: "Vui lòng nhập tài khoản và mật khẩu." };
  }
  if (role === "admin") {
    let user = authenticateAdmin(username, password);
    if (!user) {
      const adminUsername = process.env.ADMIN_USERNAME;
      if (adminUsername && username.toLowerCase() === adminUsername.toLowerCase()) {
        const { data: settingData } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "admin_custom_password")
          .maybeSingle();
        if (settingData?.value && settingData.value === password) {
          user = {
            mssv: adminUsername.toUpperCase(),
            username: adminUsername,
            fullName: "Ban Chấp hành Đoàn Khoa (Admin Tối Cao)",
            studentClass: "Đoàn Khoa Cơ Khí",
            role: "super_admin",
          };
        }
      }
    }
    if (!user) {
      const { data } = await supabase.from("branch_officers").select("username,full_name,branch_class")
        .eq("username", username).eq("password", password).maybeSingle();
      if (!data) return { error: "Tài khoản hoặc mật khẩu Quản trị viên / Cán bộ không chính xác." };
      user = {
        username: data.username, mssv: data.username.toUpperCase(),
        fullName: data.full_name, studentClass: data.branch_class, role: "branch_admin",
      };
    }
    await startUploadSession();
    return { user };
  }

  const query = supabase.from("students").select("mssv,full_name,student_class,email,password");
  const { data } = await (username.includes("@")
    ? query.ilike("email", username.replace(/[\\%_]/g, "\\$&"))
    : query.eq("mssv", username.toUpperCase())).maybeSingle();
  if (!data) return { error: "Mã số sinh viên hoặc Email chưa có trong danh sách được cấp quyền." };
  if (password !== data.password && password !== data.mssv.slice(-3)) {
    return { error: "Mật khẩu không chính xác. Mặc định là 3 số cuối MSSV." };
  }

  await startUploadSession();
  return { user: { mssv: data.mssv, fullName: data.full_name, studentClass: data.student_class, email: data.email, role: "student" } };
}

export async function loginWithGoogleSession(accessToken: string) {
  if (typeof accessToken !== "string" || !accessToken) return null;
  const { data: { user } } = await supabase.auth.getUser(accessToken);
  const email = user?.email?.toLowerCase().trim();
  if (!email || !user?.email_confirmed_at) return null;
  const pubKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const studentDb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, pubKey, {
    accessToken: async () => accessToken,
  });
  const columns = "mssv,full_name,student_class,email";
  const { data: byEmail } = await studentDb.from("students").select(columns)
    .ilike("email", email.replace(/[\\%_]/g, "\\$&")).maybeSingle();
  let student = byEmail;
  if (!student) {
    const mssv = email.match(/(cncd|cndt|tdh|ck|cd)\d+(?=@student\.ctuet\.edu\.vn$)/i)?.[0].toUpperCase();
    if (!mssv) return null;
    const { data } = await studentDb.from("students").select(columns).eq("mssv", mssv).maybeSingle();
    if (data && !data.email?.trim() && generateCtuetEmail(data.full_name, data.mssv) === email) student = data;
  }
  if (!student) return null;
  await startUploadSession();
  return { mssv: student.mssv, fullName: student.full_name, studentClass: student.student_class, email: student.email || email, role: "student" };
}

export async function endImageSession() {
  await clearUploadSession();
}

export async function changeUserPassword(params: {
  usernameOrMssv: string;
  role: string;
  currentPassword: string;
  newPassword: string;
}) {
  const { usernameOrMssv, role, currentPassword, newPassword } = params;
  if (!usernameOrMssv || !currentPassword || !newPassword) {
    return { error: "Vui lòng điền đầy đủ mật khẩu hiện tại và mật khẩu mới." };
  }
  if (newPassword.length < 4) {
    return { error: "Mật khẩu mới phải có ít nhất 4 ký tự." };
  }

  // 1. Cán bộ Chi đoàn
  if (role === "branch_admin") {
    const { data, error } = await supabase
      .from("branch_officers")
      .select("id, password")
      .eq("username", usernameOrMssv)
      .maybeSingle();

    if (error || !data) {
      return { error: "Không tìm thấy thông tin tài khoản cán bộ chi đoàn." };
    }
    if (data.password !== currentPassword) {
      return { error: "Mật khẩu hiện tại không chính xác." };
    }

    const { error: updateError } = await supabase
      .from("branch_officers")
      .update({ password: newPassword })
      .eq("username", usernameOrMssv);

    if (updateError) {
      return { error: "Lỗi cập nhật mật khẩu: " + updateError.message };
    }
    return { success: true, message: "Đổi mật khẩu Chi đoàn thành công!" };
  }

  // 2. Sinh viên
  if (role === "student") {
    const { data, error } = await supabase
      .from("students")
      .select("mssv, password")
      .eq("mssv", usernameOrMssv.toUpperCase())
      .maybeSingle();

    if (error || !data) {
      return { error: "Không tìm thấy thông tin sinh viên." };
    }
    const defaultPass = data.mssv.slice(-3);
    const isValid = data.password ? data.password === currentPassword : currentPassword === defaultPass;
    if (!isValid) {
      return { error: "Mật khẩu hiện tại không chính xác." };
    }

    const { error: updateError } = await supabase
      .from("students")
      .update({ password: newPassword })
      .eq("mssv", usernameOrMssv.toUpperCase());

    if (updateError) {
      return { error: "Lỗi cập nhật mật khẩu: " + updateError.message };
    }
    return { success: true, message: "Đổi mật khẩu sinh viên thành công!" };
  }

  // 3. Admin Tối Cao
  if (role === "super_admin") {
    const adminPass = process.env.ADMIN_PASSWORD;
    const { data: settingData } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "admin_custom_password")
      .maybeSingle();

    const expectedPass = settingData?.value || adminPass;
    if (currentPassword !== expectedPass) {
      return { error: "Mật khẩu quản trị hiện tại không chính xác." };
    }

    const { error: settingError } = await supabase
      .from("site_settings")
      .upsert(
        [{ key: "admin_custom_password", value: newPassword, updated_at: new Date().toISOString() }],
        { onConflict: "key" }
      );

    if (settingError) {
      return { error: "Lỗi cập nhật mật khẩu quản trị: " + settingError.message };
    }
    return { success: true, message: "Đổi mật khẩu Admin thành công!" };
  }

  return { error: "Vai trò không hợp lệ." };
}

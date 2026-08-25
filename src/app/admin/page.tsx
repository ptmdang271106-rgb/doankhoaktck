"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"posts" | "students">("posts");
  const [students, setStudents] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  // State form sinh viên
  const [newMssv, setNewMssv] = useState("");
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("");
  const [newPass, setNewPass] = useState("123456");

  // State form bài viết
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Phong trào");
  const [postCoverImage, setPostCoverImage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/admin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang quản trị!");
      router.push("/");
      return;
    }

    setStudents(JSON.parse(localStorage.getItem("ctut_student_accounts") || "[]"));
    setPosts(JSON.parse(localStorage.getItem("ctut_custom_posts") || "[]"));
  }, [router]);

  // Chọn ảnh bìa 16:9 từ máy tính
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPostCoverImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Chèn ảnh vào trong nội dung bài viết
  const handleInsertBodyImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        document.execCommand("insertImage", false, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = editorRef.current ? editorRef.current.innerHTML : "";

    const newPost = {
      id: Date.now().toString(),
      title: postTitle,
      category: postCategory,
      coverImage: postCoverImage || "",
      contentHtml: contentHtml,
      content: editorRef.current ? editorRef.current.innerText : "",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem("ctut_custom_posts", JSON.stringify(updated));

    setPostTitle("");
    setPostCoverImage("");
    if (editorRef.current) editorRef.current.innerHTML = "";
    alert("Đăng bài viết mới kèm ảnh thành công!");
  };

  const handleDeletePost = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa bài viết này?")) {
      const updated = posts.filter((p) => p.id !== id);
      setPosts(updated);
      localStorage.setItem("ctut_custom_posts", JSON.stringify(updated));
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [
      ...students,
      {
        mssv: newMssv.trim(),
        fullName: newName.trim(),
        studentClass: newClass.trim(),
        password: newPass,
        createdAt: new Date().toLocaleDateString("vi-VN"),
      },
    ];
    setStudents(updated);
    localStorage.setItem("ctut_student_accounts", JSON.stringify(updated));
    setNewMssv("");
    setNewName("");
    setNewClass("");
    alert("Cấp tài khoản sinh viên thành công!");
  };

  const handleDeleteStudent = (mssvToDelete: string) => {
    if (confirm(`Bạn có chắc muốn xóa sinh viên MSSV ${mssvToDelete}?`)) {
      const updated = students.filter((s) => s.mssv !== mssvToDelete);
      setStudents(updated);
      localStorage.setItem("ctut_student_accounts", JSON.stringify(updated));
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-black text-[#004A52]">BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN</h1>
            <p className="text-xs text-slate-500 mt-0.5">Soạn thảo bài viết & Quản lý tài khoản sinh viên</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">
              ← Về trang chủ
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("ctut_current_user");
                router.push("/");
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "posts"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            📝 Đăng & Quản lý bài viết
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              activeTab === "students"
                ? "bg-[#EE6425] text-white shadow"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            🎓 Quản lý tài khoản Sinh viên ({students.length})
          </button>
        </div>

        {/* TAB 1: BÀI VIẾT */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo bài viết / Hoạt động mới</h2>
              <form onSubmit={handleAddPost} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="VD: Hội nghị Khoa học Cơ khí 2026..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục *</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                  >
                    <option value="Phong trào">Phong trào</option>
                    <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                    <option value="Tổ chức - Đoàn thể">Tổ chức - Đoàn thể</option>
                    <option value="Hội thảo Cơ khí">Hội thảo Cơ khí</option>
                    <option value="Tình nguyện">Tình nguyện</option>
                  </select>
                </div>

                {/* Ô TẢI ẢNH BÌA 16:9 */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    🖼️ Chọn ảnh bìa đại diện (Tỷ lệ 16:9)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-orange-50 file:text-[#EE6425]"
                  />
                  {postCoverImage && (
                    <div className="mt-2 aspect-video w-full rounded-xl overflow-hidden border border-slate-200">
                      <img src={postCoverImage} alt="Ảnh bìa xem trước" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* KHUNG SOẠN THẢO CHÈN HÌNH NHƯ WORD */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi tiết bài viết</label>
                  
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                    <button type="button" onClick={() => formatText("bold")} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 font-black">B</button>
                    <button type="button" onClick={() => formatText("italic")} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 italic">I</button>
                    <button type="button" onClick={() => formatText("underline")} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100 underline">U</button>
                    <button type="button" onClick={() => formatText("formatBlock", "h2")} className="px-2.5 py-1 bg-white border border-slate-200 rounded hover:bg-slate-100">Tiêu đề</button>
                    
                    <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded hover:bg-orange-100 cursor-pointer flex items-center gap-1">
                      📷 Chèn hình ảnh vào bài
                      <input type="file" accept="image/*" onChange={handleInsertBodyImage} className="hidden" />
                    </label>
                  </div>

                  <div
                    ref={editorRef}
                    contentEditable
                    className="w-full min-h-[180px] max-h-[350px] overflow-y-auto border border-t-0 border-slate-300 rounded-b-xl p-4 text-sm outline-none bg-white focus:ring-1 focus:ring-[#EE6425]"
                  ></div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition shadow text-xs uppercase"
                >
                  Xuất bản bài viết
                </button>
              </form>
            </div>

            {/* DANH SÁCH BÀI ĐÃ ĐĂNG */}
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Bài viết đã xuất bản ({posts.length})</h2>
              {posts.length === 0 ? (
                <p className="text-xs text-slate-400">Chưa có bài viết nào được đăng.</p>
              ) : (
                <div className="divide-y divide-slate-100 space-y-4">
                  {posts.map((p) => (
                    <div key={p.id} className="pt-4 first:pt-0 flex gap-4">
                      {p.coverImage ? (
                        <div className="w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200">
                          <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-24 aspect-video rounded-lg bg-teal-700 flex items-center justify-center text-[9px] text-white font-bold flex-shrink-0">
                          CTUT
                        </div>
                      )}
                      <div className="flex-1">
                        <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <h3 className="text-xs font-bold text-slate-800 mt-1 line-clamp-2">{p.title}</h3>
                        <span className="text-[10px] text-slate-400 mt-1 block">Ngày: {p.date}</span>
                        <button
                          onClick={() => handleDeletePost(p.id)}
                          className="text-red-500 hover:text-red-700 text-[11px] font-bold mt-1"
                        >
                          Xóa bài viết
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SINH VIÊN */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Cấp tài khoản sinh viên</h2>
              <form onSubmit={handleAddStudent} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã số sinh viên (MSSV) *</label>
                  <input
                    type="text"
                    required
                    value={newMssv}
                    onChange={(e) => setNewMssv(e.target.value)}
                    placeholder="2200101"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp *</label>
                  <input
                    type="text"
                    required
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    placeholder="CK22A1"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu khởi tạo *</label>
                  <input
                    type="text"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#007A87] hover:bg-[#005a63] text-white font-bold py-2.5 rounded-xl transition shadow text-xs uppercase"
                >
                  Tạo tài khoản
                </button>
              </form>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Danh sách tài khoản sinh viên</h2>
              {students.length === 0 ? (
                <p className="text-xs text-slate-400">Chưa có tài khoản sinh viên nào.</p>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">MSSV</th>
                      <th className="p-3">Họ và tên</th>
                      <th className="p-3">Lớp</th>
                      <th className="p-3">Mật khẩu</th>
                      <th className="p-3 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-[#007A87]">{s.mssv}</td>
                        <td className="p-3 font-medium text-slate-800">{s.fullName}</td>
                        <td className="p-3 text-slate-600">{s.studentClass}</td>
                        <td className="p-3 font-mono text-slate-500">{s.password}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleDeleteStudent(s.mssv)}
                            className="text-red-500 hover:text-red-700 font-bold"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { siteImages } from "@/lib/site-images";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { studentColumns } from "@/lib/student-import";
import { searchStudents } from "@/lib/student-search";
import { generateCtuetEmail } from "@/lib/student-email";
import { ProofLinks } from "@/components/ProofLinks";
import { DRLStatusBadge, getDRLStatus } from "@/components/DRLStatusBadge";
import { storeRemoteImage, uploadImage } from "@/lib/cloudinary";
import { getEventQr } from "@/app/image-upload";
import { eventWithImages, packEventDescription } from "@/lib/event-images";
import { endImageSession } from "@/app/dang-nhap/actions";
import { DRL_SECTIONS_FULL } from "@/lib/drl-criteria";

const EVENT_CRITERIA_OPTIONS = [
  { code: "I.1", label: "I.1 Điểm TB học tập tích lũy thang 4", max: 5 },
  { code: "I.2", label: "I.2 Giấy chứng nhận lớp kỹ năng học tập", max: 3 },
  { code: "I.3", label: "I.3 Hội thảo / Tọa đàm cấp Khoa, Trường", max: 3 },
  { code: "I.4", label: "I.4 Cuộc thi học thuật cấp Khoa / Trường", max: 7 },
  { code: "I.5", label: "I.5 Cuộc thi học thuật ngoài Trường", max: 8 },
  { code: "I.6", label: "I.6 Báo cáo khoa học cấp Khoa", max: 8 },
  { code: "I.7", label: "I.7 Tham gia đề tài NCKH cấp Trường", max: 10 },
  { code: "I.8", label: "I.8 Viết bài báo khoa học", max: 8 },
  { code: "I.9", label: "I.9 Cuộc thi khởi nghiệp cấp Trường", max: 7 },
  { code: "I.10", label: "I.10 Cuộc thi khởi nghiệp ngoài Trường", max: 8 },
  { code: "I.11", label: "I.11 Thành viên CLB học thuật", max: 2 },
  { code: "I.12", label: "I.12 Các hoạt động học thuật khác", max: 3 },
  { code: "II.1", label: "II.1 Ý thức, thái độ trong học tập", max: 5 },
  { code: "II.2", label: "II.2 Chấp hành nội quy, quy chế Trường", max: 5 },
  { code: "II.3", label: "II.3 Chấp hành quy chế thi cử", max: 5 },
  { code: "II.4", label: "II.4 Chấp hành quy định thư viện", max: 5 },
  { code: "II.5", label: "II.5 Chấp hành quy định phòng học, xưởng", max: 5 },
  { code: "II.6", label: "II.6 Thực hiện đăng ký ngoại trú", max: 5 },
  { code: "II.7", label: "II.7 Mặc đồng phục đúng quy định", max: 5 },
  { code: "II.8", label: "II.8 Sinh hoạt lớp với CVHT", max: 5 },
  { code: "III.1", label: "III.1 Hoạt động bắt buộc do Khoa/Trường tổ chức", max: 3 },
  { code: "III.2", label: "III.2 Đại hội Chi đoàn/Chi hội, sinh hoạt Chi đoàn", max: 3 },
  { code: "III.3", label: "III.3 Báo cáo chuyên đề do Trường tổ chức", max: 4 },
  { code: "III.4", label: "III.4 Hoạt động ngoại khóa / Cuộc thi cấp CLB/Khoa/Trường", max: 7 },
  { code: "III.5", label: "III.5 Ngoại khóa / Cuộc thi từ cấp Thành phố trở lên", max: 8 },
  { code: "III.6", label: "III.6 Được kết nạp Đoàn", max: 5 },
  { code: "III.7", label: "III.7 Được kết nạp Đảng", max: 8 },
  { code: "III.8", label: "III.8 Hoạt động phong trào do Đoàn/Hội điều động", max: 4 },
  { code: "III.9", label: "III.9 Thành viên CLB, đội, nhóm Đoàn - Hội", max: 2 },
  { code: "III.10", label: "III.10 Học tập các bài lý luận chính trị", max: 4 },
  { code: "III.11", label: "III.11 Đền ơn đáp nghĩa, Thắp nến tri ân", max: 3 },
  { code: "III.12", label: "III.12 Lao động tình nguyện tại Trường", max: 3 },
  { code: "III.13", label: "III.13 Khen thưởng phong trào cá nhân", max: 7 },
  { code: "III.14", label: "III.14 Tập thể được khen thưởng phong trào", max: 1 },
  { code: "III.15", label: "III.15 Các hoạt động phong trào khác", max: 3 },
  { code: "IV.1", label: "IV.1 Chấp hành pháp luật Nhà nước", max: 10 },
  { code: "IV.2", label: "IV.2 Hành vi tốt, tinh thần sẻ chia, giúp đỡ người yếu thế", max: 5 },
  { code: "IV.3", label: "IV.3 Biểu dương, khen thưởng hoạt động xã hội ngoài trường", max: 5 },
  { code: "IV.4", label: "IV.4 Giao lưu các CLB, Đội, Nhóm trực thuộc", max: 5 },
  { code: "IV.5", label: "IV.5 Chương trình Tư vấn tuyển sinh", max: 5 },
  { code: "IV.6", label: "IV.6 Công tác hỗ trợ nhập học sinh viên mới", max: 5 },
  { code: "IV.7", label: "IV.7 Công tác khám sức khỏe sinh viên", max: 5 },
  { code: "IV.8", label: "IV.8 Công tác tổ chức Ngày hội việc làm", max: 5 },
  { code: "IV.9", label: "IV.9 Công tác tổ chức Lễ Tốt nghiệp", max: 5 },
  { code: "IV.10", label: "IV.10 Công tác kiểm tra hồ sơ sinh viên", max: 5 },
  { code: "IV.11", label: "IV.11 Tham gia các phiên giao dịch việc làm", max: 3 },
  { code: "IV.12", label: "IV.12 Hiến máu tình nguyện", max: 10 },
  { code: "IV.13", label: "IV.13 Chương trình Xuân tình nguyện", max: 5 },
  { code: "IV.14", label: "IV.14 Chiến dịch Tình nguyện Mùa hè xanh", max: 7 },
  { code: "IV.15", label: "IV.15 Chương trình Ngày Chủ nhật xanh", max: 5 },
  { code: "IV.16", label: "IV.16 Chương trình Thứ Bảy tình nguyện", max: 5 },
  { code: "IV.17", label: "IV.17 Chương trình Chào đón tân sinh viên", max: 5 },
  { code: "IV.18", label: "IV.18 Trách nhiệm xã hội và phát triển bền vững", max: 3 },
  { code: "V.1", label: "V.1 Tham gia tích cực phong trào Lớp, Đoàn, Hội", max: 3 },
  { code: "V.2", label: "V.2 Cán bộ Lớp/Đoàn/Hội hoàn thành tốt nhiệm vụ", max: 5 },
  { code: "V.3", label: "V.3 Sinh viên đạt giải học tập, NCKH", max: 7 },
  { code: "V.4", label: "V.4 Bằng khen UBND Tỉnh/Thành phố trở lên", max: 5 },
  { code: "V.5", label: "V.5 Sinh viên 5 Tốt cấp Trường, Đoàn viên tiêu biểu", max: 6 },
  { code: "V.6", label: "V.6 Sinh viên 5 Tốt cấp Thành/Trung ương, Sao Tháng Giêng", max: 10 },
  { code: "V.7", label: "V.7 Đạt danh hiệu Đoàn viên ưu tú", max: 6 },
  { code: "V.8", label: "V.8 Giấy khen tập thể của Đoàn trao tặng", max: 2 },
];


export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<"students" | "officers" | "semesters" | "review" | "events" | "posts" | "about" | "banners">("students");
  
  const [students, setStudents] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);

  // State sinh viên
  const [studentInputMode, setStudentInputMode] = useState<"paste" | "manual" | "file">("paste");
  const [pasteData, setPasteData] = useState("");
  const [manualMssv, setManualMssv] = useState("");
  const [manualFullName, setManualFullName] = useState("");
  const [enrollmentClass, setEnrollmentClass] = useState("");
  const [manualBirthPlace, setManualBirthPlace] = useState("");
  const [manualUnionDate, setManualUnionDate] = useState("");
  const [manualPartyDate, setManualPartyDate] = useState("");
  const [manualSoDoan, setManualSoDoan] = useState("Chưa nộp");
  const [manualChuaKetNap, setManualChuaKetNap] = useState(false);

  // State quản lý Giới thiệu (Đoàn khoa & Liên chi hội)
  const [aboutTargetKey, setAboutTargetKey] = useState("about_doankhoa");
  const aboutEditorRef = useRef<HTMLDivElement>(null);

  // State tài khoản cán bộ
  const [officerUser, setOfficerUser] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerClass, setOfficerClass] = useState("");
  const [officerPass, setOfficerPass] = useState("");

  // State học kỳ
  const [semId, setSemId] = useState("");
  const [semTitle, setSemTitle] = useState("");
  const [semStart, setSemStart] = useState("");
  const [semEnd, setSemEnd] = useState("");

  // State chấm điểm
  const [savedClasses, setSavedClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");
  const [addingClass, setAddingClass] = useState(false);
  const [studentClassFilter, setStudentClassFilter] = useState("");
  const [studentDrlFilter, setStudentDrlFilter] = useState("Tất cả");
  const [studentSearch, setStudentSearch] = useState("");
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [editingMssv, setEditingMssv] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editClass, setEditClass] = useState("");
  const [editSoDoan, setEditSoDoan] = useState("Đã nộp");
  const [editBirthPlace, setEditBirthPlace] = useState("");
  const [editUnionDate, setEditUnionDate] = useState("");
  const [editPartyDate, setEditPartyDate] = useState("");
  const [editChuaKetNap, setEditChuaKetNap] = useState(false);
  const [editDrlStatus, setEditDrlStatus] = useState("Chưa nộp");
  const [editSaving, setEditSaving] = useState(false);

  const [reviewSemester, setReviewSemester] = useState("hk1_2026_2027");
  const [reviewClass, setReviewClass] = useState("");
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("Tất cả");
  const [submissionsMap, setSubmissionsMap] = useState<Record<string, any>>({});
  const reviewRequest = useRef(0);
  const classNames = Array.from(new Set<string>([...savedClasses, ...students.map(s => s.student_class?.trim()).filter(Boolean)]))
    .sort((a, b) => a.localeCompare(b, "vi"));
  const visibleStudents = students.filter(s => {
    const matchClass = !studentClassFilter || s.student_class?.trim() === studentClassFilter;
    const searchLower = studentSearch.trim().toLowerCase();
    const matchSearch = !searchLower ||
      s.mssv?.toLowerCase().includes(searchLower) ||
      s.full_name?.toLowerCase().includes(searchLower);
    const sub = submissionsMap[`${s.mssv}_${reviewSemester}`] || submissionsMap[s.mssv];
    const drlStatus = getDRLStatus(sub);
    const matchDrl = studentDrlFilter === "Tất cả" ||
      (studentDrlFilter === "Đã nộp" ? drlStatus === "Đã nộp" : drlStatus === studentDrlFilter);
    return matchClass && matchSearch && matchDrl;
  });
  const classStudents = searchStudents(students.filter(s => !reviewClass || s.student_class?.trim() === reviewClass), reviewSearch);
  const filteredReviewStudents = classStudents.filter(st => {
    if (reviewStatusFilter === "Tất cả") return true;
    const sub = submissionsMap[`${st.mssv}_${reviewSemester}`] || submissionsMap[st.mssv];
    const stStatus = getDRLStatus(sub);
    return reviewStatusFilter === "Đã nộp" ? stStatus === "Đã nộp" : stStatus === reviewStatusFilter;
  });
  const chuaNopReviewCount = classStudents.filter(st => {
    const sub = submissionsMap[`${st.mssv}_${reviewSemester}`] || submissionsMap[st.mssv];
    return getDRLStatus(sub) === "Chưa nộp";
  }).length;
  const daNopReviewCount = classStudents.filter(st => {
    const sub = submissionsMap[`${st.mssv}_${reviewSemester}`] || submissionsMap[st.mssv];
    return getDRLStatus(sub) === "Đã nộp";
  }).length;
  const daDuyetReviewCount = classStudents.filter(st => {
    const sub = submissionsMap[`${st.mssv}_${reviewSemester}`] || submissionsMap[st.mssv];
    return getDRLStatus(sub) === "Đã duyệt";
  }).length;
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentProofs, setStudentProofs] = useState<any[]>([]);
  const [studentSubmission, setStudentSubmission] = useState<any>(null);
  const [officerScores, setOfficerScores] = useState<{ [key: string]: number }>({});

  // State sự kiện
  const [eventTitle, setEventTitle] = useState("");
  const [eventCategory, setEventCategory] = useState("Phong trào");
  const [eventCategoryCode, setEventCategoryCode] = useState("III.8");
  const [eventPoints, setEventPoints] = useState<number>(4);
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("Hội trường A - Trường ĐH Kỹ thuật - Công nghệ Cần Thơ");
  const [eventDeadline, setEventDeadline] = useState("");
  const [eventCoverImage, setEventCoverImage] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const eventEditorRef = useRef<HTMLDivElement>(null);
  const [activeQrEvent, setActiveQrEvent] = useState<any>(null);

  // State bài viết & chuyên mục (Xem gì hôm nay, Bản tin học thuật, Gương sáng FME...)
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Xem gì hôm nay");
  const [postCoverImage, setPostCoverImage] = useState("");
  const [editingPostId, setEditingPostId] = useState<number | string | null>(null);
  const [postFilterCategory, setPostFilterCategory] = useState("Tất cả");
  const [postSearch, setPostSearch] = useState("");

  // State quản lý Banner trang chủ
  const [banners, setBanners] = useState<any[]>([]);
  const [loadingBanners, setLoadingBanners] = useState(false);
  const [savingBanners, setSavingBanners] = useState(false);
  const [newBannerImage, setNewBannerImage] = useState("");
  const [newBannerTitle, setNewBannerTitle] = useState("");
  const [newBannerLink, setNewBannerLink] = useState("");
  const [uploadingBannerFile, setUploadingBannerFile] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const [savingContent, setSavingContent] = useState(false);
  const previewUrls = useRef(new Set<string>());

  useEffect(() => {
    const urls = previewUrls.current;
    return () => urls.forEach(url => URL.revokeObjectURL(url));
  }, []);

  function releasePreview(url: string) {
    if (previewUrls.current.delete(url)) URL.revokeObjectURL(url);
  }

  function pickImage(input: HTMLInputElement, onPick: (url: string) => void) {
    const file = input.files?.[0];
    input.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn tệp hình ảnh.");
      return;
    }
    const url = URL.createObjectURL(file);
    previewUrls.current.add(url);
    onPick(url);
  }

  function insertImage(input: HTMLInputElement, editor: HTMLDivElement | null) {
    if (!editor) return;
    pickImage(input, url => {
      const image = document.createElement("img");
      image.src = url;
      image.style.maxWidth = "100%";
      image.style.borderRadius = "12px";
      image.style.margin = "10px 0";
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      if (range && editor.contains(range.commonAncestorContainer)) {
        range.deleteContents();
        range.insertNode(image);
        range.setStartAfter(image);
        range.collapse(true);
      } else {
        editor.appendChild(image);
      }
    });
  }

  async function publishImage(src: string) {
    if (!src) return "";
    if (!src.startsWith("blob:") && !src.startsWith("data:image/")) return storeRemoteImage(src);
    const response = await fetch(src);
    if (!response.ok) throw new Error("Không đọc được ảnh đã chọn.");
    return uploadImage(await response.blob());
  }

  async function publishEditorImages(editor: HTMLDivElement | null) {
    if (!editor) return "";
    for (const image of editor.querySelectorAll<HTMLImageElement>("img[src]")) {
      const preview = image.currentSrc || image.src;
      image.src = await publishImage(preview);
      image.removeAttribute("srcset");
      image.closest("picture")?.querySelectorAll("source").forEach(source => source.remove());
      releasePreview(preview);
    }
    return editor.innerHTML;
  }

  async function saveContent(e: React.FormEvent, save: () => Promise<void>) {
    e.preventDefault();
    if (savingContent) return;
    setSavingContent(true);
    try {
      await save();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không lưu được nội dung. Vui lòng thử lại.");
    } finally {
      setSavingContent(false);
    }
  }

  const fetchAllData = async () => {
    const { data: stdData } = await supabase.from("students").select("*").order("id", { ascending: false });
    if (stdData) {
      setStudents(stdData);
    }

    const { data: offData } = await supabase.from("branch_officers").select("*").order("id", { ascending: false });
    if (offData) setOfficers(offData);

    const { data: postData } = await supabase.from("posts").select("*").order("id", { ascending: false });
    if (postData) setPosts(postData);

    const { data: evData } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (evData) setEvents(evData.map(eventWithImages));

    const { data: semData } = await supabase.from("drl_semesters").select("*").order("created_at", { ascending: false });
    if (semData) setSemesters(semData);

    const { data: subData } = await supabase.from("drl_submissions").select("mssv,semester_id,status,final_score,self_score");
    if (subData) {
      const map: Record<string, any> = {};
      subData.forEach((sub: any) => {
        map[`${sub.mssv}_${sub.semester_id}`] = sub;
        map[sub.mssv] = sub;
      });
      setSubmissionsMap(map);
    }
  };

  async function addClass(e: React.FormEvent) {
    e.preventDefault();
    const name = newClass.trim().replace(/\s+/g, " ").normalize("NFC");
    if (!name || addingClass) return;
    if (classNames.some(c => c.localeCompare(name, "vi", { sensitivity: "accent" }) === 0)) {
      alert("Lớp này đã có trong danh sách.");
      return;
    }
    setAddingClass(true);
    try {
      const { error } = await supabase.from("site_settings").insert({
        key: "class:" + name.toLocaleLowerCase("vi"), value: name, updated_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.code === "23505" ? "Lớp này đã tồn tại." : error.message);
      setSavedClasses(prev => [...prev, name]);
      setStudentClassFilter(name);
      setEnrollmentClass(name);
      setNewClass("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Không thêm được lớp.");
    } finally {
      setAddingClass(false);
    }
  }

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/admin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role === "branch_admin") {
      router.replace("/admin/chi-doan");
      return;
    }
    if (user.role !== "super_admin" && user.role !== "admin") {
      router.replace("/");
      return;
    }
    setCurrentUser(user);
    setAuthChecked(true);
    supabase.from("site_settings").select("value").like("key", "class:%").then(({ data, error }) => {
      if (error) alert("Không tải được danh sách lớp: " + error.message);
      if (data) setSavedClasses(prev => [...new Set([...prev, ...data.map(row => row.value)])]);
    });
    fetchAllData();
  }, [router]);

  // Khi thay đổi tab Đoàn khoa / Liên chi hội thì load lại dữ liệu tương ứng
  useEffect(() => {
    if (activeTab !== "about") return;
    const controller = new AbortController();
    supabase.from("site_settings").select("value").eq("key", aboutTargetKey)
      .abortSignal(controller.signal).maybeSingle().then(({ data }) => {
        if (!controller.signal.aborted && aboutEditorRef.current) {
          aboutEditorRef.current.innerHTML = data?.value || "";
        }
      });
    return () => controller.abort();
  }, [activeTab, aboutTargetKey]);

  const handleSaveAboutUs = async () => {
    const html = await publishEditorImages(aboutEditorRef.current);
    
    const { data: existing } = await supabase.from("site_settings").select("*").eq("key", aboutTargetKey).maybeSingle();

    let error;
    if (existing) {
      const res = await supabase.from("site_settings").update({ value: html, updated_at: new Date().toISOString() }).eq("key", aboutTargetKey);
      error = res.error;
    } else {
      const res = await supabase.from("site_settings").insert([{ key: aboutTargetKey, value: html, updated_at: new Date().toISOString() }]);
      error = res.error;
    }

    if (error) {
      alert("Lỗi lưu nội dung: " + error.message);
    } else {
      alert(`Đã lưu nội dung ${aboutTargetKey === "about_lienchihoi" ? "Liên chi hội KTCK" : "Đoàn khoa KTCK"} thành công!`);
    }
  };

  useEffect(() => {
    async function loadBanners() {
      setLoadingBanners(true);
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "site:banners")
          .maybeSingle();

        if (data?.value) {
          const parsed = JSON.parse(data.value);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBanners(parsed);
            return;
          }
        }
        setBanners([
          {
            id: "default-1",
            image: siteImages.banner,
            title: "Chương trình Chào đón Tân sinh viên Khóa 2026",
            link: "/dang-ky",
          },
        ]);
      } catch (e) {
        console.error("Lỗi tải banners:", e);
      } finally {
        setLoadingBanners(false);
      }
    }
    loadBanners();
  }, []);

  const handleSaveBannersToDb = async (newBanners: any[]) => {
    setSavingBanners(true);
    try {
      const payload = {
        key: "site:banners",
        value: JSON.stringify(newBanners),
        updated_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("site_settings")
        .upsert([payload], { onConflict: "key" });
      if (error) throw new Error(error.message);
      setBanners(newBanners);
      alert("Đã cập nhật danh sách banner thành công!");
    } catch (err: any) {
      alert("Lỗi lưu banner: " + (err.message || "Thất bại"));
    } finally {
      setSavingBanners(false);
    }
  };

  const handleAddOrEditBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerImage.trim()) {
      alert("Vui lòng tải lên ảnh hoặc nhập URL hình ảnh.");
      return;
    }

    if (editingBannerId) {
      const updated = banners.map((b) =>
        b.id === editingBannerId
          ? {
              ...b,
              image: newBannerImage.trim(),
              title: newBannerTitle.trim(),
              link: newBannerLink.trim(),
            }
          : b
      );
      await handleSaveBannersToDb(updated);
      setEditingBannerId(null);
    } else {
      const item = {
        id: "banner_" + Date.now(),
        image: newBannerImage.trim(),
        title: newBannerTitle.trim(),
        link: newBannerLink.trim(),
      };
      await handleSaveBannersToDb([...banners, item]);
    }

    setNewBannerImage("");
    setNewBannerTitle("");
    setNewBannerLink("");
  };

  const handleDeleteBanner = async (id: string, title?: string) => {
    if (!confirm(`Bạn có chắc muốn xóa banner "${title || 'này'}" không?`)) return;
    const updated = banners.filter((b) => b.id !== id);
    await handleSaveBannersToDb(updated);
  };

  const handleMoveBanner = async (index: number, dir: "up" | "down") => {
    const targetIdx = dir === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const copy = [...banners];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;
    await handleSaveBannersToDb(copy);
  };

  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBannerFile(true);
    try {
      const url = await uploadImage(file);
      setNewBannerImage(url);
    } catch (err: any) {
      alert("Lỗi tải ảnh lên Cloudinary: " + (err.message || "Thất bại"));
    } finally {
      setUploadingBannerFile(false);
      e.target.value = "";
    }
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerUser.trim() || !officerPass.trim() || !officerName.trim() || !officerClass.trim()) {
      return alert("Vui lòng điền đầy đủ thông tin cán bộ và chọn lớp quản lý!");
    }

    const newOfficer = {
      username: officerUser.trim().toLowerCase(),
      full_name: officerName.trim(),
      branch_class: officerClass.trim(),
      password: officerPass.trim(),
    };

    const { error } = await supabase.from("branch_officers").insert([newOfficer]);
    if (error) {
      alert("Lỗi tạo tài khoản: " + error.message);
    } else {
      alert(`Đã cấp tài khoản cán bộ cho: ${newOfficer.full_name} (Lớp: ${newOfficer.branch_class})`);
      fetchAllData();
      setOfficerUser("");
      setOfficerName("");
      setOfficerClass("");
      setOfficerPass("");
    }
  };

  const handleUpdateOfficerClass = async (id: number, newBranchClass: string) => {
    const trimmed = newBranchClass.trim();
    if (!trimmed) return;
    const { error } = await supabase.from("branch_officers").update({ branch_class: trimmed }).eq("id", id);
    if (error) {
      alert("Lỗi cập nhật lớp quản lý: " + error.message);
      return;
    }
    setOfficers(prev => prev.map(off => (off.id === id ? { ...off, branch_class: trimmed } : off)));
  };

  const handleDeleteOfficer = async (id: number, name: string) => {
    if (confirm(`Xác nhận xóa tài khoản cán bộ: ${name}?`)) {
      await supabase.from("branch_officers").delete().eq("id", id);
      fetchAllData();
    }
  };

  const handleCreateSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!semId.trim() || !semTitle.trim()) return alert("Vui lòng nhập mã và tên học kỳ!");

    const newSem = {
      id: semId.trim(),
      title: semTitle.trim(),
      start_date: semStart || "2026-09-01",
      end_date: semEnd || "2027-01-01",
      is_active: true,
    };

    const { error } = await supabase.from("drl_semesters").upsert([newSem], { onConflict: "id" });
    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Tạo học kỳ thành công!");
      fetchAllData();
      setSemId("");
      setSemTitle("");
    }
  };

  const handleToggleSemesterActive = async (id: string, currentStatus: boolean) => {
    await supabase.from("drl_semesters").update({ is_active: !currentStatus }).eq("id", id);
    fetchAllData();
  };

  const handleSelectStudentForReview = async (st: any) => {
    const request = ++reviewRequest.current;
    setSelectedStudent(null);
    try {
      const { data: proofs } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", st.mssv)
        .eq("semester_id", reviewSemester);

      const { data: sub } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", st.mssv)
        .eq("semester_id", reviewSemester)
        .maybeSingle();

      if (request !== reviewRequest.current) return;
      setSelectedStudent(st);
      setStudentProofs(proofs || []);
      if (sub) {
        setStudentSubmission(sub);
        if (sub.scores_detail) {
          setOfficerScores(sub.scores_detail);
        } else {
          setOfficerScores({});
        }
      } else {
        setStudentSubmission(null);
        setOfficerScores({});
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveProof = async (proofId: string, currentStatus: string) => {
    const request = reviewRequest.current;
    const nextStatus = currentStatus === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt";
    await supabase.from("proofs").update({ status: nextStatus }).eq("id", proofId);
    if (request === reviewRequest.current) handleSelectStudentForReview(selectedStudent);
  };

  const handleDeleteProof = async (proofId: string, title: string) => {
    if (!confirm(`Xác nhận xóa minh chứng "${title}" của sinh viên này?`)) return;
    const request = reviewRequest.current;
    await supabase.from("proofs").delete().eq("id", proofId);
    if (request === reviewRequest.current) handleSelectStudentForReview(selectedStudent);
  };

  const getOfficerSectionScore = (section: any) => {
    const rawSum = section.items.reduce((sum: number, it: any) => sum + (Number(officerScores[it.id]) || 0), 0);
    return Math.min(rawSum, section.maxPoints);
  };

  const grandOfficerTotalScore = DRL_SECTIONS_FULL.reduce((total, sec) => total + getOfficerSectionScore(sec), 0);

  const handleSendFinalScore = async () => {
    const request = reviewRequest.current;
    if (!selectedStudent) return;
    if (!confirm(`Xác nhận gửi bảng điểm rèn luyện chính thức (${grandOfficerTotalScore} điểm) về cho sinh viên ${selectedStudent.full_name}?`)) return;

    try {
      const submissionData = {
        mssv: selectedStudent.mssv,
        student_name: selectedStudent.full_name,
        student_class: selectedStudent.student_class,
        semester_id: reviewSemester,
        self_score: studentSubmission?.self_score || 0,
        final_score: Number(grandOfficerTotalScore),
        scores_detail: officerScores,
        proofs_detail: studentSubmission?.proofs_detail || {},
        status: "Đã duyệt",
      };

      const { error } = await supabase.from("drl_submissions").upsert([submissionData], { onConflict: "mssv,semester_id" });
      if (error) {
        alert("Lỗi khi gửi điểm: " + error.message);
      } else {
        alert("Đã gửi điểm rèn luyện chính thức về cho sinh viên thành công!");
        if (request === reviewRequest.current) handleSelectStudentForReview(selectedStudent);
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  const handleProcessPasteData = async () => {
    if (!enrollmentClass) return alert("Vui lòng chọn lớp trước khi thêm sinh viên.");
    if (!pasteData.trim()) return alert("Vui lòng dán dữ liệu!");
    const rows = pasteData.split(/\r\n|\n/).filter((r) => r.trim() !== "");
    const imported: any[] = [];

    for (const row of rows) {
      const cols = studentColumns(row, enrollmentClass);
      if (/^mssv\b/i.test(row.trim())) continue;
      if (!cols[0] || !cols[1]) return alert("Không đọc được MSSV và họ tên ở dòng: " + row);
      if (cols.length >= 2 && cols[0] && !cols[0].toLowerCase().includes("mssv")) {
        const mssv = cols[0].replace(/\s+/g, "").toUpperCase();
        const full_name = cols[1];
        const birth_place = cols[3] || "Cần Thơ";
        const union_date = cols[4] || "2020-03-26";
        const party_date = cols[5] || "";
        const so_doan = cols[6] || "Đã nộp";
        const chua_ket_nap_doan = cols[7] ? cols[7].toLowerCase() === "true" : false;
        
        const password = mssv.slice(-3);
        const email = generateCtuetEmail(full_name, mssv);

        imported.push({
          mssv,
          full_name,
          email,
          student_class: enrollmentClass,
          password,
          birth_place,
          union_date,
          party_date,
          so_doan,
          chua_ket_nap_doan,
        });
      }
    }

    if (imported.length > 0) {
      const { error } = await supabase.from("students").upsert(imported, { onConflict: "mssv" });
      if (error) {
        alert("Lỗi lưu dữ liệu: " + error.message);
      } else {
        alert(`Đã lưu thành công ${imported.length} sinh viên / Đoàn viên lên hệ thống.`);
        fetchAllData();
        setPasteData("");
      }
    }
  };

  const handleAddManualStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentClass) return alert("Vui lòng chọn lớp trước khi thêm sinh viên.");
    if (!manualMssv.trim() || !manualFullName.trim()) return alert("Vui lòng nhập đầy đủ MSSV và Họ tên!");

    const mssv = manualMssv.trim().toUpperCase();
    const full_name = manualFullName.trim();
    const password = mssv.slice(-3);
    const email = generateCtuetEmail(full_name, mssv);

    const newStudent = {
      mssv,
      full_name,
      email,
      student_class: enrollmentClass,
      password,
      birth_place: manualBirthPlace || "Cần Thơ",
      union_date: manualUnionDate || "2020-03-26",
      party_date: manualPartyDate || "",
      so_doan: manualSoDoan,
      chua_ket_nap_doan: manualChuaKetNap,
    };

    const { error } = await supabase.from("students").upsert([newStudent], { onConflict: "mssv" });
    if (error) {
      alert("Lỗi thêm sinh viên: " + error.message);
    } else {
      alert(`Đã thêm sinh viên ${full_name} (${mssv})`);
      fetchAllData();
      setManualMssv("");
      setManualFullName("");
      setManualBirthPlace("");
      setManualUnionDate("");
      setManualPartyDate("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!enrollmentClass) return alert("Vui lòng chọn lớp trước khi thêm sinh viên.");
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const rows = text.split(/\r\n|\n/).filter((r) => r.trim() !== "");
      const imported: any[] = [];

      for (const row of rows) {
        const cols = studentColumns(row, enrollmentClass);
        if (/^mssv\b/i.test(row.trim())) continue;
        if (!cols[0] || !cols[1]) return alert("Không đọc được MSSV và họ tên ở dòng: " + row);
        if (cols.length >= 2 && cols[0] && !cols[0].toLowerCase().includes("mssv")) {
          const mssv = cols[0].replace(/\s+/g, "").toUpperCase();
          const full_name = cols[1];
          const password = mssv.slice(-3);
          const email = generateCtuetEmail(full_name, mssv);
          imported.push({
            mssv,
            full_name,
            email,
            student_class: enrollmentClass,
            password,
            birth_place: "Cần Thơ",
            union_date: "2020-03-26",
            party_date: "",
            so_doan: "Đã nộp",
            chua_ket_nap_doan: false,
          });
        }
      }

      if (imported.length > 0) {
        const { error } = await supabase.from("students").upsert(imported, { onConflict: "mssv" });
        if (error) return alert("Lỗi lưu danh sách: " + error.message);
        alert(`Đã nạp thành công ${imported.length} sinh viên.`);
        fetchAllData();
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      "MSSV,Họ và tên,Lớp,Nơi sinh,Ngày vào Đoàn,Ngày vào Đảng,Sổ Đoàn,Chưa kết nạp Đoàn\n" +
      "CNDT2411081,Phạm Thái Minh Đăng,CNKT Tự động hóa K2024,Cần Thơ,2020-03-26,,Đã nộp,false\n" +
      "CNDT2411026,Nguyễn Huỳnh Bảo Châu,CNKT Tự động hóa K2024,Vĩnh Long,2020-03-26,,Chưa nộp,false\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Mau_Danh_Sach_Doan_Vien_CTUT.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenEditStudent = (s: any) => {
    setEditingStudent(s);
    setEditFullName(s.full_name || "");
    setEditClass(s.student_class || "");
    setEditSoDoan(s.so_doan || "Đã nộp");
    setEditBirthPlace(s.birth_place || "");
    setEditUnionDate(s.union_date || "");
    setEditPartyDate(s.party_date || "");
    setEditChuaKetNap(Boolean(s.chua_ket_nap_doan));
    const sub = submissionsMap[`${s.mssv}_${reviewSemester}`] || submissionsMap[s.mssv];
    setEditDrlStatus(getDRLStatus(sub));
  };

  const handleStartInlineEdit = (s: any) => {
    setEditingMssv(s.mssv);
    setEditFullName(s.full_name || "");
    setEditClass(s.student_class || "");
    setEditSoDoan(s.so_doan || "Đã nộp");
    setEditBirthPlace(s.birth_place || "");
    setEditUnionDate(s.union_date || "");
    setEditPartyDate(s.party_date || "");
    setEditChuaKetNap(Boolean(s.chua_ket_nap_doan));
    const sub = submissionsMap[`${s.mssv}_${reviewSemester}`] || submissionsMap[s.mssv];
    setEditDrlStatus(getDRLStatus(sub));
  };

  const handleSaveStudentInlineOrModal = async (targetMssv?: string) => {
    const mssv = targetMssv || editingStudent?.mssv;
    if (!mssv) return;
    if (!editFullName.trim()) {
      alert("Vui lòng nhập họ và tên sinh viên.");
      return;
    }
    setEditSaving(true);
    try {
      const updateData = {
        full_name: editFullName.trim(),
        student_class: editClass.trim(),
        so_doan: editSoDoan,
        birth_place: editBirthPlace.trim(),
        union_date: editUnionDate,
        party_date: editPartyDate,
        chua_ket_nap_doan: editChuaKetNap,
      };

      const { error } = await supabase
        .from("students")
        .update(updateData)
        .eq("mssv", mssv);

      if (error) {
        alert("Lỗi khi cập nhật thông tin sinh viên: " + error.message);
        return;
      }

      // Cập nhật trạng thái phiếu ĐRL nếu thay đổi
      if (editDrlStatus) {
        const currentSub = submissionsMap[`${mssv}_${reviewSemester}`] || submissionsMap[mssv];
        if (editDrlStatus === "Chưa nộp") {
          await supabase.from("drl_submissions").delete().eq("mssv", mssv).eq("semester_id", reviewSemester);
          setSubmissionsMap(prev => {
            const next = { ...prev };
            delete next[`${mssv}_${reviewSemester}`];
            delete next[mssv];
            return next;
          });
        } else {
          const subData = {
            mssv,
            student_name: editFullName.trim(),
            student_class: editClass.trim(),
            semester_id: reviewSemester,
            status: editDrlStatus,
            self_score: currentSub?.self_score || 0,
            final_score: currentSub?.final_score || (editDrlStatus === "Đã duyệt" ? 80 : 0),
          };
          await supabase.from("drl_submissions").upsert([subData], { onConflict: "mssv,semester_id" });
          setSubmissionsMap(prev => ({
            ...prev,
            [`${mssv}_${reviewSemester}`]: subData,
            [mssv]: subData,
          }));
        }
      }

      setStudents(prev =>
        prev.map(s => s.mssv === mssv ? { ...s, ...updateData } : s)
      );
      setEditingStudent(null);
      setEditingMssv(null);
    } catch (err: any) {
      alert("Đã xảy ra lỗi: " + err.message);
    } finally {
      setEditSaving(false);
    }
  };

  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveStudentInlineOrModal();
  };

  const handleDeleteSingleStudent = async (mssv: string, name: string) => {
    if (confirm(`Xác nhận xóa sinh viên: ${name} (MSSV: ${mssv})?`)) {
      await supabase.from("students").delete().eq("mssv", mssv);
      setStudents(students.filter((s) => s.mssv !== mssv));
    }
  };

  const handleDeleteAllStudents = async () => {
    if (confirm("CẢNH BÁO: XÓA TOÀN BỘ danh sách sinh viên?")) {
      await supabase.from("students").delete().neq("id", 0);
      setStudents([]);
      alert("Đã xóa sạch danh sách.");
    }
  };

  const handleSelectCriteria = (selectedCode: string) => {
    setEventCategoryCode(selectedCode);
    const item = EVENT_CRITERIA_OPTIONS.find((c) => c.code === selectedCode);
    if (item) setEventPoints(item.max);
  };

  const formatEventText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleAddEvent = async () => {
    const criteriaItem = EVENT_CRITERIA_OPTIONS.find((c) => c.code === eventCategoryCode);
    const descHtml = await publishEditorImages(eventEditorRef.current);
    const coverUrl = await publishImage(eventCoverImage);
    setEventCoverImage(coverUrl);
    releasePreview(eventCoverImage);

    const newEvent = {
      id: "ev-" + Date.now().toString(),
      title: eventTitle,
      category: eventCategory,
      category_code: eventCategoryCode,
      category_label: criteriaItem?.label || eventCategoryCode,
      points: Number(eventPoints),
      time: eventTime || "07:30 - Ngày 30/08/2026",
      location: eventLocation,
      deadline: eventDeadline || "23:59 - Ngày 29/08/2026",
      description: packEventDescription(coverUrl, descHtml, eventDesc),
      lat: 10.0469,
      lng: 105.7681,
      gps_radius: "200",
    };

    const { error } = await supabase.from("events").insert([newEvent]);
    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Đăng sự kiện thành công.");
      fetchAllData();
      setEventTitle("");
      setEventCoverImage("");
      setEventDesc("");
      if (eventEditorRef.current) eventEditorRef.current.innerHTML = "";
    }
  };

  const handleDeleteSingleEvent = async (id: string, title: string) => {
    if (confirm(`Xác nhận xóa sự kiện: "${title}"?`)) {
      await supabase.from("events").delete().eq("id", id);
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const handleDeleteAllEvents = async () => {
    if (confirm("Xóa tất cả sự kiện?")) {
      await supabase.from("events").delete().neq("id", "none");
      setEvents([]);
    }
  };

  const formatText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleAddPost = async () => {
    const contentHtml = await publishEditorImages(editorRef.current);
    const coverUrl = await publishImage(postCoverImage);
    setPostCoverImage(coverUrl);
    releasePreview(postCoverImage);
    const postData = {
      title: postTitle,
      category: postCategory,
      cover_image: coverUrl,
      content_html: contentHtml,
      content: editorRef.current ? editorRef.current.innerText : "",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    if (editingPostId) {
      const { error } = await supabase.from("posts").update(postData).eq("id", editingPostId);
      if (error) {
        alert("Lỗi cập nhật: " + error.message);
      } else {
        alert("Cập nhật bài viết thành công!");
        setEditingPostId(null);
        setPostTitle("");
        setPostCoverImage("");
        if (editorRef.current) editorRef.current.innerHTML = "";
        fetchAllData();
      }
    } else {
      const { error } = await supabase.from("posts").insert([postData]);
      if (error) {
        alert("Lỗi xuất bản: " + error.message);
      } else {
        alert("Xuất bản bài viết thành công!");
        setPostTitle("");
        setPostCoverImage("");
        if (editorRef.current) editorRef.current.innerHTML = "";
        fetchAllData();
      }
    }
  };

  const handleStartEditPost = (p: any) => {
    setEditingPostId(p.id);
    setPostTitle(p.title || "");
    setPostCategory(p.category || "Xem gì hôm nay");
    setPostCoverImage(p.cover_image || "");
    if (editorRef.current) {
      editorRef.current.innerHTML = p.content_html || p.content || "";
    }
    const formEl = document.getElementById("post-form-section");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleCancelEditPost = () => {
    setEditingPostId(null);
    setPostTitle("");
    setPostCoverImage("");
    if (editorRef.current) editorRef.current.innerHTML = "";
  };

  const handleDeleteSinglePost = async (id: number, title: string) => {
    if (confirm(`Xác nhận xóa bài viết: "${title}"?`)) {
      await supabase.from("posts").delete().eq("id", id);
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  const handleDeleteAllPosts = async () => {
    if (confirm("Xóa tất cả bài viết?")) {
      await supabase.from("posts").delete().neq("id", 0);
      setPosts([]);
    }
  };

  if (!currentUser) return null;

  return (
    <main className="min-h-screen bg-slate-100 py-4 sm:py-8 px-2 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">      <div className="max-w-7xl mx-auto">
        
        {/* HEADER TỐI GIẢN */}
        <div className="bg-white px-3.5 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-xs border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link href="/" className="flex-shrink-0">
              <img
                src={siteImages.logo}
                alt="Logo Đoàn Khoa"
                className="h-8 sm:h-11 w-auto object-contain cursor-pointer"
              />
            </Link>
            <div className="border-l border-slate-200 pl-3 min-w-0">
              <h1 className="text-xs sm:text-base font-extrabold text-[#004A52] tracking-tight">
                Quản trị hệ thống
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate">
                <span className="font-semibold text-slate-700">
                  {currentUser?.fullName?.replace(/\s*\([^)]*\)/g, "").trim() || "Ban Chấp hành Đoàn Khoa"}
                </span>
                <span className="mx-1 text-slate-300">•</span>
                <span className="text-[#007A87] font-medium">
                  {currentUser?.role === "super_admin" ? "Admin Tối Cao" : "Cán bộ Chi đoàn"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap self-end sm:self-center">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-[#007A87] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl hover:bg-slate-50 border border-slate-200 transition whitespace-nowrap"
            >
              Về trang chủ
            </Link>
            <button
              onClick={() => {
                // Xóa phiên local trước để nút đăng xuất không bị kẹt khi server lỗi.
                localStorage.removeItem("ctut_current_user");
                sessionStorage.removeItem("ctut_current_user");
                router.replace("/dang-nhap");
                void Promise.allSettled([
                  endImageSession(),
                  supabase.auth.signOut({ scope: "local" }),
                ]);
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-red-100 transition cursor-pointer whitespace-nowrap"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div inert={savingContent} className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0 no-scrollbar sm:flex-wrap">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "students" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Sinh viên ({students.length})
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "about" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Giới thiệu
          </button>

          {currentUser?.role === "super_admin" && (
            <button
              onClick={() => setActiveTab("officers")}
              className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
                activeTab === "officers" ? "bg-[#004A52] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              Cán bộ BCH Chi đoàn ({officers.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab("semesters")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "semesters" ? "bg-[#004A52] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Học kỳ ĐRL
          </button>

          <button
            onClick={() => setActiveTab("review")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "review" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Duyệt ĐRL Chi Đoàn
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "events" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Sự kiện & Điểm danh ({events.length})
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "posts" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Bài viết & Chuyên mục ({posts.length})
          </button>

          <button
            onClick={() => setActiveTab("banners")}
            className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition ${
              activeTab === "banners" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Banner ({banners.length})
          </button>
        </div>

        {/* TAB 1: SINH VIÊN */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <form onSubmit={addClass} className="space-y-2 border-b border-slate-100 pb-4">
                <label htmlFor="new-class" className="text-sm font-bold text-[#004A52]">Thêm lớp học</label>
                <div className="flex gap-2">
                  <input id="new-class" required value={newClass} onChange={e => setNewClass(e.target.value)} placeholder="Tên lớp học" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm" />
                  <button disabled={addingClass || !newClass.trim()} className="rounded-xl bg-[#007A87] px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{addingClass ? "Đang lưu…" : "Thêm lớp"}</button>
                </div>
              </form>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#004A52]">Thêm sinh viên / Đoàn viên</h3>
                <button
                  type="button"
                  onClick={handleDownloadSampleTemplate}
                  className="text-xs font-bold text-[#007A87] hover:underline bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200"
                >
                  Tải form Excel mẫu
                </button>
              </div>

              <label className="block text-xs font-bold text-slate-700">
                Lớp nhận sinh viên *
                <select required value={enrollmentClass} onChange={e => setEnrollmentClass(e.target.value)} className="mt-1 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2">
                  <option value="">Chọn lớp học</option>
                  {classNames.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
              </label>
              <fieldset disabled={!enrollmentClass} className="space-y-4 disabled:opacity-60">
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button type="button" onClick={() => setStudentInputMode("paste")} className={`py-1.5 rounded-lg transition ${studentInputMode === "paste" ? "bg-white text-[#EE6425] shadow-xs" : ""}`}>Dán từ Excel</button>
                <button type="button" onClick={() => setStudentInputMode("manual")} className={`py-1.5 rounded-lg transition ${studentInputMode === "manual" ? "bg-white text-[#EE6425] shadow-xs" : ""}`}>Nhập thủ công</button>
                <button type="button" onClick={() => setStudentInputMode("file")} className={`py-1.5 rounded-lg transition ${studentInputMode === "file" ? "bg-white text-[#EE6425] shadow-xs" : ""}`}>Tải file lên</button>
              </div>

              {studentInputMode === "paste" && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500">Dán cột MSSV và họ tên từ Excel. Tất cả sinh viên trong lần nhập này sẽ vào lớp đã chọn.</p>
                  <textarea
                    rows={5}
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    placeholder="CNDT2411081	Phạm Thái Minh Đăng	CNKT Tự động hóa K2024"
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-mono bg-white outline-none focus:border-[#EE6425]"
                  ></textarea>
                  <button type="button" onClick={handleProcessPasteData} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition text-xs uppercase shadow">
                    Lưu danh sách sinh viên
                  </button>
                </div>
              )}

              {studentInputMode === "manual" && (
                <form onSubmit={handleAddManualStudent} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">MSSV *</label>
                      <input type="text" required value={manualMssv} onChange={(e) => setManualMssv(e.target.value)} placeholder="CNDT2411081" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono uppercase outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Họ và tên *</label>
                      <input type="text" required value={manualFullName} onChange={(e) => setManualFullName(e.target.value)} placeholder="Phạm Thái Minh Đăng" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Nơi sinh</label>
                      <input type="text" value={manualBirthPlace} onChange={(e) => setManualBirthPlace(e.target.value)} placeholder="Cần Thơ" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Sổ Đoàn</label>
                      <select value={manualSoDoan} onChange={(e) => setManualSoDoan(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none bg-white">
                        <option value="Đã nộp">Đã nộp</option>
                        <option value="Chưa nộp">Chưa nộp</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Ngày vào Đoàn</label>
                      <input type="date" value={manualUnionDate} onChange={(e) => setManualUnionDate(e.target.value)} className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Ngày vào Đảng</label>
                      <input type="date" value={manualPartyDate} onChange={(e) => setManualPartyDate(e.target.value)} className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs outline-none" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input type="checkbox" id="chuaDoan" checked={manualChuaKetNap} onChange={(e) => setManualChuaKetNap(e.target.checked)} className="rounded" />
                    <label htmlFor="chuaDoan" className="text-xs font-semibold text-slate-700 cursor-pointer">Chưa kết nạp Đoàn</label>
                  </div>

                  <button type="submit" className="w-full bg-[#007A87] hover:bg-[#005a63] text-white font-bold py-2.5 rounded-xl transition text-xs uppercase shadow mt-1">
                    Thêm sinh viên này
                  </button>
                </form>
              )}

              {studentInputMode === "file" && (
                <div className="space-y-3 p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-700">Chọn file .csv hoặc .txt. Toàn bộ danh sách sẽ vào lớp {enrollmentClass}.</p>
                  <input type="file" accept=".csv, .txt" onChange={handleFileUpload} className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#EE6425] file:text-white cursor-pointer" />
                </div>
              )}
              </fieldset>
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
                <h2 className="text-base font-bold text-[#004A52]">
                  Danh sách sinh viên ({visibleStudents.length})
                </h2>
                {students.length > 0 && !studentClassFilter && !studentSearch && (
                  <button onClick={handleDeleteAllStudents} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow">
                    Xóa tất cả danh sách
                  </button>
                )}
              </div>

              {/* BỘ LỌC LỚP, CHỌN TRẠNG THÁI PHIẾU ĐRL & TÌM KIẾM SINH VIÊN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lọc theo lớp học</label>
                  <select
                    value={studentClassFilter}
                    onChange={e => setStudentClassFilter(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                  >
                    <option value="">Tất cả lớp ({students.length})</option>
                    {classNames.map(name => {
                      const count = students.filter(s => s.student_class?.trim() === name).length;
                      return <option key={name} value={name}>{name} ({count})</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chọn phiếu ĐRL</label>
                  <select
                    value={studentDrlFilter}
                    onChange={e => setStudentDrlFilter(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                  >
                    <option value="Tất cả">Tất cả trạng thái</option>
                    <option value="Chưa nộp">Chưa nộp</option>
                    <option value="Đã nộp">Đã nộp phiếu</option>
                    <option value="Đã duyệt">Đã duyệt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tìm kiếm sinh viên</label>
                  <input
                    type="text"
                    placeholder="Tìm theo MSSV hoặc họ tên..."
                    value={studentSearch}
                    onChange={e => setStudentSearch(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                  />
                </div>
              </div>

              {visibleStudents.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  {students.length === 0 ? "Chưa có sinh viên nào." : "Không tìm thấy sinh viên nào phù hợp với bộ lọc."}
                </div>
              ) : (
                <div className="overflow-x-auto -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                  <table className="w-full text-left text-xs min-w-[680px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">MSSV</th>
                        <th className="p-2.5">Họ và tên</th>
                        <th className="p-2.5">Lớp</th>
                        <th className="p-2.5">Sổ Đoàn</th>
                        <th className="p-2.5">Phiếu ĐRL</th>
                        <th className="p-2.5">Đoàn/Đảng</th>
                        <th className="p-2.5 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {visibleStudents.map((s, idx) => {
                        const isEditing = editingMssv === s.mssv;
                        const sub = submissionsMap[`${s.mssv}_${reviewSemester}`] || submissionsMap[s.mssv];
                        const drlStatus = getDRLStatus(sub);

                        if (isEditing) {
                          return (
                            <tr key={s.mssv || idx} className="bg-orange-50/80 border-2 border-[#EE6425]/50">
                              <td className="p-2 font-bold text-[#007A87] whitespace-nowrap">{s.mssv}</td>
                              <td className="p-2">
                                <input
                                  type="text"
                                  required
                                  value={editFullName}
                                  onChange={e => setEditFullName(e.target.value)}
                                  className="w-full border border-slate-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-[#EE6425] bg-white font-bold text-slate-800"
                                  placeholder="Họ và tên..."
                                />
                              </td>
                              <td className="p-2">
                                <select
                                  value={editClass}
                                  onChange={e => setEditClass(e.target.value)}
                                  className="w-full border border-slate-300 rounded-lg px-1.5 py-1 text-xs outline-none bg-white focus:border-[#EE6425]"
                                >
                                  {classNames.map(name => (
                                    <option key={name} value={name}>{name}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="p-2">
                                <select
                                  value={editSoDoan}
                                  onChange={e => setEditSoDoan(e.target.value)}
                                  className="border border-slate-300 rounded-lg px-1.5 py-1 text-xs outline-none bg-white focus:border-[#EE6425]"
                                >
                                  <option value="Đã nộp">Đã nộp</option>
                                  <option value="Chưa nộp">Chưa nộp</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <select
                                  value={editDrlStatus}
                                  onChange={e => setEditDrlStatus(e.target.value)}
                                  className="border border-slate-300 rounded-lg px-1.5 py-1 text-xs outline-none bg-white focus:border-[#EE6425]"
                                >
                                  <option value="Chưa nộp">Chưa nộp</option>
                                  <option value="Đã nộp">Đã nộp</option>
                                  <option value="Đã duyệt">Đã duyệt</option>
                                </select>
                              </td>
                              <td className="p-2">
                                <input
                                  type="date"
                                  value={editUnionDate}
                                  onChange={e => setEditUnionDate(e.target.value)}
                                  className="border border-slate-300 rounded-lg px-1 py-1 text-xs outline-none bg-white focus:border-[#EE6425]"
                                />
                              </td>
                              <td className="p-2 text-center whitespace-nowrap space-x-2">
                                <button
                                  type="button"
                                  disabled={editSaving}
                                  onClick={() => handleSaveStudentInlineOrModal(s.mssv)}
                                  className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer disabled:opacity-50"
                                >
                                  {editSaving ? "Đang lưu..." : "Lưu"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditingMssv(null)}
                                  className="text-slate-500 hover:text-slate-700 font-bold hover:underline cursor-pointer"
                                >
                                  Hủy
                                </button>
                              </td>
                            </tr>
                          );
                        }

                        return (
                          <tr key={s.mssv || idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-[#007A87]">{s.mssv}</td>
                            <td className="p-2.5 font-medium text-slate-800">{s.full_name}</td>
                            <td className="p-2.5 text-slate-600">{s.student_class}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${s.so_doan === "Đã nộp" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                                {s.so_doan || "Chưa nộp"}
                              </span>
                            </td>
                            <td className="p-2.5">
                              <DRLStatusBadge status={drlStatus} size="sm" />
                            </td>
                            <td className="p-2.5 text-[11px] text-slate-500">
                              {s.chua_ket_nap_doan ? <span className="text-red-600 font-bold">Chưa vào Đoàn</span> : `Đoàn: ${s.union_date || "Có"}`}
                            </td>
                            <td className="p-2.5 text-center whitespace-nowrap space-x-2">
                              <button
                                type="button"
                                onClick={() => handleStartInlineEdit(s)}
                                className="text-[#007A87] hover:text-[#005a63] font-bold hover:underline cursor-pointer"
                              >
                                Sửa
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSingleStudent(s.mssv, s.full_name)}
                                className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* MODAL POPUP CHỈNH SỬA SINH VIÊN TRỰC TIẾP */}
            {editingStudent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                        Chỉnh sửa thông tin sinh viên
                      </h3>
                      <p className="text-xs text-[#007A87] font-bold mt-0.5">
                        MSSV: {editingStudent.mssv}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingStudent(null)}
                      className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2.5 py-1 rounded-lg hover:bg-slate-200 transition"
                    >
                      Đóng
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditStudent} className="p-5 space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Họ và tên sinh viên *</label>
                      <input
                        type="text"
                        required
                        value={editFullName}
                        onChange={e => setEditFullName(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Lớp học</label>
                        <select
                          value={editClass}
                          onChange={e => setEditClass(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none bg-white focus:border-[#EE6425]"
                        >
                          <option value="">Chọn lớp</option>
                          {classNames.map(name => (
                            <option key={name} value={name}>{name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Tình trạng Sổ Đoàn</label>
                        <select
                          value={editSoDoan}
                          onChange={e => setEditSoDoan(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none bg-white focus:border-[#EE6425]"
                        >
                          <option value="Đã nộp">Đã nộp</option>
                          <option value="Chưa nộp">Chưa nộp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Phiếu ĐRL</label>
                        <select
                          value={editDrlStatus}
                          onChange={e => setEditDrlStatus(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none bg-white focus:border-[#EE6425]"
                        >
                          <option value="Chưa nộp">Chưa nộp</option>
                          <option value="Đã nộp">Đã nộp</option>
                          <option value="Đã duyệt">Đã duyệt</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Quê quán / Nơi sinh</label>
                      <input
                        type="text"
                        value={editBirthPlace}
                        onChange={e => setEditBirthPlace(e.target.value)}
                        placeholder="Cần Thơ"
                        className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Ngày vào Đoàn</label>
                        <input
                          type="date"
                          value={editUnionDate}
                          onChange={e => setEditUnionDate(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Ngày vào Đảng</label>
                        <input
                          type="date"
                          value={editPartyDate}
                          onChange={e => setEditPartyDate(e.target.value)}
                          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id="editChuaDoan"
                        checked={editChuaKetNap}
                        onChange={e => setEditChuaKetNap(e.target.checked)}
                        className="rounded"
                      />
                      <label htmlFor="editChuaDoan" className="text-xs font-semibold text-slate-700 cursor-pointer">
                        Chưa kết nạp Đoàn
                      </label>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setEditingStudent(null)}
                        className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={editSaving}
                        className="bg-[#007A87] hover:bg-[#005a63] text-white px-5 py-2 rounded-xl font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        {editSaving ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: QUẢN LÝ GIỚI THIỆU (ĐOÀN KHOA & LIÊN CHI HỘI) */}
        {activeTab === "about" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-[#004A52]">
                  {aboutTargetKey === "about_lienchihoi" ? "SOẠN THẢO TRANG LIÊN CHI HỘI KTCK" : "SOẠN THẢO TRANG ĐOÀN KHOA KTCK"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Chọn phần muốn chỉnh sửa nội dung bên dưới.</p>
              </div>

              {/* 2 NÚT CHUYỂN ĐỔI ĐOÀN KHOA / LIÊN CHI HỘI */}
              <div inert={savingContent} className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setAboutTargetKey("about_doankhoa")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    aboutTargetKey === "about_doankhoa" ? "bg-[#EE6425] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Đoàn khoa KTCK
                </button>
                <button
                  type="button"
                  onClick={() => setAboutTargetKey("about_lienchihoi")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition ${
                    aboutTargetKey === "about_lienchihoi" ? "bg-[#EE6425] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Liên chi hội KTCK
                </button>
              </div>
            </div>

            <form inert={savingContent} aria-busy={savingContent} onSubmit={e => saveContent(e, handleSaveAboutUs)} className="space-y-4">
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    const selection = window.getSelection();
                    if (!selection || selection.rangeCount === 0) return;
                    const range = selection.getRangeAt(0);
                    const b = document.createElement("strong");
                    b.appendChild(range.extractContents());
                    range.insertNode(b);
                  }}
                  className="px-3 py-1 bg-white border border-slate-200 rounded font-black hover:bg-slate-100"
                >
                  In đậm (B)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const selection = window.getSelection();
                    if (!selection || selection.rangeCount === 0) return;
                    const range = selection.getRangeAt(0);
                    const em = document.createElement("em");
                    em.appendChild(range.extractContents());
                    range.insertNode(em);
                  }}
                  className="px-3 py-1 bg-white border border-slate-200 rounded italic hover:bg-slate-100"
                >
                  In nghiêng (I)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (aboutEditorRef.current) {
                      const h2 = document.createElement("h2");
                      h2.style.fontSize = "20px";
                      h2.style.fontWeight = "bold";
                      h2.style.color = "#004A52";
                      h2.style.margin = "12px 0";
                      h2.textContent = "Tiêu đề lớn";
                      aboutEditorRef.current.appendChild(h2);
                    }
                  }}
                  className="px-3 py-1 bg-white border border-slate-200 rounded font-bold hover:bg-slate-100"
                >
                  + Tiêu đề lớn
                </button>
                <label className="px-3 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded cursor-pointer font-bold hover:bg-orange-100">
                  Chèn hình ảnh
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => insertImage(e.currentTarget, aboutEditorRef.current)}
                    className="hidden"
                  />
                </label>
              </div>

              <div
                ref={aboutEditorRef}
                contentEditable
                className="w-full min-h-[350px] border border-t-0 border-slate-300 rounded-b-xl p-5 text-sm outline-none bg-white leading-relaxed"
              ></div>

              <button
                type="submit"
                className="bg-[#EE6425] hover:bg-[#d85216] text-white font-bold px-8 py-3 rounded-xl text-xs uppercase shadow transition"
              >
                {savingContent ? "Đang lưu…" : `Lưu nội dung (${aboutTargetKey === "about_lienchihoi" ? "Liên chi hội KTCK" : "Đoàn khoa KTCK"})`}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: CÁN BỘ BCH */}
        {activeTab === "officers" && currentUser?.role === "super_admin" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#004A52]">Cấp tài khoản cho BCH Chi đoàn / Lớp</h2>
              <form onSubmit={handleCreateOfficer} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên tài khoản đăng nhập *</label>
                  <input type="text" required value={officerUser} onChange={(e) => setOfficerUser(e.target.value)} placeholder="VD: bch_tdhk24..." className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#004A52]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ tên Cán bộ / Chức vụ *</label>
                  <input type="text" required value={officerName} onChange={(e) => setOfficerName(e.target.value)} placeholder="VD: Nguyễn Văn A (Bí thư)" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#004A52]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gán lớp / Chi đoàn quản lý *</label>
                  <select
                    required
                    value={officerClass}
                    onChange={(e) => setOfficerClass(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#004A52] bg-white"
                  >
                    <option value="">-- Chọn lớp cho cán bộ quản lý --</option>
                    {classNames.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-400 mt-1">Cán bộ này chỉ thấy và chấm điểm rèn luyện cho sinh viên thuộc lớp được chọn.</p>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu cấp *</label>
                  <input type="password" required value={officerPass} onChange={(e) => setOfficerPass(e.target.value)} placeholder="Mật khẩu cán bộ" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#004A52]" />
                </div>
                <button type="submit" className="w-full bg-[#004A52] hover:bg-[#00343a] text-white font-bold py-2.5 rounded-xl transition text-xs uppercase shadow">
                  Cấp tài khoản Cán bộ Chi đoàn
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Danh sách cán bộ BCH Chi đoàn ({officers.length})</h2>
              {officers.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">Chưa có tài khoản cán bộ nào.</p>
              ) : (
                <div className="overflow-x-auto -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                  <table className="w-full text-left text-xs min-w-[520px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Tài khoản</th>
                        <th className="p-2.5">Cán bộ</th>
                        <th className="p-2.5">Chi đoàn</th>
                        <th className="p-2.5">Mật khẩu</th>
                        <th className="p-2.5 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {officers.map((off) => (
                        <tr key={off.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-[#007A87]">{off.username}</td>
                          <td className="p-2.5 font-medium text-slate-800">{off.full_name}</td>
                          <td className="p-2.5 text-slate-600">
                            <select
                              aria-label={`Lớp quản lý của ${off.full_name}`}
                              value={off.branch_class || ""}
                              onChange={(e) => handleUpdateOfficerClass(off.id, e.target.value)}
                              className="border border-slate-300 rounded-lg px-2 py-1 text-xs bg-white outline-none focus:border-[#004A52] max-w-[200px]"
                            >
                              {off.branch_class && !classNames.includes(off.branch_class) && (
                                <option value={off.branch_class}>{off.branch_class} (chưa khớp tên lớp)</option>
                              )}
                              {classNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block my-1">{off.password}</td>
                          <td className="p-2.5 text-center">
                            <button onClick={() => handleDeleteOfficer(off.id, off.full_name)} className="text-red-600 hover:text-red-800 font-bold hover:underline">Xóa</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HỌC KỲ */}
        {activeTab === "semesters" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#004A52]">Mở đợt / Học kỳ đánh giá mới</h2>
              <form onSubmit={handleCreateSemester} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã học kỳ (ID) *</label>
                  <input type="text" required value={semId} onChange={(e) => setSemId(e.target.value)} placeholder="VD: hk1_2026_2027" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#004A52]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên hiển thị học kỳ *</label>
                  <input type="text" required value={semTitle} onChange={(e) => setSemTitle(e.target.value)} placeholder="VD: Học kỳ 1 (Năm học 2026 - 2027)" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#004A52]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
                    <input type="date" value={semStart} onChange={(e) => setSemStart(e.target.value)} className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ngày kết thúc (Đóng cổng)</label>
                    <input type="date" value={semEnd} onChange={(e) => setSemEnd(e.target.value)} className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs outline-none" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#004A52] hover:bg-[#00343a] text-white font-bold py-2.5 rounded-xl transition text-xs uppercase shadow">
                  Tạo học kỳ mới
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 bg-white p-3.5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Danh sách các học kỳ ({semesters.length})</h2>
              {semesters.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">Chưa có học kỳ nào.</p>
              ) : (
                <div className="overflow-x-auto -mx-3.5 px-3.5 sm:mx-0 sm:px-0">
                  <table className="w-full text-left text-xs min-w-[480px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Tên học kỳ</th>
                        <th className="p-2.5">Thời gian</th>
                        <th className="p-2.5 text-center">Trạng thái cổng</th>
                        <th className="p-2.5 text-center">Hành động</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {semesters.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-800">{s.title}</td>
                          <td className="p-2.5 text-slate-500 font-mono text-[11px]">{s.start_date} đến {s.end_date}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${s.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {s.is_active ? "ĐANG MỞ" : "ĐÃ ĐÓNG"}
                            </span>
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleToggleSemesterActive(s.id, s.is_active)}
                              className={`px-3 py-1.5 rounded-lg font-bold text-[11px] text-white ${s.is_active ? "bg-red-500 hover:bg-red-600" : "bg-emerald-600 hover:bg-emerald-700"}`}
                            >
                              {s.is_active ? "Khóa cổng" : "Mở cổng"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: DUYỆT ĐRL */}
        {activeTab === "review" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#004A52] uppercase">Danh sách sinh viên lớp</h3>
                <select
                  value={reviewSemester}
                  onChange={e => { reviewRequest.current++; setSelectedStudent(null); setReviewSemester(e.target.value); }}
                  className="border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-[#EE6425] outline-none bg-white"
                >
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              {/* CHỌN LỚP HỌC & TRẠNG THÁI PHIẾU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lớp học</label>
                  <select
                    value={reviewClass}
                    onChange={e => { reviewRequest.current++; setSelectedStudent(null); setReviewClass(e.target.value); }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  >
                    <option value="">Tất cả lớp ({students.length})</option>
                    {classNames.map(name => {
                      const count = students.filter(s => s.student_class?.trim() === name).length;
                      return <option key={name} value={name}>{name} ({count})</option>;
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Trạng thái phiếu</label>
                  <select
                    value={reviewStatusFilter}
                    onChange={e => { reviewRequest.current++; setSelectedStudent(null); setReviewStatusFilter(e.target.value); }}
                    className="w-full rounded-xl border border-slate-300 bg-white px-2.5 py-2 text-xs outline-none focus:border-[#EE6425]"
                  >
                    <option value="Tất cả">Tất cả ({classStudents.length})</option>
                    <option value="Chưa nộp">Chưa nộp ({chuaNopReviewCount})</option>
                    <option value="Đã nộp">Đã nộp phiếu ({daNopReviewCount})</option>
                    <option value="Đã duyệt">Đã duyệt ({daDuyetReviewCount})</option>
                  </select>
                </div>
              </div>

              {/* NÚT LỌC NHANH TRẠNG THÁI */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: "Tất cả", label: "Tất cả", count: classStudents.length },
                  { id: "Chưa nộp", label: "Chưa nộp", count: chuaNopReviewCount },
                  { id: "Đã nộp", label: "Đã nộp", count: daNopReviewCount },
                  { id: "Đã duyệt", label: "Đã duyệt", count: daDuyetReviewCount },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { reviewRequest.current++; setSelectedStudent(null); setReviewStatusFilter(item.id); }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      reviewStatusFilter === item.id
                        ? "bg-[#007A87] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {item.label} ({item.count})
                  </button>
                ))}
              </div>

              {/* TÌM KIẾM THEO TÊN HOẶC MSSV */}
              <div>
                <input
                  type="search"
                  aria-label="Tìm sinh viên theo tên hoặc MSSV"
                  placeholder="Tìm theo họ tên hoặc MSSV..."
                  value={reviewSearch}
                  onChange={e => setReviewSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                />
              </div>

              {/* DANH SÁCH SINH VIÊN */}
              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {!filteredReviewStudents.length && (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    {reviewSearch.trim() || reviewStatusFilter !== "Tất cả" ? "Không tìm thấy sinh viên phù hợp." : "Chưa có sinh viên trong danh sách này."}
                  </p>
                )}
                {filteredReviewStudents.map(st => {
                  const sub = submissionsMap[`${st.mssv}_${reviewSemester}`] || submissionsMap[st.mssv];
                  const stStatus = getDRLStatus(sub);
                  return (
                    <div
                      key={st.mssv}
                      onClick={() => handleSelectStudentForReview(st)}
                      className={`p-3 rounded-2xl border cursor-pointer transition text-xs flex justify-between items-center gap-2 ${
                        selectedStudent?.mssv === st.mssv
                          ? "bg-orange-50 border-[#EE6425] shadow-xs"
                          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-slate-800 truncate">{st.full_name}</div>
                        <div className="text-slate-500 font-mono text-[11px] mt-0.5">{st.mssv} - {st.student_class}</div>
                      </div>
                      <DRLStatusBadge status={stStatus} size="sm" />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {selectedStudent ? (
                <>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-black text-[#004A52] uppercase">
                          Chấm điểm cho: {selectedStudent.full_name}
                        </h2>
                        <DRLStatusBadge status={getDRLStatus(studentSubmission)} size="sm" />
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{selectedStudent.mssv} | {selectedStudent.student_class}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs text-slate-400 block">Điểm SV tự chấm:</span>
                      <span className="text-lg font-black text-[#EE6425]">{studentSubmission?.self_score || 0} đ</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-700 uppercase mb-2">Minh chứng sinh viên nộp ({studentProofs.length})</h3>
                    {studentProofs.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Sinh viên chưa nộp minh chứng nào trong học kỳ này.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {studentProofs.map((p, pIdx) => (
                          <div key={pIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                            <div>
                              <span className="font-bold text-slate-800 block">{p.title}</span>
                              <span className="text-[11px] text-slate-500">{p.category_code} (+{p.points}đ)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ProofLinks value={p.image} />
                              <button
                                onClick={() => handleApproveProof(p.id, p.status)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                                  p.status === "Đã duyệt" ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                }`}
                              >
                                {p.status || "Chờ duyệt"}
                              </button>
                              <button
                                onClick={() => handleDeleteProof(p.id, p.title)}
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                                title="Xóa minh chứng"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold text-[#004A52] uppercase">Bảng chấm điểm chi tiết (BCH Chi đoàn / Lớp chấm):</h3>
                    
                    <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                      {DRL_SECTIONS_FULL.map((section) => {
                        const secScore = getOfficerSectionScore(section);
                        return (
                          <div key={section.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                            <div className="bg-slate-100 p-3 sm:p-3.5 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-black text-[#004A52]">
                              <span>{section.title} (Tối đa {section.maxPoints} đ)</span>
                              <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-[#EE6425] self-start sm:self-auto">
                                Lớp chấm phần này: {secScore} / {section.maxPoints} đ
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs min-w-[500px]">
                                <thead>
                                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                                    <th className="py-2.5 px-3 w-5/12">Nội dung đánh giá</th>
                                    <th className="py-2.5 px-2 text-center w-24">Quy định</th>
                                    <th className="py-2.5 px-2 text-center w-20">SV tự chấm</th>
                                    <th className="py-2.5 px-3 text-center w-28 text-[#EE6425]">Lớp chấm (đ)</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {section.items.map((item) => {
                                    const svVal = studentSubmission?.scores_detail?.[item.id] || 0;
                                    const classVal = officerScores[item.id] !== undefined ? officerScores[item.id] : svVal;

                                    return (
                                      <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="py-3 px-3 text-slate-700">
                                          <span className="font-bold block text-slate-800 leading-snug">{item.title}</span>
                                          <span className="block text-[11px] italic text-slate-500 mt-1 leading-relaxed">{item.subtext}</span>
                                        </td>
                                        <td className="py-3 px-2 text-center font-bold text-slate-600 align-top pt-4">
                                          {item.maxLabel}
                                        </td>
                                        <td className="py-3 px-2 text-center font-mono font-bold text-slate-600 align-top pt-4">
                                          {svVal} đ
                                        </td>
                                        <td className="py-3 px-3 text-center align-top pt-3">
                                          <div className="flex flex-col items-center">
                                            <input
                                              type="number"
                                              min="0"
                                              max={item.max}
                                              value={classVal}
                                              onChange={(e) => {
                                                const val = Math.max(0, Number(e.target.value) || 0);
                                                setOfficerScores((prev) => ({ ...prev, [item.id]: val }));
                                              }}
                                              className="w-16 border border-slate-300 rounded-lg py-1.5 text-center font-bold text-[#EE6425] outline-none"
                                            />
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-orange-50/50 p-4 rounded-2xl">
                    <div>
                      <span className="text-xs text-slate-500 block">TỔNG ĐIỂM LỚP CHẤM CHÍNH THỨC:</span>
                      <span className="text-2xl font-black text-[#EE6425]">{grandOfficerTotalScore} / 100 điểm</span>
                    </div>

                    <button
                      onClick={handleSendFinalScore}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow transition uppercase tracking-wider"
                    >
                      Gửi bảng điểm chính thức về cho sinh viên
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-24 text-center text-xs text-slate-400">
                  Vui lòng chọn một sinh viên ở danh sách bên trái để xem phiếu điểm và chấm điểm chi tiết.
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 6: SỰ KIỆN */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo Sự Kiện Mới</h2>
              <form inert={savingContent} aria-busy={savingContent} onSubmit={e => saveContent(e, handleAddEvent)} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tên sự kiện *</label>
                  <input type="text" required value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="VD: Hội thảo..." className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#EE6425]" />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục</label>
                    <select value={eventCategory} onChange={(e) => setEventCategory(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none">
                      <option value="Phong trào">Phong trào</option>
                      <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                      <option value="Tình nguyện">Tình nguyện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mục ĐRL (QĐ 147)</label>
                    <select value={eventCategoryCode} onChange={(e) => handleSelectCriteria(e.target.value)} className="w-full border border-slate-300 rounded-xl px-2 py-2 text-xs outline-none">
                      {EVENT_CRITERIA_OPTIONS.map((c) => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Điểm rèn luyện cộng *</label>
                  <input type="number" min="1" max="10" required value={eventPoints} onChange={(e) => setEventPoints(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-bold text-[#EE6425] outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hình ảnh bìa sự kiện</label>
                  <input type="file" accept="image/*" onChange={(e) => pickImage(e.currentTarget, url => { releasePreview(eventCoverImage); setEventCoverImage(url); })} className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500" />
                  {eventCoverImage && <img src={eventCoverImage} alt="Cover Preview" className="mt-2 h-24 rounded-xl object-cover" />}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi tiết sự kiện</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                    <button type="button" onClick={() => formatEventText("bold")} className="px-2.5 py-1 bg-white border border-slate-200 rounded font-black">B</button>
                    <button type="button" onClick={() => formatEventText("italic")} className="px-2.5 py-1 bg-white border border-slate-200 rounded italic">I</button>
                    <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded cursor-pointer">
                      Chèn hình
                      <input type="file" accept="image/*" onChange={(e) => insertImage(e.currentTarget, eventEditorRef.current)} className="hidden" />
                    </label>
                  </div>
                  <div ref={eventEditorRef} contentEditable className="w-full min-h-[120px] border border-t-0 border-slate-300 rounded-b-xl p-3 text-xs outline-none bg-white"></div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời gian *</label>
                  <input type="text" required value={eventTime} onChange={(e) => setEventTime(e.target.value)} placeholder="07:30 - Ngày 30/08/2026" className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Địa điểm *</label>
                  <input type="text" required value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-xs outline-none" />
                </div>

                <button type="submit" className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition text-xs uppercase shadow">
                  {savingContent ? "Đang lưu…" : "Đăng sự kiện lên hệ thống"}
                </button>
              </form>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-200">
                  <h2 className="text-base font-bold text-[#004A52]">Sự kiện ({events.length})</h2>
                  {events.length > 0 && (
                    <button onClick={handleDeleteAllEvents} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Xóa tất cả</button>
                  )}
                </div>
                {events.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">Chưa có sự kiện nào.</p>
                ) : (
                  <div className="divide-y divide-slate-100 space-y-4">
                    {events.map((ev) => (
                      <div key={ev.id} className="pt-4 first:pt-0 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {ev.cover_image && <img src={ev.cover_image} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
                          <div>
                            <span className="text-[10px] font-bold text-[#007A87] bg-teal-50 px-2 py-0.5 rounded">{ev.category} (+{ev.points} đ)</span>
                            <h3 className="text-sm font-bold text-slate-800 mt-1">{ev.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={async () => {
                            try {
                              const result = await getEventQr(String(ev.id));
                              if (result.error) return alert(result.error);
                              setActiveQrEvent({ ...ev, qrUrl: result.url });
                            } catch {
                              alert("Không tải được mã QR. Vui lòng thử lại.");
                            }
                          }} className="bg-[#007A87] text-white font-bold text-xs px-3 py-1.5 rounded-xl">Mã QR</button>
                          <button onClick={() => handleDeleteSingleEvent(ev.id, ev.title)} className="text-red-600 text-xs font-bold hover:underline">Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: BÀI VIẾT & CHUYÊN MỤC */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CỘT TRÁI: FORM ĐĂNG / SỬA BÀI VIẾT */}
            <div id="post-form-section" className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-[#004A52]">
                    {editingPostId ? "Chỉnh sửa bài viết" : "Tạo bài viết & chuyên mục mới"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {editingPostId
                      ? `Đang chỉnh sửa bài viết ID #${editingPostId}`
                      : "Đăng tải bài viết vào 'Xem gì hôm nay', 'Bản tin học thuật', 'Gương sáng FME'..."}
                  </p>
                </div>
                {editingPostId && (
                  <button
                    type="button"
                    onClick={handleCancelEditPost}
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    Hủy sửa
                  </button>
                )}
              </div>

              <form inert={savingContent} aria-busy={savingContent} onSubmit={e => saveContent(e, handleAddPost)} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tiêu đề bài viết *</label>
                  <input
                    type="text"
                    required
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Chuyên mục hiển thị *</label>
                  <select
                    value={postCategory}
                    onChange={(e) => setPostCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none bg-white font-medium focus:border-[#EE6425]"
                  >
                    <option value="Xem gì hôm nay">Xem gì hôm nay</option>
                    <option value="Bản tin học thuật">Bản tin học thuật</option>
                    <option value="Gương sáng FME">Gương sáng FME</option>
                    <option value="Phong trào">Phong trào</option>
                    <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                    <option value="Tổ chức - Đoàn thể">Tổ chức - Đoàn thể</option>
                    <option value="Tình nguyện">Tình nguyện</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ảnh bìa bài viết</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="url"
                      placeholder="Dán link ảnh trực tiếp (hoặc bấm chọn tệp) ->"
                      value={postCoverImage}
                      onChange={(e) => setPostCoverImage(e.target.value)}
                      className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#EE6425]"
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer border border-slate-300 text-center whitespace-nowrap">
                      Chọn tệp ảnh
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => pickImage(e.currentTarget, url => { releasePreview(postCoverImage); setPostCoverImage(url); })}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {postCoverImage && (
                    <div className="relative mt-2 inline-block">
                      <img src={postCoverImage} alt="" className="h-24 rounded-xl object-cover border border-slate-200" />
                      <button
                        type="button"
                        onClick={() => { releasePreview(postCoverImage); setPostCoverImage(""); }}
                        className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center font-bold shadow"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi tiết</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                    <button type="button" onClick={() => formatText("bold")} className="px-2.5 py-1 bg-white border border-slate-300 rounded-md font-black hover:bg-slate-100">B</button>
                    <button type="button" onClick={() => formatText("italic")} className="px-2.5 py-1 bg-white border border-slate-300 rounded-md italic hover:bg-slate-100">I</button>
                    <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded-md cursor-pointer hover:bg-orange-100">
                      Chèn hình vào nội dung
                      <input type="file" accept="image/*" onChange={(e) => insertImage(e.currentTarget, editorRef.current)} className="hidden" />
                    </label>
                  </div>
                  <div
                    ref={editorRef}
                    contentEditable
                    className="w-full min-h-[160px] max-h-[350px] overflow-y-auto border border-t-0 border-slate-300 rounded-b-xl p-4 text-sm outline-none bg-white focus:ring-1 focus:ring-[#EE6425]"
                  ></div>
                </div>

                <div className="flex gap-2 pt-2">
                  {editingPostId && (
                    <button
                      type="button"
                      onClick={handleCancelEditPost}
                      className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl text-xs uppercase transition cursor-pointer"
                    >
                      Hủy sửa
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl text-xs uppercase shadow transition cursor-pointer"
                  >
                    {savingContent ? "Đang lưu..." : editingPostId ? "Cập nhật bài viết" : "Xuất bản bài viết"}
                  </button>
                </div>
              </form>
            </div>

            {/* CỘT PHẢI: BỘ LỌC VÀ DANH SÁCH BÀI VIẾT ĐÃ XUẤT BẢN */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <h2 className="text-base font-bold text-[#004A52]">
                    Danh sách bài viết đã xuất bản ({posts.length})
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Quản lý, chỉnh sửa hoặc xóa các bài viết theo chuyên mục.
                  </p>
                </div>
                {posts.length > 0 && (
                  <button
                    onClick={handleDeleteAllPosts}
                    className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-1.5 rounded-lg transition self-start sm:self-auto cursor-pointer"
                  >
                    Xóa tất cả bài
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
                <div className="mb-3">
                  <h3 className="text-sm font-extrabold text-[#004A52]">Quản lý riêng 3 chuyên mục trang chủ</h3>
                  <p className="mt-1 text-xs text-slate-500">Chọn một mục để lọc bài viết và đặt chuyên mục đó cho bài mới.</p>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { name: "Xem gì hôm nay", tone: "border-teal-200 bg-teal-50 text-[#007A87]" },
                    { name: "Bản tin học thuật", tone: "border-blue-200 bg-blue-50 text-blue-700" },
                    { name: "Gương sáng FME", tone: "border-purple-200 bg-purple-50 text-purple-700" },
                  ].map((category) => {
                    const count = posts.filter((post) => post.category === category.name).length;
                    const selected = postFilterCategory === category.name;

                    return (
                      <button
                        key={category.name}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setPostFilterCategory(category.name);
                          setPostCategory(category.name);
                        }}
                        className={`rounded-xl border p-3 text-left transition ${category.tone} ${selected ? "ring-2 ring-[#004A52] ring-offset-1" : "hover:shadow-sm"}`}
                      >
                        <span className="block text-xs font-extrabold">{category.name}</span>
                        <span className="mt-1 block text-[11px] font-semibold opacity-80">{count} bài viết · Quản lý riêng</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* BỘ LỌC CHUYÊN MỤC */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                {[
                  "Tất cả",
                  "Phong trào",
                  "Học thuật - NCKH",
                  "Tổ chức - Đoàn thể",
                ].map((cat) => {
                  const count = cat === "Tất cả" ? posts.length : posts.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setPostFilterCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer text-xs ${
                        postFilterCategory === cat
                          ? "bg-[#007A87] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {cat} ({count})
                    </button>
                  );
                })}
              </div>

              {/* TÌM KIẾM THEO TIÊU ĐỀ */}
              <div>
                <input
                  type="text"
                  placeholder="Tìm nhanh bài viết theo tiêu đề..."
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-[#007A87]"
                />
              </div>

              {/* DANH SÁCH BÀI VIẾT ĐÃ LỌC */}
              {(() => {
                const displayPosts = posts.filter((p) => {
                  const matchCat = postFilterCategory === "Tất cả" || p.category === postFilterCategory;
                  const matchSearch = !postSearch.trim() || p.title?.toLowerCase().includes(postSearch.toLowerCase());
                  return matchCat && matchSearch;
                });

                if (displayPosts.length === 0) {
                  return (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400 text-xs">
                      {posts.length === 0
                        ? "Chưa có bài viết nào được đăng. Hãy dùng biểu mẫu bên trái để xuất bản bài viết đầu tiên!"
                        : "Không tìm thấy bài viết nào phù hợp với bộ lọc này."}
                    </div>
                  );
                }

                return (
                  <div className="divide-y divide-slate-100 space-y-3">
                    {displayPosts.map((p) => (
                      <div key={p.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          {p.cover_image ? (
                            <img
                              src={p.cover_image}
                              alt=""
                              className="w-16 h-12 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                            />
                          ) : (
                            <div className="w-16 h-12 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-[10px] font-black text-[#007A87] flex-shrink-0">
                              FME
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  p.category === "Xem gì hôm nay"
                                    ? "bg-teal-50 text-[#007A87] border border-teal-200"
                                    : p.category === "Bản tin học thuật"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : p.category === "Gương sáng FME"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {p.category || "Chưa phân loại"}
                              </span>
                              {p.date && <span className="text-[10px] text-slate-400 font-medium">{p.date}</span>}
                            </div>
                            <h3 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 line-clamp-2 leading-snug">
                              {p.title}
                            </h3>
                          </div>
                        </div>

                        {/* CÁC NÚT THAO TÁC */}
                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                          <Link
                            href={`/tin-tuc/${p.id}`}
                            target="_blank"
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-lg transition"
                            title="Xem trước bài viết trên trang"
                          >
                            Xem
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleStartEditPost(p)}
                            className="bg-orange-50 hover:bg-orange-100 text-[#EE6425] text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSinglePost(p.id, p.title)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1.5 rounded-lg transition cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* TAB: QUẢN LÝ BANNER TRANG CHỦ */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            {/* FORM THÊM / SỬA BANNER */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-sm font-black text-[#004A52] uppercase">
                    {editingBannerId ? "Chỉnh sửa Banner" : "Thêm Banner mới cho Trang chủ"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Ảnh banner sẽ được hiển thị dạng slider chuyển đổi qua lại ở đầu Trang chủ.
                  </p>
                </div>
                {editingBannerId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBannerId(null);
                      setNewBannerImage("");
                      setNewBannerTitle("");
                      setNewBannerLink("");
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold px-3 py-1.5 rounded-lg border border-slate-200"
                  >
                    Hủy sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleAddOrEditBanner} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* HÌNH ẢNH BANNER */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="block font-bold text-slate-700">
                      Hình ảnh Banner * <span className="font-normal text-slate-500">(Khuyến nghị tỉ lệ ngang 16:9 hoặc khoảng 1200x500px)</span>
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        placeholder="Dán link ảnh trực tiếp (hoặc bấm nút tải ảnh bên phải) ->"
                        value={newBannerImage}
                        onChange={(e) => setNewBannerImage(e.target.value)}
                        required
                        className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#EE6425]"
                      />
                      <label className="cursor-pointer bg-[#004A52] hover:bg-[#00343a] text-white font-bold px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition text-xs whitespace-nowrap">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{uploadingBannerFile ? "Đang tải ảnh lên Cloudinary..." : "Tải ảnh từ máy"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingBannerFile}
                          onChange={handleBannerFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* PREVIEW ẢNH */}
                    {newBannerImage && (
                      <div className="mt-3 relative max-w-xl rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                        <img
                          src={newBannerImage}
                          alt="Xem trước banner"
                          className="w-full h-44 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setNewBannerImage("")}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow"
                          title="Xóa ảnh này"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="submit"
                    disabled={uploadingBannerFile || savingBanners}
                    className="bg-[#EE6425] hover:bg-[#d85216] text-white px-6 py-2.5 rounded-xl font-bold text-xs transition shadow cursor-pointer disabled:opacity-50"
                  >
                    {savingBanners
                      ? "Đang lưu..."
                      : editingBannerId
                      ? "Lưu thay đổi Banner"
                      : "+ Thêm Banner vào Slider"}
                  </button>
                </div>
              </form>
            </div>

            {/* DANH SÁCH BANNERS HIỆN TẠI */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-[#004A52] uppercase">
                Danh sách Banner đang hiển thị trên Trang chủ ({banners.length})
              </h2>

              {loadingBanners ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Đang tải danh sách banner...
                </div>
              ) : banners.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Chưa có banner nào. Hãy thêm banner mới ở khung phía trên!
                </div>
              ) : (
                <div className="space-y-3">
                  {banners.map((banner, index) => (
                    <div
                      key={banner.id || index}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition flex flex-col sm:flex-row items-center gap-4 text-xs"
                    >
                      {/* VỊ TRÍ & ẢNH */}
                      <span className="font-bold text-slate-400 w-6 text-center text-sm font-mono">
                        #{index + 1}
                      </span>

                      <div className="w-full sm:w-48 h-24 rounded-xl overflow-hidden bg-slate-900 border border-slate-200 flex-shrink-0">
                        <img
                          src={banner.image}
                          alt={banner.title || "Banner"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* CHI TIẾT */}
                      <div className="flex-1 min-w-0 space-y-1 text-center sm:text-left">
                        <div className="font-bold text-slate-800 text-sm truncate">
                          Banner #{index + 1}
                        </div>
                        <div className="text-slate-400 text-[10px] truncate">
                          URL: {banner.image}
                        </div>
                      </div>

                      {/* THAO TÁC SẮP XẾP & XÓA / SỬA */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveBanner(index, "up")}
                          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
                          title="Đưa banner lên trước"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          disabled={index === banners.length - 1}
                          onClick={() => handleMoveBanner(index, "down")}
                          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition cursor-pointer"
                          title="Đưa banner xuống sau"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBannerId(banner.id);
                            setNewBannerImage(banner.image);
                            setNewBannerTitle(banner.title || "");
                            setNewBannerLink(banner.link || "");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition cursor-pointer"
                          title="Chỉnh sửa thông tin banner này"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBanner(banner.id, banner.title)}
                          className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-bold transition cursor-pointer"
                          title="Xóa banner này"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {activeQrEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-[#EE6425] text-center">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-orange-100 text-[#EE6425] font-black text-xs px-3 py-1 rounded-full uppercase">MÀN HÌNH QR</span>
              <button onClick={() => setActiveQrEvent(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>
            <h2 className="text-xl font-black text-[#004A52]">{activeQrEvent.title}</h2>
            <div className="my-6 p-4 bg-slate-50 rounded-2xl inline-block">
              <img src={activeQrEvent.qrUrl} alt="QR" className="w-56 h-56 mx-auto rounded-xl" />
            </div>
            <p className="text-xs text-[#007A87] font-bold">Mã Check-in: <code className="text-[#EE6425]">{activeQrEvent.id}</code></p>
          </div>
        </div>
      )}
    </main>
  );
}

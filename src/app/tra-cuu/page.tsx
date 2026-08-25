"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// Dữ liệu tiêu chí đầy đủ chuẩn Quyết định 147/QĐ-ĐHKTCN
const DRL_SECTIONS = [
  {
    id: "sec1",
    title: "I. Đánh giá về ý thức tham gia học tập",
    maxPoints: 20,
    items: [
      {
        id: "1_1",
        title: "1. Sinh viên có điểm trung bình học tập tích lũy với thang điểm 4",
        subtext: "Loại Trung bình (2.0 - 2.49): 2 điểm | Loại Khá (2.5 - 3.19): 3 điểm | Loại Giỏi (3.2 - 3.59): 4 điểm | Loại Xuất sắc (3.6 - 4.0): 5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "",
      },
      {
        id: "1_2",
        title: "2. Có giấy chứng nhận tham gia học các lớp chuyên đề kỹ năng học tập trong và ngoài Trường",
        subtext: "Sinh viên có minh chứng (giấy xác nhận, giấy chứng nhận, giấy khen, bằng khen, ...)",
        max: 3,
        maxLabel: "3 đ/học kỳ",
        minus: "",
      },
      {
        id: "1_3",
        title: "3. Hội thảo hoặc Tọa đàm do Khoa hoặc Trường tổ chức",
        subtext: "Tham gia trực tiếp: 3 đ/lần | Tham gia trực tuyến: 1 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
      {
        id: "1_4",
        title: "4. Các cuộc thi học thuật cấp Khoa hoặc Trường tổ chức trực tiếp hoặc trực tuyến",
        subtext: "Tham dự / Cổ vũ: 1 đ/lần | Ban tổ chức: 2 đ/lần | Tham gia: 3 đ/lần | Đạt giải Khuyến khích, giải phụ: 4 đ/lần | Đạt giải Nhì, Ba: 5 đ/lần | Đạt giải Nhất: 6 đ/lần | Đạt giải Đặc biệt: 7 đ/lần",
        max: 7,
        maxLabel: "7 đ/lần",
        minus: "",
      },
      {
        id: "1_5",
        title: "5. Các cuộc thi học thuật do các đơn vị bên ngoài trường tổ chức",
        subtext: "Tham dự / Cổ vũ: 2 đ/lần | Ban tổ chức: 3 đ/lần | Tham gia: 4 đ/lần | Đạt giải Khuyến khích, giải phụ: 5 đ/lần | Đạt giải Nhì, Ba: 6 đ/lần | Đạt giải Nhất: 7 đ/lần | Đạt giải Đặc biệt: 8 đ/lần",
        max: 8,
        maxLabel: "8 đ/lần",
        minus: "",
      },
      {
        id: "1_6",
        title: "6. Báo cáo khoa học cấp Khoa",
        subtext: "Đề tài đạt loại Trung bình: 3 đ/lần | Đề tài đạt loại Khá: 4 đ/lần | Đề tài đạt loại Tốt: 6 đ/lần | Đề tài đạt loại Xuất sắc: 8 đ/lần",
        max: 8,
        maxLabel: "8 đ/lần",
        minus: "",
      },
      {
        id: "1_7",
        title: "7. Tham gia đề tài Nghiên cứu khoa học Trường (không tính bài tập, tiểu luận, đồ án môn học, luận văn …)",
        subtext: "Đề tài đạt loại Trung bình: 5 đ/lần | Đề tài đạt loại Khá: 6 đ/lần | Đề tài đạt loại Tốt: 8 đ/lần | Đề tài đạt loại Xuất sắc: 10 đ/lần",
        max: 10,
        maxLabel: "10 đ/lần",
        minus: "",
      },
      {
        id: "1_8",
        title: "8. Viết bài báo khoa học trong và ngoài Trường",
        subtext: "Được đăng trên kỷ yếu, bản tin: 5 đ/lần | Được đăng trên tạp chí khoa học: 8 đ/lần",
        max: 8,
        maxLabel: "8 đ/lần",
        minus: "",
      },
      {
        id: "1_9",
        title: "9. Các cuộc thi khởi nghiệp do Trường tổ chức",
        subtext: "Tham dự / Cổ vũ: 1 đ/lần | Ban tổ chức: 2 đ/lần | Tham gia: 3 đ/lần | Giải Khuyến khích, giải phụ: 4 đ/lần | Giải Nhì, Ba: 5 đ/lần | Giải Nhất: 6 đ/lần | Giải Đặc biệt: 7 đ/lần",
        max: 7,
        maxLabel: "7 đ/lần",
        minus: "",
      },
      {
        id: "1_10",
        title: "10. Các cuộc thi khởi nghiệp do đơn vị ngoài Trường tổ chức",
        subtext: "Tham dự / Cổ vũ: 2 đ/lần | Ban tổ chức: 3 đ/lần | Tham gia: 4 đ/lần | Giải Khuyến khích, giải phụ: 5 đ/lần | Giải Nhì, Ba: 6 đ/lần | Giải Nhất: 7 đ/lần | Giải Đặc biệt: 8 đ/lần",
        max: 8,
        maxLabel: "8 đ/lần",
        minus: "",
      },
      {
        id: "1_11",
        title: "11. Thành viên các câu lạc bộ học thuật cấp Khoa, Trường",
        subtext: "Sinh viên có minh chứng (giấy xác nhận, giấy chứng nhận, giấy khen, bằng khen, ...)",
        max: 2,
        maxLabel: "2 đ/học kỳ",
        minus: "",
      },
      {
        id: "1_12",
        title: "12. Các hoạt động học tập khác",
        subtext: "Tham gia trực tiếp: 3 đ/lần | Tham gia trực tuyến: 1 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
    ],
  },
  {
    id: "sec2",
    title: "II. Đánh giá về ý thức chấp hành nội quy, quy chế và các quy định của Nhà trường",
    maxPoints: 25,
    items: [
      {
        id: "2_1",
        title: "1. Sinh viên có ý thức, thái độ trong học tập",
        subtext: "Đi học đầy đủ, đúng giờ, nghiêm túc: +5 điểm | Mỗi buổi nghỉ học không phép: -3 điểm | Đi muộn (3 lần): -1 điểm | Bỏ tiết (3 lần): -1 điểm | Bị cấm thi: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_2",
        title: "2. Sinh viên có ý thức chấp hành tốt, đầy đủ các nội quy, quy chế và các quy định của Nhà trường",
        subtext: "Chấp hành tốt: +5 điểm | Điểm trừ khi có quyết định kỷ luật: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_3",
        title: "3. Sinh viên thực hiện tốt quy chế khi tham gia các kỳ thi, cuộc thi",
        subtext: "Thực hiện tốt: +5 điểm | Điểm trừ khi có quyết định kỷ luật: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_4",
        title: "4. Chấp hành quy định của thư viện",
        subtext: "Chấp hành tốt: +5 điểm | Điểm trừ khi có quyết định kỷ luật: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_5",
        title: "5. Chấp hành quy định của phòng học, phòng máy, phòng thực hành",
        subtext: "Chấp hành tốt: +5 điểm | Điểm trừ khi có quyết định kỷ luật: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_6",
        title: "6. Thực hiện đăng ký ngoại trú",
        subtext: "Thực hiện đầy đủ, đúng hạn: +5 điểm | Không thực hiện: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_7",
        title: "7. Mặc đồng phục đúng quy định",
        subtext: "Thực hiện đúng quy định: +5 điểm | Điểm trừ khi vi phạm: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
      {
        id: "2_8",
        title: "8. Sinh hoạt lớp với Cố vấn học tập",
        subtext: "Tham gia đầy đủ: +5 điểm | Không sinh hoạt lớp không có lý do: -5 điểm",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "-5 đ",
      },
    ],
  },
  {
    id: "sec3",
    title: "III. Đánh giá về ý thức tham gia các hoạt động chính trị, xã hội, văn hóa, văn nghệ, thể thao, phòng chống tội phạm và các tệ nạn xã hội",
    maxPoints: 20,
    items: [
      {
        id: "3_1",
        title: "1. Hoạt động bắt buộc do Khoa hoặc Trường tổ chức",
        subtext: "Tham gia đầy đủ: +3 đ/lần | Vắng không lý do: -3 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "-3 đ/lần",
      },
      {
        id: "3_2",
        title: "2. Đại hội Chi Đoàn / Chi Hội; sinh hoạt Chi Đoàn / Chi Hội",
        subtext: "Tham gia đầy đủ: +3 đ/lần | Vắng không lý do: -3 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "-3 đ/lần",
      },
      {
        id: "3_3",
        title: "3. Báo cáo chuyên đề do Trường tổ chức trực tiếp hoặc trực tuyến",
        subtext: "Tham dự / Cổ vũ: 1 đ/lần | Ban tổ chức: 2 đ/lần | Tham gia: 4 đ/lần",
        max: 4,
        maxLabel: "4 đ/lần",
        minus: "",
      },
      {
        id: "3_4",
        title: "4. Hoạt động ngoại khóa hoặc các cuộc thi do các Câu lạc bộ, Khoa, Trường hoặc đơn vị ngoài Trường tổ chức trực tiếp hoặc trực tuyến",
        subtext: "Tham dự / Cổ vũ: 1 đ/lần | Ban tổ chức: 2 đ/lần | Tham gia: 3 đ/lần | Giải Khuyến khích, giải phụ: 4 đ/lần | Giải Nhì, Ba: 5 đ/lần | Giải Nhất: 6 đ/lần | Giải Đặc biệt: 7 đ/lần",
        max: 7,
        maxLabel: "7 đ/lần",
        minus: "",
      },
      {
        id: "3_5",
        title: "5. Hoạt động ngoại khóa hoặc các cuộc thi từ cấp Thành phố trở lên",
        subtext: "Tham dự / Cổ vũ: 1 đ/lần | Ban tổ chức: 3 đ/lần | Tham gia: 4 đ/lần | Giải Khuyến khích, giải phụ: 5 đ/lần | Giải Nhì, Ba: 6 đ/lần | Giải Nhất: 7 đ/lần | Giải Đặc biệt: 8 đ/lần",
        max: 8,
        maxLabel: "8 đ/lần",
        minus: "",
      },
      {
        id: "3_6",
        title: "6. Được kết nạp Đoàn",
        subtext: "Chỉ được cộng một lần vào học kỳ kết nạp: 5 điểm",
        max: 5,
        maxLabel: "5 đ",
        minus: "",
      },
      {
        id: "3_7",
        title: "7. Được kết nạp Đảng",
        subtext: "Chỉ được cộng một lần vào học kỳ kết nạp: 8 điểm",
        max: 8,
        maxLabel: "8 đ",
        minus: "",
      },
      {
        id: "3_8",
        title: "8. Các hoạt động, phong trào do các đơn vị, Đoàn, Hội điều động",
        subtext: "Tham gia: 2 đ/lần | Ban tổ chức: 4 đ/lần",
        max: 4,
        maxLabel: "4 đ/lần",
        minus: "",
      },
      {
        id: "3_9",
        title: "9. Thành viên các Câu lạc bộ, đội, nhóm thuộc Đoàn Thanh niên, Hội Sinh viên",
        subtext: "Sinh viên có minh chứng (giấy xác nhận, giấy chứng nhận, quyết định công nhận, ...)",
        max: 2,
        maxLabel: "2 đ/học kỳ",
        minus: "",
      },
      {
        id: "3_10",
        title: "10. Hoạt động 'Học tập các bài lý luận chính trị'",
        subtext: "Sinh viên tham gia và hoàn thành bài kiểm tra: 4 đ/lần",
        max: 4,
        maxLabel: "4 đ/lần",
        minus: "",
      },
      {
        id: "3_11",
        title: "11. Hoạt động đền ơn đáp nghĩa, Thắp nến tri ân",
        subtext: "Tham gia các hoạt động kỷ niệm, viếng nghĩa trang: 3 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
      {
        id: "3_12",
        title: "12. Hoạt động lao động tình nguyện tại Trường",
        subtext: "Tham gia vệ sinh khuôn viên, dọn dẹp giảng đường, xưởng: 3 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
      {
        id: "3_13",
        title: "13. Được khen thưởng trong các hoạt động phong trào",
        subtext: "Giấy khen hoặc tương đương: 5 đ/lần | Bằng khen hoặc tương đương: 7 đ/lần",
        max: 7,
        maxLabel: "7 đ/lần",
        minus: "",
      },
      {
        id: "3_14",
        title: "14. Tập thể được khen thưởng trong các hoạt động phong trào",
        subtext: "Mỗi sinh viên trong tập thể được 1 điểm khi có giấy khen tập thể: 1 đ/lần",
        max: 1,
        maxLabel: "1 đ/lần",
        minus: "",
      },
      {
        id: "3_15",
        title: "15. Các hoạt động phong trào khác",
        subtext: "Tham gia trực tiếp: 3 đ/lần | Tham gia trực tuyến: 1 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
    ],
  },
  {
    id: "sec4",
    title: "IV. Đánh giá về ý thức công dân trong quan hệ cộng đồng",
    maxPoints: 25,
    items: [
      {
        id: "4_1",
        title: "1. Sinh viên chấp hành luật pháp, các quy định của Nhà nước và không có thông báo do công an hoặc các đơn vị khác gửi về Trường",
        subtext: "Chấp hành tốt: +10 đ/lần | Có hành vi chưa tốt, có văn bản thông báo của công an: -5 đ/lần",
        max: 10,
        maxLabel: "10 đ/lần",
        minus: "-5 đ/lần",
      },
      {
        id: "4_2",
        title: "2. Sinh viên có hành vi tốt, có tinh thần sẻ chia, giúp đỡ người yếu thế được ghi nhận bằng văn bản",
        subtext: "Ghi nhận bằng văn bản (giấy khen, giấy chứng nhận, quyết định, ...) từ cấp xã, phường hoặc cấp trường trở lên: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_3",
        title: "3. Sinh viên được biểu dương, khen thưởng về tham gia các hoạt động xã hội và cộng đồng ngoài trường",
        subtext: "Được ghi nhận bằng văn bản từ cấp xã, phường hoặc từ cấp trường trở lên: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_4",
        title: "4. Giao lưu chương trình 'Giao lưu các câu lạc bộ, đội, nhóm trực thuộc'",
        subtext: "Tham gia: 3 đ/lần | Ban tổ chức: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_5",
        title: "5. Chương trình 'Tư vấn tuyển sinh'",
        subtext: "Tham gia hỗ trợ ban tư vấn tuyển sinh: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_6",
        title: "6. Công tác nhập học",
        subtext: "Tham gia hỗ trợ làm thủ tục nhập học cho tân sinh viên: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_7",
        title: "7. Công tác khám sức khỏe sinh viên đầu khóa",
        subtext: "Tham gia hỗ trợ công tác khám sức khỏe: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_8",
        title: "8. Công tác Ngày hội việc làm",
        subtext: "Tham gia hỗ trợ tổ chức ngày hội việc làm: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_9",
        title: "9. Công tác tổ chức Lễ Tốt nghiệp",
        subtext: "Tham gia phục vụ, hỗ trợ công tác Lễ tốt nghiệp: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_10",
        title: "10. Công tác kiểm tra hồ sơ sinh viên",
        subtext: "Tham gia hỗ trợ kiểm tra, rà soát hồ sơ sinh viên: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_11",
        title: "11. Tham gia các phiên giao dịch việc làm",
        subtext: "Tư vấn tại góc việc làm, cà phê việc làm tại Trường: 1 đ/lần | Cà phê việc làm tại TT DVVL: 2 đ/lần | Phiên giao dịch việc làm khu vực: 3 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
      {
        id: "4_12",
        title: "12. Hiến máu tình nguyện",
        subtext: "Trực tiếp tham gia hiến máu: 10 đ/lần | Ban tổ chức: 5 đ/lần",
        max: 10,
        maxLabel: "10 đ/lần",
        minus: "",
      },
      {
        id: "4_13",
        title: "13. Chương trình 'Xuân tình nguyện'",
        subtext: "Tham gia: 4 đ/lần | Ban tổ chức: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_14",
        title: "14. Chiến dịch tình nguyện 'Mùa hè xanh'",
        subtext: "Tham gia: 5 đ/lần | Ban tổ chức: 7 đ/lần",
        max: 7,
        maxLabel: "7 đ/lần",
        minus: "",
      },
      {
        id: "4_15",
        title: "15. Chương trình 'Ngày Chủ nhật xanh'",
        subtext: "Tham gia: 3 đ/lần | Ban tổ chức: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_16",
        title: "16. Chương trình 'Thứ Bảy tình nguyện'",
        subtext: "Tham gia: 3 đ/lần | Ban tổ chức: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_17",
        title: "17. Chương trình 'Chào đón tân sinh viên'",
        subtext: "Tham gia: 3 đ/lần | Ban tổ chức: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "4_18",
        title: "18. Tham gia các hoạt động thực hiện trách nhiệm xã hội và phát triển bền vững",
        subtext: "Tham gia trực tiếp: 3 đ/lần | Tham gia trực tuyến: 1 đ/lần",
        max: 3,
        maxLabel: "3 đ/lần",
        minus: "",
      },
    ],
  },
  {
    id: "sec5",
    title: "V. Đánh giá về ý thức và kết quả khi tham gia công tác cán bộ lớp, các đoàn thể, tổ chức trong Nhà trường hoặc người học đạt được thành tích đặc biệt trong học tập, rèn luyện",
    maxPoints: 10,
    items: [
      {
        id: "5_1",
        title: "1. Tham gia tích cực vào phong trào của Lớp, Đoàn, Hội sinh viên và các công tác đoàn thể xã hội khác",
        subtext: "Cộng 1 điểm/hoạt động (Tối đa 3 điểm) có xác nhận của Đoàn, Hội cấp trên hoặc xác nhận của Cố vấn học tập",
        max: 3,
        maxLabel: "3 đ/học kỳ",
        minus: "",
      },
      {
        id: "5_2",
        title: "2. Phát huy vai trò và hoàn thành tốt nhiệm vụ người cán bộ Chi đoàn, Lớp, Câu lạc bộ, đội, nhóm",
        subtext: "UVBCH Đoàn Trường, UVBCH Hội Sinh viên, Chủ nhiệm CLB, Lớp trưởng: 5 đ/học kỳ | Phó chủ nhiệm CLB, Đội trưởng/Đội phó cấp Trường: 4 đ/học kỳ | UVBCH Chi đoàn, UV Chi hội, Đội tự quản: 3 đ/học kỳ",
        max: 5,
        maxLabel: "5 đ/học kỳ",
        minus: "",
      },
      {
        id: "5_3",
        title: "3. Sinh viên đạt giải về học tập, Nghiên cứu khoa học",
        subtext: "Cấp Thành phố, Khu vực (Khuyến khích: 3đ, Ba: 4đ, Nhì: 5đ, Nhất: 6đ) | Cấp Toàn quốc (Khuyến khích: 4đ, Ba: 5đ, Nhì: 6đ, Nhất: 7đ)",
        max: 7,
        maxLabel: "7 đ/lần",
        minus: "",
      },
      {
        id: "5_4",
        title: "4. Sinh viên được tặng Bằng khen của UBND Tỉnh, Thành phố (hoặc tương đương) về các hoạt động chính trị, văn hóa - xã hội, thể thao, phòng chống tệ nạn xã hội, giữ gìn trật tự xã hội, cứu người …",
        subtext: "Có quyết định khen thưởng hoặc Bằng khen: 5 đ/lần",
        max: 5,
        maxLabel: "5 đ/lần",
        minus: "",
      },
      {
        id: "5_5",
        title: "5. Sinh viên đạt danh hiệu Sinh viên 5 tốt cấp Trường, Đoàn viên tiêu biểu, Thanh niên tiên tiến làm theo lời Bác, giải thưởng tình nguyện của năm … hoặc các danh hiệu khác",
        subtext: "Có giấy chứng nhận hoặc quyết định công nhận: 6 đ/lần",
        max: 6,
        maxLabel: "6 đ/lần",
        minus: "",
      },
      {
        id: "5_6",
        title: "6. Sinh viên đạt danh hiệu Sinh viên 5 tốt cấp Thành, Trung ương, giải thưởng Sao Tháng Giêng",
        subtext: "Có giấy chứng nhận hoặc quyết định công nhận: 10 đ/lần",
        max: 10,
        maxLabel: "10 đ/lần",
        minus: "",
      },
      {
        id: "5_7",
        title: "7. Đạt danh hiệu Đoàn viên ưu tú",
        subtext: "Được công nhận danh hiệu Đoàn viên ưu tú trong học kỳ: 6 đ/lần",
        max: 6,
        maxLabel: "6 đ/lần",
        minus: "",
      },
      {
        id: "5_8",
        title: "8. Giấy khen tập thể của Đoàn được trao cho những tập thể có thành tích xuất sắc, tiêu biểu, hoàn thành tốt các nhiệm vụ của Đoàn",
        subtext: "Mỗi sinh viên trong tập thể được 2 điểm khi có giấy khen tập thể: 2 đ/SV",
        max: 2,
        maxLabel: "2 đ/SV",
        minus: "",
      },
    ],
  },
];

// Danh sách tra cứu mức điểm tối đa cho từng mục dropdown
const CATEGORY_MAX_POINTS: { [key: string]: number } = {
  "I.1. Điểm trung bình học tập tích lũy hệ 4": 5,
  "I.2. Chứng nhận lớp chuyên đề kỹ năng học tập": 3,
  "I.3. Hội thảo hoặc Tọa đàm Khoa/Trường": 3,
  "I.4. Cuộc thi học thuật cấp Khoa hoặc Trường": 7,
  "I.5. Cuộc thi học thuật bên ngoài Trường": 8,
  "I.6. Báo cáo khoa học cấp Khoa": 8,
  "I.7. Đề tài Nghiên cứu khoa học Trường": 10,
  "I.8. Viết bài báo khoa học trong và ngoài Trường": 8,
  "I.9. Cuộc thi khởi nghiệp do Trường tổ chức": 7,
  "I.10. Cuộc thi khởi nghiệp đơn vị ngoài tổ chức": 8,
  "I.11. Thành viên CLB học thuật cấp Khoa, Trường": 2,
  "I.12. Các hoạt động học tập khác": 3,
  "II.1. Ý thức, thái độ trong học tập": 5,
  "II.2. Chấp hành nội quy, quy chế Nhà trường": 5,
  "II.3. Thực hiện quy chế kỳ thi, cuộc thi": 5,
  "II.4. Chấp hành quy định của thư viện": 5,
  "II.5. Chấp hành quy định phòng học, xưởng thực hành": 5,
  "II.6. Thực hiện đăng ký ngoại trú": 5,
  "II.7. Mặc đồng phục đúng quy định": 5,
  "II.8. Sinh hoạt lớp với Cố vấn học tập": 5,
  "III.1. Hoạt động bắt buộc do Khoa/Trường tổ chức": 3,
  "III.2. Đại hội Chi Đoàn/Chi Hội, sinh hoạt Chi Đoàn": 3,
  "III.3. Báo cáo chuyên đề do Trường tổ chức": 4,
  "III.4. Ngoại khóa/Cuộc thi cấp CLB, Khoa, Trường": 7,
  "III.5. Ngoại khóa/Cuộc thi cấp Thành phố trở lên": 8,
  "III.6. Được kết nạp Đoàn": 5,
  "III.7. Được kết nạp Đảng": 8,
  "III.8. Hoạt động do đơn vị, Đoàn, Hội điều động": 4,
  "III.9. Thành viên CLB/Đội/Nhóm Đoàn - Hội": 2,
  "III.10. Hoạt động Học tập các bài lý luận chính trị": 4,
  "III.11. Đền ơn đáp nghĩa, Thắp nến tri ân": 3,
  "III.12. Hoạt động lao động tình nguyện tại Trường": 3,
  "III.13. Khen thưởng cá nhân trong hoạt động phong trào": 7,
  "III.14. Tập thể được khen thưởng phong trào": 1,
  "III.15. Các hoạt động phong trào khác": 3,
  "IV.1. Chấp hành luật pháp, quy định Nhà nước": 10,
  "IV.2. Giúp đỡ người yếu thế, hành vi tốt có xác nhận": 5,
  "IV.3. Biểu dương, khen thưởng hoạt động xã hội ngoài trường": 5,
  "IV.4. Giao lưu các CLB, Đội, Nhóm trực thuộc": 5,
  "IV.5. Chương trình Tư vấn tuyển sinh": 5,
  "IV.6. Công tác nhập học tân sinh viên": 5,
  "IV.7. Khám sức khỏe sinh viên đầu khóa": 5,
  "IV.8. Công tác Ngày hội việc làm": 5,
  "IV.9. Công tác tổ chức Lễ Tốt nghiệp": 5,
  "IV.10. Công tác kiểm tra hồ sơ sinh viên": 5,
  "IV.11. Tham gia các phiên giao dịch việc làm": 3,
  "IV.12. Hiến máu tình nguyện": 10,
  "IV.13. Chương trình Xuân tình nguyện": 5,
  "IV.14. Chiến dịch tình nguyện Mùa hè xanh": 7,
  "IV.15. Chương trình Ngày Chủ nhật xanh": 5,
  "IV.16. Chương trình Thứ Bảy tình nguyện": 5,
  "IV.17. Chương trình Chào đón tân sinh viên": 5,
  "IV.18. Hoạt động trách nhiệm xã hội, phát triển bền vững": 3,
  "V.1. Tham gia tích cực phong trào Lớp, Đoàn, Hội": 3,
  "V.2. Hoàn thành tốt nhiệm vụ cán bộ Lớp, Chi đoàn, CLB": 5,
  "V.3. Sinh viên đạt giải học tập, Nghiên cứu khoa học": 7,
  "V.4. Bằng khen UBND Tỉnh/Thành phố hoặc tương đương": 5,
  "V.5. Sinh viên 5 tốt cấp Trường, Đoàn viên tiêu biểu": 6,
  "V.6. Sinh viên 5 tốt cấp Thành/TW, giải thưởng Sao Tháng Giêng": 10,
  "V.7. Đạt danh hiệu Đoàn viên ưu tú": 6,
  "V.8. Giấy khen tập thể của Đoàn": 2,
};

export default function CongDRLPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"proof" | "form" | "result">("proof");

  // Dữ liệu minh chứng & hoạt động
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form nộp minh chứng ngoài khoa
  const [proofTitle, setProofTitle] = useState("");
  const [proofCategory, setProofCategory] = useState("I.1. Điểm trung bình học tập tích lũy hệ 4");
  const [proofPoints, setProofPoints] = useState<number>(5);
  const [proofUrl, setProofUrl] = useState("");
  const [submittingProof, setSubmittingProof] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Điểm tự chấm theo từng ID chi tiết { "1_1": 3, "2_1": 5, ... }
  const [scores, setScores] = useState<{ [key: string]: number }>({
    "1_1": 3,
    "2_1": 5,
    "2_2": 5,
    "2_3": 5,
    "2_4": 5,
    "2_5": 5,
    "2_6": 5,
    "2_7": 5,
    "2_8": 5,
    "3_1": 3,
    "3_2": 3,
    "4_1": 10,
    "5_1": 3,
  });

  const [drlStatus, setDrlStatus] = useState<string>("Chưa nộp");
  const [finalScore, setFinalScore] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("ctut_current_user");
    if (!saved) {
      router.push("/dang-nhap?redirect=/tra-cuu");
      return;
    }
    const user = JSON.parse(saved);
    setCurrentUser(user);
    loadData(user.mssv);
  }, [router]);

  const loadData = async (mssv: string) => {
    setLoading(true);
    try {
      const { data: proofData } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", mssv)
        .order("created_at", { ascending: false });

      if (proofData) setProofs(proofData);

      const { data: drlData } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", mssv)
        .maybeSingle();

      if (drlData) {
        setDrlStatus(drlData.status || "Đã nộp, chờ BCH duyệt");
        setFinalScore(drlData.final_score);
        if (drlData.scores_detail) {
          setScores(drlData.scores_detail);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  // Tự động điều chỉnh điểm tối đa theo mục khi đổi dropdown
  const handleCategoryChange = (cat: string) => {
    setProofCategory(cat);
    const maxVal = CATEGORY_MAX_POINTS[cat] || 10;
    setProofPoints(maxVal);
  };

  const handleScoreChange = (itemId: string, val: number, maxVal: number) => {
    const safeVal = Math.min(Math.max(0, val || 0), maxVal);
    setScores((prev) => ({ ...prev, [itemId]: safeVal }));
  };

  // Xử lý tải file trực tiếp lên Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${currentUser.mssv}_${Date.now()}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) {
        // Dự phòng nếu bucket chưa mở public thì tạo blob URL trực tiếp
        const localUrl = URL.createObjectURL(file);
        setProofUrl(localUrl);
        alert("Đã chọn file thành công!");
      } else {
        const { data: urlData } = supabase.storage.from("documents").getPublicUrl(filePath);
        setProofUrl(urlData.publicUrl);
        alert("Tải file lên hệ thống thành công!");
      }
    } catch (err: any) {
      alert("Lỗi tải file: " + err.message);
    }
    setUploadingFile(false);
  };

  // Tính điểm tổng từng phần có khống chế tối đa
  const getSectionScore = (section: any) => {
    const rawSum = section.items.reduce((sum: number, it: any) => sum + (Number(scores[it.id]) || 0), 0);
    return Math.min(rawSum, section.maxPoints);
  };

  // Tổng điểm toàn bộ 5 phần
  const grandTotalScore = DRL_SECTIONS.reduce((total, sec) => total + getSectionScore(sec), 0);

  // Nộp minh chứng hoạt động ngoài khoa
  const handleUploadProof = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofTitle || !proofUrl) {
      alert("Vui lòng điền đầy đủ tên hoạt động và chọn tệp hoặc dán link minh chứng!");
      return;
    }

    setSubmittingProof(true);
    try {
      const newProof = {
        mssv: currentUser.mssv,
        student_name: currentUser.fullName,
        student_class: currentUser.studentClass,
        activity_title: proofTitle,
        category: proofCategory,
        points: Number(proofPoints),
        proof_url: proofUrl,
        source: "Hoạt động ngoài khoa",
        status: "Chờ duyệt",
        created_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("proofs").insert([newProof]);
      if (error) throw error;

      alert("Nộp minh chứng thành công! Đã chuyển thông tin đến BCH Chi đoàn thẩm định.");
      setProofTitle("");
      setProofUrl("");
      loadData(currentUser.mssv);
    } catch (err: any) {
      alert("Lỗi khi nộp minh chứng: " + err.message);
    }
    setSubmittingProof(false);
  };

  // Nộp toàn bộ phiếu ĐRL về BCH Chi đoàn
  const handleSubmitDRLForm = async () => {
    if (!confirm(`Bạn có chắc chắn muốn nộp Phiếu đánh giá Điểm Rèn Luyện với tổng điểm tự chấm là ${grandTotalScore}/100 điểm về BCH Chi đoàn?`)) return;

    try {
      const submission = {
        mssv: currentUser.mssv,
        student_name: currentUser.fullName,
        student_class: currentUser.studentClass,
        self_score: grandTotalScore,
        scores_detail: scores,
        status: "Đã nộp - Chờ BCH Chi đoàn duyệt",
        submitted_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("drl_submissions").upsert([submission], { onConflict: "mssv" });
      if (error) throw error;

      setDrlStatus("Đã nộp - Chờ BCH Chi đoàn duyệt");
      alert("Nộp phiếu đánh giá ĐRL thành công!");
    } catch (err: any) {
      alert("Lỗi nộp phiếu: " + err.message);
    }
  };

  if (!currentUser) return null;

  const currentMaxAllowed = CATEGORY_MAX_POINTS[proofCategory] || 10;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <img
                src="/logo-doankhoa.png"
                alt="Logo Đoàn Khoa Kỹ thuật Cơ khí"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight uppercase">
                CỔNG ĐIỂM RÈN LUYỆN
              </h1>
            </div>

            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              Về trang chủ
            </Link>
          </div>
        </div>

        {/* THÔNG TIN TỔNG QUAN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-2">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs text-slate-500 font-medium">Họ và tên:</span>
              <span className="text-sm font-bold text-slate-800">{currentUser.fullName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <span className="text-xs text-slate-500 font-medium">Mã số sinh viên:</span>
              <span className="text-sm font-bold text-[#EE6425] font-mono">{currentUser.mssv}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Lớp sinh hoạt:</span>
              <span className="text-sm font-bold text-slate-800">{currentUser.studentClass}</span>
            </div>
          </div>

          <div className="bg-[#004A52] text-white rounded-3xl p-6 shadow-sm flex flex-col justify-center items-center text-center">
            <span className="text-xs font-semibold text-teal-100 uppercase tracking-wider">
              Điểm rèn luyện chính thức
            </span>
            <span className="text-4xl font-black my-1 text-white">
              {finalScore !== null ? finalScore : "--"}
            </span>
            <span className="text-[11px] text-teal-200 font-medium">
              Trạng thái: {drlStatus}
            </span>
          </div>
        </div>

        {/* 3 TAB CHỨC NĂNG */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <button
              onClick={() => setActiveTab("proof")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "proof" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              1. Nộp & Quản lý Minh chứng
            </button>
            <button
              onClick={() => setActiveTab("form")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "form" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              2. Nộp Phiếu Điểm Rèn Luyện
            </button>
            <button
              onClick={() => setActiveTab("result")}
              className={`py-3 rounded-2xl transition ${
                activeTab === "result" ? "bg-[#EE6425] text-white shadow" : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              3. Kết quả Điểm Rèn Luyện
            </button>
          </div>
        </div>

        {/* ================= TAB 1: NỘP & QUẢN LÝ MINH CHỨNG ================= */}
        {activeTab === "proof" && (
          <div className="space-y-6">
            {/* Form nộp minh chứng */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-sm font-black text-[#004A52] uppercase mb-4">
                Nộp minh chứng hoạt động ngoài khoa
              </h2>
              <form onSubmit={handleUploadProof} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên hoạt động / Sự kiện *</label>
                  <input
                    type="text"
                    required
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="VD: Hiến máu tình nguyện đợt 1, Tiếp sức mùa thi..."
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425]"
                  />
                </div>

                {/* Dropdown danh mục */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Thuộc hạng mục tiêu chí *</label>
                  <select
                    value={proofCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 outline-none focus:border-[#EE6425] bg-white text-slate-700"
                  >
                    <optgroup label="I. Đánh giá về ý thức tham gia học tập">
                      <option>I.1. Điểm trung bình học tập tích lũy hệ 4</option>
                      <option>I.2. Chứng nhận lớp chuyên đề kỹ năng học tập</option>
                      <option>I.3. Hội thảo hoặc Tọa đàm Khoa/Trường</option>
                      <option>I.4. Cuộc thi học thuật cấp Khoa hoặc Trường</option>
                      <option>I.5. Cuộc thi học thuật bên ngoài Trường</option>
                      <option>I.6. Báo cáo khoa học cấp Khoa</option>
                      <option>I.7. Đề tài Nghiên cứu khoa học Trường</option>
                      <option>I.8. Viết bài báo khoa học trong và ngoài Trường</option>
                      <option>I.9. Cuộc thi khởi nghiệp do Trường tổ chức</option>
                      <option>I.10. Cuộc thi khởi nghiệp đơn vị ngoài tổ chức</option>
                      <option>I.11. Thành viên CLB học thuật cấp Khoa, Trường</option>
                      <option>I.12. Các hoạt động học tập khác</option>
                    </optgroup>

                    <optgroup label="II. Ý thức chấp hành nội quy, quy chế">
                      <option>II.1. Ý thức, thái độ trong học tập</option>
                      <option>II.2. Chấp hành nội quy, quy chế Nhà trường</option>
                      <option>II.3. Thực hiện quy chế kỳ thi, cuộc thi</option>
                      <option>II.4. Chấp hành quy định của thư viện</option>
                      <option>II.5. Chấp hành quy định phòng học, xưởng thực hành</option>
                      <option>II.6. Thực hiện đăng ký ngoại trú</option>
                      <option>II.7. Mặc đồng phục đúng quy định</option>
                      <option>II.8. Sinh hoạt lớp với Cố vấn học tập</option>
                    </optgroup>

                    <optgroup label="III. Hoạt động chính trị, XH, VH-VN-TT, phong trào">
                      <option>III.1. Hoạt động bắt buộc do Khoa/Trường tổ chức</option>
                      <option>III.2. Đại hội Chi Đoàn/Chi Hội, sinh hoạt Chi Đoàn</option>
                      <option>III.3. Báo cáo chuyên đề do Trường tổ chức</option>
                      <option>III.4. Ngoại khóa/Cuộc thi cấp CLB, Khoa, Trường</option>
                      <option>III.5. Ngoại khóa/Cuộc thi cấp Thành phố trở lên</option>
                      <option>III.6. Được kết nạp Đoàn</option>
                      <option>III.7. Được kết nạp Đảng</option>
                      <option>III.8. Hoạt động do đơn vị, Đoàn, Hội điều động</option>
                      <option>III.9. Thành viên CLB/Đội/Nhóm Đoàn - Hội</option>
                      <option>III.10. Hoạt động Học tập các bài lý luận chính trị</option>
                      <option>III.11. Đền ơn đáp nghĩa, Thắp nến tri ân</option>
                      <option>III.12. Hoạt động lao động tình nguyện tại Trường</option>
                      <option>III.13. Khen thưởng cá nhân trong hoạt động phong trào</option>
                      <option>III.14. Tập thể được khen thưởng phong trào</option>
                      <option>III.15. Các hoạt động phong trào khác</option>
                    </optgroup>

                    <optgroup label="IV. Ý thức công dân trong quan hệ cộng đồng">
                      <option>IV.1. Chấp hành luật pháp, quy định Nhà nước</option>
                      <option>IV.2. Giúp đỡ người yếu thế, hành vi tốt có xác nhận</option>
                      <option>IV.3. Biểu dương, khen thưởng hoạt động xã hội ngoài trường</option>
                      <option>IV.4. Giao lưu các CLB, Đội, Nhóm trực thuộc</option>
                      <option>IV.5. Chương trình Tư vấn tuyển sinh</option>
                      <option>IV.6. Công tác nhập học tân sinh viên</option>
                      <option>IV.7. Khám sức khỏe sinh viên đầu khóa</option>
                      <option>IV.8. Công tác Ngày hội việc làm</option>
                      <option>IV.9. Công tác tổ chức Lễ Tốt nghiệp</option>
                      <option>IV.10. Công tác kiểm tra hồ sơ sinh viên</option>
                      <option>IV.11. Tham gia các phiên giao dịch việc làm</option>
                      <option>IV.12. Hiến máu tình nguyện</option>
                      <option>IV.13. Chương trình Xuân tình nguyện</option>
                      <option>IV.14. Chiến dịch tình nguyện Mùa hè xanh</option>
                      <option>IV.15. Chương trình Ngày Chủ nhật xanh</option>
                      <option>IV.16. Chương trình Thứ Bảy tình nguyện</option>
                      <option>IV.17. Chương trình Chào đón tân sinh viên</option>
                      <option>IV.18. Hoạt động trách nhiệm xã hội, phát triển bền vững</option>
                    </optgroup>

                    <optgroup label="V. Cán bộ lớp, Đoàn thể & Thành tích đặc biệt">
                      <option>V.1. Tham gia tích cực phong trào Lớp, Đoàn, Hội</option>
                      <option>V.2. Hoàn thành tốt nhiệm vụ cán bộ Lớp, Chi đoàn, CLB</option>
                      <option>V.3. Sinh viên đạt giải học tập, Nghiên cứu khoa học</option>
                      <option>V.4. Bằng khen UBND Tỉnh/Thành phố hoặc tương đương</option>
                      <option>V.5. Sinh viên 5 tốt cấp Trường, Đoàn viên tiêu biểu</option>
                      <option>V.6. Sinh viên 5 tốt cấp Thành/TW, giải thưởng Sao Tháng Giêng</option>
                      <option>V.7. Đạt danh hiệu Đoàn viên ưu tú</option>
                      <option>V.8. Giấy khen tập thể của Đoàn</option>
                    </optgroup>
                  </select>
                </div>

                {/* Ô điểm tự động giới hạn Max */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-bold text-slate-700">Điểm cộng đề xuất *</label>
                    <span className="text-[11px] font-bold text-[#EE6425]">
                      (Tối đa: {currentMaxAllowed} điểm theo quy định)
                    </span>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max={currentMaxAllowed}
                    value={proofPoints}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setProofPoints(v > currentMaxAllowed ? currentMaxAllowed : v < 1 ? 1 : v);
                    }}
                    className="w-full border border-slate-300 rounded-xl px-4 py-2.5 font-bold text-[#EE6425] outline-none focus:border-[#EE6425]"
                  />
                </div>

                {/* Ô minh chứng kèm Nút tải file */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Link hình ảnh hoặc Tải file minh chứng *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={proofUrl}
                      onChange={(e) => setProofUrl(e.target.value)}
                      placeholder="Dán link Drive/URL hoặc bấm nút tải file ->"
                      className="flex-1 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-[#EE6425]"
                    />
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 font-bold px-3 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition flex-shrink-0 text-xs">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span>{uploadingFile ? "Đang tải..." : "Tải tệp"}</span>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2 pt-2">
                  <button
                    type="submit"
                    disabled={submittingProof || uploadingFile}
                    className="w-full bg-[#EE6425] hover:bg-[#d85216] text-white font-bold py-3 rounded-xl transition shadow"
                  >
                    {submittingProof ? "Đang gửi..." : "Tải lên & Gửi minh chứng cho BCH Chi đoàn"}
                  </button>
                </div>
              </form>
            </div>

            {/* Bảng danh sách minh chứng */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-black text-[#004A52] uppercase">
                  Danh sách minh chứng & Điểm danh đã lưu ({proofs.length})
                </h2>
                <Link
                  href="/diem-danh"
                  className="px-3 py-1.5 rounded-lg bg-[#007A87] hover:bg-[#00606a] text-white font-bold text-xs"
                >
                  Quét QR Điểm danh sự kiện
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-6 text-xs text-slate-400">Đang tải minh chứng...</div>
              ) : proofs.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  Chưa có minh chứng hoặc lượt điểm danh nào. Hãy tham gia hoạt động hoặc nộp minh chứng ngoài khoa bên trên!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="py-2.5">Hoạt động / Sự kiện</th>
                        <th className="py-2.5">Hạng mục tiêu chí</th>
                        <th className="py-2.5">Điểm</th>
                        <th className="py-2.5">Nguồn</th>
                        <th className="py-2.5">Trạng thái</th>
                        <th className="py-2.5 text-right">Minh chứng</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {proofs.map((p, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-3 font-semibold text-slate-800">{p.activity_title}</td>
                          <td className="py-3 text-slate-600">{p.category}</td>
                          <td className="py-3 font-bold text-[#EE6425]">+{p.points}</td>
                          <td className="py-3 text-slate-500">{p.source || "Sự kiện Khoa"}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              p.status === "Đã duyệt" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {p.status || "Đã ghi nhận"}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            {p.proof_url && (
                              <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">
                                Xem tệp
                              </a>
                            )}
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

        {/* ================= TAB 2: PHIẾU ĐÁNH GIÁ (TIÊU MỤC + CHỮ NGHIÊNG NHỎ) ================= */}
        {activeTab === "form" && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base font-black text-[#004A52] uppercase">
                PHIẾU ĐÁNH GIÁ ĐIỂM RÈN LUYỆN HỌC KỲ
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Theo Quyết định số 147/QĐ-ĐHKTCN của Hiệu trưởng Trường Đại học Kỹ thuật - Công nghệ Cần Thơ[cite: 1].
              </p>
            </div>

            {/* BẢNG CHI TIẾT 5 PHẦN */}
            <div className="space-y-6">
              {DRL_SECTIONS.map((section) => {
                const sectionScore = getSectionScore(section);
                return (
                  <div key={section.id} className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    {/* Header từng phần */}
                    <div className="bg-slate-100 p-3.5 flex justify-between items-center text-xs font-black text-[#004A52]">
                      <span>{section.title} (Điểm tối đa là {section.maxPoints} điểm)[cite: 1]</span>
                      <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-[#EE6425]">
                        Tổng phần: {sectionScore} / {section.maxPoints} đ
                      </span>
                    </div>

                    {/* Bảng tiêu chí */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                            <th className="py-2.5 px-4 w-3/5">Nội dung đánh giá</th>
                            <th className="py-2.5 px-2 text-center w-28">Điểm Tối đa</th>
                            <th className="py-2.5 px-2 text-center w-20">Điểm trừ</th>
                            <th className="py-2.5 px-4 text-center w-28">SV Tự chấm</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {section.items.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50/80">
                              <td className="py-3 px-4 text-slate-700">
                                {/* Đề mục chính */}
                                <span className="font-bold block text-slate-800 leading-snug">
                                  {item.title}
                                </span>
                                {/* Dòng chữ nghiêng nhỏ cách chấm */}
                                <span className="block text-[11px] italic text-slate-500 mt-1 leading-relaxed">
                                  {item.subtext}
                                </span>
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-slate-600 align-top pt-4">
                                {item.maxLabel}
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-red-500 align-top pt-4">
                                {item.minus || "-"}
                              </td>
                              <td className="py-3 px-4 text-center align-top pt-3">
                                <input
                                  type="number"
                                  min="0"
                                  max={item.max}
                                  value={scores[item.id] !== undefined ? scores[item.id] : 0}
                                  onChange={(e) => handleScoreChange(item.id, Number(e.target.value), item.max)}
                                  className="w-16 border border-slate-300 rounded-lg px-2 py-1 text-center font-bold text-[#EE6425] outline-none focus:border-[#EE6425]"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tổng điểm và Nộp phiếu */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-orange-50/50 p-4 rounded-2xl">
              <div>
                <span className="text-xs text-slate-500 block">TỔNG ĐIỂM RÈN LUYỆN TOÀN BỘ 5 PHẦN:</span>
                <span className="text-2xl font-black text-[#EE6425]">
                  {grandTotalScore} / 100 điểm
                </span>
                <span className="block text-[11px] text-slate-600 mt-0.5">
                  Xếp loại dự kiến: {grandTotalScore >= 90 ? "Xuất sắc" : grandTotalScore >= 80 ? "Tốt" : grandTotalScore >= 65 ? "Khá" : grandTotalScore >= 50 ? "Trung bình" : "Yếu"}
                </span>
              </div>

              <button
                onClick={handleSubmitDRLForm}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#004A52] hover:bg-[#00343a] text-white font-bold text-xs shadow-md transition uppercase tracking-wider"
              >
                NỘP PHIẾU ĐIỂM RÈN LUYỆN VỀ BCH CHI ĐOÀN
              </button>
            </div>
          </div>
        )}

        {/* ================= TAB 3: KẾT QUẢ CHÍNH THỨC ================= */}
        {activeTab === "result" && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center space-y-4">
            <h2 className="text-base font-black text-[#004A52] uppercase">
              KẾT QUẢ ĐIỂM RÈN LUYỆN CHÍNH THỨC
            </h2>

            <div className="py-6">
              <span className="text-5xl font-black text-[#EE6425]">
                {finalScore !== null ? finalScore : grandTotalScore}
              </span>
              <span className="block text-xs font-bold text-slate-500 mt-2">
                Xếp loại: { (finalScore || grandTotalScore) >= 90 ? "Xuất sắc" : (finalScore || grandTotalScore) >= 80 ? "Tốt" : (finalScore || grandTotalScore) >= 65 ? "Khá" : (finalScore || grandTotalScore) >= 50 ? "Trung bình" : "Yếu" }
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 max-w-md mx-auto text-xs text-teal-800 font-medium leading-relaxed">
              Trạng thái xét duyệt: <strong>{drlStatus}</strong>. Sau khi BCH Chi đoàn lớp và Đoàn Khoa thẩm định hoàn tất, kết quả chính thức sẽ được công bố tại đây.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

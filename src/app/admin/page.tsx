"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export const EVENT_CRITERIA_OPTIONS = [
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

export const DRL_SECTIONS_FULL = [
  {
    id: "sec1",
    title: "I. Đánh giá về ý thức tham gia học tập",
    maxPoints: 20,
    items: [
      { id: "1_1", title: "1. Điểm trung bình học tập tích lũy thang điểm 4", subtext: "Loại Trung bình: 2đ | Khá: 3đ | Giỏi: 4đ | Xuất sắc: 5đ", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "1_2", title: "2. Giấy chứng nhận tham gia lớp chuyên đề kỹ năng học tập", subtext: "Có giấy xác nhận, chứng nhận, giấy khen", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "1_3", title: "3. Hội thảo hoặc Tọa đàm do Khoa hoặc Trường tổ chức", subtext: "Trực tiếp: 3 đ/lần | Trực tuyến: 1 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "1_4", title: "4. Các cuộc thi học thuật cấp Khoa hoặc Trường tổ chức", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 3đ | Giải: 4 đến 7 đ/lần", max: 7, maxLabel: "Tối đa 7 đ" },
      { id: "1_5", title: "5. Các cuộc thi học thuật do đơn vị bên ngoài trường tổ chức", subtext: "Cổ vũ: 2đ | BTC: 3đ | Tham gia: 4đ | Giải: 5 đến 8 đ/lần", max: 8, maxLabel: "Tối đa 8 đ" },
      { id: "1_6", title: "6. Báo cáo khoa học cấp Khoa", subtext: "Trung bình: 3đ | Khá: 4đ | Tốt: 6đ | Xuất sắc: 8 đ/lần", max: 8, maxLabel: "Tối đa 8 đ" },
      { id: "1_7", title: "7. Tham gia đề tài Nghiên cứu khoa học Trường", subtext: "Trung bình: 5đ | Khá: 6đ | Tốt: 8đ | Xuất sắc: 10 đ/lần", max: 10, maxLabel: "Tối đa 10 đ" },
      { id: "1_8", title: "8. Viết bài báo khoa học trong và ngoài Trường", subtext: "Kỷ yếu: 5đ | Tạp chí khoa học: 8 đ/lần", max: 8, maxLabel: "Tối đa 8 đ" },
      { id: "1_9", title: "9. Các cuộc thi khởi nghiệp do Trường tổ chức", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 3đ | Giải: 4 đến 7 đ/lần", max: 7, maxLabel: "Tối đa 7 đ" },
      { id: "1_10", title: "10. Các cuộc thi khởi nghiệp do đơn vị ngoài Trường tổ chức", subtext: "Cổ vũ: 2đ | BTC: 3đ | Tham gia: 4đ | Giải: 5 đến 8 đ/lần", max: 8, maxLabel: "Tối đa 8 đ" },
      { id: "1_11", title: "11. Thành viên các câu lạc bộ học thuật cấp Khoa, Trường", subtext: "Minh chứng thành viên CLB", max: 2, maxLabel: "Tối đa 2 đ" },
      { id: "1_12", title: "12. Các hoạt động học tập khác", subtext: "Tham gia trực tiếp: 3 đ/lần | Tham gia trực tuyến: 1 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
    ],
  },
  {
    id: "sec2",
    title: "II. Đánh giá về ý thức chấp hành nội quy, quy chế và các quy định của Nhà trường",
    maxPoints: 25,
    items: [
      { id: "2_1", title: "1. Sinh viên có ý thức, thái độ trong học tập", subtext: "Đi học đủ (+5đ); Nghỉ không phép (-3đ); Muộn/Bỏ tiết (-1đ); Cấm thi (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_2", title: "2. Chấp hành tốt nội quy, quy chế và các quy định của Nhà trường", subtext: "Chấp hành tốt (+5đ); Có quyết định kỷ luật (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_3", title: "3. Thực hiện tốt quy chế khi tham gia các kỳ thi, cuộc thi", subtext: "Thực hiện tốt (+5đ); Vi phạm quy chế (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_4", title: "4. Chấp hành quy định của thư viện", subtext: "Chấp hành tốt (+5đ); Vi phạm quy định (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_5", title: "5. Chấp hành quy định phòng học, phòng máy, phòng thực hành", subtext: "Chấp hành tốt (+5đ); Vi phạm quy định (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_6", title: "6. Thực hiện đăng ký ngoại trú", subtext: "Đăng ký đầy đủ, đúng hạn (+5đ); Không thực hiện (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_7", title: "7. Mặc đồng phục đúng quy định", subtext: "Mặc đúng quy định (+5đ); Vi phạm (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "2_8", title: "8. Sinh hoạt lớp với Cố vấn học tập", subtext: "Tham gia đầy đủ (+5đ); Vắng không lý do (-5đ)", max: 5, maxLabel: "Tối đa 5 đ" },
    ],
  },
  {
    id: "sec3",
    title: "III. Đánh giá về ý thức tham gia các hoạt động chính trị, xã hội, văn hóa, văn nghệ, thể thao...",
    maxPoints: 20,
    items: [
      { id: "3_1", title: "1. Hoạt động bắt buộc do Khoa hoặc Trường tổ chức", subtext: "Tham gia: +3 đ/lần | Vắng không lý do: -3 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "3_2", title: "2. Đại hội Chi Đoàn/Chi Hội; sinh hoạt Chi Đoàn/Chi Hội", subtext: "Tham gia: +3 đ/lần | Vắng không lý do: -3 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "3_3", title: "3. Báo cáo chuyên đề do Trường tổ chức trực tiếp hoặc trực tuyến", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 4 đ/lần", max: 4, maxLabel: "Tối đa 4 đ" },
      { id: "3_4", title: "4. Hoạt động ngoại khóa hoặc các cuộc thi do CLB, Khoa, Trường tổ chức", subtext: "Cổ vũ: 1đ | BTC: 2đ | Tham gia: 3đ | Giải: 4 đến 7 đ/lần", max: 7, maxLabel: "Tối đa 7 đ" },
      { id: "3_5", title: "5. Hoạt động ngoại khóa hoặc các cuộc thi từ cấp Thành phố trở lên", subtext: "Cổ vũ: 1đ | BTC: 3đ | Tham gia: 4đ | Giải: 5 đến 8 đ/lần", max: 8, maxLabel: "Tối đa 8 đ" },
      { id: "3_6", title: "6. Được kết nạp Đoàn", subtext: "Cộng 1 lần duy nhất vào học kỳ kết nạp: 5 điểm", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "3_7", title: "7. Được kết nạp Đảng", subtext: "Cộng 1 lần duy nhất vào học kỳ kết nạp: 8 điểm", max: 8, maxLabel: "Tối đa 8 đ" },
      { id: "3_8", title: "8. Các hoạt động, phong trào do các đơn vị, Đoàn, Hội điều động", subtext: "Tham gia: 2 đ/lần | Ban tổ chức: 4 đ/lần", max: 4, maxLabel: "Tối đa 4 đ" },
      { id: "3_9", title: "9. Thành viên các Câu lạc bộ, đội, nhóm thuộc Đoàn - Hội", subtext: "Cộng 2 điểm mỗi học kỳ", max: 2, maxLabel: "Tối đa 2 đ" },
      { id: "3_10", title: "10. Hoạt động 'Học tập các bài lý luận chính trị'", subtext: "Hoàn thành học tập và bài kiểm tra: 4 đ/lần", max: 4, maxLabel: "Tối đa 4 đ" },
      { id: "3_11", title: "11. Hoạt động đền ơn đáp nghĩa, Thắp nến tri ân", subtext: "Tham gia hoạt động: 3 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "3_12", title: "12. Hoạt động lao động tình nguyện tại Trường", subtext: "Dọn dẹp vệ sinh, giảng đường, xưởng: 3 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "3_13", title: "13. Được khen thưởng trong các hoạt động phong trào", subtext: "Giấy khen: 5đ | Bằng khen: 7 đ/lần", max: 7, maxLabel: "Tối đa 7 đ" },
      { id: "3_14", title: "14. Tập thể được khen thưởng trong các hoạt động phong trào", subtext: "Mỗi sinh viên trong tập thể được 1 điểm: 1 đ/lần", max: 1, maxLabel: "Tối đa 1 đ" },
      { id: "3_15", title: "15. Các hoạt động phong trào khác", subtext: "Trực tiếp: 3 đ/lần | Trực tuyến: 1 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
    ],
  },
  {
    id: "sec4",
    title: "IV. Đánh giá về ý thức công dân trong quan hệ cộng đồng",
    maxPoints: 25,
    items: [
      { id: "4_1", title: "1. Chấp hành luật pháp, quy định Nhà nước và không có thông báo công an", subtext: "Chấp hành tốt: +10đ | Có văn bản thông báo vi phạm từ công an: -5 đ/lần", max: 10, maxLabel: "Tối đa 10 đ" },
      { id: "4_2", title: "2. Giúp đỡ người yếu thế được ghi nhận bằng văn bản", subtext: "Cấp xã, phường hoặc cấp trường trở lên: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_3", title: "3. Khen thưởng về tham gia các hoạt động xã hội ngoài trường", subtext: "Ghi nhận bằng văn bản từ cấp xã/trường trở lên: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_4", title: "4. Giao lưu chương trình 'Giao lưu các câu lạc bộ, đội, nhóm trực thuộc'", subtext: "Tham gia: 3đ | Ban tổ chức: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_5", title: "5. Chương trình 'Tư vấn tuyển sinh'", subtext: "Hỗ trợ ban tư vấn tuyển sinh: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_6", title: "6. Công tác nhập học", subtext: "Hỗ trợ làm thủ tục nhập học tân sinh viên: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_7", title: "7. Công tác khám sức khỏe sinh viên đầu khóa", subtext: "Hỗ trợ khám sức khỏe: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_8", title: "8. Công tác Ngày hội việc làm", subtext: "Hỗ trợ tổ chức ngày hội việc làm: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_9", title: "9. Công tác tổ chức Lễ Tốt nghiệp", subtext: "Hỗ trợ phục vụ Lễ tốt nghiệp: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_10", title: "10. Công tác kiểm tra hồ sơ sinh viên", subtext: "Hỗ trợ rà soát hồ sơ: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_11", title: "11. Tham gia các phiên giao dịch việc làm", subtext: "Góc việc làm tại Trường: 1đ | Cà phê việc làm: 2đ | Khu vực: 3 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "4_12", title: "12. Hiến máu tình nguyện", subtext: "Trực tiếp hiến máu: 10đ | Ban tổ chức: 5 đ/lần", max: 10, maxLabel: "Tối đa 10 đ" },
      { id: "4_13", title: "13. Chương trình 'Xuân tình nguyện'", subtext: "Tham gia: 4đ | Ban tổ chức: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_14", title: "14. Chiến dịch tình nguyện 'Mùa hè xanh'", subtext: "Tham gia: 5đ | Ban tổ chức: 7 đ/lần", max: 7, maxLabel: "Tối đa 7 đ" },
      { id: "4_15", title: "15. Chương trình 'Ngày Chủ nhật xanh'", subtext: "Tham gia: 3đ | Ban tổ chức: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_16", title: "16. Chương trình 'Thứ Bảy tình nguyện'", subtext: "Tham gia: 3đ | Ban tổ chức: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_17", title: "17. Chương trình 'Chào đón tân sinh viên'", subtext: "Tham gia: 3đ | Ban tổ chức: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "4_18", title: "18. Hoạt động trách nhiệm xã hội và phát triển bền vững", subtext: "Trực tiếp: 3 đ/lần | Trực tuyến: 1 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
    ],
  },
  {
    id: "sec5",
    title: "V. Ý thức và kết quả khi tham gia công tác cán bộ lớp, các đoàn thể hoặc thành tích đặc biệt",
    maxPoints: 10,
    items: [
      { id: "5_1", title: "1. Tham gia tích cực vào phong trào của Lớp, Đoàn, Hội", subtext: "+1 điểm/hoạt động (Tối đa 3 điểm)", max: 3, maxLabel: "Tối đa 3 đ" },
      { id: "5_2", title: "2. Phát huy vai trò và hoàn thành tốt nhiệm vụ người cán bộ Lớp, Chi đoàn, CLB", subtext: "Lớp trưởng/Chủ nhiệm: 5đ | Phó: 4đ | UVBCH/Tổ: 3 đ/học kỳ", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "5_3", title: "3. Sinh viên đạt giải về học tập, Nghiên cứu khoa học", subtext: "Cấp TP: 3-6đ | Toàn quốc: 4-7 đ/lần", max: 7, maxLabel: "Tối đa 7 đ" },
      { id: "5_4", title: "4. Bằng khen UBND Tỉnh, Thành phố hoặc tương đương", subtext: "Hoạt động chính trị, cứu người: 5 đ/lần", max: 5, maxLabel: "Tối đa 5 đ" },
      { id: "5_5", title: "5. Sinh viên 5 tốt cấp Trường, Đoàn viên tiêu biểu", subtext: "Minh chứng công nhận: 6 đ/lần", max: 6, maxLabel: "Tối đa 6 đ" },
      { id: "5_6", title: "6. Sinh viên 5 tốt cấp Thành/Trung ương, Sao Tháng Giêng", subtext: "Minh chứng công nhận: 10 đ/lần", max: 10, maxLabel: "Tối đa 10 đ" },
      { id: "5_7", title: "7. Đạt danh hiệu Đoàn viên ưu tú", subtext: "Được công nhận trong kỳ: 6 đ/lần", max: 6, maxLabel: "Tối đa 6 đ" },
      { id: "5_8", title: "8. Giấy khen tập thể của Đoàn", subtext: "Mỗi sinh viên trong tập thể được 2 điểm: 2 đ/SV", max: 2, maxLabel: "Tối đa 2 đ" },
    ],
  },
];

function removeVietnameseTones(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .trim();
}

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

export default function AdminDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"students" | "officers" | "semesters" | "review" | "events" | "posts" | "about">("students");
  
  const [students, setStudents] = useState<any[]>([]);
  const [officers, setOfficers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [semesters, setSemesters] = useState<any[]>([]);

  // State sinh viên & thông tin Đoàn viên mở rộng
  const [studentInputMode, setStudentInputMode] = useState<"paste" | "manual" | "file">("paste");
  const [pasteData, setPasteData] = useState("");
  const [manualMssv, setManualMssv] = useState("");
  const [manualFullName, setManualFullName] = useState("");
  const [manualClass, setManualClass] = useState("CNKT Tự động hóa K2024");
  const [manualBirthPlace, setManualBirthPlace] = useState("");
  const [manualUnionDate, setManualUnionDate] = useState("");
  const [manualPartyDate, setManualPartyDate] = useState("");
  const [manualSoDoan, setManualSoDoan] = useState("Chưa nộp");
  const [manualChuaKetNap, setManualChuaKetNap] = useState(false);

  // State quản lý Giới thiệu (About Us)
  const [aboutHtml, setAboutHtml] = useState("");
  const aboutEditorRef = useRef<HTMLDivElement>(null);

  // State tạo tài khoản BCH Chi đoàn
  const [officerUser, setOfficerUser] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [officerClass, setOfficerClass] = useState("");
  const [officerPass, setOfficerPass] = useState("");

  // State quản lý học kỳ
  const [semId, setSemId] = useState("");
  const [semTitle, setSemTitle] = useState("");
  const [semStart, setSemStart] = useState("");
  const [semEnd, setSemEnd] = useState("");

  // State giao diện Bí thư Chi đoàn chấm điểm chi tiết
  const [classStudents, setClassStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [studentProofs, setStudentProofs] = useState<any[]>([]);
  const [studentSubmission, setStudentSubmission] = useState<any>(null);
  const [reviewSemester, setReviewSemester] = useState("hk1_2026_2027");
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

  // State bài viết
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState("Phong trào");
  const [postCoverImage, setPostCoverImage] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);

  const fetchAllData = async () => {
    const { data: stdData } = await supabase.from("students").select("*").order("id", { ascending: false });
    if (stdData) {
      setStudents(stdData);
      setClassStudents(stdData);
    }

    const { data: offData } = await supabase.from("branch_officers").select("*").order("id", { ascending: false });
    if (offData) setOfficers(offData);

    const { data: postData } = await supabase.from("posts").select("*").order("id", { ascending: false });
    if (postData) setPosts(postData);

    const { data: evData } = await supabase.from("events").select("*").order("created_at", { ascending: false });
    if (evData) setEvents(evData);

    const { data: semData } = await supabase.from("drl_semesters").select("*").order("created_at", { ascending: false });
    if (semData) setSemesters(semData);

    const { data: aboutData } = await supabase.from("site_settings").select("*").eq("key", "about_us").maybeSingle();
    if (aboutData && aboutData.value) {
      setAboutHtml(aboutData.value);
      if (aboutEditorRef.current) aboutEditorRef.current.innerHTML = aboutData.value;
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("ctut_current_user");
    if (!userStr) {
      router.push("/dang-nhap?redirect=/admin");
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== "super_admin" && user.role !== "branch_admin" && user.role !== "admin") {
      alert("Bạn không có quyền truy cập trang quản trị!");
      router.push("/");
      return;
    }
    setCurrentUser(user);
    fetchAllData();
  }, [router]);

  // ================= 1. LƯU GIỚI THIỆU (ABOUT US) =================
  const handleSaveAboutUs = async (e: React.FormEvent) => {
    e.preventDefault();
    const html = aboutEditorRef.current ? aboutEditorRef.current.innerHTML : "";
    const { error } = await supabase.from("site_settings").upsert([
      { key: "about_us", value: html, updated_at: new Date().toISOString() }
    ], { onConflict: "key" });

    if (error) {
      alert("Lỗi lưu trang Giới thiệu: " + error.message);
    } else {
      alert("Đã cập nhật trang Giới thiệu thành công!");
      setAboutHtml(html);
    }
  };

  const formatAboutText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleInsertAboutImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => document.execCommand("insertImage", false, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ================= 2. QUẢN LÝ TÀI KHOẢN CÁN BỘ =================
  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerUser.trim() || !officerPass.trim() || !officerName.trim()) {
      return alert("Vui lòng điền đầy đủ thông tin cán bộ!");
    }

    const newOfficer = {
      username: officerUser.trim().toLowerCase(),
      full_name: officerName.trim(),
      branch_class: officerClass.trim() || "Khoa Kỹ thuật Cơ khí",
      password: officerPass.trim(),
    };

    const { error } = await supabase.from("branch_officers").insert([newOfficer]);
    if (error) {
      alert("Lỗi tạo tài khoản: " + error.message);
    } else {
      alert(`Đã cấp tài khoản cán bộ cho: ${newOfficer.full_name}`);
      fetchAllData();
      setOfficerUser("");
      setOfficerName("");
      setOfficerClass("");
      setOfficerPass("");
    }
  };

  const handleDeleteOfficer = async (id: number, name: string) => {
    if (confirm(`Xác nhận xóa tài khoản cán bộ: ${name}?`)) {
      await supabase.from("branch_officers").delete().eq("id", id);
      fetchAllData();
    }
  };

  // ================= 3. QUẢN LÝ HỌC KỲ ĐRL =================
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

  // ================= 4. BÍ THƯ CHI ĐOÀN CHẤM ĐIỂM CHI TIẾT =================
  const handleSelectStudentForReview = async (st: any) => {
    setSelectedStudent(st);
    try {
      const { data: proofs } = await supabase
        .from("proofs")
        .select("*")
        .eq("mssv", st.mssv)
        .eq("semester_id", reviewSemester);
      if (proofs) setStudentProofs(proofs);

      const { data: sub } = await supabase
        .from("drl_submissions")
        .select("*")
        .eq("mssv", st.mssv)
        .eq("semester_id", reviewSemester)
        .maybeSingle();

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
    const nextStatus = currentStatus === "Đã duyệt" ? "Chờ duyệt" : "Đã duyệt";
    await supabase.from("proofs").update({ status: nextStatus }).eq("id", proofId);
    handleSelectStudentForReview(selectedStudent);
  };

  const getOfficerSectionScore = (section: any) => {
    const rawSum = section.items.reduce((sum: number, it: any) => sum + (Number(officerScores[it.id]) || 0), 0);
    return Math.min(rawSum, section.maxPoints);
  };

  const grandOfficerTotalScore = DRL_SECTIONS_FULL.reduce((total, sec) => total + getOfficerSectionScore(sec), 0);

  const handleSendFinalScore = async () => {
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
        status: "BCH Chi đoàn đã duyệt & công bố điểm",
      };

      const { error } = await supabase.from("drl_submissions").upsert([submissionData], { onConflict: "mssv,semester_id" });
      if (error) {
        alert("Lỗi khi gửi điểm: " + error.message);
      } else {
        alert("Đã gửi điểm rèn luyện chính thức về cho sinh viên thành công!");
        handleSelectStudentForReview(selectedStudent);
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    }
  };

  // ================= 5. QUẢN LÝ SINH VIÊN (KÈM THÔNG TIN ĐOÀN VIÊN) =================
  const handleProcessPasteData = async () => {
    if (!pasteData.trim()) return alert("Vui lòng dán dữ liệu!");
    const rows = pasteData.split(/\r\n|\n/).filter((r) => r.trim() !== "");
    const imported: any[] = [];

    for (const row of rows) {
      const cols = row.split(/\t|,/).map((c) => c.trim().replace(/^"|"$/g, ""));
      if (cols.length >= 2 && cols[0] && !cols[0].toLowerCase().includes("mssv")) {
        const mssv = cols[0].replace(/\s+/g, "").toUpperCase();
        const full_name = cols[1];
        const student_class = cols[2] || "CNKT Tự động hóa K2024";
        const password = mssv.slice(-3);
        const email = generateCtuetEmail(full_name, mssv);

        imported.push({
          mssv,
          full_name,
          email,
          student_class,
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
      if (error) {
        alert("Lỗi lưu dữ liệu: " + error.message);
      } else {
        alert(`Đã lưu ${imported.length} sinh viên lên hệ thống.`);
        fetchAllData();
        setPasteData("");
      }
    }
  };

  const handleAddManualStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMssv.trim() || !manualFullName.trim()) return alert("Vui lòng nhập đầy đủ MSSV và Họ tên!");

    const mssv = manualMssv.trim().toUpperCase();
    const full_name = manualFullName.trim();
    const student_class = manualClass.trim() || "CNKT Tự động hóa K2024";
    const password = mssv.slice(-3);
    const email = generateCtuetEmail(full_name, mssv);

    const newStudent = {
      mssv,
      full_name,
      email,
      student_class,
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
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      const rows = text.split(/\r\n|\n/).filter((r) => r.trim() !== "");
      const imported: any[] = [];

      for (const row of rows) {
        const cols = row.split(/,|\t/).map((c) => c.trim().replace(/^"|"$/g, ""));
        if (cols.length >= 2 && cols[0] && !cols[0].toLowerCase().includes("mssv")) {
          const mssv = cols[0].replace(/\s+/g, "").toUpperCase();
          const full_name = cols[1];
          const student_class = cols[2] || "CNKT Tự động hóa K2024";
          const password = mssv.slice(-3);
          const email = generateCtuetEmail(full_name, mssv);
          imported.push({
            mssv,
            full_name,
            email,
            student_class,
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
        await supabase.from("students").upsert(imported, { onConflict: "mssv" });
        alert(`Đã nạp thành công ${imported.length} sinh viên.`);
        fetchAllData();
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadSampleTemplate = () => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
      "MSSV,Họ và tên,Lớp\n" +
      "CNDT2411081,Phạm Thái Minh Đăng,CNKT Tự động hóa K2024\n" +
      "CNDT2411026,Nguyễn Huỳnh Bảo Châu,CNKT Tự động hóa K2024\n";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Mau_Danh_Sach_Sinh_Vien_CTUT.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  // ================= 6. SỰ KIỆN & BÀI VIẾT =================
  const handleSelectCriteria = (selectedCode: string) => {
    setEventCategoryCode(selectedCode);
    const item = EVENT_CRITERIA_OPTIONS.find((c) => c.code === selectedCode);
    if (item) setEventPoints(item.max);
  };

  const handleEventCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEventCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInsertEventBodyImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => document.execCommand("insertImage", false, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatEventText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const criteriaItem = EVENT_CRITERIA_OPTIONS.find((c) => c.code === eventCategoryCode);
    const descHtml = eventEditorRef.current ? eventEditorRef.current.innerHTML : "";

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
      cover_image: eventCoverImage || "",
      description_html: descHtml,
      description: eventEditorRef.current ? eventEditorRef.current.innerText : eventDesc,
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

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPostCoverImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleInsertBodyImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => document.execCommand("insertImage", false, reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const formatText = (cmd: string, value: string = "") => {
    document.execCommand(cmd, false, value);
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    const contentHtml = editorRef.current ? editorRef.current.innerHTML : "";
    const newPost = {
      title: postTitle,
      category: postCategory,
      cover_image: postCoverImage || "",
      content_html: contentHtml,
      content: editorRef.current ? editorRef.current.innerText : "",
      date: new Date().toLocaleDateString("vi-VN"),
    };

    const { error } = await supabase.from("posts").insert([newPost]);
    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      alert("Xuất bản bài viết thành công.");
      fetchAllData();
      setPostTitle("");
      setPostCoverImage("");
      if (editorRef.current) editorRef.current.innerHTML = "";
    }
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

  return (
    <main className="min-h-screen bg-slate-100 py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <img
                src="/logo-doankhoa.png"
                alt="Logo Đoàn Khoa"
                className="h-12 sm:h-14 w-auto object-contain cursor-pointer"
              />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#004A52] tracking-tight">
                BẢNG ĐIỀU KHIỂN QUẢN TRỊ VIÊN
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Đang đăng nhập: <strong className="text-[#EE6425]">{currentUser?.fullName}</strong> ({currentUser?.role === "super_admin" ? "Admin Tối Cao" : "Cán Bộ Chi Đoàn"})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xs font-bold text-[#007A87] hover:underline">
              Về trang chủ
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("ctut_current_user");
                router.push("/dang-nhap");
              }}
              className="bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3.5 py-1.5 rounded-lg transition"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === "students" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Sinh viên ({students.length})
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === "about" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Giới thiệu
          </button>

          {currentUser?.role === "super_admin" && (
            <button
              onClick={() => setActiveTab("officers")}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                activeTab === "officers" ? "bg-[#004A52] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
              }`}
            >
              Cán bộ BCH Chi đoàn ({officers.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab("semesters")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === "semesters" ? "bg-[#004A52] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Quản lý Học kỳ ĐRL
          </button>

          <button
            onClick={() => setActiveTab("review")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === "review" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Duyệt ĐRL Chi Đoàn
          </button>

          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === "events" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Sự kiện & Điểm danh ({events.length})
          </button>

          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
              activeTab === "posts" ? "bg-[#EE6425] text-white shadow" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            Bài viết ({posts.length})
          </button>
        </div>

        {/* ================= TAB 1: QUẢN LÝ SINH VIÊN (KÈM THÔNG TIN ĐOÀN VIÊN) ================= */}
        {activeTab === "students" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
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

              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                <button type="button" onClick={() => setStudentInputMode("paste")} className={`py-1.5 rounded-lg transition ${studentInputMode === "paste" ? "bg-white text-[#EE6425] shadow-xs" : ""}`}>Dán từ Excel</button>
                <button type="button" onClick={() => setStudentInputMode("manual")} className={`py-1.5 rounded-lg transition ${studentInputMode === "manual" ? "bg-white text-[#EE6425] shadow-xs" : ""}`}>Nhập thủ công</button>
                <button type="button" onClick={() => setStudentInputMode("file")} className={`py-1.5 rounded-lg transition ${studentInputMode === "file" ? "bg-white text-[#EE6425] shadow-xs" : ""}`}>Tải file lên</button>
              </div>

              {studentInputMode === "paste" && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-500">Quét chọn 3 cột (MSSV, Họ tên, Lớp) từ file Excel rồi dán vào đây:</p>
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

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Lớp sinh hoạt</label>
                    <input type="text" value={manualClass} onChange={(e) => setManualClass(e.target.value)} placeholder="CNKT Tự động hóa K2024" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none" />
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
                  <p className="text-xs font-bold text-slate-700">Chọn file danh sách (.csv / .txt)</p>
                  <input type="file" accept=".csv, .txt" onChange={handleFileUpload} className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#EE6425] file:text-white cursor-pointer" />
                </div>
              )}
            </div>

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200">
                <h2 className="text-base font-bold text-[#004A52]">Danh sách sinh viên ({students.length})</h2>
                {students.length > 0 && (
                  <button onClick={handleDeleteAllStudents} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow">
                    Xóa tất cả danh sách
                  </button>
                )}
              </div>

              {students.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">Chưa có sinh viên nào.</div>
              ) : (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">MSSV</th>
                      <th className="p-2.5">Họ và tên</th>
                      <th className="p-2.5">Lớp</th>
                      <th className="p-2.5">Sổ Đoàn</th>
                      <th className="p-2.5">Đoàn/Đảng</th>
                      <th className="p-2.5 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.map((s, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-[#007A87]">{s.mssv}</td>
                        <td className="p-2.5 font-medium text-slate-800">{s.full_name}</td>
                        <td className="p-2.5 text-slate-600">{s.student_class}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${s.so_doan === "Đã nộp" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                            {s.so_doan || "Chưa nộp"}
                          </span>
                        </td>
                        <td className="p-2.5 text-[11px] text-slate-500">
                          {s.chua_ket_nap_doan ? <span className="text-red-600 font-bold">Chưa vào Đoàn</span> : `Đoàn: ${s.union_date || "Có"}`}
                        </td>
                        <td className="p-2.5 text-center">
                          <button onClick={() => handleDeleteSingleStudent(s.mssv, s.full_name)} className="text-red-600 hover:text-red-800 font-bold hover:underline">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB QUẢN LÝ GIỚI THIỆU (ABOUT US) ================= */}
        {activeTab === "about" && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-black text-[#004A52]">SOẠN THẢO TRANG GIỚI THIỆU ĐOÀN KHOA</h2>
              <p className="text-xs text-slate-500 mt-0.5">Nội dung này sẽ hiển thị trực tiếp khi người dùng bấm vào mục "Giới thiệu" trên thanh Menu chính.</p>
            </div>

            <form onSubmit={handleSaveAboutUs} className="space-y-4">
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                <button type="button" onClick={() => formatAboutText("bold")} className="px-3 py-1 bg-white border border-slate-200 rounded font-black">B</button>
                <button type="button" onClick={() => formatAboutText("italic")} className="px-3 py-1 bg-white border border-slate-200 rounded italic">I</button>
                <button type="button" onClick={() => formatAboutText("underline")} className="px-3 py-1 bg-white border border-slate-200 rounded underline">U</button>
                <button type="button" onClick={() => formatAboutText("formatBlock", "<h2>")} className="px-3 py-1 bg-white border border-slate-200 rounded font-bold">Tiêu đề lớn</button>
                <button type="button" onClick={() => formatAboutText("formatBlock", "<p>")} className="px-3 py-1 bg-white border border-slate-200 rounded">Đoạn văn</button>
                <label className="px-3 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded cursor-pointer font-bold">
                  Chèn hình ảnh
                  <input type="file" accept="image/*" onChange={handleInsertAboutImage} className="hidden" />
                </label>
              </div>

              <div
                ref={aboutEditorRef}
                contentEditable
                className="w-full min-h-[300px] border border-t-0 border-slate-300 rounded-b-xl p-5 text-sm outline-none bg-white leading-relaxed"
              ></div>

              <button
                type="submit"
                className="bg-[#EE6425] hover:bg-[#d85216] text-white font-bold px-8 py-3 rounded-xl text-xs uppercase shadow transition"
              >
                Lưu nội dung Giới thiệu
              </button>
            </form>
          </div>
        )}

        {/* ================= TAB QUẢN LÝ CÁN BỘ ================= */}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thuộc Chi đoàn / Lớp *</label>
                  <input type="text" required value={officerClass} onChange={(e) => setOfficerClass(e.target.value)} placeholder="VD: CNKT Tự động hóa K2024" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#004A52]" />
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

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Danh sách cán bộ BCH Chi đoàn ({officers.length})</h2>
              {officers.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">Chưa có tài khoản cán bộ nào.</p>
              ) : (
                <table className="w-full text-left text-xs">
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
                        <td className="p-2.5 text-slate-600">{off.branch_class}</td>
                        <td className="p-2.5 font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded inline-block my-1">{off.password}</td>
                        <td className="p-2.5 text-center">
                          <button onClick={() => handleDeleteOfficer(off.id, off.full_name)} className="text-red-600 hover:text-red-800 font-bold hover:underline">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB QUẢN LÝ HỌC KỲ ================= */}
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

            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm overflow-x-auto">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Danh sách các học kỳ ({semesters.length})</h2>
              {semesters.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">Chưa có học kỳ nào.</p>
              ) : (
                <table className="w-full text-left text-xs">
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
              )}
            </div>
          </div>
        )}

        {/* ================= TAB DUYỆT ĐRL CHI ĐOÀN ================= */}
        {activeTab === "review" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <h3 className="text-sm font-black text-[#004A52] uppercase">Danh sách sinh viên lớp</h3>
                <select
                  value={reviewSemester}
                  onChange={(e) => setReviewSemester(e.target.value)}
                  className="border border-slate-300 rounded-lg px-2 py-1 text-[11px] font-bold text-[#EE6425] outline-none"
                >
                  {semesters.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {classStudents.map((st, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectStudentForReview(st)}
                    className={`p-3 rounded-2xl border cursor-pointer transition text-xs ${
                      selectedStudent?.mssv === st.mssv ? "bg-orange-50 border-[#EE6425] shadow-xs" : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold text-slate-800">{st.full_name}</div>
                    <div className="text-slate-500 font-mono text-[11px] mt-0.5">{st.mssv} - {st.student_class}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              {selectedStudent ? (
                <>
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <div>
                      <h2 className="text-sm font-black text-[#004A52] uppercase">
                        Chấm điểm cho: {selectedStudent.full_name}
                      </h2>
                      <span className="text-xs text-slate-500 font-mono">{selectedStudent.mssv} | {selectedStudent.student_class}</span>
                    </div>
                    <div className="text-right">
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
                              <span className="font-bold text-slate-800 block">{p.activity_title}</span>
                              <span className="text-[11px] text-slate-500">{p.category} (+{p.points}đ)</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {p.proof_url && (
                                <a href={p.proof_url} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Xem tệp</a>
                              )}
                              <button
                                onClick={() => handleApproveProof(p.id, p.status)}
                                className={`px-3 py-1.5 rounded-lg font-bold text-[11px] transition ${
                                  p.status === "Đã duyệt" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                }`}
                              >
                                {p.status || "Chờ duyệt"}
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
                            <div className="bg-slate-100 p-3.5 flex justify-between items-center text-xs font-black text-[#004A52]">
                              <span>{section.title} (Tối đa {section.maxPoints} đ)</span>
                              <span className="bg-white px-3 py-1 rounded-xl border border-slate-200 text-[#EE6425]">
                                Lớp chấm phần này: {secScore} / {section.maxPoints} đ
                              </span>
                            </div>

                            <table className="w-full text-left text-xs">
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
                  ⬅ Vui lòng chọn một sinh viên ở danh sách bên trái để xem phiếu điểm và chấm điểm chi tiết.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB SỰ KIỆN ================= */}
        {activeTab === "events" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo Sự Kiện Mới</h2>
              <form onSubmit={handleAddEvent} className="space-y-3.5">
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
                  <input type="file" accept="image/*" onChange={handleEventCoverUpload} className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500" />
                  {eventCoverImage && <img src={eventCoverImage} alt="Cover Preview" className="mt-2 h-24 rounded-xl object-cover" />}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi tiết sự kiện</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                    <button type="button" onClick={() => formatEventText("bold")} className="px-2.5 py-1 bg-white border border-slate-200 rounded font-black">B</button>
                    <button type="button" onClick={() => formatEventText("italic")} className="px-2.5 py-1 bg-white border border-slate-200 rounded italic">I</button>
                    <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border border-orange-200 rounded cursor-pointer">
                      Chèn hình
                      <input type="file" accept="image/*" onChange={handleInsertEventBodyImage} className="hidden" />
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
                  Đăng sự kiện lên hệ thống
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
                          <button onClick={() => setActiveQrEvent(ev)} className="bg-[#007A87] text-white font-bold text-xs px-3 py-1.5 rounded-xl">Mã QR</button>
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

        {/* ================= TAB BÀI VIẾT ================= */}
        {activeTab === "posts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Tạo bài viết mới</h2>
              <form onSubmit={handleAddPost} className="space-y-4">
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Tiêu đề bài viết..."
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none focus:border-[#EE6425]"
                />
                
                <select
                  value={postCategory}
                  onChange={(e) => setPostCategory(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm outline-none"
                >
                  <option value="Phong trào">Phong trào</option>
                  <option value="Học thuật - NCKH">Học thuật - NCKH</option>
                  <option value="Tổ chức - Đoàn thể">Tổ chức - Đoàn thể</option>
                  <option value="Hội thảo Cơ khí">Hội thảo Cơ khí</option>
                  <option value="Tình nguyện">Tình nguyện</option>
                </select>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hình ảnh bìa bài viết</label>
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="w-full border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-500" />
                  {postCoverImage && <img src={postCoverImage} alt="" className="mt-2 h-20 rounded-xl object-cover" />}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nội dung chi tiết</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-300 rounded-t-xl text-xs font-bold">
                    <button type="button" onClick={() => formatText("bold")} className="px-2.5 py-1 bg-white border rounded font-black">B</button>
                    <button type="button" onClick={() => formatText("italic")} className="px-2.5 py-1 bg-white border rounded italic">I</button>
                    <label className="px-2.5 py-1 bg-orange-50 text-[#EE6425] border rounded cursor-pointer">
                      Chèn hình
                      <input type="file" accept="image/*" onChange={handleInsertBodyImage} className="hidden" />
                    </label>
                  </div>
                  <div ref={editorRef} contentEditable className="w-full min-h-[140px] border border-t-0 border-slate-300 rounded-b-xl p-4 text-sm outline-none bg-white"></div>
                </div>

                <button type="submit" className="w-full bg-[#EE6425] text-white font-bold py-3 rounded-xl text-xs uppercase shadow">
                  Xuất bản bài viết
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-base font-bold text-[#004A52] mb-4">Bài viết đã xuất bản ({posts.length})</h2>
              {posts.map((p) => (
                <div key={p.id} className="flex justify-between items-center py-2 border-b text-xs">
                  <span className="font-bold">{p.title}</span>
                  <button onClick={() => handleDeleteSinglePost(p.id, p.title)} className="text-red-600 font-bold">Xóa</button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* POPUP QR */}
      {activeQrEvent && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border-4 border-[#EE6425] text-center">
            <div className="flex justify-between items-center mb-4">
              <span className="bg-orange-100 text-[#EE6425] font-black text-xs px-3 py-1 rounded-full uppercase">MÀN HÌNH QR</span>
              <button onClick={() => setActiveQrEvent(null)} className="text-slate-400 hover:text-slate-700 text-xl font-bold">✕</button>
            </div>
            <h2 className="text-xl font-black text-[#004A52]">{activeQrEvent.title}</h2>
            <div className="my-6 p-4 bg-slate-50 rounded-2xl inline-block">
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(activeQrEvent.id)}`} alt="QR" className="w-56 h-56 mx-auto rounded-xl" />
            </div>
            <p className="text-xs text-[#007A87] font-bold">Mã Check-in: <code className="text-[#EE6425]">{activeQrEvent.id}</code></p>
          </div>
        </div>
      )}
    </main>
  );
}

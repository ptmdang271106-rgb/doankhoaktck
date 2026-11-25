export interface DRLCriterionItem {
  id: string;
  title: string;
  subtext: string;
  max: number;
  maxLabel: string;
}

export interface DRLSection {
  id: string;
  title: string;
  maxPoints: number;
  items: DRLCriterionItem[];
}

export const DRL_SECTIONS_FULL: DRLSection[] = [
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
      { id: "1_12", title: "12. Các hoạt động học tập khác", subtext: "Tham gia trực tiếp: 3 đ/lần | Trực tuyến: 1 đ/lần", max: 3, maxLabel: "Tối đa 3 đ" },
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

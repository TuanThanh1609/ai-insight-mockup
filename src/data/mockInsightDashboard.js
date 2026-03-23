// =====================================================================
// Mock data cho Dashboard Insight — Chat Quality Agent
// Nguồn tham chiếu: dashboard 1.jpg + dash 2.jpg + dash 3.jpg
// =====================================================================

// ─── 1. Dashboard Stats ────────────────────────────────────────────────
export const mockDashboardStats = {
  analyzedConversations: 100,
  achievementRate: 80,        // %
  issuesDetected: 70,
  avgScore: 77,              // /100
};

// ─── 2. Quality Trend — 14 ngày × 2 series ────────────────────────────
// Số tuyệt đối: số hội thoại Đạt / Không đạt mỗi ngày
export const mockQualityTrend = [
  { date: '10/03', đạt: 7, không_đạt: 3 },
  { date: '11/03', đạt: 5, không_đạt: 5 },
  { date: '12/03', đạt: 8, không_đạt: 2 },
  { date: '13/03', đạt: 6, không_đạt: 4 },
  { date: '14/03', đạt: 5, không_đạt: 5 },
  { date: '15/03', đạt: 4, không_đạt: 6 },
  { date: '16/03', đạt: 6, không_đạt: 4 },
  { date: '17/03', đạt: 8, không_đạt: 2 },
  { date: '18/03', đạt: 3, không_đạt: 7 },
  { date: '19/03', đạt: 5, không_đạt: 5 },
  { date: '20/03', đạt: 6, không_đạt: 4 },
  { date: '21/03', đạt: 7, không_đạt: 3 },
  { date: '22/03', đạt: 8, không_đạt: 2 },
  { date: '23/03', đạt: 8, không_đạt: 2 },
];

// ─── 3. Evaluation Results — 110 rows ──────────────────────────────────
// Mock: 10 rows/page × 11 pages
const evaluations = [
  'Nhân viên không chào hỏi lịch sự, trả lời thiếu thông tin quan trọng khiến khách phải hỏi lại nhiều lần.',
  'Khách phàn nàn nhưng nhân viên xử lý khéo léo, xin lỗi và đề xuất giải pháp phù hợp.',
  'Nhân viên hỗ trợ kỹ thuật kiên nhẫn, hướng dẫn chi tiết từng bước cho khách.',
  'Nhân viên xử lý đặt bàn tốt, cung cấp đầy đủ thông tin cần thiết.',
  'Khách hàng khen ngợi chất lượng đồ uống và dịch vụ. Nhân viên phản hồi chuyên nghiệp.',
  'Nhân viên chào hỏi lịch sự, trả lời nhanh và đầy đủ thông tin menu cho khách.',
  'Khách hỏi về khuyến mãi nhưng nhân viên không nắm rõ, phải chuyển hỏi đồng nghiệp.',
  'Nhân viên cung cấp đầy đủ thông tin khuyến mãi, tư vấn nhiệt tình.',
  'Khách hỏi nhiều lần về giá nhưng nhân viên trả lời chậm, không cung cấp đầy đủ.',
  'Trả lời cộc lốc, không giải đáp được câu hỏi về thành phần sản phẩm.',
  'Nhân viên kiên nhẫn xử lý khiếu nại, giải thích rõ ràng và đề xuất đổi trả hợp lý.',
  'Không chào hỏi, trả lời thiếu thông tin khiến khách không hài lòng.',
];

const names = [
  'Trần Minh Đức', 'Phan Thị Ròng', 'Trương Thị Mai', 'Bùi Thị Hồng',
  'Bùi Văn Hải', 'Tô Thị Hà', 'Kiều Văn Bách', 'Tạ Thị Yến',
  'Ngô Văn Khải', 'Đinh Thị Tâm', 'Lê Minh Tuấn', 'Vũ Hoàng Phúc',
  'Nguyễn Thị Lan', 'Trần Văn Đạt', 'Phạm Thu Hương', 'Hoàng Văn Minh',
  'Đặng Thị Bích', 'Lý Văn Nam', 'Trần Thị Hồng', 'Phan Văn Tuấn',
];

const dateTimes = [
  'T2 23/03 02:00', 'T2 23/03 01:00', 'CN 22/03 23:00', 'CN 22/03 21:00',
  'CN 22/03 19:00', 'CN 22/03 15:00', 'CN 22/03 15:00', 'CN 22/03 01:00',
  'CN 22/03 01:00', 'T7 21/03 23:00', 'T7 21/03 22:00', 'T7 21/03 20:00',
  'T7 21/03 18:00', 'T7 21/03 16:00', 'T6 20/03 22:00', 'T6 20/03 20:00',
  'T6 20/03 18:00', 'T6 20/03 16:00', 'T6 20/03 14:00', 'T5 19/03 21:00',
];

function generateResults() {
  const rows = [];
  // Tỉ lệ: 80 Đạt, 20 Không đạt, 10 Bỏ qua (total 110)
  // Ta tạo 110 dòng: 80 đạt, 20 không đạt, 10 bỏ qua
  const results = [];
  for (let i = 0; i < 80; i++) results.push('đạt');
  for (let i = 0; i < 20; i++) results.push('không đạt');
  for (let i = 0; i < 10; i++) results.push('bỏ qua');

  // Shuffle
  for (let i = results.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [results[i], results[j]] = [results[j], results[i]];
  }

  for (let i = 0; i < 110; i++) {
    const result = results[i];
    const name = names[i % names.length];
    const dateTime = dateTimes[i % dateTimes.length];
    const evalIdx = i % evaluations.length;

    let score;
    if (result === 'đạt') score = 70 + Math.floor(Math.random() * 31); // 70–100
    else if (result === 'không đạt') score = 20 + Math.floor(Math.random() * 40); // 20–59
    else score = 0;

    const issues = result === 'không đạt' ? (i % 3 === 0 ? 2 : 1) : (result === 'đạt' && i % 5 === 0 ? 1 : 0);

    rows.push({
      id: `eval-${i + 1}`,
      name: name + (i >= 20 ? ` (${Math.floor(i / 20) + 1})` : ''),
      chatDate: dateTime,
      result,
      evaluation: evaluations[evalIdx],
      score,
      issues,
    });
  }
  return rows;
}

export const mockEvaluationResults = generateResults();

// ─── 4. Run History — 10 rows ──────────────────────────────────────────
const runNames = [
  'Đánh giá toàn bộ tháng 3',
  'Chạy thử nghiệm - Fashion',
  'Đánh giá Mẹ và Bé',
  'Re-run sau khi cập nhật prompt',
  'Audit khẩn cấp - Tuần 3',
  'Baseline comparison test',
  'Fine-tune quality check',
  'Đánh giá F&B tuần 2',
  'Retrospective analysis',
  'Full corpus scan Q1',
];

const runStatuses = ['Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Lỗi', 'Hoàn thành', 'Đang chạy', 'Hoàn thành', 'Hoàn thành', 'Hoàn thành', 'Đang chạy'];

function generateRunHistory() {
  const rows = [];
  for (let i = 0; i < 10; i++) {
    const status = runStatuses[i];
    const conversations = 50 + Math.floor(Math.random() * 200);
    const avgScore = 65 + Math.floor(Math.random() * 30);
    const durationMin = 2 + Math.floor(Math.random() * 18);
    const startHour = 8 + Math.floor(Math.random() * 10);
    const startMin = Math.floor(Math.random() * 60);
    const endHour = startHour + Math.floor((startMin + durationMin) / 60);
    const endMin = (startMin + durationMin) % 60;

    rows.push({
      id: `run-${i + 1}`,
      runName: runNames[i],
      startTime: `T${(i % 7) + 1} ${(23 - i).toString().padStart(2, '0')}/03 ${startHour.toString().padStart(2, '0')}:${startMin.toString().padStart(2, '0')}`,
      endTime: `T${(i % 7) + 1} ${(23 - i).toString().padStart(2, '0')}/03 ${(startHour + Math.floor((startMin + durationMin) / 60)).toString().padStart(2, '0')}:${((startMin + durationMin) % 60).toString().padStart(2, '0')}`,
      duration: `${durationMin} phút`,
      conversations,
      avgScore,
      status,
    });
  }
  return rows;
}

export const mockRunHistory = generateRunHistory();

/**
 * mockExecutiveSummary.js
 * Dữ liệu tóm tắt Executive Summary cho CEO/CMO.
 * Tính toán động từ mockCampaigns + mockAIInsights trong ExecutiveSummaryCard.
 *
 * Cấu trúc: 3 phần theo kpi-dashboard-design + data-storytelling:
 *   - urgent: Vấn đề cần xử lý ngay (🔴)
 *   - watch: Theo dõi trong tuần (🟡)
 *   - highlight: Điểm sáng (🟢)
 */

export const mockExecutiveSummary = {
  generatedAt: '2026-03-22T10:00:00Z',
  period: '7 ngày gần nhất',

  // ─── Thành tựu Portfolio ───────────────────────────────────────
  portfolio: {
    totalRevenue: 120260000,
    totalSpend: 45200000,
    portfolioRoas: 2.66,
    totalConversations: 1247,
    qualityConversations: 639,
    totalOrders: 639,
    roasTrend: '+8.2%',      // so với tuần trước
    revenueTrend: '+15.3%',
  },

  // ─── 🔴 Vấn đề cần xử lý ngay ────────────────────────────────
  urgent: [
    {
      type: 'danger',
      icon: '🚨',
      title: 'Chiến dịch Retargeting Q1 chi tiêu phí',
      summary:
        'Chi tiêu 12.5M nhưng chỉ 2 lead chất lượng — junk rate 71%. AI đề xuất TẮT ngay.',
      action: 'Tắt chiến dịch Retargeting 2026 — Q1',
      actionType: 'decrease',
      roiImpact: '-15.2% vs trung bình kênh',
      affectedCampaign: 'camp-3',
    },
    {
      type: 'warning',
      icon: '⚠️',
      title: 'Chiến dịch Retargeting High Intent chìm trong "burnt audience"',
      summary:
        '85% audience đã nhìn thấy quảng cáo 5+ lần nhưng không tương tác. Đang đốt 10M tiền rác.',
      action: 'Tắt Retargeting High Intent — đợi 14 ngày rồi tạo lookalike',
      actionType: 'pause',
      roiImpact: '-8.4% vs trung bình kênh',
      affectedCampaign: 'camp-7',
    },
  ],

  // ─── 🟡 Cần theo dõi ────────────────────────────────────────────
  watch: [
    {
      type: 'warning',
      icon: '👀',
      title: 'KPI Spring Sale 2026 — junk rate cao bất thường',
      summary:
        '45% hội thoại là khách hỏi chơi/spam. Tỉ lệ lead chất lượng chỉ 29%, thấp hơn mức kênh (52%).',
      action: 'Tối ưu lại audience targeting + thêm UTM filter',
      actionType: 'keep',
      roiImpact: 'Chênh lệch -23% so với trung bình kênh',
      affectedCampaign: 'camp-1',
    },
    {
      type: 'info',
      icon: '📊',
      title: 'Brand Awareness Zalo — tạm dừng chờ creative mới',
      summary:
        'Đang ở ngưỡng ROAS 1.2×. Nếu tuần tới không cải thiện, cân nhắc thử nghiệm creative mới với audience nhỏ hơn.',
      action: 'Thử nghiệm creative mới với ngân sách thấp',
      actionType: 'pause',
      roiImpact: 'ROAS 1.2× — ở ngưỡng hòa vốn',
      affectedCampaign: 'camp-4',
    },
  ],

  // ─── 🟢 Điểm sáng ──────────────────────────────────────────────
  highlight: [
    {
      type: 'success',
      icon: '💎',
      title: 'Zalo OA — Khách hàng cũ: Chiến dịch tốt nhất toàn tài khoản!',
      summary:
        'ROAS 5.9×, quality score 89, hot leads 41. Khách hàng cũ phản hồi tích cực, tỉ lệ mua lại cao nhất.',
      action: 'TĂNG MẠNH ngân sách — scale thêm nhóm KH cũ khác',
      actionType: 'increase',
      roiImpact: '+27% vs trung bình kênh',
      affectedCampaign: 'camp-8',
    },
    {
      type: 'success',
      icon: '🚀',
      title: 'Product Launch Serum — đang trong giai đoạn vàng',
      summary:
        '81 điểm chất lượng, 25% lead có dấu hiệu mua ngay. Đối thủ chưa phản ứng — đây là lúc capture demand.',
      action: 'Tăng ngân sách ngay — trước khi đối thủ nhập cuộc',
      actionType: 'increase',
      roiImpact: '+29% vs trung bình kênh',
      affectedCampaign: 'camp-5',
    },
  ],

  // ─── 📈 Tóm tắt AI (1 đoạn cho CEO đọc nhanh) ─────────────────
  aiSummary:
    'Tuần này portfolio đạt ROAS 2.66×, tăng 8.2% so với tuần trước. ' +
    '2 chiến dịch retargeting đang đốt tiền rác — cần tắt ngay để tiết kiệm ~22.5M/ngày. ' +
    'Ngược lại, Zalo OA Khách hàng cũ và Product Launch đang là điểm sáng với ROAS vượt trội. ' +
    'Khuyến nghị: tăng ngân sách Zalo OA thêm 30-50%, chuẩn bị creative mới cho Brand Awareness Zalo.',

  // ─── Chiến lược phân bổ ngân sách (theo growth-engine 70/30) ───
  budgetRecommendation: {
    scaleUp: [
      { campaign: 'camp-8', reason: 'ROAS 5.9× — hiệu quả nhất', suggestedBudget: 4500000 },
      { campaign: 'camp-5', reason: 'Đang trong giai đoạn vàng launch', suggestedBudget: 18000000 },
    ],
    keep: [
      { campaign: 'camp-2', reason: 'ROAS 5.8× ổn định', suggestedBudget: 5000000 },
      { campaign: 'camp-6', reason: 'ROAS 3.0× trong ngưỡng', suggestedBudget: 6000000 },
    ],
    reduce: [
      { campaign: 'camp-1', reason: 'Junk rate 45% — cần tối ưu creative', suggestedBudget: 10000000 },
    ],
    pause: [
      { campaign: 'camp-3', reason: 'ROAS 1.2×, junk rate 71%', suggestedBudget: 0 },
      { campaign: 'camp-7', reason: 'Burnt audience — không còn hiệu quả', suggestedBudget: 0 },
      { campaign: 'camp-4', reason: 'Chờ creative mới', suggestedBudget: 0 },
    ],
  },
};

// =====================================================================
// Mock analysis results — 3 ngành × 6 insight = 18 template keys
// Key = template id (fsh-1 → fsh-6, mbb-1 → mbb-6, cos-1 → cos-6)
// =====================================================================

export const mockAnalysisResults = {

  // ═══════════════════════════════════════════════════════════════════
  // THỜI TRANG
  // ═══════════════════════════════════════════════════════════════════

  'fsh-1': {
    summary: { totalConversations: 234, analyzedAt: '2026-03-22T10:30:00Z' },
    temperature: { hot: 58, warm: 124, cold: 52 },
    productInterest: [
      { name: 'Áo thun oversize', count: 48 },
      { name: 'Đầm maxi', count: 39 },
      { name: 'Quần jeans', count: 31 },
      { name: 'Áo len', count: 27 },
      { name: 'Giày sneaker', count: 24 },
    ],
    topPainPoints: [
      { text: 'Tìm đầm đi tiệc dưới 1 triệu', count: 41 },
      { text: 'Cần áo len dày cho mùa đông', count: 33 },
      { text: 'Mua quà sinh nhật mẹ', count: 28 },
      { text: 'Tìm size L cho người lớn', count: 21 },
    ],
  },

  'fsh-2': {
    summary: { totalConversations: 156, analyzedAt: '2026-03-22T09:00:00Z' },
    junkRate: 14,
    qualityRate: 33,
    phoneCollection: { collected: 51, refused: 22, notAsked: 83 },
    topObjections: [
      { text: 'Chê giá đắt', count: 38 },
      { text: 'Phí ship cao', count: 24 },
      { text: 'Chưa tin tưởng chất lượng / hàng real', count: 18 },
      { text: 'Đang cân nhắc nhiều shop', count: 12 },
    ],
    conversionRate: 32.7,
  },

  'fsh-3': {
    summary: { totalConversations: 412, analyzedAt: '2026-03-21T08:00:00Z' },
    attitude: { good: 268, average: 112, poor: 32 },
    lostCustomers: 18,
    topMistakes: [
      { text: 'Không tư vấn size', count: 14 },
      { text: 'Trả lời cộc lốc', count: 11 },
      { text: 'Bỏ quên khách hơn 30 phút', count: 8 },
      { text: 'Không báo giá rõ ràng', count: 6 },
    ],
  },

  'fsh-4': {
    summary: { totalConversations: 198, analyzedAt: '2026-03-21T10:00:00Z' },
    gender: { male: 42, female: 148, unknown: 8 },
    topLocations: [
      { name: 'TP. Hồ Chí Minh', count: 82 },
      { name: 'Hà Nội', count: 51 },
      { name: 'Đà Nẵng', count: 19 },
      { name: 'Cần Thơ', count: 11 },
    ],
    budgetRanges: [
      { text: 'Dưới 300.000đ', count: 61 },
      { text: '300.000đ - 500.000đ', count: 52 },
      { text: '500.000đ - 1 triệu', count: 38 },
      { text: 'Trên 1 triệu', count: 22 },
      { text: 'Không đề cập', count: 25 },
    ],
  },

  'fsh-5': {
    summary: { totalConversations: 267, analyzedAt: '2026-03-20T09:00:00Z' },
    competitorMentions: { mentioned: 79, notMentioned: 188 },
    topCompetitors: [
      { name: 'Zara', count: 21 },
      { name: 'H&M', count: 17 },
      { name: 'Shein', count: 14 },
      { name: 'Uniqlo', count: 11 },
      { name: 'Local brand khác', count: 9 },
    ],
    comparisonCriteria: [
      { text: 'Giá cả', count: 44 },
      { text: 'Chất lượng', count: 31 },
      { text: 'Hàng real vs hàng fake', count: 18 },
      { text: 'Phong cách', count: 14 },
    ],
  },

  'fsh-6': {
    summary: { totalConversations: 134, analyzedAt: '2026-03-20T08:00:00Z' },
    messageType: {
      orderQuestion: 62,
      exchangeReturn: 28,
      newProduct: 31,
      other: 13,
    },
    satisfaction: { satisfied: 84, average: 32, dissatisfied: 18 },
    referralPotential: 41,
    topIssues: [
      { text: 'Giao chậm hơn 5 ngày', count: 11 },
      { text: 'Giao sai màu / size', count: 9 },
      { text: 'Yêu cầu hoàn tiền', count: 7 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // MẸ VÀ BÉ
  // ═══════════════════════════════════════════════════════════════════

  'mbb-1': {
    summary: { totalConversations: 312, analyzedAt: '2026-03-22T10:00:00Z' },
    temperature: { hot: 74, warm: 168, cold: 70 },
    productInterest: [
      { name: 'Sữa công thức', count: 68 },
      { name: 'Tã / Bỉm', count: 54 },
      { name: 'Đồ ăn dặm', count: 47 },
      { name: 'Bình sữa', count: 38 },
      { name: 'Sữa tăng cân cho bé', count: 29 },
    ],
    topPainPoints: [
      { text: 'Con bị táo bón cần sữa gì', count: 44 },
      { text: 'Tìm đồ cho bé 6 tháng ăn dặm', count: 37 },
      { text: 'Cần giao gấp vì hết hàng', count: 29 },
      { text: 'Da bé bị chàm cần sản phẩm an toàn', count: 22 },
    ],
  },

  'mbb-2': {
    summary: { totalConversations: 278, analyzedAt: '2026-03-21T11:00:00Z' },
    junkRate: 9,
    qualityRate: 38,
    phoneCollection: { collected: 88, refused: 34, notAsked: 156 },
    bulkInterest: 62,
    topObjections: [
      { text: 'Lo ngại an toàn / chất lượng', count: 51 },
      { text: 'Chê giá đắt', count: 38 },
      { text: 'Cần hỏi chồng', count: 27 },
      { text: 'Cần hỏi người thân', count: 19 },
    ],
    conversionRate: 31.6,
  },

  'mbb-3': {
    summary: { totalConversations: 512, analyzedAt: '2026-03-22T09:30:00Z' },
    attitude: { good: 342, average: 134, poor: 36 },
    lostCustomers: 24,
    topMistakes: [
      { text: 'Không giải đáp lo ngại về an toàn', count: 18 },
      { text: 'Bỏ quên khách sau 1 tiếng', count: 12 },
      { text: 'Trả lời cộc lốc về sản phẩm', count: 9 },
      { text: 'Không hỏi tuổi bé trước', count: 7 },
    ],
  },

  'mbb-4': {
    summary: { totalConversations: 167, analyzedAt: '2026-03-21T10:00:00Z' },
    parentGender: { mom: 124, dad: 28, relative: 11, unknown: 4 },
    babyAge: [
      { text: '0-6 tháng', count: 48 },
      { text: '6-12 tháng', count: 39 },
      { text: '1-3 tuổi', count: 34 },
      { text: '3 tuổi trở lên', count: 21 },
      { text: 'Không xác định', count: 25 },
    ],
    topLocations: [
      { name: 'TP. Hồ Chí Minh', count: 62 },
      { name: 'Hà Nội', count: 41 },
      { name: 'Bình Dương', count: 14 },
      { name: 'Đồng Nai', count: 9 },
    ],
    budgetRanges: [
      { text: 'Dưới 500.000đ', count: 54 },
      { text: '500.000đ - 1 triệu', count: 41 },
      { text: '1 triệu - 2 triệu', count: 33 },
      { text: 'Trên 2 triệu', count: 18 },
      { text: 'Không đề cập', count: 21 },
    ],
  },

  'mbb-5': {
    summary: { totalConversations: 198, analyzedAt: '2026-03-20T09:00:00Z' },
    competitorMentions: { mentioned: 68, notMentioned: 130 },
    topCompetitors: [
      { name: 'Friso', count: 24 },
      { name: 'Bobby', count: 18 },
      { name: 'Pampers', count: 15 },
      { name: '雀巢 (Nestle)', count: 12 },
      { name: 'Glico', count: 8 },
    ],
    comparisonCriteria: [
      { text: 'An toàn', count: 38 },
      { text: 'Giá cả', count: 31 },
      { text: 'Chất lượng', count: 24 },
      { text: 'Giao hàng', count: 14 },
    ],
  },

  'mbb-6': {
    summary: { totalConversations: 89, analyzedAt: '2026-03-19T08:00:00Z' },
    messageType: {
      shipping: 31,
      usageGuide: 22,
      safetyComplaint: 18,
      exchangeReturn: 12,
      other: 6,
    },
    urgentSafetyComplaints: 18,
    negativeSentiment: 12,
    topUrgent: [
      { text: 'Báo sản phẩm có mùi lạ, nghi hàng giả', count: 7 },
      { text: 'Bé bị nổi mẩn sau khi dùng sữa', count: 5 },
      { text: 'Hàng giao đến đã hết date', count: 4 },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // MỸ PHẨM
  // ═══════════════════════════════════════════════════════════════════

  'cos-1': {
    summary: { totalConversations: 287, analyzedAt: '2026-03-22T10:15:00Z' },
    temperature: { hot: 61, warm: 142, cold: 84 },
    productInterest: [
      { name: 'Serum trị mụn ẩn', count: 67 },
      { name: 'Kem dưỡng ẩm', count: 52 },
      { name: 'Kem chống nắng', count: 45 },
      { name: 'Toner / Nước cân bằng', count: 38 },
      { name: 'Kem nền / Trang điểm', count: 31 },
    ],
    topPainPoints: [
      { text: 'Da dầu nhờn, mụn ẩn khó trị', count: 58 },
      { text: 'Da nhạy cảm hay kích ứng', count: 44 },
      { text: 'Tìm serum giá bình dân dưới 300k', count: 37 },
      { text: 'Mụn ẩn lâu năm không hết', count: 29 },
    ],
  },

  'cos-2': {
    summary: { totalConversations: 234, analyzedAt: '2026-03-21T09:30:00Z' },
    junkRate: 11,
    qualityRate: 35,
    phoneCollection: { collected: 72, refused: 38, notAsked: 124 },
    topObjections: [
      { text: 'Lo ngại hàng fake / không real', count: 61 },
      { text: 'Chê giá đắt', count: 44 },
      { text: 'Đang cân nhắc nhiều nơi', count: 28 },
      { text: 'Hỏi thêm về thành phần', count: 22 },
    ],
    proofRequestRate: 28,
    conversionRate: 30.8,
  },

  'cos-3': {
    summary: { totalConversations: 456, analyzedAt: '2026-03-22T09:00:00Z' },
    attitude: { good: 298, average: 118, poor: 40 },
    lostCustomers: 21,
    topMistakes: [
      { text: 'Không giải đáp lo ngại về hàng fake', count: 16 },
      { text: 'Trả lời sai về thành phần sản phẩm', count: 12 },
      { text: 'Bỏ quên khách sau 1 tiếng', count: 9 },
      { text: 'Không tư vấn đúng loại da', count: 7 },
    ],
  },

  'cos-4': {
    summary: { totalConversations: 189, analyzedAt: '2026-03-21T10:00:00Z' },
    gender: { male: 28, female: 154, unknown: 7 },
    skinType: [
      { text: 'Da dầu / Da nhờn', count: 68 },
      { text: 'Da nhạy cảm', count: 51 },
      { text: 'Da hỗn hợp', count: 34 },
      { text: 'Da khô', count: 28 },
      { text: 'Không xác định', count: 8 },
    ],
    topLocations: [
      { name: 'TP. Hồ Chí Minh', count: 74 },
      { name: 'Hà Nội', count: 48 },
      { name: 'Bình Dương', count: 16 },
      { name: 'Đà Nẵng', count: 12 },
    ],
    budgetRanges: [
      { text: 'Dưới 300.000đ', count: 52 },
      { text: '300.000đ - 500.000đ', count: 47 },
      { text: '500.000đ - 1 triệu', count: 38 },
      { text: 'Trên 1 triệu', count: 24 },
      { text: 'Không đề cập', count: 28 },
    ],
  },

  'cos-5': {
    summary: { totalConversations: 234, analyzedAt: '2026-03-20T09:00:00Z' },
    competitorMentions: { mentioned: 78, notMentioned: 156 },
    topCompetitors: [
      { name: 'Some By Mi', count: 22 },
      { name: 'La Roche-Posay', count: 19 },
      { name: 'Dr. G', count: 14 },
      { name: 'Cocoon', count: 11 },
      { name: 'Klum', count: 8 },
    ],
    comparisonCriteria: [
      { text: 'Hàng real / Xuất xứ', count: 44 },
      { text: 'Thành phần', count: 31 },
      { text: 'Giá cả', count: 28 },
      { text: 'Hiệu quả', count: 19 },
    ],
  },

  'cos-6': {
    summary: { totalConversations: 98, analyzedAt: '2026-03-19T08:00:00Z' },
    messageType: {
      allergyComplaint: 12,
      shipping: 38,
      usageGuide: 24,
      otherComplaint: 14,
      other: 10,
    },
    urgentAllergyComplaints: 12,
    negativeSentiment: 14,
    topUrgent: [
      { text: 'Báo bị nổi mẩn sau khi dùng serum', count: 5 },
      { text: 'Bị dị ứng kem dưỡng da mặt', count: 4 },
      { text: 'Da bị bỏng rát sau khi apply', count: 3 },
    ],
  },
};

export function getAnalysisByTemplateId(templateId) {
  return mockAnalysisResults[templateId] || null;
}

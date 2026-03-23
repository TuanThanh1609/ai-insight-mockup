// =====================================================================
// Mock conversations hiển thị trong tab "Chi tiết" của InsightDetailModal
// Key = templateId thực tế trong mockTemplates (fsh-*, mbb-*, cos-*, spa-*, rls-*, fb-*, trv-*)
//
// Cấu trúc:
//   columns: [{ id, name, field }]  — field khớp với col.field trong InsightDetailModal
//   rows: [{ id, customer, [field]: value, platform }]  — platform: 'facebook' | 'zalo'
// =====================================================================

export const mockConversations = {
  // ─── Template 1: Phân tích Nhu Cầu KH Đa Kênh ─────────────────────────
  'tpl-1': {
    columns: [
      { id: 'col-product', name: 'Sản phẩm quan tâm', field: 'product' },
      { id: 'col-temp', name: 'Mức độ quan tâm', field: 'temperature' },
      { id: 'col-pain', name: 'Nhu cầu cốt lõi', field: 'painPoint' },
      { id: 'col-gender', name: 'Giới tính', field: 'gender' },
    ],
    rows: [
      { id: 'c1', customer: 'Nguyễn Thị Lan', product: 'Serum trị mụn ẩn', temperature: 'Nóng', painPoint: 'Da dầu nhờn mụn ẩn', gender: 'Nữ', platform: 'facebook' },
      { id: 'c2', customer: 'Trần Văn Minh', product: 'Kem dưỡng ẩm', temperature: 'Ấm', painPoint: 'Tìm sản phẩm dưới 500k', gender: 'Nam', platform: 'zalo' },
      { id: 'c3', customer: 'Phạm Thị Hương', product: 'Sữa rửa mặt', temperature: 'Nóng', painPoint: 'Da nhạy cảm hay kích ứng', gender: 'Nữ', platform: 'facebook' },
      { id: 'c4', customer: 'Lê Hoàng Nam', product: 'Kem chống nắng', temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep', gender: 'Nam', platform: 'zalo' },
      { id: 'c5', customer: 'Đỗ Minh Thy', product: 'Serum trị mụn ẩn', temperature: 'Nóng', painPoint: 'Mụn ẩn lâu năm không hết', gender: 'Nữ', platform: 'facebook' },
      { id: 'c6', customer: 'Bùi Đức Anh', product: 'Tinh chất Vitamin C', temperature: 'Ấm', painPoint: 'Da dầu nhờn mụn ẩn', gender: 'Nam', platform: 'zalo' },
      { id: 'c7', customer: 'Vũ Thu Hà', product: 'Kem dưỡng ẩm', temperature: 'Ấm', painPoint: 'Tìm sản phẩm dưới 500k', gender: 'Nữ', platform: 'facebook' },
      { id: 'c8', customer: 'Hoàng Minh Tuấn', product: 'Sữa rửa mặt', temperature: 'Lạnh', painPoint: 'Khách từ chối mua', gender: 'Nam', platform: 'zalo' },
    ],
  },

  // ─── Template 2: Đánh Giá Chất Lượng Nguồn Lead ───────────────────
  'tpl-2': {
    columns: [
      { id: 'col-junk', name: 'Khách rác', field: 'isJunk' },
      { id: 'col-phone', name: 'Thu thập SĐT', field: 'phoneStatus' },
      { id: 'col-objection', name: 'Rào cản chốt đơn', field: 'objection' },
      { id: 'col-quality', name: 'Chất lượng', field: 'quality' },
    ],
    rows: [
      { id: 'c1', customer: 'Nguyễn Thị Lan', isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản', quality: 'Tốt', platform: 'facebook' },
      { id: 'c2', customer: 'Trần Văn Minh', isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Chê giá đắt', quality: 'Khá', platform: 'zalo' },
      { id: 'c3', customer: 'Phạm Thị Hương', isJunk: true, phoneStatus: 'Chưa cho', objection: 'Khách hàng rác', quality: 'Rác', platform: 'facebook' },
      { id: 'c4', customer: 'Lê Hoàng Nam', isJunk: false, phoneStatus: 'Từ chối', objection: 'Phí ship cao', quality: 'Trung bình', platform: 'zalo' },
      { id: 'c5', customer: 'Đỗ Minh Thy', isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản', quality: 'Tốt', platform: 'facebook' },
      { id: 'c6', customer: 'Bùi Đức Anh', isJunk: false, phoneStatus: 'Chưa cho', objection: 'Đang cân nhắc', quality: 'Trung bình', platform: 'zalo' },
    ],
  },

  // ─── Template 3: Đánh Giá Nhân Viên Tư Vấn Sale ──────────────────
  'tpl-3': {
    columns: [
      { id: 'col-sale', name: 'Nhân viên Sale', field: 'saleName' },
      { id: 'col-attitude', name: 'Thái độ tư vấn', field: 'attitude' },
      { id: 'col-mistake', name: 'Lỗi mất khách', field: 'mistake' },
      { id: 'col-customer', name: 'Khách hàng', field: 'customer' },
    ],
    rows: [
      { id: 'c1', saleName: 'Nguyễn Thị Lan', attitude: 'Tốt', mistake: 'Không có lỗi', customer: 'Nguyễn Thị Lan', platform: 'facebook' },
      { id: 'c2', saleName: 'Trần Văn Minh', attitude: 'Tốt', mistake: 'Không có lỗi', customer: 'Trần Văn Minh', platform: 'zalo' },
      { id: 'c3', saleName: 'Phạm Thị Hương', attitude: 'Trung bình', mistake: 'Trả lời cộc lốc', customer: 'Phạm Thị Hương', platform: 'facebook' },
      { id: 'c4', saleName: 'Lê Hoàng Nam', attitude: 'Tốt', mistake: 'Không có lỗi', customer: 'Lê Hoàng Nam', platform: 'zalo' },
      { id: 'c5', saleName: 'Vũ Thu Hà', attitude: 'Kém', mistake: 'Không báo giá rõ ràng', customer: 'Vũ Thu Hà', platform: 'facebook' },
      { id: 'c6', saleName: 'Nguyễn Thị Lan', attitude: 'Tốt', mistake: 'Không có lỗi', customer: 'Hoàng Minh Tuấn', platform: 'zalo' },
    ],
  },

  // ─── Template 4: Phân Tích Chân Dung Khách Hàng ──────────────────
  'tpl-4': {
    columns: [
      { id: 'col-gender', name: 'Giới tính', field: 'gender' },
      { id: 'col-location', name: 'Khu vực', field: 'location' },
      { id: 'col-budget', name: 'Ngân sách', field: 'budget' },
      { id: 'col-product', name: 'SP quan tâm', field: 'product' },
    ],
    rows: [
      { id: 'c1', customer: 'Nguyễn Thị Lan', gender: 'Nữ', location: 'TP. Hồ Chí Minh', budget: '300k - 500k', product: 'Serum trị mụn', platform: 'facebook' },
      { id: 'c2', customer: 'Trần Văn Minh', gender: 'Nam', location: 'Hà Nội', budget: 'Dưới 300.000đ', product: 'Kem dưỡng ẩm', platform: 'zalo' },
      { id: 'c3', customer: 'Phạm Thị Hương', gender: 'Nữ', location: 'Đà Nẵng', budget: '500k - 1 triệu', product: 'Kem chống nắng', platform: 'facebook' },
      { id: 'c4', customer: 'Lê Hoàng Nam', gender: 'Nam', location: 'TP. Hồ Chí Minh', budget: 'Không đề cập', product: 'Sữa rửa mặt', platform: 'zalo' },
      { id: 'c5', customer: 'Đỗ Minh Thy', gender: 'Nữ', location: 'Cần Thơ', budget: 'Dưới 300.000đ', product: 'Serum trị mụn', platform: 'facebook' },
      { id: 'c6', customer: 'Bùi Đức Anh', gender: 'Nam', location: 'Hà Nội', budget: 'Trên 1 triệu', product: 'Tinh chất Vitamin C', platform: 'zalo' },
    ],
  },

  // ─── Template 5: Phân Tích Đối Thủ Cạnh Tranh ──────────────────────
  'tpl-5': {
    columns: [
      { id: 'col-mention', name: 'Nhắc đến đối thủ', field: 'hasCompetitor' },
      { id: 'col-name', name: 'Tên đối thủ', field: 'competitorName' },
      { id: 'col-criteria', name: 'Tiêu chí so sánh', field: 'criteria' },
      { id: 'col-sentiment', name: 'Cảm xúc', field: 'sentiment' },
    ],
    rows: [
      { id: 'c1', customer: 'Nguyễn Thị Lan', hasCompetitor: true, competitorName: 'Dr. G', criteria: 'Giá cả', sentiment: 'Tiêu cực', platform: 'facebook' },
      { id: 'c2', customer: 'Trần Văn Minh', hasCompetitor: true, competitorName: 'Some By Mi', criteria: 'Chất lượng', sentiment: 'Trung lập', platform: 'zalo' },
      { id: 'c3', customer: 'Phạm Thị Hương', hasCompetitor: false, competitorName: 'Không có', criteria: 'Không có', sentiment: 'Tích cực', platform: 'facebook' },
      { id: 'c4', customer: 'Lê Hoàng Nam', hasCompetitor: true, competitorName: 'La Roche-Posay', criteria: 'Phí giao hàng', sentiment: 'Tiêu cực', platform: 'zalo' },
      { id: 'c5', customer: 'Đỗ Minh Thy', hasCompetitor: true, competitorName: 'Cocoon', criteria: 'Giá cả', sentiment: 'Tích cực', platform: 'facebook' },
      { id: 'c6', customer: 'Bùi Đức Anh', hasCompetitor: false, competitorName: 'Không có', criteria: 'Không có', sentiment: 'Trung lập', platform: 'zalo' },
    ],
  },

  // ─── Template 6: Phân Tích Chăm Sóc Sau Mua ────────────────────────
  'tpl-6': {
    columns: [
      { id: 'col-type', name: 'Loại tin nhắn', field: 'messageType' },
      { id: 'col-negative', name: 'Tiêu cực', field: 'isNegative' },
      { id: 'col-priority', name: 'Mức độ ưu tiên', field: 'priority' },
      { id: 'col-status', name: 'Trạng thái', field: 'status' },
    ],
    rows: [
      { id: 'c1', customer: 'Nguyễn Thị Lan', messageType: 'Hỏi giao hàng', isNegative: false, priority: 'Bình thường', status: 'Đã xử lý', platform: 'facebook' },
      { id: 'c2', customer: 'Trần Văn Minh', messageType: 'Xin hướng dẫn sử dụng', isNegative: false, priority: 'Bình thường', status: 'Đã xử lý', platform: 'zalo' },
      { id: 'c3', customer: 'Phạm Thị Hương', messageType: 'Khiếu nại lỗi', isNegative: true, priority: 'Cao', status: 'Đang xử lý', platform: 'facebook' },
      { id: 'c4', customer: 'Lê Hoàng Nam', messageType: 'Khiếu nại lỗi', isNegative: true, priority: 'Cao', status: 'Đang xử lý', platform: 'zalo' },
      { id: 'c5', customer: 'Đỗ Minh Thy', messageType: 'Hỏi giao hàng', isNegative: false, priority: 'Bình thường', status: 'Đã xử lý', platform: 'facebook' },
      { id: 'c6', customer: 'Bùi Đức Anh', messageType: 'Khác', isNegative: false, priority: 'Thấp', status: 'Đã xử lý', platform: 'zalo' },
    ],
  },
};

export function getConversationsByTemplateId(templateId) {
  return mockConversations[templateId] || null;
}

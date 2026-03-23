// =====================================================================
// Mock conversations cho tab "Chi tiết" — InsightDetailModal
// Key = templateId thực tế (fsh-*, mbb-*, cos-*, spa-*, rls-*, fb-*, trv-*)
//
// Cấu trúc mỗi entry:
//   columns: [{ id, name, field }]  field phải khớp với template column id
//   rows:    [{ id, customer, [field]: value, platform }]
// platform: 'facebook' | 'zalo'
// =====================================================================

export const mockConversations = {

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 1: THỜI TRANG
  // ═══════════════════════════════════════════════════════════════════

  // ─── fsh-1: Phân Tích Nhu Cầu KH ─────────────────────────────
  'fsh-1': {
    columns: [
      { id: 'fsh-1-1', name: 'Sản phẩm / Mẫu quan tâm', field: 'product' },
      { id: 'fsh-1-2', name: 'Size quan tâm',            field: 'size' },
      { id: 'fsh-1-3', name: 'Mức độ quan tâm',          field: 'temperature' },
      { id: 'fsh-1-4', name: 'Nhu cầu cốt lõi',           field: 'painPoint' },
    ],
    rows: [
      { id: 'f1c1', customer: 'Trần Minh Châu',    product: 'Đầm maxi hoa nhí',   size: 'M',         temperature: 'Nóng', painPoint: 'Tìm đầm đi tiệc dưới 1 triệu',   platform: 'facebook' },
      { id: 'f1c2', customer: 'Nguyễn Hoàng Nam',  product: 'Áo thun oversize',   size: 'XL',        temperature: 'Ấm', painPoint: 'Cần áo thu đông cho mùa lạnh',     platform: 'zalo' },
      { id: 'f1c3', customer: 'Lê Thu Hương',      product: 'Quần jeans wide leg',size: '28',        temperature: 'Nóng', painPoint: 'Mua quà sinh nhật cho mẹ',          platform: 'facebook' },
      { id: 'f1c4', customer: 'Phạm Đức Tùng',     product: 'Giày sneaker',        size: '42',        temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',          platform: 'zalo' },
      { id: 'f1c5', customer: 'Vũ Thị Lan',        product: 'Áo len dày',         size: 'L',         temperature: 'Ấm', painPoint: 'Tìm size L cho người lớn tuổi',   platform: 'facebook' },
      { id: 'f1c6', customer: 'Đặng Minh Tuấn',     product: 'Áo thun nam',         size: 'M',         temperature: 'Nóng', painPoint: 'Cần mua gấp trước cuối tuần',     platform: 'zalo' },
    ],
  },

  // ─── fsh-2: Đánh Giá Chất Lượng Lead ─────────────────────────
  'fsh-2': {
    columns: [
      { id: 'fsh-2-1', name: 'Khách hàng rác',        field: 'isJunk' },
      { id: 'fsh-2-2', name: 'Trạng thái thu thập SĐT', field: 'phoneStatus' },
      { id: 'fsh-2-3', name: 'Rào cản chốt đơn',      field: 'objection' },
      { id: 'fsh-2-4', name: 'Nguồn Ads',             field: 'adsSource' },
    ],
    rows: [
      { id: 'f2c1', customer: 'Trần Minh Châu',    isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản',              adsSource: 'Facebook Ads', platform: 'facebook' },
      { id: 'f2c2', customer: 'Nguyễn Hoàng Nam',  isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Chê giá đắt',                  adsSource: 'Facebook Ads', platform: 'zalo' },
      { id: 'f2c3', customer: 'Lê Thu Hương',      isJunk: true,  phoneStatus: 'Chưa cho',    objection: 'Khách hàng rác',                adsSource: 'Zalo Ads',     platform: 'facebook' },
      { id: 'f2c4', customer: 'Phạm Đức Tùng',     isJunk: false, phoneStatus: 'Từ chối',    objection: 'Phí ship cao',                 adsSource: 'Facebook Ads', platform: 'zalo' },
      { id: 'f2c5', customer: 'Vũ Thị Lan',         isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Đang cân nhắc nhiều shop',      adsSource: 'Tiktok Ads',   platform: 'facebook' },
    ],
  },

  // ─── fsh-3: Đánh Giá Sale ────────────────────────────────────
  'fsh-3': {
    columns: [
      { id: 'fsh-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'fsh-3-2', name: 'Lỗi mất khách do Sale',    field: 'mistake' },
    ],
    rows: [
      { id: 'f3c1', customer: 'Trần Minh Châu',    attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'facebook' },
      { id: 'f3c2', customer: 'Nguyễn Hoàng Nam',  attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'zalo' },
      { id: 'f3c3', customer: 'Lê Thu Hương',      attitude: 'Trung bình', mistake: 'Trả lời cộc lốc',            platform: 'facebook' },
      { id: 'f3c4', customer: 'Phạm Đức Tùng',     attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'zalo' },
      { id: 'f3c5', customer: 'Vũ Thị Lan',         attitude: 'Kém', mistake: 'Không tư vấn size',                 platform: 'facebook' },
      { id: 'f3c6', customer: 'Đặng Minh Tuấn',     attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'zalo' },
    ],
  },

  // ─── fsh-4: Phân Tích Chân Dung KH ───────────────────────────
  'fsh-4': {
    columns: [
      { id: 'fsh-4-1', name: 'Giới tính dự đoán', field: 'gender' },
      { id: 'fsh-4-2', name: 'Khu vực địa lý',     field: 'location' },
      { id: 'fsh-4-3', name: 'Khoảng ngân sách',   field: 'budget' },
      { id: 'fsh-4-4', name: 'Phân loại KH',       field: 'segment' },
    ],
    rows: [
      { id: 'f4c1', customer: 'Trần Minh Châu',    gender: 'Nữ', location: 'TP. Hồ Chí Minh', budget: '300k - 500k',   segment: 'Khách mới',   platform: 'facebook' },
      { id: 'f4c2', customer: 'Nguyễn Hoàng Nam',  gender: 'Nam', location: 'Hà Nội',           budget: 'Dưới 300k',     segment: 'Khách mới',   platform: 'zalo' },
      { id: 'f4c3', customer: 'Lê Thu Hương',      gender: 'Nữ', location: 'Đà Nẵng',           budget: '500k - 1 triệu', segment: 'Khách quen',  platform: 'facebook' },
      { id: 'f4c4', customer: 'Phạm Đức Tùng',     gender: 'Nam', location: 'TP. Hồ Chí Minh', budget: 'Không đề cập', segment: 'Khách mới',   platform: 'zalo' },
      { id: 'f4c5', customer: 'Vũ Thị Lan',        gender: 'Nữ', location: 'Cần Thơ',           budget: 'Dưới 300k',     segment: 'Khách hoàn tiền', platform: 'facebook' },
    ],
  },

  // ─── fsh-5: Phân Tích Đối Thủ ────────────────────────────────
  'fsh-5': {
    columns: [
      { id: 'fsh-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'fsh-5-2', name: 'Tên đối thủ',           field: 'competitorName' },
      { id: 'fsh-5-3', name: 'Tiêu chí so sánh',      field: 'criteria' },
    ],
    rows: [
      { id: 'f5c1', customer: 'Trần Minh Châu',    hasCompetitor: true,  competitorName: 'Zara',              criteria: 'Giá cả',           platform: 'facebook' },
      { id: 'f5c2', customer: 'Nguyễn Hoàng Nam', hasCompetitor: false, competitorName: 'Không có',         criteria: 'Không có',         platform: 'zalo' },
      { id: 'f5c3', customer: 'Lê Thu Hương',      hasCompetitor: true,  competitorName: 'H&M',               criteria: 'Chất lượng',        platform: 'facebook' },
      { id: 'f5c4', customer: 'Phạm Đức Tùng',     hasCompetitor: true,  competitorName: 'Uniqlo',            criteria: 'Phí giao hàng',    platform: 'zalo' },
      { id: 'f5c5', customer: 'Vũ Thị Lan',        hasCompetitor: false, competitorName: 'Không có',         criteria: 'Không có',         platform: 'facebook' },
    ],
  },

  // ─── fsh-6: Phân Tích Retargeting ────────────────────────────
  'fsh-6': {
    columns: [
      { id: 'fsh-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'fsh-6-2', name: 'Mức độ hài lòng',               field: 'satisfaction' },
      { id: 'fsh-6-3', name: 'Khách có giới thiệu được?',      field: 'canRefer' },
    ],
    rows: [
      { id: 'f6c1', customer: 'Trần Minh Châu',    messageType: 'Hỏi về đơn hàng', satisfaction: 'Hài lòng',      canRefer: true,  platform: 'facebook' },
      { id: 'f6c2', customer: 'Nguyễn Hoàng Nam', messageType: 'Xin đổi trả',      satisfaction: 'Không hài lòng', canRefer: false, platform: 'zalo' },
      { id: 'f6c3', customer: 'Lê Thu Hương',      messageType: 'Hỏi sản phẩm mới', satisfaction: 'Hài lòng',      canRefer: true,  platform: 'facebook' },
      { id: 'f6c4', customer: 'Phạm Đức Tùng',     messageType: 'Hỏi về đơn hàng', satisfaction: 'Trung bình',    canRefer: false, platform: 'zalo' },
      { id: 'f6c5', customer: 'Vũ Thị Lan',        messageType: 'Xin đổi trả',      satisfaction: 'Không hài lòng', canRefer: false, platform: 'facebook' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 2: MẸ VÀ BÉ
  // ═══════════════════════════════════════════════════════════════════

  // ─── mbb-1: Phân Tích Nhu Cầu KH ───────────────────────────
  'mbb-1': {
    columns: [
      { id: 'mbb-1-1', name: 'Sản phẩm / Danh mục quan tâm', field: 'product' },
      { id: 'mbb-1-2', name: 'Độ tuổi bé / Giai đoạn',       field: 'babyAge' },
      { id: 'mbb-1-3', name: 'Mức độ quan tâm',                field: 'temperature' },
      { id: 'mbb-1-4', name: 'Nhu cầu cốt lõi',                field: 'painPoint' },
    ],
    rows: [
      { id: 'm1c1', customer: 'Nguyễn Thị Mai',   product: 'Sữa công thức',   babyAge: '6 tháng', temperature: 'Nóng', painPoint: 'Con bị táo bón cần sữa gì',       platform: 'facebook' },
      { id: 'm1c2', customer: 'Trần Văn Hùng',   product: 'Tã quần',         babyAge: '18 tháng', temperature: 'Ấm', painPoint: 'Tìm tã cho bé 18 tháng chạy nhiều', platform: 'zalo' },
      { id: 'm1c3', customer: 'Lê Thu Phương',   product: 'Đồ ăn dặm',       babyAge: '7 tháng', temperature: 'Nóng', painPoint: 'Cần giao gấp vì hết đồ ăn dặm',  platform: 'facebook' },
      { id: 'm1c4', customer: 'Phạm Đức Anh',    product: 'Sữa công thức',   babyAge: 'Không xác định', temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',        platform: 'zalo' },
      { id: 'm1c5', customer: 'Vũ Hoàng Yến',     product: 'Bỉm tã',           babyAge: '3 tháng', temperature: 'Ấm', painPoint: 'Da bé bị hăm cần sản phẩm nhẹ',   platform: 'facebook' },
    ],
  },

  // ─── mbb-2: Đánh Giá Chất Lượng Lead ────────────────────────
  'mbb-2': {
    columns: [
      { id: 'mbb-2-1', name: 'Khách hàng rác',       field: 'isJunk' },
      { id: 'mbb-2-2', name: 'Trạng thái thu thập SĐT', field: 'phoneStatus' },
      { id: 'mbb-2-3', name: 'Rào cản chốt đơn',       field: 'objection' },
      { id: 'mbb-2-4', name: 'Quan tâm mua sỉ / Combo', field: 'isBulk' },
    ],
    rows: [
      { id: 'm2c1', customer: 'Nguyễn Thị Mai',   isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản',           isBulk: true,  platform: 'facebook' },
      { id: 'm2c2', customer: 'Trần Văn Hùng',   isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Lo ngại an toàn / chất lượng', isBulk: false, platform: 'zalo' },
      { id: 'm2c3', customer: 'Lê Thu Phương',   isJunk: true,  phoneStatus: 'Chưa cho',    objection: 'Khách hàng rác',              isBulk: false, platform: 'facebook' },
      { id: 'm2c4', customer: 'Phạm Đức Anh',   isJunk: false, phoneStatus: 'Từ chối',    objection: 'Cần hỏi chồng',              isBulk: false, platform: 'zalo' },
      { id: 'm2c5', customer: 'Vũ Hoàng Yến',     isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản',           isBulk: true,  platform: 'facebook' },
    ],
  },

  // ─── mbb-3: Đánh Giá Sale ────────────────────────────────────
  'mbb-3': {
    columns: [
      { id: 'mbb-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'mbb-3-2', name: 'Lỗi mất khách do Sale',    field: 'mistake' },
    ],
    rows: [
      { id: 'm3c1', customer: 'Nguyễn Thị Mai',   attitude: 'Tốt', mistake: 'Không có lỗi',                           platform: 'facebook' },
      { id: 'm3c2', customer: 'Trần Văn Hùng',   attitude: 'Tốt', mistake: 'Không có lỗi',                           platform: 'zalo' },
      { id: 'm3c3', customer: 'Lê Thu Phương',   attitude: 'Trung bình', mistake: 'Không giải đáp lo ngại về an toàn', platform: 'facebook' },
      { id: 'm3c4', customer: 'Phạm Đức Anh',     attitude: 'Tốt', mistake: 'Không có lỗi',                           platform: 'zalo' },
      { id: 'm3c5', customer: 'Vũ Hoàng Yến',    attitude: 'Kém', mistake: 'Trả lời cộc lốc về thành phần sữa',     platform: 'facebook' },
    ],
  },

  // ─── mbb-4: Phân Tích Chân Dung KH ──────────────────────────
  'mbb-4': {
    columns: [
      { id: 'mbb-4-1', name: 'Giới tính phụ huynh', field: 'gender' },
      { id: 'mbb-4-2', name: 'Độ tuổi bé',          field: 'babyAge' },
      { id: 'mbb-4-3', name: 'Khu vực địa lý',      field: 'location' },
      { id: 'mbb-4-4', name: 'Khoảng ngân sách',    field: 'budget' },
    ],
    rows: [
      { id: 'm4c1', customer: 'Nguyễn Thị Mai',   gender: 'Mẹ', location: 'TP. Hồ Chí Minh', budget: '500k - 1 triệu',    platform: 'facebook' },
      { id: 'm4c2', customer: 'Trần Văn Hùng',   gender: 'Bố', location: 'Hà Nội',           budget: 'Dưới 500k',         platform: 'zalo' },
      { id: 'm4c3', customer: 'Lê Thu Phương',   gender: 'Mẹ', location: 'Đà Nẵng',           budget: '1 - 2 triệu',       platform: 'facebook' },
      { id: 'm4c4', customer: 'Vũ Hoàng Yến',    gender: 'Người thân', location: 'Cần Thơ', budget: 'Dưới 500k',     platform: 'facebook' },
      { id: 'm4c5', customer: 'Phạm Đức Anh',    gender: 'Mẹ', location: 'TP. Hồ Chí Minh', budget: 'Không đề cập',     platform: 'zalo' },
    ],
  },

  // ─── mbb-5: Phân Tích Đối Thủ ────────────────────────────────
  'mbb-5': {
    columns: [
      { id: 'mbb-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'mbb-5-2', name: 'Tên đối thủ / Thương hiệu', field: 'competitorName' },
      { id: 'mbb-5-3', name: 'Tiêu chí so sánh',        field: 'criteria' },
    ],
    rows: [
      { id: 'm5c1', customer: 'Nguyễn Thị Mai',   hasCompetitor: true,  competitorName: 'Friso',          criteria: 'Chất lượng',    platform: 'facebook' },
      { id: 'm5c2', customer: 'Trần Văn Hùng',   hasCompetitor: false, competitorName: 'Không có',       criteria: 'Không có',      platform: 'zalo' },
      { id: 'm5c3', customer: 'Lê Thu Phương',   hasCompetitor: true,  competitorName: 'Bobby',          criteria: 'An toàn',       platform: 'facebook' },
      { id: 'm5c4', customer: 'Vũ Hoàng Yến',    hasCompetitor: true,  competitorName: 'Pampers',         criteria: 'Giá cả',       platform: 'facebook' },
      { id: 'm5c5', customer: 'Phạm Đức Anh',   hasCompetitor: false, competitorName: 'Không có',       criteria: 'Không có',      platform: 'zalo' },
    ],
  },

  // ─── mbb-6: Phân Tích Sau Mua ──────────────────────────────
  'mbb-6': {
    columns: [
      { id: 'mbb-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'mbb-6-2', name: 'Mức độ bức xúc',              field: 'isNegative' },
    ],
    rows: [
      { id: 'm6c1', customer: 'Nguyễn Thị Mai',   messageType: 'Hỏi giao hàng',       isNegative: false, platform: 'facebook' },
      { id: 'm6c2', customer: 'Trần Văn Hùng',   messageType: 'Xin hướng dẫn sử dụng', isNegative: false, platform: 'zalo' },
      { id: 'm6c3', customer: 'Lê Thu Phương',   messageType: 'Khiếu nại lỗi-an toàn', isNegative: true,  platform: 'facebook' },
      { id: 'm6c4', customer: 'Vũ Hoàng Yến',    messageType: 'Xin đổi trả',           isNegative: false, platform: 'facebook' },
      { id: 'm6c5', customer: 'Phạm Đức Anh',    messageType: 'Khiếu nại lỗi-an toàn', isNegative: true,  platform: 'zalo' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 3: MỸ PHẨM
  // ═══════════════════════════════════════════════════════════════════

  // ─── cos-1: Phân Tích Nhu Cầu KH ───────────────────────────
  'cos-1': {
    columns: [
      { id: 'cos-1-1', name: 'Sản phẩm / Dịch vụ quan tâm', field: 'product' },
      { id: 'cos-1-2', name: 'Loại da / Vấn đề da',        field: 'skinType' },
      { id: 'cos-1-3', name: 'Mức độ quan tâm',              field: 'temperature' },
      { id: 'cos-1-4', name: 'Nhu cầu cốt lõi',              field: 'painPoint' },
    ],
    rows: [
      { id: 'c1c1', customer: 'Trần Thị Lan',    product: 'Serum trị mụn ẩn',   skinType: 'Da dầu nhờn',    temperature: 'Nóng', painPoint: 'Trị mụn ẩn lâu năm không hết',    platform: 'facebook' },
      { id: 'c1c2', customer: 'Nguyễn Đức Minh', product: 'Kem dưỡng ẩm',       skinType: 'Da nhạy cảm',    temperature: 'Ấm', painPoint: 'Tìm kem dưỡng cho da nhạy cảm', platform: 'zalo' },
      { id: 'c1c3', customer: 'Lê Hoàng Yến',    product: 'Kem chống nắng',     skinType: 'Da hỗn hợp',     temperature: 'Nóng', painPoint: 'Tìm kem chống nắng cho da dầu',  platform: 'facebook' },
      { id: 'c1c4', customer: 'Phạm Thu Hà',    product: 'Toner',               skinType: 'Da dầu',        temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',        platform: 'zalo' },
      { id: 'c1c5', customer: 'Vũ Minh Tuấn',    product: 'Serum trị nám',      skinType: 'Da nám',         temperature: 'Ấm', painPoint: 'Cần serum giá bình dân trị nám',   platform: 'facebook' },
    ],
  },

  // ─── cos-2: Đánh Giá Chất Lượng Lead ───────────────────────
  'cos-2': {
    columns: [
      { id: 'cos-2-1', name: 'Khách hàng rác',            field: 'isJunk' },
      { id: 'cos-2-2', name: 'Trạng thái thu thập SĐT',  field: 'phoneStatus' },
      { id: 'cos-2-3', name: 'Rào cản chốt đơn',          field: 'objection' },
      { id: 'cos-2-4', name: 'Yêu cầu chứng minh real',   field: 'askReal' },
    ],
    rows: [
      { id: 'c2c1', customer: 'Trần Thị Lan',    isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Lo ngại hàng fake',        askReal: true,  platform: 'facebook' },
      { id: 'c2c2', customer: 'Nguyễn Đức Minh', isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Hỏi thêm về thành phần',   askReal: false, platform: 'zalo' },
      { id: 'c2c3', customer: 'Lê Hoàng Yến',   isJunk: true,  phoneStatus: 'Chưa cho',    objection: 'Khách hàng rác',          askReal: false, platform: 'facebook' },
      { id: 'c2c4', customer: 'Phạm Thu Hà',     isJunk: false, phoneStatus: 'Từ chối',    objection: 'Đang cân nhắc nhiều nơi', askReal: true,  platform: 'zalo' },
      { id: 'c2c5', customer: 'Vũ Minh Tuấn',   isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản',         askReal: false, platform: 'facebook' },
    ],
  },

  // ─── cos-3: Đánh Giá Sale ───────────────────────────────────
  'cos-3': {
    columns: [
      { id: 'cos-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'cos-3-2', name: 'Lỗi mất khách do Sale',     field: 'mistake' },
    ],
    rows: [
      { id: 'c3c1', customer: 'Trần Thị Lan',    attitude: 'Tốt', mistake: 'Không có lỗi',                    platform: 'facebook' },
      { id: 'c3c2', customer: 'Nguyễn Đức Minh', attitude: 'Tốt', mistake: 'Không có lỗi',                    platform: 'zalo' },
      { id: 'c3c3', customer: 'Lê Hoàng Yến',   attitude: 'Trung bình', mistake: 'Không hỏi về tình trạng da', platform: 'facebook' },
      { id: 'c3c4', customer: 'Phạm Thu Hà',     attitude: 'Tốt', mistake: 'Không có lỗi',                    platform: 'zalo' },
      { id: 'c3c5', customer: 'Vũ Minh Tuấn',    attitude: 'Kém', mistake: 'Không giải đáp lo ngại về hàng fake', platform: 'facebook' },
    ],
  },

  // ─── cos-4: Phân Tích Chân Dung KH ──────────────────────────
  'cos-4': {
    columns: [
      { id: 'cos-4-1', name: 'Giới tính',        field: 'gender' },
      { id: 'cos-4-2', name: 'Loại da / Vấn đề da', field: 'skinType' },
      { id: 'cos-4-3', name: 'Khu vực địa lý',   field: 'location' },
      { id: 'cos-4-4', name: 'Khoảng ngân sách', field: 'budget' },
    ],
    rows: [
      { id: 'c4c1', customer: 'Trần Thị Lan',    gender: 'Nữ', location: 'TP. Hồ Chí Minh', budget: '500k - 1 triệu',    platform: 'facebook' },
      { id: 'c4c2', customer: 'Nguyễn Đức Minh', gender: 'Nam', location: 'Hà Nội',           budget: 'Dưới 500k',         platform: 'zalo' },
      { id: 'c4c3', customer: 'Lê Hoàng Yến',    gender: 'Nữ', location: 'Đà Nẵng',           budget: '1 - 2 triệu',       platform: 'facebook' },
      { id: 'c4c4', customer: 'Phạm Thu Hà',     gender: 'Nữ', location: 'TP. Hồ Chí Minh', budget: 'Không đề cập',     platform: 'zalo' },
      { id: 'c4c5', customer: 'Vũ Minh Tuấn',    gender: 'Nam', location: 'Hà Nội',           budget: 'Dưới 500k',         platform: 'facebook' },
    ],
  },

  // ─── cos-5: Phân Tích Đối Thủ ──────────────────────────────
  'cos-5': {
    columns: [
      { id: 'cos-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'cos-5-2', name: 'Tên đối thủ',            field: 'competitorName' },
      { id: 'cos-5-3', name: 'Tiêu chí so sánh',       field: 'criteria' },
    ],
    rows: [
      { id: 'c5c1', customer: 'Trần Thị Lan',    hasCompetitor: true,  competitorName: 'Some By Mi',    criteria: 'Hàng real',      platform: 'facebook' },
      { id: 'c5c2', customer: 'Nguyễn Đức Minh', hasCompetitor: false, competitorName: 'Không có',       criteria: 'Không có',        platform: 'zalo' },
      { id: 'c5c3', customer: 'Lê Hoàng Yến',   hasCompetitor: true,  competitorName: 'La Roche-Posay', criteria: 'Thành phần',     platform: 'facebook' },
      { id: 'c5c4', customer: 'Phạm Thu Hà',     hasCompetitor: true,  competitorName: 'Dr. G',           criteria: 'Giá cả',         platform: 'zalo' },
      { id: 'c5c5', customer: 'Vũ Minh Tuấn',   hasCompetitor: false, competitorName: 'Không có',       criteria: 'Không có',        platform: 'facebook' },
    ],
  },

  // ─── cos-6: Phân Tích Sau Mua ──────────────────────────────
  'cos-6': {
    columns: [
      { id: 'cos-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'cos-6-2', name: 'Mức độ bức xúc',             field: 'isNegative' },
    ],
    rows: [
      { id: 'c6c1', customer: 'Trần Thị Lan',    messageType: 'Khiếu nại dị ứng',    isNegative: true,  platform: 'facebook' },
      { id: 'c6c2', customer: 'Nguyễn Đức Minh', messageType: 'Hỏi giao hàng',     isNegative: false, platform: 'zalo' },
      { id: 'c6c3', customer: 'Lê Hoàng Yến',   messageType: 'Xin hướng dẫn sử dụng', isNegative: false, platform: 'facebook' },
      { id: 'c6c4', customer: 'Phạm Thu Hà',     messageType: 'Khiếu nại dị ứng',    isNegative: true,  platform: 'zalo' },
      { id: 'c6c5', customer: 'Vũ Minh Tuấn',   messageType: 'Khiếu nại khác',      isNegative: false, platform: 'facebook' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 4: SPA / THẨM MỸ
  // ═══════════════════════════════════════════════════════════════════

  // ─── spa-1: Phân Tích Nhu Cầu KH ─────────────────────────────
  'spa-1': {
    columns: [
      { id: 'spa-1-1', name: 'Dịch vụ / Liệu trình quan tâm', field: 'service' },
      { id: 'spa-1-2', name: 'Vấn đề cần giải quyết',          field: 'issue' },
      { id: 'spa-1-3', name: 'Mức độ quan tâm',                field: 'temperature' },
      { id: 'spa-1-4', name: 'Nhu cầu cốt lõi',               field: 'painPoint' },
    ],
    rows: [
      { id: 's1c1', customer: 'Trần Thị Hương', service: 'Triệt lông laser',    issue: 'Lông chân nhiều',    temperature: 'Nóng', painPoint: 'Cần làm gấp trước tiệc',      platform: 'facebook' },
      { id: 's1c2', customer: 'Nguyễn Đức Minh', service: 'Nâng mũi filler',    issue: 'Sống mũi thấp',       temperature: 'Ấm', painPoint: 'Muốn không đau',               platform: 'zalo' },
      { id: 's1c3', customer: 'Lê Hoàng Yến',   service: 'Facial deep clean',   issue: 'Da nhiều mụn ẩn',     temperature: 'Nóng', painPoint: 'Da mụn ẩn lâu năm không hết', platform: 'facebook' },
      { id: 's1c4', customer: 'Phạm Thu Hà',     service: 'Massage body',       issue: 'Đau lưng mỏi vai',    temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',       platform: 'zalo' },
      { id: 's1c5', customer: 'Vũ Minh Tuấn',   service: 'Trị nám laser',      issue: 'Nám sau sinh',         temperature: 'Ấm', painPoint: 'Muốn điều trị dứt điểm',       platform: 'facebook' },
    ],
  },

  // ─── spa-2: Đánh Giá Chất Lượng Lead ──────────────────────────
  'spa-2': {
    columns: [
      { id: 'spa-2-1', name: 'Khách hàng rác',        field: 'isJunk' },
      { id: 'spa-2-2', name: 'Trạng thái thu thập SĐT', field: 'phoneStatus' },
      { id: 'spa-2-3', name: 'Ý định đặt lịch',     field: 'bookingIntent' },
      { id: 'spa-2-4', name: 'Rào cản chốt đơn',    field: 'objection' },
    ],
    rows: [
      { id: 's2c1', customer: 'Trần Thị Hương', isJunk: false, phoneStatus: 'Đã cho SĐT', bookingIntent: 'Đã đặt',      objection: 'Không có rào cản',       platform: 'facebook' },
      { id: 's2c2', customer: 'Nguyễn Đức Minh', isJunk: false, phoneStatus: 'Đã cho SĐT', bookingIntent: 'Có ý định',  objection: 'Sợ đau / không an toàn', platform: 'zalo' },
      { id: 's2c3', customer: 'Lê Hoàng Yến',   isJunk: true,  phoneStatus: 'Chưa cho',   bookingIntent: 'Thăm dò',   objection: 'Khách hàng rác',        platform: 'facebook' },
      { id: 's2c4', customer: 'Phạm Thu Hà',     isJunk: false, phoneStatus: 'Đã cho SĐT', bookingIntent: 'Thăm dò',   objection: 'Cần xem review trước',   platform: 'zalo' },
      { id: 's2c5', customer: 'Vũ Minh Tuấn',   isJunk: false, phoneStatus: 'Từ chối',   bookingIntent: 'Không rõ',   objection: 'Giá đắt',               platform: 'facebook' },
    ],
  },

  // ─── spa-3: Đánh Giá Sale ──────────────────────────────────────
  'spa-3': {
    columns: [
      { id: 'spa-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'spa-3-2', name: 'Lỗi mất khách do Sale',    field: 'mistake' },
    ],
    rows: [
      { id: 's3c1', customer: 'Trần Thị Hương', attitude: 'Tốt', mistake: 'Không có lỗi',                    platform: 'facebook' },
      { id: 's3c2', customer: 'Nguyễn Đức Minh', attitude: 'Trung bình', mistake: 'Không trả lời kịp thời',   platform: 'zalo' },
      { id: 's3c3', customer: 'Lê Hoàng Yến',   attitude: 'Tốt', mistake: 'Không có lỗi',                    platform: 'facebook' },
      { id: 's3c4', customer: 'Phạm Thu Hà',     attitude: 'Kém', mistake: 'Gây hoang mang về độ an toàn',  platform: 'zalo' },
      { id: 's3c5', customer: 'Vũ Minh Tuấn',   attitude: 'Tốt', mistake: 'Không có lỗi',                    platform: 'facebook' },
    ],
  },

  // ─── spa-4: Phân Tích Chân Dung KH ─────────────────────────────
  'spa-4': {
    columns: [
      { id: 'spa-4-1', name: 'Giới tính',           field: 'gender' },
      { id: 'spa-4-2', name: 'Độ tuổi dự đoán',   field: 'age' },
      { id: 'spa-4-3', name: 'Khu vực địa lý',   field: 'location' },
      { id: 'spa-4-4', name: 'Khoảng ngân sách',  field: 'budget' },
    ],
    rows: [
      { id: 's4c1', customer: 'Trần Thị Hương', gender: 'Nữ', age: 'Trung niên', location: 'TP. Hồ Chí Minh', budget: '2-3 triệu/lần',  platform: 'facebook' },
      { id: 's4c2', customer: 'Nguyễn Đức Minh', gender: 'Nam', age: 'Trẻ',         location: 'Hà Nội',           budget: 'Không đề cập',     platform: 'zalo' },
      { id: 's4c3', customer: 'Lê Hoàng Yến',   gender: 'Nữ', age: 'Trẻ',         location: 'Đà Nẵng',         budget: '500k - 1 triệu',  platform: 'facebook' },
      { id: 's4c4', customer: 'Phạm Thu Hà',     gender: 'Nữ', age: 'Trung niên',  location: 'TP. Hồ Chí Minh', budget: '3-5 triệu/lần',  platform: 'zalo' },
      { id: 's4c5', customer: 'Vũ Minh Tuấn',   gender: 'Nam', age: 'Trẻ',         location: 'Hà Nội',           budget: 'Không đề cập',     platform: 'facebook' },
    ],
  },

  // ─── spa-5: Phân Tích Đối Thủ ─────────────────────────────────
  'spa-5': {
    columns: [
      { id: 'spa-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'spa-5-2', name: 'Tên đối thủ',            field: 'competitorName' },
      { id: 'spa-5-3', name: 'Tiêu chí so sánh',      field: 'criteria' },
    ],
    rows: [
      { id: 's5c1', customer: 'Trần Thị Hương', hasCompetitor: true,  competitorName: 'Clinic A',        criteria: 'Giá cả',           platform: 'facebook' },
      { id: 's5c2', customer: 'Nguyễn Đức Minh', hasCompetitor: false, competitorName: 'Không có',        criteria: 'Không có',         platform: 'zalo' },
      { id: 's5c3', customer: 'Lê Hoàng Yến',   hasCompetitor: true,  competitorName: 'Spa B',          criteria: 'Bác sĩ có tay nghề', platform: 'facebook' },
      { id: 's5c4', customer: 'Phạm Thu Hà',     hasCompetitor: false, competitorName: 'Không có',        criteria: 'Không có',         platform: 'zalo' },
      { id: 's5c5', customer: 'Vũ Minh Tuấn',   hasCompetitor: true,  competitorName: 'Clinic C',        criteria: 'Review thực tế',  platform: 'facebook' },
    ],
  },

  // ─── spa-6: Phân Tích Sau Dịch Vụ ──────────────────────────────
  'spa-6': {
    columns: [
      { id: 'spa-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'spa-6-2', name: 'Mức độ bức xúc',             field: 'isNegative' },
    ],
    rows: [
      { id: 's6c1', customer: 'Trần Thị Hương', messageType: 'Hẹn lịch buổi tiếp',  isNegative: false, platform: 'facebook' },
      { id: 's6c2', customer: 'Nguyễn Đức Minh', messageType: 'Báo phản ứng bất lợi', isNegative: true,  platform: 'zalo' },
      { id: 's6c3', customer: 'Lê Hoàng Yến',   messageType: 'Hỏi chăm sóc sau',    isNegative: false, platform: 'facebook' },
      { id: 's6c4', customer: 'Phạm Thu Hà',     messageType: 'Khiếu nại',           isNegative: true,  platform: 'zalo' },
      { id: 's6c5', customer: 'Vũ Minh Tuấn',   messageType: 'Hẹn lịch buổi tiếp',  isNegative: false, platform: 'facebook' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 5: BẤT ĐỘNG SẢN
  // ═══════════════════════════════════════════════════════════════════

  // ─── rls-1: Phân Tích Nhu Cầu KH ─────────────────────────────
  'rls-1': {
    columns: [
      { id: 'rls-1-1', name: 'Loại BĐS quan tâm',           field: 'propertyType' },
      { id: 'rls-1-2', name: 'Khu vực / Vị trí quan tâm', field: 'location' },
      { id: 'rls-1-3', name: 'Mức độ quan tâm',             field: 'temperature' },
      { id: 'rls-1-4', name: 'Nhu cầu cốt lõi',            field: 'painPoint' },
    ],
    rows: [
      { id: 'r1c1', customer: 'Trần Văn Phong', propertyType: 'Chung cư',    location: 'Quận 7',      temperature: 'Nóng', painPoint: 'Cần mua gấp trước Tết',       platform: 'facebook' },
      { id: 'r1c2', customer: 'Nguyễn Thị Lan', propertyType: 'Nhà phố',    location: 'Thủ Đức',     temperature: 'Ấm', painPoint: 'Tìm đầu tư dưới 2 tỷ',       platform: 'zalo' },
      { id: 'r1c3', customer: 'Lê Đức Anh',     propertyType: 'Đất nền',      location: 'Bình Dương',  temperature: 'Nóng', painPoint: 'Muốn mua nhà cho con đi làm', platform: 'facebook' },
      { id: 'r1c4', customer: 'Phạm Minh Hoàng', propertyType: 'Biệt thự',  location: 'Quận 9',      temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',       platform: 'zalo' },
      { id: 'r1c5', customer: 'Vũ Hoàng Nam',  propertyType: 'Căn hộ studio', location: 'Quận 2',      temperature: 'Ấm', painPoint: 'Đầu tư cho thuê',              platform: 'facebook' },
    ],
  },

  // ─── rls-2: Đánh Giá Chất Lượng Lead ──────────────────────────
  'rls-2': {
    columns: [
      { id: 'rls-2-1', name: 'Khách hàng rác (Cò mồi)',  field: 'isJunk' },
      { id: 'rls-2-2', name: 'Trạng thái thu thập SĐT',  field: 'phoneStatus' },
      { id: 'rls-2-3', name: 'Ngân sách xác nhận',         field: 'budgetConfirmed' },
      { id: 'rls-2-4', name: 'Ý định đi thăm',            field: 'siteVisitIntent' },
      { id: 'rls-2-5', name: 'Rào cản chốt đơn',         field: 'objection' },
    ],
    rows: [
      { id: 'r2c1', customer: 'Trần Văn Phong', isJunk: false, phoneStatus: 'Đã cho SĐT', budgetConfirmed: 'Đã xác nhận ngân sách', siteVisitIntent: 'Đã hẹn đi thăm', objection: 'Không có rào cản',       platform: 'facebook' },
      { id: 'r2c2', customer: 'Nguyễn Thị Lan', isJunk: false, phoneStatus: 'Đã cho SĐT', budgetConfirmed: 'Ngân sách chung chung', siteVisitIntent: 'Có ý định',        objection: 'Pháp lý chưa rõ ràng',  platform: 'zalo' },
      { id: 'r2c3', customer: 'Lê Đức Anh',     isJunk: true,  phoneStatus: 'Chưa cho',   budgetConfirmed: 'Không có nhu cầu mua', siteVisitIntent: 'Không rõ',         objection: 'Khách hàng rác',       platform: 'facebook' },
      { id: 'r2c4', customer: 'Phạm Minh Hoàng', isJunk: false, phoneStatus: 'Từ chối',   budgetConfirmed: 'Chưa đề cập',          siteVisitIntent: 'Thăm dò',           objection: 'Cần hỏi vợ',            platform: 'zalo' },
      { id: 'r2c5', customer: 'Vũ Hoàng Nam',  isJunk: false, phoneStatus: 'Đã cho SĐT', budgetConfirmed: 'Đã xác nhận ngân sách', siteVisitIntent: 'Có ý định',        objection: 'Đang so sánh nhiều dự án', platform: 'facebook' },
    ],
  },

  // ─── rls-3: Đánh Giá Sale ────────────────────────────────────
  'rls-3': {
    columns: [
      { id: 'rls-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'rls-3-2', name: 'Lỗi mất khách do Sale',    field: 'mistake' },
    ],
    rows: [
      { id: 'r3c1', customer: 'Trần Văn Phong', attitude: 'Tốt', mistake: 'Không có lỗi',               platform: 'facebook' },
      { id: 'r3c2', customer: 'Nguyễn Thị Lan', attitude: 'Tốt', mistake: 'Không có lỗi',               platform: 'zalo' },
      { id: 'r3c3', customer: 'Lê Đức Anh',     attitude: 'Trung bình', mistake: 'Hẹn đi thăm rồi bỏ lỡ', platform: 'facebook' },
      { id: 'r3c4', customer: 'Phạm Minh Hoàng', attitude: 'Kém', mistake: 'Báo giá không chính xác',    platform: 'zalo' },
      { id: 'r3c5', customer: 'Vũ Hoàng Nam',  attitude: 'Tốt', mistake: 'Không có lỗi',               platform: 'facebook' },
    ],
  },

  // ─── rls-4: Phân Tích Chân Dung KH ─────────────────────────────
  'rls-4': {
    columns: [
      { id: 'rls-4-1', name: 'Giới tính',              field: 'gender' },
      { id: 'rls-4-2', name: 'Phân khúc khách hàng',    field: 'segment' },
      { id: 'rls-4-3', name: 'Khu vực ưu tiên',         field: 'location' },
      { id: 'rls-4-4', name: 'Khoảng ngân sách',       field: 'budget' },
    ],
    rows: [
      { id: 'r4c1', customer: 'Trần Văn Phong', gender: 'Nam', segment: 'Mua để ở',      location: 'Quận 7',          budget: '5-7 tỷ',   platform: 'facebook' },
      { id: 'r4c2', customer: 'Nguyễn Thị Lan', gender: 'Nữ', segment: 'Đầu tư tăng giá', location: 'Thủ Đức',         budget: '2-3 tỷ',   platform: 'zalo' },
      { id: 'r4c3', customer: 'Lê Đức Anh',     gender: 'Nam', segment: 'Đầu tư cho thuê', location: 'Bình Dương',      budget: '1.5-2 tỷ', platform: 'facebook' },
      { id: 'r4c4', customer: 'Phạm Minh Hoàng', gender: 'Nam', segment: 'Không rõ',        location: 'Quận 9',          budget: 'Không đề cập', platform: 'zalo' },
      { id: 'r4c5', customer: 'Vũ Hoàng Nam',  gender: 'Nam', segment: 'Mua để ở',       location: 'Quận 2',          budget: '3-5 tỷ',   platform: 'facebook' },
    ],
  },

  // ─── rls-5: Phân Tích Đối Thủ ─────────────────────────────────
  'rls-5': {
    columns: [
      { id: 'rls-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'rls-5-2', name: 'Tên đối thủ',            field: 'competitorName' },
      { id: 'rls-5-3', name: 'Tiêu chí so sánh',       field: 'criteria' },
    ],
    rows: [
      { id: 'r5c1', customer: 'Trần Văn Phong', hasCompetitor: true,  competitorName: 'Vinhomes',        criteria: 'Pháp lý',                platform: 'facebook' },
      { id: 'r5c2', customer: 'Nguyễn Thị Lan', hasCompetitor: false, competitorName: 'Không có',        criteria: 'Không có',              platform: 'zalo' },
      { id: 'r5c3', customer: 'Lê Đức Anh',     hasCompetitor: true,  competitorName: 'Rever',           criteria: 'Hỗ trợ vay ngân hàng',  platform: 'facebook' },
      { id: 'r5c4', customer: 'Phạm Minh Hoàng', hasCompetitor: true,  competitorName: 'Novaland',        criteria: 'Giá cả',                platform: 'zalo' },
      { id: 'r5c5', customer: 'Vũ Hoàng Nam',  hasCompetitor: false, competitorName: 'Không có',        criteria: 'Không có',              platform: 'facebook' },
    ],
  },

  // ─── rls-6: Phân Tích Hậu Mua ──────────────────────────────────
  'rls-6': {
    columns: [
      { id: 'rls-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'rls-6-2', name: 'Mức độ bức xúc',               field: 'isNegative' },
      { id: 'rls-6-3', name: 'Khách có giới thiệu được?',     field: 'canRefer' },
    ],
    rows: [
      { id: 'r6c1', customer: 'Trần Văn Phong', messageType: 'Hỏi tiến độ thanh toán', isNegative: false, canRefer: true,  platform: 'facebook' },
      { id: 'r6c2', customer: 'Nguyễn Thị Lan', messageType: 'Hỏi pháp lý - sổ',       isNegative: false, canRefer: false, platform: 'zalo' },
      { id: 'r6c3', customer: 'Lê Đức Anh',     messageType: 'Khiếu nại chất lượng',   isNegative: true,  canRefer: false, platform: 'facebook' },
      { id: 'r6c4', customer: 'Phạm Minh Hoàng', messageType: 'Hỏi tiến độ xây dựng',  isNegative: false, canRefer: true,  platform: 'zalo' },
      { id: 'r6c5', customer: 'Vũ Hoàng Nam',  messageType: 'Hỏi tiến độ thanh toán', isNegative: false, canRefer: true,  platform: 'facebook' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 6: F&B
  // ═══════════════════════════════════════════════════════════════════

  // ─── fb-1: Phân Tích Nhu Cầu KH ────────────────────────────────
  'fb-1': {
    columns: [
      { id: 'fb-1-1', name: 'Món ăn / Danh mục quan tâm', field: 'food' },
      { id: 'fb-1-2', name: 'Loại hình phục vụ',         field: 'serviceType' },
      { id: 'fb-1-3', name: 'Mức độ quan tâm',           field: 'temperature' },
      { id: 'fb-1-4', name: 'Nhu cầu cốt lõi',            field: 'painPoint' },
    ],
    rows: [
      { id: 'f1c1', customer: 'Trần Hoàng Nam',   food: 'Cơm tấm',        serviceType: 'Giao hàng',  temperature: 'Nóng', painPoint: 'Cần giao gấp trưa nay',       platform: 'facebook' },
      { id: 'f1c2', customer: 'Nguyễn Thị Mai',  food: 'Bún bò',         serviceType: 'Ăn tại quán', temperature: 'Ấm', painPoint: 'Tìm quán gần chỗ làm',         platform: 'zalo' },
      { id: 'f1c3', customer: 'Lê Đức Minh',     food: 'Bánh mì',        serviceType: 'Đặt bàn',    temperature: 'Nóng', painPoint: 'Đặt bàn cho 10 người tối nay', platform: 'facebook' },
      { id: 'f1c4', customer: 'Phạm Thu Hương',  food: 'Cà phê',         serviceType: 'Ăn tại quán', temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',       platform: 'zalo' },
      { id: 'f1c5', customer: 'Vũ Minh Tuấn',    food: 'Trà sữa',        serviceType: 'Giao hàng',  temperature: 'Ấm', painPoint: 'Giao cho cả nhà 5 người',    platform: 'facebook' },
    ],
  },

  // ─── fb-2: Đánh Giá Chất Lượng Lead ───────────────────────────
  'fb-2': {
    columns: [
      { id: 'fb-2-1', name: 'Khách hàng rác',        field: 'isJunk' },
      { id: 'fb-2-2', name: 'Trạng thái thu thập SĐT', field: 'phoneStatus' },
      { id: 'fb-2-3', name: 'Đã đặt bàn / đặt giao chưa', field: 'bookingStatus' },
      { id: 'fb-2-4', name: 'Rào cản chốt đơn',     field: 'objection' },
    ],
    rows: [
      { id: 'f2c1', customer: 'Trần Hoàng Nam',   isJunk: false, phoneStatus: 'Đã cho SĐT', bookingStatus: 'Đã đặt',       objection: 'Không có rào cản',             platform: 'facebook' },
      { id: 'f2c2', customer: 'Nguyễn Thị Mai',  isJunk: false, phoneStatus: 'Chưa cho',   bookingStatus: 'Có ý định',    objection: 'Quá xa',                       platform: 'zalo' },
      { id: 'f2c3', customer: 'Lê Đức Minh',     isJunk: true,  phoneStatus: 'Chưa cho',   bookingStatus: 'Thăm dò',     objection: 'Khách hàng rác',               platform: 'facebook' },
      { id: 'f2c4', customer: 'Phạm Thu Hương',  isJunk: false, phoneStatus: 'Đã cho SĐT', bookingStatus: 'Thăm dò',     objection: 'Giá đắt',                      platform: 'zalo' },
      { id: 'f2c5', customer: 'Vũ Minh Tuấn',    isJunk: false, phoneStatus: 'Đã cho SĐT', bookingStatus: 'Có ý định',    objection: 'Phí giao hàng cao',           platform: 'facebook' },
    ],
  },

  // ─── fb-3: Đánh Giá Sale ──────────────────────────────────────
  'fb-3': {
    columns: [
      { id: 'fb-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'fb-3-2', name: 'Lỗi mất khách do Sale',    field: 'mistake' },
    ],
    rows: [
      { id: 'f3c1', customer: 'Trần Hoàng Nam',   attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'facebook' },
      { id: 'f3c2', customer: 'Nguyễn Thị Mai',  attitude: 'Trung bình', mistake: 'Không hỗ trợ đặt bàn nhanh', platform: 'zalo' },
      { id: 'f3c3', customer: 'Lê Đức Minh',     attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'facebook' },
      { id: 'f3c4', customer: 'Phạm Thu Hương',  attitude: 'Kém', mistake: 'Trả lời chậm 30 phút+',           platform: 'zalo' },
      { id: 'f3c5', customer: 'Vũ Minh Tuấn',    attitude: 'Tốt', mistake: 'Không có lỗi',                     platform: 'facebook' },
    ],
  },

  // ─── fb-4: Phân Tích Chân Dung KH ─────────────────────────────
  'fb-4': {
    columns: [
      { id: 'fb-4-1', name: 'Giới tính',        field: 'gender' },
      { id: 'fb-4-2', name: 'Nhóm đối tượng',   field: 'group' },
      { id: 'fb-4-3', name: 'Mục đích ăn uống', field: 'purpose' },
      { id: 'fb-4-4', name: 'Khoảng ngân sách', field: 'budget' },
    ],
    rows: [
      { id: 'f4c1', customer: 'Trần Hoàng Nam',   gender: 'Nam', group: 'Công sở',         purpose: 'Ăn thường ngày', budget: '100-200k',    platform: 'facebook' },
      { id: 'f4c2', customer: 'Nguyễn Thị Mai',  gender: 'Nữ',  group: 'Cặp đôi',          purpose: 'Hẹn hò',         budget: '300-500k',    platform: 'zalo' },
      { id: 'f4c3', customer: 'Lê Đức Minh',     gender: 'Nam', group: 'Nhóm bạn',          purpose: 'Liên hoan',       budget: '1-2 triệu',   platform: 'facebook' },
      { id: 'f4c4', customer: 'Phạm Thu Hương',  gender: 'Nữ',  group: 'Gia đình có con nhỏ', purpose: 'Sinh nhật',     budget: '500k-1 triệu', platform: 'zalo' },
      { id: 'f4c5', customer: 'Vũ Minh Tuấn',    gender: 'Nam', group: 'Công sở',         purpose: 'Ăn thường ngày', budget: '100-200k',    platform: 'facebook' },
    ],
  },

  // ─── fb-5: Phân Tích Đối Thủ ───────────────────────────────────
  'fb-5': {
    columns: [
      { id: 'fb-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'fb-5-2', name: 'Tên đối thủ',            field: 'competitorName' },
      { id: 'fb-5-3', name: 'Tiêu chí so sánh',       field: 'criteria' },
    ],
    rows: [
      { id: 'f5c1', customer: 'Trần Hoàng Nam',   hasCompetitor: true,  competitorName: 'KFC',            criteria: 'Giá cả',               platform: 'facebook' },
      { id: 'f5c2', customer: 'Nguyễn Thị Mai',  hasCompetitor: false, competitorName: 'Không có',        criteria: 'Không có',             platform: 'zalo' },
      { id: 'f5c3', customer: 'Lê Đức Minh',     hasCompetitor: true,  competitorName: 'GrabFood',         criteria: 'Tốc độ giao hàng',    platform: 'facebook' },
      { id: 'f5c4', customer: 'Phạm Thu Hương',  hasCompetitor: true,  competitorName: 'Lotteria',         criteria: 'Chất lượng món ăn',   platform: 'zalo' },
      { id: 'f5c5', customer: 'Vũ Minh Tuấn',    hasCompetitor: false, competitorName: 'Không có',        criteria: 'Không có',             platform: 'facebook' },
    ],
  },

  // ─── fb-6: Phân Tích Trải Nghiệm KH ────────────────────────────
  'fb-6': {
    columns: [
      { id: 'fb-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'fb-6-2', name: 'Mức độ bức xúc',               field: 'isNegative' },
      { id: 'fb-6-3', name: 'Khách có giới thiệu được?',     field: 'canRefer' },
    ],
    rows: [
      { id: 'f6c1', customer: 'Trần Hoàng Nam',   messageType: 'Phản hồi tích cực',      isNegative: false, canRefer: true,  platform: 'facebook' },
      { id: 'f6c2', customer: 'Nguyễn Thị Mai',  messageType: 'Khiếu nại giao hàng',    isNegative: true,  canRefer: false, platform: 'zalo' },
      { id: 'f6c3', customer: 'Lê Đức Minh',     messageType: 'Khiếu nại món ăn',       isNegative: true,  canRefer: false, platform: 'facebook' },
      { id: 'f6c4', customer: 'Phạm Thu Hương',  messageType: 'Hỏi về khuyến mãi',     isNegative: false, canRefer: true,  platform: 'zalo' },
      { id: 'f6c5', customer: 'Vũ Minh Tuấn',    messageType: 'Phản hồi tích cực',      isNegative: false, canRefer: true,  platform: 'facebook' },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 7: DU LỊCH
  // ═══════════════════════════════════════════════════════════════════

  // ─── trv-1: Phân Tích Nhu Cầu KH ───────────────────────────────
  'trv-1': {
    columns: [
      { id: 'trv-1-1', name: 'Điểm đến quan tâm',    field: 'destination' },
      { id: 'trv-1-2', name: 'Loại hình du lịch',   field: 'travelType' },
      { id: 'trv-1-3', name: 'Mức độ quan tâm',    field: 'temperature' },
      { id: 'trv-1-4', name: 'Nhu cầu cốt lõi',    field: 'painPoint' },
    ],
    rows: [
      { id: 't1c1', customer: 'Trần Ngọc Lan',   destination: 'Đà Nẵng',    travelType: 'Tour trọn gói',     temperature: 'Nóng', painPoint: 'Cần đi gấp cuối tuần này',    platform: 'facebook' },
      { id: 't1c2', customer: 'Nguyễn Hoàng Minh', destination: 'Phú Quốc', travelType: 'Du lịch nghỉ dưỡng', temperature: 'Ấm', painPoint: 'Tìm tour tiết kiệm dưới 5 triệu', platform: 'zalo' },
      { id: 't1c3', customer: 'Lê Thu Hương',    destination: 'Hàn Quốc', travelType: 'Tour trọn gói',     temperature: 'Nóng', painPoint: 'Muốn đi Nhật mùa hoa anh đào', platform: 'facebook' },
      { id: 't1c4', customer: 'Phạm Đức Tùng',   destination: 'Nha Trang', travelType: 'Tự túc',           temperature: 'Lạnh', painPoint: 'Hỏi 1 câu rồi không rep',       platform: 'zalo' },
      { id: 't1c5', customer: 'Vũ Thị Lan',     destination: 'Đà Lạt',    travelType: 'Du lịch nghỉ dưỡng', temperature: 'Ấm', painPoint: 'Tìm resort cho gia đình 4 người', platform: 'facebook' },
    ],
  },

  // ─── trv-2: Đánh Giá Chất Lượng Lead ──────────────────────────
  'trv-2': {
    columns: [
      { id: 'trv-2-1', name: 'Khách hàng rác',         field: 'isJunk' },
      { id: 'trv-2-2', name: 'Trạng thái thu thập SĐT', field: 'phoneStatus' },
      { id: 'trv-2-3', name: 'Rào cản chốt đơn',      field: 'objection' },
      { id: 'trv-2-4', name: 'Nhu cầu đặt cọc',        field: 'depositIntent' },
    ],
    rows: [
      { id: 't2c1', customer: 'Trần Ngọc Lan',   isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Không có rào cản',                   depositIntent: 'Đã đặt cọc',  platform: 'facebook' },
      { id: 't2c2', customer: 'Nguyễn Hoàng Minh', isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'So sánh với OTA (Traveloka/Agoda)', depositIntent: 'Thăm dò',     platform: 'zalo' },
      { id: 't2c3', customer: 'Lê Thu Hương',    isJunk: true,  phoneStatus: 'Chưa cho',   objection: 'Khách hàng rác',                   depositIntent: 'Không rõ',    platform: 'facebook' },
      { id: 't2c4', customer: 'Phạm Đức Tùng',   isJunk: false, phoneStatus: 'Từ chối',   objection: 'Giá đắt',                          depositIntent: 'Thăm dò',     platform: 'zalo' },
      { id: 't2c5', customer: 'Vũ Thị Lan',     isJunk: false, phoneStatus: 'Đã cho SĐT', objection: 'Phí phụ thu / visa',                depositIntent: 'Hỏi đặt cọc', platform: 'facebook' },
    ],
  },

  // ─── trv-3: Đánh Giá Sale ──────────────────────────────────────
  'trv-3': {
    columns: [
      { id: 'trv-3-1', name: 'Đánh giá Thái độ tư vấn', field: 'attitude' },
      { id: 'trv-3-2', name: 'Lỗi mất khách do Sale',    field: 'mistake' },
    ],
    rows: [
      { id: 't3c1', customer: 'Trần Ngọc Lan',   attitude: 'Tốt', mistake: 'Không có lỗi',               platform: 'facebook' },
      { id: 't3c2', customer: 'Nguyễn Hoàng Minh', attitude: 'Trung bình', mistake: 'Giá báo khác với thực tế', platform: 'zalo' },
      { id: 't3c3', customer: 'Lê Thu Hương',    attitude: 'Tốt', mistake: 'Không có lỗi',               platform: 'facebook' },
      { id: 't3c4', customer: 'Phạm Đức Tùng',   attitude: 'Kém', mistake: 'Bỏ quên khách 2 ngày',      platform: 'zalo' },
      { id: 't3c5', customer: 'Vũ Thị Lan',     attitude: 'Tốt', mistake: 'Không có lỗi',               platform: 'facebook' },
    ],
  },

  // ─── trv-4: Phân Tích Chân Dung KH ──────────────────────────────
  'trv-4': {
    columns: [
      { id: 'trv-4-1', name: 'Điểm đến yêu thích', field: 'favoriteDest' },
      { id: 'trv-4-2', name: 'Quốc gia / Vùng',    field: 'region' },
      { id: 'trv-4-3', name: 'Số người đi',          field: 'travelers' },
      { id: 'trv-4-4', name: 'Khoảng ngân sách',     field: 'budget' },
    ],
    rows: [
      { id: 't4c1', customer: 'Trần Ngọc Lan',   favoriteDest: 'Đà Nẵng',    region: 'Trong nước',     travelers: '2 người',        budget: '5-8 triệu',     platform: 'facebook' },
      { id: 't4c2', customer: 'Nguyễn Hoàng Minh', favoriteDest: 'Hàn Quốc',  region: 'Nước ngoài',     travelers: '4 người (cả gia đình)', budget: '30-50 triệu', platform: 'zalo' },
      { id: 't4c3', customer: 'Lê Thu Hương',    favoriteDest: 'Nhật Bản',   region: 'Nước ngoài',     travelers: '2 người lớn 1 trẻ em', budget: 'Không giới hạn', platform: 'facebook' },
      { id: 't4c4', customer: 'Phạm Đức Tùng',   favoriteDest: 'Nha Trang', region: 'Trong nước',     travelers: 'Không đề cập', budget: 'Không đề cập',  platform: 'zalo' },
      { id: 't4c5', customer: 'Vũ Thị Lan',     favoriteDest: 'Đà Lạt',      region: 'Trong nước',     travelers: '4 người',        budget: '10-15 triệu',   platform: 'facebook' },
    ],
  },

  // ─── trv-5: Phân Tích Đối Thủ ─────────────────────────────────
  'trv-5': {
    columns: [
      { id: 'trv-5-1', name: 'Có nhắc đến đối thủ?', field: 'hasCompetitor' },
      { id: 'trv-5-2', name: 'Tên đối thủ',            field: 'competitorName' },
      { id: 'trv-5-3', name: 'Tiêu chí so sánh',       field: 'criteria' },
    ],
    rows: [
      { id: 't5c1', customer: 'Trần Ngọc Lan',   hasCompetitor: true,  competitorName: 'Traveloka',  criteria: 'Giá cả',           platform: 'facebook' },
      { id: 't5c2', customer: 'Nguyễn Hoàng Minh', hasCompetitor: false, competitorName: 'Không có', criteria: 'Không có',         platform: 'zalo' },
      { id: 't5c3', customer: 'Lê Thu Hương',    hasCompetitor: true,  competitorName: 'Klook',       criteria: 'Lịch trình',      platform: 'facebook' },
      { id: 't5c4', customer: 'Phạm Đức Tùng',   hasCompetitor: true,  competitorName: 'Agoda',      criteria: 'Khách sạn',       platform: 'zalo' },
      { id: 't5c5', customer: 'Vũ Thị Lan',     hasCompetitor: false, competitorName: 'Không có', criteria: 'Không có',         platform: 'facebook' },
    ],
  },

  // ─── trv-6: Phân Tích Hậu Du Lịch ──────────────────────────────
  'trv-6': {
    columns: [
      { id: 'trv-6-1', name: 'Phân loại mục đích tin nhắn', field: 'messageType' },
      { id: 'trv-6-2', name: 'Mức độ bức xúc',               field: 'isNegative' },
      { id: 'trv-6-3', name: 'Khách có giới thiệu được?',     field: 'canRefer' },
    ],
    rows: [
      { id: 't6c1', customer: 'Trần Ngọc Lan',   messageType: 'Phản hồi tích cực',        isNegative: false, canRefer: true,  platform: 'facebook' },
      { id: 't6c2', customer: 'Nguyễn Hoàng Minh', messageType: 'Hỏi hoàn tiền / Xin bồi thường', isNegative: true, canRefer: false, platform: 'zalo' },
      { id: 't6c3', customer: 'Lê Thu Hương',    messageType: 'Khiếu nại dịch vụ',      isNegative: true,  canRefer: false, platform: 'facebook' },
      { id: 't6c4', customer: 'Phạm Đức Tùng',   messageType: 'Hỏi đặt tour mới',        isNegative: false, canRefer: true,  platform: 'zalo' },
      { id: 't6c5', customer: 'Vũ Thị Lan',     messageType: 'Phản hồi tích cực',       isNegative: false, canRefer: true,  platform: 'facebook' },
    ],
  },

};

export function getConversationsByTemplateId(templateId) {
  return mockConversations[templateId] || null;
}

// =====================================================================
// BỘ TEMPLATE AI INSIGHT — 10 ngành × 6 insight = 60 templates
// Nguồn: template-insight.md + My AURIS Bot Plus Asia (PDF 2026-03-31)
// Cập nhật: 2026-04-01
// =====================================================================

export const INDUSTRIES = [
  { id: 'fashion',    label: 'Thời trang',    icon: '👗' },
  { id: 'mebaby',     label: 'Mẹ và Bé',      icon: '🍼' },
  { id: 'cosmetics',  label: 'Mỹ phẩm',        icon: '💄' },
  { id: 'spa',        label: 'Spa / Thẩm mỹ',  icon: '💆' },
  { id: 'realestate', label: 'Bất động sản',  icon: '🏠' },
  { id: 'fnb',        label: 'F&B',             icon: '🍜' },
  { id: 'travel',     label: 'Du lịch',         icon: '✈️' },
  { id: 'nha_khoa',   label: 'Nha khoa',        icon: '🦷' },
  { id: 'tham_my',    label: 'Thẩm mỹ / Y khoa',icon: '💉' },
  { id: 'nha_hang',   label: 'Nhà hàng',        icon: '🍽️' },
];

export const mockTemplates = [

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 1: THỜI TRANG — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── Thời trang: Insight 1 — Nhu Cầu KH ────────────────────────
  {
    id: 'fsh-1',
    industry: 'fashion',
    name: 'Phân Tích Nhu Cầu Khách Thời Trang',
    description: 'Trích xuất sản phẩm, size, mức độ quan tâm và pain point — giúp Sale nắm bắt nhanh khách đang muốn gì.',
    icon: '🎯',
    columns: [
      {
        id: 'fsh-1-1', icon: '🏷️', name: 'Sản phẩm / Mẫu quan tâm',
        prompt: 'Trích xuất tên chính xác sản phẩm, mã sản phẩm, hoặc loại item khách đang hỏi. Nếu hỏi chung chung ("có gì mới không"), ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fsh-1-2', icon: '📏', name: 'Size quan tâm',
        prompt: 'Khách hàng có hỏi về size nào không? Trích xuất size được nhắc đến (VD: "M", "Size L", "Freesize", "38", "fit M"). Nếu không hỏi size, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fsh-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: chủ động hỏi giá, xin địa chỉ, để lại SĐT, hỏi "còn không", hỏi "mua ngay được không". Ấm: đang nhờ tư vấn về size/màu/chất liệu nhưng chưa chốt. Lạnh: chỉ "chấm", hỏi 1 câu rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'fsh-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Dựa vào nội dung chat, khách đang gặp vấn đề gì hoặc mong muốn điều gì lớn nhất? (VD: "Tìm đầm đi tiệc dưới 1 triệu", "Cần áo len dày cho mùa đông"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Thời trang: Insight 2 — Chất Lượng Lead ───────────────────
  {
    id: 'fsh-2',
    industry: 'fashion',
    name: 'Đánh Giá Chất Lượng Nguồn Lead Thời Trang',
    description: 'Đánh giá chất lượng lead từ Ads — junk lead, thu thập SĐT, objection và nguồn Ads — để quyết định bật/tắt chiến dịch.',
    icon: '📊',
    columns: [
      {
        id: 'fsh-2-1', icon: '🗑️', name: 'Khách hàng rác (Junk Lead)',
        prompt: 'Trả True nếu khách gửi tin nhắn tự động từ ads rồi không rep; chat nội dung không liên quan; bấm nhầm. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'fsh-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra khách đã cung cấp SĐT hợp lệ chưa. Đã cho SĐT nếu tìm thấy số. Khách từ chối nếu Sale xin nhưng khách bảo không tiện. Chưa cho nếu Sale chưa xin hoặc khách chưa gửi.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'fsh-2-3', icon: '🚧', name: 'Rào cản chốt đơn (Objection)',
        prompt: 'Xác định lý do chính khiến khách lưỡng lự. Chỉ xuất ra 1 trong: Chê giá đắt, Phí ship cao, Chưa tin tưởng chất lượng / hàng real, Hỏi cho biết, Cần hỏi ý kiến người thân, Không có size, Đang cân nhắc nhiều shop, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Phí ship cao',
          'Chưa tin tưởng chất lượng / hàng real', 'Hỏi cho biết',
          'Cần hỏi ý kiến người thân', 'Không có size',
          'Đang cân nhắc nhiều shop',
        ],
      },
      {
        id: 'fsh-2-4', icon: '📢', name: 'Nguồn Ads',
        prompt: 'Dựa vào nội dung hội thoại hoặc tag hệ thống, xác định khách đến từ nguồn quảng cáo nào: Facebook Ads / Zalo Ads / Tiktok Ads / Không rõ.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Facebook Ads', 'Zalo Ads', 'Tiktok Ads', 'Không rõ'],
      },
    ],
  },

  // ─── Thời trang: Insight 3 — Đánh Giá Sale ─────────────────────
  {
    id: 'fsh-3',
    industry: 'fashion',
    name: 'Đánh Giá Nhân Viên Tư Vấn Thời Trang',
    description: 'Đánh giá thái độ và chất lượng tư vấn của Sale — phát hiện lỗi mất khách do nhân viên.',
    icon: '⭐',
    columns: [
      {
        id: 'fsh-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: Lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị thích phong cách nào ạ?", "Dùng cho dịp nào ạ?"), hỗ trợ khách chọn size. Trung bình: trả lời đủ thông tin nhưng thụ động. Kém: trả lời cộc lốc, trả lời sai câu hỏi về size/màu/số lượng.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'fsh-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Nếu khách tỏ không hài lòng hoặc dừng chat, tìm xem Sale có mắc lỗi gì? Tóm tắt dưới 10 chữ (VD: "Không tư vấn size", "Bỏ quên khách", "Trả lời giá sai"). Nếu Sale làm tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Thời trang: Insight 4 — Chân Dung KH ──────────────────────
  {
    id: 'fsh-4',
    industry: 'fashion',
    name: 'Phân Tích Chân Dung Khách Hàng Thời Trang',
    description: 'Trích xuất dữ liệu nhân khẩu học — giới tính, vùng miền, ngân sách, phân loại khách — để Marketer target Ads chính xác.',
    icon: '👤',
    columns: [
      {
        id: 'fsh-4-1', icon: '⚧', name: 'Giới tính dự đoán',
        prompt: 'Dựa vào cách xưng hô (anh/chị/em/mình/tớ) hoặc tên hiển thị, dự đoán giới tính. Nếu không có dấu hiệu, ghi "Không rõ".',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nam', 'Nữ', 'Không rõ'],
      },
      {
        id: 'fsh-4-2', icon: '📍', name: 'Khu vực địa lý',
        prompt: 'Khách nhắc đến đang ở đâu hoặc muốn giao đến tỉnh/thành/phố/quận/huyện nào? Trích xuất địa danh đó. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fsh-4-3', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách có nhắc đến giới hạn số tiền có thể chi trả không? (VD: "dưới 300k", "tầm 500k - 1 triệu", "không giới hạn"). Trích xuất khoảng giá đó. Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fsh-4-4', icon: '🏷️', name: 'Phân loại khách hàng',
        prompt: 'Khách này thuộc loại nào? Khách quen nếu có dấu hiệu đã mua hoặc nhắc đến đơn cũ. Khách hoàn tiền nếu hỏi về trả hàng/hoàn tiền. Các trường hợp còn lại là Khách mới.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Khách mới', 'Khách quen', 'Khách hoàn tiền'],
      },
    ],
  },

  // ─── Thời trang: Insight 5 — Đối Thủ ───────────────────────────
  {
    id: 'fsh-5',
    industry: 'fashion',
    name: 'Phân Tích Đối Thủ Cạnh Tranh Thời Trang',
    description: 'Phát hiện khách đang so sánh với đối thủ — giúp Sale chuẩn bị phản biện và Marketer nắm bắt thông tin thị trường.',
    icon: '⚔️',
    columns: [
      {
        id: 'fsh-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Trả True nếu khách nhắc tên, gửi hình/link của thương hiệu, shop hoặc sản phẩm đối thủ để so sánh. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'fsh-5-2', icon: '🏢', name: 'Tên đối thủ / Thương hiệu khác',
        prompt: 'Nếu khách nhắc đến thương hiệu khác, trích xuất chính xác tên thương hiệu/shop đó. Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fsh-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Khách đang mang yếu tố nào ra so sánh với bên mình? Trích xuất: Giá cả / Chất lượng / Phong cách / Phí giao hàng / Uy tín thương hiệu / Hàng real vs hàng fake. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có', 'Giá cả', 'Chất lượng', 'Phong cách',
          'Phí giao hàng', 'Uy tín thương hiệu', 'Hàng real vs hàng fake',
        ],
      },
    ],
  },

  // ─── Thời trang: Insight 6 — Retargeting / Sau Mua ───────────────
  {
    id: 'fsh-6',
    industry: 'fashion',
    name: 'Phân Tích Nhu Cầu Mua Lại Thời Trang',
    description: 'Lọc nhanh khách cũ có nhu cầu mua lại hoặc giới thiệu bạn bè — phát hiện sớm khách không hài lòng.',
    icon: '🔔',
    columns: [
      {
        id: 'fsh-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Hỏi về đơn hàng: giục giao, hỏi mã vận đơn, hỏi tình trạng đơn. Xin đổi trả: yêu cầu đổi size/màu, hoàn tiền, bóc phốt. Hỏi sản phẩm mới: nhắc đến sản phẩm mới, hỏi collection mới. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Hỏi về đơn hàng', 'Xin đổi trả', 'Hỏi sản phẩm mới', 'Khác'],
      },
      {
        id: 'fsh-6-2', icon: '😀', name: 'Mức độ hài lòng',
        prompt: 'Dựa vào từ ngữ và emoji khách sử dụng, đánh giá mức độ hài lòng. Không hài lòng nếu có từ tiêu cực rõ ràng, dọa trả hàng, phàn nàn.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Hài lòng', 'Trung bình', 'Không hài lòng'],
      },
      {
        id: 'fsh-6-3', icon: '🤝', name: 'Khách có giới thiệu được không?',
        prompt: 'Khách có thể hiện ý định giới thiệu bạn bè, mua tặng, hoặc quay lại mua tiếp không? (VD: "Đẹp lắm, mình sẽ giới thiệu bạn mình", "Lần sau lại mua thêm"). Trả True nếu có tín hiệu mua lại hoặc giới thiệu.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 2: MẸ VÀ BÉ — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── Mẹ và Bé: Insight 1 — Nhu Cầu KH ──────────────────────────
  {
    id: 'mbb-1',
    industry: 'mebaby',
    name: 'Phân Tích Nhu Cầu Khách Mẹ và Bé',
    description: 'Nắm bắt nhanh mẹ đang tìm gì cho con — sản phẩm, độ tuổi bé, mức giá — giúp Sale tư vấn đúng trọng tâm.',
    icon: '🎯',
    columns: [
      {
        id: 'mbb-1-1', icon: '🍼', name: 'Sản phẩm / Danh mục quan tâm',
        prompt: 'Trích xuất tên sản phẩm hoặc danh mục mẹ đang hỏi (VD: "sữa công thức", "tã", "đồ ăn dặm", "bỉm"). Nếu hỏi chung chung, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'mbb-1-2', icon: '👶', name: 'Độ tuổi bé / Giai đoạn',
        prompt: 'Mẹ nhắc bé bao nhiêu tháng / tuổi chưa? Trích xuất độ tuổi được nhắc (VD: "con 5 tháng", "bé nhà 2 tuổi rưỡi", "sơ sinh"). Nếu không đề cập, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'mbb-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: hỏi giá, xin địa chỉ cửa hàng, hỏi "còn hàng không", để lại SĐT, hỏi "mua giao được không". Ấm: đang nhờ tư vấn thêm về tính năng, độ tuổi phù hợp. Lạnh: hỏi 1 câu rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'mbb-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Mẹ đang gặp vấn đề gì hoặc mong muốn điều gì? (VD: "Con bị táo bón cần sữa gì", "Tìm đồ cho bé 6 tháng ăn dặm", "Cần giao gấp vì hết hàng"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Mẹ và Bé: Insight 2 — Chất Lượng Lead ─────────────────────
  {
    id: 'mbb-2',
    industry: 'mebaby',
    name: 'Đánh Giá Chất Lượng Nguồn Lead Mẹ và Bé',
    description: 'Đánh giá chất lượng chiến dịch Ads — tỉ lệ lead thực sự mua sỉ / mua nhiều cho con.',
    icon: '📊',
    columns: [
      {
        id: 'mbb-2-1', icon: '🗑️', name: 'Khách hàng rác',
        prompt: 'Trả True nếu khách gửi tin nhắn tự động rồi không rep; chat nội dung không liên quan; bấm nhầm. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'mbb-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra mẹ đã cung cấp SĐT hợp lệ chưa. Đã cho SĐT / Chưa cho / Khách từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'mbb-2-3', icon: '🚧', name: 'Rào cản chốt đơn',
        prompt: 'Xác định lý do chính. Đặc biệt lưu ý "Lo ngại an toàn / chất lượng" — rất phổ biến trong ngành Mẹ và Bé. Các lựa chọn: Chê giá đắt, Phí ship cao, Lo ngại an toàn / chất lượng, Hỏi cho biết, Cần hỏi chồng, Cần hỏi người thân, Đang cân nhắc, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Phí ship cao',
          'Lo ngại an toàn / chất lượng', 'Hỏi cho biết',
          'Cần hỏi chồng', 'Cần hỏi người thân', 'Đang cân nhắc',
        ],
      },
      {
        id: 'mbb-2-4', icon: '📦', name: 'Quan tâm mua sỉ / Combo',
        prompt: 'Mẹ có nhắc đến việc mua nhiều sản phẩm cùng lúc, mua cho nhiều bé, hoặc hỏi giá sỉ / giá combo không? Trả True nếu có.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ─── Mẹ và Bé: Insight 3 — Đánh Giá Sale ───────────────────────
  {
    id: 'mbb-3',
    industry: 'mebaby',
    name: 'Đánh Giá Nhân Viên Tư Vấn Mẹ và Bé',
    description: 'Kiểm soát chất lượng phản hồi — đặc biệt quan trọng vì mẹ rất cẩn thận về an toàn sản phẩm.',
    icon: '⭐',
    columns: [
      {
        id: 'mbb-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Con bao nhiêu tháng rồi ạ?", "Mẹ quan tâm về vấn đề gì của bé ạ?"), giải đáp lo lắng về an toàn sản phẩm. Trung bình: trả lời đủ thông tin nhưng thụ động. Kém: trả lời cộc lốc, không giải quyết lo lắng an toàn.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'mbb-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Tóm tắt lỗi Sale gây mất khách dưới 10 chữ. (VD: "Không giải đáp lo ngại về an toàn", "Bỏ quên khách"). Nếu Sale tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Mẹ và Bé: Insight 4 — Chân Dung KH ─────────────────────────
  {
    id: 'mbb-4',
    industry: 'mebaby',
    name: 'Phân Tích Chân Dung Khách Mẹ và Bé',
    description: 'Vẽ chân dung khách hàng — độ tuổi con, vùng miền, ngân sách — để Marketer target Ads hiệu quả.',
    icon: '👤',
    columns: [
      {
        id: 'mbb-4-1', icon: '⚧', name: 'Giới tính phụ huynh',
        prompt: 'Dựa vào cách xưng hô và nội dung, xác định người nhắn là ai. Mẹ / Bố / Người thân / Không rõ.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Mẹ', 'Bố', 'Người thân', 'Không rõ'],
      },
      {
        id: 'mbb-4-2', icon: '👶', name: 'Độ tuổi bé',
        prompt: 'Trích xuất độ tuổi bé được nhắc đến. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'mbb-4-3', icon: '📍', name: 'Khu vực địa lý',
        prompt: 'Khách nhắc đến địa điểm giao hàng hoặc nơi ở không? Trích xuất tên tỉnh/thành/phố.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'mbb-4-4', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách có nhắc đến số tiền có thể chi trả cho con không? (VD: "dưới 500k cho đợt này", "tầm 1-2 triệu"). Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Mẹ và Bé: Insight 5 — Đối Thủ ───────────────────────────────
  {
    id: 'mbb-5',
    industry: 'mebaby',
    name: 'Phân Tích Đối Thủ Mẹ và Bé',
    description: 'Theo dõi thương hiệu sữa / tã / đồ dùng bé đối thủ được nhắc đến nhiều nhất.',
    icon: '⚔️',
    columns: [
      {
        id: 'mbb-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Mẹ có so sánh sản phẩm / thương hiệu khác không? Trả True nếu có.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'mbb-5-2', icon: '🏢', name: 'Tên đối thủ / Thương hiệu',
        prompt: 'Trích xuất tên thương hiệu được nhắc (VD: "Friso", "Bobby", "Pampers", "雀巢"). Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'mbb-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Mẹ đang so sánh yếu tố gì? Trích xuất: Giá cả / Chất lượng / An toàn / Giao hàng / Uy tín. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: ['Không có', 'Giá cả', 'Chất lượng', 'An toàn', 'Giao hàng', 'Uy tín'],
      },
    ],
  },

  // ─── Mẹ và Bé: Insight 6 — Sau Mua ───────────────────────────────
  {
    id: 'mbb-6',
    industry: 'mebaby',
    name: 'Phân Tích Chăm Sóc Sau Mua Mẹ và Bé',
    description: 'Xử lý nhanh khiếu nại về an toàn sản phẩm — ưu tiên cao nhất vì liên quan đến sức khỏe con.',
    icon: '🔔',
    columns: [
      {
        id: 'mbb-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Hỏi giao hàng: giục đơn, hỏi mã vận đơn. Xin hướng dẫn sử dụng: hỏi cách pha sữa, cách dùng tã. Khiếu nại lỗi-an toàn: báo sản phẩm có vấn đề, nghi ngờ hàng giả, hết date — ƯU TIÊN CAO NHẤT. Xin đổi trả: yêu cầu đổi size tã, đổi vị sữa. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Hỏi giao hàng', 'Xin hướng dẫn sử dụng', 'Khiếu nại lỗi-an toàn', 'Xin đổi trả', 'Khác'],
      },
      {
        id: 'mbb-6-2', icon: '😠', name: 'Mức độ bức xúc',
        prompt: 'Mẹ có thể hiện sự tức giận, thất vọng, dọa đăng review xấu, hoặc đe dọa bóc phốt không? Đặc biệt lưu ý các từ liên quan đến sức khỏe / an toàn con. Trả True nếu có tiêu cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 3: MỸ PHẨM — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── Mỹ phẩm: Insight 1 — Nhu Cầu KH ──────────────────────────
  {
    id: 'cos-1',
    industry: 'cosmetics',
    name: 'Phân Tích Nhu Cầu Khách Mỹ Phẩm',
    description: 'Nắm bắt nhanh khách đang tìm sản phẩm gì cho vấn đề da nào, mức giá bao nhiêu.',
    icon: '🎯',
    columns: [
      {
        id: 'cos-1-1', icon: '💄', name: 'Sản phẩm / Dịch vụ quan tâm',
        prompt: 'Trích xuất tên sản phẩm hoặc loại sản phẩm khách đang hỏi (VD: "serum trị mụn", "kem chống nắng", "toner"). Nếu hỏi chung, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'cos-1-2', icon: '🧴', name: 'Loại da / Vấn đề da',
        prompt: 'Khách có nhắc đến loại da hoặc vấn đề da của mình không? (VD: "da dầu nhờn", "da nhạy cảm", "mụn ẩn", "nám"). Trích xuất chính xác. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'cos-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: hỏi giá, hỏi "còn không", để lại SĐT, hỏi giao hôm nay được không. Ấm: đang tư vấn về thành phần, so sánh 2 sản phẩm, nhưng chưa chốt. Lạnh: hỏi 1 câu rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'cos-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Khách đang gặp vấn đề gì với làn da? (VD: "Trị mụn ẩn lâu năm", "Tìm kem dưỡng cho da nhạy cảm", "Cần serum giá bình dân"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Mỹ phẩm: Insight 2 — Chất Lượng Lead ──────────────────────
  {
    id: 'cos-2',
    industry: 'cosmetics',
    name: 'Đánh Giá Chất Lượng Nguồn Lead Mỹ Phẩm',
    description: 'Đánh giá chiến dịch Ads dựa trên chất lượng lead, tỉ lệ thu thập SĐT, và yêu cầu chứng minh hàng real.',
    icon: '📊',
    columns: [
      {
        id: 'cos-2-1', icon: '🗑️', name: 'Khách hàng rác',
        prompt: 'Trả True nếu khách gửi tin nhắn tự động từ ads rồi không rep; chat nội dung không liên quan (spam review, quảng cáo khác). Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'cos-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'cos-2-3', icon: '🚧', name: 'Rào cản chốt đơn',
        prompt: '"Lo ngại hàng fake" là objection đặc trưng ngành mỹ phẩm. Các lựa chọn: Chê giá đắt, Phí ship cao, Lo ngại hàng fake / không real, Hỏi cho biết, Đang cân nhắc nhiều nơi, Hỏi thêm về thành phần, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Phí ship cao',
          'Lo ngại hàng fake / không real', 'Hỏi cho biết',
          'Đang cân nhắc nhiều nơi', 'Hỏi thêm về thành phần',
        ],
      },
      {
        id: 'cos-2-4', icon: '🔍', name: 'Yêu cầu chứng minh real',
        prompt: 'Khách có yêu cầu xem hóa đơn nhập, date, hình ảnh chụp thực tế sản phẩm, hoặc hỏi "có real không"? Trả True nếu có.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ─── Mỹ phẩm: Insight 3 — Đánh Giá Sale ─────────────────────────
  {
    id: 'cos-3',
    industry: 'cosmetics',
    name: 'Đánh Giá Nhân Viên Tư Vấn Mỹ Phẩm',
    description: 'Kiểm soát chất lượng tư vấn về thành phần sản phẩm, vấn đề da và giải quyết lo ngại hàng fake.',
    icon: '⭐',
    columns: [
      {
        id: 'cos-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Da anh/chị có hay bị kích ứng không ạ?", "Anh/chị quan tâm vấn đề gì nhất ạ?"), giải thích thành phần rõ ràng, khuyến khích dùng thử. Trung bình: trả lời đủ thông tin nhưng không hỏi về tình trạng da. Kém: trả lời sai về thành phần, không trả lời được câu hỏi về da nhạy cảm.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'cos-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Tóm tắt lỗi Sale dưới 10 chữ. (VD: "Không giải đáp lo ngại về hàng fake", "Bỏ quên khách sau 1 tiếng"). Nếu Sale tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Mỹ phẩm: Insight 4 — Chân Dung KH ──────────────────────────
  {
    id: 'cos-4',
    industry: 'cosmetics',
    name: 'Phân Tích Chân Dung Khách Mỹ Phẩm',
    description: 'Vẽ chân dung khách hàng — loại da, vùng miền, ngân sách, tuổi — để Marketer target đúng people.',
    icon: '👤',
    columns: [
      {
        id: 'cos-4-1', icon: '⚧', name: 'Giới tính',
        prompt: 'Dựa vào cách xưng hô hoặc tên hiển thị, dự đoán giới tính.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nam', 'Nữ', 'Không rõ'],
      },
      {
        id: 'cos-4-2', icon: '🧴', name: 'Loại da / Vấn đề da',
        prompt: 'Khách nhắc đến loại da hoặc vấn đề da của mình không? (VD: "da mình dầu lắm", "bị nám mặt"). Trích xuất. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'cos-4-3', icon: '📍', name: 'Khu vực địa lý',
        prompt: 'Khách nhắc đến địa điểm giao hàng hoặc nơi ở không? Trích xuất tên tỉnh/thành/phố.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'cos-4-4', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách có nhắc đến số tiền sẵn chi cho mỹ phẩm không? (VD: "tầm 500k - 1 triệu/tháng", "dưới 300k cho con serum này"). Trích xuất khoảng giá. Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Mỹ phẩm: Insight 5 — Đối Thủ ────────────────────────────────
  {
    id: 'cos-5',
    industry: 'cosmetics',
    name: 'Phân Tích Đối Thủ Mỹ Phẩm',
    description: 'Cảnh báo khi khách so sánh với các thương hiệu mỹ phẩm nổi tiếng (K-beauty, J-beauty, dược mỹ phẩm...).',
    icon: '⚔️',
    columns: [
      {
        id: 'cos-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Trả True nếu khách nhắc tên thương hiệu, sản phẩm đối thủ để so sánh. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'cos-5-2', icon: '🏢', name: 'Tên đối thủ / Thương hiệu',
        prompt: 'Trích xuất tên thương hiệu được nhắc (VD: "Some By Mi", "La Roche-Posay", "Dr. G", "Cocoon", "Klum"). Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'cos-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Khách so sánh yếu tố gì? Trích xuất: Giá cả / Thành phần / Hiệu quả / Hàng real / Phí ship / Uy tín. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: ['Không có', 'Giá cả', 'Thành phần', 'Hiệu quả', 'Hàng real', 'Phí ship', 'Uy tín'],
      },
    ],
  },

  // ─── Mỹ phẩm: Insight 6 — Sau Mua ────────────────────────────────
  {
    id: 'cos-6',
    industry: 'cosmetics',
    name: 'Phân Tích Chăm Sóc Sau Mua Mỹ Phẩm',
    description: 'Ưu tiên xử lý khiếu nại về phản ứng da, dị ứng — có thể gây khủng hoảng truyền thông nghiêm trọng.',
    icon: '🔔',
    columns: [
      {
        id: 'cos-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Khiếu nại dị ứng: báo bị nổi mẩn, ngứa, kích ứng sau khi dùng — ƯU TIÊN CAO NHẤT. Hỏi giao hàng: giục đơn, hỏi mã vận đơn. Xin hướng dẫn sử dụng: hỏi cách dùng serum, thứ tự apply. Khiếu nại khác: giao sai màu, hết date, thiếu sản phẩm. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Khiếu nại dị ứng', 'Hỏi giao hàng', 'Xin hướng dẫn sử dụng', 'Khiếu nại khác', 'Khác'],
      },
      {
        id: 'cos-6-2', icon: '😠', name: 'Mức độ bức xúc',
        prompt: 'Khách có thể hiện tức giận, dọa đăng review xấu, dọa bóc phốt, hoặc đe dọa kiện cáo không? Đặc biệt nghiêm trọng nếu liên quan đến sức khỏe da. Trả True nếu có tiêu cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 4: SPA / THẨM MỸ — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── Spa/Thẩm mỹ: Insight 1 — Nhu Cầu KH ─────────────────────
  {
    id: 'spa-1',
    industry: 'spa',
    name: 'Phân Tích Nhu Cầu Khách Spa / Thẩm Mỹ',
    description: 'Nắm bắt nhanh khách đang quan tâm dịch vụ nào, vấn đề gì, mức độ quan tâm ra sao.',
    icon: '🎯',
    columns: [
      {
        id: 'spa-1-1', icon: '💆', name: 'Dịch vụ / Liệu trình quan tâm',
        prompt: 'Trích xuất tên dịch vụ hoặc liệu trình khách đang hỏi (VD: "triệt lông", "nâng mũi", "facial", "massage body", "trị nám"). Nếu hỏi chung, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'spa-1-2', icon: '🩺', name: 'Vấn đề cần giải quyết',
        prompt: 'Khách đang gặp vấn đề gì muốn cải thiện? (VD: "mụn ẩn ở trán", "nám sau sinh", "da xuống tông", "muốn thon gọn"). Trích xuất. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'spa-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: hỏi giá chi tiết, hỏi lịch trống, để lại SĐT, hỏi "đặt được không", hỏi bác sĩ ai. Ấm: đang tư vấn về hiệu quả, thời gian, số buổi nhưng chưa hỏi về lịch. Lạnh: hỏi 1 câu rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'spa-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Khách đang mong đợi điều gì nhất? (VD: "Cần làm gấp trước tiệc", "Muốn không đau", "Tìm giá rẻ nhất"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Spa/Thẩm mỹ: Insight 2 — Chất Lượng Lead ────────────────
  {
    id: 'spa-2',
    industry: 'spa',
    name: 'Đánh Giá Chất Lượng Nguồn Lead Spa / Thẩm Mỹ',
    description: 'Đánh giá chất lượng lead — tỉ lệ khách thực sự đặt lịch hay chỉ hỏi giá.',
    icon: '📊',
    columns: [
      {
        id: 'spa-2-1', icon: '🗑️', name: 'Khách hàng rác',
        prompt: 'Trả True nếu khách gửi tin nhắn tự động từ ads rồi không rep; hỏi giá để so sánh với competitor rồi biến mất; chat nội dung không liên quan. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'spa-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'spa-2-3', icon: '📅', name: 'Ý định đặt lịch (Booking Intent)',
        prompt: 'Đã đặt: khách đã chốt được ngày giờ cụ thể. Có ý định: hỏi lịch trống, để lại SĐT để nhân viên gọi lại. Thăm dò: chỉ hỏi giá, hỏi dịch vụ nhưng chưa hỏi về lịch. Không rõ: không đủ thông tin.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã đặt', 'Có ý định', 'Thăm dò', 'Không rõ'],
      },
      {
        id: 'spa-2-4', icon: '🚧', name: 'Rào cản chốt đơn',
        prompt: '"Sợ đau / không an toàn" là objection đặc trưng ngành thẩm mỹ. Các lựa chọn: Chê giá đắt, Sợ đau / không an toàn, Cần xem review trước, Hỏi người thân, Đang cân nhắc nhiều nơi, Thời gian / lịch không phù hợp, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Sợ đau / không an toàn',
          'Cần xem review trước', 'Hỏi người thân',
          'Đang cân nhắc nhiều nơi', 'Thời gian / lịch không phù hợp',
        ],
      },
    ],
  },

  // ─── Spa/Thẩm mỹ: Insight 3 — Đánh Giá Sale ───────────────────
  {
    id: 'spa-3',
    industry: 'spa',
    name: 'Đánh Giá Nhân Viên Tư Vấn Spa / Thẩm Mỹ',
    description: 'Kiểm soát chất lượng tư vấn — đặc biệt về hiệu quả dịch vụ, thời gian, và giá cả.',
    icon: '⭐',
    columns: [
      {
        id: 'spa-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Chị muốn cải thiện vấn đề gì ạ?", "Chị đã làm dịch vụ nào trước đó chưa ạ?"), giải thích rõ về hiệu quả, số buổi, chăm sóc sau. Trung bình: trả lời đủ thông tin nhưng thụ động. Kém: trả lời cộc lốc, không trả lời được câu hỏi về hiệu quả / độ an toàn.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'spa-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Tóm tắt lỗi Sale dưới 10 chữ. (VD: "Không tư vấn đúng về số buổi", "Trả lời cộc lốc về giá", "Gây hoang mang về độ an toàn"). Nếu Sale tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Spa/Thẩm mỹ: Insight 4 — Chân Dung KH ──────────────────────
  {
    id: 'spa-4',
    industry: 'spa',
    name: 'Phân Tích Chân Dung Khách Spa / Thẩm Mỹ',
    description: 'Hiểu khách — độ tuổi, vùng miền, ngân sách, mức độ thẩm mỹ — để Marketer target đúng.',
    icon: '👤',
    columns: [
      {
        id: 'spa-4-1', icon: '⚧', name: 'Giới tính',
        prompt: 'Dựa vào cách xưng hô hoặc tên hiển thị, dự đoán giới tính.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nam', 'Nữ', 'Không rõ'],
      },
      {
        id: 'spa-4-2', icon: '🎂', name: 'Độ tuổi dự đoán',
        prompt: 'Dựa vào nội dung chat, khách thuộc nhóm tuổi nào? (VD: nhắc "trẻ hóa", "nám tuổi trung niên" → trung niên; nhắc "trị mụn thanh thiên niên" → trẻ). Nếu không xác định, ghi "Không rõ".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'spa-4-3', icon: '📍', name: 'Khu vực địa lý',
        prompt: 'Khách nhắc đến địa điểm ở hoặc muốn đến spa/clinic nào? Trích xuất tên khu vực.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'spa-4-4', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách nhắc đến số tiền có thể chi cho dịch vụ này không? (VD: "tầm 2-3 triệu cho lần đầu", "không giới hạn nếu hiệu quả"). Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Spa/Thẩm mỹ: Insight 5 — Đối Thủ ───────────────────────────
  {
    id: 'spa-5',
    industry: 'spa',
    name: 'Phân Tích Đối Thủ Spa / Thẩm Mỹ',
    description: 'Theo dõi clinic / spa đối thủ được nhắc đến và lý do khách so sánh.',
    icon: '⚔️',
    columns: [
      {
        id: 'spa-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Trả True nếu khách nhắc đến clinic hoặc spa đối thủ để so sánh. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'spa-5-2', icon: '🏢', name: 'Tên đối thủ / Thương hiệu',
        prompt: 'Trích xuất tên clinic hoặc spa đối thủ được nhắc đến. Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'spa-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Khách so sánh yếu tố gì? Trích xuất: Giá cả / Bác sĩ có tay nghề / Công nghệ / Review thực tế / Uy tín thương hiệu / Vị trí. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: ['Không có', 'Giá cả', 'Bác sĩ có tay nghề', 'Công nghệ', 'Review thực tế', 'Uy tín thương hiệu', 'Vị trí'],
      },
    ],
  },

  // ─── Spa/Thẩm mỹ: Insight 6 — Sau Dịch Vụ ─────────────────────────
  {
    id: 'spa-6',
    industry: 'spa',
    name: 'Phân Tích Chăm Sóc Sau Dịch Vụ Spa / Thẩm Mỹ',
    description: 'Theo dõi phản hồi sau liệu trình — phát hiện sớm khách không hài lòng hoặc có phản ứng bất lợi.',
    icon: '🔔',
    columns: [
      {
        id: 'spa-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Báo phản ứng bất lợi: báo bị sưng, đỏ, bỏng sau dịch vụ — ƯU TIÊN CAO NHẤT. Hỏi chăm sóc sau: hỏi cách chăm sóc da/sau laser/sau tiêm. Khiếu nại: giao sai dịch vụ, không đúng giờ, không đúng bác sĩ. Hẹn lịch buổi tiếp: khách muốn tiếp tục liệu trình. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Báo phản ứng bất lợi', 'Hỏi chăm sóc sau', 'Khiếu nại', 'Hẹn lịch buổi tiếp', 'Khác'],
      },
      {
        id: 'spa-6-2', icon: '😠', name: 'Mức độ bức xúc',
        prompt: 'Khách có thể hiện tức giận rõ ràng, dọa đăng review xấu, hoặc yêu cầu hoàn tiền không? Đặc biệt nghiêm trọng nếu liên quan đến phản ứng bất lợi trên da. Trả True nếu có tiêu cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 5: BẤT ĐỘNG SẢN — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── BĐS: Insight 1 — Nhu Cầu KH ─────────────────────────────
  {
    id: 'rls-1',
    industry: 'realestate',
    name: 'Phân Tích Nhu Cầu Khách Bất Động Sản',
    description: 'Nắm bắt nhanh khách đang tìm loại BĐS nào, ở đâu, ngân sách bao nhiêu.',
    icon: '🎯',
    columns: [
      {
        id: 'rls-1-1', icon: '🏠', name: 'Loại BĐS quan tâm',
        prompt: 'Trích xuất loại bất động sản khách đang hỏi (VD: "chung cư", "nhà phố", "đất nền", "biệt thự", "shophouse", "căn hộ studio"). Nếu hỏi chung chung, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'rls-1-2', icon: '📍', name: 'Khu vực / Vị trí quan tâm',
        prompt: 'Khách nhắc đến quận/huyện, khu vực, hoặc dự án cụ thể nào? (VD: "Quận 7", "Thủ Đức", "Bình Dương", "dự án Vinhomes"). Trích xuất tên khu vực. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'rls-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: hỏi giá chi tiết, hỏi "có thể đi thăm không", để lại SĐT, hỏi về pháp lý / sổ, hỏi vay ngân hàng, hỏi "chốt được không". Ấm: đang tư vấn về vị trí, tiện ích, giá nhưng chưa hẹn đi thăm. Lạnh: hỏi 1-2 câu chung chung rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'rls-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Khách đang gặp vấn đề gì hoặc mong muốn điều gì? (VD: "Cần mua gấp trước Tết", "Tìm đất đầu tư dưới 2 tỷ", "Muốn mua nhà cho con đi làm"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── BĐS: Insight 2 — Chất Lượng Lead ─────────────────────────
  {
    id: 'rls-2',
    industry: 'realestate',
    name: 'Đánh Giá Chất Lượng Nguồn Lead Bất Động Sản',
    description: 'Đánh giá chiến dịch quảng cáo BĐS — tỉ lệ khách có tiền thật vs cò mồi / khách hỏi chơi.',
    icon: '📊',
    columns: [
      {
        id: 'rls-2-1', icon: '🗑️', name: 'Khách hàng rác (Cò mồi)',
        prompt: 'Trả True nếu khách nhắn tự động từ ads rồi không rep; hỏi giá chung chung để thu thập thông tin (cò mồi); nhắn cho nhiều sàn cùng lúc; không có ngân sách rõ ràng. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'rls-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'rls-2-3', icon: '💰', name: 'Ngân sách xác nhận',
        prompt: '"Pháp lý chưa rõ ràng" và "Ngân sách xác nhận" là hai objection đặc trưng nhất của ngành BĐS. Các lựa chọn: Đã xác nhận ngân sách / Ngân sách chung chung / Chưa đề cập / Không có nhu cầu mua.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã xác nhận ngân sách', 'Ngân sách chung chung', 'Chưa đề cập', 'Không có nhu cầu mua'],
      },
      {
        id: 'rls-2-4', icon: '📅', name: 'Ý định đi thăm (Site Visit)',
        prompt: 'Đã hẹn đi thăm: khách đã chốt được ngày cụ thể. Có ý định: hỏi lịch, để lại SĐT để gọi lại. Thăm dò: chỉ hỏi thông tin. Không rõ: không đủ thông tin.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã hẹn đi thăm', 'Có ý định', 'Thăm dò', 'Không rõ'],
      },
      {
        id: 'rls-2-5', icon: '🚧', name: 'Rào cản chốt đơn',
        prompt: 'Các lựa chọn: Chê giá đắt, Pháp lý chưa rõ ràng, Chưa đủ tiền trả trước, Vị trí không phù hợp, Cần hỏi vợ/chồng/người thân, Đang so sánh nhiều dự án, Lãi suất ngân hàng cao, Hỏi cho biết, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Pháp lý chưa rõ ràng',
          'Chưa đủ tiền trả trước', 'Vị trí không phù hợp',
          'Cần hỏi vợ/chồng/người thân', 'Đang so sánh nhiều dự án',
          'Lãi suất ngân hàng cao', 'Hỏi cho biết',
        ],
      },
    ],
  },

  // ─── BĐS: Insight 3 — Đánh Giá Sale ───────────────────────────
  {
    id: 'rls-3',
    industry: 'realestate',
    name: 'Đánh Giá Nhân Viên Tư Vấn Bất Động Sản',
    description: 'Kiểm soát chất lượng tư vấn — đặc biệt về pháp lý, tài chính, và tính chuyên nghiệp.',
    icon: '⭐',
    columns: [
      {
        id: 'rls-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị cần mua để ở hay đầu tư ạ?", "Ngân sách hiện tại là bao nhiêu ạ?"), giải thích rõ về pháp lý, hỗ trợ tính toán tài chính, không gây áp lực mua. Trung bình: trả lời đủ thông tin nhưng thụ động. Kém: trả lời cộc lốc, thông tin sai về pháp lý / giá.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'rls-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Tóm tắt lỗi Sale dưới 10 chữ. (VD: "Không gửi được thông tin pháp lý", "Hẹn đi thăm rồi bỏ lỡ", "Báo giá không chính xác"). Nếu Sale tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── BĐS: Insight 4 — Chân Dung KH ──────────────────────────────
  {
    id: 'rls-4',
    industry: 'realestate',
    name: 'Phân Tích Chân Dung Khách Bất Động Sản',
    description: 'Vẽ chân dung khách hàng — phân khúc (để ở / đầu tư / mua sỉ), ngân sách, vùng ưu tiên — để Marketer target đúng nhóm.',
    icon: '👤',
    columns: [
      {
        id: 'rls-4-1', icon: '⚧', name: 'Giới tính',
        prompt: 'Dựa vào cách xưng hô hoặc tên hiển thị, dự đoán giới tính.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nam', 'Nữ', 'Không rõ'],
      },
      {
        id: 'rls-4-2', icon: '🏷️', name: 'Phân khúc khách hàng',
        prompt: 'Mua để ở: nhắc "ở đây", "muốn chuyển nhà". Đầu tư cho thuê: nhắc "cho thuê", "lấy tiền cho thuê trả ngân hàng". Đầu tư tăng giá: nhắc "hy vọng giá lên", "đất nền tương lai". Mua sỉ: nhắc "mua nhiều", "đầu tư dàn".',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Mua để ở', 'Đầu tư cho thuê', 'Đầu tư tăng giá', 'Mua sỉ', 'Không rõ'],
      },
      {
        id: 'rls-4-3', icon: '📍', name: 'Khu vực ưu tiên',
        prompt: 'Khách nhắc đến khu vực/quận/tỉnh nào muốn mua? Trích xuất tên khu vực. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'rls-4-4', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách có nhắc đến số tiền có thể chi trả hoặc vay được không? (VD: "tổng 5 tỷ", "trả trước 2 tỷ vay 3 tỷ", "dưới 3 tỷ"). Trích xuất. Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── BĐS: Insight 5 — Đối Thủ ──────────────────────────────────
  {
    id: 'rls-5',
    industry: 'realestate',
    name: 'Phân Tích Đối Thủ Bất Động Sản',
    description: 'Theo dõi khi khách so sánh với dự án, sàn BĐS khác hoặc chủ đầu tư khác.',
    icon: '⚔️',
    columns: [
      {
        id: 'rls-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Trả True nếu khách nhắc đến dự án BĐS khác, sàn BĐS khác (Rever, Propzy, Batdongsan.com.vn), hoặc chủ đầu tư khác để so sánh.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'rls-5-2', icon: '🏢', name: 'Tên đối thủ / Dự án khác',
        prompt: 'Trích xuất tên dự án, sàn, hoặc chủ đầu tư đối thủ được nhắc đến. (VD: "Vinhomes", "Novaland", "Rever", "dự án bên Akaraka"). Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'rls-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Khách đang so sánh yếu tố gì? Trích xuất: Giá cả / Vị trí / Pháp lý / Tiện ích / Chủ đầu tư / Hỗ trợ vay ngân hàng / Thanh toán linh hoạt. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có', 'Giá cả', 'Vị trí', 'Pháp lý', 'Tiện ích',
          'Chủ đầu tư', 'Hỗ trợ vay ngân hàng', 'Thanh toán linh hoạt',
        ],
      },
    ],
  },

  // ─── BĐS: Insight 6 — Sau Mua ────────────────────────────────────
  {
    id: 'rls-6',
    industry: 'realestate',
    name: 'Phân Tích Hậu Mua Bất Động Sản',
    description: 'Theo dõi tiến độ thanh toán, phát hiện khách không hài lòng về chất lượng xây dựng, và nguy cơ tranh chấp pháp lý.',
    icon: '🔔',
    columns: [
      {
        id: 'rls-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Hỏi tiến độ thanh toán: hỏi đợt đóng tiền tiếp theo, số tiền, ngày đóng. Hỏi tiến độ xây dựng: hỏi công trình đang xây đến đâu, bàn giao khi nào. Khiếu nại chất lượng: báo nhà xây có vấn đề (nứt, thấm dột) — ƯU TIÊU CAO. Hỏi pháp lý - sổ: hỏi khi nào được cấp sổ, thủ tục sang tên. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Hỏi tiến độ thanh toán', 'Hỏi tiến độ xây dựng', 'Khiếu nại chất lượng', 'Hỏi pháp lý - sổ', 'Khác'],
      },
      {
        id: 'rls-6-2', icon: '😠', name: 'Mức độ bức xúc',
        prompt: 'Khách có thể hiện tức giận rõ ràng, dọa kiện, dọa bóc phốt lên mạng xã hội, hoặc đe dọa không thanh toán tiếp không? Đặc biệt nghiêm trọng nếu liên quan đến pháp lý hoặc chất lượng xây dựng. Trả True nếu có tiêu cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'rls-6-3', icon: '🤝', name: 'Khách có giới thiệu được không?',
        prompt: 'Khách có thể hiện ý định giới thiệu bạn bè, người thân mua BĐS, hoặc quay lại mua thêm? (VD: "Mình sẽ giới thiệu bạn mình", "Lần sau có đất hay mình sẽ ủng hộ"). Trả True nếu có tín hiệu tích cực.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 6: F&B — CHUỖI NHÀ HÀNG ĂN UỐNG — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── F&B: Insight 1 — Nhu Cầu KH ──────────────────────────────
  {
    id: 'fb-1',
    industry: 'fnb',
    name: 'Phân Tích Nhu Cầu Khách F&B',
    description: 'Nắm bắt nhanh khách đang tìm món gì, muốn ăn tại quán hay giao về, mức giá bao nhiêu.',
    icon: '🎯',
    columns: [
      {
        id: 'fb-1-1', icon: '🍜', name: 'Món ăn / Danh mục quan tâm',
        prompt: 'Trích xuất tên món ăn hoặc danh mục món khách đang hỏi (VD: "cơm tấm", "bún bò", "bánh mì", "menu trưa công ty"). Nếu hỏi chung chung ("menu có gì"), ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fb-1-2', icon: '🏷️', name: 'Loại hình phục vụ',
        prompt: 'Khách muốn ăn tại quán, giao hàng, hay đặt bàn trước? Nếu không đề cập, ghi "Không rõ".',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Ăn tại quán', 'Giao hàng', 'Đặt bàn', 'Không rõ'],
      },
      {
        id: 'fb-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: hỏi giá, hỏi "còn món không", hỏi giờ mở cửa, để lại SĐT để đặt bàn / đặt giao, hỏi "giao được không". Ấm: đang tìm hiểu menu, hỏi thành phần, hỏi địa chỉ chi nhánh nhưng chưa đặt. Lạnh: hỏi 1 câu chung chung rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'fb-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Khách đang gặp vấn đề gì hoặc mong muốn điều gì? (VD: "Cần giao gấp trưa nay", "Tìm quán gần chỗ làm", "Muốn đặt bàn cho 10 người tối nay"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── F&B: Insight 2 — Chất Lượng Lead ─────────────────────────
  {
    id: 'fb-2',
    industry: 'fnb',
    name: 'Đánh Giá Chất Lượng Nguồn Lead F&B',
    description: 'Đánh giá chiến dịch quảng cáo F&B — tỉ lệ khách đặt bàn / đặt giao thực tế vs chỉ hỏi giá.',
    icon: '📊',
    columns: [
      {
        id: 'fb-2-1', icon: '🗑️', name: 'Khách hàng rác',
        prompt: 'Trả True nếu khách gửi tin nhắn tự động từ ads; nhắn để hỏi giá rồi đặt ở đối thủ; spam nội dung không liên quan. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'fb-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'fb-2-3', icon: '📅', name: 'Đã đặt bàn / đặt giao chưa',
        prompt: 'Khách đã chốt được đặt bàn / đặt giao chưa, hay chỉ đang hỏi thông tin? Các lựa chọn: Đã đặt / Có ý định / Thăm dò / Không rõ.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã đặt', 'Có ý định', 'Thăm dò', 'Không rõ'],
      },
      {
        id: 'fb-2-4', icon: '🚧', name: 'Rào cản chốt đơn',
        prompt: '"Quá xa / Không có chi nhánh gần" là objection đặc trưng của ngành F&B. Các lựa chọn: Chê giá đắt, Phí giao hàng cao, Quá xa / Không có chi nhánh gần, Không giao được / Hết món, Đang cân nhắc nhiều nơi, Hỏi cho biết, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Phí giao hàng cao',
          'Quá xa / Không có chi nhánh gần', 'Không giao được / Hết món',
          'Đang cân nhắc nhiều nơi', 'Hỏi cho biết',
        ],
      },
    ],
  },

  // ─── F&B: Insight 3 — Đánh Giá Sale ───────────────────────────
  {
    id: 'fb-3',
    industry: 'fnb',
    name: 'Đánh Giá Nhân Viên Tư Vấn F&B',
    description: 'Kiểm soát chất lượng phản hồi — đặc biệt về menu, khuyến mãi, và tốc độ phục vụ.',
    icon: '⭐',
    columns: [
      {
        id: 'fb-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị cần đặt cho mấy người ạ?", "Anh/chị có dị ứng thực phẩm gì không ạ?"), giới thiệu khuyến mãi phù hợp, hỗ trợ đặt bàn nhanh. Trung bình: trả lời đủ thông tin nhưng thụ động. Kém: trả lời cộc lốc, không trả lời được câu hỏi về thành phần / dị ứng.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'fb-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Tóm tắt lỗi Sale gây mất khách dưới 10 chữ. (VD: "Không hỗ trợ đặt bàn nhanh", "Không thông báo hết món kịp", "Trả lời chậm 30 phút+"). Nếu Sale tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── F&B: Insight 4 — Chân Dung KH ─────────────────────────────
  {
    id: 'fb-4',
    industry: 'fnb',
    name: 'Phân Tích Chân Dung Khách F&B',
    description: 'Hiểu khách — nhóm đối tượng, mục đích ăn uống, vùng giao, ngân sách — để Marketer target đúng nhóm.',
    icon: '👤',
    columns: [
      {
        id: 'fb-4-1', icon: '⚧', name: 'Giới tính',
        prompt: 'Dựa vào cách xưng hô hoặc tên hiển thị, dự đoán giới tính.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nam', 'Nữ', 'Không rõ'],
      },
      {
        id: 'fb-4-2', icon: '🏷️', name: 'Nhóm đối tượng',
        prompt: 'Công sở: nhắc "trưa công ty", "cơm trưa". Gia đình có con nhỏ: nhắc "con", "bé", "đi cả nhà". Nhóm bạn: nhắc "bạn", "bọn mình", "đi 5-6 người".',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Công sở / học sinh / sinh viên', 'Gia đình có con nhỏ', 'Cặp đôi', 'Nhóm bạn', 'Không rõ'],
      },
      {
        id: 'fb-4-3', icon: '🎂', name: 'Mục đích ăn uống',
        prompt: 'Dựa vào nội dung chat, khách ăn với mục đích gì? Các lựa chọn: Ăn thường ngày / Liên hoan / Sinh nhật / Hẹn hò / Liên hoan công ty / Không rõ.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Ăn thường ngày', 'Liên hoan', 'Sinh nhật', 'Hẹn hò', 'Liên hoan công ty', 'Không rõ'],
      },
      {
        id: 'fb-4-4', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách nhắc đến số tiền dự kiến chi cho bữa ăn không? (VD: "dưới 200k/người", "trọn gói 500k", "tiệc 2 triệu cho 10 người"). Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── F&B: Insight 5 — Đối Thủ ─────────────────────────────────
  {
    id: 'fb-5',
    industry: 'fnb',
    name: 'Phân Tích Đối Thủ F&B',
    description: 'Theo dõi khi khách so sánh với chuỗi F&B khác hoặc ứng dụng giao đồ ăn (GrabFood, ShopeeFood, Baemin...).',
    icon: '⚔️',
    columns: [
      {
        id: 'fb-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Trả True nếu khách nhắc đến chuỗi F&B khác, quán ăn khác, hoặc ứng dụng giao đồ ăn (GrabFood, ShopeeFood, Baemin, GoFood...) để so sánh.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'fb-5-2', icon: '🏢', name: 'Tên đối thủ',
        prompt: 'Trích xuất tên thương hiệu / quán ăn / app giao đồ ăn được nhắc. (VD: "KFC", "Lotteria", "Starbucks", "GrabFood"). Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'fb-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Khách đang so sánh yếu tố gì? Trích xuất: Giá cả / Chất lượng món ăn / Tốc độ giao hàng / Không gian quán / Đa dạng menu / App khuyến mãi nhiều hơn. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có', 'Giá cả', 'Chất lượng món ăn', 'Tốc độ giao hàng',
          'Không gian quán', 'Đa dạng menu', 'App khuyến mãi nhiều hơn',
        ],
      },
    ],
  },

  // ─── F&B: Insight 6 — Review & Feedback ───────────────────────
  {
    id: 'fb-6',
    industry: 'fnb',
    name: 'Phân Tích Trải Nghiệm Khách Hàng F&B',
    description: 'Phát hiện sớm khách không hài lòng về món ăn, phục vụ, hoặc giao hàng — nguy cơ review xấu cao trên Google, Foody, mạng xã hội.',
    icon: '🔔',
    columns: [
      {
        id: 'fb-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Phản hồi tích cực: khách khen món ngon, phục vụ tốt, muốn quay lại — ƯU TIÊU CAO để khen team. Khiếu nại món ăn: báo món không ngon, hỏng, không đúng như mô tả, thiếu topping — ƯU TIÊU CAO. Khiếu nại giao hàng: báo giao sai món, giao chậm, đóng gói kém — ƯU TIÊU CAO. Hỏi về khuyến mãi: khách hỏi về voucher, deal, tích điểm. Đặt bàn: khách muốn đặt bàn trước. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Phản hồi tích cực', 'Khiếu nại món ăn', 'Khiếu nại giao hàng', 'Hỏi về khuyến mãi', 'Đặt bàn', 'Khác'],
      },
      {
        id: 'fb-6-2', icon: '😠', name: 'Mức độ bức xúc',
        prompt: 'Khách có thể hiện tức giận rõ ràng, dọa đăng review xấu lên Google/Foody, dọa bóc phốt, hoặc yêu cầu hoàn tiền không? Đặc biệt nghiêm trọng nếu liên quan đến vệ sinh an toàn thực phẩm. Trả True nếu có tiêu cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'fb-6-3', icon: '🤝', name: 'Khách có giới thiệu được không?',
        prompt: 'Khách có thể hiện ý định quay lại, giới thiệu bạn bè, đăng story review tích cực không? (VD: "Món ngon quá, mình sẽ review cho bạn", "Lần sau lại đến"). Trả True nếu có tín hiệu tích cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════
  // NGÀNH 7: TƯ VẤN DU LỊCH — 6 Insight Templates
  // ═══════════════════════════════════════════════════════════════════

  // ─── Du lịch: Insight 1 — Nhu Cầu KH ──────────────────────────
  {
    id: 'trv-1',
    industry: 'travel',
    name: 'Phân Tích Nhu Cầu Khách Du Lịch',
    description: 'Nắm bắt nhanh khách đang muốn đi đâu, khi nào, với ai, mức giá bao nhiêu.',
    icon: '🎯',
    columns: [
      {
        id: 'trv-1-1', icon: '✈️', name: 'Điểm đến quan tâm',
        prompt: 'Trích xuất tên địa điểm / điểm đến khách đang hỏi (VD: "Đà Nẵng", "Phú Quốc", "Nha Trang", "Hàn Quốc", "tour Nhật Bản"). Nếu hỏi chung chung, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'trv-1-2', icon: '🏷️', name: 'Loại hình du lịch',
        prompt: 'Dựa vào nội dung chat, khách đang quan tâm loại hình du lịch nào? Các lựa chọn: Tour trọn gói / Tự túc / Du lịch mạo hiểm / Du lịch nghỉ dưỡng / Du lịch công tác / Không rõ.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tour trọn gói', 'Tự túc', 'Du lịch mạo hiểm', 'Du lịch nghỉ dưỡng', 'Du lịch công tác', 'Không rõ'],
      },
      {
        id: 'trv-1-3', icon: '🌡️', name: 'Mức độ quan tâm (Lead Temperature)',
        prompt: 'Nóng: hỏi giá chi tiết, hỏi lịch khởi hành cụ thể, để lại SĐT, hỏi "đặt cọc được không", hỏi "còn chỗ không". Ấm: đang tư vấn về điểm đến, khách sạn, lịch trình nhưng chưa hỏi về giá cụ thể hoặc đặt cọc. Lạnh: hỏi 1 câu rồi không rep, từ chối.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Nóng', 'Ấm', 'Lạnh'],
      },
      {
        id: 'trv-1-4', icon: '💬', name: 'Nhu cầu cốt lõi (Pain Point)',
        prompt: 'Khách đang quan tâm điều gì nhất? (VD: "Tìm tour tiết kiệm dưới 5 triệu", "Cần đi gấp cuối tuần này", "Muốn đi Nhật mùa hoa anh đào"). Tóm tắt dưới 12 chữ.',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Du lịch: Insight 2 — Chất Lượng Lead ─────────────────────
  {
    id: 'trv-2',
    industry: 'travel',
    name: 'Đánh Giá Chất Lượng Nguồn Lead Du Lịch',
    description: 'Đánh giá chiến dịch quảng cáo du lịch — tỉ lệ khách đặt cọc thực tế vs chỉ tham khảo giá.',
    icon: '📊',
    columns: [
      {
        id: 'trv-2-1', icon: '🗑️', name: 'Khách hàng rác',
        prompt: 'Trả True nếu khách gửi tin nhắn tự động từ ads; nhắn để so sánh giá rồi đặt ở nơi khác; chat nội dung không liên quan. Ngược lại, trả False.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'trv-2-2', icon: '📞', name: 'Trạng thái thu thập SĐT',
        prompt: 'Kiểm tra khách đã cung cấp SĐT hợp lệ chưa.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã cho SĐT', 'Chưa cho', 'Khách từ chối'],
      },
      {
        id: 'trv-2-3', icon: '🚧', name: 'Rào cản chốt đơn',
        prompt: '"So sánh với OTA" là objection đặc trưng ngành du lịch — khách thường so sánh giá với Traveloka, Agoda, Klook. Các lựa chọn: Chê giá đắt, Phí phụ thu / visa, Hỏi cho biết, So sánh với OTA (Traveloka/Agoda), Cần hỏi người đi cùng, Ngày chưa chốt, Không có rào cản.',
        type: 'enum', dataType: 'dropdown',
        dataOptions: [
          'Không có rào cản', 'Chê giá đắt', 'Phí phụ thu / visa',
          'Hỏi cho biết', 'So sánh với OTA (Traveloka/Agoda)',
          'Cần hỏi người đi cùng', 'Ngày chưa chốt',
        ],
      },
      {
        id: 'trv-2-4', icon: '💰', name: 'Nhu cầu đặt cọc',
        prompt: 'Khách đã đặt cọc chưa, hay chỉ hỏi thông tin? Các lựa chọn: Đã đặt cọc / Hỏi đặt cọc / Thăm dò / Không rõ.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Đã đặt cọc', 'Hỏi đặt cọc', 'Thăm dò', 'Không rõ'],
      },
    ],
  },

  // ─── Du lịch: Insight 3 — Đánh Giá Sale ───────────────────────
  {
    id: 'trv-3',
    industry: 'travel',
    name: 'Đánh Giá Nhân Viên Tư Vấn Du Lịch',
    description: 'Kiểm soát chất lượng tư vấn — đặc biệt về lịch trình, khách sạn, giá cả, visa.',
    icon: '⭐',
    columns: [
      {
        id: 'trv-3-1', icon: '👋', name: 'Đánh giá Thái độ tư vấn',
        prompt: 'Tốt: lịch sự, trả lời đúng trọng tâm, CÓ đặt câu hỏi mở ("Anh/chị dự định đi mấy người ạ?", "Có yêu cầu gì đặc biệt về khách sạn không ạ?"), gợi ý được điểm đến phù hợp, xử lý objection giá tốt. Trung bình: trả lời đủ thông tin nhưng thụ động. Kém: trả lời cộc lốc, thông tin sai về lịch trình / giá, không follow-up khách.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Tốt', 'Trung bình', 'Kém'],
      },
      {
        id: 'trv-3-2', icon: '⚠️', name: 'Lỗi mất khách do Sale',
        prompt: 'Tóm tắt lỗi Sale dưới 10 chữ. (VD: "Giá báo khác với thực tế", "Không gửi lịch trình chi tiết", "Bỏ quên khách 2 ngày"). Nếu Sale tốt, ghi "Không có lỗi".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Du lịch: Insight 4 — Chân Dung KH ─────────────────────────
  {
    id: 'trv-4',
    industry: 'travel',
    name: 'Phân Tích Chân Dung Khách Du Lịch',
    description: 'Hiểu khách — điểm đến yêu thích, ngân sách, mùa đi, nhóm đối tượng — để Marketer personalise Ads.',
    icon: '👤',
    columns: [
      {
        id: 'trv-4-1', icon: '⚧', name: 'Điểm đến yêu thích',
        prompt: 'Khách nhắc đến địa điểm họ thích hoặc đã từng đi chưa? Trích xuất tên địa điểm. Nếu không, ghi "Không xác định".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'trv-4-2', icon: '🌍', name: 'Quốc gia / Vùng lãnh thổ',
        prompt: 'Khách muốn đi trong nước hay nước ngoài? Trích xuất quốc gia/vùng lãnh thổ (VD: "Hàn Quốc", "Nhật Bản", "Đà Nẵng", "Phú Quốc"). Nếu hỏi chung, ghi "Trong nước" hoặc "Nước ngoài".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'trv-4-3', icon: '👥', name: 'Số người đi',
        prompt: 'Khách nhắc đến số lượng người đi chưa? (VD: "2 người lớn 1 trẻ em", "đi cùng gia đình 5 người", "solo"). Trích xuất. Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'trv-4-4', icon: '💰', name: 'Khoảng ngân sách',
        prompt: 'Khách nhắc đến số tiền dự định chi cho chuyến đi không? (VD: "dưới 10 triệu cho 2 người", "tour cao cấp không giới hạn"). Nếu không, ghi "Không đề cập".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
    ],
  },

  // ─── Du lịch: Insight 5 — Đối Thủ ───────────────────────────────
  {
    id: 'trv-5',
    industry: 'travel',
    name: 'Phân Tích Đối Thủ Du Lịch',
    description: 'Theo dõi khi khách so sánh với các OTA (Traveloka, Agoda, Klook, Vntrip...) hoặc công ty du lịch khác.',
    icon: '⚔️',
    columns: [
      {
        id: 'trv-5-1', icon: '🏴', name: 'Có nhắc đến đối thủ không?',
        prompt: 'Trả True nếu khách nhắc đến OTA (Traveloka, Agoda, Klook, Mytour...) hoặc công ty du lịch khác để so sánh.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'trv-5-2', icon: '🏢', name: 'Tên đối thủ',
        prompt: 'Trích xuất tên đối thủ được nhắc. Nếu không, ghi "Không có".',
        type: 'text', dataType: 'short_text', dataOptions: null,
      },
      {
        id: 'trv-5-3', icon: '📏', name: 'Tiêu chí so sánh',
        prompt: 'Khách so sánh yếu tố gì? Trích xuất: Giá cả / Lịch trình / Khách sạn / Visa / Hỗ trợ 24/7 / Uy tín. Nếu không so sánh, ghi "Không có".',
        type: 'enum', dataType: 'dropdown',
        dataOptions: ['Không có', 'Giá cả', 'Lịch trình', 'Khách sạn', 'Visa', 'Hỗ trợ 24/7', 'Uy tín'],
      },
    ],
  },

  // ─── Du lịch: Insight 6 — Sau Tour ──────────────────────────────
  {
    id: 'trv-6',
    industry: 'travel',
    name: 'Phân Tích Hậu Du Lịch / Khiếu Nại Sau Tour',
    description: 'Phát hiện sớm khách không hài lòng sau chuyến đi — nguy cơ review xấu cao.',
    icon: '🔔',
    columns: [
      {
        id: 'trv-6-1', icon: '🏷️', name: 'Phân loại mục đích tin nhắn',
        prompt: 'Khiếu nại dịch vụ: báo khách sạn không đúng như mô tả, xe hỏng, hướng dẫn viên kém — ƯU TIÊU CAO. Hỏi hoàn tiền / Xin bồi thường: khách yêu cầu hoàn tiền — ƯU TIÊU CAO NHẤT, nguy cơ review xấu rất cao. Phản hồi tích cực: khách khen dịch vụ tốt, muốn giới thiệu bạn bè. Hỏi đặt tour mới: khách quay lại hỏi tour khác. Khác: các trường hợp còn lại.',
        type: 'enum', dataType: 'single_select',
        dataOptions: ['Khiếu nại dịch vụ', 'Hỏi hoàn tiền / Xin bồi thường', 'Phản hồi tích cực', 'Hỏi đặt tour mới', 'Khác'],
      },
      {
        id: 'trv-6-2', icon: '😠', name: 'Mức độ bức xúc',
        prompt: 'Khách có thể hiện tức giận rõ ràng, dọa đăng review xấu, dọa kiện, hoặc đề nghị bồi thường không? Đặc biệt nghiêm trọng nếu liên quan đến an toàn trong chuyến đi. Trả True nếu có tiêu cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
      {
        id: 'trv-6-3', icon: '🤝', name: 'Khách có giới thiệu được không?',
        prompt: 'Khách có thể hiện ý định giới thiệu bạn bè, đi tour tiếp, hoặc khen ngợi dịch vụ để lan tỏa không? Trả True nếu có tín hiệu tích cực rõ ràng.',
        type: 'boolean', dataType: 'true_false', dataOptions: null,
      },
    ],
  },
];

// ─── Insights mẫu đã tạo trong hệ thống ──────────────────────
export const mockUserInsights = [
  {
    id: 'ins-1', name: 'Phân tích Nhu Cầu KH Thời Trang',
    templateId: 'fsh-1', industry: 'fashion',
    columnCount: 4, status: 'active',
    createdAt: '2026-03-20T10:00:00Z', conversationsCount: 234,
  },
  {
    id: 'ins-2', name: 'Đánh Giá Lead Ads Thời Trang',
    templateId: 'fsh-2', industry: 'fashion',
    columnCount: 4, status: 'active',
    createdAt: '2026-03-19T08:30:00Z', conversationsCount: 156,
  },
  {
    id: 'ins-3', name: 'Đánh Giá Sale Mẹ và Bé',
    templateId: 'mbb-3', industry: 'mebaby',
    columnCount: 2, status: 'active',
    createdAt: '2026-03-18T09:00:00Z', conversationsCount: 312,
  },
  {
    id: 'ins-4', name: 'Phân Tích Chân Dung KH Mỹ Phẩm',
    templateId: 'cos-4', industry: 'cosmetics',
    columnCount: 4, status: 'active',
    createdAt: '2026-03-17T14:00:00Z', conversationsCount: 189,
  },
];

/**
 * mockConversationDetails.js
 *
 * Mock data cho ConversationDetailPanel — hiển thị chi tiết từng hội thoại
 * với 3 tab: Tin nhắn | Đánh Giá | Hành Động
 *
 * Mỗi hội thoại gồm:
 *  - metadata: customer name, platform, date, duration
 *  - messages: array of { sender, text, time }
 *  - evaluation: { temperature, phoneStatus, junkLead, attitude, sentiment, painPoints, objections, mistakes, competitorMention }
 *  - actions: array of { type, description, severity }
 */

const now = new Date('2026-03-28');

// ─── Seeded PRNG ────────────────────────────────────────────────────────────
function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

const firstNames = [
  'Nguyễn Thị Lan', 'Trần Văn Minh', 'Lê Hoàng Nam', 'Phạm Minh Châu',
  'Hoàng Đức Anh', 'Vũ Thị Hương', 'Đặng Quang Huy', 'Bùi Thị Mai',
  'Cao Minh Tuấn', 'Trương Thị Phương', 'Đỗ Thanh Sơn', 'Lý Thị Lan',
  'Phan Văn Hùng', 'Chu Thị Yến', 'Võ Đình Khoa', 'Trịnh Thị Ngọc',
  'Ngô Thị Thu Hà', 'Dương Văn Đức', 'Hà Thị Linh', 'Bạch Minh Đạt',
];

const lastNames = ['Khách hàng', 'Anh', 'Chị'];

const platforms = ['Facebook', 'Zalo'];

const temperatures = ['Nóng', 'Ấm', 'Lạnh'];

const phoneStatuses = ['Đã thu thập', 'Chưa thu thập', 'Từ chối cung cấp'];

const attitudes = ['Tốt', 'Bình thường', 'Kém'];

const sentiments = ['Tích cực', 'Băn khoăn', 'Tiêu cực'];

const junkReasons = [
  'Tin tự động từ ads',
  'Click nhầm',
  'Không phải KH mục tiêu',
  'Spam tự động',
  null, null, null, null, // most are not junk
];

const objectionList = [
  'Giá đắt',
  'Hàng fake / không rõ nguồn gốc',
  'Không có size',
  'Phí ship cao',
  'Chờ chồng quyết định',
  'Đang so sánh với đối thủ',
  'Cần suy nghĩ thêm',
  'Đã mua bên khác',
];

const mistakeList = [
  'Tư vấn sai thông tin sản phẩm',
  'Không rep khách trong 2 tiếng',
  'Gửi sai size/màu',
  'Quên confirm đơn',
  'Không follow up sau 24h',
  'Reply thiếu chuyên nghiệp',
  null, null, null, null, null,
];

const competitorNames = [
  'Shopee', 'Lazada', 'Tiki', 'Sendo', 'Hasaki', 'Guardian',
  'Watsons', 'Sephora', 'Vinmec', 'Long Châu', 'Michele', 'Yves Rocher',
];

const painPointPool = [
  'Tìm giày chạy bộ size 42',
  'Son màu đỏ rượu vang bền',
  'Sữa tắm cho da nhạy cảm',
  'Son dưỡng cho mùa đông',
  'Kem chống nắng cho da dầu',
  'Thuốc nhuộm tóc không hóa chất',
  'Bếp điện tử cho người ít nấu',
  'Máy massage cổ vai gáy',
  'Vitamin tổng hợp cho mẹ bầu',
  'Sữa công thức cho bé 1 tuổi',
];

const urgencyKeywords = [
  'Giao hôm nay được không?',
  'Cần gấp lắm',
  'Ship nhanh nhất bao lâu?',
  'Còn hàng không shop?',
  'Đơn hàng đang cần',
];

// ─── Message templates ──────────────────────────────────────────────────────

function generateMessages(conv, idx) {
  const isJunk = conv.isJunk;
  const temp = conv.temperature;
  const msgs = [];

  // Opening from customer
  msgs.push({
    sender: 'customer',
    text: conv.customerFirstMessage,
    time: '09:14',
  });

  // Customer is junk → short, bot-like
  if (isJunk) {
    msgs.push({ sender: 'shop', text: 'Dạ shop chào anh/chị ạ. Anh/chị cần hỗ trợ gì ạ?', time: '09:15' });
    msgs.push({ sender: 'customer', text: 'ok', time: '09:16' });
    msgs.push({ sender: 'shop', text: 'Dạ nếu cần hỗ trợ gì thêm anh/chị nhắn shop nhé. Chúc anh/chị một ngày tốt lành!', time: '09:16' });
    msgs.push({ sender: 'customer', text: '👍', time: '09:17' });
    return msgs;
  }

  // Normal flow
  msgs.push({ sender: 'shop', text: 'Dạ shop chào chị Minh Anh ạ! 😊 Shop có thể hỗ trợ gì cho chị hôm nay?', time: '09:15' });

  if (temp === 'Nóng') {
    msgs.push({ sender: 'customer', text: 'Chị muốn mua son MAC Ruby Woo còn size mini không shop? Giao Đà Nẵng được không?', time: '09:16' });
    msgs.push({ sender: 'shop', text: 'Dạ còn ạ! Size mini MAC Ruby Woo có giá 380k ạ. Giao Đà Nẵng 2-3 ngày ạ. Chị cần đặt luôn không ạ?', time: '09:17' });
    msgs.push({ sender: 'customer', text: 'Đặt 2 cây giao nhanh nhất có thể nha. Chị gửi SĐT qua đây luôn: 0901xxx123', time: '09:18' });
    msgs.push({ sender: 'shop', text: 'Dạ em note đơn 2 cây MAC Ruby Woo mini, giao nhanh ạ. SĐT đã ghi nhận. Em gửi đơn qua Zalo để chị thanh toán nhé!', time: '09:19' });
    msgs.push({ sender: 'customer', text: 'Ok gửi đi. Cảm ơn shop nhiều!', time: '09:20' });
    msgs.push({ sender: 'shop', text: 'Dạ cảm ơn chị! Đơn em gửi qua Zalo rồi ạ, chị thanh toán giúp em nhé. Chúc chị ngày mới vui vẻ! 💋', time: '09:21' });
  } else if (temp === 'Ấm') {
    msgs.push({ sender: 'customer', text: 'Shop ơi, son 3CE taupe còn không? Màu đó đẹp lắm hả?', time: '09:16' });
    msgs.push({ sender: 'shop', text: 'Dạ còn chị ơi! 3CE taupe là màu best seller luôn á. Màu này lên da đẹp lắm, phù hợp với mọi tone da ạ. Chị có muốn xem thêm review từ khách không?', time: '09:17' });
    msgs.push({ sender: 'customer', text: 'Có cho em xin với, mà size nào vậy shop? Giá bao nhiêu?', time: '09:18' });
    msgs.push({ sender: 'shop', text: 'Dạ size 3.5g giá 290k ạ. Em gửi chị clip review: [link]. Chị ơi chị thường tô son kiểu gì ạ — lòng môi hay full lip?', time: '09:19' });
    msgs.push({ sender: 'customer', text: 'Tô full lip á, mình thích son lì màu lắm', time: '09:21' });
    msgs.push({ sender: 'shop', text: 'Dạ 3CE taupe perfect cho full lip luôn á! Son lì lên màu rất đẹp. Chị có muốn mình đặt giúp không ạ? Hàng về 2 ngày nữa thôi ạ 😊', time: '09:23' });
  } else {
    msgs.push({ sender: 'customer', text: 'Xem son', time: '09:16' });
    msgs.push({ sender: 'shop', text: 'Dạ chào anh/chị ạ. Shop có rất nhiều dòng son: MAC, 3CE, YSL, Tom Ford... Anh/chị quan tâm thương hiệu nào hoặc màu nào ạ?', time: '09:17' });
    msgs.push({ sender: 'customer', text: 'Ừ', time: '09:25' });
    msgs.push({ sender: 'shop', text: 'Dạ nếu anh/chị cần hỗ trợ gì thêm cứ nhắn shop nhé. Shop có hotline: 0909xxx456. Chúc anh/chị một ngày tốt lành ạ!', time: '09:26' });
    // Seen, no more response
    msgs.push({ sender: 'system', text: '🔵 Khách đã xem tin nhắn lúc 09:27 — Không phản hồi', time: '09:27' });
  }

  return msgs;
}

// ─── Action recommendations ─────────────────────────────────────────────────

function generateActions(conv) {
  const actions = [];

  if (conv.isJunk) {
    actions.push({ type: 'warning', label: 'Junk Lead', description: 'Khách gửi tin tự động hoặc click nhầm ads. Không có intent mua thật.', severity: 'neutral' });
    actions.push({ type: 'action', label: 'Tag phân loại', description: 'Gắn tag "Junk" để lọc khỏi báo cáo lead quality.', severity: 'info' });
    return actions;
  }

  if (conv.temperature === 'Nóng') {
    actions.push({ type: 'success', label: 'Lead Nóng — Chốt đơn thành công', description: 'Khách hỏi giá + xin SĐT + muốn giao nhanh. Đơn hàng có xác suất cao.', severity: 'success' });
    if (conv.phoneStatus === 'Đã thu thập') {
      actions.push({ type: 'action', label: 'Gửi SMS xác nhận', description: 'Gửi tin nhắn cảm ơn + mã đơn hàng để tăng trust và giảm cancelled order.', severity: 'info' });
    }
    return actions;
  }

  if (conv.temperature === 'Ấm') {
    if (conv.attitude === 'Kém') {
      actions.push({ type: 'warning', label: 'Thái độ tư vấn chưa tốt', description: 'Nhân viên hỏi quá nhiều câu hỏi khiến khách feel pressured. Cần điều chỉnh kịch bản.', severity: 'warning' });
    }
    if (conv.hasCompetitor) {
      actions.push({ type: 'warning', label: 'Khách so sánh với đối thủ', description: `${conv.competitorMention} được nhắc đến. Cần có battle card để xử lý objection này.`, severity: 'warning' });
    }
    if (conv.objection && conv.objection !== 'Không') {
      actions.push({ type: 'warning', label: `Objection: ${conv.objection}`, description: 'Khách đặt câu hỏi nghi ngờ. Nhân viên cần xử lý tốt hơn bằng proof points cụ thể.', severity: 'warning' });
    }
    actions.push({ type: 'action', label: 'Follow up sau 24h', description: 'Gửi tin nhắn quan tâm: "Chị có cần shop hỗ trợ thêm gì không ạ?" để warm up khách.', severity: 'info' });
    return actions;
  }

  // Lạnh
  if (conv.mistake) {
    actions.push({ type: 'error', label: `Lỗi: ${conv.mistake}`, description: 'Nhân viên mắc lỗi trong quá trình tư vấn. Cần review và đào tạo lại.', severity: 'error' });
  }
  if (!conv.hasCompetitor === false && conv.competitorMention) {
    actions.push({ type: 'warning', label: 'Đối thủ được nhắc đến', description: `Khách so sánh với ${conv.competitorMention}. Cần cập nhật USP và battle card.`, severity: 'warning' });
  }
  actions.push({ type: 'action', label: 'Chương trình re-engagement', description: 'Cuộc trò chuyện "bốc hơi". Cần 3 tin nhắn follow-up trong 48h để phục hồi lead.', severity: 'info' });
  return actions;
}

// ─── Main generator ────────────────────────────────────────────────────────

/**
 * generateConversationDetails(diseaseId, conversations)
 * Tạo N conversation detail objects cho một nhóm bệnh.
 * @param {string} diseaseId — disease group id
 * @param {Array}  conversations — raw conversation rows from Supabase JSON
 * @returns {Array} array of conversation detail objects
 */
export function generateConversationDetails(diseaseId, conversations = []) {
  // Số lượng mock conversations hiển thị trong panel
  const count = Math.min(conversations.length > 0 ? 15 : 12, conversations.length || 12);
  const items = [];

  for (let i = 0; i < count; i++) {
    const seed = (diseaseId.length * 100 + i) * 7919;
    const rng = (offset = 0) => sr(seed + offset);

    // Name
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const customerName = `${lastName} ${firstName.split(' ').pop()}`;

    // Metadata
    const platform = rng(1) > 0.35 ? 'Facebook' : 'Zalo';
    const daysAgo = Math.round(rng(2) * 6);
    const date = new Date(now);
    date.setDate(date.getDate() - daysAgo);
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;

    const hour = 8 + Math.round(rng(3) * 10);
    const minute = Math.round(rng(4) * 59);
    const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    // Temperature
    const tempRand = rng(5);
    const temperature = tempRand > 0.5 ? 'Nóng' : tempRand > 0.2 ? 'Ấm' : 'Lạnh';

    // Phone
    const phoneRand = rng(6);
    const phoneStatus = phoneRand > 0.55 ? 'Đã thu thập' : phoneRand > 0.2 ? 'Chưa thu thập' : 'Từ chối cung cấp';

    // Junk
    const junkRand = rng(7);
    const isJunk = junkRand > 0.75;

    // Attitude
    const attRand = rng(8);
    const attitude = attRand > 0.5 ? 'Tốt' : attRand > 0.2 ? 'Bình thường' : 'Kém';

    // Sentiment
    const sentRand = rng(9);
    const sentiment = sentRand > 0.5 ? 'Tích cực' : sentRand > 0.2 ? 'Băn khoăn' : 'Tiêu cực';

    // Pain point
    const painPoint = painPointPool[i % painPointPool.length];

    // Objection
    const objRand = rng(10);
    const objection = objRand > 0.6 ? objectionList[i % objectionList.length] : 'Không';

    // Mistake
    const misRand = rng(11);
    const mistake = misRand > 0.65 ? mistakeList[i % mistakeList.length] : null;

    // Competitor
    const compRand = rng(12);
    const hasCompetitor = compRand > 0.7;
    const competitorMention = hasCompetitor ? competitorNames[i % competitorNames.length] : null;

    // Customer first message
    const customerFirstMessage = isJunk
      ? 'Tin tự động từ ads: "Click để nhận ưu đãi 50%"'
      : temperature === 'Nóng'
        ? `Chị/anh hỏi về: ${painPoint}. Cần giao gấp.`
        : temperature === 'Ấm'
          ? `Shop ơi cho em hỏi về ${painPoint} với ạ?`
          : 'Xem sản phẩm';

    // Phone collected → show phone number for hot leads
    const phoneNumber = phoneStatus === 'Đã thu thập'
      ? `090${Math.round(rng(13) * 900 + 100)}xxx${Math.round(rng(14) * 90 + 10)}`
      : null;

    // Messages
    const conv = {
      isJunk, temperature, phoneStatus, attitude, sentiment,
      customerFirstMessage, hasCompetitor, competitorMention,
      objection, mistake,
    };
    const messages = generateMessages(conv, i);

    // Evaluation
    const evaluation = {
      temperature,
      temperatureColor: temperature === 'Nóng' ? '#059669' : temperature === 'Ấm' ? '#d97706' : '#dc2626',
      temperatureBg: temperature === 'Nóng' ? 'rgba(5,150,105,0.08)' : temperature === 'Ấm' ? 'rgba(217,119,6,0.08)' : 'rgba(220,38,38,0.08)',
      phoneStatus,
      phoneStatusColor: phoneStatus === 'Đã thu thập' ? '#059669' : phoneStatus === 'Chưa thu thập' ? '#d97706' : '#dc2626',
      isJunk,
      junkReason: isJunk ? junkReasons[i % junkReasons.length] : null,
      attitude,
      attitudeColor: attitude === 'Tốt' ? '#059669' : attitude === 'Bình thường' ? '#d97706' : '#dc2626',
      sentiment,
      sentimentColor: sentiment === 'Tích cực' ? '#059669' : sentiment === 'Băn khoăn' ? '#d97706' : '#dc2626',
      painPoint,
      objection,
      mistake,
      hasCompetitor,
      competitorMention,
      phoneNumber,
      phoneNumberMasked: phoneNumber ? phoneNumber.replace(/(\d{3})\d{4}(\d{3})/, '$1xxxx$2') : null,
    };

    // Actions
    const actions = generateActions(conv);

    items.push({
      id: `conv-${diseaseId}-${i}`,
      customerName,
      platform,
      date: dateStr,
      time: timeStr,
      messages,
      evaluation,
      actions,
    });
  }

  // Sort: Nóng first, then Ấm, then Lạnh; isJunk always last
  items.sort((a, b) => {
    if (a.evaluation.isJunk !== b.evaluation.isJunk) return a.evaluation.isJunk ? 1 : -1;
    const order = { 'Nóng': 0, 'Ấm': 1, 'Lạnh': 2 };
    return (order[a.evaluation.temperature] ?? 3) - (order[b.evaluation.temperature] ?? 3);
  });

  return items;
}

/**
 * getConversationDetailsByDisease — lấy chi tiết cho 1 nhóm bệnh
 */
export function getConversationDetailsByDisease(diseaseId, conversations = []) {
  return generateConversationDetails(diseaseId, conversations);
}

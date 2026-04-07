import { useState } from 'react';
import { getTopCriticalMetrics } from '../../lib/medicalService';

/** Việt hóa tên chỉ số cảnh báo */
function getVietnameseMetricLabel(alert) {
  const key = alert.metricKey;
  const map = {
    junkLeadPercent: 'Khách hàng rác',
    phoneCollected: 'Thu thập số điện thoại',
    conversionRate: 'Tỉ lệ chốt đơn',
    avgResponseMinutes: 'Thời gian phản hồi trung bình',
    remindRate: 'Tỉ lệ nhắc lại khách hàng',
    personalOfferRate: 'Ưu đãi cá nhân hóa',
    mistakeRate: 'Lỗi mất khách',
    goodAttitudePercent: 'Thái độ tư vấn tốt',
    competitorMentionRate: 'Tỉ lệ nhắc đến đối thủ',
    priceComparisonRate: 'Tỉ lệ so sánh giá',
    reviewRiskRate: 'Rủi ro đánh giá xấu',
    urgencyRate: 'Mức độ khẩn cấp',
    objectionRate: 'Tỉ lệ gặp phản đối',
    ghostRate: 'Tỉ lệ khách bỏ cuộc',
    ignoredRecRate: 'Tỉ lệ bỏ qua gợi ý',
    upsellAttemptRate: 'Tỉ lệ đề xuất mua thêm',
    overpromiseRate: 'Quá hứa hẹn',
    guaranteeRate: 'Cam kết không rõ ràng',
    abandonRate: 'Bỏ giữa chừng',
    noClosureRate: 'Không kết thúc',
    noFinalMsgRate: 'Không tin nhắn cuối',
    badToneRate: 'Giọng không phù hợp',
    emojiOveruseRate: 'Over-emoji',
    longMsgRate: 'Tin quá dài',
  };
  return map[key] || alert.metricLabel;
}

// ─── Emoji / label helpers ───────────────────────────────────────────────────

function tempEmoji(temp) {
  const map = { 'Nóng': '🔥', 'Ấm': '🌡️', 'Lạnh': '❄️' };
  return map[temp] || '';
}

function phoneIcon(phoneStatus) {
  const map = {
    'Đã thu thập': '📞',
    'Đã thu thập SĐT': '📞',
    'Chưa thu thập': '❌',
    'Chưa thu thập SĐT': '❌',
    'Từ chối': '🚫',
    'Từ chối cung cấp': '🚫',
  };
  return map[phoneStatus] || '📱';
}

function sentimentEmoji(sentiment) {
  const map = {
    'Bức xúc': '😤',
    'Tiêu cực': '😞',
    'Băn khoăn': '😑',
    'Trung lập': '😐',
    'Tích cực': '😊',
  };
  return map[sentiment] || '';
}

/** Mock summaries per alert type — each pool has 10+ distinct summaries for variety */
const ALERT_SUMMARY_POOLS = {
  junkLeadPercent: [
    'Tin tự động từ ads, khách không tương tác',
    'Nhắn tin hỏi giá rồi bỏ, không rep lại',
    'Khách gửi tin trùng lặp nhiều lần',
    'Tin nhắn từ bot tự động, không có ý mua',
    'Khách nhấn nút liên hệ nhưng không nhắn tin',
    'Comment trên ads nhưng không follow up',
    'Tin nhắn chứa link lạ, không liên quan sản phẩm',
    'Khách hỏi 1 câu rồi seen không rep',
    'Nhắn tin yêu cầu gửi app khác',
    'Khách gửi số điện thoại sai định dạng',
    'Tin trả lời tự động từ chatbot',
  ],
  phoneCollected: [
    'Hỏi thông tin kỹ nhưng không để lại SĐT',
    'Khách muốn mua nhưng từ chối cung cấp SĐT',
    'Hỏi giá + size nhiều lần, rồi biến mất',
    'Đã trao đổi 5+ tin nhắn nhưng chưa thu thập SĐT',
    'Khách cung cấp SĐT sai 2 lần liên tiếp',
    'Yêu cầu gọi lại nhưng không để số',
    'Đồng ý nhận tư vấn nhưng chặn sau đó',
    'Hỏi về địa chỉ shop nhưng không lấy SĐT',
    'Khách muốn đặt cọc nhưng không cung cấp SĐT',
    'Trao đổi xong nhưng không capture được SĐT',
  ],
  conversionRate: [
    'Hỏi giá 3 lần nhưng chưa chốt đơn',
    'Khách đồng ý mua nhưng chưa thanh toán',
    'Đang cân nhắc giữa 2 sản phẩm',
    'Yêu cầu xem thêm review trước khi quyết định',
    'Hẹn quay lại sau nhưng chưa thấy lại',
    'Hỏi so sánh với sản phẩm khác nhiều lần',
    'Khách muốn giảm giá thêm rồi mới mua',
    'Đang chờ ngân sách được duyệt',
    'Cần hỏi chồng / người thân trước khi mua',
    'Muốn nhận hàng trước, trả tiền sau',
  ],
  mistakeRate: [
    'Sale đưa thông tin sai về tồn kho',
    'Tư vấn nhầm size dẫn đến đổi hàng',
    'Báo sai giá khuyến mãi, khách hủy đơn',
    'Hứa giao trong ngày nhưng giao trễ 3 ngày',
    'Gửi nhầm sản phẩm cho khách',
    'Không xác nhận lại đơn trước khi giao',
    'Thông tin bảo hành không chính xác',
    'Mô tả sản phẩm không đúng với thực tế',
    'Đơn bị duplicate do sale tạo 2 lần',
    'Sai địa chỉ giao hàng do không check kỹ',
  ],
  competitorMentionRate: [
    'So sánh với Shopee về giá và tốc độ giao',
    'Hỏi sản phẩm tương tự bên Lazada',
    'Khách mới chuyển từ cửa hàng khác',
    'Đề cập đến đối thủ về chính sách đổi trả',
    'So sánh với brand khác về thành phần',
    'Hỏi tại sao giá cao hơn marketplace',
    'Khách đang dùng sản phẩm từ đối thủ',
    'So sánh về uy tín giữa các shop',
    'Đề cập review tốt về shop khác',
    'Hỏi khác biệt giữa 2 sản phẩm cạnh tranh',
  ],
  reviewRiskRate: [
    'Khiếu nại chất lượng sản phẩm không đạt kỳ vọng',
    'Da bị kích ứng sau khi sử dụng 1 tuần',
    'Phàn nàn về mùi sản phẩm khác với mô tả',
    'Dọa đăng review xấu nếu không được hoàn tiền',
    'Gửi ảnh sản phẩm bị hỏng và yêu cầu bồi thường',
    'Khách phản ánh sản phẩm hết hạn sớm',
    'Review 1 sao kèm comment tiêu cực về tư vấn',
    'Yêu cầu gỡ bài đăng negative trên mạng xã hội',
    'Khiếu nại thái độ nhân viên khiếm nhã',
    'Phản ánh sản phẩm không đúng với hình ảnh quảng cáo',
  ],
  ghostRate: [
    'Khách seen không rep sau 3 tin nhắn đầu tiên',
    'Hỏi thông tin rồi biến mất không lời từ biệt',
    'Nhắn tin rồi block page ngay sau đó',
    'Đang trả lời thì khách ngừng rep đột ngột',
    'Reply lần đầu rồi không tương tác thêm',
    'Khách inbox rồi unfollow page ngay sau',
    'Hỏi 1 câu rồi chuyển sang mua chỗ khác',
    'Không rep tin nhắn follow-up lần 2',
    'Profile khách bị ẩn sau khi nhắn tin',
    'Nhắn tin từ tài khoản mới tạo rồi bỏ',
  ],
  abandonRate: [
    'Khách nhắn 1-2 tin rồi bỏ giữa chừng',
    'Cuộc trò chuyện kết thúc không có closure',
    'Khách hỏi nhanh rồi chuyển sang mua chỗ khác',
    'Nhắn tin rồi đóng app không tương tác lại',
    'Tin nhắn dở chừng không được reply',
    'Khách ngắt cuộc trò chuyện giữa chừng',
    'Cuộc hội thoại bị bỏ rơi khi đang tư vấn',
    'Khách nhắn lúc đầu rồi không theo dõi tiếp',
    'Hẹn sẽ quay lại nhưng không thấy lại',
    'Khách rời đi sau khi hỏi về giá vận chuyển',
  ],
  badToneRate: [
    'Reply quá dài 15+ dòng không có dấu câu',
    'Dùng quá nhiều emoji trong 1 tin nhắn tư vấn',
    'Giọng văn quá thân mật với khách lần đầu',
    'Sử dụng slang không phù hợp với brand',
    'Viết HOA toàn bộ tin nhắn tạo cảm giác quát khách',
    'Nhiều lỗi chính tả trong tin trả lời',
    'Tin nhắn chứa nội dung nhạy cảm / phản cảm',
    'Reply kiểu chat bạn bè khiên khách không thoải mái',
    'Dùng thuật ngữ quá chuyên ngành khiến khách khó hiểu',
    'Gửi tin nhắn trùng lặp do nhấn nhầm nhiều lần',
  ],
  upsellAttemptRate: [
    'Gợi ý serum dưỡng nhưng khách chỉ muốn mua kem chống nắng',
    'Upsell phiên bản cao cấp nhưng khách chọn bản thường',
    'Đề xuất combo tiết kiệm nhưng khách mua lẻ',
    'Khách từ chối sản phẩm bổ sung vì giá cao',
    'Gợi ý size lớn hơn nhưng khách vẫn chọn size nhỏ',
    'Upsell phụ kiện đi kèm không thành công',
    'Khách chỉ mua sản phẩm đang khuyến mãi',
    'Đề xuất gói membership bị khách từ chối',
    'Cross-sell sản phẩm cùng brand không hiệu quả',
    'Khách chỉ quan tâm sản phẩm chính, bỏ qua upsell',
  ],
  ignoredRecRate: [
    'Khách hỏi về kem chống nắng nhưng không được đề xuất sản phẩm',
    'Tư vấn chung chung không gợi ý sản phẩm phù hợp',
    'Khách cần sữa rửa mặt nhưng chỉ được tư vấn serum',
    'Không follow-up sau khi khách hỏi về sản phẩm mới',
    'Gợi ý sản phẩm không đúng với loại da khách nêu ra',
    'Khách muốn mua toner nhưng không ai đề xuất kèm serum',
    'Tư vấn xong mà không gửi link sản phẩm cho khách',
    'Khách hỏi về combo nhưng không được đề xuất mua bundle',
    'Bỏ qua sản phẩm best-seller phù hợp với nhu cầu khách',
    'Không chốt đơn sau khi khách hỏi về sản phẩm bổ sung',
  ],
  goodAttitudePercent: [
    'Tư vấn nhiệt tình, gửi thêm hướng dẫn sử dụng sản phẩm',
    'Chủ động hỏi về loại da và đề xuất sản phẩm phù hợp',
    'Reply nhanh trong vòng 5 phút, gửi thêm review từ khách khác',
    'Tặng kèm sample size cho khách lần đầu mua',
    'Giải đáp kỹ về thành phần và cách dùng cho khách mới',
    'Chủ động gợi ý sản phẩm dưỡng kèm theo đơn mua chính',
    'Tư vấn chu đáo, gửi thêm video hướng dẫn sử dụng',
    'Chăm sóc khách sau mua, hỏi thăm tình trạng da sau 3 ngày',
    'Nhiệt tình so sánh các sản phẩm để khách dễ chọn',
    'Gửi thêm mã giảm giá cho đơn tiếp theo của khách',
  ],
};

/**
 * Build a contextually-relevant summary for one conversation row,
 * aligned to the alert metric type.
 */
function buildConversationSummary(conv, alertMetricKey) {
  const pool = ALERT_SUMMARY_POOLS[alertMetricKey];
  if (!pool) {
    // Fallback: use real pain_point if available
    if (conv.pain_point) return conv.pain_point.slice(0, 32);
    if (conv.temperature) return `${tempEmoji(conv.temperature)} ${conv.temperature}`;
    return '';
  }
  // Pick deterministically by conversation id so summary is stable
  const idx = conv.id
    ? Math.abs(conv.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % pool.length
    : Math.floor(Math.random() * pool.length);
  return pool[idx];
}

// ─── Platform icon ───────────────────────────────────────────────────────────

function PlatformIcon({ platform }) {
  if (platform === 'zalo') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#0068ff">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Z</text>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

/** Pick up to 10 unique conversations, sort Nóng→Ấm→Lạnh, build per-conv summary */
function getConversationExamples(alert, conversations) {
  // Pick 10 unique rows (no duplicate names), then sort by temperature priority
  const seenNames = new Set();
  const unique = [];
  const shuffled = [...conversations].sort(() => Math.random() - 0.5);
  for (const row of shuffled) {
    const name = row.customer || `Khách hàng ${unique.length + 1}`;
    if (!seenNames.has(name)) {
      seenNames.add(name);
      unique.push(row);
    }
    if (unique.length >= 10) break;
  }

  // Sort: Nóng first → Ấm → Lạnh → unknown
  const tempOrder = { 'Nóng': 0, 'Ấm': 1, 'Lạnh': 2 };
  unique.sort((a, b) => (tempOrder[a.temperature] ?? 9) - (tempOrder[b.temperature] ?? 9));

  const metricKey = alert.metricKey;
  return unique.map((row, idx) => ({
    id: `ex-${idx}`,
    customer: row.customer || `Khách hàng ${idx + 1}`,
    platform: row.platform || 'facebook',
    temperature: row.temperature,
    time: row.created_at || row.date || '',
    summary: buildConversationSummary(row, metricKey),
  }));
}

/** Single alert row — clickable to expand conversation examples */
function AlertRow({ alert, conversations, isExpanded, onToggle }) {
  const metricLabel = getVietnameseMetricLabel(alert);
  const examples = getConversationExamples(alert, conversations);

  return (
    <div className="flex flex-col">
      {/* Clickable header row */}
      <div
        className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg transition-all duration-150 hover:bg-[rgba(26,33,56,0.04)] cursor-pointer"
        onClick={onToggle}
      >
        {/* Alert icon */}
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: alert.bg }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={alert.color} strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-body-sm font-semibold text-on-surface truncate">
              {alert.diseaseLabel}
            </span>
            <span className="text-body-sm font-medium text-on-surface-variant truncate">
              {metricLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-title-sm font-bold" style={{ color: alert.color }}>
              {alert.value}{alert.unit}
            </span>
            <button className="text-label-xs font-semibold px-2 py-0.5 rounded transition-colors shrink-0"
              style={{ color: alert.color, backgroundColor: alert.bg }}>
              {isExpanded ? '▲ Thu gọn' : `▼ Xem ${examples.length} hội thoại`}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded: conversation examples — per-conv summary, no truncation */}
      {isExpanded && (
        <div className="flex flex-col gap-0.5 px-3 pb-2 mt-0.5">
          {examples.map(ex => (
            <div
              key={ex.id}
              className="flex items-start gap-3 px-3 py-1.5 rounded-md bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] last:border-0"
            >
              {/* Platform icon */}
              <div className="shrink-0 mt-0.5">
                <PlatformIcon platform={ex.platform} />
              </div>

              {/* Customer name + 2-line summary */}
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-on-surface leading-tight">
                  {ex.customer}
                </p>
                <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-2 mt-0.5">
                  {ex.summary}
                </p>
              </div>

              {/* Temp dot + time */}
              <div className="shrink-0 flex flex-col items-end gap-1 mt-0.5">
                {ex.temperature && (
                  <div
                    className="w-2 h-2 rounded-full mt-0.5"
                    style={{
                      backgroundColor:
                        ex.temperature === 'Nóng' ? '#dc2626'
                        : ex.temperature === 'Ấm' ? '#d97706'
                        : '#6b7280',
                    }}
                  />
                )}
                {ex.time && (
                  <span className="text-[10px] text-on-surface-variant/60 leading-none">
                    {String(ex.time).slice(0, 10)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CriticalAlertsPanel({ diseases, conversations = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const alerts = getTopCriticalMetrics(diseases, 6);
  const redAlerts = alerts.filter(a => a.level === 'red');
  const yellowAlerts = alerts.filter(a => a.level === 'yellow');

  const handleToggle = (alertId) => {
    setExpandedId(prev => prev === alertId ? null : alertId);
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
          Cảnh Báo Khẩn
        </h3>
        {redAlerts.length > 0 && (
          <span className="ml-auto text-label-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
            {redAlerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <span className="text-body-sm text-on-surface-variant/60">Không có gợi ý</span>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {redAlerts.map(alert => {
            const alertId = `${alert.diseaseId}-${alert.metricKey}`;
            return (
              <AlertRow
                key={alertId}
                alert={alert}
                conversations={conversations}
                isExpanded={expandedId === alertId}
                onToggle={() => handleToggle(alertId)}
              />
            );
          })}
          {yellowAlerts.map(alert => {
            const alertId = `${alert.diseaseId}-${alert.metricKey}`;
            return (
              <AlertRow
                key={alertId}
                alert={alert}
                conversations={conversations}
                isExpanded={expandedId === alertId}
                onToggle={() => handleToggle(alertId)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

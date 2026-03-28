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

/** Build a per-conversation summary string from real data fields */
function buildConversationSummary(conv) {
  const parts = [];
  if (conv.temperature) parts.push(tempEmoji(conv.temperature));
  if (conv.phoneStatus) parts.push(phoneIcon(conv.phoneStatus));
  if (conv.sentiment) parts.push(sentimentEmoji(conv.sentiment));
  else if (conv.painPoint) parts.push(conv.painPoint.slice(0, 18));
  else if (conv.objection) parts.push(conv.objection.slice(0, 18));
  return parts.join(' · ');
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

  return unique.map((row, idx) => ({
    id: `ex-${idx}`,
    customer: row.customer || `Khách hàng ${idx + 1}`,
    platform: row.platform || 'facebook',
    temperature: row.temperature,
    time: row.created_at || row.date || '',
    summary: buildConversationSummary(row),
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
        className="flex items-start gap-2.5 px-3 py-2.5 rounded-[--radius-sm] transition-colors hover:bg-surface-container-low cursor-pointer"
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
              className="flex items-start gap-3 px-3 py-1.5 rounded-[--radius-sm] bg-surface-container-lowest border-b border-surface-secondary last:border-0"
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
          Cảnh báo khẩn
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
          <span className="text-body-sm text-on-surface-variant/60">Không có cảnh báo</span>
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

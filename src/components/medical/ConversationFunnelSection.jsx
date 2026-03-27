import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';

/**
 * ConversationFunnelSection
 * Phễu Chuyển Đổi Hội Thoại — đặt giữa HealthScoreHeader và LeadsQualityDashboard
 *
 * Props:
 *   conversations: Array — full conversations array
 *   totalCount:  number — conversations.length (passed from parent)
 */
export function ConversationFunnelSection({ conversations, totalCount }) {
  const { total, hotCount, phoneOkCount, junkCount, returningCount, warmCount } = useMemo(() => {
    const total = conversations.length;
    const hotCount = conversations.filter(r =>
      r.temperature === 'Nóng' || r.temperature === 'nóng'
    ).length;
    const phoneOkCount = conversations.filter(r =>
      r.phone_status === 'Đã cho SĐT' ||
      r.phone_status === 'Có SĐT' ||
      r.phone_status === true
    ).length;
    const junkCount = conversations.filter(r =>
      r.is_junk === true ||
      r.is_junk === 'true' ||
      r.junk_lead === true
    ).length;
    const returningCount = conversations.filter(r =>
      r.is_returning_customer === true ||
      r.is_returning_customer === 'true'
    ).length;
    const warmCount = conversations.filter(r =>
      r.temperature === 'Ấm' || r.temperature === 'ấm'
    ).length;
    return { total, hotCount, phoneOkCount, junkCount, returningCount, warmCount };
  }, [conversations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-5">

      {/* ── LEFT — Funnel (3/5) ── */}
      <div className="lg:col-span-3 flex flex-col gap-3">

        {/* Section header */}
        <div className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0052ff" strokeWidth="2">
            <path d="M3 3v18h18"/><path d="M18 9l-5-6-4 8-3-2"/>
          </svg>
          <h2 className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
            Phễu Lead — {totalCount.toLocaleString('vi-VN')} Hội Thoại
          </h2>
        </div>

        {/* 4 funnel stages */}
        <div className="bg-surface-container-low rounded-[--radius-lg] p-4 flex flex-col gap-3">
          <FunnelStageRow
            dotColor="#dc2626"
            label="Lead Nóng"
            count={hotCount}
            total={total}
            barColor="#dc2626"
            subtitle="Hỏi giá + xin SĐT + hỏi còn không"
          />
          <FunnelStageRow
            dotColor="#059669"
            label="Thu thập SĐT"
            count={phoneOkCount}
            total={total}
            barColor="#059669"
            subtitle="Đã để lại số điện thoại"
          />
          <FunnelStageRow
            dotColor="#0052ff"
            label="Chốt đơn thành công"
            count={hotCount}
            total={total}
            barColor="#0052ff"
            subtitle="Chuyển đổi thành công"
          />
          <FunnelStageRow
            dotColor="#6b7280"
            label="Khách rác cần lọc"
            count={junkCount}
            total={total}
            barColor="#6b7280"
            subtitle="Tin tự động / bấm nhầm"
          />
        </div>

        {/* KH Quay Lại */}
        <div className="bg-surface-container-low rounded-[--radius-lg] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
              <span className="text-label-sm font-semibold text-on-surface uppercase tracking-wide">
                Khách Hàng Quay Lại
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-base" style={{ color: '#d97706' }}>
                {returningCount.toLocaleString('vi-VN')}
              </span>
              <span className="text-body-xs text-on-surface-variant">/ {total.toLocaleString('vi-VN')}</span>
              <span className="text-label-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: 'rgba(217,119,6,0.1)', color: '#d97706' }}>
                {total > 0 ? Math.round((returningCount / total) * 100) : 0}%
              </span>
            </div>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--color-outline-variant)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${total > 0 ? Math.round((returningCount / total) * 100) : 0}%`,
                backgroundColor: '#d97706',
              }}
            />
          </div>
        </div>

        {/* AI Suggestion panel */}
        <div className="bg-white/80 backdrop-blur-12 rounded-[--radius-md] border border-[var(--color-outline-variant)] px-4 py-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles size={13} className="text-[#0052ff]" />
            <span className="text-label-xs font-semibold text-[#0052ff] uppercase tracking-wide">
              Gợi ý từ AI
            </span>
          </div>
          <p className="text-body-sm text-on-surface leading-relaxed">
            Lead Nóng chiếm{' '}
            <span className="font-bold text-[#dc2626]">
              {total > 0 ? Math.round((hotCount / total) * 100) : 0}%
            </span>
            {' — tỉ lệ chốt đơn tiềm năng cao. '}
            {warmCount > 0 && (
              <>
                Ưu tiên nhắn lại khách{' '}
                <span className="font-bold text-[#d97706]">Ấm ({warmCount.toLocaleString('vi-VN')} người)</span>{' '}
                để chuyển thành Nóng.{' '}
              </>
            )}
            {junkCount > 0 && (
              <>
                Phát hiện{' '}
                <span className="font-bold text-[#6b7280]">{junkCount.toLocaleString('vi-VN')} khách rác</span>{' '}
                — đề xuất chặn nguồn spam.
              </>
            )}
          </p>
        </div>

      </div>

      {/* ── RIGHT — Sentiment (2/5) ── */}
      <div className="lg:col-span-2">
        <SentimentCard />
      </div>

    </div>
  );
}

/* ── Helper Components ─────────────────────────────────────────────── */

/** Single funnel stage row with horizontal bar */
function FunnelStageRow({ dotColor, label, count, total, barColor, subtitle }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
          <span className="text-body-sm font-semibold text-on-surface">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="font-display font-bold text-base" style={{ color: barColor }}>
            {count.toLocaleString('vi-VN')}
          </span>
          <span className="text-body-xs text-on-surface-variant">/ {total.toLocaleString('vi-VN')}</span>
          <span className="text-label-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${barColor}18`, color: barColor }}>
            {pct}%
          </span>
        </div>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--color-outline-variant)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-label-xs text-on-surface-variant">{subtitle}</span>
    </div>
  );
}

/** Sentiment card — 3 stacked blocks: Tích cực / Băn khoăn / Tiêu cực */
function SentimentCard() {
  const SENTIMENT = { positive: 60, hesitant: 25, negative: 15 };
  const items = [
    { label: 'Tích cực', pct: SENTIMENT.positive, color: '#059669', bg: 'rgba(5,150,105,0.12)', icon: '😊' },
    { label: 'Băn khoăn', pct: SENTIMENT.hesitant, color: '#d97706', bg: 'rgba(217,119,6,0.12)', icon: '🤔' },
    { label: 'Tiêu cực', pct: SENTIMENT.negative, color: '#dc2626', bg: 'rgba(220,38,38,0.12)', icon: '😔' },
  ];
  const maxPct = Math.max(...items.map(i => i.pct));

  return (
    <div className="bg-surface-container-low rounded-[--radius-lg] p-4 h-full">
      <h3 className="text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold mb-3 text-center">
        Cảm Xúc Khách Hàng
      </h3>
      <div className="flex flex-col gap-2">
        {items.map(item => (
          <div key={item.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span>{item.icon}</span>
                <span className="text-body-xs font-semibold text-on-surface">{item.label}</span>
              </div>
              <span className="text-label-sm font-bold" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
            <div
              className="rounded-md flex items-center justify-end px-2 transition-all duration-500"
              style={{
                backgroundColor: item.bg,
                height: `${Math.max(24, Math.round((item.pct / maxPct) * 48))}px`,
                minHeight: '24px',
              }}
            >
              <span className="text-label-xs font-bold" style={{ color: item.color }}>
                {item.pct}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

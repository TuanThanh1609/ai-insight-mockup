/**
 * AttributionFunnel — Horizontal bar funnel visualization
 *
 * 4-segment horizontal funnel:
 *   Impressions → Clicks → Conversations → Orders
 *
 * Colors per segment:
 *   Impressions: Deep Navy #1A2138
 *   Clicks:      Vibrant Blue #0052FF
 *   Conversations: Purple #7C3AED
 *   Orders:      Emerald #059669
 */
export function AttributionFunnel({
  data = {
    impressions: 1245000,
    clicks: 18420,
    conversations: 368,
    orders: 89,
    matchedOrders: 67,
    untrackedOrders: 22,
    phoneCollectedRate: 24.2,
    matchedRate: 75.3,
    avgOrderValue: 580000,
  },
}) {
  const {
    impressions,
    clicks,
    conversations,
    orders,
    matchedOrders,
    untrackedOrders,
    phoneCollectedRate,
    matchedRate,
    avgOrderValue,
  } = data;

  // Conversion rates between steps
  const cvrI2C = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const cvrC2Co = clicks > 0 ? ((conversations / clicks) * 100).toFixed(1) : '0.0';
  const cvrCo2O = conversations > 0 ? ((orders / conversations) * 100).toFixed(1) : '0.0';
  const phoneCollected = Math.round(conversations * (phoneCollectedRate / 100));

  const formatCount = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return String(n);
  };

  const formatCurrency = (n) => {
    if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`;
    if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return `${n}`;
  };

  const maxCount = impressions;
  const steps = [
    {
      label: 'Impressions',
      shortLabel: 'Impression',
      count: impressions,
      pct: impressions > 0 ? 100 : 0,
      color: '#1A2138',
      cvrAfter: `${cvrI2C}%`,
      cvrAfterColor: '#0052FF',
    },
    {
      label: 'Clicks',
      shortLabel: 'Click',
      count: clicks,
      pct: impressions > 0 ? Math.max(2, (clicks / impressions) * 100) : 0,
      color: '#0052FF',
      cvrAfter: `${cvrC2Co}%`,
      cvrAfterColor: '#7C3AED',
    },
    {
      label: 'Hội thoại',
      shortLabel: 'Conv',
      count: conversations,
      pct: impressions > 0 ? Math.max(2, (conversations / impressions) * 100) : 0,
      color: '#7C3AED',
      cvrAfter: `${cvrCo2O}%`,
      cvrAfterColor: '#059669',
    },
    {
      label: 'Đơn hàng',
      shortLabel: 'Order',
      count: orders,
      pct: impressions > 0 ? Math.max(2, (orders / impressions) * 100) : 0,
      color: '#059669',
      cvrAfter: null,
      cvrAfterColor: null,
    },
  ];

  const totalUntrackedRevenue = untrackedOrders * avgOrderValue;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(26,33,56,0.08)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"
                stroke="#1A2138" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-title-sm font-semibold text-on-surface">Phễu Attribution</span>
        </div>
        <span className="text-label-xs text-on-surface-variant">
          {matchedRate}% matched
        </span>
      </div>

      {/* ── Main card ── */}
      <div className="bg-surface-container-low rounded-xl p-6">
        {/* 4-segment horizontal funnel bar */}
        <div className="mb-5">
          <div className="flex items-stretch rounded-full overflow-hidden gap-0" style={{ height: 56 }}>
            {steps.map((step, i) => (
              <div key={step.label} className="relative flex flex-col justify-center" style={{ width: `${step.pct}%` }}>
                <div
                  className="absolute inset-0 flex items-center justify-center gap-1"
                  style={{ background: step.color }}
                >
                  {step.pct > 6 && (
                    <span className="text-label-xs font-bold text-white/90 whitespace-nowrap overflow-hidden text-ellipsis px-2">
                      {formatCount(step.count)}
                    </span>
                  )}
                  {step.pct <= 6 && step.pct > 3 && (
                    <span className="text-[10px] font-bold text-white/90 whitespace-nowrap">
                      {formatCount(step.count)}
                    </span>
                  )}
                </div>
                {/* Right arrow connector */}
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-0 h-0"
                    style={{
                      borderTop: '7px solid transparent',
                      borderBottom: '7px solid transparent',
                      borderLeft: `7px solid ${steps[i + 1]?.color || '#fff'}`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Labels below funnel — fixed 4 columns to avoid overlap */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center text-center min-w-0">
                <div className="text-label-xs font-bold text-on-surface truncate w-full">{step.shortLabel}</div>
                <div className="text-[10px] text-on-surface-variant mt-0.5">{formatCount(step.count)}</div>

                {/* CVR badge after each segment */}
                {step.cvrAfter && (
                  <div className="mt-1.5 bg-surface-container-low rounded-full px-2 py-0.5 shadow-sm"
                    style={{ fontSize: '9px', color: step.cvrAfterColor, fontWeight: 700 }}>
                    ↓{step.cvrAfter}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Summary row ── */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            {/* SĐT thu thập */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-xs font-semibold"
              style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72"/>
              </svg>
              SĐT thu thập: {formatCount(phoneCollected)}/{formatCount(conversations)} ({phoneCollectedRate.toFixed(1)}%)
            </div>

            {/* Matched orders */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-xs font-semibold"
              style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Matched: {formatCount(matchedOrders)}/{formatCount(orders)} ({matchedRate.toFixed(1)}%)
            </div>

            {/* Untracked orders */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-xs font-semibold"
              style={{ background: 'rgba(191,48,3,0.06)', color: '#BF3003' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              Untracked: {formatCount(untrackedOrders)}
            </div>
          </div>

          {/* Chi phí Ảo callout */}
          {totalUntrackedRevenue > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg"
              style={{ background: 'rgba(191,48,3,0.06)', border: '1px solid rgba(191,48,3,0.15)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#BF3003" strokeWidth="1.8"/>
                <path d="M12 8v4M12 16h.01" stroke="#BF3003" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <div className="text-label-xs font-bold" style={{ color: '#BF3003' }}>Chi phí Ảo — Doanh thu không được ghi nhận</div>
                <div className="text-[10px] text-on-surface-variant mt-0.5">
                  {formatCount(untrackedOrders)} đơn × {formatCurrency(avgOrderValue)}đ = <span className="font-bold" style={{ color: '#BF3003' }}>{formatCurrency(totalUntrackedRevenue)}đ</span> chưa được gắn nguồn ads
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

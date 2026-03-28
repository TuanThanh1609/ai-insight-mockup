import { useState } from 'react';
import { getAdsHealthLabel, getAdsHealthColor } from '../../lib/adsMedicalService';

/**
 * AdsHealthScoreHeader — "Hồ Sơ Bệnh Án Ads" style header
 * Left: Score SIÊU TO + progress bar + severity label
 * Right: Mini 4-segment funnel (Impressions → Clicks → Conv → Orders)
 * Top bar: Delta badge + Date range chips + Campaign count badge
 */
export function AdsHealthScoreHeader({
  healthScore = 5.8,
  delta = null,
  dateRange = { start: '07/03', end: '28/03/2026' },
  campaignCount = 3,
  attributionMetrics = {
    impressions: 1245000,
    clicks: 18420,
    conversations: 368,
    orders: 89,
    phoneCollected: 89,
    matchedOrders: 67,
    untrackedOrders: 22,
    avgOrderValue: 580000,
  },
  onDateRangeChange,
}) {
  const label = getAdsHealthLabel(healthScore);
  const color = getAdsHealthColor(healthScore);
  const progressPct = Math.round((healthScore / 10) * 100);

  const [selectedRange, setSelectedRange] = useState('30');

  const ranges = [
    { value: '7', label: '7 ngày' },
    { value: '30', label: '30 ngày' },
    { value: '90', label: '90 ngày' },
  ];

  // ── Funnel data ──────────────────────────────────────────────────────────
  const { impressions, clicks, conversations, orders } = attributionMetrics;
  const steps = [
    { label: 'Impressions', count: impressions, color: 'var(--color-primary)' },
    { label: 'Clicks',      count: clicks,      color: 'var(--color-tertiary)' },
    { label: 'Hội thoại',  count: conversations, color: '#7C3AED' },
    { label: 'Đơn hàng',   count: orders,       color: '#059669' },
  ];

  // Normalize funnel widths to max = 100%
  const maxCount = impressions;
  const funnelPcts = steps.map(s => maxCount > 0 ? Math.max(4, (s.count / maxCount) * 100) : 0);

  // Conversion rates between steps
  const cvrImpressionsToClicks = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const cvrClicksToConv = clicks > 0 ? ((conversations / clicks) * 100).toFixed(1) : '0.0';
  const cvrConvToOrders = conversations > 0 ? ((orders / conversations) * 100).toFixed(1) : '0.0';

  const formatCount = (n) => {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return String(n);
  };

  const getBadgeStyle = () => {
    if (healthScore <= 3) return { bg: 'rgba(191,48,3,0.08)', color: '#BF3003', border: 'rgba(191,48,3,0.2)' };
    if (healthScore <= 5) return { bg: 'rgba(217,119,6,0.08)', color: '#d97706', border: 'rgba(217,119,6,0.2)' };
    if (healthScore <= 7) return { bg: 'rgba(0,82,255,0.08)', color: '#0052FF', border: 'rgba(0,82,255,0.2)' };
    return { bg: 'rgba(5,150,105,0.08)', color: '#059669', border: 'rgba(5,150,105,0.2)' };
  };
  const bs = getBadgeStyle();

  const handleRangeChange = (val) => {
    setSelectedRange(val);
    if (onDateRangeChange) onDateRangeChange(val);
  };

  return (
    <div>
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"
                stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6.5" cy="6.5" r="1.5" fill={color}/>
              <circle cx="17.5" cy="6.5" r="1.5" fill={color}/>
              <circle cx="17.5" cy="17.5" r="1.5" fill={color}/>
              <circle cx="6.5" cy="17.5" r="1.5" fill={color}/>
            </svg>
          </div>
          <span className="text-title-md font-semibold text-on-surface">Hồ Sơ Bệnh Án Ads</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Delta badge */}
          {delta !== null && (
            <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-label-sm font-bold ${
              delta >= 0
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-red-50 text-red-500'
            }`}>
              {delta >= 0 ? (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 4l8 16H4z"/>
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 20L4 4h16z"/>
                </svg>
              )}
              {delta >= 0 ? '+' : ''}{delta}
            </div>
          )}

          {/* Date range chips */}
          <div className="flex items-center bg-surface-container-low rounded-full p-1 gap-0.5">
            {ranges.map(r => (
              <button
                key={r.value}
                onClick={() => handleRangeChange(r.value)}
                className={`px-3 py-1 rounded-full text-label-xs font-semibold transition-all ${
                  selectedRange === r.value
                    ? 'text-on-primary bg-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Date range display */}
          <span className="text-label-xs text-on-surface-variant">
            {dateRange.start} – {dateRange.end}
          </span>

          {/* Campaign count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            <span className="text-label-xs font-bold">{campaignCount} chiến dịch</span>
          </div>
        </div>
      </div>

      {/* ── Main card ── */}
      <div className="bg-surface-container-low rounded-[--radius-xl] overflow-hidden">
        <div className="flex flex-col lg:flex-row">

          {/* LEFT: Big Score */}
          <div className="flex flex-col justify-between p-8 lg:w-56 lg:border-r"
            style={{ borderColor: 'var(--color-outline-variant)' }}>
            <div>
              <div className="text-[4.5rem] font-bold leading-none" style={{ color, fontFamily: 'var(--font-display)' }}>
                {healthScore.toFixed(1)}
              </div>
              <div className="text-title-lg text-on-surface-variant font-normal mt-1">/ 10 ĐIỂM</div>
            </div>

            <div className="mt-6">
              <div className="h-5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${color}CC, ${color})` }}
                />
              </div>
            </div>

            <div
              className="mt-4 text-center px-4 py-2 rounded-full text-label-md font-bold"
              style={{ backgroundColor: bs.bg, color: bs.color, border: `1px solid ${bs.border}` }}
            >
              {label}
            </div>
          </div>

          {/* RIGHT: Mini Funnel */}
          <div className="flex-1 p-8 flex flex-col justify-center gap-6">
            <div className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide">
              Phễu Chuyển Đổi
            </div>

            {/* Funnel bar */}
            <div>
              <div className="flex items-stretch rounded-full overflow-hidden gap-0" style={{ height: 52 }}>
                {steps.map((step, i) => (
                  <div key={step.label} className="relative flex flex-col justify-center" style={{ width: `${funnelPcts[i]}%` }}>
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: step.color, opacity: 0.9 }}
                    >
                      {i < steps.length - 1 && funnelPcts[i] > 8 && (
                        <span className="text-label-xs font-bold text-white/90 whitespace-nowrap overflow-hidden text-ellipsis px-2">
                          {formatCount(step.count)}
                        </span>
                      )}
                    </div>
                    {/* Right connector arrow */}
                    {i < steps.length - 1 && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-0 h-0"
                        style={{
                          borderTop: '8px solid transparent',
                          borderBottom: '8px solid transparent',
                          borderLeft: `8px solid ${steps[i + 1]?.color || '#fff'}`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Labels + CVR below funnel */}
              <div className="flex items-start mt-3 relative">
                {steps.map((step, i) => (
                  <div key={step.label} className="relative">
                    <div style={{ width: `${funnelPcts[i]}%` }} className="flex flex-col items-center">
                      <div className="text-label-xs font-semibold text-on-surface">{step.label}</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">{formatCount(step.count)}</div>
                    </div>
                    {/* CVR badge between segments */}
                    {i === 0 && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-low rounded-full px-1.5 py-0.5 shadow-sm"
                        style={{ fontSize: '9px', color: 'var(--color-tertiary)', fontWeight: 700 }}>
                        {cvrImpressionsToClicks}%
                      </div>
                    )}
                    {i === 1 && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-low rounded-full px-1.5 py-0.5 shadow-sm"
                        style={{ fontSize: '9px', color: '#7C3AED', fontWeight: 700 }}>
                        {cvrClicksToConv}%
                      </div>
                    )}
                    {i === 2 && (
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-low rounded-full px-1.5 py-0.5 shadow-sm"
                        style={{ fontSize: '9px', color: '#059669', fontWeight: 700 }}>
                        {cvrConvToOrders}%
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary chips */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-xs font-semibold"
                style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72"/>
                </svg>
                SĐT: {formatCount(attributionMetrics.phoneCollected)}/{formatCount(attributionMetrics.conversations)}
                ({attributionMetrics.conversations > 0 ? ((attributionMetrics.phoneCollected / attributionMetrics.conversations) * 100).toFixed(0) : 0}%)
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-xs font-semibold"
                style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Matched: {formatCount(attributionMetrics.matchedOrders)}/{formatCount(attributionMetrics.orders)}
                ({attributionMetrics.orders > 0 ? ((attributionMetrics.matchedOrders / attributionMetrics.orders) * 100).toFixed(0) : 0}%)
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-xs font-semibold"
                style={{ background: 'rgba(191,48,3,0.06)', color: '#BF3003' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
                Untracked: {formatCount(attributionMetrics.untrackedOrders)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

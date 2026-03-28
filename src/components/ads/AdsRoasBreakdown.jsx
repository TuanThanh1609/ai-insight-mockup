/**
 * AdsRoasBreakdown — ROAS Gốc vs Thực per campaign
 *
 * Per campaign row:
 *   - Campaign name + platform badge (FB/ZA)
 *   - ROAS original bar (Deep Navy) + number
 *   - ROAS actual bar (emerald ≥1.5x / red <1.5x) + number
 *   - Gap % with warning icon if negative
 *   - Matched/Untracked breakdown
 *   - AI Action badge
 *   - Revenue + untracked revenue
 *   - "Xem chi tiết orders →" + "Gợi ý Smax →" links
 */
export function AdsRoasBreakdown({
  campaigns = [
    {
      id: 'camp-1',
      name: 'KPI Spring Sale 2026',
      platform: 'facebook',
      roasOriginal: 4.0,
      roasActual: 3.2,
      gapPercent: -20,
      orders: 164,
      matchedOrders: 131,
      untrackedOrders: 33,
      revenue: 65600000,
      untrackedRevenue: 13200000,
      aiAction: 'keep',
      status: 'active',
    },
    {
      id: 'camp-2',
      name: 'Retargeting Q1 2026',
      platform: 'zalo',
      roasOriginal: 2.8,
      roasActual: 1.9,
      gapPercent: -32,
      orders: 89,
      matchedOrders: 60,
      untrackedOrders: 29,
      revenue: 34200000,
      untrackedRevenue: 10944000,
      aiAction: 'increase',
      status: 'active',
    },
    {
      id: 'camp-3',
      name: 'Brand Awareness Q1',
      platform: 'facebook',
      roasOriginal: 1.2,
      roasActual: 0.9,
      gapPercent: -25,
      orders: 41,
      matchedOrders: 31,
      untrackedOrders: 10,
      revenue: 12300000,
      untrackedRevenue: 3075000,
      aiAction: 'decrease',
      status: 'active',
    },
  ],
}) {
  const formatCurrency = (n) => {
    if (n >= 1000000000) return `${(n / 1000000000).toFixed(1)}B`;
    if (n >= 1000000) return `${(n / 1000000).toFixed(0)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return `${n}`;
  };

  const getPlatformBadge = (platform) => {
    if (platform === 'facebook') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: 'rgba(24,119,242,0.1)', color: '#1877F2' }}>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          FB
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
        style={{ background: 'rgba(0,0,0,0.06)', color: '#1A2138' }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="12"/>
        </svg>
        ZA
      </span>
    );
  };

  const getAiActionBadge = (action) => {
    switch (action) {
      case 'increase':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
            Scale Up
          </span>
        );
      case 'decrease':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(220,38,38,0.08)', color: '#dc2626' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            </svg>
            Needs Review
          </span>
        );
      case 'keep':
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(5,150,105,0.08)', color: '#059669' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Recommended
          </span>
        );
      case 'pause':
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold"
            style={{ background: 'rgba(191,48,3,0.08)', color: '#BF3003' }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="6" y="4" width="4" height="16"/>
              <rect x="14" y="4" width="4" height="16"/>
            </svg>
            Pause
          </span>
        );
    }
  };

  const getRoasBarColor = (roas) => {
    if (roas >= 3) return '#059669';
    if (roas >= 1.5) return '#d97706';
    return '#dc2626';
  };

  const getStatusDot = (status) => {
    if (status === 'active') {
      return <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block ml-2"/>;
    }
    return <span className="w-1.5 h-1.5 rounded-full bg-gray-400 inline-block ml-2"/>;
  };

  const maxRoas = Math.max(...campaigns.map(c => c.roasOriginal));

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(5,150,105,0.08)' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M18 20V10M12 20V4M6 20v-6"
                stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-title-sm font-semibold text-on-surface">ROAS Thực vs Gốc</span>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1.5 rounded-full" style={{ background: '#1A2138' }}/>
            ROAS Gốc
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1.5 rounded-full" style={{ background: '#059669' }}/>
            ROAS Thực
          </div>
        </div>
      </div>

      {/* ── Campaign cards ── */}
      <div className="flex flex-col gap-3">
        {campaigns.map((camp) => {
          const roasBarW = maxRoas > 0 ? Math.min(100, (camp.roasOriginal / maxRoas) * 100) : 0;
          const roasActualBarW = maxRoas > 0 ? Math.min(100, (camp.roasActual / maxRoas) * 100) : 0;
          const actualColor = getRoasBarColor(camp.roasActual);
          const gapIsNegative = camp.gapPercent < 0;
          const matchedRate = camp.orders > 0 ? Math.round((camp.matchedOrders / camp.orders) * 100) : 0;

          return (
            <div key={camp.id}
              className="bg-surface-container-low rounded-[--radius-xl] p-5 transition-all hover:bg-surface-container hover:shadow-md">

              {/* Row 1: Name + Platform + Status + AI Action */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 min-w-0">
                  {getPlatformBadge(camp.platform)}
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-body-sm font-semibold text-on-surface truncate">{camp.name}</span>
                      {getStatusDot(camp.status)}
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-0.5">
                      {camp.orders} đơn · Matched {matchedRate}%
                    </div>
                  </div>
                </div>
                <div className="shrink-0">
                  {getAiActionBadge(camp.aiAction)}
                </div>
              </div>

              {/* Row 2: ROAS bars */}
              <div className="flex flex-col gap-2.5 mb-4">
                {/* ROAS Original */}
                <div className="flex items-center gap-3">
                  <div className="w-20 shrink-0 text-[11px] text-on-surface-variant font-medium">ROAS Gốc</div>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${roasBarW}%`, background: '#1A2138' }}
                    >
                      {roasBarW > 15 && (
                        <span className="text-[10px] font-bold text-white/90">{camp.roasOriginal.toFixed(1)}x</span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 text-right text-[11px] font-bold text-on-surface shrink-0">
                    {camp.roasOriginal.toFixed(1)}x
                  </div>
                </div>

                {/* ROAS Actual */}
                <div className="flex items-center gap-3">
                  <div className="w-20 shrink-0 text-[11px] text-on-surface-variant font-medium">ROAS Thực</div>
                  <div className="flex-1 h-5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                      style={{ width: `${roasActualBarW}%`, background: actualColor }}
                    >
                      {roasActualBarW > 15 && (
                        <span className="text-[10px] font-bold text-white/90">{camp.roasActual.toFixed(1)}x</span>
                      )}
                    </div>
                  </div>
                  <div className="w-10 text-right text-[11px] font-bold shrink-0" style={{ color: actualColor }}>
                    {camp.roasActual.toFixed(1)}x
                  </div>
                </div>
              </div>

              {/* Row 3: Gap + Matched/Untracked breakdown */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                {/* Gap */}
                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  gapIsNegative ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-600'
                }`}>
                  {gapIsNegative ? (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 20L4 4h16z"/>
                    </svg>
                  ) : (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4l8 16H4z"/>
                    </svg>
                  )}
                  Gap: {camp.gapPercent > 0 ? '+' : ''}{camp.gapPercent}%
                </div>

                {/* Matched */}
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Matched <span className="font-bold text-on-surface">{camp.matchedOrders}</span>
                </div>

                {/* Untracked */}
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#BF3003" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8v4M12 16h.01"/>
                  </svg>
                  Untracked <span className="font-bold text-[#BF3003]">{camp.untrackedOrders}</span>
                </div>

                {/* Revenue */}
                <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant ml-auto">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
                  </svg>
                  {formatCurrency(camp.revenue)}đ
                  {camp.untrackedRevenue > 0 && (
                    <span className="text-[#BF3003]">(+{formatCurrency(camp.untrackedRevenue)}đ untracked)</span>
                  )}
                </div>
              </div>

              {/* Row 4: Action links */}
              <div className="flex items-center gap-4 pt-3 border-t"
                style={{ borderColor: 'var(--color-outline-variant)', borderTopWidth: 1, borderTopStyle: 'solid' }}>
                <button
                  className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors"
                  style={{ color: 'var(--color-tertiary)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                    <rect x="9" y="3" width="6" height="4" rx="1"/>
                  </svg>
                  Xem chi tiết orders
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
                <button
                  className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer transition-colors"
                  style={{ color: '#BF3003' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  Gợi ý Smax
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

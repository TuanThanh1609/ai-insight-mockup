import { getLeadsKPIWithTrend } from '../../lib/medicalService';

/** Sparkline SVG — 7 dots with area fill */
function Sparkline({ data, color }) {
  if (!data || data.length < 2) {
    data = [4, 6, 5, 7, 6, 8, 7];
  }
  const w = 80, h = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const poly = pts.join(' ');
  const last = pts[pts.length - 1].split(',');
  const gradId = `sg-${color.replace('#','')}-${Math.random().toString(36).slice(2,6)}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${poly} ${w},${h}`} fill={`url(#${gradId})`} />
      <polyline points={poly} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2.5" fill={color} />
    </svg>
  );
}

/** Trend arrow + text */
function TrendBadge({ delta, suffix = '%' }) {
  if (delta === undefined || delta === null) return null;
  return (
    <span className={`text-label-xs font-semibold ${delta > 0 ? 'text-success' : delta < 0 ? 'text-error' : 'text-on-surface-variant'}`}>
      {delta > 0 ? '↑' : delta < 0 ? '↓' : ''}{Math.abs(delta)}{suffix}
    </span>
  );
}

/**
 * LeadsQualityDashboard — Ultra Soft Identity
 * 4 compact cards with gradient fill + hover lift
 */
export function LeadsQualityDashboard({ conversations, totalCount }) {
  const kpis = getLeadsKPIWithTrend(conversations);
  const kpiMap = {};
  for (const k of kpis) kpiMap[k.key] = k;

  const cards = [
    {
      id: 'phone-collected',
      title: 'Tỉ Lệ Thu Thập SĐT',
      value: kpiMap['phoneCollectionRate']?.value ?? 0,
      unit: '%',
      delta: kpiMap['phoneCollectionRate']?.delta ?? 0,
      sparkData: kpiMap['phoneCollectionRate']?.sparkline ?? [55, 60, 58, 65, 62, 68, 68],
      iconColor: '#d97706',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'conversion-rate',
      title: 'Tỉ Lệ Chốt Đơn',
      value: kpiMap['conversionRate']?.value ?? 0,
      unit: '%',
      delta: kpiMap['conversionRate']?.delta ?? 0,
      sparkData: kpiMap['conversionRate']?.sparkline ?? [20, 22, 25, 21, 24, 23, 23],
      iconColor: '#059669',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="17 6 23 6 23 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'returning-customer',
      title: 'Tỉ Lệ Khách Cũ Quay Lại',
      value: kpiMap['returningCustomerRate']?.value ?? 0,
      unit: '%',
      delta: kpiMap['returningCustomerRate']?.delta ?? 0,
      sparkData: kpiMap['returningCustomerRate']?.sparkline ?? [8, 10, 9, 11, 12, 12, 12],
      iconColor: '#0052FF',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 110 8 4 4 0 010-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21v-2a4 4 0 014-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    {
      id: 'junk-lead',
      title: 'Tỉ Lệ Leads Rác',
      value: kpiMap['junkLeadPercent']?.value ?? 0,
      unit: '%',
      delta: kpiMap['junkLeadPercent']?.delta ?? 0,
      sparkData: kpiMap['junkLeadPercent']?.sparkline ?? [10, 12, 14, 16, 18, 18, 18],
      iconColor: '#dc2626',
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];

  return (
    <div>
      {/* Section label */}
      <div className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-3 px-1">
        Chỉ Số Quan Trọng
      </div>

      {/* 4 cards in a row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(card => (
          <div
            key={card.id}
            className="bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] rounded-lg p-4 flex flex-col gap-3 shadow-[--shadow-sm] hover-lift"
          >
            {/* Title */}
            <div className="flex items-center gap-1.5">
              <div style={{ color: card.iconColor }}>{card.icon}</div>
              <span className="text-label-xs font-bold text-on-surface-variant uppercase tracking-wide leading-tight">
                {card.title}
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1.5">
              <span
                className="text-headline-md font-bold leading-none"
                style={{ color: card.iconColor }}
              >
                {card.value}
              </span>
              <span className="text-body-sm text-on-surface-variant">{card.unit}</span>
            </div>

            {/* Sparkline */}
            <div>
              <Sparkline data={card.sparkData} color={card.iconColor} />
            </div>

            {/* Trend */}
            <div className="flex items-center gap-1">
              <TrendBadge delta={card.delta} />
              <span className="text-label-xs text-on-surface-variant">hôm nay</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

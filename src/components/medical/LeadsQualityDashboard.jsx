import { getLeadsKPIWithTrend } from '../../lib/medicalService';
import { cn } from '../../lib/utils';

/** Mini sparkline SVG — 7 dots connected by line */
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const w = 64;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const polyline = pts.join(' ');
  const lastPt = pts[pts.length - 1].split(',');

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      {/* Gradient fill area */}
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${h} ${polyline} ${w},${h}`}
        fill={`url(#sg-${color.replace('#','')})`}
      />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Last dot */}
      <circle cx={lastPt[0]} cy={lastPt[1]} r="2.5" fill={color} />
    </svg>
  );
}

/** Alert icon badge */
function AlertIcon({ level }) {
  if (level === 'green') {
    return (
      <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
    );
  }
  if (level === 'yellow') {
    return (
      <div className="w-6 h-6 rounded-full bg-warning/10 flex items-center justify-center">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
      </div>
    );
  }
  return (
    <div className="w-6 h-6 rounded-full bg-error/10 flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    </div>
  );
}

/** Delta badge: ↑ green or ↓ red */
function DeltaBadge({ delta, higherIsBetter }) {
  if (delta === 0) return null;
  const isGood = higherIsBetter ? delta > 0 : delta < 0;
  const color = isGood ? '#059669' : '#dc2626';
  const arrow = delta > 0 ? '↑' : '↓';
  return (
    <span className="text-label-sm font-semibold" style={{ color }}>
      {arrow}{Math.abs(delta)}%
    </span>
  );
}

export function LeadsQualityDashboard({ conversations, totalCount }) {
  const kpis = getLeadsKPIWithTrend(conversations);

  return (
    <div className="bg-surface-container-low rounded-[--radius-lg] overflow-hidden">
      {/* Section header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-2xl">📊</span>
          <h2 className="text-title-lg font-semibold text-on-surface">Chất Lượng Leads</h2>
        </div>
        <p className="text-body-sm text-on-surface-variant ml-1">
          Tổng quan nguồn khách hàng của bạn — đo lường hiệu quả từ Ads → Chốt đơn
        </p>
      </div>

      {/* Table */}
      <div className="px-3 pb-3">
        <div className="rounded-[--radius-md] overflow-hidden border border-[var(--color-outline-variant)]">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-0 bg-surface-container-low px-4 py-2.5 text-label-sm text-on-surface-variant uppercase tracking-wide">
            <div className="col-span-3">Chỉ số</div>
            <div className="col-span-2 text-center">Giá trị</div>
            <div className="col-span-5 text-center">Trend 7 ngày</div>
            <div className="col-span-2 text-center">Cảnh báo</div>
          </div>

          {/* KPI rows */}
          {kpis.map((kpi) => (
            <div
              key={kpi.key}
              className={cn(
                'grid grid-cols-12 gap-0 px-4 py-3.5 transition-colors',
                'border-t border-[var(--color-outline-variant)]',
                'hover:bg-[var(--color-surface-container-high)]',
              )}
            >
              {/* Metric name + description */}
              <div className="col-span-3 flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: kpi.color }}
                  />
                  <span className="text-body-md font-medium text-on-surface">
                    {kpi.label}
                  </span>
                </div>
                <span className="text-body-xs text-on-surface-variant ml-4 leading-relaxed">
                  {kpi.description}
                </span>
              </div>

              {/* Value */}
              <div className="col-span-2 flex flex-col items-center justify-center gap-0.5">
                <div className="flex items-baseline gap-1">
                  <span
                    className="text-headline-md font-bold"
                    style={{ color: kpi.color }}
                  >
                    {kpi.value}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">{kpi.unit}</span>
                </div>
              </div>

              {/* Trend sparkline */}
              <div className="col-span-5 flex items-center gap-3 pl-3">
                <Sparkline data={kpi.sparkline} color={kpi.color} />
                <div className="flex flex-col gap-0.5 min-w-0">
                  <DeltaBadge delta={kpi.delta} higherIsBetter={kpi.higherIsBetter} />
                  <span className="text-label-xs text-on-surface-variant/70 whitespace-nowrap">
                    vs 7 ngày trước
                  </span>
                </div>
              </div>

              {/* Alert icon */}
              <div className="col-span-2 flex items-center justify-center">
                <AlertIcon level={kpi.level} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-4 pt-0.5">
        <p className="text-body-xs text-on-surface-variant/60">
          ⚠️ Chỉ số được tính từ{' '}
          <strong>{totalCount > 0 ? totalCount.toLocaleString('vi') : conversations.length.toLocaleString('vi')}</strong>{' '}
          hội thoại đã phân tích
        </p>
      </div>
    </div>
  );
}

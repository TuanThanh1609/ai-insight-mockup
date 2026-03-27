import { useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { ConversationList } from './ConversationList';
import { getKpiAlertLevel } from '../../lib/medicalService';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

/** Helper: get severity/neutral color for a metric */
function getMetricAlertColor(key, value) {
  const level = getKpiAlertLevel(key, value);
  if (level === 'red')    return '#dc2626';
  if (level === 'yellow') return '#d97706';
  return '#059669';
}

function getMetricAlertBg(key, value) {
  const level = getKpiAlertLevel(key, value);
  if (level === 'red')    return 'rgba(220,38,38,0.06)';
  if (level === 'yellow') return 'rgba(217,119,6,0.06)';
  return 'rgba(5,150,105,0.06)';
}

/** Highlighted metric row — for the "Những chỉ số cần chú ý" section */
function HighlightedMetric({ metric, diseaseId }) {
  const color = getMetricAlertColor(metric.key, metric.value);
  const bg = getMetricAlertBg(metric.key, metric.value);
  const isRed = color === '#dc2626';
  const isYellow = color === '#d97706';
  const levelLabel = isRed ? 'nguy hiểm' : isYellow ? 'cần theo dõi' : 'tốt';

  const descriptions = {
    junkLeadPercent: 'Junk Lead = khách không có intent mua thật. Click ads nhầm hoặc spam tự động.',
    phoneCollected: 'KH chưa tin tưởng để để lại SĐT ngay. Cần cải thiện CTA và uy tín.',
    conversionRate: 'Tỉ lệ hội thoại chốt được đơn thấp. Cần cải thiện kịch bản tư vấn.',
    returningCustomerRate: 'Tỉ lệ khách cũ quay lại thấp. Cần chương trình chăm sóc sau mua.',
    avgResponseMinutes: 'TB phản hồi chậm. Khách online có attention span rất ngắn.',
    remindRate: 'Tỉ lệ remind khách thấp. Bỏ qua khách không rep = mất lead.',
    personalOfferRate: 'Ít ưu đãi cá nhân hóa. Mỗi khách cần feel special.',
    goodAttitudePercent: 'Thái độ tốt thấp. Cần training và coaching cho nhân viên.',
    mistakeRate: 'Lỗi mất khách cao. Mỗi lỗi = 1 khách không quay lại.',
    competitorMentionRate: 'Khách hay nhắc đến đối thủ. Cần battle card và USP rõ ràng.',
    reviewRiskRate: 'Risk review cao. KH có thể để lại review xấu nếu không chăm sóc.',
    objectionRate: 'Objection cao. Nhân viên chưa xử lý tốt rào cản của khách.',
    ghostRate: 'Tỉ lệ khách "bốc hơi" cao. Không follow-up = mất khách.',
    upsellAttemptRate: 'Ít gợi ý sản phẩm bổ sung. Upsell là cách tăng AOV nhanh nhất.',
    ignoredRecRate: 'KH bỏ qua gợi ý nhiều. Script upsell chưa hấp dẫn.',
  };

  const desc = descriptions[metric.key] || `Metric này cần được cải thiện.`;

  return (
    <div
      className="rounded-[--radius-md] p-3 transition-all"
      style={{ backgroundColor: bg, borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-start gap-2">
        {/* Alert icon */}
        <div className="shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {/* Metric name + value */}
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-body-sm font-semibold text-on-surface">{metric.label}</span>
            <span className="text-headline-sm font-bold" style={{ color }}>
              {metric.format === 'percent' ? `${metric.value}%` : metric.format === 'minutes' ? `${metric.value}p` : metric.value}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${metric.format === 'percent' ? metric.value : Math.min(100, metric.value * 2)}%`,
                backgroundColor: color,
              }}
            />
          </div>

          {/* Description */}
          <p className="text-body-xs text-on-surface-variant leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function buildMetricTrendData(metrics, scoreSeed = 0) {
  const labels = ['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Hôm nay'];

  return labels.map((label, idx) => {
    const point = { label };

    metrics.forEach((m, mIdx) => {
      const volatility = m.format === 'percent' ? 8 : 4;
      const phase = (scoreSeed + mIdx * 2.17 + idx * 0.73);
      const wave = Math.sin(phase) * volatility;
      const trendBias = (idx - 6) * (m.format === 'percent' ? 0.5 : 0.25);
      const raw = m.value + wave + trendBias;
      const val = m.format === 'percent'
        ? Math.max(0, Math.min(100, raw))
        : Math.max(0, raw);
      point[m.key] = Number(val.toFixed(1));
    });

    return point;
  });
}

function formatTrendValue(metric, value) {
  if (metric.format === 'percent') return `${Math.round(value)}%`;
  if (metric.format === 'minutes') return `${Math.round(value)}p`;
  return `${Math.round(value)}`;
}

/** Trending chart replaces left-panel Smax suggestions */
function MetricTrendChart({ metrics, score }) {
  const data = useMemo(() => buildMetricTrendData(metrics, score * 1.37), [metrics, score]);

  const seriesColors = ['#0052FF', '#059669', '#BF3003', '#d97706', '#7c3aed'];

  return (
    <div className="bg-surface-container-low rounded-[--radius-md] p-4">
      <h4 className="text-label-sm text-on-surface-variant mb-2.5">XU HƯỚNG 7 NGÀY GẦN NHẤT</h4>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,27,29,0.08)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: 'rgba(28,27,29,0.12)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid rgba(28,27,29,0.12)',
                boxShadow: '0 6px 20px rgba(27,27,29,0.10)',
                fontSize: 12,
              }}
              formatter={(value, key) => {
                const metric = metrics.find(m => m.key === key);
                return [formatTrendValue(metric || { format: 'percent' }, Number(value)), metric?.label || key];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(key) => metrics.find(m => m.key === key)?.label || key}
            />

            {metrics.map((m, idx) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                stroke={seriesColors[idx % seriesColors.length]}
                strokeWidth={2}
                dot={{ r: 2 }}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/** Overview tab content */
function OverviewTab({ disease }) {
  const { id, severity, severityColor, score, metrics } = disease;

  // Identify which metrics need highlighting
  const criticalMetrics = metrics.filter(m => {
    const level = getKpiAlertLevel(m.key, m.value);
    return level === 'red' || level === 'yellow';
  });

  return (
    <div className="space-y-4">
      {/* Metric highlights — show critical metrics only */}
      {criticalMetrics.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={severityColor} strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h4 className="text-label-sm font-semibold text-on-surface uppercase tracking-wide">
              Những chỉ số cần chú ý
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {criticalMetrics.map(m => (
              <HighlightedMetric key={m.key} metric={m} diseaseId={id} />
            ))}
          </div>
        </div>
      )}

      {/* All metrics bar */}
      <div className="bg-surface-container-low rounded-[--radius-md] p-4">
        <h4 className="text-label-sm text-on-surface-variant mb-3">TẤT CẢ CHỈ SỐ</h4>
        <div className="flex flex-col gap-2.5">
          {metrics.map(m => {
            const color = getMetricAlertColor(m.key, m.value);
            return (
              <div key={m.key} className="flex items-center gap-3">
                <span className="text-body-sm text-on-surface-variant w-32 shrink-0">{m.label}</span>
                <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${m.format === 'percent' ? m.value : Math.min(100, m.value * 2)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span
                  className="text-body-sm font-semibold w-10 text-right shrink-0"
                  style={{ color }}
                >
                  {m.format === 'percent' ? `${m.value}%` : m.format === 'minutes' ? `${m.value}p` : m.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trending Chart (replaces duplicate Smax suggestions in left panel) */}
      <MetricTrendChart metrics={metrics} score={score} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export function DiseaseCard({ disease, conversations, isSaved, onToggleAction, onToggleExpand, isExpanded }) {
  const { id, code, label, icon, severity, severityColor, score, metrics, delta, exampleCount } = disease;
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div
      className={cn(
        'rounded-[--radius-lg] overflow-hidden transition-all duration-300',
        isExpanded ? 'bg-surface-container-low shadow-[--shadow-md]' : 'bg-surface-container-lowest hover:shadow-[--shadow-sm]',
        severity === 'NẶNG' && !isExpanded ? 'border-l-4' : ''
      )}
      style={severity === 'NẶNG' && !isExpanded ? { borderLeftColor: severityColor } : {}}
    >
      {/* ── Header (always visible) ── */}
      <button
        onClick={onToggleExpand}
        className="w-full px-5 py-4 flex items-start gap-4 text-left cursor-pointer"
      >
        {/* Severity icon */}
        <div
          className="w-10 h-10 rounded-[--radius-md] flex items-center justify-center text-xl shrink-0 mt-0.5"
          style={{ backgroundColor: `${severityColor}15` }}
        >
          {icon}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="text-title-sm text-on-surface font-bold leading-tight">{label}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ backgroundColor: `${severityColor}18`, color: severityColor }}
                >
                  {severity}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  Nhóm: <span className="font-semibold text-on-surface">{code}</span>
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="text-headline-md font-bold" style={{ color: severityColor }}>
                {score}
                <span className="text-body-sm font-normal text-on-surface-variant">/10</span>
              </div>
              {delta && (
                <div className={cn('flex items-center justify-end gap-0.5 mt-0.5', delta.direction === 'up' ? 'text-error' : 'text-success')}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    {delta.direction === 'up'
                      ? <path d="M12 4l8 8h-5v8h-6v-8H4z"/>
                      : <path d="M12 20l-8-8h5V4h6v8h5z"/>
                    }
                  </svg>
                  <span className="text-[10px] font-semibold">{delta.value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics row (collapsed only) */}
          {!isExpanded && (
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {metrics.slice(0, 3).map(m => {
                const color = getMetricAlertColor(m.key, m.value);
                return (
                  <div key={m.key} className="flex items-center gap-1.5">
                    <span className="text-body-sm font-semibold" style={{ color }}>
                      {m.format === 'percent' ? `${m.value}%` : m.format === 'minutes' ? `${m.value}p` : m.value}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">{m.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expand icon */}
        <div className={cn('shrink-0 mt-1 text-on-surface-variant transition-transform duration-200', isExpanded ? 'rotate-180' : '')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </button>

      {/* ── Expanded content ── */}
      {isExpanded && (
        <div className="px-5 pb-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4 bg-surface-container-low rounded-full p-1 w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                'px-4 py-1.5 rounded-full text-label-sm font-semibold transition-all cursor-pointer whitespace-nowrap',
                activeTab === 'overview'
                  ? 'bg-surface-container-lowest text-on-surface shadow-[--shadow-sm]'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              Tổng quan
            </button>
            <button
              onClick={() => setActiveTab('detail')}
              className={cn(
                'px-4 py-1.5 rounded-full text-label-sm font-semibold transition-all cursor-pointer whitespace-nowrap',
                activeTab === 'detail'
                  ? 'bg-surface-container-lowest text-on-surface shadow-[--shadow-sm]'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              Chi tiết {exampleCount > 0 && `(${exampleCount})`}
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <OverviewTab disease={disease} />
          )}
          {activeTab === 'detail' && conversations && (
            <ConversationList conversations={conversations} disease={disease} />
          )}

          {/* Collapse button */}
          <div className="flex justify-end mt-4 pt-2 border-t border-[var(--color-outline-variant)]/30">
            <button
              onClick={onToggleExpand}
              className="text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1"
            >
              Thu gọn
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Collapsed footer ── */}
      {!isExpanded && (
        <div className="px-5 pb-4 flex items-center justify-between">
          {disease.savedActionIds?.length > 0 && (
            <span className="text-label-sm text-success flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              {disease.savedActionIds.length} hành động đã lưu
            </span>
          )}
          <button
            onClick={onToggleExpand}
            className="text-label-sm text-tertiary hover:text-on-tertiary transition-colors cursor-pointer ml-auto"
          >
            Xem chi tiết →
          </button>
        </div>
      )}
    </div>
  );
}

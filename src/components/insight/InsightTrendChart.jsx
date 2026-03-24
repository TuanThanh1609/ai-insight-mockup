import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, FilterX } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockInsightTrend } from '../../data/mockInsightTrend';

// Palette — saturated, distinct colors
const PALETTE = [
  { stroke: '#0048e2', fill: '#0048e2' },
  { stroke: '#ef4444', fill: '#ef4444' },
  { stroke: '#10b981', fill: '#10b981' },
  { stroke: '#f59e0b', fill: '#f59e0b' },
  { stroke: '#8b5cf6', fill: '#8b5cf6' },
  { stroke: '#06b6d4', fill: '#06b6d4' },
];

const PERIODS = [
  { key: 'week',  label: 'Theo Tuần',  sub: '7 ngày' },
  { key: 'month', label: 'Theo Tháng', sub: '30 ngày' },
];

// Runtime default metrics (when no static mock data exists)
const RUNTIME_METRICS = [
  { key: 'Hội_thoại',   label: 'Hội thoại' },
  { key: 'Nóng (%)',    label: 'Nóng' },
  { key: 'Ấm (%)',     label: 'Ấm' },
  { key: 'Lạnh (%)',   label: 'Lạnh' },
];

function LegendDot({ color }) {
  return (
    <div
      className="w-3 h-0.5 rounded-full"
      style={{ background: color }}
    />
  );
}

/**
 * InsightTrendChart
 *
 * Supports two data formats:
 *  - Static (mockInsightTrend): { week: [], month: [], label, metrics }
 *    where each data point has keys: label, nong, am, lang, ...
 *  - Runtime (generateTrendData): [{ date, Hội_thoại, 'Nóng (%)', 'Ấm (%)', 'Lạnh (%)' }]
 *    label key = 'date'
 *
 * Props:
 *  - insightId: lookup key for static mockInsightTrend
 *  - trendData: runtime trend array (from getTrendData) — overrides static if present
 *  - conversations: rows for cross-filtering
 *  - crossFilter: active filter
 */
export function InsightTrendChart({ insightId, trendData, crossFilter, conversations }) {
  const [period, setPeriod] = useState('week');

  // ── Determine format and extract raw data ──────────────────────────────────
  const isStatic = (() => {
    if (trendData && trendData.length > 0) return false;
    const t = mockInsightTrend[insightId];
    return !!(t && (Array.isArray(t.week) || Array.isArray(t.month)));
  })();

  const staticTrend = isStatic ? (mockInsightTrend[insightId] || null) : null;
  const runtimeTrend = (trendData && trendData.length > 0) ? trendData : null;

  // For static: build metrics from staticTrend.metrics
  // For runtime: use RUNTIME_METRICS (detect which keys actually exist)
  const metrics = isStatic
    ? (staticTrend?.metrics || RUNTIME_METRICS)
    : (() => {
        if (!runtimeTrend || runtimeTrend.length === 0) return RUNTIME_METRICS;
        const keys = Object.keys(runtimeTrend[0]).filter(
          (k) => k !== 'date' && k !== 'label'
        );
        return keys.length > 0
          ? keys.map((key) => ({ key, label: key }))
          : RUNTIME_METRICS;
      })();

  const rawData = useMemo(() => {
    if (isStatic && staticTrend) {
      return period === 'week' ? staticTrend.week : staticTrend.month;
    }
    if (runtimeTrend) {
      return period === 'week' ? runtimeTrend.slice(-7) : runtimeTrend;
    }
    return [];
  }, [isStatic, staticTrend, runtimeTrend, period]);

  // label/dataKey: static uses 'label', runtime uses 'date'
  const labelKey = isStatic ? 'label' : 'date';

  // ── Cross-filter ────────────────────────────────────────────────────────────
  const data = useMemo(() => {
    if (!crossFilter || !conversations) return rawData;

    const rows = conversations.rows || [];
    const bucketCount = period === 'week' ? 7 : 30;
    const buckets = Array.from({ length: bucketCount }, () => []);

    rows.forEach((row) => {
      const ts = row.timestamp || row.date;
      if (!ts) return;
      const d = new Date(ts);
      const daysDiff = Math.floor((new Date('2026-03-23') - d) / 86400000);
      const bucketIdx = period === 'week'
        ? 6 - daysDiff
        : 29 - daysDiff;
      if (bucketIdx >= 0 && bucketIdx < bucketCount) {
        buckets[bucketIdx].push(row);
      }
    });

    const filtered = rawData.map((d, i) => {
      const bucket = buckets[i] || [];
      const scale = bucket.length === 0
        ? 0
        : bucket.filter((row) => {
            const fv = row[crossFilter.field];
            if (typeof crossFilter.value === 'boolean') return fv === crossFilter.value;
            return String(fv) === String(crossFilter.value);
          }).length / bucket.length;

      const entry = { ...d };
      metrics.forEach((m) => {
        entry[m.key] = Math.round((d[m.key] || 0) * scale);
      });
      return entry;
    });

    return filtered;
  }, [rawData, crossFilter, conversations, period, metrics]);

  // ── Y-axis ─────────────────────────────────────────────────────────────────
  const allValues = data.flatMap((d) => metrics.map((m) => d[m.key] || 0));
  const maxVal = allValues.length > 0 ? Math.max(...allValues) : 0;
  const yMax = Math.ceil(maxVal * 1.2 / 10) * 10 || 100;

  const metricsWithColor = metrics.map((m, i) => ({
    ...m,
    palette: PALETTE[i % PALETTE.length],
  }));

  const chartLabel = isStatic
    ? (staticTrend?.label || 'Xu hướng')
    : 'Xu hướng Hội thoại';

  if (rawData.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp size={13} className="text-primary" />
          <h3 className="font-display font-bold text-xs text-on-surface">{chartLabel}</h3>
        </div>
        <div className="flex items-center justify-center h-44 text-xs text-on-surface-variant">
          Chưa có dữ liệu xu hướng
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <TrendingUp size={13} className="text-primary" />
            <h3 className="font-display font-bold text-xs text-on-surface">{chartLabel}</h3>
          </div>
          <p className="text-[10px] text-on-surface-variant ml-5">
            Biến động theo thời gian
          </p>
        </div>

        {/* Period toggle */}
        <div className="flex items-center gap-2">
          {crossFilter && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/8 border border-primary/20">
              <span className="text-[10px] font-medium text-primary">
                Đang lọc: {crossFilter.label}
              </span>
              <button
                onClick={() => {}}
                className="text-primary hover:text-primary/70 transition-colors"
                title="Xóa lọc chart"
              >
                <FilterX size={11} />
              </button>
            </div>
          )}
          <div className="flex items-center bg-surface-container-low rounded-full p-0.5 gap-0.5 shrink-0">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`
                  flex flex-col items-center px-3 py-1 rounded-full transition-all duration-200
                  ${period === p.key
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                  }
                `}
              >
                <span className="text-[11px] font-semibold leading-tight">{p.label}</span>
                {period === p.key && (
                  <span className="text-[9px] opacity-70 leading-tight">{p.sub}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {metricsWithColor.map((m) => (
          <div key={m.key} className="flex items-center gap-2">
            <LegendDot color={m.palette.stroke} />
            <span className="text-[11px] font-medium text-on-surface">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div style={{ background: 'var(--color-surface-container-low)', borderRadius: 10, padding: '12px 8px 8px 0' }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(42,52,55,0.14)"
              vertical={false}
            />
            <XAxis
              dataKey={labelKey}
              tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter', fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              domain={[0, yMax]}
              tickCount={5}
              width={36}
            />
            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: '1px solid rgba(42,52,55,0.12)',
                borderRadius: 10,
                boxShadow: '0 4px 16px rgba(44,52,55,0.14)',
                fontFamily: 'Inter',
                fontSize: 12,
                padding: '8px 12px',
                minWidth: 120,
              }}
              itemStyle={{ fontWeight: 700, paddingBottom: 2 }}
              labelStyle={{ color: '#2c3437', marginBottom: 6, fontSize: 11, fontWeight: 600 }}
              cursor={{ stroke: 'rgba(42,52,55,0.15)', strokeWidth: 1, strokeDasharray: '4 4' }}
            />

            {metricsWithColor.map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.palette.stroke}
                strokeWidth={2.5}
                dot={{ r: 3, fill: m.palette.fill, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: m.palette.fill, strokeWidth: 0 }}
                connectNulls={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

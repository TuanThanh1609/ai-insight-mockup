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
import { TrendingUp, FilterX, ChevronDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockInsightTrend } from '../../data/mockInsightTrend';
import { detectCardConfig } from './DynamicMetricsGrid';
import { cn } from '../../lib/utils';

// Palette — vivid, high-contrast colors visible on light grid
const PALETTE = [
  { stroke: '#2563eb', fill: '#2563eb' },  // vivid blue
  { stroke: '#dc2626', fill: '#dc2626' },  // vivid red
  { stroke: '#16a34a', fill: '#16a34a' },  // vivid green
  { stroke: '#d97706', fill: '#d97706' },  // vivid amber
  { stroke: '#7c3aed', fill: '#7c3aed' },  // vivid purple
  { stroke: '#0891b2', fill: '#0891b2' },  // vivid cyan
];

const PERIODS = [
  { key: 'week',  label: 'Theo Tuần',  sub: '7 ngày' },
  { key: 'month', label: 'Theo Tháng', sub: '30 ngày' },
];

// Default metrics (when no conversations or no column-derived metrics)
const DEFAULT_METRICS = [
  { key: 'Hội_thoại',  label: 'Hội thoại' },
  { key: 'Nóng (%)',    label: 'Nóng' },
  { key: 'Ấm (%)',     label: 'Ấm' },
  { key: 'Lạnh (%)',   label: 'Lạnh' },
];

function LegendDot({ color }) {
  return (
    <div
      className="w-3 h-0.5 rounded-full shrink-0"
      style={{ background: color }}
    />
  );
}

// ─── Build metrics from conversations columns ───────────────────────────────

/**
 * Build line series configs from conversations.columns.
 * Each column that has a chart config → one or more series.
 * Temperature: 3 lines (Nóng / Ấm / Lạnh)
 * Others: 1 line (count per unique value, top-3, or boolean)
 */
function buildMetricsFromColumns(columns, rows) {
  if (!columns || columns.length === 0) return null; // signal "use default"

  const configs = columns
    .map((col) => detectCardConfig(col, rows))
    .filter(Boolean);

  if (configs.length === 0) return null;

  const series = [];

  configs.forEach((cfg, i) => {
    const color = PALETTE[i % PALETTE.length];

    if (cfg.type === 'temperature') {
      // 3 lines
      series.push({ key: `temp_nong_${cfg.field}`, label: `${cfg.label} — Nóng`, color, field: cfg.field, tempLevel: 'Nóng' });
      series.push({ key: `temp_am_${cfg.field}`,   label: `${cfg.label} — Ấm`,  color: PALETTE[(i + 2) % PALETTE.length], field: cfg.field, tempLevel: 'Ấm' });
      series.push({ key: `temp_lanh_${cfg.field}`, label: `${cfg.label} — Lạnh`, color: PALETTE[(i + 3) % PALETTE.length], field: cfg.field, tempLevel: 'Lạnh' });
    } else if (cfg.type === 'donut' || cfg.type === 'score-card') {
      // 2 lines: Có / Không or Đạt / Chưa
      series.push({ key: `val_true_${cfg.field}`,  label: `${cfg.label} — Đạt`,  color, field: cfg.field, isBoolean: true, targetVal: true });
      series.push({ key: `val_false_${cfg.field}`, label: `${cfg.label} — Chưa`, color: PALETTE[(i + 4) % PALETTE.length], field: cfg.field, isBoolean: true, targetVal: false });
    } else if (cfg.type === 'gauge') {
      // Top 3 values
      const counts = {};
      rows.forEach(r => {
        const v = String(r[cfg.field] || '').trim();
        if (v) counts[v] = (counts[v] || 0) + 1;
      });
      const topVals = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      topVals.forEach(([val], vi) => {
        series.push({
          key: `gauge_${vi}_${cfg.field}`,
          label: `${cfg.label} — ${val}`,
          color: PALETTE[(i + vi + 1) % PALETTE.length],
          field: cfg.field,
          targetVal: val,
        });
      });
    } else {
      // top-list / demographics: top 3 values
      const counts = {};
      rows.forEach(r => {
        const v = String(r[cfg.field] || '').trim();
        if (v) counts[v] = (counts[v] || 0) + 1;
      });
      const topVals = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
      topVals.forEach(([val], vi) => {
        series.push({
          key: `top_${vi}_${cfg.field}`,
          label: `${cfg.label} — ${val}`,
          color: PALETTE[(i + vi) % PALETTE.length],
          field: cfg.field,
          targetVal: val,
        });
      });
    }
  });

  return series;
}

// ─── Build time-series data ─────────────────────────────────────────────────

/**
 * Compute per-bucket counts for ALL active series at once.
 * Always called when columnSeries exist — both for "Mặc định" and for
 * a specific dropdown selection.
 */
function computeAllSeriesBuckets(rawData, period, rows, columnSeries) {
  if (!rows || rows.length === 0) return rawData;

  const bucketCount = period === 'week' ? 7 : 30;
  const baseDate = new Date('2026-03-23');

  // Build bucket labels
  const buckets = Array.from({ length: bucketCount }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - (bucketCount - 1 - i));
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    const entry = { label };
    columnSeries.forEach(s => { entry[s.key] = 0; });
    return entry;
  });

  // Count occurrences per bucket for each series
  rows.forEach(row => {
    const ts = row.timestamp || row.converted_at || row.date;
    if (!ts) return;
    const d = new Date(ts);
    const daysSinceBase = Math.floor((baseDate - d) / 86400000);
    const bucketIdx = period === 'week'
      ? 6 - daysSinceBase
      : 29 - daysSinceBase;

    if (bucketIdx < 0 || bucketIdx >= bucketCount) return;

    columnSeries.forEach(s => {
      const val = row[s.field];
      const strVal = String(val || '').trim();
      let matched = false;

      if (s.tempLevel) {
        const level = s.tempLevel;
        if (level === 'Nóng' && (strVal.includes('Nóng') || strVal.includes('Hot') ||
          strVal.includes('giá') || strVal.includes('mua') || strVal.includes('chốt'))) matched = true;
        if (level === 'Ấm' && (strVal.includes('Ấm') || strVal.includes('Warm') ||
          strVal.includes('tư vấn') || strVal.includes('hỏi thêm'))) matched = true;
        if (level === 'Lạnh' && (strVal.includes('Lạnh') || strVal.includes('Cold'))) matched = true;
      } else if (s.isBoolean !== undefined) {
        matched = s.targetVal
          ? !!(val === true || val === 'true' || val === 1 || val === 'Có' || val === 'Đã cho SĐT' || val === 'Có ý định')
          : !!(val === false || val === 'false' || val === 0 || val === 'Không' || strVal === '');
      } else if (s.targetVal !== undefined) {
        matched = strVal === s.targetVal;
      } else if (strVal) {
        matched = true;
      }

      if (matched) buckets[bucketIdx][s.key]++;
    });
  });

  return buckets.map(b => {
    const entry = { ...b };
    columnSeries.forEach(s => { entry[s.key] = Math.max(1, entry[s.key]); });
    return entry;
  });
}

// ── Component ──────────────────────────────────────────────────────────────────
export function InsightTrendChart({ insightId, trendData, crossFilter, conversations }) {
  const [period, setPeriod] = useState('week');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState(null); // null = default (all metrics)

  const columns = conversations?.columns || [];
  const rows    = conversations?.rows || [];

  // ── Determine static vs runtime ─────────────────────────────────────────
  const isStatic = (() => {
    if (trendData && trendData.length > 0) return false;
    const t = mockInsightTrend[insightId];
    return !!(t && (Array.isArray(t.week) || Array.isArray(t.month)));
  })();

  const staticTrend = isStatic ? (mockInsightTrend[insightId] || null) : null;
  const runtimeTrend = (trendData && trendData.length > 0) ? trendData : null;

  // ── Build series list ────────────────────────────────────────────────────
  const columnSeries = useMemo(
    () => buildMetricsFromColumns(columns, rows),
    [columns, rows]
  );

  // Default metrics (hardcoded / temperature defaults)
  const defaultMetrics = isStatic
    ? (staticTrend?.metrics || DEFAULT_METRICS)
    : (runtimeTrend && runtimeTrend.length > 0
        ? Object.keys(runtimeTrend[0])
            .filter(k => k !== 'date' && k !== 'label')
            .map(k => ({ key: k, label: k }))
        : DEFAULT_METRICS)
    ;

  // Build the "options" list for the dropdown
  const dropdownOptions = useMemo(() => {
    const opts = [];

    // Default group
    opts.push({ group: 'Mặc định', items: defaultMetrics.map((m, i) => ({
      key: m.key,
      label: m.label,
      color: PALETTE[i % PALETTE.length],
    })) });

    // Per-column group
    if (columnSeries && columnSeries.length > 0) {
      // Group by field (block name)
      const byField = {};
      columnSeries.forEach(s => {
        // label format: "Block Name — Sub-label"
        const base = s.label.replace(/ — .*$/, '');
        if (!byField[base]) byField[base] = [];
        byField[base].push(s);
      });
      Object.entries(byField).forEach(([block, items]) => {
        opts.push({ group: block, items });
      });
    }

    return opts;
  }, [defaultMetrics, columnSeries]);

  // ── Raw data ─────────────────────────────────────────────────────────────
  const rawData = useMemo(() => {
    if (isStatic && staticTrend) {
      return period === 'week' ? staticTrend.week : staticTrend.month;
    }
    if (runtimeTrend) {
      return period === 'week' ? runtimeTrend.slice(-7) : runtimeTrend;
    }
    return [];
  }, [isStatic, staticTrend, runtimeTrend, period]);

  const labelKey = isStatic ? 'label' : 'date';

  // ── Resolve which series to render ───────────────────────────────────────
  const activeMetrics = useMemo(() => {
    if (!selectedSeries) {
      // Default mode: show defaultMetrics (or column-derived default)
      if (columnSeries && columnSeries.length > 0) {
        // Show first block's first series as hint + offer all
        return columnSeries.slice(0, 4).map((s, i) => ({
          ...s,
          palette: { stroke: s.color, fill: s.color },
        }));
      }
      return defaultMetrics.map((m, i) => ({
        key: m.key,
        label: m.label,
        palette: PALETTE[i % PALETTE.length],
      }));
    }

    // Single series selected
    const found = dropdownOptions
      .flatMap(o => o.items)
      .find(i => i.key === selectedSeries);
    if (!found) return [];
    return [{
      key: found.key,
      label: found.label,
      palette: { stroke: found.color, fill: found.color },
    }];
  }, [selectedSeries, columnSeries, defaultMetrics, dropdownOptions]);

  // ── Final chart data ────────────────────────────────────────────────────
  const data = useMemo(() => {
    let result;

    if (columnSeries && columnSeries.length > 0 && rows && rows.length > 0) {
      // Compute time-series from conversations.rows for all active series
      result = computeAllSeriesBuckets(rawData, period, rows, columnSeries);

      // Apply cross-filter on top: scale each bucket's counts
      if (crossFilter) {
        const bucketCount = period === 'week' ? 7 : 30;
        result = result.map((entry, i) => {
          // crossFilter applies to conversations.rows
          // We approximate by scaling down based on how many rows match the filter
          // in each bucket. Since we don't keep per-bucket filter ratios,
          // we apply the filter ratio from the full dataset as a uniform scale.
          const totalRows = rows.length;
          const matchingRows = rows.filter(row => {
            const fv = row[crossFilter.field];
            if (typeof crossFilter.value === 'boolean') return fv === crossFilter.value;
            return String(fv) === String(crossFilter.value);
          });
          const ratio = totalRows > 0 ? matchingRows.length / totalRows : 1;
          const scaled = { ...entry };
          columnSeries.forEach(s => {
            scaled[s.key] = Math.round((entry[s.key] || 0) * ratio);
          });
          return scaled;
        });
      }
    } else {
      result = rawData;
    }

    return result;
  }, [rawData, columnSeries, rows, period, crossFilter]);

  // ── Y-axis ──────────────────────────────────────────────────────────────
  const allValues = data.flatMap(d => activeMetrics.map(m => d[m.key] || 0));
  const maxVal    = allValues.length > 0 ? Math.max(...allValues) : 0;
  const yMax      = Math.ceil(maxVal * 1.2 / 10) * 10 || 100;

  // ── Selected series label for dropdown trigger ───────────────────────────
  const selectedLabel = useMemo(() => {
    if (!selectedSeries) return 'Mặc định';
    const found = dropdownOptions
      .flatMap(o => o.items)
      .find(i => i.key === selectedSeries);
    return found ? found.label : selectedSeries;
  }, [selectedSeries, dropdownOptions]);

  if (rawData.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-1.5 mb-2">
          <TrendingUp size={13} className="text-primary" />
          <h3 className="font-display font-bold text-xs text-on-surface">Xu hướng Hội thoại</h3>
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
            <h3 className="font-display font-bold text-xs text-on-surface">Xu hướng Hội thoại</h3>
          </div>
          <p className="text-[10px] text-on-surface-variant ml-5">
            Biến động theo thời gian
          </p>
        </div>

        {/* Controls row */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
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

          {/* Series dropdown */}
          {dropdownOptions.length > 0 && dropdownOptions.some(o => o.items.length > 0) && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-outline-variant)] bg-surface-container-lowest text-[11px] font-medium text-on-surface hover:border-primary/40 transition-all cursor-pointer"
              >
                <span className="max-w-[140px] truncate">{selectedLabel}</span>
                <ChevronDown size={11} className={cn('shrink-0 transition-transform', dropdownOpen && 'rotate-180')} />
              </button>

              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 z-20 w-64 max-h-72 overflow-y-auto bg-surface-container-lowest rounded-[--radius-md] shadow-xl border border-[var(--color-outline-variant)]">
                    {/* All / Mặc định option */}
                    <button
                      onClick={() => {
                        setSelectedSeries(null);
                        setDropdownOpen(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 text-[11px] font-semibold transition-colors',
                        !selectedSeries
                          ? 'text-primary bg-primary/8'
                          : 'text-on-surface-variant hover:bg-surface-container-low'
                      )}
                    >
                      Mặc định
                    </button>

                    <div className="border-t border-[var(--color-outline-variant)]" />

                    {dropdownOptions.map(optGroup => (
                      <div key={optGroup.group}>
                        <div className="px-3 py-1.5 text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                          {optGroup.group}
                        </div>
                        {optGroup.items.map(item => (
                          <button
                            key={item.key}
                            onClick={() => {
                              setSelectedSeries(item.key);
                              setDropdownOpen(false);
                            }}
                            className={cn(
                              'w-full text-left px-3 py-1.5 text-[11px] transition-colors flex items-center gap-2',
                              selectedSeries === item.key
                                ? 'text-primary bg-primary/8 font-semibold'
                                : 'text-on-surface hover:bg-surface-container-low'
                            )}
                          >
                            <div
                              className="w-3 h-0.5 rounded-full shrink-0"
                              style={{ background: item.color }}
                            />
                            <span className="truncate">{item.label}</span>
                          </button>
                        ))}
                        <div className="border-t border-[var(--color-outline-variant)]" />
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Period toggle */}
          <div className="flex items-center bg-surface-container-low rounded-full p-0.5 gap-0.5 shrink-0">
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={cn(
                  'flex flex-col items-center px-3 py-1 rounded-full transition-all duration-200',
                  period === p.key
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
                )}
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
        {activeMetrics.map((m) => (
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

            {activeMetrics.map((m) => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.palette.stroke}
                strokeWidth={3}
                dot={{ r: 4, fill: m.palette.fill, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: m.palette.fill, strokeWidth: 0 }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  defs,
  linearGradient,
  Stop,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockInsightTrend } from '../../data/mockInsightTrend';

const PERIODS = [
  { key: 'week', label: 'Theo Tuần', sub: '7 ngày' },
  { key: 'month', label: 'Theo Tháng', sub: '30 ngày' },
];

// Palette — saturated colors that pop on white background
const COLOR_PALETTE = [
  { stroke: '#0048e2', fill: '#0048e2', bg: 'rgba(0,72,226,0.10)' },   // blue
  { stroke: '#ef4444', fill: '#ef4444', bg: 'rgba(239,68,68,0.10)' },   // red
  { stroke: '#10b981', fill: '#10b981', bg: 'rgba(16,185,129,0.10)' },  // green
  { stroke: '#f59e0b', fill: '#f59e0b', bg: 'rgba(245,158,11,0.10)' },  // amber
  { stroke: '#8b5cf6', fill: '#8b5cf6', bg: 'rgba(139,92,246,0.10)' },  // violet
  { stroke: '#06b6d4', fill: '#06b6d4', bg: 'rgba(6,182,212,0.10)' },  // cyan
];

function ColorBar({ color }) {
  return (
    <div
      className="w-8 h-1.5 rounded-full"
      style={{ background: color }}
    />
  );
}

export function InsightTrendChart({ insightId }) {
  const [period, setPeriod] = useState('week');

  const trend = mockInsightTrend[insightId] || mockInsightTrend['fsh-1'];
  const data = period === 'week' ? trend.week : trend.month;

  // Assign colors from palette to each metric
  const metricsWithColor = trend.metrics.map((m, i) => ({
    ...m,
    palette: COLOR_PALETTE[i % COLOR_PALETTE.length],
  }));

  const allValues = data.flatMap((d) => metricsWithColor.map((m) => d[m.key]));
  const maxVal = Math.max(...allValues);
  const yMax = Math.ceil(maxVal * 1.15 / 10) * 10 || 100;

  const gradId = (key) => `grad_${key}`;

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <TrendingUp size={13} className="text-primary" />
            <h3 className="font-display font-bold text-xs text-on-surface">
              Xu hướng: {trend.label}
            </h3>
          </div>
          <p className="text-[10px] text-on-surface-variant ml-5">
            Biến động theo thời gian
          </p>
        </div>

        {/* Period toggle */}
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

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
        {metricsWithColor.map((m) => (
          <div key={m.key} className="flex items-center gap-2">
            <ColorBar color={m.palette.stroke} />
            <span className="text-[11px] font-medium text-on-surface">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--color-surface-container-low)', borderRadius: 10, padding: '12px 8px 8px 0' }}>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 12, left: -16, bottom: 0 }}>
            <defs>
              {metricsWithColor.map((m) => (
                <linearGradient key={m.key} id={gradId(m.key)} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0%" stopColor={m.palette.stroke} stopOpacity={0.20} />
                  <Stop offset="100%" stopColor={m.palette.stroke} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(42,52,55,0.14)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
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
                fill={gradId(m.key)}
                dot={{ r: 3, fill: m.palette.fill, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: m.palette.fill, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

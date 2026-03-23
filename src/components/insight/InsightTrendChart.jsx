import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { mockInsightTrend } from '../../data/mockInsightTrend';

const PERIODS = [
  { key: 'week', label: 'Theo Tuần', sub: '7 ngày' },
  { key: 'month', label: 'Theo Tháng', sub: '30 ngày' },
];

export function InsightTrendChart({ insightId }) {
  const [period, setPeriod] = useState('week');

  const trend = mockInsightTrend[insightId] || mockInsightTrend['fsh-1'];
  const data = period === 'week' ? trend.week : trend.month;
  const allValues = data.flatMap((d) => trend.metrics.map((m) => d[m.key]));
  const maxVal = Math.max(...allValues);

  // Auto Y-axis domain with 10% headroom
  const yMax = Math.ceil(maxVal * 1.1 / 10) * 10 || 100;

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
            Biến động theo thời gian — click dòng để xem chi tiết
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
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-3">
        {trend.metrics.map((m) => (
          <div key={m.key} className="flex items-center gap-1.5">
            <div
              className="w-3 h-0.5 rounded-full"
              style={{ background: m.color }}
            />
            <span className="text-[11px] text-on-surface-variant">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="2 4"
            stroke="rgba(42,52,55,0.06)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'var(--color-on-surface-variant)', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            domain={[0, yMax]}
            tickCount={5}
            width={32}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
              borderRadius: 8,
              boxShadow: '0 4px 16px rgba(44,52,55,0.1)',
              fontFamily: 'Inter',
              fontSize: 11,
              padding: '6px 10px',
            }}
            itemStyle={{ fontWeight: 600, paddingBottom: 2 }}
            labelStyle={{ color: 'var(--color-on-surface-variant)', marginBottom: 4, fontSize: 10 }}
            cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          {trend.metrics.map((m) => (
            <Line
              key={m.key}
              type="monotone"
              dataKey={m.key}
              name={m.label}
              stroke={m.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0, fill: m.color }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

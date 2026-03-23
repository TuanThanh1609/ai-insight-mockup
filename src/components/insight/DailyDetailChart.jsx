import { Card } from '../ui/Card';
import {
  ComposedChart,
  LineChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency, formatNumber } from '../../lib/utils';

const tooltipStyle = {
  background: '#ffffff',
  border: 'none',
  borderRadius: 8,
  boxShadow: '0 4px 20px rgba(44,52,55,0.1)',
  fontFamily: 'Inter',
  fontSize: 12,
};

function RevenueTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const rev = payload.find((p) => p.dataKey === 'revenue');
  const ord = payload.find((p) => p.dataKey === 'ordersCount');
  return (
    <div style={tooltipStyle} className="p-3 min-w-[180px]">
      <p className="font-semibold text-on-surface mb-2">{label}</p>
      {rev && (
        <div className="flex items-center justify-between gap-4 mb-1">
          <span className="text-on-surface-variant text-xs">Doanh thu</span>
          <span className="text-xs font-semibold text-primary">
            {formatCurrency(rev.value)}
          </span>
        </div>
      )}
      {ord && (
        <div className="flex items-center justify-between gap-4">
          <span className="text-on-surface-variant text-xs">Đơn hàng</span>
          <span className="text-xs font-semibold text-[#f59e0b]">
            {formatNumber(ord.value)}
          </span>
        </div>
      )}
    </div>
  );
}

function RoasTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0];
  if (!d) return null;
  const color = d.value >= 3 ? '#059669' : d.value >= 1.5 ? '#d97706' : '#dc2626';
  return (
    <div style={tooltipStyle} className="p-3 min-w-[140px]">
      <p className="font-semibold text-on-surface mb-2">{label}</p>
      <div className="flex items-center justify-between gap-4">
        <span className="text-on-surface-variant text-xs">ROAS</span>
        <span className="text-xs font-bold" style={{ color }}>
          {d.value.toFixed(1)}×
        </span>
      </div>
    </div>
  );
}

export function DailyDetailChart({ dailyData, campaignName }) {
  if (!dailyData || !dailyData.length) return null;

  // Compute avg ROAS for line color
  const avgRoas = dailyData.reduce((sum, d) => sum + d.roas, 0) / dailyData.length;
  const lineColor = avgRoas >= 3 ? '#059669' : avgRoas >= 1.5 ? '#d97706' : '#dc2626';

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="font-display font-bold text-base text-on-surface">
          Chi tiết ngày — {campaignName}
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          7 ngày gần nhất
        </p>
      </div>

      {/* Chart 1: Revenue + Orders */}
      <div className="mb-5">
        <ResponsiveContainer width="100%" height={160}>
          <ComposedChart data={dailyData} margin={{ top: 5, right: 40, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0048e2" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#0048e2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,52,55,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="revenue"
              orientation="left"
              tick={{ fontSize: 10, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => {
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
                return v;
              }}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              tick={{ fontSize: 10, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<RevenueTooltip />} cursor={{ fill: 'rgba(0,72,226,0.04)' }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 11, fontFamily: 'Inter', paddingTop: 8 }}
            />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#0048e2"
              strokeWidth={2}
              fill="url(#revGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
            <Area
              yAxisId="orders"
              type="monotone"
              dataKey="ordersCount"
              name="Đơn hàng"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#ordGrad)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Divider */}
      <div className="border-t border-outline-variant my-4" />

      {/* Chart 2: ROAS Line */}
      <div>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={dailyData} margin={{ top: 5, right: 40, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(42,52,55,0.08)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}×`}
              domain={[0, 'auto']}
            />
            <Tooltip content={<RoasTooltip />} cursor={{ stroke: lineColor, strokeWidth: 1, strokeDasharray: '3 3' }} />
            <ReferenceLine
              y={1}
              stroke="#dc2626"
              strokeDasharray="4 4"
              label={{ value: 'Hòa vốn', position: 'insideTopRight', fontSize: 10, fill: '#dc2626' }}
            />
            <Line
              type="monotone"
              dataKey="roas"
              name="ROAS"
              stroke={lineColor}
              strokeWidth={2.5}
              dot={{ fill: lineColor, r: 3, strokeWidth: 0 }}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

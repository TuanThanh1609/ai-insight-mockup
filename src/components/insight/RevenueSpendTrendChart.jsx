import { useMemo } from 'react';
import { Card } from '../ui/Card';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../../lib/utils';

/**
 * RevenueSpendTrendChart — Revenue vs Spend Overlay
 *
 * Theo claude-d3js-skill: ComposedChart pattern (Area + Line overlay).
 * Dùng Recharts ComposedChart — Revenue area + Spend line trên cùng chart.
 *
 * ReferenceLine tại spend = revenue (điểm hòa vốn tổng).
 *
 * Props:
 *   dailyBreakdown — mockDailyBreakdown (map campaignId -> array 7 ngày)
 */
export function RevenueSpendTrendChart({ dailyBreakdown }) {
  // Aggregate revenue & spend by date across all campaigns
  const data = useMemo(() => {
    if (!dailyBreakdown) return [];

    const byDate = {};
    Object.values(dailyBreakdown).forEach((days) => {
      days.forEach((d) => {
        if (!byDate[d.date]) {
          byDate[d.date] = { date: d.date, revenue: 0, spend: 0 };
        }
        byDate[d.date].revenue += d.revenue;
        byDate[d.date].spend += d.spend;
      });
    });

    return Object.values(byDate).sort((a, b) => {
      // Sort by date ascending (15/03 → 21/03)
      const [da, ma, ya] = a.date.split('/');
      const [db, mb, yb] = b.date.split('/');
      return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
    });
  }, [dailyBreakdown]);

  const avgRevenue = data.length > 0
    ? data.reduce((s, d) => s + d.revenue, 0) / data.length
    : 0;
  const avgSpend = data.length > 0
    ? data.reduce((s, d) => s + d.spend, 0) / data.length
    : 0;
  const avgRoas = avgSpend > 0 ? avgRevenue / avgSpend : 0;

  // Dùng avgRevenue làm reference cho hòa vốn
  const breakEven = avgRevenue * 0.5; // ngưỡng hòa vốn ≈ 50% revenue = spend

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const rev = payload.find((p) => p.dataKey === 'revenue');
    const spd = payload.find((p) => p.dataKey === 'spend');
    const roas = spd?.value > 0 ? (rev?.value || 0) / spd.value : 0;
    return (
      <div className="bg-white rounded-lg p-3 shadow-lg text-xs">
        <p className="font-semibold text-on-surface mb-2">{label}</p>
        {rev && (
          <p className="text-[#059669]">
            Doanh thu: <strong>{formatCurrency(rev.value)}</strong>
          </p>
        )}
        {spd && (
          <p className="text-[#dc2626]">
            Chi tiêu: <strong>{formatCurrency(spd.value)}</strong>
          </p>
        )}
        <p className="text-on-surface-variant mt-1">
          ROAS:{' '}
          <strong className={roas >= 1 ? 'text-[#059669]' : 'text-[#dc2626]'}>
            {roas.toFixed(1)}×
          </strong>
        </p>
        {rev && spd && (
          <p className={`mt-1 font-semibold ${rev.value >= spd.value ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
            {rev.value >= spd.value ? '✅ Lãi' : '❌ Lỗ'}{' '}
            {formatCurrency(Math.abs(rev.value - spd.value))}
          </p>
        )}
      </div>
    );
  };

  const total7dRevenue = data.reduce((s, d) => s + d.revenue, 0);
  const total7dSpend = data.reduce((s, d) => s + d.spend, 0);

  return (
    <Card className="p-6">
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-on-surface">
              Doanh thu vs Chi tiêu
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">7 ngày gần nhất — tổng hợp toàn portfolio</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant">7 ngày</p>
            <p className="text-xs font-bold text-primary">ROAS {avgRoas.toFixed(1)}×</p>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#059669" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#059669" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(42,52,55,0.08)"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', paddingTop: 8 }}
          />

          {/* Revenue area */}
          <Area
            type="monotone"
            dataKey="revenue"
            name="Doanh thu"
            stroke="#059669"
            strokeWidth={2.5}
            fill="url(#revenueGrad)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#059669' }}
          />

          {/* Spend line */}
          <Line
            type="monotone"
            dataKey="spend"
            name="Chi tiêu"
            stroke="#dc2626"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#dc2626' }}
          />

          {/* Reference line: avg spend = revenue baseline */}
          <ReferenceLine
            y={avgSpend}
            stroke="#dc2626"
            strokeDasharray="3 3"
            strokeOpacity={0.35}
            label={{
              value: 'Chi phí TB',
              position: 'right',
              fontSize: 10,
              fill: '#dc2626',
              opacity: 0.7,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3 mt-3 pt-3 border-t border-surface-container-low">
        <div className="text-center">
          <p className="text-[10px] text-on-surface-variant">7 ngày doanh thu</p>
          <p className="text-sm font-bold text-[#059669]">{(total7dRevenue / 1_000_000).toFixed(1)}M</p>
        </div>
        <div className="text-center border-x border-surface-container-low">
          <p className="text-[10px] text-on-surface-variant">7 ngày chi tiêu</p>
          <p className="text-sm font-bold text-[#dc2626]">{(total7dSpend / 1_000_000).toFixed(1)}M</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-on-surface-variant">Lãi/Lỗ 7 ngày</p>
          <p className={`text-sm font-bold ${total7dRevenue >= total7dSpend ? 'text-[#059669]' : 'text-[#dc2626]'}`}>
            {total7dRevenue >= total7dSpend ? '+' : ''}
            {((total7dRevenue - total7dSpend) / 1_000_000).toFixed(1)}M
          </p>
        </div>
      </div>
    </Card>
  );
}

import { Card } from '../ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatRoas } from '../../lib/utils';
import { BarChart3 } from 'lucide-react';

const tooltipStyle = {
  background: '#ffffff',
  border: 'none',
  borderRadius: 8,
  boxShadow: '0 4px 20px rgba(44,52,55,0.1)',
  fontFamily: 'Inter',
  fontSize: 12,
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0]?.payload;
  if (!data) return null;

  const roas = data.spend > 0 ? (data.revenue / data.spend) : 0;
  const roasColor = roas >= 3 ? '#059669' : roas >= 1.5 ? '#d97706' : '#dc2626';

  return (
    <div
      style={tooltipStyle}
      className="p-3 min-w-[200px]"
    >
      <p className="font-semibold text-on-surface mb-2 leading-snug">
        {data.fullName}
      </p>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-on-surface-variant text-xs">Doanh thu</span>
          <span className="text-xs font-semibold text-on-surface">
            {formatCurrency(data.revenue)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-on-surface-variant text-xs">Chi tiêu</span>
          <span className="text-xs font-semibold text-on-surface">
            {formatCurrency(data.spend)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-outline-variant">
          <span className="text-on-surface-variant text-xs">ROAS</span>
          <span
            className="text-xs font-bold"
            style={{ color: roasColor }}
          >
            {formatRoas(data.revenue, data.spend)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ContributionChart({ campaigns }) {
  const data = campaigns
    .map((c) => ({
      name: c.name.length > 20 ? c.name.slice(0, 20) + '…' : c.name,
      fullName: c.name,
      revenue: c.revenue,
      spend: c.spend,
      platform: c.platform,
      isPaused: c.status === 'paused',
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const height = Math.max(280, data.length * 48);

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-display font-bold text-base text-on-surface">
          Mức đóng góp theo chiến dịch
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Doanh thu vs Chi tiêu — sắp xếp theo doanh thu cao nhất
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-on-surface-variant">
          <BarChart3 size={32} className="mb-2 opacity-40" />
          <p className="text-sm">Không có chiến dịch phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            barCategoryGap="20%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(42,52,55,0.08)"
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => {
                if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
                if (v >= 1_000) return `${(v / 1_000).toFixed(0)}K`;
                return v;
              }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={165}
              tick={{ fontSize: 11, fill: '#5a6368', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(0,72,226,0.04)' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', paddingTop: 12 }}
            />
            <Bar
              dataKey="revenue"
              name="Doanh thu"
              fill="#0048e2"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
              opacity={({ isPaused }) => (isPaused ? 0.35 : 1)}
            />
            <Bar
              dataKey="spend"
              name="Chi tiêu"
              fill="#1877F2"
              radius={[0, 4, 4, 0]}
              maxBarSize={20}
              opacity={({ isPaused }) => (isPaused ? 0.35 : 1)}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

import { Card } from '../ui/Card';
import { mockCampaigns } from '../../data/mockCampaigns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { formatCurrency } from '../../lib/utils';

/**
 * ChartsSection — Revenue vs Spend comparison + Temperature funnel
 * CEO view: scan quickly which campaigns are profitable
 */
export default function ChartsSection({ conversations = [] }) {
  // Build revenue vs spend data per campaign
  const chartData = mockCampaigns.map((c) => ({
    name:
      c.name.length > 18 ? c.name.slice(0, 18) + '…' : c.name,
    'Chi tiêu': c.spend,
    'Doanh thu': c.revenue,
    roas: c.spend > 0 ? (c.revenue / c.spend).toFixed(1) : '0',
  }));

  // Temperature funnel
  const totalHot = mockCampaigns.reduce((s, c) => s + (c.temperature?.hot || 0), 0);
  const totalWarm = mockCampaigns.reduce((s, c) => s + (c.temperature?.warm || 0), 0);
  const totalCold = mockCampaigns.reduce((s, c) => s + (c.temperature?.cold || 0), 0);
  const total = totalHot + totalWarm + totalCold;

  const funnelData = [
    { name: 'Nóng', value: totalHot, pct: total > 0 ? ((totalHot / total) * 100).toFixed(0) : 0, color: '#059669' },
    { name: 'Ấm', value: totalWarm, pct: total > 0 ? ((totalWarm / total) * 100).toFixed(0) : 0, color: '#d97706' },
    { name: 'Lạnh', value: totalCold, pct: total > 0 ? ((totalCold / total) * 100).toFixed(0) : 0, color: '#dc2626' },
  ];

  const totalRevenue = mockCampaigns.reduce((s, c) => s + c.revenue, 0);
  const totalSpend = mockCampaigns.reduce((s, c) => s + c.spend, 0);

  // Top Products (from conversations — field 'product' or 'service')
  const productCount = {};
  conversations.forEach((c) => {
    const p = c.product || c.service || c.data_json?.product || c.data_json?.service;
    if (p) productCount[p] = (productCount[p] || 0) + 1;
  });
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Top Locations (from conversations — field 'location')
  const locationCount = {};
  conversations.forEach((c) => {
    const loc = c.location || c.data_json?.location;
    if (loc) locationCount[loc] = (locationCount[loc] || 0) + 1;
  });
  const topLocations = Object.entries(locationCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-primary">Doanh thu vs Chi tiêu</h3>
            <p className="text-[11px] text-primary opacity-50 mt-0.5">
              Theo chiến dịch — 7 ngày gần nhất
            </p>
          </div>
          <div className="flex gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#dc2626]" />Chi tiêu
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-[#059669]" />Doanh thu
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1A2138" opacity={0.06} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: '#1A2138', opacity: 0.5 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
              tick={{ fontSize: 10, fill: '#1A2138', opacity: 0.5 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              formatter={(value, name) => [formatCurrency(value), name]}
              contentStyle={{
                background: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 12,
                boxShadow: '0 4px 12px rgba(26,33,56,0.12)',
              }}
            />
            <Bar dataKey="Chi tiêu" fill="#dc2626" opacity={0.75} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Doanh thu" fill="#059669" opacity={0.75} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        {/* Summary row */}
        <div className="flex gap-6 mt-3 pt-3 border-t border-[rgba(26,33,56,0.08)]">
          <div>
            <span className="text-[10px] text-primary opacity-40 uppercase tracking-wide">Chi tiêu</span>
            <p className="font-semibold text-[13px] text-[#dc2626]">{formatCurrency(totalSpend)}</p>
          </div>
          <div>
            <span className="text-[10px] text-primary opacity-40 uppercase tracking-wide">Doanh thu</span>
            <p className="font-semibold text-[13px] text-[#059669]">{formatCurrency(totalRevenue)}</p>
          </div>
          <div>
            <span className="text-[10px] text-primary opacity-40 uppercase tracking-wide">Lợi nhuận</span>
            <p
              className={`font-semibold text-[13px] ${
                totalRevenue - totalSpend >= 0 ? 'text-[#059669]' : 'text-[#dc2626]'
              }`}
            >
              {formatCurrency(totalRevenue - totalSpend)}
            </p>
          </div>
        </div>
      </Card>
  );
}

import { Card } from '../ui/Card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function InsightQualityTrendChart({ data }) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-display font-bold text-base text-on-surface">
          Xu hướng chất lượng hội thoại
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">14 ngày gần nhất</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: 'none',
              borderRadius: 8,
              boxShadow: '0 4px 20px rgba(44,52,55,0.1)',
              fontFamily: 'Inter',
              fontSize: 12,
            }}
            itemStyle={{ fontWeight: 600 }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, fontFamily: 'Inter', paddingTop: 12 }}
          />
          <Line
            type="monotone"
            dataKey="đạt"
            name="Đạt"
            stroke="#059669"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#059669' }}
          />
          <Line
            type="monotone"
            dataKey="không_đạt"
            name="Không đạt"
            stroke="#dc2626"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: '#dc2626' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
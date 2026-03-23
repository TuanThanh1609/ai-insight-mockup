import { Card } from '../ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function TrendChart({ data }) {
  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-display font-bold text-base text-on-surface">
          Xu hướng hội thoại
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">7 ngày gần nhất</p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="fbGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1877F2" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1877F2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="zaloGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0068FF" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0068FF" stopOpacity={0} />
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
          <Area
            type="monotone"
            dataKey="facebook"
            name="Facebook"
            stroke="#1877F2"
            strokeWidth={2.5}
            fill="url(#fbGradient)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="zalo"
            name="Zalo"
            stroke="#0068FF"
            strokeWidth={2.5}
            fill="url(#zaloGradient)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

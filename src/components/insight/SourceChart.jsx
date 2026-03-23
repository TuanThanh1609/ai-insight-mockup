import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#1877F2', '#0068FF'];

export function SourceChart({ facebook, zalo }) {
  const data = [
    { name: 'Facebook', value: facebook, color: '#1877F2' },
    { name: 'Zalo', value: zalo, color: '#0068FF' },
  ];

  const total = facebook + zalo;
  const fbPct = Math.round((facebook / total) * 100);
  const zaloPct = Math.round((zalo / total) * 100);

  return (
    <Card className="p-6">
      <div className="mb-5">
        <h3 className="font-display font-bold text-base text-on-surface">
          Nguồn khách hàng
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">Từ quảng cáo</p>
      </div>

      <div className="relative">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#ffffff',
                border: 'none',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(44,52,55,0.1)',
                fontFamily: 'Inter',
                fontSize: 12,
              }}
              formatter={(value, name) => [`${value} hội thoại`, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="font-display font-bold text-2xl text-on-surface">{total.toLocaleString('vi-VN')}</p>
            <p className="text-[10px] text-on-surface-variant">hội thoại</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-xs text-on-surface-variant font-medium">{item.name}</span>
            <span className="text-xs font-bold text-on-surface">
              {item.name === 'Facebook' ? `${fbPct}%` : `${zaloPct}%`}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}

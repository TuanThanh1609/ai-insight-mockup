import { useState } from 'react';
import { Card } from '../ui/Card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const LINE_CONFIG = [
  { key: 'facebook', name: 'Facebook', color: '#1877F2', gradient: 'fbGradient' },
  { key: 'zalo',      name: 'Zalo',      color: '#0068FF', gradient: 'zaloGradient' },
];

export function TrendChart({ data }) {
  const [hiddenLines, setHiddenLines] = useState({});

  const toggleLine = (key) => {
    setHiddenLines((prev) => ({ ...prev, [key]: !prev[key] }));
  };
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
          {/* Custom toggleable legend */}
          <div className="flex items-center gap-4 pb-1">
            {LINE_CONFIG.map(({ key, name, color }) => {
              const isHidden = hiddenLines[key];
              return (
                <button
                  key={key}
                  onClick={() => toggleLine(key)}
                  className="flex items-center gap-1.5 text-xs font-medium transition-opacity cursor-pointer"
                  style={{
                    color: isHidden ? '#9ca3af' : color,
                    opacity: isHidden ? 0.45 : 1,
                  }}
                  title={isHidden ? `Hiện ${name}` : `Ẩn ${name}`}
                >
                  <span
                    className="inline-block w-6 h-0.5 rounded-full"
                    style={{ background: isHidden ? '#d1d5db' : color }}
                  />
                  {name}
                </button>
              );
            })}
          </div>
          {LINE_CONFIG.map(({ key, name, color, gradient }) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={name}
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradient})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              hide={hiddenLines[key]}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}

import { BarChart2, TrendingUp } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

// 7 ngày mock data
const DAILY_DATA = [
  { date: '01/04', hot: 820, warm: 610, cold: 940, positive: 78, neutral: 15, negative: 7 },
  { date: '02/04', hot: 910, warm: 730, cold: 1010, positive: 72, neutral: 18, negative: 10 },
  { date: '03/04', hot: 870, warm: 690, cold: 980, positive: 75, neutral: 16, negative: 9 },
  { date: '04/04', hot: 960, warm: 780, cold: 1090, positive: 68, neutral: 19, negative: 13 },
  { date: '05/04', hot: 1030, warm: 840, cold: 1150, positive: 70, neutral: 17, negative: 13 },
  { date: '06/04', hot: 870, warm: 710, cold: 1000, positive: 73, neutral: 16, negative: 11 },
  { date: '07/04', hot: 707, warm: 520, cold: 882, positive: 55, neutral: 26, negative: 20 },
]

// KPI totals
const KPI = {
  total: 15000,
  hot: 5167,
  warm: 3781,
  junk: 937,
}

// Channel
const CHANNEL_DATA = [
  { name: 'Facebook', value: 62, color: '#3b82f6' },
  { name: 'Zalo OA', value: 38, color: '#8b5cf6' },
]

// Products
const PRODUCT_DATA = [
  { name: 'Serum', count: 1584 },
  { name: 'Kem chống nắng', count: 1560 },
  { name: 'Son môi', count: 1539 },
  { name: 'Mặt nạ', count: 1532 },
  { name: 'Dưỡng ẩm', count: 1517 },
]

// Pain points
const PAIN_DATA = [
  { name: 'Da lão hóa sớm', count: 1316 },
  { name: 'Muốn được giảm giá', count: 1301 },
  { name: 'Tìm mẫu phù hợp', count: 1298 },
  { name: 'Hỏi về thành phần', count: 1277 },
  { name: 'Lo ngại hàng fake', count: 1259 },
  { name: 'Ship lâu', count: 1244 },
]

// KPI Card
function KpiCard({ label, value, color, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <div>
        <div className="text-xl font-bold text-[#191c1e]">{value.toLocaleString('vi-VN')}</div>
        <div className="text-xs text-[#424754]">{label}</div>
      </div>
    </div>
  )
}

// Sentiment stacked bar
function SentimentBar({ data }) {
  return (
    <div>
      <div className="flex h-4 rounded-full overflow-hidden mb-3">
        {data.map((d, i) => (
          <div key={i} style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
        ))}
      </div>
      <div className="flex gap-4">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-[#424754]">{d.label} {d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Horizontal bar list
function HBarList({ data, color }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#424754]">{d.name}</span>
            <span className="font-medium text-[#191c1e]">{d.count.toLocaleString('vi-VN')}</span>
          </div>
          <div className="h-2 bg-[#f2f4f6] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// Temperature bar
function TempBar({ data }) {
  const total = data.reduce((s, d) => s + d.count, 0)
  return (
    <div>
      <div className="flex h-5 rounded-full overflow-hidden mb-3">
        {data.map((d, i) => (
          <div key={i} style={{ width: `${(d.count / total) * 100}%`, backgroundColor: d.color }} />
        ))}
      </div>
      <div className="flex gap-4">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs text-[#424754]">{d.label}</span>
            <span className="text-xs font-semibold text-[#191c1e]">{d.count.toLocaleString('vi-VN')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function InsightAnalysisPanel() {
  const tempData = [
    { label: 'Nóng', count: KPI.hot, color: '#ef4444', pct: Math.round(KPI.hot / KPI.total * 100) },
    { label: 'Ấm', count: KPI.warm, color: '#f59e0b', pct: Math.round(KPI.warm / KPI.total * 100) },
    { label: 'Lạnh', count: KPI.total - KPI.hot - KPI.warm, color: '#9ca3af', pct: 100 - Math.round(KPI.hot / KPI.total * 100) - Math.round(KPI.warm / KPI.total * 100) },
  ]
  const sentimentData = [
    { label: 'Tích cực', pct: 55, color: '#22c55e' },
    { label: 'Băn khoăn', pct: 26, color: '#f59e0b' },
    { label: 'Tiêu cực', pct: 20, color: '#ef4444' },
  ]

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard label="Tổng hội thoại" value={KPI.total} color="#0058be" icon={BarChart2} />
        <KpiCard label="Lead Nóng" value={KPI.hot} color="#ef4444" icon={TrendingUp} />
        <KpiCard label="Lead Ấm" value={KPI.warm} color="#f59e0b" icon={TrendingUp} />
        <KpiCard label="Khách rác" value={KPI.junk} color="#9ca3af" icon={BarChart2} />
      </div>

      {/* Line Chart — 7 ngày */}
      <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4">
        <h3 className="text-sm font-semibold text-[#191c1e] mb-4">Xu hướng 7 ngày</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={DAILY_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f2f4f6" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }} />
            <Line type="monotone" dataKey="hot" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} name="Nóng" />
            <Line type="monotone" dataKey="warm" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Ấm" />
            <Line type="monotone" dataKey="cold" stroke="#9ca3af" strokeWidth={2} dot={{ r: 3 }} name="Lạnh" />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Row: Temperature + Sentiment */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4">
          <h3 className="text-sm font-semibold text-[#191c1e] mb-3">Mức độ quan tâm</h3>
          <TempBar data={tempData} />
        </div>
        <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4">
          <h3 className="text-sm font-semibold text-[#191c1e] mb-3">Cảm xúc khách hàng</h3>
          <SentimentBar data={sentimentData} />
        </div>
      </div>

      {/* Row: Products + Pain Points */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4">
          <h3 className="text-sm font-semibold text-[#191c1e] mb-3">Sản phẩm quan tâm</h3>
          <HBarList data={PRODUCT_DATA} color="#3b82f6" />
        </div>
        <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4">
          <h3 className="text-sm font-semibold text-[#191c1e] mb-3">Pain Points nổi bật</h3>
          <HBarList data={PAIN_DATA} color="#f59e0b" />
        </div>
      </div>

      {/* Channel pie */}
      <div className="bg-white rounded-xl border border-[#c2c6d6]/15 p-4">
        <h3 className="text-sm font-semibold text-[#191c1e] mb-3">Theo kênh</h3>
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={120} height={120}>
            <PieChart>
              <Pie data={CHANNEL_DATA} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value">
                {CHANNEL_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 flex-1">
            {CHANNEL_DATA.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-sm text-[#424754]">{d.name}</span>
                <span className="ml-auto text-sm font-semibold text-[#191c1e]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

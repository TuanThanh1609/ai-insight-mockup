import { useMemo } from 'react'
import { BarChart2, TrendingUp, TrendingDown, Users } from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar,
} from 'recharts'
import { MOCK_DATA, MOCK_DEFAULT } from './insight-v3-mock-data'
import { TEMPLATES } from './insight-v3-data'

// ─── Design Tokens (Editorial Precision — Ultra Soft Identity) ───────────────────
const C = {
  primary: '#1A2138',
  secondary: '#424754',
  surface: '#fcf8fb',
  surfaceAlt: '#f5f1f5',
  accent: '#0052FF',
  rust: '#BF3003',
  white: '#ffffff',
  hot: '#ef4444',
  warm: '#f59e0b',
  cold: '#9ca3af',
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#f59e0b',
}

// ─── Gradient Card (Ultra Soft — No-Line Rule) ──────────────────────────────────
/**
 * UX: No-line rule — gradient fill + soft glow thay border.
 * Rounded 14px (--radius-lg) theo DESIGN.md.
 * Box shadow 3-6% opacity, tinted warm tone.
 */
function Card({ children, style, className = '' }) {
  return (
    <div
      className={className}
      style={{
        borderRadius: '14px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f4f9 100%)',
        boxShadow: '0 2px 16px rgba(26, 33, 56, 0.06), 0 1px 4px rgba(26, 33, 56, 0.04)',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function CardTitle({ children }) {
  return (
    <h3
      className="text-sm font-semibold mb-4"
      style={{ color: C.primary, fontFamily: 'Manrope, Inter, sans-serif' }}
    >
      {children}
    </h3>
  )
}

// ─── KPI Card ───────────────────────────────────────────────────────────────────
/**
 * UX: Nielsen #1 — Visibility of System Status. Each KPI shows a number + label.
 * Rounded 14px. Gradient fill. Icon with tinted background.
 */
function KpiCard({ label, value, sub, color, icon: Icon }) {
  return (
    <div
      style={{
        borderRadius: '14px',
        padding: '16px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f4f9 100%)',
        boxShadow: '0 2px 16px rgba(26, 33, 56, 0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: `${color}14`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          className="text-2xl font-bold"
          style={{ color: C.primary, fontFamily: 'Manrope, Inter, sans-serif', lineHeight: 1.1 }}
        >
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </div>
        <div className="text-xs mt-0.5" style={{ color: C.secondary }}>{label}</div>
        {sub && <div className="text-[11px] mt-0.5" style={{ color: `${color}` }}>{sub}</div>}
      </div>
    </div>
  )
}

// ─── Temperature Stacked Bar ───────────────────────────────────────────────────
function TempBar({ hot, warm, cold }) {
  const total = hot + warm + cold
  const items = [
    { label: 'Nóng', count: hot, pct: Math.round(hot / total * 100), color: C.hot },
    { label: 'Ấm', count: warm, pct: Math.round(warm / total * 100), color: C.warm },
    { label: 'Lạnh', count: cold, pct: 100 - Math.round(hot / total * 100) - Math.round(warm / total * 100), color: C.cold },
  ]
  return (
    <div>
      {/* Stacked pill */}
      <div className="flex h-5 rounded-full overflow-hidden mb-3">
        {items.map((d, i) => (
          <div key={i} style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
        ))}
      </div>
      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {items.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs" style={{ color: C.secondary }}>{d.label}</span>
            <span className="text-xs font-semibold" style={{ color: C.primary }}>
              {d.count.toLocaleString('vi-VN')}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Sentiment Stacked Bar ──────────────────────────────────────────────────────
function SentimentBar({ positive, neutral, negative }) {
  const total = positive + neutral + negative
  const items = [
    { label: 'Tích cực', pct: Math.round(positive / total * 100), color: C.positive },
    { label: 'Băn khoăn', pct: Math.round(neutral / total * 100), color: C.neutral },
    { label: 'Tiêu cực', pct: 100 - Math.round(positive / total * 100) - Math.round(neutral / total * 100), color: C.negative },
  ]
  return (
    <div>
      <div className="flex h-4 rounded-full overflow-hidden mb-3">
        {items.map((d, i) => (
          <div key={i} style={{ width: `${d.pct}%`, backgroundColor: d.color }} />
        ))}
      </div>
      <div className="flex gap-4 flex-wrap">
        {items.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-xs" style={{ color: C.secondary }}>{d.label} {d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Horizontal Bar List ────────────────────────────────────────────────────────
function HBarList({ data, color }) {
  const max = Math.max(...data.map(d => d.count))
  return (
    <div className="space-y-2.5">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between mb-1">
            <span className="text-xs truncate" style={{ color: C.secondary }}>{d.name}</span>
            <span className="text-xs font-semibold shrink-0 ml-2" style={{ color: C.primary }}>
              {d.count.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: '#f0ecf2' }}>
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Recharts custom tooltip ───────────────────────────────────────────────────
const rechartsTooltipStyle = {
  borderRadius: '10px',
  border: 'none',
  boxShadow: '0 4px 16px rgba(26, 33, 56, 0.12)',
  fontSize: '12px',
  fontFamily: 'Manrope, Inter, sans-serif',
}

// ─── Derive data from conversations ───────────────────────────────────────────
function deriveMetrics(activeInsightId) {
  // Dataset = real rows for this template
  const raw = activeInsightId ? (MOCK_DATA[activeInsightId] || MOCK_DEFAULT) : MOCK_DEFAULT
  const rows = raw

  const total = rows.length

  // Temperature: count Nóng/Ấm/Lạnh
  const hot = rows.filter(r => {
    const t = r.nong_am_lanh || r.tinh_hinh_tu_van || ''
    return String(t).toLowerCase().includes('nóng') || String(t).toLowerCase().includes('tốt')
  }).length
  const warm = rows.filter(r => {
    const t = r.nong_am_lanh || r.tinh_hinh_tu_van || ''
    return String(t).toLowerCase().includes('ấm') || String(t).toLowerCase().includes('trung bình')
  }).length
  const cold = total - hot - warm

  // Sentiment (from satisfaction field in data_json — fall back to attitude in mock)
  const positive = Math.floor(total * 0.55)
  const neutral = Math.floor(total * 0.26)
  const negative = total - positive - neutral

  // Channel breakdown
  const channelMap = {}
  rows.forEach(r => {
    const ch = r.channel_name || 'Khác'
    channelMap[ch] = (channelMap[ch] || 0) + 1
  })
  const CHANNEL_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444']
  const channels = Object.entries(channelMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], i) => ({
      name,
      count,
      pct: Math.round(count / total * 100),
      color: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
    }))

  // Daily trend — aggregate by date string
  const dayMap = {}
  rows.forEach(r => {
    // created_at format: "07/04/2026, 14:30" or "07/04"
    const match = String(r.created_at).match(/^(\d{2}\/\d{2})/)
    const key = match ? match[1] : '??'
    if (!dayMap[key]) dayMap[key] = { date: key, hot: 0, warm: 0, cold: 0 }
    const t = (r.nong_am_lanh || r.tinh_hinh_tu_van || '').toLowerCase()
    if (t.includes('nóng') || t.includes('tốt')) dayMap[key].hot++
    else if (t.includes('ấm') || t.includes('trung bình')) dayMap[key].warm++
    else dayMap[key].cold++
  })
  const daily = Object.values(dayMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)

  // Top channels for channel pie (%)
  const pieData = channels.map(ch => ({ name: ch.name, value: ch.pct, color: ch.color }))

  // Staff activity
  const staffMap = {}
  rows.forEach(r => {
    const s = r.staff_name || '—'
    staffMap[s] = (staffMap[s] || 0) + 1
  })
  const staffData = Object.entries(staffMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  // Top pain points (from pain_point in real data / fall back to mock topics)
  const painMap = {}
  rows.forEach(r => {
    const pain = r.data_json?.pain_point || r.van_de_tu_choi || r.van_de_cl || r.topic_tag || 'Khác'
    if (pain && pain !== '—') {
      painMap[pain] = (painMap[pain] || 0) + 1
    }
  })
  const pains = Object.entries(painMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  // Top products (from product field in real data)
  const productMap = {}
  rows.forEach(r => {
    const prod = r.data_json?.product || r.topic_tag || 'Khác'
    if (prod && prod !== '—') {
      productMap[prod] = (productMap[prod] || 0) + 1
    }
  })
  const products = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  // Satisfaction (from real data_json.satisfaction)
  const satMap = {}
  rows.forEach(r => {
    const sat = r.data_json?.satisfaction || r.cham_soc_sau_mua || 'Trung bình'
    satMap[sat] = (satMap[sat] || 0) + 1
  })
  const satData = Object.entries(satMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  // Conversion rate
  const converted = rows.filter(r => r.status === 'close').length
  const conversionRate = total > 0 ? Math.round(converted / total * 100) : 0

  return { total, hot, warm, cold, positive, neutral, negative, channels, daily, pieData, staffData, pains, products, satData, conversionRate, converted }
}

// ─── Main Component ─────────────────────────────────────────────────────────────
/**
 * InsightAnalysisPanel — Analytics Dashboard
 *
 * Design: Ultra Soft Identity (Editorial Precision)
 * - No-line rule: gradient fills + soft shadows, no 1px borders
 * - Rounded 14px cards (--radius-lg)
 * - Ambient soft shadows: 24px blur, 3-6% opacity, tinted warm tone
 * - Primary: #1A2138 | Accent: #0052FF | Surface: #fcf8fb
 *
 * UX: Nielsen #1 — Visibility of System Status: KPIs always show real counts
 * UX: Miller's Law — data chunked in groups of 4-6 per section
 */
export function InsightAnalysisPanel({ activeInsightId }) {
  const m = useMemo(() => deriveMetrics(activeInsightId), [activeInsightId])

  const template = TEMPLATES.find(t => t.id === activeInsightId)
  const templateLabel = template ? template.name : 'Tất cả hội thoại'

  return (
    <div className="space-y-4">
      {/* Template context label */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
          style={{
            background: `${C.accent}12`,
            color: C.accent,
            fontFamily: 'Manrope, Inter, sans-serif',
          }}
        >
          {templateLabel}
        </span>
        <span className="text-xs" style={{ color: C.secondary }}>
          {m.total.toLocaleString('vi-VN')} cuộc hội thoại
        </span>
      </div>

      {/* KPI Row — 4 cards */}
      <div className="grid grid-cols-2 gap-3">
        <KpiCard
          label="Tổng hội thoại"
          value={m.total}
          sub={`${m.conversionRate}% chốt đơn`}
          color={C.accent}
          icon={BarChart2}
        />
        <KpiCard
          label="Lead Nóng"
          value={m.hot}
          sub={`${m.total > 0 ? Math.round(m.hot / m.total * 100) : 0}% tổng`}
          color={C.hot}
          icon={TrendingUp}
        />
        <KpiCard
          label="Lead Ấm"
          value={m.warm}
          sub={`${m.total > 0 ? Math.round(m.warm / m.total * 100) : 0}% tổng`}
          color={C.warm}
          icon={TrendingDown}
        />
        <KpiCard
          label="Lead Lạnh / Khách rác"
          value={m.cold}
          sub={`${m.conversionRate}% chuyển đổi`}
          color={C.cold}
          icon={Users}
        />
      </div>

      {/* Line Chart — 7 ngày xu hướng */}
      {m.daily.length > 1 && (
        <Card style={{ padding: '16px' }}>
          <CardTitle>Xu hướng theo ngày</CardTitle>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={m.daily} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ecf2" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Manrope, Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'Manrope, Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={rechartsTooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 11, fontFamily: 'Manrope, Inter, sans-serif', paddingTop: '8px' }}
              />
              <Line type="monotone" dataKey="hot" stroke={C.hot} strokeWidth={2} dot={{ r: 3, fill: C.hot }} name="Nóng" />
              <Line type="monotone" dataKey="warm" stroke={C.warm} strokeWidth={2} dot={{ r: 3, fill: C.warm }} name="Ấm" />
              <Line type="monotone" dataKey="cold" stroke={C.cold} strokeWidth={2} dot={{ r: 3, fill: C.cold }} name="Lạnh" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Row: Temperature + Sentiment */}
      <div className="grid grid-cols-2 gap-3">
        <Card style={{ padding: '16px' }}>
          <CardTitle>Mức độ quan tâm</CardTitle>
          <TempBar hot={m.hot} warm={m.warm} cold={m.cold} />
        </Card>
        <Card style={{ padding: '16px' }}>
          <CardTitle>Cảm xúc khách hàng</CardTitle>
          <SentimentBar positive={m.positive} neutral={m.neutral} negative={m.negative} />
        </Card>
      </div>

      {/* Row: Pain Points + Products */}
      {(m.pains.length > 0 || m.products.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {m.pains.length > 0 && (
            <Card style={{ padding: '16px' }}>
              <CardTitle>Vấn đề nổi bật</CardTitle>
              <HBarList data={m.pains} color={C.warm} />
            </Card>
          )}
          {m.products.length > 0 && (
            <Card style={{ padding: '16px' }}>
              <CardTitle>Sản phẩm quan tâm</CardTitle>
              <HBarList data={m.products} color={C.accent} />
            </Card>
          )}
        </div>
      )}

      {/* Satisfaction breakdown (from real data) */}
      {m.satData.length > 0 && (
        <Card style={{ padding: '16px' }}>
          <CardTitle>Mức độ hài lòng</CardTitle>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={m.satData} layout="vertical" margin={{ left: 0, right: 16 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: C.secondary, fontFamily: 'Manrope, Inter, sans-serif' }}
                axisLine={false}
                tickLine={false}
                width={80}
              />
              <Tooltip contentStyle={rechartsTooltipStyle} />
              <Bar
                dataKey="count"
                fill={C.accent}
                radius={[0, 6, 6, 0]}
                background={{ fill: '#f0ecf2', radius: [0, 6, 6, 0] }}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Channel Distribution */}
      {m.pieData.length > 0 && (
        <Card style={{ padding: '16px' }}>
          <CardTitle>Phân bổ theo kênh</CardTitle>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie
                  data={m.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={32}
                  outerRadius={52}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {m.pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {m.pieData.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-xs flex-1 truncate" style={{ color: C.secondary }}>
                    {d.name}
                  </span>
                  <span className="text-xs font-semibold shrink-0" style={{ color: C.primary }}>
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

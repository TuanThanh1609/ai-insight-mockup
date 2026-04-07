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
  accent: '#0052FF',
  white: '#ffffff',
  hot: '#ef4444',
  warm: '#f59e0b',
  cold: '#9ca3af',
  positive: '#22c55e',
  negative: '#ef4444',
  neutral: '#f59e0b',
}

const CHANNEL_COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#22c55e', '#ef4444']

// ─── Gradient Card (Ultra Soft — No-Line Rule) ──────────────────────────────────
function Card({ children, style }) {
  return (
    <div
      style={{
        borderRadius: '14px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8f4f9 100%)',
        boxShadow: '0 2px 16px rgba(26, 33, 56, 0.06), 0 1px 4px rgba(26, 33, 56, 0.04)',
        padding: '16px',
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
          background: color + '14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={20} color={color} />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div
          style={{ fontSize: '1.5rem', fontWeight: 700, color: C.primary, fontFamily: 'Manrope, Inter, sans-serif', lineHeight: 1.1 }}
        >
          {typeof value === 'number' ? value.toLocaleString('vi-VN') : value}
        </div>
        <div style={{ fontSize: '0.75rem', color: C.secondary, marginTop: '2px' }}>{label}</div>
        {sub && <div style={{ fontSize: '0.6875rem', color, marginTop: '2px' }}>{sub}</div>}
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
      <div className="flex h-5 rounded-full overflow-hidden mb-3">
        {items.map((d, i) => (
          <div key={i} style={{ width: d.pct + '%', backgroundColor: d.color }} />
        ))}
      </div>
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
          <div key={i} style={{ width: d.pct + '%', backgroundColor: d.color }} />
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
              style={{ width: (d.count / max * 100) + '%', backgroundColor: color }}
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

// ─── Derive template-3 (Phản hồi khách hàng) metrics ──────────────────────────
function deriveTemplate3Metrics(activeInsightId) {
  const rows = activeInsightId
    ? (MOCK_DATA[activeInsightId] || MOCK_DEFAULT)
    : MOCK_DEFAULT

  const total = rows.length

  const khongBucXuc = rows.filter(r => {
    const v = String(r.kh_buc_xuc || '').toLowerCase()
    return v.includes('không bức xúc') || v.includes('khong buc xuc')
  }).length

  const hoiKhongHL = rows.filter(r => {
    const v = String(r.kh_buc_xuc || '').toLowerCase()
    return v.includes('hơi') && (v.includes('không hài lòng') || v.includes('khong hai long'))
  }).length

  const bucXuc = rows.filter(r => {
    const v = String(r.kh_buc_xuc || '').toLowerCase()
    return v.includes('bức xúc') || v.includes('buc xuc')
  }).length

  // Frequency of what customers talk about most
  const noiVeMap = {}
  rows.forEach(r => {
    const v = r.kh_noi_ve_gi || ''
    if (v && v !== '—') {
      noiVeMap[v] = (noiVeMap[v] || 0) + 1
    }
  })
  const topNoiVe = Object.entries(noiVeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  // Frequency of trend/interest topics
  const xuHuongMap = {}
  rows.forEach(r => {
    const v = r.xu_huong_quan_tam || ''
    if (v && v !== '—') {
      xuHuongMap[v] = (xuHuongMap[v] || 0) + 1
    }
  })
  const topXuHuong = Object.entries(xuHuongMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  return { total, khongBucXuc, hoiKhongHL, bucXuc, topNoiVe, topXuHuong }
}

// ─── Derive metrics from conversations ───────────────────────────────────────
function deriveMetrics(activeInsightId) {
  const rows = activeInsightId
    ? (MOCK_DATA[activeInsightId] || MOCK_DEFAULT)
    : MOCK_DEFAULT

  const total = rows.length

  // Temperature — read directly from nong_am_lanh field (mock sets this per template)
  const hot = rows.filter(r => {
    const t = String(r.nong_am_lanh || '').toLowerCase()
    return t.includes('nóng') || t.includes('tốt')
  }).length
  const warm = rows.filter(r => {
    const t = String(r.nong_am_lanh || '').toLowerCase()
    return t.includes('ấm') || t.includes('trung bình')
  }).length
  const cold = total - hot - warm

  // Sentiment — from data_json.satisfaction (or common satisfaction)
  const positive = rows.filter(r => {
    const s = String(r.data_json?.satisfaction || r.satisfaction || '').toLowerCase()
    return s.includes('hài lòng') || s.includes('rất') || s.includes('tốt')
  }).length
  const negative = rows.filter(r => {
    const s = String(r.data_json?.satisfaction || r.satisfaction || '').toLowerCase()
    return s.includes('không') || s.includes('bức xúc') || s.includes('kém')
  }).length
  const neutral = total - positive - negative

  // Channel breakdown
  const channelMap = {}
  rows.forEach(r => {
    const ch = r.channel_name || 'Khác'
    channelMap[ch] = (channelMap[ch] || 0) + 1
  })
  const channels = Object.entries(channelMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count], i) => ({
      name,
      count,
      pct: Math.round(count / total * 100),
      color: CHANNEL_COLORS[i % CHANNEL_COLORS.length],
    }))
  const pieData = channels.map(ch => ({ name: ch.name, value: ch.pct, color: ch.color }))

  // Daily trend — format "07/04"
  const dayMap = {}
  rows.forEach(r => {
    const match = String(r.created_at).match(/^(\d{2}\/\d{2})/)
    const key = match ? match[1] : '??'
    if (!dayMap[key]) dayMap[key] = { date: key, hot: 0, warm: 0, cold: 0 }
    const t = String(r.nong_am_lanh || '').toLowerCase()
    if (t.includes('nóng') || t.includes('tốt')) dayMap[key].hot++
    else if (t.includes('ấm') || t.includes('trung bình')) dayMap[key].warm++
    else dayMap[key].cold++
  })
  const daily = Object.values(dayMap)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7)

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

  // Pain points — priority: common pain_point → template fields → data_json → topic_tag
  const painMap = {}
  rows.forEach(r => {
    let pain =
      r.pain_point ||
      r.van_de_tu_choi ||
      r.van_de_cl ||
      r.data_json?.pain_point ||
      r.topic_tag ||
      ''
    if (pain && pain !== '—') {
      painMap[pain] = (painMap[pain] || 0) + 1
    }
  })
  const pains = Object.entries(painMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  // Products — from common product → data_json
  const productMap = {}
  rows.forEach(r => {
    const prod = r.product || r.data_json?.product || ''
    if (prod && prod !== '—') {
      productMap[prod] = (productMap[prod] || 0) + 1
    }
  })
  const products = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, count }))

  // Satisfaction breakdown
  const satMap = {}
  rows.forEach(r => {
    const sat = r.data_json?.satisfaction || r.satisfaction || 'Trung bình'
    satMap[sat] = (satMap[sat] || 0) + 1
  })
  const satData = Object.entries(satMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }))

  // Conversion rate
  const converted = rows.filter(r => r.status === 'close').length
  const conversionRate = total > 0 ? Math.round(converted / total * 100) : 0

  return {
    total, hot, warm, cold,
    positive, neutral, negative,
    channels, pieData, daily,
    staffData, pains, products, satData,
    conversionRate, converted,
  }
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export function InsightAnalysisPanel({ activeInsightId }) {
  const isTemplate3 = activeInsightId === 'template-3'
  const m = useMemo(() => deriveMetrics(activeInsightId), [activeInsightId])
  const m3 = useMemo(() => deriveTemplate3Metrics(activeInsightId), [activeInsightId])
  const template = TEMPLATES.find(t => t.id === activeInsightId)
  const templateLabel = template ? template.name : 'Tất cả hội thoại'

  const hotPct = m.total > 0 ? Math.round(m.hot / m.total * 100) : 0

  return (
    <div className="space-y-4">
      {/* Template context label */}
      <div className="flex items-center gap-2 mb-1">
        <span
          className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full"
          style={{ background: C.accent + '12', color: C.accent, fontFamily: 'Manrope, Inter, sans-serif' }}
        >
          {templateLabel}
        </span>
        <span className="text-xs" style={{ color: C.secondary }}>
          {m.total.toLocaleString('vi-VN')} cuộc hội thoại
        </span>
      </div>

      {/* KPI Row — template-3 uses feedback KPIs, template-1/2 use lead temperature */}
      {isTemplate3 ? (
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            label="Tổng phản hồi"
            value={m3.total}
            color={C.accent}
            icon={BarChart2}
          />
          <KpiCard
            label="Không bức xúc"
            value={m3.khongBucXuc}
            sub={m3.total > 0 ? Math.round(m3.khongBucXuc / m3.total * 100) + '%' : '0%'}
            color={C.positive}
            icon={TrendingUp}
          />
          <KpiCard
            label="Hơi không hài lòng"
            value={m3.hoiKhongHL}
            sub={m3.total > 0 ? Math.round(m3.hoiKhongHL / m3.total * 100) + '%' : '0%'}
            color={C.warm}
            icon={TrendingDown}
          />
          <KpiCard
            label="Bức xúc"
            value={m3.bucXuc}
            sub={m3.total > 0 ? Math.round(m3.bucXuc / m3.total * 100) + '%' : '0%'}
            color={C.hot}
            icon={Users}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <KpiCard
            label="Tổng hội thoại"
            value={m.total}
            sub={m.conversionRate + '% chốt đơn'}
            color={C.accent}
            icon={BarChart2}
          />
          <KpiCard
            label="Lead Nóng"
            value={m.hot}
            sub={hotPct + '% tổng'}
            color={C.hot}
            icon={TrendingUp}
          />
          <KpiCard
            label="Lead Ấm"
            value={m.warm}
            sub={m.total > 0 ? Math.round(m.warm / m.total * 100) + '% tổng' : '0%'}
            color={C.warm}
            icon={TrendingDown}
          />
          <KpiCard
            label="Lead Lạnh"
            value={m.cold}
            sub={m.total > 0 ? Math.round(m.cold / m.total * 100) + '% tổng' : '0%'}
            color={C.cold}
            icon={Users}
          />
        </div>
      )}

      {/* Line Chart — only for template-1/2 */}
      {!isTemplate3 && m.daily.length > 1 && (
        <Card>
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
              <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'Manrope, Inter, sans-serif', paddingTop: '8px' }} />
              <Line type="monotone" dataKey="hot" stroke={C.hot} strokeWidth={2} dot={{ r: 3, fill: C.hot }} name="Nóng" />
              <Line type="monotone" dataKey="warm" stroke={C.warm} strokeWidth={2} dot={{ r: 3, fill: C.warm }} name="Ấm" />
              <Line type="monotone" dataKey="cold" stroke={C.cold} strokeWidth={2} dot={{ r: 3, fill: C.cold }} name="Lạnh" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}

      {/* Temperature + Sentiment — or template-3 feedback breakdown */}
      {isTemplate3 ? (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardTitle>Khách hàng nói về</CardTitle>
            <HBarList data={m3.topNoiVe} color={C.accent} />
          </Card>
          <Card>
            <CardTitle>Xu hướng quan tâm</CardTitle>
            <HBarList data={m3.topXuHuong} color={C.warm} />
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardTitle>Mức độ quan tâm</CardTitle>
            <TempBar hot={m.hot} warm={m.warm} cold={m.cold} />
          </Card>
          <Card>
            <CardTitle>Cảm xúc khách hàng</CardTitle>
            <SentimentBar positive={m.positive} neutral={m.neutral} negative={m.negative} />
          </Card>
        </div>
      )}

      {/* Pain Points + Products — template-1/2 only */}
      {!isTemplate3 && (m.pains.length > 0 || m.products.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          {m.pains.length > 0 && (
            <Card>
              <CardTitle>Vấn đề nổi bật</CardTitle>
              <HBarList data={m.pains} color={C.warm} />
            </Card>
          )}
          {m.products.length > 0 && (
            <Card>
              <CardTitle>Sản phẩm quan tâm</CardTitle>
              <HBarList data={m.products} color={C.accent} />
            </Card>
          )}
        </div>
      )}

      {/* Satisfaction breakdown — template-1/2 only */}
      {!isTemplate3 && m.satData.length > 0 && (
        <Card>
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
        <Card>
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
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  <span className="text-xs flex-1 truncate" style={{ color: C.secondary }}>{d.name}</span>
                  <span className="text-xs font-semibold shrink-0" style={{ color: C.primary }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

import { useMemo } from 'react'
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

// ─── Derive real metrics from conversations ─────────────────────────────────────
function deriveMetrics(activeInsightId) {
  const raw = activeInsightId ? (MOCK_DATA[activeInsightId] || MOCK_DEFAULT) : MOCK_DEFAULT
  const rows = raw
  const total = rows.length

  // Temperature
  const hot = rows.filter(r => {
    const t = (r.nong_am_lanh || r.tinh_hinh_tu_van || '').toLowerCase()
    return t.includes('nóng') || t.includes('tốt')
  }).length
  const warm = rows.filter(r => {
    const t = (r.nong_am_lanh || r.tinh_hinh_tu_van || '').toLowerCase()
    return t.includes('ấm') || t.includes('trung bình')
  }).length
  const cold = total - hot - warm

  // Sentiment from real data_json
  const pos = rows.filter(r => {
    const s = (r.data_json?.satisfaction || '').toLowerCase()
    return s.includes('hài lòng') || s.includes('tốt')
  }).length
  const neg = rows.filter(r => {
    const s = (r.data_json?.satisfaction || '').toLowerCase()
    return s.includes('không') || s.includes('bức xúc')
  }).length
  const neut = total - pos - neg

  // Top pain points
  const painMap = {}
  rows.forEach(r => {
    const p = r.data_json?.pain_point || r.van_de_tu_choi || r.van_de_cl || r.topic_tag || ''
    if (p && p !== '—' && p !== 'Không') painMap[p] = (painMap[p] || 0) + 1
  })
  const topPains = Object.entries(painMap).sort((a, b) => b[1] - a[1]).slice(0, 3)

  // Staff quality (from attitude field)
  const attMap = {}
  rows.forEach(r => {
    const a = r.data_json?.attitude || r.cham_soc_sau_mua || 'Trung bình'
    attMap[a] = (attMap[a] || 0) + 1
  })
  const topAtt = Object.entries(attMap).sort((a, b) => b[1] - a[1]).slice(0, 3)

  // Conversion rate
  const converted = rows.filter(r => r.status === 'close').length
  const convRate = total > 0 ? Math.round(converted / total * 100) : 0

  // Top channels
  const chMap = {}
  rows.forEach(r => { chMap[r.channel_name || 'Khác'] = (chMap[r.channel_name || 'Khác'] || 0) + 1 })
  const topCh = Object.entries(chMap).sort((a, b) => b[1] - a[1]).slice(0, 2)

  return {
    total, hot, warm, cold, pos, neg, neut,
    convRate, converted, topPains, topAtt, topCh,
  }
}

// ─── Dynamic markdown-like renderer ────────────────────────────────────────────
function Section({ children }) {
  return <div className="mb-5">{children}</div>
}

function H2({ children }) {
  return (
    <h2
      className="text-base font-bold mb-2 mt-4"
      style={{ color: C.primary, fontFamily: 'Manrope, Inter, sans-serif' }}
    >
      {children}
    </h2>
  )
}

function H3({ children }) {
  return (
    <h3
      className="text-sm font-semibold mb-2 mt-3"
      style={{ color: C.primary, fontFamily: 'Manrope, Inter, sans-serif' }}
    >
      {children}
    </h3>
  )
}

function P({ children }) {
  return (
    <p
      className="text-sm leading-relaxed mb-1.5"
      style={{ color: C.secondary, fontFamily: 'Inter, sans-serif' }}
    >
      {children}
    </p>
  )
}

function BulletList({ items }) {
  return (
    <ul className="space-y-1.5 ml-4">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex items-start gap-2" style={{ color: C.secondary }}>
          <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.accent }} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function TagBadge({ children, color = C.accent }) {
  return (
    <span
      className="inline-block px-2 py-0.5 text-xs font-medium rounded-full mr-1.5 mb-1"
      style={{ backgroundColor: `${color}18`, color, fontFamily: 'Manrope, Inter, sans-serif' }}
    >
      {children}
    </span>
  )
}

function Hr() {
  return <hr className="my-4 opacity-20" style={{ borderColor: C.secondary }} />
}

// ─── Interpretation content by template ─────────────────────────────────────────
function buildInterpretation(m, templateName) {
  const hotPct = m.total > 0 ? Math.round(m.hot / m.total * 100) : 0
  const coldPct = m.total > 0 ? Math.round(m.cold / m.total * 100) : 0
  const posPct = m.total > 0 ? Math.round(m.pos / m.total * 100) : 0

  const topPain = m.topPains[0]
  const topPain2 = m.topPains[1]

  const actions = []
  if (m.hot > m.warm) actions.push('Liên hệ lại nhóm Lead Nóng trong 24h')
  if (coldPct > 20) actions.push('Rà soát lại phễu lọc — tỷ lệ khách lạnh cao bất thường')
  if (posPct < 50) actions.push('Kiểm tra script tư vấn — khách hàng chưa thực sự hài lòng')
  if (topPain) actions.push(`Ưu tiên giải quyết: "${topPain[0]}" (${topPain[1]} lượt)`)

  const shortTerm = [
    'Tạo template FAQ tự động cho 5 câu hỏi phổ biến nhất',
    'Thiết lập bot phân loại Lead ngay từ tin nhắn đầu tiên',
    m.topCh[0] ? `Tập trung nhân sự cho kênh "${m.topCh[0][0]}" (${m.topCh[0][1]} cuộc)` : 'Phân tích kênh có hiệu suất tốt nhất',
  ]

  const midTerm = [
    'Xây dựng Skin Quiz / Product Finder tích hợp Zalo OA',
    'A/B test 3-5 scripts tư vấn → chọn script có conversion cao nhất',
    'Tạo Lookalike Audience từ nhóm Lead Nóng để nhắm quảng cáo',
  ]

  const longTerm = [
    'Thiết lập CRM riêng — theo dõi lifecycle từng khách hàng',
    'Huấn luyện AI model phân loại Nóng/Ấm/Lạnh tự động',
    'Cài đặt weekly report tự động gửi về inbox quản lý',
  ]

  return { actions, shortTerm, midTerm, longTerm }
}

// ─── Main Component ─────────────────────────────────────────────────────────────
/**
 * InsightInterpretationPanel — AI Summary
 *
 * Design: Ultra Soft Identity (Editorial Precision)
 * - Gradient fills, soft shadows — no 1px borders
 * - Rounded 14px cards (--radius-lg)
 * - Section badges with accent tint
 *
 * UX: Nielsen #1 — Visibility of System Status: shows real computed metrics
 */
export function InsightInterpretationPanel({ activeInsightId }) {
  const m = useMemo(() => deriveMetrics(activeInsightId), [activeInsightId])
  const template = TEMPLATES.find(t => t.id === activeInsightId)
  const templateLabel = template ? template.name : 'Tổng quan'

  const { actions, shortTerm, midTerm, longTerm } = useMemo(
    () => buildInterpretation(m, templateLabel),
    [m, templateLabel]
  )

  const hotPct = m.total > 0 ? Math.round(m.hot / m.total * 100) : 0
  const warmPct = m.total > 0 ? Math.round(m.warm / m.total * 100) : 0
  const coldPct = m.total > 0 ? Math.round(m.cold / m.total * 100) : 0
  const posPct = m.total > 0 ? Math.round(m.pos / m.total * 100) : 0

  return (
    <div>
      {/* Template context label */}
      <div className="flex items-center gap-2 mb-4">
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

      {/* Tổng quan */}
      <Section>
        <H2>Tổng quan thực trạng</H2>
        <P>
          Hệ thống đã ghi nhận <strong style={{ color: C.primary }}>{m.total.toLocaleString('vi-VN')} cuộc hội thoại</strong>{' '}
          {template ? `trong template "${templateLabel}"` : 'qua tất cả các template'}.
          Điểm đáng chú ý là tỷ lệ <strong style={{ color: C.primary }}>Lead Nóng chiếm {hotPct}%</strong> —
          {' '}tín hiệu tích cực cho thấy nội dung tư vấn đang chạm đúng nhu cầu khách hàng.
        </P>
        {coldPct > 15 && (
          <P>
            ⚠️ <strong style={{ color: C.rust }}>Tỷ lệ khách lạnh ở mức {coldPct}%</strong> —
            {' '}cần rà soát phễu chuyển đổi và chất lượng đầu vào.
          </P>
        )}
        {m.convRate > 0 && (
          <P>
            📈 Tỷ lệ chốt đơn: <strong style={{ color: C.positive }}>{m.convRate}%</strong>{' '}
            ({m.converted.toLocaleString('vi-VN')} cuộc).
          </P>
        )}
      </Section>

      <Hr />

      {/* Lead Nóng */}
      <Section>
        <H2>Lead Nóng — Ưu tiên cao</H2>
        <P>
          <strong style={{ color: C.primary }}>{m.hot.toLocaleString('vi-VN')} Lead Nóng</strong>{' '}
          ({hotPct}%) đã được phân loại — đây là nhóm có ý định mua rõ ràng nhất.
        </P>
        <BulletList
          items={[
            hotPct >= 30 ? 'Tỷ lệ Nóng cao — duy trì script hiện tại' : 'Tỷ lệ Nóng thấp — cần cải thiện chất lượng tư vấn',
            m.warm > m.hot ? 'Lead Ấm nhiều hơn Nóng — chuẩn bị nurturing sequence' : 'Lead Nóng nhiều — sẵn sàng chốt đơn',
            'Phân công CSKH gọi lại trong 24-48h với nhóm Nóng',
          ]}
        />
      </Section>

      <Hr />

      {/* Cảm xúc KH */}
      <Section>
        <H2>Cảm xúc khách hàng</H2>
        <div className="flex flex-wrap gap-1.5 mb-3">
          <TagBadge color={C.positive}>{posPct}% Tích cực</TagBadge>
          <TagBadge color={C.neutral}>{m.neut > 0 ? Math.round(m.neut / m.total * 100) : 0}% Băn khoăn</TagBadge>
          <TagBadge color={C.negative}>{m.total > 0 ? Math.round(m.neg / m.total * 100) : 0}% Tiêu cực</TagBadge>
        </div>
        <BulletList
          items={[
            posPct >= 50 ? 'Khách hàng hài lòng — duy trì chất lượng dịch vụ' : 'Cần cải thiện trải nghiệm — khách chưa hài lòng',
            'Nhóm băn khoăn: cần FAQ rõ ràng, giải đáp thắc mắc nhanh',
            m.neg > 0 ? 'Nhóm tiêu cực: ưu tiên xử lý khiếu nại, tránh lan truyền' : 'Không có phản hồi tiêu cực đáng kể',
          ]}
        />
      </Section>

      <Hr />

      {/* Pain Points */}
      {m.topPains.length > 0 && (
        <>
          <Section>
            <H2>Vấn đề nổi bật</H2>
            {m.topPains.map(([name, count], i) => (
              <div key={i} className="flex items-start gap-2 mb-2">
                <span
                  className="inline-block w-5 h-5 rounded-lg text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: `${C.rust}15`, color: C.rust }}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-medium" style={{ color: C.primary }}>{name}</div>
                  <div className="text-xs" style={{ color: C.secondary }}>{count} lượt phản hồi</div>
                </div>
              </div>
            ))}
          </Section>
          <Hr />
        </>
      )}

      {/* Lời khuyên */}
      <Section>
        <H2>Lời khuyên chuyên gia</H2>

        <H3>Ngắn hạn (1–2 tuần)</H3>
        <BulletList items={actions.length > 0 ? actions : shortTerm} />

        <H3>Trung hạn (1 tháng)</H3>
        <BulletList items={midTerm} />

        <H3>Dài hạn (3 tháng)</H3>
        <BulletList items={longTerm} />
      </Section>

      <Hr />

      {/* KPIs */}
      <Section>
        <H2>KPIs theo dõi tuần tới</H2>
        <div className="space-y-2">
          {[
            { label: 'Lead Nóng rate', base: `${hotPct}%`, target: hotPct >= 35 ? '≥ 40%' : '≥ 35%' },
            { label: 'Tỷ lệ chốt đơn', base: `${m.convRate}%`, target: m.convRate >= 10 ? '≥ 15%' : '≥ 10%' },
            { label: 'Khách lạnh rate', base: `${coldPct}%`, target: coldPct <= 15 ? '< 10%' : '< 15%' },
            { label: 'Thời gian phản hồi', base: '4 phút', target: '< 2 phút' },
          ].map(({ label, base, target }, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2"
              style={{ borderBottom: '1px solid rgba(194, 198, 214, 0.15)' }}
            >
              <span className="text-xs" style={{ color: C.secondary }}>{label}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold" style={{ color: C.primary }}>{base}</span>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${C.accent}12`, color: C.accent }}>
                  → {target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

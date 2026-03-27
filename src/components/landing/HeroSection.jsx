import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Sparkles, MessageSquare, TrendingUp, Zap, Users, Thermometer, AlertCircle, Target, Star } from 'lucide-react';
import { landingStats } from '../../data/landingTestimonials';

// ─── Rich conversation data generator (~15K rows) ───────────────────────────
const PRODUCTS = ['Kem nền', 'Xịt khoáng', 'Serum', 'Kem chống nắng', 'Sữa rửa mặt', 'Toner', 'Phấn nước', 'Son môi', 'Mặt nạ', 'Dưỡng ẩm'];
const SKIN_TYPES = ['Da dầu', 'Da hỗn hợp', 'Da khô', 'Da nhạy cảm', 'Da thường'];
const PAIN_POINTS = [
  'Lo ngại hàng fake', 'Hỏi về thành phần', 'Mụn ẩm sau sinh', 'Da lão hóa sớm',
  'Tìm màu phù hợp', 'Hỏi chồng', 'Cần tư vấn cá nhân', 'Dị ứng thành phần',
  'Muốn được giảm giá', 'Giá cao hơn chỗ khác', 'Ship lâu', 'Không có size',
];
const CITIES = ['TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Biên Hòa', 'Nha Trang', 'Hạ Long'];
const FIRST_NAMES = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Trương', 'Phan', 'Lý', 'Hà', 'Võ', 'Đỗ', 'Ngô'];
const LAST_NAMES = ['Hùng', 'Hà', 'Tuấn', 'Lan', 'Đức Anh', 'Mai', 'Quốc Bảo', 'Hương', 'Minh', 'Thanh', 'Phương', 'Anh', 'Khoa', 'Ngọc', 'Trang', 'Dũng', 'Linh', 'Hiếu', 'Toàn', 'Khánh'];

// Deterministic seeded random
function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateHeroConversations(count = 15000) {
  const rng = seededRng(42069);
  return Array.from({ length: count }, (_, i) => {
    const tempRoll = rng();
    const temp = tempRoll < 0.35 ? 'Nóng' : tempRoll < 0.60 ? 'Ấm' : 'Lạnh';
    const sentRoll = rng();
    const sentiment = sentRoll < 0.55 ? 'Tích cực' : sentRoll < 0.80 ? 'Băn khoăn' : 'Tiêu cực';
    const firstName = FIRST_NAMES[Math.floor(rng() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const first = rng() < 0.5 ? firstName : '';
    const name = `${first} ${lastName}`.trim();
    const isJunk = rng() < 0.06;
    const platform = rng() < 0.62 ? 'facebook' : 'zalo';
    const isReturning = rng() < 0.18;
    const sentAt = new Date(2026, 2, 15, Math.floor(rng() * 24), Math.floor(rng() * 60));

    return {
      id: `hero-${i}`,
      customer: name,
      platform,
      product: PRODUCTS[Math.floor(rng() * PRODUCTS.length)],
      skin_type: SKIN_TYPES[Math.floor(rng() * SKIN_TYPES.length)],
      pain_point: PAIN_POINTS[Math.floor(rng() * PAIN_POINTS.length)],
      temperature: temp,
      is_junk: isJunk,
      sentiment,
      gender: rng() < 0.68 ? 'Nữ' : 'Nam',
      location: CITIES[Math.floor(rng() * CITIES.length)],
      phone_status: rng() < 0.45 ? 'Đã cho SĐT' : rng() < 0.75 ? 'Chưa cho' : 'Khách từ chối',
      is_returning: isReturning,
      converted_at: sentAt.toISOString(),
      // Derived
      action: temp === 'Nóng' ? 'Chốt đơn' : temp === 'Ấm' ? 'Theo dõi' : 'Bỏ qua',
    };
  });
}

const ALL_CONVOS = generateHeroConversations(15000);

// ─── Computed stats (module-level, runs once at import) ──────────────────────
const STATS = (() => {
  const total = ALL_CONVOS.length;
  const hot = ALL_CONVOS.filter(r => r.temperature === 'Nóng').length;
  const warm = ALL_CONVOS.filter(r => r.temperature === 'Ấm').length;
  const cold = ALL_CONVOS.filter(r => r.temperature === 'Lạnh').length;
  const junk = ALL_CONVOS.filter(r => r.is_junk).length;
  const fb = ALL_CONVOS.filter(r => r.platform === 'facebook').length;
  const zalo = ALL_CONVOS.filter(r => r.platform === 'zalo').length;
  const pos = ALL_CONVOS.filter(r => r.sentiment === 'Tích cực').length;
  const neu = ALL_CONVOS.filter(r => r.sentiment === 'Băn khoăn').length;
  const neg = ALL_CONVOS.filter(r => r.sentiment === 'Tiêu cực').length;
  const returning = ALL_CONVOS.filter(r => r.is_returning).length;
  const phoneOk = ALL_CONVOS.filter(r => r.phone_status === 'Đã cho SĐT').length;
  const deal = ALL_CONVOS.filter(r => r.action === 'Chốt đơn').length;
  const follow = ALL_CONVOS.filter(r => r.action === 'Theo dõi').length;

  const productCounts = {};
  ALL_CONVOS.forEach(r => { productCounts[r.product] = (productCounts[r.product] || 0) + 1; });
  const topProducts = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);

  const painCounts = {};
  ALL_CONVOS.forEach(r => { painCounts[r.pain_point] = (painCounts[r.pain_point] || 0) + 1; });
  const topPains = Object.entries(painCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const cityCounts = {};
  ALL_CONVOS.forEach(r => { cityCounts[r.location] = (cityCounts[r.location] || 0) + 1; });
  const topCities = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const skinCounts = {};
  ALL_CONVOS.forEach(r => { skinCounts[r.skin_type] = (skinCounts[r.skin_type] || 0) + 1; });
  const topSkins = Object.entries(skinCounts).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return { total, hot, warm, cold, junk, fb, zalo, pos, neu, neg, returning, phoneOk, deal, follow, topProducts, topPains, topCities, topSkins };
})();

// ─── Tab bar ──────────────────────────────────────────────────────────────────
function TabBar({ tabs, active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 4, marginBottom: 12, background: 'rgba(26,33,56,0.04)', borderRadius: 8, padding: 4 }}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1, padding: '6px 12px', borderRadius: 6, border: 'none',
            fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s ease',
            background: active === tab.id ? '#fff' : 'transparent',
            color: active === tab.id ? '#1a2138' : '#6b7280',
            boxShadow: active === tab.id ? '0 1px 4px rgba(26,33,56,0.10)' : 'none',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// ─── Stat pill ────────────────────────────────────────────────────────────────
function StatPill({ label, value, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 8, padding: '8px 10px', textAlign: 'center', flex: 1 }}>
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.0625rem', color, margin: 0 }}>{value.toLocaleString('vi-VN')}</p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: '#6b7280', margin: '1px 0 0' }}>{label}</p>
    </div>
  );
}

// ─── Mini bar ────────────────────────────────────────────────────────────────
function MiniBar({ label, value, total, color }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#6b7280', width: 72, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 4, background: 'rgba(26,33,56,0.06)', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 100 }} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: '#1a2138', width: 32, textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

// ─── Temperature bar ─────────────────────────────────────────────────────────
function TempBar({ hot, warm, cold, total }) {
  const hp = Math.round((hot / total) * 100);
  const wp = Math.round((warm / total) * 100);
  const cp = 100 - hp - wp;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', height: 7, borderRadius: 100, overflow: 'hidden', gap: 2 }}>
        <div style={{ flex: hp, background: '#ef4444', borderRadius: '100px 0 0 100px' }} />
        <div style={{ flex: wp, background: '#f59e0b' }} />
        <div style={{ flex: cp, background: '#6b7280', borderRadius: '0 100px 100px 0' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {[
          ['#ef4444', `${hp}% Nóng`, hot],
          ['#f59e0b', `${wp}% Ấm`, warm],
          ['#6b7280', `${cp}% Lạnh`, cold],
        ].map(([c, l, v]) => (
          <div key={String(c)} style={{ textAlign: 'center', flex: 1 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: String(c) }}>{l}</span>
            <br />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: '#1a2138' }}>{v.toLocaleString('vi-VN')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Full conversation table ─────────────────────────────────────────────────
function ConversationTable({ rows }) {
  const COLS = [
    { key: 'customer', label: 'Khách hàng', width: 130 },
    { key: 'product', label: 'Sản phẩm', width: 100 },
    { key: 'skin_type', label: 'Loại da', width: 90 },
    { key: 'pain_point', label: 'Pain Point', width: 130 },
    { key: 'temperature', label: 'Mức độ', width: 68 },
    { key: 'sentiment', label: 'Cảm xúc', width: 82 },
    { key: 'phone_status', label: 'SĐT', width: 82 },
    { key: 'location', label: 'Khu vực', width: 72 },
    { key: 'platform', label: 'Kênh', width: 60 },
    { key: 'action', label: 'Hành động', width: 82 },
  ];

  const platformColor = { facebook: '#1877F2', zalo: '#0068FF' };
  const tempColor = { 'Nóng': '#ef4444', 'Ấm': '#f59e0b', 'Lạnh': '#6b7280' };
  const sentColor = { 'Tích cực': '#059669', 'Băn khoăn': '#f59e0b', 'Tiêu cực': '#ef4444' };
  const phoneColor = { 'Đã cho SĐT': '#059669', 'Chưa cho': '#6b7280', 'Khách từ chối': '#ef4444' };
  const actionColor = { 'Chốt đơn': '#059669', 'Theo dõi': '#f59e0b', 'Bỏ qua': '#6b7280' };

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: 220 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-body)', fontSize: 10 }}>
        <thead>
          <tr style={{ background: 'rgba(26,33,56,0.03)', position: 'sticky', top: 0 }}>
            {COLS.map(col => (
              <th key={col.key} style={{ padding: '6px 8px', textAlign: 'left', fontWeight: 600, color: '#6b7280', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: 9 }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ borderBottom: '1px solid rgba(26,33,56,0.04)', transition: 'background 0.1s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(26,33,56,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding: '7px 8px' }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#1a2138', margin: 0, fontSize: 10, lineHeight: 1.3 }}>{r.customer}</p>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: 9 }}>{r.gender} · {r.is_returning ? '🔁 KH cũ' : 'Khách mới'}</p>
                </div>
              </td>
              <td style={{ padding: '7px 8px', color: '#1a2138' }}>{r.product}</td>
              <td style={{ padding: '7px 8px', color: '#6b7280' }}>{r.skin_type}</td>
              <td style={{ padding: '7px 8px', color: '#6b7280', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.pain_point}</td>
              <td style={{ padding: '7px 8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, padding: '2px 7px', borderRadius: 100, background: `${tempColor[r.temperature]}15`, color: tempColor[r.temperature] }}>
                  {r.temperature}
                </span>
              </td>
              <td style={{ padding: '7px 8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 600, color: sentColor[r.sentiment] }}>
                  {r.sentiment === 'Tích cực' ? '✓ Tích cực' : r.sentiment === 'Tiêu cực' ? '! Tiêu cực' : '— Băn khoăn'}
                </span>
              </td>
              <td style={{ padding: '7px 8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 500, color: phoneColor[r.phone_status] }}>
                  {r.phone_status === 'Đã cho SĐT' ? '✓ Đã cho' : r.phone_status === 'Khách từ chối' ? '✗ Từ chối' : '— Chưa'}
                </span>
              </td>
              <td style={{ padding: '7px 8px', color: '#6b7280' }}>{r.location}</td>
              <td style={{ padding: '7px 8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, color: platformColor[r.platform] }}>
                  {r.platform === 'facebook' ? 'FB' : 'Zalo'}
                </span>
              </td>
              <td style={{ padding: '7px 8px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, color: actionColor[r.action] }}>
                  {r.action}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tab 1: Phân tích hội thoại ───────────────────────────────────────────────
function ConversationAnalysisTab() {
  const { total, hot, warm, cold, junk, fb, zalo, pos, neu, neg, topProducts, topPains, topCities } = STATS;

  return (
    <div>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        <StatPill label="Tổng hội thoại" value={total} color="#1a2138" bg="rgba(26,33,56,0.06)" />
        <StatPill label="Lead Nóng" value={hot} color="#ef4444" bg="rgba(239,68,68,0.08)" />
        <StatPill label="Lead Ấm" value={warm} color="#f59e0b" bg="rgba(245,158,11,0.08)" />
        <StatPill label="Khách rác" value={junk} color="#6b7280" bg="rgba(107,114,128,0.08)" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
        {/* Temperature */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Thermometer size={13} color="#ef4444" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#1a2138' }}>Mức độ quan tâm</span>
          </div>
          <TempBar hot={hot} warm={warm} cold={cold} total={total} />
        </div>

        {/* Sentiment */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <TrendingUp size={13} color="#0052FF" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#1a2138' }}>Cảm xúc khách hàng</span>
          </div>
          <MiniBar label="Tích cực" value={pos} total={total} color="#059669" />
          <MiniBar label="Băn khoăn" value={neu} total={total} color="#f59e0b" />
          <MiniBar label="Tiêu cực" value={neg} total={total} color="#ef4444" />
        </div>

        {/* Top products */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Target size={13} color="#0052FF" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#1a2138' }}>Sản phẩm quan tâm</span>
          </div>
          {topProducts.slice(0, 5).map(([p, n], i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, color: i === 0 ? '#0052FF' : '#6b7280', width: 14 }}>{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#1a2138', flex: 1 }}>{p}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 11, color: i === 0 ? '#0052FF' : '#6b7280' }}>{n.toLocaleString('vi-VN')}</span>
            </div>
          ))}
        </div>

        {/* Pain points */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <AlertCircle size={13} color="#f59e0b" />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#1a2138' }}>Pain Points nổi bật</span>
          </div>
          {topPains.map(([p, n]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#f59e0b', flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#1a2138', flex: 1, lineHeight: 1.4 }}>{p}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#6b7280' }}>{n.toLocaleString('vi-VN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Platform + Cities row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Theo kênh</p>
          <MiniBar label="Facebook" value={fb} total={total} color="#1877F2" />
          <MiniBar label="Zalo OA" value={zalo} total={total} color="#0068FF" />
        </div>
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Top khu vực</p>
          {topCities.map(([c, n]) => (
            <div key={c} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#1a2138' }}>{c}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 10, color: '#1a2138' }}>{n.toLocaleString('vi-VN')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conversation table */}
      <div style={{ background: '#fff', borderRadius: 10, padding: 14, border: '1px solid rgba(26,33,56,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Hội thoại gần đây</p>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#6b7280' }}>Top 50 / {total.toLocaleString('vi-VN')} hội thoại</span>
        </div>
        <ConversationTable rows={ALL_CONVOS.slice(0, 50)} />
      </div>
    </div>
  );
}

// ─── Tab 2: Đánh giá chất lượng tư vấn AI ──────────────────────────────────
function QualityTab() {
  const { total, hot, warm, junk, fb, zalo, pos, neg, phoneOk, deal, returning } = STATS;

  // Lead funnel
  const funnel = [
    { label: 'Lead Nóng', value: hot, max: total, color: '#ef4444', desc: 'Hỏi giá + xin SĐT + hỏi còn không' },
    { label: 'Thu thập SĐT', value: phoneOk, max: total, color: '#059669', desc: 'Đã để lại số điện thoại' },
    { label: 'Chốt đơn thành công', value: deal, max: total, color: '#0052FF', desc: 'Chuyển đổi thành công' },
    { label: 'Khách rác cần lọc', value: junk, max: total, color: '#6b7280', desc: 'Tin tự động / bấm nhầm' },
  ];

  return (
    <div>
      {/* Funnel */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Phễu Lead — {total.toLocaleString('vi-VN')} hội thoại
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {funnel.map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: '#1a2138' }}>{item.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 11, fontWeight: 700, color: item.color }}>
                  {item.value.toLocaleString('vi-VN')} <span style={{ color: '#6b7280', fontWeight: 400 }}>/ {total.toLocaleString('vi-VN')}</span>
                </span>
              </div>
              <div style={{ height: 7, background: 'rgba(26,33,56,0.06)', borderRadius: 100, overflow: 'hidden' }}>
                <div style={{ width: `${Math.round((item.value / item.max) * 100)}%`, height: '100%', background: item.color, borderRadius: 100, transition: 'width 0.8s ease' }} />
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: '#6b7280', margin: '2px 0 0' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 12 }}>
        {/* Platform */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Theo kênh</p>
          <MiniBar label="Facebook" value={fb} total={total} color="#1877F2" />
          <MiniBar label="Zalo OA" value={zalo} total={total} color="#0068FF" />
        </div>

        {/* Sentiment */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cảm xúc</p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 48 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${Math.round((pos / total) * 48)}px`, background: '#059669', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: '#6b7280' }}>Tích cực</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${Math.round(((total - pos - neg) / total) * 48)}px`, background: '#f59e0b', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: '#6b7280' }}>Băn khoăn</span>
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${Math.round((neg / total) * 48)}px`, background: '#ef4444', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: '#6b7280' }}>Tiêu cực</span>
            </div>
          </div>
        </div>

        {/* Returning */}
        <div style={{ background: '#fff', borderRadius: 10, padding: 14 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: '#6b7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>KH quay lại</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={16} color="#f59e0b" />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#f59e0b' }}>{returning.toLocaleString('vi-VN')}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#6b7280' }}>/ {total.toLocaleString('vi-VN')}</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: '#6b7280', marginTop: 4 }}>Khách hàng cũ quay lại mua</p>
          <div style={{ marginTop: 8 }}>
            <div style={{ height: 5, background: 'rgba(26,33,56,0.06)', borderRadius: 100 }}>
              <div style={{ width: `${Math.round((returning / total) * 100)}%`, height: '100%', background: '#f59e0b', borderRadius: 100 }} />
            </div>
          </div>
        </div>
      </div>

      {/* AI recommendation */}
      <div style={{ background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.15)', borderRadius: 10, padding: '12px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
          <Sparkles size={13} color="#0052FF" />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 700, color: '#0052FF' }}>Gợi ý từ AI</span>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: '#1a2138', lineHeight: 1.6, margin: 0 }}>
          Lead Nóng chiếm <strong style={{ color: '#ef4444' }}>{Math.round((hot / total) * 100)}%</strong> — tỉ lệ chốt đơn tiềm năng cao. Ưu tiên nhắn lại khách hàng <strong style={{ color: '#f59e0b' }}>Ấm ({warm.toLocaleString('vi-VN')} người)</strong> để chuyển thành Nóng. Phát hiện <strong style={{ color: '#6b7280' }}>{junk.toLocaleString('vi-VN')} khách rác</strong> — đề xuất chặn nguồn spam từ Facebook.
        </p>
      </div>
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ value, delay }) {
  const ref = useRef(null);
  const animated = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, delay);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <span ref={ref} style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.6s ease, transform 0.6s ease', display: 'block', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', color: '#fff', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
      {value}
    </span>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
export function HeroSection() {
  const heroRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const dashboardRef = useRef(null);
  const [activeTab, setActiveTab] = useState('conversation');

  useEffect(() => {
    const els = [badgeRef.current, headlineRef.current, subRef.current, ctaRef.current, dashboardRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      requestAnimationFrame(() => {
        setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, i * 100 + 100);
      });
    });
  }, []);

  const TABS = [
    { id: 'conversation', label: '📊 Phân tích hội thoại' },
    { id: 'quality', label: '🤖 Đánh giá chất lượng tư vấn AI' },
  ];

  return (
    <section ref={heroRef} style={{ background: 'linear-gradient(148deg, #0a0f1e 0%, #1a2138 35%, #0d1530 65%, #1a2138 100%)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Glows + grid */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-10%', right: '-5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '0%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(191,48,3,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(80px, 12vw, 120px) clamp(24px, 5vw, 64px) clamp(60px, 8vw, 100px)', position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

        {/* Badge */}
        <div ref={badgeRef} style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.5s ease, transform 0.5s ease', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(191,48,3,0.12)', border: '1px solid rgba(191,48,3,0.30)', marginBottom: 28 }}>
          <Sparkles size={13} color="#BF3003" strokeWidth={2} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: '#ff8a70' }}>AI-Powered · Đa kênh · Thông minh</span>
        </div>

        {/* Headline */}
        <h1 ref={headlineRef} style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: 'clamp(2.25rem, 5vw, 4rem)', lineHeight: 1.1, letterSpacing: '-0.025em', color: '#fff', marginBottom: 24, maxWidth: 820 }}>
          Biết Khách Hàng Muốn Gì —<br /><span style={{ color: '#BF3003' }}>Trước Khi Họ Nói</span>
        </h1>

        {/* Sub */}
        <p ref={subRef} style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.6s ease, transform 0.6s ease', fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.125rem)', lineHeight: 1.7, color: 'rgba(255,255,255,0.62)', maxWidth: 600, marginBottom: 40 }}>
          AI phân tích hội thoại đa kênh (Facebook, Zalo) — đánh giá chất lượng lead, phát hiện khách rác và gợi ý tắt/bật chiến dịch quảng cáo tức thì.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ opacity: 0, transform: 'translateY(12px)', transition: 'opacity 0.6s ease, transform 0.6s ease', display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 64 }}>
          <a href="#lead-form" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 32px', borderRadius: 8, background: '#BF3003', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600, boxShadow: '0 8px 32px rgba(191,48,3,0.40)', cursor: 'pointer', transition: 'all 0.15s ease', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(191,48,3,0.50)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(191,48,3,0.40)'; }}>
            Trải nghiệm miễn phí <ArrowRight size={17} strokeWidth={2.2} />
          </a>
          <a href="#how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
            Xem cách hoạt động
          </a>
        </div>

        {/* ── REAL AI INSIGHT DASHBOARD ── */}
        <div ref={dashboardRef} style={{ opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.6s ease, transform 0.6s ease', width: '100%', maxWidth: 960, borderRadius: 12, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.08)' }} role="img" aria-label="AI Insight Dashboard — Phân tích hội thoại">

          {/* Browser chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />)}
            <div style={{ marginLeft: 12, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>app.yoursaas.vn / insight / settings</div>
          </div>

          {/* Content */}
          <div style={{ background: '#f0f2f5', padding: '14px 16px 16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <MessageSquare size={14} color="#0052FF" />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: '#1a2138' }}>AI Insight — Mỹ phẩm</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 100, background: 'rgba(0,82,255,0.10)', color: '#0052FF' }}>cos-1</span>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: '#6b7280' }}>15.000 hội thoại · 7 ngày</span>
            </div>

            {/* Tab bar */}
            <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />

            {/* Tab content */}
            {activeTab === 'conversation' ? <ConversationAnalysisTab /> : <QualityTab />}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { ...landingStats[0], icon: MessageSquare },
            { ...landingStats[1], icon: Users },
            { ...landingStats[2], icon: TrendingUp },
            { ...landingStats[3], icon: Zap },
          ].map(({ value, label }, i) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 48px', gap: 4 }}>
              <AnimatedCounter value={value} delay={i * 120 + 200} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.50)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

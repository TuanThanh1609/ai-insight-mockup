/**
 * MedicalCheckupLanding — Landing page riêng cho "Khám Bệnh Hội Thoại"
 * Goal: Lead capture — thu hút đăng ký dùng thử
 * Design System: Editorial Precision
 * - Primary: #1A2138 Deep Navy
 * - Secondary: #BF3003 Deep Rust (CTAs, urgency)
 * - Tertiary: #0052FF Vibrant Blue (digital pulse)
 * - Surface: #fcf8fb warm off-white
 */
import { useState } from 'react';
import { Stethoscope, ArrowRight, ChevronRight, CheckCircle2, AlertTriangle, TrendingUp, Users, MessageSquare, Zap } from 'lucide-react';

export { MedicalCheckupLanding };
export { HeroMedicalSection };
export { ProblemMedicalSection };
export { HowItWorksMedicalSection };
export { DiseaseGroupsSection };
export { ResultsPreviewSection };
export { LeadFormMedicalSection };
export { FooterMedicalSection };

// ─── Shared Design Tokens ────────────────────────────────────────────────────
const C = {
  navy: '#1A2138',
  rust: '#BF3003',
  blue: '#0052FF',
  green: '#059669',
  amber: '#d97706',
  red: '#dc2626',
  surface: '#fcf8fb',
  white: '#ffffff',
  muted: '#6b7280',
  border: '#f0f0f0',
};

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 1: HERO
// ─── ─────────────────────────────────────────────────────────────────────────

function DiseaseScoreBar({ label, score, color, bgColor }) {
  const pct = Math.round((score / 10) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: '#6b7280', width: 96, flexShrink: 0, lineHeight: 1.3 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 100, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 100 }} />
      </div>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.6875rem', color, width: 28, textAlign: 'right' }}>{score.toFixed(1)}</span>
    </div>
  );
}

function HeroMedicalSection() {
  return (
    <section style={{
      background: 'linear-gradient(148deg, #0a0f1e 0%, #1A2138 35%, #0d1530 65%, #1A2138 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '-10%', right: '-5%', width: '55%', height: '70%', background: 'radial-gradient(ellipse at center, rgba(0,82,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', bottom: '0%', left: '-10%', width: '50%', height: '60%', background: 'radial-gradient(ellipse at center, rgba(191,48,3,0.10) 0%, transparent 65%)', pointerEvents: 'none' }} />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '32px 32px', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: 'clamp(80px, 12vw, 120px) clamp(24px, 5vw, 64px) clamp(60px, 8vw, 100px)',
        position: 'relative', zIndex: 1, textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100,
          background: 'rgba(191,48,3,0.12)', border: '1px solid rgba(191,48,3,0.30)',
          marginBottom: 28,
        }}>
          <Stethoscope size={13} color={C.rust} strokeWidth={2} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: '#ff8a70' }}>
            Tính năng mới · AI Insight
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
          lineHeight: 1.1, letterSpacing: '-0.025em',
          color: '#fff', marginBottom: 24, maxWidth: 820,
        }}>
          Shop bạn đang <span style={{ color: C.rust }}>"có bệnh"</span><br />
          mà chưa biết — Khám ngay
        </h1>

        {/* Sub */}
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: 'clamp(1rem, 2vw, 1.125rem)',
          lineHeight: 1.7, color: 'rgba(255,255,255,0.62)',
          maxWidth: 580, marginBottom: 40,
        }}>
          AI phân tích hội thoại → chẩn đoán 10 nhóm bệnh → gợi ý hành động cụ thể.
          Biết ngay team đang losing khách ở đâu.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 64 }}>
          <a href="#lead-form" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 32px', borderRadius: 8,
            background: C.rust, color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
            boxShadow: '0 8px 32px rgba(191,48,3,0.40)', cursor: 'pointer',
            transition: 'all 0.15s ease', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(191,48,3,0.50)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(191,48,3,0.40)'; }}>
            Khám bệnh miễn phí <ArrowRight size={17} strokeWidth={2.2} />
          </a>
          <a href="#how-it-works" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px', borderRadius: 8,
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)',
            color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
            fontWeight: 500, cursor: 'pointer', transition: 'all 0.15s ease', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.10)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}>
            Xem cách hoạt động
          </a>
        </div>

        {/* ── HEALTH SCORE DASHBOARD PREVIEW ── */}
        <div style={{
          width: '100%', maxWidth: 960, borderRadius: 12, overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.08)',
          textAlign: 'left',
        }} role="img" aria-label="Khám Bệnh Hội Thoại — Health Score Dashboard">

          {/* Browser chrome */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, display: 'block' }} />)}
            <div style={{ marginLeft: 12, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.40)' }}>app.yoursaas.vn / insight / medical-checkup</div>
          </div>

          {/* Content */}
          <div style={{ background: '#f0f2f5', padding: '16px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Stethoscope size={14} color={C.rust} />
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: C.navy }}>Hồ Sơ Bệnh Án — Mỹ Phẩm</span>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: C.muted }}>Cập nhật real-time · 28/03/2026</span>
            </div>

            {/* Health Score Card */}
            <div style={{ background: '#fff', borderRadius: 10, padding: 16, marginBottom: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
              {/* Score */}
              <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2.5rem', color: C.amber, lineHeight: 1 }}>6.4</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 2 }}>/ 10 điểm</div>
                <div style={{ marginTop: 8, height: 8, background: '#f0f0f0', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ width: '64%', height: '100%', background: `linear-gradient(90deg, ${C.amber}, ${C.rust})`, borderRadius: 100 }} />
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: C.amber, fontWeight: 600, display: 'block', marginTop: 4 }}>CẦN CẢI THIỆN</span>
              </div>

              {/* Disease scores */}
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>ĐÓNG GÓP THEO NHÓM BỆNH</p>
                <DiseaseScoreBar label="Chất Lượng Nguồn Lead" score={7.2} color={C.green} />
                <DiseaseScoreBar label="Nhân Viên Tư Vấn" score={4.8} color={C.amber} />
                <DiseaseScoreBar label="CSKH & Hậu Mua" score={6.4} color={C.blue} />
                <DiseaseScoreBar label="Đối Thủ Cạnh Tranh" score={8.6} color={C.green} />
                <DiseaseScoreBar label="Upsell / Cross-sell" score={4.6} color={C.red} />
                <DiseaseScoreBar label="Kịch Bản Tư Vấn" score={7.2} color={C.green} />
              </div>
            </div>

            {/* Top alert + KPIs row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 8 }}>
              {[
                { icon: AlertTriangle, label: 'Upsell / Cross-sell', value: '4.6', sub: 'YẾU NHẤT', color: C.red, bg: 'rgba(220,38,38,0.06)' },
                { icon: Users, label: 'Nhân Viên Tư Vấn', value: '4.8', sub: 'Cần cải thiện', color: C.amber, bg: 'rgba(217,119,6,0.06)' },
                { icon: MessageSquare, label: 'Lead rác (Junk)', value: '23%', sub: '↑ 5% hôm nay', color: C.amber, bg: 'rgba(217,119,6,0.06)' },
                { icon: TrendingUp, label: 'Phản hồi TB', value: '18p', sub: '↓ 5p so tuần trước', color: C.green, bg: 'rgba(5,150,105,0.06)' },
              ].map(({ icon: Icon, label, value, sub, color, bg }) => (
                <div key={label} style={{ background: '#fff', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                    <Icon size={11} color={color} />
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color, lineHeight: 1 }}>{value}</div>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', color: C.muted, marginTop: 2 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Expert recommendation */}
            <div style={{ marginTop: 10, background: 'rgba(0,82,255,0.06)', border: '1px solid rgba(0,82,255,0.15)', borderRadius: 8, padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <Zap size={12} color={C.blue} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 700, color: C.blue, marginBottom: 3 }}>👨‍⚕️ CHUYÊN GIA SMAX GỢI Ý HÀNH ĐỘNG</p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: C.navy, lineHeight: 1.5, margin: 0 }}>
                  <strong style={{ color: C.red }}>[HIGH]</strong> Thêm upsell "Mua 2 giảm 15%" vào chat — ước tính ↑ 20% AOV. Kết hợp script chốt đơn cho Lead Nóng trong 5 phút đầu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.03)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { value: '10', label: 'Nhóm bệnh được chẩn đoán' },
            { value: '3 giây', label: 'Scan toàn bộ hồ sơ' },
            { value: '42', label: 'Template cho 7 ngành' },
            { value: '100%', label: 'Dùng thử miễn phí' },
          ].map(({ value, label }, i) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px 48px', gap: 4 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: '#fff', lineHeight: 1.1 }}>{value}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.50)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 2: PROBLEM — "Shop của bạn có bệnh gì?"
// ─── ─────────────────────────────────────────────────────────────────────────

const PROBLEMS = [
  {
    symptom: '"Tôi không biết team đang losing khách ở đâu"',
    disease: 'Không có hệ thống chẩn đoán',
    icon: '🔍',
    detail: 'Hàng trăm cuộc chat mỗi ngày — nhưng không ai biết tỉ lệ lead nóng, tỉ lệ junk, hay nhân viên nào đang mất khách.',
  },
  {
    symptom: '"Ads chạy hoài nhưng không có đơn"',
    disease: 'Chiến dịch đốt tiền vào khách rác',
    icon: '💸',
    detail: 'Chiến dịch có 40% junk lead — ngân sách đang bị đốt vào khách không có giá trị thay vì nhắm đúng đối tượng.',
  },
  {
    symptom: '"Sale nhắn lời lếch thẻm, khách bỏ đi"',
    disease: 'Kịch bản tư vấn yếu',
    icon: '📉',
    detail: 'Nhân viên trả lời theo cảm tính, không có script chốt đơn. Khách hỏi giá rồi biến mất — không có follow-up.',
  },
  {
    symptom: '"Đối thủ họ nhắc hoài mà không biết xử lý"',
    disease: 'Không phát hiện đối thủ kịp thời',
    icon: '⚔️',
    detail: 'Khách nhắc đến đối thủ trong chat nhưng nhân viên không biết cách phản biện — để mất khách vì so sánh giá.',
  },
];

function ProblemMedicalSection() {
  return (
    <section id="problems" style={{ background: C.navy, padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.rust, marginBottom: 12,
          }}>
            Triệu chứng
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Shop của bạn đang <span style={{ color: C.rust }}>"có bệnh"</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.55)', maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Không phải do team không cố gắng — mà vì không ai nhìn thấy bệnh để mà chữa.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {PROBLEMS.map((p, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, padding: 24, cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.borderColor = `${C.rust}40`; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <div style={{ fontSize: '2rem', marginBottom: 14 }}>{p.icon}</div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)', marginBottom: 10, fontStyle: 'italic' }}>"{p.symptom}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                <AlertTriangle size={12} color={C.rust} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: C.rust }}>{p.disease}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 3: HOW IT WORKS — 3 bước
// ─── ─────────────────────────────────────────────────────────────────────────

const HOW_STEPS = [
  {
    num: '01',
    icon: Stethoscope,
    color: C.blue,
    title: 'Kết nối & Khai báo',
    desc: 'Kết nối Fanpage (Facebook / Zalo OA). Khai báo ngành hàng và nhóm khách hàng mục tiêu.',
    badge: '2 phút',
  },
  {
    num: '02',
    icon: Zap,
    color: C.rust,
    title: 'AI chẩn đoán 10 nhóm bệnh',
    desc: 'AI phân tích toàn bộ hội thoại — phát hiện lead rác, lỗi tư vấn, kịch bản yếu, rủi ro pháp lý, và 6 nhóm khác.',
    badge: '3-10 phút',
  },
  {
    num: '03',
    icon: TrendingUp,
    color: C.green,
    title: 'Dashboard + Hành động cụ thể',
    desc: 'Đọc hồ sơ bệnh án trong 3 giây. Gợi ý hành động từ Chuyên gia Smax. Theo dõi cải thiện mỗi ngày.',
    badge: 'Ngay lập tức',
  },
];

function HowItWorksMedicalSection() {
  return (
    <section id="how-it-works" style={{ background: C.surface, padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.blue, marginBottom: 12,
          }}>
            Quy trình
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            color: C.navy, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Từ hội thoại lộn xộn đến<br /><span style={{ color: C.blue }}>hồ sơ bệnh án rõ ràng</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted, maxWidth: 460, margin: '0 auto', lineHeight: 1.65 }}>
            Không cần setup phức tạp. Không cần đọc từng chat. Chỉ cần kết nối → Khám → Hành động.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {HOW_STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{
                background: '#fff', borderRadius: 12, padding: 28,
                boxShadow: '0 4px 24px rgba(26,33,56,0.06)',
                border: '1px solid rgba(26,33,56,0.06)',
                position: 'relative',
              }}>
                {/* Step badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: `${step.color}12`, border: `2px solid ${step.color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={20} color={step.color} strokeWidth={1.8} />
                  </div>
                  <div>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.6875rem', color: '#fff', background: step.color, padding: '2px 8px', borderRadius: 100 }}>{step.num}</span>
                  </div>
                </div>

                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.125rem', color: C.navy, marginBottom: 10, letterSpacing: '-0.01em' }}>{step.title}</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>{step.desc}</p>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 100, background: `${step.color}10` }}>
                  <CheckCircle2 size={11} color={step.color} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, color: step.color }}>{step.badge}</span>
                </div>

                {/* Connector arrow */}
                {i < HOW_STEPS.length - 1 && (
                  <div style={{ position: 'absolute', right: -14, top: '50%', transform: 'translateY(-50%)', zIndex: 2, display: 'flex', alignItems: 'center' }}>
                    <ChevronRight size={20} color={C.muted} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 4: 10 NHÓM BỆNH
// ─── ─────────────────────────────────────────────────────────────────────────

const DISEASES = [
  { num: 1, icon: '📊', name: 'Chất Lượng Nguồn Lead', desc: 'Junk Lead, SĐT thu thập, tỉ lệ chốt đơn', severity: 'high', severityColor: C.rust },
  { num: 2, icon: '⏱️', name: 'Phản Hồi & Chăm Sóc', desc: 'Tốc độ phản hồi, remind KH, ưu đãi cá nhân hóa', severity: 'medium', severityColor: C.amber },
  { num: 3, icon: '🏆', name: 'Nhân Viên Tư Vấn', desc: 'Thái độ tư vấn, lỗi mất khách, tư vấn đúng', severity: 'medium', severityColor: C.amber },
  { num: 4, icon: '⚔️', name: 'Đối Thủ Cạnh Tranh', desc: 'Đối thủ nhắc đến, so sánh giá, phản biện', severity: 'low', severityColor: C.green },
  { num: 5, icon: '💬', name: 'CSKH & Hậu Mua', desc: 'Chương trình CSKH, review risk, urgency', severity: 'medium', severityColor: C.amber },
  { num: 6, icon: '🎯', name: 'Kịch Bản Tư Vấn', desc: 'Objection handling, script follow-up, khách bốc hơi', severity: 'medium', severityColor: C.amber },
  { num: 7, icon: '🔁', name: 'Cuộc Trò Chuyện Bỏ Dở', desc: 'Abandoned chat, no closure, no final message', severity: 'medium', severityColor: C.amber },
  { num: 8, icon: '🎨', name: 'Ngôn Ngữ & Cách Giao Tiếp', desc: 'Tone giọng, emoji, voice message, đoạn văn quá dài', severity: 'low', severityColor: C.green },
  { num: 9, icon: '📦', name: 'Upsell / Cross-sell', desc: 'Gợi ý sản phẩm bổ sung, upsell lên gói cao', severity: 'high', severityColor: C.rust },
  { num: 10, icon: '⚠️', name: 'Rủi Ro Pháp Lý', desc: 'Overpromising, cam kết 100%, đảm bảo hoàn tiền', severity: 'high', severityColor: C.rust },
];

const SEVERITY_LABEL = { high: 'Nghiêm trọng', medium: 'Trung bình', low: 'Nhẹ' };

function DiseaseGroupsSection() {
  return (
    <section id="diseases" style={{ background: '#fff', padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.rust, marginBottom: 12,
          }}>
            10 nhóm bệnh
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            color: C.navy, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            AI chẩn đoán <span style={{ color: C.blue }}>10 nhóm bệnh</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted, maxWidth: 500, margin: '0 auto', lineHeight: 1.65 }}>
            Mỗi nhóm bệnh có metrics cụ thể, điểm số, và hành động gợi ý từ Chuyên gia Smax.
          </p>
        </div>

        {/* Severity legend */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
          {[['Nghiêm trọng', C.rust], ['Trung bình', C.amber], ['Nhẹ', C.green]].map(([label, color]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: C.muted }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Disease grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
          {DISEASES.map((d) => (
            <div key={d.num} style={{
              background: '#f7f9fc', borderRadius: 10, padding: '16px 18px',
              border: `1px solid ${d.severityColor}20`,
              transition: 'all 0.15s ease', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${d.severityColor}50`; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${d.severityColor}20`; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '1.25rem' }}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Bệnh {d.num}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.8125rem', color: C.navy, margin: 0, lineHeight: 1.3 }}>{d.name}</p>
                </div>
                <div style={{ padding: '2px 7px', borderRadius: 100, background: `${d.severityColor}12`, border: `1px solid ${d.severityColor}30` }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', fontWeight: 700, color: d.severityColor }}>{SEVERITY_LABEL[d.severity]}</span>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: C.muted, margin: 0, lineHeight: 1.5 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 5: RESULTS PREVIEW
// ─── ─────────────────────────────────────────────────────────────────────────

const EXPERT_RECS = [
  {
    disease: 'Upsell / Cross-sell',
    score: '4.6',
    severityColor: C.red,
    priority: 'HIGH',
    rec: 'Thêm upsell "Mua 2 giảm 15%" vào chat — ước tính ↑ 20% AOV. Kết hợp script chốt đơn cho Lead Nóng trong 5 phút đầu.',
    impact: '↑ 20% AOV',
  },
  {
    disease: 'Nhân Viên Tư Vấn',
    score: '4.8',
    severityColor: C.amber,
    priority: 'MEDIUM',
    rec: 'Bổ sung KPI: phản hồi dưới 10 phút (giờ hành chính). Gửi checklist 5 câu hỏi sàng lọc lead cho từng nhân viên.',
    impact: '↑ 15% tỉ lệ chốt',
  },
  {
    disease: 'Chất Lượng Nguồn Lead',
    score: '7.2',
    severityColor: C.green,
    priority: 'LOW',
    rec: 'Đang ở mức tốt. Duy trì bằng cách điều chỉnh targeting ads mỗi tuần dựa trên báo cáo Junk Alert.',
    impact: 'Duy trì ROAS',
  },
];

function ResultsPreviewSection() {
  return (
    <section id="results" style={{ background: C.surface, padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.green, marginBottom: 12,
          }}>
            Kết quả mẫu
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            color: C.navy, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Gợi ý hành động <span style={{ color: C.green }}>cụ thể</span> từ Chuyên gia Smax
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted, maxWidth: 480, margin: '0 auto', lineHeight: 1.65 }}>
            Không chỉ chẩn đoán bệnh — mà đưa ra đơn thuốc. Mỗi nhóm bệnh có hành động ưu tiên và tác động ước tính.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EXPERT_RECS.map((rec, i) => (
            <div key={rec.disease} style={{
              background: '#fff', borderRadius: 12, padding: '20px 24px',
              boxShadow: '0 2px 16px rgba(26,33,56,0.06)',
              border: `1px solid ${rec.severityColor}15`,
              display: 'flex', gap: 20, alignItems: 'flex-start',
            }}>
              {/* Priority + Score */}
              <div style={{ flex: '0 0 auto', textAlign: 'center', minWidth: 64 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: rec.severityColor, lineHeight: 1 }}>{rec.score}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.5rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 2 }}>/10 điểm</div>
                <div style={{ marginTop: 6, padding: '2px 8px', borderRadius: 100, background: `${rec.severityColor}12`, border: `1px solid ${rec.severityColor}30` }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', fontWeight: 700, color: rec.severityColor }}>{rec.priority}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 700, color: C.navy }}>{rec.disease}</span>
                  <div style={{ padding: '2px 8px', borderRadius: 100, background: `${C.green}12`, border: `1px solid ${C.green}30` }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.5625rem', fontWeight: 700, color: C.green }}>{rec.impact}</span>
                  </div>
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: C.muted, lineHeight: 1.6, margin: 0 }}>{rec.rec}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <a href="#lead-form" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 36px', borderRadius: 8,
            background: C.rust, color: '#fff',
            fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
            boxShadow: '0 8px 32px rgba(191,48,3,0.35)', cursor: 'pointer',
            transition: 'all 0.15s ease', textDecoration: 'none',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(191,48,3,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(191,48,3,0.35)'; }}>
            Khám bệnh miễn phí ngay <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 6: LEAD FORM
// ─── ─────────────────────────────────────────────────────────────────────────

function LeadFormMedicalSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', industry: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setSubmitting(true);
    try {
      const { supabase } = await import('../lib/supabaseLanding');
      await supabase.from('landing_leads').insert([
        { name: form.name, email: form.email, phone: form.phone || null, experience_rating: 0, consent_privacy: true },
      ]);
      setSubmitted(true);
    } catch {
      // Fallback: just show success
      setSubmitted(true);
    }
    setSubmitting(false);
  };

  return (
    <section id="lead-form" style={{
      background: C.navy,
      padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: `radial-gradient(ellipse at center, ${C.rust}15 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <span style={{
            display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem',
            fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.rust, marginBottom: 12,
          }}>
            Dùng thử miễn phí
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
            color: '#fff', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
          }}>
            Khám bệnh hội thoại cho <span style={{ color: C.rust }}>shop của bạn</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65 }}>
            Đăng ký ngay — nhận kết quả khám bệnh miễn phí trong 24h. Không thẻ tín dụng, không cam kết.
          </p>
        </div>

        {submitted ? (
          <div style={{
            background: 'rgba(5,150,105,0.12)', border: `1px solid ${C.green}40`,
            borderRadius: 12, padding: '40px 32px', textAlign: 'center',
          }}>
            <CheckCircle2 size={40} color={C.green} style={{ marginBottom: 16 }} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: '#fff', marginBottom: 10 }}>Đăng ký thành công!</h3>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.60)', lineHeight: 1.65, margin: 0 }}>
              Chuyên gia Smax sẽ liên hệ trong 24h để hướng dẫn kết nối và nhận kết quả khám bệnh đầu tiên.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.70)', display: 'block', marginBottom: 6 }}>Họ tên *</label>
                <input
                  type="text" required placeholder="Nguyễn Văn A"
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = C.rust}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.70)', display: 'block', marginBottom: 6 }}>Email *</label>
                <input
                  type="email" required placeholder="email@doanhnghiep.vn"
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = C.rust}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.70)', display: 'block', marginBottom: 6 }}>Số điện thoại</label>
                <input
                  type="tel" placeholder="0912 345 678"
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = C.rust}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.70)', display: 'block', marginBottom: 6 }}>Ngành hàng</label>
                <select
                  value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}
                  onFocus={e => e.target.style.borderColor = C.rust}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                >
                  <option value="" style={{ background: '#1A2138', color: '#fff' }}>Chọn ngành...</option>
                  <option value="fashion" style={{ background: '#1A2138' }}>Thời trang</option>
                  <option value="cosmetics" style={{ background: '#1A2138' }}>Mỹ phẩm / Làm đẹp</option>
                  <option value="mnb" style={{ background: '#1A2138' }}>Mẹ và Bé</option>
                  <option value="spa" style={{ background: '#1A2138' }}>Spa / Thẩm mỹ</option>
                  <option value="realestate" style={{ background: '#1A2138' }}>Bất động sản</option>
                  <option value="fnb" style={{ background: '#1A2138' }}>F&B / Nhà hàng</option>
                  <option value="travel" style={{ background: '#1A2138' }}>Du lịch</option>
                  <option value="other" style={{ background: '#1A2138' }}>Ngành khác</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.70)', display: 'block', marginBottom: 6 }}>Mô tả ngắn về shop / thách thức hiện tại</label>
              <textarea
                rows={3} placeholder="Ví dụ: Shop thời trang, 2 nhân viên, đang chạy ads Facebook nhưng không biết lead chất lượng thế nào..."
                value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontFamily: 'var(--font-body)', fontSize: '0.9375rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = C.rust}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            <button
              type="submit" disabled={submitting}
              style={{
                padding: '14px 32px', borderRadius: 8, border: 'none',
                background: submitting ? `${C.rust}80` : C.rust,
                color: '#fff', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 32px rgba(191,48,3,0.40)',
                transition: 'all 0.15s ease',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (!submitting) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(191,48,3,0.50)'; } }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(191,48,3,0.40)'; }}>
              {submitting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Đang gửi...
                </>
              ) : (
                <>Khám bệnh miễn phí ngay <ArrowRight size={17} /></>
              )}
            </button>

            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', textAlign: 'center', margin: 0 }}>
              Cam kết bảo mật thông tin. Không spam, không bán data.
            </p>
          </form>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// SECTION 7: FOOTER
// ─── ─────────────────────────────────────────────────────────────────────────

function FooterMedicalSection() {
  return (
    <footer style={{ background: '#0a0f1e', padding: '40px clamp(24px, 5vw, 64px)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Stethoscope size={18} color={C.rust} />
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>AI Insight</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Chẩn đoán bệnh hội thoại · Tối ưu chiến dịch quảng cáo
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
          {['Giới thiệu', 'Tính năng', 'Bảng giá', 'Liên hệ'].map(item => (
            <a key={item} href="#" style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.40)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.40)'}>
              {item}
            </a>
          ))}
        </div>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'rgba(255,255,255,0.20)', margin: 0, width: '100%', textAlign: 'center' }}>
          © 2026 AI Insight by Smax · Mọi quyền được bảo lưu
        </p>
      </div>
    </footer>
  );
}

// ─── ─────────────────────────────────────────────────────────────────────────
// DEFAULT EXPORT — Assemble All Sections
// ─── ─────────────────────────────────────────────────────────────────────────

export default function MedicalCheckupLanding() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <HeroMedicalSection />
      <ProblemMedicalSection />
      <HowItWorksMedicalSection />
      <DiseaseGroupsSection />
      <ResultsPreviewSection />
      <LeadFormMedicalSection />
      <FooterMedicalSection />
    </div>
  );
}

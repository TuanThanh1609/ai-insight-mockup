import { useEffect, useRef, useState } from 'react';
import { Link2, BrainCircuit, BarChart3, CheckCircle2, ArrowRight, MessageSquare, Zap, Users, ChevronRight } from 'lucide-react';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  navy: '#1A2138',
  rust: '#BF3003',
  blue: '#0052FF',
  green: '#059669',
  surface: '#fcf8fb',
  white: '#ffffff',
  muted: '#6b7280',
  lightBg: '#f7f9fc',
};

// ─── Step 1: Fanpage connect UI mockup ────────────────────────────────────────
function Step1Mockup() {
  return (
    <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(26,33,56,0.08)', boxShadow: '0 4px 24px rgba(26,33,56,0.08)' }}>
      {/* Header */}
      <div style={{ background: 'rgba(26,33,56,0.02)', padding: '12px 16px', borderBottom: '1px solid rgba(26,33,56,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Link2 size={13} color={C.blue} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: C.navy }}>Kết nối kênh chat</span>
      </div>
      {/* Content */}
      <div style={{ padding: 14 }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: C.muted, marginBottom: 12, lineHeight: 1.6 }}>Chọn Fanpage để đồng bộ hội thoại tự động</p>
        {[
          { name: 'Smax Fashion Store', type: 'Facebook Page', conv: '12.4K', checked: true, color: '#1877F2' },
          { name: 'Smax Beauty Official', type: 'Facebook Page', conv: '8.7K', checked: true, color: '#1877F2' },
          { name: 'Smax Zalo OA', type: 'Zalo OA', conv: '5.2K', checked: false, color: '#0068FF' },
        ].map((item, i) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: i === 0 ? 'rgba(5,150,105,0.06)' : C.lightBg, marginBottom: 6, border: i === 0 ? '1px solid rgba(5,150,105,0.15)' : 'none' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MessageSquare size={16} color={item.color} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: C.navy, margin: 0 }}>{item.name}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: C.muted, margin: 0 }}>{item.type} · {item.conv} hội thoại</p>
            </div>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.checked ? C.green : 'rgba(26,33,56,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {item.checked && <CheckCircle2 size={14} color="#fff" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 2: Template selection + AI run ──────────────────────────────────────
function Step2Mockup() {
  return (
    <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(26,33,56,0.08)', boxShadow: '0 4px 24px rgba(26,33,56,0.08)' }}>
      <div style={{ background: 'rgba(26,33,56,0.02)', padding: '12px 16px', borderBottom: '1px solid rgba(26,33,56,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <BrainCircuit size={13} color={C.blue} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: C.navy }}>Chọn template · Chạy AI</span>
      </div>
      <div style={{ padding: 14 }}>
        {/* Template picker */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
          {[
            { icon: '🎯', name: 'Phân Tích Nhu Cầu', selected: true, color: C.navy },
            { icon: '📊', name: 'Đánh Giá Chất Lượng Lead', selected: false, color: C.muted },
            { icon: '🏷️', name: 'Phân Tích Chân Dung KH', selected: false, color: C.muted },
          ].map(t => (
            <div key={t.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: t.selected ? `${t.color}08` : C.lightBg, border: t.selected ? `1px solid ${t.color}20` : '1px solid transparent' }}>
              <span style={{ fontSize: '1rem' }}>{t.icon}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: t.selected ? 600 : 400, color: t.color, flex: 1 }}>{t.name}</span>
              {t.selected && <CheckCircle2 size={13} color={t.color} />}
            </div>
          ))}
        </div>
        {/* AI running indicator */}
        <div style={{ background: 'rgba(0,82,255,0.06)', borderRadius: 8, padding: '10px 12px', border: '1px solid rgba(0,82,255,0.12)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <BrainCircuit size={13} color={C.blue} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, color: C.blue }}>AI đang phân tích...</span>
          </div>
          <div style={{ height: 4, background: 'rgba(0,82,255,0.10)', borderRadius: 100, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: '62%', height: '100%', background: C.blue, borderRadius: 100, animation: 'slideRight 1.5s ease infinite' }} />
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: C.muted, margin: 0 }}>Đã xử lý 47/76 hội thoại · Còn ~12 giây</p>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Dashboard result ────────────────────────────────────────────────
function Step3Mockup() {
  const stats = [
    { label: 'Tổng hội thoại', value: '76', color: C.navy },
    { label: 'Lead Nóng', value: '24', color: '#ef4444' },
    { label: 'Lead Ấm', value: '31', color: '#f59e0b' },
    { label: 'Khách rác', value: '5', color: C.muted },
  ];
  return (
    <div style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(26,33,56,0.08)', boxShadow: '0 4px 24px rgba(26,33,56,0.08)' }}>
      <div style={{ background: 'rgba(26,33,56,0.02)', padding: '12px 16px', borderBottom: '1px solid rgba(26,33,56,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <BarChart3 size={13} color={C.green} />
        <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, color: C.navy }}>Kết quả phân tích</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-body)', fontSize: 10, color: C.green, display: 'flex', alignItems: 'center', gap: 4 }}>
          <CheckCircle2 size={10} color={C.green} /> Hoàn thành
        </span>
      </div>
      <div style={{ padding: 14 }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, marginBottom: 12 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: C.lightBg, borderRadius: 8, padding: '8px 6px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: s.color, margin: 0 }}>{s.value}</p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: C.muted, margin: '1px 0 0' }}>{s.label}</p>
            </div>
          ))}
        </div>
        {/* Top products */}
        <div style={{ background: C.lightBg, borderRadius: 8, padding: '10px 12px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sản phẩm quan tâm</p>
          {[['Kem nền', 12], ['Xịt khoáng', 9], ['Serum', 8], ['Son môi', 6]].map(([p, n], i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, fontWeight: 700, color: i === 0 ? C.blue : C.muted, width: 14 }}>{i + 1}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: C.navy, flex: 1 }}>{p}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: C.muted }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step card ────────────────────────────────────────────────────────────────
const STEPS = [
  {
    number: '01',
    icon: Link2,
    color: C.blue,
    title: 'Kết nối Fanpage',
    description: 'Liên kết Facebook Page và Zalo OA — hội thoại đồng bộ tự động trong vài phút.',
    mockup: <Step1Mockup />,
  },
  {
    number: '02',
    icon: BrainCircuit,
    color: C.rust,
    title: 'Chọn template & chạy AI',
    description: 'Chọn template phù hợp ngành hàng. AI phân tích tất cả hội thoại — trích xuất lead, pain point, đối thủ.',
    mockup: <Step2Mockup />,
  },
  {
    number: '03',
    icon: BarChart3,
    color: C.green,
    title: 'Dashboard đọc kết quả',
    description: 'Scan dashboard trong 3 giây — thấy ngay lead nào Nóng, đối thủ nào nhắc đến, sale nào mất khách.',
    mockup: <Step3Mockup />,
  },
];

function StepCard({ step, isLast, delay }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const Icon = step.icon;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
      {/* Step header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: `${step.color}12`, border: `2px solid ${step.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 0 0 6px ${step.color}06` }}>
          <Icon size={22} color={step.color} strokeWidth={1.8} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.6875rem', color: '#fff', background: step.color, padding: '2px 8px', borderRadius: 100 }}>{step.number}</span>
          <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.0625rem', color: C.navy, margin: 0, letterSpacing: '-0.01em' }}>{step.title}</h3>
        </div>
      </div>

      {/* Mockup */}
      {step.mockup}

      {/* Description */}
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: C.muted, lineHeight: 1.65, marginTop: 14 }}>{step.description}</p>

      {/* Connector */}
      {!isLast && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${step.color}30, ${C.muted}20)` }} />
            <ArrowRight size={16} color={step.color} />
            <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${C.muted}20, ${C.muted}20)` }} />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main HowItWorksSection ───────────────────────────────────────────────────
export function HowItWorksSection() {
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" style={{ background: C.surface, padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Title */}
        <div ref={titleRef} style={{ textAlign: 'center', marginBottom: 56, opacity: 0, transform: 'translateY(16px)', transition: 'opacity 0.5s ease, transform 0.5s ease' }}>
          <span style={{ display: 'inline-block', fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: C.blue, marginBottom: 12 }}>
            3 bước đơn giản
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', color: C.navy, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14 }}>
            Từ hội thoại lộn xộn đến<br />
            <span style={{ color: C.blue }}>quyết định sáng suốt</span>
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted, maxWidth: 440, margin: '0 auto', lineHeight: 1.65 }}>
            Không cần đọc từng chat, không cần export Excel. Chỉ cần kết nối → AI phân tích → dashboard đọc ngay.
          </p>
        </div>

        {/* 3 columns: each step */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0 32px' }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.number} step={step} isLast={i === STEPS.length - 1} delay={i * 150} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: 56 }}>
          <a href="#lead-form" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 36px', borderRadius: 8, background: C.rust, color: '#fff', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', boxShadow: '0 8px 32px rgba(191,48,3,0.35)', cursor: 'pointer', transition: 'all 0.15s ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(191,48,3,0.45)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(191,48,3,0.35)'; }}>
            Bắt đầu dùng thử miễn phí
            <ChevronRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}

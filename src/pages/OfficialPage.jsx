import { useState, useEffect, useRef } from 'react';
import { CheckCircle, Loader2, ChevronDown, ArrowRight, MessageSquare, TrendingUp, Zap, Users, BarChart2, Target, Shield, Sparkles } from 'lucide-react';
import { saveLandingLead } from '../lib/supabaseLanding';

// ── Design Tokens ─────────────────────────────────────────────────────────────
const C = {
  bg:        '#07090F',
  navy:      '#1A2138',
  navyMid:   '#0F1629',
  rust:      '#BF3003',
  blue:      '#0052FF',
  blueGlow:  '#3B82F6',
  text:      '#E8E6EF',
  muted:     '#8B86A0',
  green:     '#10B981',
  amber:     '#F59E0B',
  danger:    '#EF4444',
  glass:     'rgba(255,255,255,0.05)',
  glassBorder:'rgba(255,255,255,0.09)',
};

// ── Shared components ─────────────────────────────────────────────────────────
function Tag({ children, color = C.blue }) {
  return (
    <span style={{
      display: 'inline-block',
      fontFamily: 'var(--font-body)',
      fontSize: '0.6875rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color,
      background: `${color}18`,
      border: `1px solid ${color}35`,
      padding: '4px 12px',
      borderRadius: 999,
    }}>
      {children}
    </span>
  );
}

function GlassCard({ children, style, className = '' }) {
  return (
    <div className={className} style={{
      background: C.glass,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: `1px solid ${C.glassBorder}`,
      borderRadius: 'var(--radius-xl)',
      ...style,
    }}>
      {children}
    </div>
  );
}

function FadeIn({ children, delay = 0, style }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
        obs.unobserve(el);
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: 0, transform: 'translateY(20px)',
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ── Stats strip ───────────────────────────────────────────────────────────────
const STATS = [
  { value: '10,000+', label: 'Hội thoại/phút' },
  { value: '3×', label: 'Tăng ROAS trung bình' },
  { value: '7 ngành', label: 'Đa dạng template' },
  { value: '< 5 phút', label: 'Setup ban đầu' },
];

function StatsStrip() {
  return (
    <div style={{
      background: C.navy,
      borderTop: `1px solid ${C.glassBorder}`,
      borderBottom: `1px solid ${C.glassBorder}`,
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'center',
      gap: 0,
    }}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 'clamp(24px, 4vw, 64px)',
        maxWidth: 1100,
        width: '100%',
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: 'center', minWidth: 100 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.1rem,2vw,1.5rem)', color: C.rust }}>
              {s.value}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: C.muted, marginTop: 2 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Hero Section ───────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      background: C.bg,
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px) clamp(56px, 8vw, 80px)',
    }}>
      {/* Grid background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `linear-gradient(${C.blue}08 1px, transparent 1px), linear-gradient(90deg, ${C.blue}08 1px, transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Glow orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 480, height: 480, borderRadius: '50%', background: `${C.blue}18`, filter: 'blur(140px)' }} />
      <div style={{ position: 'absolute', bottom: '5%', right: '5%', width: 380, height: 380, borderRadius: '50%', background: `${C.rust}14`, filter: 'blur(120px)' }} />

      {/* Floating nodes */}
      <div style={{ position: 'absolute', top: '20%', right: '8%', width: 8, height: 8, borderRadius: '50%', background: C.green, boxShadow: `0 0 12px ${C.green}`, animation: 'node-pulse 3s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', top: '40%', right: '15%', width: 6, height: 6, borderRadius: '50%', background: C.rust, boxShadow: `0 0 10px ${C.rust}`, animation: 'node-pulse 3s ease-in-out infinite 1s' }} />
      <div style={{ position: 'absolute', top: '60%', right: '6%', width: 7, height: 7, borderRadius: '50%', background: C.blue, boxShadow: `0 0 12px ${C.blue}`, animation: 'node-pulse 3s ease-in-out infinite 2s' }} />

      <style>{`
        @keyframes node-pulse { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:1;transform:scale(1.2)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>
        {/* Badge row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <Tag color={C.rust}>🚀 Launching — Đăng ký sớm</Tag>
          <Tag color={C.blue}>AI-Powered</Tag>
          <Tag color={C.green}>Miễn phí báo cáo</Tag>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', maxWidth: 820, margin: '0 auto 32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: 20,
          }}>
            Biết khách đang{' '}
            <span style={{ color: C.rust }}>nói gì</span>
            {' '}— trước khi họ quyết định{' '}
            <span style={{ color: C.blue }}>mua hay không</span>
          </h1>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: C.muted,
            lineHeight: 1.7,
            maxWidth: 660,
            margin: '0 auto',
          }}>
            SMAX AI Insight phân tích toàn bộ hội thoại & quảng cáo của bạn bằng AI.
            Nhận diện điểm nghẽn, phân loại leads, và đề xuất hành động cụ thể —
            trong 5 phút thay vì 10 giờ.
          </p>
        </div>

        {/* CTA row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 14, marginBottom: 40 }}>
          <a href="#lead-form" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px',
            background: C.rust, color: '#fff',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '1rem',
            textDecoration: 'none',
            boxShadow: `0 4px 24px ${C.rust}50`,
          }}>
            Nhận báo cáo miễn phí
            <ArrowRight size={18} />
          </a>
          <a href="#features" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '14px 28px',
            background: 'transparent', color: C.muted,
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${C.glassBorder}`,
            fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: '1rem',
            textDecoration: 'none',
          }}>
            Xem tính năng
          </a>
        </div>

        {/* Mock dashboard preview */}
        <FadeIn delay={200}>
          <div style={{
            maxWidth: 960,
            margin: '0 auto',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            border: `1px solid ${C.glassBorder}`,
            boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px ${C.blue}20`,
            background: C.navyMid,
          }}>
            {/* Browser chrome */}
            <div style={{ background: '#1E2235', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              {['#EF4444','#F59E0B','#10B981'].map(c => (
                <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
              ))}
              <div style={{ marginLeft: 10, background: '#0F1629', borderRadius: 'var(--radius-sm)', padding: '4px 14px', fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.muted, flex: 1, maxWidth: 280 }}>
                smaxai.cdp.vn / insight
              </div>
            </div>
            {/* Dashboard mock content */}
            <div style={{ padding: 'clamp(16px, 3vw, 32px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
              {/* Score card */}
              <div style={{ background: '#0F1629', borderRadius: 'var(--radius-md)', padding: 18, border: `1px solid ${C.glassBorder}` }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Health Score</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: C.green }}>7.2</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: C.muted }}>/10</span>
                </div>
                <div style={{ height: 4, background: '#1A2138', borderRadius: 2, marginTop: 10 }}>
                  <div style={{ width: '72%', height: '100%', background: C.green, borderRadius: 2 }} />
                </div>
              </div>
              {/* KPI cards */}
              {[
                { label: 'Tổng hội thoại', value: '3,842', delta: '+12%', color: C.blue },
                { label: 'Lead Nóng', value: '847', delta: '+23%', color: C.rust },
                { label: 'ROAS TB', value: '2.8×', delta: '+0.6', color: C.green },
                { label: 'Junk Lead', value: '18%', delta: '-5%', color: C.amber },
              ].map((k, i) => (
                <div key={i} style={{ background: '#0F1629', borderRadius: 'var(--radius-md)', padding: 18, border: `1px solid ${C.glassBorder}` }}>
                  <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{k.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', color: '#fff' }}>{k.value}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.green, background: `${C.green}18`, padding: '2px 8px', borderRadius: 99 }}>{k.delta}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Disease groups preview */}
            <div style={{ padding: '0 clamp(16px, 3vw, 32px) clamp(16px, 3vw, 32px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Nhóm bệnh cần cải thiện</div>
              {[
                { name: 'Chất lượng nguồn Lead', score: 4.2, color: C.danger },
                { name: 'Tốc độ phản hồi', score: 5.8, color: C.amber },
                { name: 'Xử lý rào cản', score: 6.1, color: C.amber },
                { name: 'Chăm sóc khách cũ', score: 8.4, color: C.green },
              ].map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 160, fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: C.text }}>{d.name}</div>
                  <div style={{ flex: 1, height: 6, background: '#1A2138', borderRadius: 3 }}>
                    <div style={{ width: `${d.score * 10}%`, height: '100%', background: d.color, borderRadius: 3 }} />
                  </div>
                  <div style={{ width: 36, textAlign: 'right', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: d.color }}>{d.score}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

// ── Problem Section ───────────────────────────────────────────────────────────
const PROBLEMS = [
  {
    icon: <MessageSquare size={24} />,
    title: 'Không biết khách đang nói gì',
    desc: 'Hàng ngàn tin nhắn chất đống. Bạn không có cách nào biết đâu là khách tiềm năng, đâu là khách sắp bỏ đi.',
    stat: '73% tin nhắn không được phân loại',
    color: C.rust,
  },
  {
    icon: <TrendingUp size={24} />,
    title: 'Chi tiêu ads tăng, đơn hàng đứng yên',
    desc: 'Cứ chạy thêm ads nhưng ROAS ngày càng giảm. Không hiểu tại sao leads chất lượng kém.',
    stat: '2.1× ROAS trung bình — dưới ngưỡng hòa vốn nhiều chiến dịch',
    color: C.amber,
  },
  {
    icon: <Users size={24} />,
    title: 'Team tư vấn hoạt động theo cảm tính',
    desc: 'Không có data thực để đánh giá ai tư vấn tốt, ai đang mất khách. Mỗi người một cách làm.',
    stat: '41% khách phàn nàn về trải nghiệm tư vấn',
    color: C.blue,
  },
];

function ProblemSection() {
  return (
    <section style={{ background: C.navyMid, padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Tag color={C.amber}>Vấn đề thực tế</Tag>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginTop: 16, lineHeight: 1.15 }}>
              Bạn đang "đi mù" khi vận hành marketing
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted, marginTop: 12, maxWidth: 560, margin: '12px auto 0' }}>
              Không thiếu data. Thiếu cách nhìn đúng vào data đó.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {PROBLEMS.map((p, i) => (
            <FadeIn key={i} delay={i * 100}>
              <GlassCard style={{ padding: '28px 24px' }}>
                <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: `${p.color}18`, border: `1px solid ${p.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: p.color, marginBottom: 20 }}>
                  {p.icon}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: 10 }}>
                  {p.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: C.muted, lineHeight: 1.65, marginBottom: 16 }}>
                  {p.desc}
                </p>
                <div style={{ background: `${p.color}12`, border: `1px solid ${p.color}28`, borderRadius: 'var(--radius-md)', padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.85rem', color: p.color }}>{p.stat}</span>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features Section ──────────────────────────────────────────────────────────
const FEATURES = [
  {
    num: '01',
    tag: 'AI Analysis',
    title: 'Phân tích hội thoại bằng AI — không cần đọc từng tin nhắn',
    desc: 'AI đọc toàn bộ hội thoại, tự động phân loại Lead Nóng/Ấm/Lạnh, nhận diện rào cản chốt đơn, và đánh giá thái độ tư vấn của nhân viên. 10,000 tin nhắn được xử lý trong 3 phút.',
    highlights: ['Phân loại Lead Nóng / Ấm / Lạnh tự động', 'Nhận diện rào cản chốt đơn theo ngành', 'Đánh giá thái độ tư vấn từng nhân viên', 'Phát hiện khách có ý định bỏ đi sớm'],
    icon: <Sparkles size={28} />,
    color: C.blue,
    reverse: false,
  },
  {
    num: '02',
    tag: 'ROAS Dashboard',
    title: 'Dashboard ROAS theo chiến dịch — scan trong 3 giây',
    desc: 'Mọi chiến dịch quảng cáo được gắn health score, phân tích doanh thu vs chi tiêu, và đánh giá chất lượng leads. AI gợi ý tăng giảm budget ngay lập tức.',
    highlights: ['ROAS theo chiến dịch & platform', 'AI gợi ý tăng/giảm/nhắm đúng đối tượng', 'Junk alert — phát hiện leads rác tức thì', '7 ngày chi tiết: Revenue, Orders, ROAS'],
    icon: <BarChart2 size={28} />,
    color: C.green,
    reverse: true,
  },
  {
    num: '03',
    tag: 'Expert Recommendations',
    title: 'Gợi ý từ chuyên gia — hành động cụ thể, có priority',
    desc: 'Không chỉ hiện data. SMAX AI đưa ra đề xuất hành động cụ thể theo từng nhóm bệnh, sắp xếp theo mức độ ảnh hưởng doanh thu. Team của bạn biết phải làm gì ngay hôm nay.',
    highlights: ['Action items cụ thể, có impact score', 'Priority: Khẩn cấp → Theo dõi → Tốt', 'Gợi ý theo ngành hàng đặc thù', 'Lưu lại & theo dõi tiến độ hành động'],
    icon: <Target size={28} />,
    color: C.rust,
    reverse: false,
  },
];

function FeaturesSection() {
  return (
    <section id="features" style={{ background: C.bg, padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Tag color={C.green}>Tính năng</Tag>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff', marginTop: 16, lineHeight: 1.15 }}>
              Một nền tảng — giải quyết cả 3 điểm nghẽn
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {FEATURES.map((f, i) => (
            <FadeIn key={i} delay={i * 80}>
              <GlassCard style={{
                padding: 'clamp(28px, 4vw, 48px)',
                display: 'grid',
                gridTemplateColumns: f.reverse ? '1fr 1fr' : '1fr 1fr',
                gap: 'clamp(24px, 4vw, 48px)',
                alignItems: 'center',
              }}>
                {/* Left or right — visual */}
                <div style={{ order: f.reverse ? 1 : 0 }}>
                  <div style={{ background: `${f.color}0E`, borderRadius: 'var(--radius-lg)', padding: '28px 24px', border: `1px solid ${f.color}22`, minHeight: 220, display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `${f.color}20`, border: `1px solid ${f.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: f.color }}>
                        {f.icon}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Module {f.num}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: f.color }}>{f.tag}</div>
                      </div>
                    </div>
                    {/* Mini chart mock */}
                    <div style={{ flex: 1 }}>
                      {f.tag === 'AI Analysis' && (
                        <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 80 }}>
                          {['32%','48%','41%','67%','73%','55%','82%','78%','91%','88%'].map((h, j) => (
                            <div key={j} style={{ flex: 1, background: j === 6 ? f.color : `${f.color}40`, borderRadius: '4px 4px 0 0', height: h, animation: `bar-pop 0.5s ease ${j * 50}ms both` }} />
                          ))}
                        </div>
                      )}
                      {f.tag === 'ROAS Dashboard' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[
                            { name: 'Facebook Ads', pct: 78, color: C.blue },
                            { name: 'Zalo Ads', pct: 54, color: C.green },
                            { name: 'Google Ads', pct: 91, color: C.amber },
                          ].map((r, j) => (
                            <div key={j}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.muted }}>{r.name}</span>
                                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.75rem', color: r.color }}>{r.pct}%</span>
                              </div>
                              <div style={{ height: 5, background: '#1A2138', borderRadius: 3 }}>
                                <div style={{ width: `${r.pct}%`, height: '100%', background: r.color, borderRadius: 3 }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      {f.tag === 'Expert Recommendations' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                          {[
                            { label: 'Tăng budget chiến dịch A', priority: 'Khẩn cấp', color: C.danger },
                            { label: 'Cải thiện thời gian phản hồi', priority: 'Theo dõi', color: C.amber },
                            { label: 'Train nhân viên về obj...', priority: 'Tốt', color: C.green },
                          ].map((r, j) => (
                            <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0F1629', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
                              <div style={{ width: 8, height: 8, borderRadius: '50%', background: r.color, flexShrink: 0 }} />
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: C.text, flex: 1 }}>{r.label}</span>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.65rem', color: r.color, background: `${r.color}15`, padding: '2px 6px', borderRadius: 4 }}>{r.priority}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right or left — text */}
                <div style={{ order: f.reverse ? 0 : 1 }}>
                  <Tag color={f.color}>{f.tag}</Tag>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.2rem, 2.5vw, 1.7rem)', color: '#fff', marginTop: 12, marginBottom: 14, lineHeight: 1.2 }}>
                    {f.title}
                  </h3>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: C.muted, lineHeight: 1.7, marginBottom: 20 }}>
                    {f.desc}
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {f.highlights.map((h, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: `${f.color}18`, border: `1px solid ${f.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                            <polyline points="2,6 5,9 10,3" stroke={f.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: C.text, lineHeight: 1.5 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes bar-pop { from{height:0;opacity:0} to{height:var(--h);opacity:1} }
      `}</style>
    </section>
  );
}

// ── Industries Section ────────────────────────────────────────────────────────
const INDUSTRIES = [
  { name: 'Thời trang', emoji: '👗', color: '#E879A4' },
  { name: 'Mẹ và Bé', emoji: '🍼', color: '#60A5FA' },
  { name: 'Mỹ phẩm', emoji: '💄', color: '#F472B6' },
  { name: 'Spa / Thẩm mỹ', emoji: '💆', color: '#A78BFA' },
  { name: 'Bất động sản', emoji: '🏡', color: '#34D399' },
  { name: 'F&B / Nhà hàng', emoji: '🍜', color: '#FBBF24' },
  { name: 'Du lịch', emoji: '✈️', color: '#38BDF8' },
];

function IndustriesSection() {
  return (
    <section style={{ background: C.navyMid, padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Tag color={C.blue}>Template sẵn có</Tag>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#fff', marginTop: 14 }}>
              7 ngành — 42 insight templates
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: C.muted, marginTop: 10 }}>
              Mỗi ngành có prompt & field đặc thù. Không cần cấu hình từ đầu.
            </p>
          </div>
        </FadeIn>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          {INDUSTRIES.map((ind, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 20px',
                background: `${ind.color}12`,
                border: `1px solid ${ind.color}30`,
                borderRadius: 'var(--radius-md)',
                transition: 'transform 0.15s',
              }}>
                <span style={{ fontSize: '1.4rem' }}>{ind.emoji}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.875rem', color: ind.color }}>
                  {ind.name}
                </span>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── How It Works Section ──────────────────────────────────────────────────────
const STEPS = [
  {
    num: '1',
    title: 'Kết nối nguồn data',
    desc: 'Kết nối Fanpage, Zalo OA, hoặc upload file hội thoại. SMAX hỗ trợ định dạng phổ biến.',
    icon: <Shield size={22} />,
    color: C.blue,
  },
  {
    num: '2',
    title: 'AI phân tích trong 3 phút',
    desc: 'AI quét toàn bộ hội thoại, phân loại theo 6 insight dimensions, gán health score cho từng chiến dịch.',
    icon: <Zap size={22} />,
    color: C.rust,
  },
  {
    num: '3',
    title: 'Nhận báo cáo & hành động',
    desc: 'Dashboard trực quan, AI gợi ý cụ thể. Bạn và team biết ngay phải làm gì tiếp theo.',
    icon: <Target size={22} />,
    color: C.green,
  },
];

function HowItWorksSection() {
  return (
    <section style={{ background: C.bg, padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <Tag color={C.green}>Quy trình</Tag>
            <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#fff', marginTop: 14 }}>
              Từ data thô → hành động rõ ràng
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: C.muted, marginTop: 10 }}>
              Setup trong 5 phút. Không cần đội kỹ thuật.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {STEPS.map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                {/* Left: number + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `${s.color}18`, border: `2px solid ${s.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: s.color, flexShrink: 0,
                    fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem',
                  }}>
                    {s.num}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 40, background: `linear-gradient(${s.color}60, ${STEPS[i+1].color}60)` }} />
                  )}
                </div>
                {/* Right: content */}
                <div style={{ paddingBottom: i < STEPS.length - 1 ? 32 : 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ color: s.color }}>{s.icon}</div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#fff' }}>
                      {s.title}
                    </h3>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: C.muted, lineHeight: 1.65 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Lead Form Section ─────────────────────────────────────────────────────────
function LeadFormSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!email.trim()) errs.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Email không hợp lệ';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    setApiError('');

    const result = await saveLandingLead({
      name, email,
      experience_rating: 0,
      consent_privacy: true,
    });
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setApiError(result.error || 'Đã có lỗi. Vui lòng thử lại.');
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-md)',
    border: hasError ? '2px solid #f87171' : `1px solid ${C.glassBorder}`,
    background: C.glass, color: '#fff',
    fontFamily: 'var(--font-body)', fontSize: '0.9375rem',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  });

  return (
    <section id="lead-form" style={{
      background: `linear-gradient(148deg, ${C.navy} 0%, ${C.navyMid} 50%, ${C.bg} 100%)`,
      padding: 'clamp(56px, 8vw, 96px) clamp(24px, 5vw, 80px)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: `${C.rust}12`, filter: 'blur(120px)' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(40px, 6vw, 80px)', alignItems: 'center' }}>

          {/* Left copy */}
          <div>
            <Tag color={C.rust}>Miễn phí — 100 first come</Tag>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', color: '#fff',
              marginTop: 16, lineHeight: 1.1, marginBottom: 16,
            }}>
              Nhận báo cáo<br />
              <span style={{ color: C.rust }}>AI Audit</span> miễn phí
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
              Chúng tôi phân tích miễn phí một phần data hội thoại của bạn và gửi báo cáo chi tiết qua email trong 24 giờ.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '✓', text: 'Phân tích 500+ hội thoại đầu tiên' },
                { icon: '✓', text: 'Health Score theo 6 dimensions' },
                { icon: '✓', text: '3 action items ưu tiên cao nhất' },
                { icon: '✓', text: 'Không cần thẻ tín dụng — hoàn toàn miễn phí' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${C.green}18`, border: `1px solid ${C.green}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <polyline points="2,6 5,9 10,3" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: C.text }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social proof mini */}
            <div style={{ marginTop: 32, padding: '16px 18px', background: `${C.blue}10`, border: `1px solid ${C.blue}25`, borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {['#3B82F6','#8B5CF6','#EC4899','#F59E0B','#10B981'].map((c, i) => (
                  <div key={i} style={{ width: 24, height: 24, borderRadius: '50%', background: c, border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0 }} />
                ))}
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: C.muted }}>
                <span style={{ color: C.text, fontWeight: 600 }}>47 doanh nghiệp</span> đã đăng ký tuần này
              </p>
            </div>
          </div>

          {/* Right — Form */}
          <GlassCard style={{ padding: '32px 28px' }}>
            {status === 'success' ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 0', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: `${C.green}14`, border: `2px solid ${C.green}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={36} color={C.green} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', color: '#fff', margin: 0 }}>Đăng ký thành công!</h3>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: C.muted, margin: 0, lineHeight: 1.6 }}>
                  Báo cáo sẽ được gửi đến email của bạn trong 24 giờ. Cảm ơn bạn đã quan tâm đến SMAX AI Insight!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#fff', textAlign: 'center', marginBottom: 24 }}>
                  Đăng ký nhận báo cáo
                </h3>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: C.muted, marginBottom: 6 }}>
                    Họ tên <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input type="text" value={name} onChange={e => { setName(e.target.value); if (errors.name) setErrors(r => ({ ...r, name: '' })); }}
                    placeholder="Nguyễn Văn A" style={inputStyle(!!errors.name)}
                    onFocus={e => { if (!errors.name) e.target.style.borderColor = `${C.blue}60`; }}
                    onBlur={e => { if (!errors.name) e.target.style.borderColor = C.glassBorder; }} />
                  {errors.name && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f87171', marginTop: 4 }}>{errors.name}</p>}
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: C.muted, marginBottom: 6 }}>
                    Email <span style={{ color: '#f87171' }}>*</span>
                  </label>
                  <input type="email" value={email} onChange={e => { setEmail(e.target.value); if (errors.email) setErrors(r => ({ ...r, email: '' })); }}
                    placeholder="email@doanhnghiep.vn" style={inputStyle(!!errors.email)}
                    onFocus={e => { if (!errors.email) e.target.style.borderColor = `${C.blue}60`; }}
                    onBlur={e => { if (!errors.email) e.target.style.borderColor = C.glassBorder; }} />
                  {errors.email && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f87171', marginTop: 4 }}>{errors.email}</p>}
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 500, color: C.muted, marginBottom: 6 }}>
                    Doanh nghiệp <span style={{ color: C.muted, fontWeight: 400 }}>(tùy chọn)</span>
                  </label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                    placeholder="Công ty TNHH ABC" style={inputStyle(false)} />
                </div>

                {status === 'error' && apiError && (
                  <div style={{ marginBottom: 12, padding: '10px 14px', borderRadius: 'var(--radius-md)', background: `${C.danger}12`, border: `1px solid ${C.danger}35`, fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#fca5a5' }}>
                    {apiError}
                  </div>
                )}

                <button type="submit" disabled={status === 'loading'} style={{
                  width: '100%', padding: '14px',
                  borderRadius: 'var(--radius-md)', border: 'none',
                  background: status === 'loading' ? `${C.rust}80` : C.rust,
                  color: '#fff', fontFamily: 'var(--font-body)', fontSize: '1rem', fontWeight: 600,
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  boxShadow: `0 4px 20px ${C.rust}45`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'all 0.15s',
                }}>
                  {status === 'loading' ? (
                    <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Đang gửi...</>
                  ) : (
                    <>Nhận báo cáo miễn phí <ArrowRight size={18} /></>
                  )}
                </button>

                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: `${C.muted}99`, textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
                  Báo cáo gửi trong 24h. Không spam. Không bán data.
                </p>
              </form>
            )}
          </GlassCard>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: C.navy, borderTop: `1px solid ${C.glassBorder}`, padding: '32px clamp(24px, 5vw, 80px)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#fff' }}>SMAX</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: C.muted }}>· AI Insight</span>
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: C.muted }}>
          © 2026 SMAX. Mọi quyền được bảo lưu.
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['Chính sách bảo mật', 'Điều khoản sử dụng', 'Liên hệ'].map(l => (
            <a key={l} href="#" onClick={e => e.preventDefault()} style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: C.muted, textDecoration: 'none' }}>
              {l}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ── Main Export ───────────────────────────────────────────────────────────────
export default function OfficialPage() {
  return (
    <div style={{ background: C.bg, color: C.text, fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      {/* Top nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 30,
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        background: 'rgba(7,9,15,0.80)',
        borderBottom: `1px solid ${C.glassBorder}`,
        padding: '12px clamp(24px, 5vw, 80px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 'var(--radius-sm)', background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={13} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.01em' }}>SMAX</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem', color: C.rust, background: `${C.rust}18`, border: `1px solid ${C.rust}35`, padding: '2px 8px', borderRadius: 99 }}>
              AI Insight
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a href="#features" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: C.muted, textDecoration: 'none' }}>Tính năng</a>
            <a href="#lead-form" style={{
              padding: '8px 18px', background: C.rust, color: '#fff',
              borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none', boxShadow: `0 2px 12px ${C.rust}40`,
            }}>
              Nhận báo cáo miễn phí
            </a>
          </div>
        </div>
      </nav>

      <StatsStrip />
      <HeroSection />
      <ProblemSection />
      <FeaturesSection />
      <IndustriesSection />
      <HowItWorksSection />
      <LeadFormSection />
      <Footer />
    </div>
  );
}

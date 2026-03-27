import { useEffect, useRef } from 'react';
import { Zap, ShieldCheck, LayoutDashboard } from 'lucide-react';

const features = [
  {
    icon: Zap,
    badge: 'AI phân tích tức thì',
    title: 'Đọc chat → Trích xuất insight tự động',
    description:
      'Kết nối Facebook, Zalo OA — AI tự bóc tách thông tin từ hội thoại: mức độ quan tâm, sản phẩm quan tâm, rào cản chốt đơn, đối thủ cạnh tranh. Không cần prompt thủ công.',
    highlights: ['Đa kênh: Facebook + Zalo', 'Tự động phân loại Nóng / Ấm / Lạnh', 'Phát hiện khách hàng rác (Junk Lead)'],
    color: '#BF3003',
    mockup: [
      { label: 'Lead Nóng', value: 68, barColor: '#BF3003' },
      { label: 'Lead Ấm', value: 22, barColor: '#d97706' },
      { label: 'Lead Lạnh', value: 10, barColor: '#dc2626' },
    ],
  },
  {
    icon: ShieldCheck,
    badge: 'Cảnh báo thông minh',
    title: 'Junk Alert — Không đốt tiền chiến dịch rác',
    description:
      'AI tự động cảnh báo khi chiến dịch có tỉ lệ khách rác cao bất thường. Gợi ý tắt hoặc giảm ngân sách trước khi budget bị đốt hết vào lead vô giá trị.',
    highlights: ['Cảnh báo chiến dịch "rác" theo ngày', 'ROAS thực tế (không chỉ số kỹ thuật)', 'Gợi ý: Tăng / Giữ / Giảm / Tắt'],
    color: '#0052FF',
    mockup: [
      { label: 'Chiến dịch A', value: 92, barColor: '#059669' },
      { label: 'Chiến dịch B', value: 45, barColor: '#d97706' },
      { label: 'Chiến dịch C', value: 18, barColor: '#dc2626' },
    ],
  },
  {
    icon: LayoutDashboard,
    badge: 'Template sẵn có',
    title: '42 template cho 7 ngành — Click là chạy',
    description:
      'Mỗi ngành có 6 insight đặc thù. Template có sẵn: Lead Temperature, Junk Detection, Đối thủ, Nhân viên tư vấn, Chân dung KH, Sau mua hàng. Click chọn → AI chạy ngay.',
    highlights: ['42 template, 7 ngành hàng', 'Cấu hình dưới 2 phút', 'Tuỳ biến cột/prompt dễ dàng'],
    color: '#1a2138',
    mockup: [
      { label: 'Thời trang', value: 88, barColor: '#BF3003' },
      { label: 'Mỹ phẩm', value: 76, barColor: '#7c3aed' },
      { label: 'Mẹ & Bé', value: 64, barColor: '#0891b2' },
    ],
  },
];

function FeatureBlock({ icon: Icon, badge, title, description, highlights, color, mockup, reverse }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        display: 'flex',
        flexDirection: reverse ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 'clamp(32px, 5vw, 64px)',
        padding: 'clamp(32px, 5vw, 48px) 0',
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-body)',
            fontSize: '0.6875rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.10em',
            color: color,
            background: `${color}12`,
            padding: '4px 10px',
            borderRadius: '100px',
            marginBottom: '14px',
          }}
        >
          {badge}
        </span>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: 'clamp(1.125rem, 2vw, 1.375rem)',
            color: '#1a2138',
            marginBottom: '12px',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.9375rem',
            color: '#6b7280',
            lineHeight: 1.7,
            marginBottom: '16px',
          }}
        >
          {description}
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {highlights.map((h) => (
            <li key={h} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: '#374151' }}>{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mockup card */}
      <div
        style={{
          flex: '0 0 auto',
          width: 'clamp(220px, 28vw, 300px)',
          background: '#fff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={16} color={color} strokeWidth={2} />
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#9ca3af', fontWeight: '500' }}>{badge}</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {mockup.map((row) => (
            <div key={row.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#6b7280' }}>{row.label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', fontWeight: '700', color: row.barColor }}>{row.value}%</span>
              </div>
              <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '100px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${row.value}%`, background: row.barColor, borderRadius: '100px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SolutionSection() {
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
    <section id="solution" style={{ background: '#f7f9fc', padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          ref={titleRef}
          style={{
            textAlign: 'center',
            marginBottom: '64px',
            opacity: 0,
            transform: 'translateY(16px)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
          }}
        >
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#BF3003',
              marginBottom: '12px',
            }}
          >
            Giải pháp
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: '#1a2138',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
            }}
          >
            AI Insight — Từ hội thoại đến quyết định
            <br />
            trong <span style={{ color: '#0052FF' }}>3 giây</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: '#6b7280',
              maxWidth: '480px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
          >
            Thay vì đọc 100 cuộc chat, bạn chỉ cần nhìn dashboard — AI đã phân tích, phân loại và gợi ý hành động cho bạn.
          </p>
        </div>

        <div>
          {features.map((f, i) => (
            <FeatureBlock key={f.badge} {...f} reverse={i % 2 !== 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

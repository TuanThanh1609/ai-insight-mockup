import { useEffect, useRef } from 'react';
import { AlertTriangle, Clock, BrainCircuit } from 'lucide-react';

const problems = [
  {
    icon: AlertTriangle,
    title: 'Không biết lead nào "thật", lead nào "rác"',
    description:
      'Chiến dịch chạy tốt trên số — nhưng thực tế 60-80% inbox là khách hỏi cho vui, spam từ ads. Tiền đốt, nhân sự mất công.',
    accent: '#BF3003',
    stat: '60-80%',
    statLabel: 'inbox là khách rác',
  },
  {
    icon: Clock,
    title: 'Mất 15-20 phút để đánh giá từng chiến dịch',
    description:
      'Phải mở từng Ads Manager, export số liệu, rồi đọc chat từng inbox. CEO/Marketer không có thời gian cho việc này.',
    accent: '#0052FF',
    stat: '15-20 phút',
    statLabel: 'cho mỗi chiến dịch',
  },
  {
    icon: BrainCircuit,
    title: 'Setup AI "từ đầu" mất 10-20 phút — dễ bỏ cuộc',
    description:
      'Muốn dùng AI phân tích chat phải tự nghĩ prompt, tự định nghĩa cột dữ liệu. Không có template → không có động lực → bỏ.',
    accent: '#1a2138',
    stat: '< 2 phút',
    statLabel: 'với template sẵn có',
  },
];

function ProblemCard({ icon: Icon, title, description, accent, stat, statLabel, delay }) {
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

  return (
    <div
      ref={ref}
      style={{
        background: '#fff',
        borderRadius: '12px',
        padding: '28px 24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: accent,
        }}
      />

      {/* Stat badge */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'baseline',
          gap: '4px',
          marginBottom: '16px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '1.5rem',
            color: accent,
            lineHeight: 1,
          }}
        >
          {stat}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.75rem',
            color: '#9ca3af',
          }}
        >
          {statLabel}
        </span>
      </div>

      {/* Icon */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          background: `${accent}14`,
        }}
      >
        <Icon size={20} color={accent} strokeWidth={1.8} />
      </div>

      <h3
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: '700',
          fontSize: '1.0625rem',
          color: '#1a2138',
          marginBottom: '10px',
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: '#6b7280',
          lineHeight: 1.65,
          margin: 0,
        }}
      >
        {description}
      </p>
    </div>
  );
}

export function ProblemSection() {
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
    <section id="product" style={{ background: '#f7f9fc', padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Section header */}
        <div
          ref={titleRef}
          style={{
            textAlign: 'center',
            marginBottom: '56px',
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
            Vấn đề thực tế
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
            Marketer thông minh vẫn thua
            <br />
            vì thiếu <span style={{ color: '#BF3003' }}>AI Insight</span>
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
            Không phải vì chiến dịch kém — mà vì không ai giúp bạn đọc được những gì khách hàng thật sự nói trong chat.
          </p>
        </div>

        {/* Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {problems.map((p, i) => (
            <ProblemCard key={p.title} {...p} delay={i * 120} />
          ))}
        </div>
      </div>
    </section>
  );
}

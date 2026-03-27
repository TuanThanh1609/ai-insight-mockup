import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { landingTestimonials } from '../../data/landingTestimonials';

function StarRating({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }} aria-label={`${rating} trên 5 sao`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < rating ? '#BF3003' : 'none'}
          stroke={i < rating ? '#BF3003' : '#d1d5db'}
          strokeWidth="1.8"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const titleRef = useRef(null);

  const prev = () => {
    setActive((a) => (a - 1 + landingTestimonials.length) % landingTestimonials.length);
    setAnimKey((k) => k + 1);
  };
  const next = () => {
    setActive((a) => (a + 1) % landingTestimonials.length);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

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

  const current = landingTestimonials[active];

  return (
    <section
      id="testimonials"
      style={{
        background: '#f7f9fc',
        padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          ref={titleRef}
          style={{
            textAlign: 'center',
            marginBottom: '48px',
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
              color: '#0052FF',
              marginBottom: '12px',
            }}
          >
            Khách hàng nói gì
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: '#1a2138',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            Những người đã dùng thật
          </h2>
        </div>

        {/* Testimonial card */}
        <div
          key={animKey}
          style={{
            maxWidth: '760px',
            margin: '0 auto',
            background: '#fff',
            borderRadius: '16px',
            padding: 'clamp(28px, 5vw, 48px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
            textAlign: 'center',
            animation: 'fadeSlideIn 0.4s ease forwards',
          }}
        >
          <StarRating rating={current.rating} />
          <blockquote
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(1rem, 2vw, 1.1875rem)',
              lineHeight: 1.7,
              color: '#1a2138',
              margin: '20px 0 24px',
              fontStyle: 'italic',
            }}
          >
            "{current.quote}"
          </blockquote>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: '#1a2138',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                fontSize: '0.875rem',
                flexShrink: 0,
              }}
            >
              {current.avatar}
            </div>
            <div style={{ textAlign: 'left' }}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: '600',
                  fontSize: '0.9375rem',
                  color: '#1a2138',
                  margin: 0,
                }}
              >
                {current.name}
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8125rem',
                  color: '#9ca3af',
                  margin: 0,
                }}
              >
                {current.role} · {current.company}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            marginTop: '28px',
          }}
        >
          <button
            onClick={prev}
            aria-label="Bài testimonial trước"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            <ChevronLeft size={18} />
          </button>

          <div style={{ display: 'flex', gap: '6px' }}>
            {landingTestimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setActive(i); setAnimKey((k) => k + 1); }}
                style={{
                  height: '6px',
                  borderRadius: '100px',
                  border: 'none',
                  cursor: 'pointer',
                  width: i === active ? '24px' : '6px',
                  background: i === active ? '#BF3003' : '#d1d5db',
                  transition: 'all 0.3s ease',
                }}
                aria-label={`Xem testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Bài testimonial tiếp"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              cursor: 'pointer',
              color: '#6b7280',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}

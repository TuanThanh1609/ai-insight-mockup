export function TrustSection() {
  return (
    <section
      style={{
        background: '#ffffff',
        padding: 'clamp(56px, 9vw, 96px) clamp(24px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Logo trust row */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.20em',
              color: '#BF3003',
              marginBottom: '20px',
            }}
          >
            Trusted by Market Leaders
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
              opacity: 0.55,
            }}
          >
            {['NEXUS', 'VERTEX', 'QUANTUM', 'AETHER'].map((brand) => (
              <span
                key={brand}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: '800',
                  fontSize: '1.8rem',
                  color: '#1a2138',
                  letterSpacing: '-0.03em',
                }}
              >
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Bento testimonial */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
          }}
        >
          <div
            style={{
              background: '#f3f4f6',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(28px, 4vw, 48px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '360px',
            }}
          >
            <div>
              <span style={{ fontSize: '2.5rem', color: '#BF3003', lineHeight: 1 }}>“</span>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: '700',
                  fontSize: 'clamp(1.25rem, 2.4vw, 2rem)',
                  color: '#1a2138',
                  lineHeight: 1.35,
                  letterSpacing: '-0.02em',
                  marginTop: '8px',
                  marginBottom: '24px',
                }}
              >
                Smax AI không chỉ là một công cụ phân tích. Nó giống như có một đội ngũ nhà tâm lý học dữ liệu làm việc 24/7 để tối ưu hóa mọi điểm chạm khách hàng.
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#1a2138',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  flexShrink: 0,
                }}
              >
                LQ
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '0.9375rem', color: '#1a2138', margin: 0 }}>
                  Lê Minh Quân
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                  Director of Growth, FinTech Solutions
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              background: '#1a2138',
              borderRadius: 'var(--radius-xl)',
              padding: 'clamp(24px, 3.2vw, 40px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '360px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '800',
                fontSize: 'clamp(2.5rem, 5vw, 3.2rem)',
                color: '#ffb4a1',
                lineHeight: 1,
                marginBottom: '10px',
                letterSpacing: '-0.03em',
              }}
            >
              98%
            </div>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1rem',
                color: 'rgba(255,255,255,0.60)',
                lineHeight: 1.7,
                marginBottom: '28px',
              }}
            >
              Khách hàng báo cáo sự cải thiện rõ rệt trong độ chính xác của dự báo doanh thu ngay tháng đầu tiên.
            </p>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-body)',
                fontWeight: '700',
                fontSize: '0.875rem',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Xem tất cả case study
              <span style={{ fontSize: '1rem' }}>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

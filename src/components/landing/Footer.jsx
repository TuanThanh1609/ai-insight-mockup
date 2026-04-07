export function Footer() {
  return (
    <footer
      className="bg-gradient-to-br from-[#1a2138] via-[#0f1729] to-[#1a2138]"
      style={{
        borderTop: '1px solid rgba(26,33,56,0.08)',
        padding: 'clamp(40px, 6vw, 64px) clamp(24px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '40px',
            marginBottom: '40px',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  background: '#BF3003',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>AI Insight</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.40)', lineHeight: 1.65, maxWidth: '320px', marginBottom: '16px' }}>
              Nền tảng AI phân tích hội thoại đa kênh — giúp Marketer và CEO đọc được chất lượng lead trong 3 giây.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {['SSL Secured', 'GDPR Compliant'].map((label) => (
                <span
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.30)',
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)', marginBottom: '14px' }}>Sản phẩm</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Tổng quan Dashboard', 'Gợi ý tối ưu Ads', 'Template Insights', 'Cài đặt Insights'].map((item) => (
                <li key={item}>
                  <a href="#" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(26,33,56,0.60)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#1a2138'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(26,33,56,0.60)'; }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.35)', marginBottom: '14px' }}>Về chúng tôi</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Giới thiệu', 'Blog', 'Liên hệ', 'Chính sách bảo mật'].map((item) => (
                <li key={item}>
                  <a href="#" style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(26,33,56,0.60)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#1a2138'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(26,33,56,0.60)'; }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(26,33,56,0.08)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(26,33,56,0.40)' }}>
            © 2026 AI Insight. Tất cả quyền được bảo lưu.
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(26,33,56,0.30)' }}>
            Made with care in Vietnam
          </p>
        </div>
      </div>
    </footer>
  );
}

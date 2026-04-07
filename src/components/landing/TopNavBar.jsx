export function TopNavBar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(250, 247, 252, 0.82)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: '0 12px 32px rgba(25,28,29,0.04)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '14px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: '800',
            fontSize: '1.5rem',
            letterSpacing: '-0.03em',
            color: '#1a2138',
            lineHeight: 1,
          }}
        >
          Smax AI
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px',
          }}
          className="hidden md:flex"
        >
          {[
            { label: 'Product', active: false },
            { label: 'Khám Bệnh', href: '/kham-benh', active: false, badge: 'NEW' },
            { label: 'Templates', active: false },
            { label: 'Pricing', active: false },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href || '#'}
              onClick={item.href ? undefined : (e) => e.preventDefault()}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: item.active ? '#1a2138' : '#49454f',
                paddingBottom: '6px',
                borderBottom: item.active ? '2px solid #BF3003' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {item.label}
              {item.badge && (
                <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#BF3003', background: 'rgba(191,48,3,0.15)', padding: '1px 5px', borderRadius: 100, letterSpacing: '0.04em' }}>{item.badge}</span>
              )}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#1a2138',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
          <a
            href="#lead-form"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 18px',
              borderRadius: '10px',
              background: '#1a2138',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontWeight: '700',
              fontSize: '0.8125rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
              boxShadow: '0 4px 16px rgba(26,33,56,0.12)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,33,56,0.85)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#1a2138'; }}
          >
            Bắt đầu ngay
          </a>
        </div>
      </div>
    </nav>
  );
}

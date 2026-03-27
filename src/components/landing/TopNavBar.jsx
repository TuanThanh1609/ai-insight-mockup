export function TopNavBar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(26,33,56,0.70)',
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
            color: '#fff',
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
            { label: 'Product', active: true },
            { label: 'Templates' },
            { label: 'Pricing' },
            { label: 'Resources' },
          ].map((item) => (
            <a
              key={item.label}
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: '700',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: item.active ? '#ffffff' : '#cbd5e1',
                paddingBottom: '6px',
                borderBottom: item.active ? '2px solid #BF3003' : '2px solid transparent',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: '600',
              fontSize: '0.875rem',
              color: '#fff',
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
              borderRadius: '8px',
              background: '#BF3003',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontWeight: '700',
              fontSize: '0.8125rem',
              textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cf3605'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#BF3003'; }}
          >
            Bắt đầu ngay
          </a>
        </div>
      </div>
    </nav>
  );
}

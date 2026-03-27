import { useState, useRef, useEffect } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { saveLandingLead } from '../../lib/supabaseLanding';

function StarButton({ filled, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: filled ? '#BF3003' : '#ffffff18',
        border: `1px solid ${filled ? '#BF3003' : 'rgba(255,255,255,0.15)'}`,
        cursor: 'pointer',
        transform: filled ? 'scale(1.15)' : 'scale(1)',
        boxShadow: filled ? '0 4px 16px rgba(191,48,3,0.40)' : 'none',
        transition: 'all 0.15s ease',
      }}
      aria-label={label}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#ffffff' : 'none'} stroke={filled ? '#ffffff' : 'rgba(255,255,255,0.30)'} strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  );
}

export function LeadCaptureSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');
  const [apiError, setApiError] = useState('');
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
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

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Vui lòng nhập họ tên';
    if (!email.trim()) {
      errs.email = 'Vui lòng nhập email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Email không hợp lệ';
    }
    if (!consent) errs.consent = 'Bạn cần đồng ý để gửi thông tin';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    setApiError('');

    const result = await saveLandingLead({ name, email, experience_rating: rating, consent_privacy: consent });
    if (result.success) {
      setStatus('success');
    } else {
      setStatus('error');
      setApiError(result.error || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: hasError ? '2px solid #f87171' : '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9375rem',
    outline: 'none',
    transition: 'border-color 0.15s ease',
    boxSizing: 'border-box',
  });

  const ratingLabels = ['Không hài lòng', 'Cần cải thiện', 'Bình thường', 'Hài lòng', 'Rất hài lòng'];
  const activeRating = hoverRating || rating;

  return (
    <section
      id="lead-form"
      ref={sectionRef}
      style={{
        background: 'linear-gradient(148deg, #0a0f1e 0%, #1a2138 50%, #0d1530 100%)',
        padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)',
        opacity: 0,
        transform: 'translateY(24px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div
        className="flex flex-col lg:flex-row"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          alignItems: 'center',
          gap: 'clamp(32px, 6vw, 80px)',
        }}
      >
        {/* Left copy */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)',
              fontSize: '0.6875rem',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#BF3003',
              marginBottom: '16px',
            }}
          >
            Dùng thử miễn phí
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: '#fff',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '16px',
            }}
          >
            Trải nghiệm AI Insight
            <br />
            <span style={{ color: '#BF3003' }}>trong 5 phút</span>
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              color: 'rgba(255,255,255,0.60)',
              lineHeight: 1.7,
              marginBottom: '28px',
            }}
          >
            Để lại thông tin — chúng tôi sẽ setup tài khoản và gửi link trải nghiệm đầy đủ tính năng. Không cần thẻ tín dụng.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              'Setup trong 5 phút',
              'Không cần thẻ tín dụng',
              'Hỗ trợ 24/7 qua Zalo',
              'Dữ liệu được bảo mật tuyệt đối',
            ].map((t) => (
              <li key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'rgba(255,255,255,0.55)' }}>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right — Glass form */}
        <div
          style={{
            flex: '0 0 auto',
            width: 'clamp(320px, 36vw, 440px)',
            background: 'rgba(255,255,255,0.06)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid rgba(255,255,255,0.10)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.40)',
          }}
        >
          {status === 'success' ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '32px 0', textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(5,150,105,0.12)', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={36} color="#059669" />
              </div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.375rem', color: '#fff', margin: 0 }}>Cảm ơn bạn!</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9375rem', color: 'rgba(255,255,255,0.60)', margin: 0, lineHeight: 1.6 }}>
                Chúng tôi sẽ liên hệ trong thời gian sớm nhất.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: '700', fontSize: '1.25rem', color: '#fff', textAlign: 'center', marginBottom: '24px', letterSpacing: '-0.01em' }}>
                Đăng ký trải nghiệm
              </h3>

              {/* Name */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: '500', color: 'rgba(255,255,255,0.72)', marginBottom: '6px' }}>
                  Họ tên <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors((er) => ({ ...er, name: '' })); }}
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  style={inputStyle(!!errors.name)}
                  onFocus={(e) => { if (!errors.name) e.target.style.borderColor = 'rgba(0,82,255,0.5)'; }}
                  onBlur={(e) => { if (!errors.name) e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                {errors.name && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>{errors.name}</p>}
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: '500', color: 'rgba(255,255,255,0.72)', marginBottom: '6px' }}>
                  Email <span style={{ color: '#f87171' }}>*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors((er) => ({ ...er, email: '' })); }}
                  placeholder="email@doanhnghiep.vn"
                  autoComplete="email"
                  style={inputStyle(!!errors.email)}
                  onFocus={(e) => { if (!errors.email) e.target.style.borderColor = 'rgba(0,82,255,0.5)'; }}
                  onBlur={(e) => { if (!errors.email) e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                {errors.email && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>{errors.email}</p>}
              </div>

              {/* Star rating */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: '500', color: 'rgba(255,255,255,0.72)', marginBottom: '8px' }}>
                  Đánh giá trải nghiệm
                </label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <StarButton
                        filled={(i + 1) <= activeRating}
                        onClick={() => setRating(i + 1)}
                        label={`${i + 1} sao`}
                      />
                    </div>
                  ))}
                </div>
                {rating > 0 && (
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.40)', marginTop: '6px' }}>
                    {ratingLabels[rating - 1]}
                  </p>
                )}
              </div>

              {/* Consent */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors((er) => ({ ...er, consent: '' })); }}
                    style={{ marginTop: '2px', accentColor: '#BF3003', flexShrink: 0 }}
                  />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'rgba(255,255,255,0.60)', lineHeight: 1.5 }}>
                    Tôi đồng ý chia sẻ thông tin để nhận hỗ trợ.{' '}
                    <a href="#" onClick={(e) => e.preventDefault()} style={{ color: '#0052FF', textDecoration: 'underline' }}>Chính sách bảo mật</a>
                  </span>
                </label>
                {errors.consent && <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#f87171', marginTop: '4px' }}>{errors.consent}</p>}
              </div>

              {/* API error */}
              {status === 'error' && apiError && (
                <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(220,38,38,0.12)', border: '1px solid rgba(220,38,38,0.3)', fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: '#fca5a5' }}>
                  {apiError}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '8px',
                  background: status === 'loading' ? 'rgba(191,48,3,0.70)' : '#BF3003',
                  color: '#fff',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9375rem',
                  fontWeight: '600',
                  border: 'none',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  boxShadow: '0 4px 20px rgba(191,48,3,0.40)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    Đang gửi...
                  </>
                ) : (
                  'Gửi đăng ký ngay'
                )}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

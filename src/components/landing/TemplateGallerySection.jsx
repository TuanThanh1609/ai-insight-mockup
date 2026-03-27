import { useEffect, useRef, useState } from 'react';
import { ArrowRight, X, ChevronRight, BarChart2, MessageSquare, TrendingUp, Users } from 'lucide-react';
import { mockTemplates, INDUSTRIES } from '../../data/mockTemplates';
import { TemplateCard } from '../insight/TemplateCard';

// ─── Design tokens ──────────────────────────────────────────────────────────
const C = {
  navy:      '#1A2138',
  rust:      '#BF3003',
  blue:      '#0052FF',
  surface:   '#fcf8fb',
  white:     '#ffffff',
  muted:     '#6b7280',
  border:    'rgba(26,33,56,0.08)',
  glassBg:   'rgba(255,255,255,0.72)',
  glassBlur: 'blur(16px)',
  shadow:    '0 8px 40px rgba(26,33,56,0.10)',
};

// ─── Mock conversation stats per template ────────────────────────────────────
const TEMPLATE_STATS = mockTemplates.reduce((acc, t) => {
  // Spread conversations evenly but with some variety
  const seed = t.id.charCodeAt(0) * 13 + t.id.charCodeAt(2) * 7;
  const conversations = 40 + (seed % 60);
  const avgTemp = ['Nóng', 'Nóng', 'Ấm', 'Ấm', 'Lạnh'][seed % 5];
  const hotPct = Math.round(30 + (seed % 40));
  const qualityScore = 45 + (seed % 45);
  acc[t.id] = { conversations, avgTemp, hotPct, qualityScore };
  return acc;
}, {});

// ─── Expanded preview modal ─────────────────────────────────────────────────
function TemplatePreviewModal({ template, onClose }) {
  if (!template) return null;
  const stats = TEMPLATE_STATS[template.id];
  const previewCols = template.columns.slice(0, 4);
  const extraCols = template.columns.length - 4;

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,15,30,0.65)',
        backdropFilter: 'blur(6px)',
      }} />

      {/* Modal */}
      <div
        style={{
          position: 'relative', zIndex: 1,
          background: C.white,
          borderRadius: '12px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.30)',
          width: '100%', maxWidth: '560px',
          maxHeight: '88vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{template.icon}</span>
            <div>
              <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.rust }}>
                {INDUSTRIES.find((i) => i.id === template.industry)?.label}
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.0625rem', color: C.navy, lineHeight: 1.3 }}>
                {template.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px',
              borderRadius: '8px', border: 'none',
              background: '#f3f4f6', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'background 0.15s',
            }}
            aria-label="Đóng"
          >
            <X size={16} color={C.muted} />
          </button>
        </div>

        {/* Description */}
        <p style={{ padding: '12px 24px 0', fontSize: '0.875rem', color: C.muted, lineHeight: 1.6 }}>
          {template.description}
        </p>

        {/* Stats row */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px', padding: '20px 24px 0',
        }}>
          {[
            { icon: MessageSquare, label: 'Hội thoại', value: stats.conversations.toLocaleString('vi-VN') },
            { icon: TrendingUp, label: 'Lead Nóng', value: `${stats.hotPct}%` },
            { icon: BarChart2, label: 'Chất lượng', value: stats.qualityScore },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{
              background: '#f7f9fc', borderRadius: '8px',
              padding: '10px 12px', textAlign: 'center',
            }}>
              <Icon size={14} color={C.blue} style={{ margin: '0 auto 4px' }} />
              <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: C.navy }}>{value}</p>
              <p style={{ fontSize: '0.6875rem', color: C.muted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Column list */}
        <div style={{ padding: '20px 24px' }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: C.muted, marginBottom: '10px' }}>
            Cấu hình cột dữ liệu
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {template.columns.map((col) => (
              <div key={col.id} style={{
                display: 'flex', alignItems: 'flex-start', gap: '10px',
                padding: '10px 12px', borderRadius: '8px',
                background: '#f7f9fc',
              }}>
                <span style={{ fontSize: '0.875rem', flexShrink: 0 }}>{col.icon}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: C.navy, lineHeight: 1.3 }}>
                    {col.name}
                  </p>
                  <p style={{ fontSize: '0.6875rem', color: C.muted, lineHeight: 1.5, marginTop: '2px' }}>
                    {col.prompt?.slice(0, 80)}…
                  </p>
                </div>
                <span style={{
                  fontSize: '0.625rem', fontWeight: 600,
                  padding: '2px 6px', borderRadius: '4px', flexShrink: 0,
                  background: col.dataType === 'single_select' ? 'rgba(0,82,255,0.10)' :
                             col.dataType === 'true_false' ? 'rgba(5,150,105,0.10)' :
                             'rgba(191,48,3,0.10)',
                  color: col.dataType === 'single_select' ? C.blue :
                         col.dataType === 'true_false' ? '#059669' : C.rust,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  {col.dataType === 'single_select' ? 'Chọn 1' :
                   col.dataType === 'true_false' ? 'True/False' :
                   'Văn bản'}
                </span>
              </div>
            ))}
            {extraCols > 0 && (
              <p style={{ fontSize: '0.75rem', color: C.muted, textAlign: 'center', paddingTop: '4px' }}>
                +{extraCols} cột khác
              </p>
            )}
          </div>
        </div>

        {/* CTA */}
        <div style={{ padding: '0 24px 24px', display: 'flex', gap: '10px' }}>
          <a
            href="#lead-form"
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '12px', borderRadius: '8px',
              background: C.rust, color: C.white,
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(191,48,3,0.30)',
            }}
          >
            Bắt đầu dùng thử
            <ArrowRight size={15} />
          </a>
          <a
            href="/insight/settings"
            style={{
              flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              padding: '12px', borderRadius: '8px',
              background: 'transparent', color: C.navy,
              fontFamily: 'var(--font-body)', fontSize: '0.875rem', fontWeight: 600,
              border: '1px solid rgba(26,33,56,0.20)',
              textDecoration: 'none', cursor: 'pointer',
            }}
          >
            Xem trong app
            <ChevronRight size={15} />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Compact template preview card (for the grid) ───────────────────────────
function CompactTemplateCard({ template, onPreview }) {
  const previewCols = template.columns.slice(0, 3);
  const stats = TEMPLATE_STATS[template.id];
  const industryColors = {
    fashion:    { bg: 'rgba(251,207,232,0.5)', text: '#be185d' },
    mebaby:     { bg: 'rgba(219,234,254,0.5)', text: '#1d4ed8' },
    cosmetics:  { bg: 'rgba(243,232,255,0.5)', text: '#7e22ce' },
    spa:        { bg: 'rgba(254,235,200,0.5)', text: '#c2410c' },
    realestate: { bg: 'rgba(203,213,225,0.5)', text: '#1e40af' },
    fnb:        { bg: 'rgba(220,252,231,0.5)', text: '#15803d' },
    travel:     { bg: 'rgba(186,230,253,0.5)', text: '#0369a1' },
  };
  const col = industryColors[template.industry] || { bg: 'rgba(243,244,246,0.8)', text: C.muted };

  return (
    <div style={{
      background: C.white,
      borderRadius: '10px',
      padding: '16px',
      boxShadow: '0 2px 12px rgba(26,33,56,0.06)',
      border: '1px solid rgba(26,33,56,0.06)',
      display: 'flex', flexDirection: 'column', gap: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(26,33,56,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 2px 12px rgba(26,33,56,0.06)';
    }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.25rem' }}>{template.icon}</span>
          <div>
            <p style={{
              fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.08em', color: col.text,
            }}>
              {INDUSTRIES.find((i) => i.id === template.industry)?.label}
            </p>
            <h4 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '0.8125rem', color: C.navy, lineHeight: 1.3,
              maxWidth: '160px',
            }}>
              {template.name}
            </h4>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.6875rem', color: C.muted, lineHeight: 1.55,
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {template.description}
      </p>

      {/* Column chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {previewCols.map((col) => (
          <span key={col.id} style={{
            fontSize: '0.625rem', fontWeight: 500,
            padding: '3px 7px', borderRadius: '100px',
            background: 'rgba(26,33,56,0.05)', color: C.navy,
          }}>
            {col.icon} {col.name.slice(0, 8)}
          </span>
        ))}
        {template.columns.length > 3 && (
          <span style={{
            fontSize: '0.625rem', fontWeight: 500,
            padding: '3px 7px', borderRadius: '100px',
            background: `${C.rust}14`, color: C.rust,
          }}>
            +{template.columns.length - 3}
          </span>
        )}
      </div>

      {/* Stats mini-row */}
      <div style={{ display: 'flex', gap: '8px', borderTop: `1px solid ${C.border}`, paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <MessageSquare size={10} color={C.muted} />
          <span style={{ fontSize: '0.625rem', color: C.muted }}>{stats.conversations}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <TrendingUp size={10} color="#059669" />
          <span style={{ fontSize: '0.625rem', color: '#059669' }}>{stats.hotPct}% nóng</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', marginLeft: 'auto' }}>
          <BarChart2 size={10} color={C.blue} />
          <span style={{ fontSize: '0.625rem', color: C.blue }}>{stats.qualityScore}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onPreview(template)}
        style={{
          width: '100%', padding: '8px',
          borderRadius: '6px', border: 'none',
          background: 'rgba(26,33,56,0.04)', cursor: 'pointer',
          fontFamily: 'var(--font-body)', fontSize: '0.75rem', fontWeight: 600,
          color: C.navy, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,33,56,0.08)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(26,33,56,0.04)'; }}
      >
        Xem chi tiết <ChevronRight size={13} />
      </button>
    </div>
  );
}

// ─── Main TemplateGallerySection ─────────────────────────────────────────────
export function TemplateGallerySection() {
  const titleRef = useRef(null);
  const [activeIndustry, setActiveIndustry] = useState('all');
  const [previewTemplate, setPreviewTemplate] = useState(null);

  // Group by industry
  const grouped = mockTemplates.reduce((acc, t) => {
    if (!acc[t.industry]) acc[t.industry] = [];
    acc[t.industry].push(t);
    return acc;
  }, {});

  const allIndustries = [
    { id: 'all', label: 'Tất cả' },
    ...INDUSTRIES,
  ];

  const displayedTemplates =
    activeIndustry === 'all'
      ? Object.values(grouped).flat().slice(0, 14) // chỉ 2 template mỗi ngành × 7 ngành
      : (grouped[activeIndustry] || []).slice(0, 2); // khi lọc ngành: max 2

  // Scroll-reveal for title
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
    <>
      <section id="templates" style={{ background: C.surface, padding: 'clamp(64px, 10vw, 100px) clamp(24px, 5vw, 64px)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section title */}
          <div
            ref={titleRef}
            style={{
              textAlign: 'center', marginBottom: '40px',
              opacity: 0, transform: 'translateY(16px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <span style={{
              display: 'inline-block',
              fontFamily: 'var(--font-body)', fontSize: '0.6875rem', fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: C.rust, marginBottom: '12px',
            }}>
              Template sẵn có
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: C.navy, lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: '14px',
            }}>
              AI phân tích đúng ngành của bạn —{' '}
              <span style={{ color: C.blue }}>không cần cấu hình</span>
            </h2>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '1rem', color: C.muted,
              maxWidth: '460px', margin: '0 auto', lineHeight: 1.65,
            }}>
              7 ngành · 42 template · Mỗi template đã có sẵn cấu hình cột dữ liệu + prompt cho AI đọc.
            </p>
          </div>

          {/* Industry tabs */}
          <div style={{
            display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px',
            marginBottom: '24px', scrollbarWidth: 'none',
          }}>
            {allIndustries.map((ind) => (
              <button
                key={ind.id}
                onClick={() => setActiveIndustry(ind.id)}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  fontFamily: 'var(--font-body)', fontSize: '0.8125rem', fontWeight: 600,
                  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
                  transition: 'all 0.15s ease',
                  background: activeIndustry === ind.id ? C.navy : C.white,
                  color: activeIndustry === ind.id ? C.white : C.navy,
                  boxShadow: activeIndustry === ind.id ? '0 4px 12px rgba(26,33,56,0.20)' : '0 1px 4px rgba(26,33,56,0.06)',
                }}
              >
                {ind.label}
                <span style={{
                  marginLeft: '6px', fontSize: '0.6875rem',
                  opacity: 0.7,
                }}>
                  {ind.id === 'all' ? 14 : (grouped[ind.id]?.length || 0)}
                </span>
              </button>
            ))}
          </div>

          {/* Template grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '14px',
            marginBottom: '32px',
          }}>
            {displayedTemplates.map((template) => (
              <CompactTemplateCard
                key={template.id}
                template={template}
                onPreview={setPreviewTemplate}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign: 'center' }}>
            <a
              href="#lead-form"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                fontFamily: 'var(--font-body)', fontSize: '0.9375rem', fontWeight: 600,
                color: C.rust, textDecoration: 'none',
                transition: 'gap 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.gap = '10px'; }}
              onMouseLeave={(e) => { e.currentTarget.style.gap = '6px'; }}
            >
              Bắt đầu với template miễn phí
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Preview modal */}
      {previewTemplate && (
        <TemplatePreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
        />
      )}
    </>
  );
}

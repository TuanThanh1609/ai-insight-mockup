import { useMemo, useState } from 'react';
import {
  Stethoscope,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Clock,
  Sparkles,
  Target,
  MessageSquare,
  ChevronRight,
  Shield,
  ShieldAlert,
  Zap,
  X,
  Image as ImageIcon,
  Expand,
  Database,
  Cpu,
  Workflow,
  Gauge,
} from 'lucide-react';

import dashboard1 from '../assets/medical/dashboard-1.jpg';
import dashboard2 from '../assets/medical/dashboard-2.jpg';
import dashboard3 from '../assets/medical/dashboard-3.jpg';
import funnelSection from '../assets/medical/funnel-section.jpg';
import funnelFullpage from '../assets/medical/funnel-fullpage.jpg';
import alertExpand from '../assets/medical/alert-expand.jpg';

const C = {
  bg: '#0A0C14',
  navy: '#1A2138',
  rust: '#BF3003',
  blue: '#0052FF',
  text: '#e3e2e3',
  muted: '#cdc3d6',
  green: '#059669',
  amber: '#d97706',
};

const REAL_GALLERY = [
  {
    id: 'dash-1',
    title: 'Dashboard tổng quan Khám Bệnh',
    description: 'Health Score + KPI trọng tâm + cảnh báo ưu tiên theo mức độ rủi ro.',
    src: dashboard1,
    category: 'Dashboard',
  },
  {
    id: 'dash-2',
    title: 'Chẩn đoán theo nhóm bệnh',
    description: 'Điểm số chi tiết từng nhóm bệnh và insight hành động cho team vận hành.',
    src: dashboard2,
    category: 'Diagnosis',
  },
  {
    id: 'dash-3',
    title: 'Kết quả chuyên sâu theo hội thoại',
    description: 'Phân tích sâu theo conversation, giúp truy vết nguyên nhân mất khách.',
    src: dashboard3,
    category: 'Conversation',
  },
  {
    id: 'funnel-1',
    title: 'Phễu chuyển đổi hội thoại',
    description: 'Lead Nóng → Thu SĐT → Chốt đơn → Khách rác, trực quan để ra quyết định nhanh.',
    src: funnelSection,
    category: 'Funnel',
  },
  {
    id: 'funnel-2',
    title: 'Full-page Funnel + alert context',
    description: 'Liên kết funnel với cảnh báo để ưu tiên xử lý đúng điểm nghẽn.',
    src: funnelFullpage,
    category: 'Funnel',
  },
  {
    id: 'alert-1',
    title: 'Gợi Ý Tối Ưu có thể mở rộng',
    description: 'Expand alert để xem dẫn chứng hội thoại cụ thể trước khi hành động.',
    src: alertExpand,
    category: 'Alerts',
  },
];

function SectionTag({ children, color = C.blue }) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.6875rem',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color,
        background: `${color}20`,
        border: `1px solid ${color}40`,
        padding: '4px 12px',
        borderRadius: 999,
      }}
    >
      {children}
    </span>
  );
}

function GlassCard({ children, style }) {
  return (
    <div
      style={{
        background: 'rgba(26,33,56,0.62)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 'var(--radius-lg)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function HeroMedicalSection() {
  const nodes = [
    { top: '12%', left: '14%', title: 'Khách hàng hài lòng', value: '94.2%', color: C.blue },
    { top: '16%', right: '10%', title: 'Tỉ lệ chốt đơn kém', value: 'Warning -12%', color: C.rust },
    { top: '45%', right: '6%', title: 'Phản hồi chậm', value: 'Avg 4.5m', color: C.rust },
    { bottom: '26%', right: '14%', title: 'Thái độ chưa tốt', value: '18 cases', color: '#9ca3af' },
    { bottom: '14%', left: '10%', title: 'Chưa chăm sóc lại', value: '142 leads', color: '#9ca3af' },
  ];

  return (
    <section style={{ background: C.bg, color: C.text, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        @keyframes radar-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes tilt-rotate { from { transform: perspective(1000px) rotateX(62deg) rotateZ(0deg); } to { transform: perspective(1000px) rotateX(62deg) rotateZ(360deg); } }
        @keyframes node-pulse { 0%,100% { opacity:.35; transform:scale(1);} 50% { opacity:1; transform:scale(1.08);} }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,82,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,255,0.06) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.35 }} />
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(0,82,255,0.16)', filter: 'blur(120px)' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(191,48,3,0.14)', filter: 'blur(120px)' }} />

      <nav style={{ position: 'sticky', top: 0, zIndex: 20, backdropFilter: 'blur(16px)', background: 'rgba(10,12,20,0.75)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <span style={{ width: 22, height: 22, borderRadius: 'var(--radius-sm)', background: C.blue, display: 'inline-block' }} />
            Smax AI
          </div>
          <a href="#lead-form" style={{ background: C.blue, color: '#fff', textDecoration: 'none', borderRadius: 'var(--radius-md)', padding: '9px 16px', fontSize: 13, fontWeight: 600 }}>
            Trải nghiệm ngay
          </a>
        </div>
      </nav>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '64px 24px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48, maxWidth: 860, marginInline: 'auto' }}>
          <SectionTag>Diagnostic Module · Conical Radar Sync</SectionTag>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,4rem)', margin: '16px 0 12px', lineHeight: 1.07 }}>
            Khám Bệnh Hội Thoại
          </h1>
          <p style={{ color: C.muted, fontSize: 17, lineHeight: 1.7 }}>
            Hệ thống phân tích đa chiều các điểm chạm khách hàng. AI quét hội thoại theo thời gian thực,
            nhận diện điểm nghẽn trong quy trình tư vấn và đề xuất hành động tối ưu ngay lập tức.
          </p>
        </div>

        <div style={{ position: 'relative', margin: '0 auto', maxWidth: 980, minHeight: 560 }}>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
            <div style={{ width: 'min(70vw,560px)', height: 'min(70vw,560px)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(0,82,255,0.20)', animation: 'tilt-rotate 20s linear infinite' }} />
              <div style={{ position: 'absolute', inset: '15%', borderRadius: '50%', border: '1px solid rgba(0,82,255,0.16)' }} />
              <div style={{ position: 'absolute', inset: '30%', borderRadius: '50%', border: '1px solid rgba(0,82,255,0.12)' }} />
              <div style={{ position: 'absolute', inset: '45%', borderRadius: '50%', border: '1px solid rgba(0,82,255,0.10)' }} />

              <div style={{ position: 'absolute', inset: 0, animation: 'radar-sweep 8s linear infinite' }}>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background:
                      'conic-gradient(from 0deg, rgba(0,82,255,0.62) 0deg, rgba(0,82,255,0.24) 22deg, transparent 46deg, transparent 360deg)',
                    maskImage: 'radial-gradient(circle, #000 0%, transparent 70%)',
                    WebkitMaskImage: 'radial-gradient(circle, #000 0%, transparent 70%)',
                  }}
                />
              </div>

              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 16, height: 16, borderRadius: '50%', background: C.blue, boxShadow: '0 0 30px rgba(0,82,255,1)' }} />
            </div>
          </div>

          {nodes.map((n, i) => (
            <div key={i} style={{ position: 'absolute', ...n, animation: 'node-pulse 3.2s ease-in-out infinite', animationDelay: `${i * 0.6}s` }}>
              <div style={{ background: 'rgba(26,33,56,0.62)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 'var(--radius-lg)', padding: 14 }}>
                <Activity size={18} color={n.color} />
              </div>
              <div style={{ marginTop: 6, whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: n.color }}>{n.title}</div>
                <div style={{ fontWeight: 700 }}>{n.value}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
          {[
            ['Tần suất quét', '8.0s / chu kỳ'],
            ['Hội thoại đang chạy', '1,240'],
            ['Độ chính xác AI', '99.8%'],
            ['Phản hồi hệ thống', 'Real-time'],
          ].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.blue }}>{k}</div>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealScreenshotsSection() {
  const [active, setActive] = useState(null);

  const categories = useMemo(
    () => ['Tất cả', ...Array.from(new Set(REAL_GALLERY.map((x) => x.category)))],
    []
  );
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  const filtered = useMemo(() => {
    if (activeCategory === 'Tất cả') return REAL_GALLERY;
    return REAL_GALLERY.filter((x) => x.category === activeCategory);
  }, [activeCategory]);

  const systemInfo = [
    {
      icon: Workflow,
      title: 'Quy trình end-to-end',
      text: 'Kết nối kênh chat → AI phân tích → Health Score → gợi ý hành động theo ưu tiên.',
    },
    {
      icon: Database,
      title: 'Dữ liệu thật theo hội thoại',
      text: 'Mỗi cảnh báo đều có dẫn chứng conversation cụ thể, tránh quyết định dựa trên cảm tính.',
    },
    {
      icon: Cpu,
      title: 'AI phân tích thời gian thực',
      text: 'Radar scan theo chu kỳ, cập nhật liên tục để team xử lý rủi ro ngay khi phát sinh.',
    },
    {
      icon: Gauge,
      title: 'KPI vận hành rõ ràng',
      text: 'Health Score + funnel + alert giúp CEO/CMO scan trong vài giây và ra quyết định nhanh.',
    },
  ];

  return (
    <section style={{ background: '#0f111b', color: C.text, padding: '72px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <SectionTag color={C.green}>Hệ thống Khám bệnh đang vận hành thực tế</SectionTag>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,3vw,2.6rem)', margin: '12px 0 8px' }}>
          Không Chỉ Show Hình — Đây Là Cách Hệ Thống Tạo Ra Quyết Định Kinh Doanh
        </h2>
        <p style={{ color: C.muted, marginBottom: 24, lineHeight: 1.7, maxWidth: 860 }}>
          Landing page này không chỉ để “trưng bày UI”. Mỗi màn hình bên dưới phản ánh đúng một phần của hệ thống Khám bệnh:
          cách dữ liệu hội thoại được phân tích, cách rủi ro được phát hiện, và cách hành động được ưu tiên để tăng conversion.
        </p>

        {/* System info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginBottom: 20 }}>
          {systemInfo.map((info) => (
            <GlassCard key={info.title} style={{ padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-md)', background: `${C.blue}20`, border: `1px solid ${C.blue}40`, display: 'grid', placeItems: 'center' }}>
                  <info.icon size={16} color={C.blue} />
                </div>
                <h3 style={{ margin: 0, fontSize: 15, color: '#fff' }}>{info.title}</h3>
              </div>
              <p style={{ margin: 0, color: C.muted, fontSize: 13, lineHeight: 1.55 }}>{info.text}</p>
            </GlassCard>
          ))}
        </div>

        {/* Category tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
          {categories.map((cat) => {
            const activeChip = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: activeChip ? `${C.blue}25` : 'rgba(255,255,255,0.04)',
                  color: activeChip ? '#fff' : C.muted,
                  borderRadius: 999,
                  padding: '7px 12px',
                  fontSize: 12,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Evidence gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}>
          {filtered.map((item) => (
            <GlassCard key={item.id} style={{ overflow: 'hidden', padding: 0 }}>
              <button
                onClick={() => setActive(item)}
                style={{ display: 'block', width: '100%', border: 'none', background: 'transparent', padding: 0, cursor: 'zoom-in', textAlign: 'left' }}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={item.src}
                    alt={item.title}
                    style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(10,12,20,0.72)', border: '1px solid rgba(255,255,255,0.2)', width: 32, height: 32, borderRadius: 'var(--radius-md)', display: 'grid', placeItems: 'center' }}>
                    <Expand size={14} color="#fff" />
                  </div>
                </div>

                <div style={{ padding: 14 }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.blue, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    <ImageIcon size={12} /> {item.category}
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: 17, color: '#fff' }}>{item.title}</h3>
                  <p style={{ margin: 0, color: C.muted, lineHeight: 1.55, fontSize: 14 }}>{item.description}</p>
                </div>
              </button>
            </GlassCard>
          ))}
        </div>

        {/* Explain value from screenshots */}
        <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {[
            ['Dashboard tổng quan', 'Giúp lãnh đạo nắm tình trạng vận hành ngay trong 3 giây.'],
            ['Funnel chuyển đổi', 'Biết đang rơi lead ở bước nào để tối ưu đúng điểm nghẽn.'],
            ['Cảnh báo mở rộng', 'Click vào alert để xem dẫn chứng hội thoại trước khi ra quyết định.'],
            ['Chi tiết hội thoại', 'Đội vận hành có thể truy vết nguyên nhân theo từng case thực tế.'],
          ].map(([title, text]) => (
            <GlassCard key={title} style={{ padding: 12 }}>
              <h4 style={{ margin: '0 0 6px', fontSize: 14, color: '#fff' }}>{title}</h4>
              <p style={{ margin: 0, color: C.muted, fontSize: 13, lineHeight: 1.55 }}>{text}</p>
            </GlassCard>
          ))}
        </div>

        {active && (
          <div
            onClick={() => setActive(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,8,16,0.88)',
              zIndex: 999,
              display: 'grid',
              placeItems: 'center',
              padding: 20,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActive(null);
              }}
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                cursor: 'pointer',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <X size={18} />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: 1240,
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                borderRadius: 'var(--radius-lg)',
                background: '#0e1220',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              }}
            >
              <img src={active.src} alt={active.title} style={{ width: '100%', display: 'block' }} />
              <div style={{ padding: 16 }}>
                <h3 style={{ margin: '0 0 6px', color: '#fff' }}>{active.title}</h3>
                <p style={{ margin: 0, color: C.muted }}>{active.description}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

const PROBLEMS = [
  ['Không biết team mất khách ở đâu', 'Thiếu hệ thống chẩn đoán theo hội thoại'],
  ['Ads chạy nhưng ít đơn', 'Ngân sách bị đốt vào Junk Lead'],
  ['Nhân viên phản hồi chậm', 'Không có SLA phản hồi rõ ràng'],
  ['Khách nhắc đối thủ liên tục', 'Thiếu script phản biện cạnh tranh'],
];

function ProblemMedicalSection() {
  return (
    <section style={{ background: '#11131d', color: C.text, padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag color={C.rust}>Điểm đen vận hành</SectionTag>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', margin: '12px 0 24px' }}>
          Phát Hiện Nguyên Nhân Shop Bị Mất Khách
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 14 }}>
          {PROBLEMS.map(([a, b]) => (
            <GlassCard key={a} style={{ padding: 18 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <AlertTriangle size={14} color={C.rust} />
                <strong>{a}</strong>
              </div>
              <p style={{ margin: 0, color: C.muted }}>{b}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  {
    icon: MessageSquare,
    title: 'Kết nối hội thoại đa kênh',
    desc: 'Kết nối Facebook, Zalo OA để đồng bộ toàn bộ cuộc hội thoại trong một dashboard duy nhất.',
    metric: '1 phút setup',
    color: C.blue,
  },
  {
    icon: Sparkles,
    title: 'AI chẩn đoán 10 nhóm bệnh',
    desc: 'Phân tích cảm xúc, phản hồi sale, tỷ lệ mất khách, cạnh tranh và điểm nghẽn conversion.',
    metric: '8s / chu kỳ quét',
    color: C.rust,
  },
  {
    icon: Target,
    title: 'Đề xuất hành động tức thì',
    desc: 'Nhận gợi ý hành động ưu tiên để cải thiện tỉ lệ chốt đơn và giảm Junk lead.',
    metric: 'Realtime insights',
    color: C.green,
  },
];

function HowItWorksSection() {
  return (
    <section style={{ background: C.bg, color: C.text, padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag>Cách hoạt động</SectionTag>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', margin: '12px 0 24px' }}>
          3 Bước Từ Hội Thoại Lộn Xộn Đến Quyết Định Chuẩn
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>
          {STEPS.map((s, idx) => (
            <GlassCard key={s.title} style={{ padding: 20, position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${s.color}20`, display: 'grid', placeItems: 'center', border: `1px solid ${s.color}40` }}>
                  <s.icon size={18} color={s.color} />
                </div>
                <span style={{ fontSize: 11, color: s.color, fontWeight: 700, letterSpacing: '0.08em' }}>0{idx + 1}</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 20 }}>{s.title}</h3>
              <p style={{ margin: '0 0 12px', color: C.muted, lineHeight: 1.65 }}>{s.desc}</p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: s.color, fontWeight: 700 }}>
                <Clock size={14} /> {s.metric}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const DISEASES = [
  ['Chất lượng lead', 'Junk lead, nguồn quảng cáo, chất lượng data', C.rust],
  ['Tốc độ phản hồi', 'Delay phản hồi khiến khách rời đi', C.rust],
  ['Thái độ tư vấn', 'Tone tư vấn và khả năng xử lý phản đối', C.amber],
  ['Kịch bản sale', 'Thiếu script chốt đơn và follow-up', C.amber],
  ['Đối thủ cạnh tranh', 'Khách nhắc đối thủ và lý do so sánh', C.blue],
  ['CSKH sau mua', 'Rủi ro review xấu, hoàn tiền, bóc phốt', C.rust],
  ['Upsell / Cross-sell', 'Cơ hội tăng AOV bị bỏ lỡ', C.amber],
  ['Phân khúc khách hàng', 'Giới tính, location, budget, segment', C.blue],
  ['Rủi ro pháp lý', 'Cam kết quá mức và claim nhạy cảm', C.rust],
  ['Hiệu suất nhân viên', 'Ai đang làm tốt / mất khách', C.green],
];

function DiseaseGroupsSection() {
  return (
    <section style={{ background: '#11131d', color: C.text, padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag color={C.rust}>10 nhóm bệnh</SectionTag>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', margin: '12px 0 24px' }}>
          Radar Chẩn Đoán Toàn Diện Cuộc Hội Thoại
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
          {DISEASES.map(([title, desc, color], idx) => (
            <GlassCard key={title} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color, letterSpacing: '0.12em', fontWeight: 700 }}>BỆNH {idx + 1}</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              </div>
              <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{title}</h3>
              <p style={{ margin: 0, color: C.muted, lineHeight: 1.55, fontSize: 14 }}>{desc}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

const SAMPLE_RESULTS = [
  {
    title: 'Lead nóng tụt do phản hồi chậm',
    detail: 'Tăng SLA phản hồi xuống dưới 2 phút trong khung giờ cao điểm.',
    impact: '+14% conversion',
    icon: Clock,
    color: C.rust,
  },
  {
    title: 'Tỷ lệ junk lead cao từ 1 nhóm ads',
    detail: 'Tạm dừng adset kém chất lượng và tối ưu lại đối tượng.',
    impact: '-22% chi phí rác',
    icon: ShieldAlert,
    color: C.amber,
  },
  {
    title: 'Khách so sánh đối thủ tăng mạnh',
    detail: 'Bổ sung script phản biện 5 tình huống đối thủ phổ biến.',
    impact: '+9% tỉ lệ giữ lead',
    icon: Shield,
    color: C.blue,
  },
];

function ResultsPreviewSection() {
  return (
    <section style={{ background: C.bg, color: C.text, padding: '72px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SectionTag color={C.green}>Kết quả mẫu</SectionTag>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', margin: '12px 0 24px' }}>
          Gợi Ý Hành Động Ưu Tiên Theo Mức Độ Rủi Ro
        </h2>

        <div style={{ display: 'grid', gap: 12 }}>
          {SAMPLE_RESULTS.map((r) => (
            <GlassCard key={r.title} style={{ padding: 18, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-md)', background: `${r.color}20`, border: `1px solid ${r.color}50`, display: 'grid', placeItems: 'center' }}>
                <r.icon size={18} color={r.color} />
              </div>
              <div>
                <h3 style={{ margin: '0 0 4px', fontSize: 18 }}>{r.title}</h3>
                <p style={{ margin: 0, color: C.muted }}>{r.detail}</p>
              </div>
              <div style={{ color: C.green, fontWeight: 700, fontSize: 13 }}>{r.impact}</div>
            </GlassCard>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          <a href="#lead-form" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.blue, color: '#fff', textDecoration: 'none', padding: '12px 18px', borderRadius: 'var(--radius-md)', fontWeight: 700 }}>
            Xem demo dashboard <ChevronRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}

function LeadFormMedicalSection() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [ok, setOk] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    try {
      const { supabase } = await import('../lib/supabaseLanding');
      await supabase.from('landing_leads').insert([
        {
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          experience_rating: 0,
          consent_privacy: true,
        },
      ]);
      setOk(true);
    } catch {
      setOk(true);
    }
  };

  return (
    <section id="lead-form" style={{ background: C.navy, color: C.text, padding: '72px 24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <SectionTag color={C.rust}>Đăng ký dùng thử</SectionTag>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem,3vw,2.4rem)', margin: '12px 0 8px' }}>Khám bệnh miễn phí cho shop của bạn</h2>
        <p style={{ color: C.muted, marginBottom: 20 }}>Nhận kết quả phân tích trong 24h — không cần thẻ tín dụng.</p>

        {ok ? (
          <div style={{ background: 'rgba(5,150,105,0.14)', border: '1px solid rgba(5,150,105,0.35)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
            <CheckCircle2 color="#059669" /> Đăng ký thành công. Đội ngũ sẽ liên hệ sớm.
          </div>
        ) : (
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
            <input placeholder="Họ tên *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="Email *" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input placeholder="Số điện thoại" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={inputStyle} />
            <button type="submit" style={{ background: C.rust, color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', padding: '12px 18px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
              Bắt đầu chẩn đoán <ArrowRight size={16} />
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 'var(--radius-md)',
  padding: '12px 14px',
  outline: 'none',
  boxSizing: 'border-box',
};

function FooterMedicalSection() {
  return (
    <footer style={{ background: C.bg, color: C.muted, borderTop: '1px solid rgba(255,255,255,0.08)', padding: '28px 24px', textAlign: 'center' }}>
      © 2026 AI Insight by Smax · Conversational Intelligence
    </footer>
  );
}

export default function MedicalCheckupLanding() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg }}>
      <HeroMedicalSection />
      <RealScreenshotsSection />
      <ProblemMedicalSection />
      <HowItWorksSection />
      <DiseaseGroupsSection />
      <ResultsPreviewSection />
      <LeadFormMedicalSection />
      <FooterMedicalSection />
    </div>
  );
}

import { useMemo, useState } from 'react';
import { getAdsHealthLabel, getAdsHealthColor } from '../../lib/adsMedicalService';

function MiniSparkLine({ data, color }) {
  if (!data || data.length < 2) return null;
  const w = 58;
  const h = 22;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const poly = pts.join(' ');
  const last = pts[pts.length - 1].split(',');
  const gradId = `ads-hsh-${color.replace('#', '')}-${Math.random().toString(36).slice(2, 6)}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${poly} ${w},${h}`} fill={`url(#${gradId})`} />
      <polyline points={poly} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="2" fill={color} />
    </svg>
  );
}

const ADS_DISEASE_META = {
  'roas-health': {
    desc: 'ROAS gốc · ROAS thực · Chênh lệch',
    assess: (s) => s < 5 ? '→ Chênh lệch ROAS cao, cần chuẩn hóa attribution' : s >= 7.5 ? '→ ROAS ổn định, dữ liệu đáng tin' : '→ ROAS trung bình, cần theo dõi',
  },
  'attribution-quality': {
    desc: 'Tỉ lệ match · Unmatched orders · Delay',
    assess: (s) => s < 5 ? '→ Match thấp, dễ đo sai hiệu quả ads' : s >= 7.5 ? '→ Attribution tốt, có thể scale' : '→ Attribution trung bình',
  },
  'ad-creative': {
    desc: 'CTR · Hook retention · Scroll stop',
    assess: (s) => s < 5 ? '→ Creative yếu, cần A/B test ngay' : s >= 7.5 ? '→ Creative khỏe, giữ đà tối ưu' : '→ Creative ổn, cần cải thiện thêm',
  },
  'audience-targeting': {
    desc: 'Overlap · Age match · Interest accuracy',
    assess: (s) => s < 5 ? '→ Targeting lệch, lãng phí ngân sách' : s >= 7.5 ? '→ Targeting chuẩn, chất lượng tốt' : '→ Targeting trung bình',
  },
  'budget-allocation': {
    desc: 'Utilization · Hour spread · Balance',
    assess: (s) => s < 5 ? '→ Phân bổ ngân sách chưa hiệu quả' : s >= 7.5 ? '→ Ngân sách vận hành ổn định' : '→ Cần tối ưu thêm theo giờ cao điểm',
  },
  'platform-performance': {
    desc: 'FB ROAS · Zalo ROAS · Revenue share',
    assess: (s) => s < 5 ? '→ Nền tảng đang lệch hiệu suất' : s >= 7.5 ? '→ Phân bổ nền tảng hợp lý' : '→ Cần rà soát tỉ trọng nền tảng',
  },
  'lead-order-conversion': {
    desc: 'Nóng→Đơn · Ấm→Đơn · Lạnh→Đơn',
    assess: (s) => s < 5 ? '→ Tỉ lệ chốt thấp, cần retarget nhanh' : s >= 7.5 ? '→ Chuyển đổi lead tốt' : '→ Chuyển đổi trung bình',
  },
  'junk-campaigns': {
    desc: 'Junk rate · Quality rate · Spam rate',
    assess: (s) => s < 5 ? '→ Chiến dịch rác cao, cần lọc audience' : s >= 7.5 ? '→ Chất lượng chiến dịch tốt' : '→ Cần giảm junk thêm',
  },
};

export function AdsHealthScoreHeader({
  healthScore = 5.8,
  diseases = [],
  dateRange = { start: '07/03', end: '28/03/2026' },
  campaignCount = 3,
  onDateRangeChange,
}) {
  const label = getAdsHealthLabel(healthScore);
  const color = getAdsHealthColor(healthScore);
  const progressPct = Math.round((healthScore / 10) * 100);
  const [selectedRange, setSelectedRange] = useState('30');

  const ranges = [
    { value: '7', label: '7 ngày' },
    { value: '30', label: '30 ngày' },
    { value: '90', label: '90 ngày' },
  ];

  const sortedDiseases = useMemo(() => {
    return [...diseases]
      .map(d => ({ ...d, score: d.score ?? 5 }))
      .sort((a, b) => a.score - b.score);
  }, [diseases]);

  const barColor = (s) => {
    if (s < 5) return '#dc2626';
    if (s < 7.5) return '#d97706';
    return '#059669';
  };

  const getBadgeStyle = () => {
    if (healthScore <= 3) return { bg: 'rgba(191,48,3,0.08)', color: '#BF3003', border: 'rgba(191,48,3,0.2)' };
    if (healthScore <= 5) return { bg: 'rgba(217,119,6,0.08)', color: '#d97706', border: 'rgba(217,119,6,0.2)' };
    if (healthScore <= 7) return { bg: 'rgba(0,82,255,0.08)', color: '#0052FF', border: 'rgba(0,82,255,0.2)' };
    return { bg: 'rgba(5,150,105,0.08)', color: '#059669', border: 'rgba(5,150,105,0.2)' };
  };

  const bs = getBadgeStyle();

  const handleRangeChange = (val) => {
    setSelectedRange(val);
    onDateRangeChange?.(val);
  };

  const handleScrollTo = (diseaseId) => {
    document.getElementById(`ads-disease-${diseaseId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"
                stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="6.5" cy="6.5" r="1.5" fill={color}/>
              <circle cx="17.5" cy="6.5" r="1.5" fill={color}/>
              <circle cx="17.5" cy="17.5" r="1.5" fill={color}/>
              <circle cx="6.5" cy="17.5" r="1.5" fill={color}/>
            </svg>
          </div>
          <span className="text-title-md font-semibold text-on-surface">Hồ Sơ Bệnh Án Ads</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-surface-container-low rounded-full p-1 gap-0.5">
            {ranges.map(r => (
              <button
                key={r.value}
                onClick={() => handleRangeChange(r.value)}
                className={`px-3 py-1 rounded-full text-label-xs font-semibold transition-all ${
                  selectedRange === r.value
                    ? 'text-on-primary bg-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <span className="text-label-xs text-on-surface-variant">
            {dateRange.start} – {dateRange.end}
          </span>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,82,255,0.08)', color: '#0052FF' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
            <span className="text-label-xs font-bold">{campaignCount} chiến dịch</span>
          </div>
        </div>
      </div>

      {/* Main card */}
      <div className="bg-surface-container-low rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* LEFT: Big Score */}
          <div className="flex flex-col justify-between p-8 lg:w-56 lg:border-r border-[var(--color-outline-variant)]">
            <div>
              <div className="text-[4.5rem] font-bold leading-none" style={{ color, fontFamily: 'var(--font-display)' }}>
                {healthScore.toFixed(1)}
              </div>
              <div className="text-title-lg text-on-surface-variant font-normal mt-1">/ 10 ĐIỂM</div>
            </div>

            <div className="mt-6">
              <div className="h-5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(90deg, ${color}CC, ${color})` }}
                />
              </div>
            </div>

            <div
              className="mt-4 text-center px-4 py-2 rounded-full text-label-md font-bold"
              style={{ backgroundColor: bs.bg, color: bs.color, border: `1px solid ${bs.border}` }}
            >
              {label}
            </div>
          </div>

          {/* RIGHT: Disease contribution list */}
          <div className="flex-1 p-6 lg:max-h-[480px] lg:overflow-y-auto">
            <div className="text-label-sm font-semibold text-on-surface-variant uppercase tracking-wide mb-4">
              Đóng Góp Theo Nhóm Bệnh
            </div>

            <div className="flex flex-col gap-5">
              {sortedDiseases.map((disease) => {
                const bc = barColor(disease.score);
                const pct = (disease.score / 10) * 100;
                const meta = ADS_DISEASE_META[disease.id] || { desc: '', assess: () => '' };
                const assessment = meta.assess(disease.score);
                const sparkData = [
                  disease.score - 1,
                  disease.score - 0.4,
                  disease.score + 0.2,
                  disease.score - 0.3,
                  disease.score,
                  disease.score + 0.4,
                  disease.score,
                ];

                return (
                  <div key={disease.id} className="group">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1 min-w-0">
                        <div className="text-body-md font-semibold text-on-surface">{disease.label}</div>
                        <div className="text-label-xs text-on-surface-variant">{meta.desc}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%`, background: bc }}
                          />
                        </div>
                      </div>

                      <div className="shrink-0">
                        <MiniSparkLine data={sparkData} color={bc} />
                      </div>

                      <div className="shrink-0 w-10 text-right">
                        <span className="text-title-md font-bold" style={{ color: bc }}>
                          {disease.score.toFixed(1)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleScrollTo(disease.id)}
                        title={`Xem chi tiết ${disease.label}`}
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all hover:scale-110"
                        style={{ border: `1.5px solid ${bc}50`, color: bc, background: `${bc}10` }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </button>
                    </div>

                    {assessment && (
                      <div className="text-label-xs font-medium mt-1.5" style={{ color: bc }}>
                        {assessment}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

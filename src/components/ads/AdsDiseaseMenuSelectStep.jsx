import { useState, useCallback } from 'react';
import { ADS_DISEASE_GROUPS } from '../../lib/adsMedicalService';
import { getSelectedDiseases, saveSelectedDiseases } from '../../lib/diseaseMenuService';
import { cn } from '../../lib/utils';

// ─── Severity config ─────────────────────────────────────────────────────────
const SEVERITY_CONFIG = {
  NẶNG: { color: '#dc2626', bg: 'rgba(220,38,38,0.10)', label: 'NẶNG', dot: '🔴' },
  'TRUNG BÌNH': { color: '#0052FF', bg: 'rgba(0,82,255,0.10)', label: 'TRUNG BÌNH', dot: '🔵' },
  NHẸ: { color: '#059669', bg: 'rgba(5,150,105,0.10)', label: 'NHẸ', dot: '🟢' },
};

function getSeverityLabel(score) {
  if (score <= 3) return 'NẶNG';
  if (score <= 6) return 'TRUNG BÌNH';
  return 'NHẸ';
}

// ─── 8 Ads disease descriptions ────────────────────────────────────────────────
const ADS_DISEASE_META = {
  'roas-health': {
    causes: [
      'ROAS tính trên gross revenue → không trừ hoàn/giảm → số đẹp nhưng thực tế thấp hơn',
      'Đơn hàng bị cancel/refund nhưng chi phí ads vẫn tính → ROAS ảo',
      'Revenue từ khách cũ không qua ads bị gán nhầm vào ads → ROAS cao giả',
    ],
    methodItems: [
      'So sánh ROAS gốc (theo Ads platform) vs ROAS thực (trừ hoàn/giảm)',
      'Kiểm tra tỉ lệ untracked revenue — đơn không match được với ads nào',
      'Tính lại ROAS dựa trên đơn confirmed thay vì đơn placed',
    ],
    metrics: ['ROAS gốc', 'ROAS thực', 'Untracked Revenue', 'Tỉ lệ Match'],
  },
  'attribution-quality': {
    causes: [
      'Nhiều đơn không được gán đúng campaign → không biết ads nào hiệu quả',
      'Tracking pixel không setup đúng → một số conversion bị miss',
      'UTM params không dùng đúng → traffic direct được gán nhầm vào ads',
    ],
    methodItems: [
      'Đếm tỉ lệ đơn được match đúng với campaign/ads',
      'Kiểm tra tỉ lệ untracked orders — đơn không có nguồn gốc ads rõ ràng',
      'So sánh conversion trên Ads platform vs conversion trong hệ thống',
    ],
    metrics: ['Tỉ lệ match', 'Untracked Orders', 'Conversion discrepancy'],
  },
  'ad-creative': {
    causes: [
      'Creative chạy quá lâu → fatigue, CTR giảm dần theo thời gian',
      'Không test A/B → không biết creative nào thật sự hiệu quả',
      'Copy không match với landing page → bounce rate cao dù CTR tốt',
    ],
    methodItems: [
      'Kiểm tra tuổi thọ của từng creative (CTR trend over time)',
      'So sánh CTR và conversion giữa các creative variant',
      'Đánh giá relevance score và landing page experience',
    ],
    metrics: ['CTR trend', 'Creative fatigue', 'Landing page match'],
  },
  'audience-targeting': {
    causes: [
      'Audience quá rộng → phí tổn cho người không có ý định mua',
      'Audience quá hẹp → reach quá thấp, chi phí mỗi conversion tăng',
      'Không lookalike / retargeting → phụ thuộc hoàn toàn vào cold audience',
    ],
    methodItems: [
      'So sánh CPA và conversion rate giữa different audience segments',
      'Kiểm tra tỉ lệ overlap giữa các campaign audience',
      'Đánh giá balance giữa cold audience vs retargeting audience',
    ],
    metrics: ['CPA per segment', 'Audience overlap', 'Retargeting ratio'],
  },
  'budget-allocation': {
    causes: [
      'Budget chia đều cho tất cả campaign → campaign tốt không được scale',
      'Budget không đủ cho thời điểm peak → mất khách vào giờ cao điểm',
      'Không cân đối giữa brand awareness và conversion campaigns',
    ],
    methodItems: [
      'So sánh ROAS và efficiency giữa các campaign để recommend reallocation',
      'Kiểm tra budget pacing — có chạy hết budget mỗi ngày không',
      'Đánh giá tỉ lệ budget cho top-performing vs underperforming campaigns',
    ],
    metrics: ['ROAS per budget', 'Budget pacing', 'Top performer ratio'],
  },
  'platform-performance': {
    causes: [
      'Phụ thuộc vào 1 platform duy nhất → rủi ro nếu platform thay đổi thuật toán',
      'Không tận dụng cross-platform data → miss insight về behavior pattern',
      'Platform có sự khác biệt về audience behavior → chi phí/CPA không so sánh trực tiếp được',
    ],
    methodItems: [
      'So sánh CPA, CTR, conversion rate giữa Facebook và Zalo',
      'Kiểm tra trend performance theo thời gian trên từng platform',
      'Đánh giá audience quality từ mỗi platform',
    ],
    metrics: ['CPA by platform', 'CTR by platform', 'Audience quality'],
  },
  'lead-order-conversion': {
    causes: [
      'Lead quality thấp → nhiều người hỏi nhưng ít người mua',
      'Không có lead nurturing → lead lạnh trước khi được chốt',
      'Handoff từ ads team sang sales team không smooth → miss follow-up',
    ],
    methodItems: [
      'So sánh tỉ lệ lead → order giữa các campaign và platform',
      'Kiểm tra thời gian trung bình từ lead created → order placed',
      'Đánh giá lead quality distribution (hot/warm/cold ratio)',
    ],
    metrics: ['Lead → Order rate', 'Lead quality by source', 'Lead age'],
  },
  'junk-campaigns': {
    causes: [
      'Campaign chạy không hiệu quả nhưng không được tắt → phí budget',
      'Không có clear objective → campaign không optimized cho đúng KPI',
      'Audience targeting quá rộng → click không phải KH tiềm năng',
    ],
    methodItems: [
      'Review ROAS và CPA của từng campaign — flag những campaign dưới ngưỡng',
      'Kiểm tra tỉ lệ junk lead (spam, không mua) theo campaign',
      'Đánh giá campaign status — có đang active không cần thiết không',
    ],
    metrics: ['ROAS by campaign', 'Junk lead rate', 'Campaign efficiency'],
  },
};

// ─── Single disease block ────────────────────────────────────────────────────
function AdsDiseaseBlock({ disease, isSelected, onToggle, severityScore }) {
  const meta = ADS_DISEASE_META[disease.id];
  const sevLabel = getSeverityLabel(severityScore ?? 5);
  const sev = SEVERITY_CONFIG[sevLabel] || SEVERITY_CONFIG.NHẸ;

  return (
    <div
      onClick={onToggle}
      className={cn(
        'rounded-lg p-4 cursor-pointer transition-all duration-150 border',
        isSelected
          ? 'border-tertiary shadow-[--shadow-md]'
          : 'border-transparent hover:border-[var(--color-outline-variant)] hover:bg-surface-container-low'
      )}
      style={isSelected ? { background: 'var(--color-surface-container-lowest)' } : {}}
    >
      {/* Header row */}
      <div className="flex items-start gap-2.5 mb-3">
        <div className={cn(
          'mt-0.5 w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-all',
          isSelected
            ? 'bg-tertiary border-tertiary'
            : 'border-[var(--color-outline)] bg-transparent'
        )}>
          {isSelected && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg leading-none">{disease.icon}</span>
            <span className="text-[15px] font-bold text-on-surface leading-snug">{disease.label}</span>
            <span
              className="inline-flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ color: sev.color, background: sev.bg }}
            >
              {sev.dot} {sev.label}
            </span>
          </div>
        </div>
      </div>

      <div className="h-px mb-3" style={{ background: 'var(--color-outline-variant)' }} />

      {meta?.causes && (
        <div className="mb-3">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">📌 Nguyên nhân</div>
          <ul className="space-y-0.5">
            {meta.causes.map((c, i) => (
              <li key={i} className="text-[13px] text-on-surface-variant leading-snug">• {c}</li>
            ))}
          </ul>
        </div>
      )}

      {meta?.methodItems && (
        <div className="mb-3">
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">🔬 Phương pháp khám</div>
          <ul className="space-y-0.5">
            {meta.methodItems.map((m, i) => (
              <li key={i} className="text-[13px] text-on-surface-variant leading-snug">□ {m}</li>
            ))}
          </ul>
        </div>
      )}

      {meta?.metrics && (
        <div className="pt-2 border-t" style={{ borderColor: 'var(--color-outline-variant)' }}>
          <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide mb-1.5">📊 Chỉ số</div>
          <div className="flex flex-wrap gap-1.5">
            {meta.metrics.map((m, i) => (
              <span
                key={i}
                className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: 'var(--color-surface-container-low)', color: 'var(--color-on-surface-variant)' }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

/**
 * AdsDiseaseMenuSelectStep
 *
 * Props:
 *   onContinue(selectedIds[])  — gọi khi user bấm Tiếp tục
 *   onBack()                   — gọi khi user bấm Quay lại
 *   diseases[]                 — mảng disease objects (từ computeAdsDiagnosis) để lấy score
 */
export function AdsDiseaseMenuSelectStep({ onContinue, onBack, diseases = [] }) {
  const [selected, setSelected] = useState(() => {
    const saved = getSelectedDiseases('ads');
    if (saved && saved.length > 0) return new Set(saved);
    return new Set(ADS_DISEASE_GROUPS.map(d => d.id));
  });

  // Sort: worst score first (Nặng → TB → Nhẹ)
  const sortedGroups = [...ADS_DISEASE_GROUPS].sort((a, b) => {
    const scoreA = diseases.find(d => d.id === a.id)?.score ?? 5;
    const scoreB = diseases.find(d => d.id === b.id)?.score ?? 5;
    return scoreA - scoreB;
  });

  const toggle = useCallback((id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(ADS_DISEASE_GROUPS.map(d => d.id)));
  }, []);

  const deselectAll = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleContinue = useCallback(() => {
    const ids = Array.from(selected);
    saveSelectedDiseases('ads', ids);
    onContinue(ids);
  }, [selected, onContinue]);

  const selectedCount = selected.size;
  const canContinue = selectedCount > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-base">📋</span>
          <h2 className="text-title-md font-bold text-on-surface">Chọn Hạng Mục Khám Bệnh</h2>
          <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: 'rgba(24,119,242,0.12)', color: '#1877F2' }}>
            Quảng cáo
          </span>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Bạn đang gặp vấn đề gì? Tích chọn để khám ngay.
        </p>
        <p className="text-[11px] text-on-surface-variant mt-1">
          Mỗi hạng mục = 1 vấn đề cụ thể. Chọn từ 1 → 8 hạng mục.
        </p>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {sortedGroups.map(group => (
            <AdsDiseaseBlock
              key={group.id}
              disease={group}
              isSelected={selected.has(group.id)}
              onToggle={() => toggle(group.id)}
              severityScore={diseases.find(d => d.id === group.id)?.score}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-6 py-4 flex flex-col sm:flex-row items-center gap-3 border-t"
        style={{ borderColor: 'var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}
      >
        <div className="flex items-center gap-2 mr-auto">
          <button onClick={selectAll} className="text-[11px] font-semibold text-tertiary hover:underline cursor-pointer">
            ☑ Chọn tất cả
          </button>
          <span className="text-[var(--color-outline)]">|</span>
          <button onClick={deselectAll} className="text-[11px] font-semibold text-on-surface-variant hover:underline cursor-pointer">
            ☐ Bỏ chọn tất cả
          </button>
        </div>

        <span className="text-[11px] font-semibold text-on-surface-variant">
          {selectedCount}/8 đã chọn
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-full text-[12px] font-semibold text-on-surface-variant hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            ← Quay lại
          </button>
          <button
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              'px-5 py-2 rounded-full text-[12px] font-bold transition-all cursor-pointer',
              canContinue
                ? 'bg-tertiary text-white shadow-[--shadow-sm] hover:shadow-[--shadow-md] hover:brightness-110'
                : 'bg-surface-container-low text-on-surface-variant opacity-50 cursor-not-allowed'
            )}
          >
            Tiếp tục →
          </button>
        </div>
      </div>
    </div>
  );
}

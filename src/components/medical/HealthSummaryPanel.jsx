import { useEffect, useRef, useState } from 'react';
import {
  X, Download, ChevronDown, TrendingUp, TrendingDown, Minus,
  ShoppingCart, UserCheck, Headphones, BarChart2, Package, Users,
  MessageSquare, AlertTriangle, CheckCircle2, ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import {
  generateOverallSummary,
  generateInterpretation,
  getHealthScore,
  getHealthLabel,
  getHealthColor,
} from '../../lib/medicalService';

/** ── Disease icon map (consistent with Stitch reference) ── */
const DISEASE_ICONS = {
  'upsell': <ShoppingCart size={14} />,
  'staff': <UserCheck size={14} />,
  'post-purchase': <Headphones size={14} />,
  'response-speed': <BarChart2 size={14} />,
  'lead-quality': <Users size={14} />,
  'objection': <AlertTriangle size={14} />,
  'abandoned-chat': <MessageSquare size={14} />,
  'competitor': <Package size={14} />,
  'tone-language': <MessageSquare size={14} />,
  default: <BarChart2 size={14} />,
};

function getDiseaseIcon(id) {
  return DISEASE_ICONS[id] || DISEASE_ICONS.default;
}

/** ── Severity colors ── */
const SEVERITY = {
  NẶNG:  { border: '#EF4444', bg: 'rgba(239,68,68,0.08)',  text: '#EF4444', badgeBg: 'rgba(239,68,68,0.12)', label: 'NẶNG' },
  TRUNG_BÌNH: { border: '#F59E0B', bg: 'rgba(245,158,11,0.08)', text: '#F59E0B', badgeBg: '#FEF3C7', label: 'TB' },
  NHẸ:   { border: '#10B981', bg: 'rgba(16,185,129,0.08)',  text: '#10B981', badgeBg: 'rgba(16,185,129,0.12)', label: 'NHẸ' },
};
function getSeverity(s) {
  if (s === 'NẶNG') return SEVERITY.NẶNG;
  if (s === 'TRUNG BÌNH') return SEVERITY.TRUNG_BÌNH;
  return SEVERITY.NHẸ;
}

/** ── Priority colors ── */
const PRIORITY = {
  HIGH:   { color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  MEDIUM: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  LOW:    { color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
};

/**
 * HealthSummaryPanel
 *
 * Slide-in panel — "Bảng Tóm Tắt Sức Khỏe Hội Thoại"
 * Redesigned per Stitch reference:
 *  - 2-column Overall Summary (circle left, lowest-right right)
 *  - Pill KPI chips (not grid)
 *  - Section headers uppercase tracking-wider
 *  - Accordion disease rows with expanded insight text
 *  - Top 3 HIGH priority actions
 */
export function HealthSummaryPanel({ diseases, conversations, onClose }) {
  const panelRef = useRef(null);
  const [expandedId, setExpandedId] = useState(null);

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // Compute data
  const overall = generateOverallSummary(diseases);
  const healthScore = getHealthScore(diseases);
  const healthLabel = getHealthLabel(healthScore);
  const healthColor = getHealthColor(healthScore);
  const progressDeg = Math.round((healthScore / 10) * 360);

  // KPI chips
  const total = conversations?.length || 0;
  const junkCount = total > 0 ? conversations.filter(r => r.is_junk === true || r.is_junk === 'true').length : 0;
  const phoneOk = total > 0 ? conversations.filter(r =>
    r.phone_status === 'Đã cho SĐT' || r.phone_status === 'Có SĐT' || r.phone_status === true
  ).length : 0;
  const hotCount = total > 0 ? conversations.filter(r =>
    r.temperature === 'Nóng' || r.temperature === 'nóng'
  ).length : 0;
  const junkPct  = total > 0 ? Math.round((junkCount / total) * 100) : 0;
  const phonePct = total > 0 ? Math.round((phoneOk / total) * 100) : 0;
  const chotPct  = total > 0 ? Math.round((hotCount / total) * 100) : 0;

  // Top HIGH actions
  const topActions = diseases
    .flatMap(d => (d.recommendations || []).map(r => ({ ...r, diseaseLabel: d.label })))
    .filter(r => r.priority === 'HIGH')
    .slice(0, 3);

  // Severity counts
  const nang = overall.severityCounts?.nang || 0;
  const trungBinh = overall.severityCounts?.trungBinh || 0;
  const nhe = overall.severityCounts?.nhe || 0;
  const totalSev = nang + trungBinh + nhe;

  // Scroll to disease in dashboard then close
  const handleScrollToDisease = (diseaseId) => {
    const el = document.getElementById(`disease-${diseaseId}`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    onClose();
  };

  const handleExportPDF = () => { window.print(); };

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  // ── SVG circle progress ──
  const CIRCLE_R = 50;
  const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;
  const scoreDash = Math.round((progressDeg / 360) * CIRCLE_CIRCUMFERENCE);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[4px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full z-50 flex flex-col bg-[#fcf8fb] shadow-[-4px_0_24px_rgba(26,33,56,0.08)]"
        style={{ width: 'min(500px, 100vw)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Bảng Tóm Tắt Sức Khỏe Hội Thoại"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 shrink-0 bg-white border-b border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#1A2138] transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={15} />
            <span>Đóng</span>
          </button>

          <h2 className="text-[13px] font-semibold text-[#1A2138] tracking-tight">
            Bảng Tóm Tắt Sức Khỏe Hội Thoại
          </h2>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0052FF] text-white text-[12px] font-medium rounded-[6px] hover:bg-[#0044cc] transition-colors cursor-pointer"
          >
            <Download size={12} />
            Xuất PDF
          </button>
        </div>

        {/* ── Scrollable Content ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── Section: Overall Summary ── */}
          <div className="px-5 pt-5 pb-4">
            {/* 2-column summary card */}
            <div className="bg-white rounded-xl p-5 shadow-[0_1px_4px_rgba(26,33,56,0.06)] border border-[#F3F4F6]">

              {/* Grid: 2 columns */}
              <div className="grid grid-cols-2 gap-4">

                {/* Left: Score Circle */}
                <div className="flex flex-col items-center">
                  {/* SVG circle progress */}
                  <div className="relative mb-2">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      {/* Track */}
                      <circle
                        cx="60" cy="60" r={CIRCLE_R}
                        fill="none"
                        stroke="#E5E7EB"
                        strokeWidth="5"
                      />
                      {/* Fill */}
                      <circle
                        cx="60" cy="60" r={CIRCLE_R}
                        fill="none"
                        stroke={healthColor}
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${scoreDash} ${CIRCLE_CIRCUMFERENCE}`}
                        transform="rotate(-90 60 60)"
                      />
                      {/* Center score */}
                      <text
                        x="60" y="68"
                        textAnchor="middle"
                        fontSize="32"
                        fontWeight="800"
                        fill={healthColor}
                        fontFamily="Manrope, sans-serif"
                      >
                        {healthScore}
                      </text>
                    </svg>
                  </div>

                  {/* Label below circle */}
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#0052FF] mb-0.5">
                    ĐIỂM SỨC KHỎE
                  </div>
                  <div
                    className="text-[12px] font-medium mb-1.5"
                    style={{ color: healthColor }}
                  >
                    {healthLabel}
                  </div>
                  {/* Pills row */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-center">
                    {nang > 0 && (
                      <span className="text-[10px] text-[#EF4444] bg-[rgba(239,68,68,0.08)] px-2 py-0.5 rounded-full">
                        {nang} nghiêm trọng
                      </span>
                    )}
                    {trungBinh > 0 && (
                      <span className="text-[10px] text-[#F59E0B] bg-[rgba(245,158,11,0.08)] px-2 py-0.5 rounded-full">
                        {trungBinh} trung bình
                      </span>
                    )}
                    {nhe > 0 && (
                      <span className="text-[10px] text-[#10B981] bg-[rgba(16,185,129,0.08)] px-2 py-0.5 rounded-full">
                        {nhe} nhẹ
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Lowest group */}
                <div className="flex flex-col justify-center">
                  <div className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-2">
                    THẤP NHẤT
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-0.5">
                    <span className="text-[28px] font-bold text-[#EF4444]" style={{ fontFamily: 'Manrope, sans-serif' }}>
                      {overall.worstScore}/10
                    </span>
                    {/* Down arrow indicator */}
                    <TrendingDown size={16} className="text-[#EF4444]" />
                  </div>
                  <div className="text-[13px] text-[#6B7280] mb-3">
                    {overall.worstLabel}
                  </div>

                  {/* Info box */}
                  <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2.5 text-[11px] text-[#6B7280] leading-snug">
                    Nhóm cần chú ý nhất: <span className="font-semibold text-[#1A2138]">{overall.worstLabel}</span> ({overall.worstScore}/10).
                    Điểm sức khỏe trung bình: <span className="font-semibold text-[#1A2138]">{healthScore}/10</span>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── KPI Pills Row ── */}
          <div className="px-5 pb-4">
            <div className="flex gap-3">
              {/* Junk leads */}
              <div className="flex-1 flex items-center gap-2 bg-[#FEE2E2] rounded-full px-4 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-[#1A2138] leading-tight">
                    Leads rác <strong>{junkPct}%</strong>
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] leading-tight">Không có intent mua</span>
                </div>
              </div>

              {/* Phone collection */}
              <div className="flex-1 flex items-center gap-2 bg-[#FEF3C7] rounded-full px-4 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
                </svg>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-[#1A2138] leading-tight">
                    Thu thập SĐT <strong>{phonePct}%</strong>
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] leading-tight">Để lại thông tin</span>
                </div>
              </div>

              {/* Closed deals */}
              <div className="flex-1 flex items-center gap-2 bg-[#DCFCE7] rounded-full px-4 py-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div className="flex flex-col min-w-0">
                  <span className="text-[12px] font-semibold text-[#1A2138] leading-tight">
                    Chốt đơn <strong>{chotPct}%</strong>
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] leading-tight">Hội thoại nóng</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Severity Breakdown ── */}
          <div className="px-5 pb-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
              Phân Loại Nhóm Bệnh ({diseases.length} nhóm)
            </div>
            {totalSev > 0 && (
              <div className="flex h-1.5 rounded-full overflow-hidden mb-2 gap-px" style={{ background: '#E5E7EB' }}>
                {nang > 0 && <div style={{ flex: nang, background: '#EF4444' }} />}
                {trungBinh > 0 && <div style={{ flex: trungBinh, background: '#F59E0B' }} />}
                {nhe > 0 && <div style={{ flex: nhe, background: '#10B981' }} />}
              </div>
            )}
            <div className="flex gap-3 text-[11px] text-[#9CA3AF]">
              {nang > 0 && <span style={{ color: '#EF4444' }}>Nghiêm trọng: {nang}</span>}
              {trungBinh > 0 && <span style={{ color: '#F59E0B' }}>Trung bình: {trungBinh}</span>}
              {nhe > 0 && <span style={{ color: '#10B981' }}>Nhẹ: {nhe}</span>}
            </div>
          </div>

          {/* ── Disease Details ── */}
          <div className="px-5 pb-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
              Chi Tiết Từng Nhóm Bệnh
            </div>

            <div className="space-y-2">
              {diseases.map((disease) => {
                const sev = getSeverity(disease.severity);
                const interp = generateInterpretation(disease);
                const isExpanded = expandedId === disease.id;

                const deltaVal = disease.delta?.value || '0';
                const deltaDir = disease.delta?.direction;
                const deltaColor = deltaDir === 'up' ? '#10B981' : deltaDir === 'down' ? '#EF4444' : '#9CA3AF';
                const DeltaIcon = deltaDir === 'up' ? TrendingUp : deltaDir === 'down' ? TrendingDown : Minus;

                const diseaseIcon = getDiseaseIcon(disease.id);

                return (
                  <div key={disease.id}>
                    {/* Accordion Header Row */}
                    <div
                      className="bg-white rounded-lg px-4 py-3 cursor-pointer transition-all hover:bg-[#FAFAFA] active:scale-[0.995]"
                      style={{
                        border: `1px solid ${sev.border}30`,
                        borderLeft: `3px solid ${sev.border}`,
                      }}
                      onClick={() => toggleExpand(disease.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && toggleExpand(disease.id)}
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left: icon + label */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                            style={{ background: `${sev.border}18` }}
                          >
                            <span style={{ color: sev.border }}>{diseaseIcon}</span>
                          </div>
                          <span className="text-[13px] font-medium text-[#1A2138] truncate">
                            {disease.label}
                          </span>
                        </div>

                        {/* Right: delta + score + badge + chevron */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Delta */}
                          {disease.delta && (
                            <div className="flex items-center gap-0.5" style={{ color: deltaColor }}>
                              <DeltaIcon size={12} />
                              <span className="text-[11px] font-medium">{deltaVal}</span>
                            </div>
                          )}
                          {/* Score */}
                          <span
                            className="text-[14px] font-bold"
                            style={{ color: sev.border, fontFamily: 'Manrope, sans-serif' }}
                          >
                            {disease.score}/10
                          </span>
                          {/* Severity badge */}
                          <span
                            className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: sev.badgeBg, color: sev.text }}
                          >
                            {sev.label}
                          </span>
                          {/* Chevron */}
                          <ChevronDown
                            size={14}
                            className="text-[#D1D5DB] transition-transform duration-200"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </div>
                      </div>

                      {/* Expanded: insight + metrics */}
                      {isExpanded && (
                        <div
                          className="mt-3 pt-3 border-t border-[#F3F4F6]"
                        >
                          {/* Insight text */}
                          <div className="flex items-start gap-2 mb-3">
                            <span style={{ color: sev.border, marginTop: 1 }}>
                              {disease.severity === 'NẶNG'
                                ? <AlertTriangle size={13} />
                                : disease.severity === 'NHẸ'
                                ? <CheckCircle2 size={13} />
                                : <AlertTriangle size={13} />
                              }
                            </span>
                            <p className="text-[12px] text-[#6B7280] leading-snug flex-1">
                              {interp.keyConcern}
                            </p>
                          </div>

                          {/* Metrics chips */}
                          <div className="flex flex-wrap gap-1.5">
                            {(interp.summary || '').split(' · ').filter(Boolean).map((chip, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-[#6B7280]"
                              >
                                {chip.trim()}
                              </span>
                            ))}
                          </div>

                          {/* Scroll to dashboard CTA */}
                          <button
                            className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#0052FF] hover:text-[#0044cc] transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScrollToDisease(disease.id);
                            }}
                          >
                            Chi tiết
                            <ArrowRight size={11} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Top Actions ── */}
          {topActions.length > 0 && (
            <div className="px-5 pb-6">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-3">
                Hành Động Ưu Tiên
              </div>
              <div className="space-y-2">
                {topActions.map((action, idx) => {
                  const prio = PRIORITY[action.priority] || PRIORITY.LOW;
                  return (
                    <div
                      key={action.id}
                      className="bg-white rounded-lg px-3 py-2.5"
                      style={{
                        border: `1px solid ${prio.color}20`,
                        borderLeft: `3px solid ${prio.color}`,
                      }}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Number badge */}
                        <span
                          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                          style={{ background: prio.color, fontFamily: 'Manrope, sans-serif' }}
                        >
                          {idx + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="text-[13px] font-semibold text-[#1A2138]">
                              {action.title}
                            </span>
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0"
                              style={{ background: prio.bg, color: prio.color }}
                            >
                              Ưu tiên {action.priority === 'HIGH' ? 'CAO' : action.priority === 'MEDIUM' ? 'TRUNG' : 'THẤP'}
                            </span>
                          </div>
                          <div className="text-[12px] text-[#9CA3AF]">
                            {action.diseaseLabel} · {action.impact}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Print Styles ── */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          [role="dialog"] { visibility: visible; position: fixed; top: 0; left: 0; width: 100vw; }
          [role="dialog"] * { visibility: visible; }
        }
      `}</style>
    </>
  );
}

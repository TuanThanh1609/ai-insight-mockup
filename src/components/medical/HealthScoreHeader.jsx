import { useMemo, useCallback } from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  getHealthScore,
  getHealthLabel,
  getHealthColor,
  getMedicalHistory,
} from '../../lib/medicalService';

/**
 * Disease code labels (2-char abbreviations)
 */
const CODE_LABELS = {
  'lead-quality':          'LQ',
  'response-speed':        'RS',
  'staff-performance':      'NV',
  'competitor':            'ĐT',
  'post-purchase':         'KH',
  'objection-handling':    'KB',
  'abandoned-chat':        'BD',
  'tone-language':         'NN',
  'upsell':                'US',
  'legal-risk':            'PL',
};

/**
 * Disease full-name labels (for tooltip)
 */
const LABEL_MAP = {
  'lead-quality':          'Chất Lượng Nguồn Lead',
  'response-speed':        'Phản Hồi & Chăm Sóc',
  'staff-performance':      'Nhân Viên Tư Vấn',
  'competitor':            'Đối Thủ Cạnh Tranh',
  'post-purchase':         'CSKH & Hậu Mua',
  'objection-handling':     'Kịch Bản Tư Vấn',
  'abandoned-chat':         'Cuộc Trò Chuyện Bỏ Dở',
  'tone-language':          'Ngôn Ngữ & Cách Giao Tiếp',
  'upsell':                 'Upsell / Cross-sell',
  'legal-risk':             'Rủi Ro Pháp Lý',
};

/**
 * HealthScoreHeader — Diagnostic at a Glance
 * 4 zones: Score block | Progress bar | Breakdown bars | Critical chip
 */
export function HealthScoreHeader({ diseases, recordDate }) {
  const score = getHealthScore(diseases);
  const label = getHealthLabel(score);
  const color = getHealthColor(score);

  // ── Medical history (delta only shown when ≥ 2 records exist) ──
  const history = getMedicalHistory();
  const hasHistory = history.length >= 2;
  const prevScore = hasHistory ? history[history.length - 2]?.score : null;
  const delta = hasHistory && prevScore != null ? score - prevScore : null;

  // ── Date/time ──
  const dt = recordDate ? new Date(recordDate) : new Date();
  const formattedDate = dt.toLocaleDateString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
  const formattedTime = dt.toLocaleTimeString('vi-VN', {
    hour: '2-digit', minute: '2-digit',
  });

  // ── Progress ──
  const progressPct = Math.round((score / 10) * 100);

  // ── Breakdown bars data ──
  const barData = useMemo(() => {
    const all = diseases.map(d => ({
      id: d.id,
      code: CODE_LABELS[d.id] || d.code || d.id.slice(0, 2).toUpperCase(),
      fullName: LABEL_MAP[d.id] || d.label || d.id,
      score: d.score ?? 5,
      isWeak: (d.score ?? 10) < 5,
      isStrong: (d.score ?? 0) >= 7.5,
      hasData: !d.industryAgnostic || (d.metrics && d.metrics.some(m => (m.value ?? 0) > 0)),
      topRecommendation: d.recommendations?.[0]?.title ?? null,
    })).filter(d => d.hasData);

    return all.sort((a, b) => a.score - b.score); // weakest first
  }, [diseases]);

  const topWeak = barData.filter(d => d.isWeak).slice(0, 3);
  const critical = topWeak[0] ?? null;

  // ── Scroll to disease card ──
  const handleBarClick = useCallback((diseaseId) => {
    document.getElementById(`disease-${diseaseId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  // ── Score < 3 → emergency ──
  const isEmergency = score < 3;

  return (
    <div className="bg-surface-container-low rounded-[--radius-xl] p-6 mb-6">
      {/* ── Emergency banner ── */}
      {isEmergency && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-[--radius-md] bg-error/10 border border-error/20">
          <AlertTriangle size={16} className="text-error shrink-0" />
          <span className="text-body-sm font-semibold text-error">
            Cảnh báo khẩn: Điểm sức khỏe rất thấp — Cần hành động ngay
          </span>
        </div>
      )}

      {/* ── Top row: score + delta + critical chip + meta ── */}
      <div className="flex items-start justify-between gap-4 mb-4">
        {/* Score block */}
        <div className="flex items-end gap-4">
          <div>
            <div className="text-label-sm text-on-surface-variant mb-1">
              ĐIỂM SỨC KHỎE TỔNG QUAN
            </div>
            <div className="flex items-end gap-2">
              <span
                className="text-display-lg font-bold leading-none"
                style={{ color }}
              >
                {score.toFixed(1)}
              </span>
              <span className="text-headline-sm text-on-surface-variant font-normal pb-1">
                / 10
              </span>
            </div>
            <div
              className="inline-block mt-2 px-2.5 py-1 rounded-full text-label-sm font-bold"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {label}
            </div>
          </div>

          {/* Delta — only when history exists */}
          {delta !== null && delta !== 0 && (
            <div className={cn(
              'flex items-center gap-1 pb-1',
              delta > 0 ? 'text-success' : 'text-error'
            )}>
              {delta > 0
                ? <TrendingUp size={14} />
                : <TrendingDown size={14} />
              }
              <span className="text-body-sm font-semibold">
                {Math.abs(delta).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Critical chip — weakest disease */}
        {critical && !isEmergency && (
          <button
            onClick={() => handleBarClick(critical.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-semibold shrink-0
                       bg-warning/10 text-warning border border-warning/20 cursor-pointer hover:bg-warning/20 transition-colors"
          >
            <AlertTriangle size={12} />
            <span>
              {critical.fullName} ({critical.score.toFixed(1)})
            </span>
          </button>
        )}

        {/* Meta — date/time */}
        <div className="text-right shrink-0">
          <div className="text-body-sm text-on-surface">{formattedDate}</div>
          <div className="text-body-sm text-on-surface-variant">{formattedTime}</div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mb-5">
        <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, backgroundColor: color }}
          />
        </div>
        <div className="flex items-center justify-between text-body-sm text-on-surface-variant mt-1.5">
          <span>Nghiêm trọng</span>
          <span>Tốt</span>
        </div>
      </div>

      {/* ── Breakdown bars — only when ≥ 1 disease has data ── */}
      {barData.length > 0 && (
        <div>
          <div className="text-label-sm text-on-surface-variant mb-3">
            ĐÓNG GÓP THEO NHÓM BỆNH
          </div>

          {/* Bar labels row */}
          <div className="flex gap-3 mb-1 flex-wrap">
            {barData.map(d => (
              <div key={d.id} className="flex flex-col items-center min-w-[28px]">
                <span className="text-label-sm text-on-surface-variant mb-0.5">
                  {d.code}
                </span>
              </div>
            ))}
          </div>

          {/* Bars */}
          <div className="flex gap-3 items-end flex-wrap">
            {barData.map(d => {
              const barWidthPct = (d.score / 10) * 100;
              const isHighlighted = d.isWeak || d.isStrong;
              const barHeight = isHighlighted ? 12 : 8;

              return (
                <div
                  key={d.id}
                  className="flex flex-col items-center gap-1 flex-1 min-w-[28px] max-w-[80px]"
                >
                  {/* Score value above bar */}
                  <span className={cn(
                    'text-label-sm font-semibold leading-none',
                    d.isWeak ? 'text-error' : d.isStrong ? 'text-success' : 'text-on-surface-variant'
                  )}>
                    {d.score.toFixed(1)}
                  </span>

                  {/* Bar track — clickable */}
                  <button
                    onClick={() => handleBarClick(d.id)}
                    title={`${d.fullName}: ${d.score.toFixed(1)}/10 — Click để xem chi tiết`}
                    className="w-full rounded-sm transition-all cursor-pointer"
                    style={{
                      backgroundColor: d.isWeak
                        ? 'var(--color-error)'
                        : d.isStrong
                          ? 'var(--color-success)'
                          : 'var(--color-tertiary)',
                      opacity: isHighlighted ? 1 : 0.45,
                      height: `${barHeight}px`,
                      width: `${barWidthPct}%`,
                      maxWidth: '100%',
                      minWidth: '4px',
                    }}
                  />

                  {/* Weak indicator */}
                  {d.isWeak && (
                    <AlertTriangle size={8} className="text-error" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-3 text-label-sm text-on-surface-variant flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-error" />
              <span>Cần cải thiện (&lt; 5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-success" />
              <span>Tốt (≥ 7.5)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-2 rounded-sm bg-tertiary opacity-45" />
              <span>Trung bình</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

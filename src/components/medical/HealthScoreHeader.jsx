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
 * HealthScoreHeader — Option E: 3-Column Diagnostic Layout
 * Col 1: Score tổng + progress bar
 * Col 2: Cần cải thiện (score < 5) + Trung bình (chip thu gọn)
 * Col 3: Tốt (score ≥ 7.5)
 */
export function HealthScoreHeader({ diseases, recordDate }) {
  const score = getHealthScore(diseases);
  const label = getHealthLabel(score);
  const color = getHealthColor(score);

  // ── Medical history ──
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

  const progressPct = Math.round((score / 10) * 100);

  // ── Disease group classification ──
  const { weak, medium, strong } = useMemo(() => {
    const all = diseases.map(d => ({
      id: d.id,
      label: d.label || d.id,
      score: d.score ?? 5,
      topRecommendation: d.recommendations?.[0]?.title ?? null,
    }));

    return {
      weak:   all.filter(d => d.score < 5).sort((a, b) => a.score - b.score),
      medium: all.filter(d => d.score >= 5 && d.score < 7.5).sort((a, b) => a.score - b.score),
      strong: all.filter(d => d.score >= 7.5).sort((a, b) => b.score - a.score),
    };
  }, [diseases]);

  // ── Scroll to disease ──
  const handleScrollTo = useCallback((diseaseId) => {
    document.getElementById(`disease-${diseaseId}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const isEmergency = score < 3;

  // ── Mini progress bar for disease items ──
  const MiniBar = ({ value, color: barColor }) => (
    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${(value / 10) * 100}%`, backgroundColor: barColor }}
      />
    </div>
  );

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

      {/* ── Top meta row ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-label-sm text-on-surface-variant">
          ĐIỂM SỨC KHỎE TỔNG QUAN
        </div>
        <div className="text-right">
          <div className="text-body-sm text-on-surface">{formattedDate}</div>
          <div className="text-body-sm text-on-surface-variant">{formattedTime}</div>
        </div>
      </div>

      {/* ── 3-COLUMN LAYOUT ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-start">

        {/* ════ COLUMN 1: Score tổng ════ */}
        <div className="flex flex-col gap-3">
          {/* Score number */}
          <div className="flex items-end gap-2">
            <span className="text-display-lg font-bold leading-none" style={{ color }}>
              {score.toFixed(1)}
            </span>
            <span className="text-headline-sm text-on-surface-variant font-normal pb-1">/ 10</span>
          </div>

          {/* Status badge */}
          <div
            className="inline-block px-2.5 py-1 rounded-full text-label-sm font-bold self-start"
            style={{ backgroundColor: `${color}18`, color }}
          >
            {label}
          </div>

          {/* Delta */}
          {delta !== null && delta !== 0 && (
            <div className={cn('flex items-center gap-1', delta > 0 ? 'text-success' : 'text-error')}>
              {delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="text-body-sm font-semibold">{Math.abs(delta).toFixed(1)}</span>
              <span className="text-body-sm text-on-surface-variant">so với lần khám trước</span>
            </div>
          )}

          {/* Progress bar */}
          <div>
            <div className="h-3 bg-surface-container-high rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%`, backgroundColor: color }}
              />
            </div>
            <div className="flex justify-between text-body-sm text-on-surface-variant">
              <span>Nghiêm trọng</span>
              <span>Tốt</span>
            </div>
          </div>
        </div>

        {/* ════ COLUMN 2: Cần cải thiện + Trung bình ════ */}
        <div className="flex flex-col gap-4">

          {/* Cần cải thiện */}
          {weak.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle size={12} className="text-error shrink-0" />
                <span className="text-label-sm font-bold text-error">
                  CẦN CẢI THIỆN ({weak.length} nhóm)
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {weak.map(d => (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-sm text-on-surface font-medium truncate max-w-[160px]" title={d.label}>
                        {d.label}
                      </span>
                      <button
                        onClick={() => handleScrollTo(d.id)}
                        className="text-label-sm text-tertiary hover:text-tertiary/80 shrink-0 ml-2 cursor-pointer transition-colors"
                      >
                        Xem →
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <MiniBar value={d.score} color="var(--color-error)" />
                      </div>
                      <span className="text-label-sm font-semibold text-error shrink-0 w-7 text-right">
                        {d.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Trung bình — chip thu gọn */}
          {medium.length > 0 && (
            <div>
              <div className="text-label-sm font-semibold text-on-surface-variant mb-2 uppercase tracking-wide">
                Trung bình ({medium.length} nhóm)
              </div>
              <div className="flex flex-wrap gap-1.5">
                {medium.map(d => (
                  <button
                    key={d.id}
                    onClick={() => handleScrollTo(d.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[--radius-md] bg-surface-container-high text-body-sm
                               hover:bg-surface-container-low cursor-pointer transition-colors border border-transparent hover:border-outline"
                    title={`${d.label}: ${d.score.toFixed(1)}`}
                  >
                    <span className="text-label-sm text-on-surface-variant">{d.label}</span>
                    <span className="text-label-sm font-semibold text-tertiary">{d.score.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state for weak+medium */}
          {weak.length === 0 && medium.length === 0 && (
            <div className="flex items-center justify-center py-4 text-body-sm text-on-surface-variant">
              Tất cả nhóm đều ở mức Tốt 🎉
            </div>
          )}
        </div>

        {/* ════ COLUMN 3: Tốt ════ */}
        <div className="flex flex-col gap-3">
          {strong.length > 0 ? (
            <>
              <div className="flex items-center gap-1.5 mb-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="var(--color-success)" opacity="0.15" />
                  <path d="M8 12l3 3 5-5" stroke="var(--color-success)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-label-sm font-bold text-success">
                  TỐT ({strong.length} nhóm)
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {strong.map(d => (
                  <div key={d.id}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-body-sm text-on-surface font-medium truncate max-w-[120px]" title={d.label}>
                        {d.label}
                      </span>
                      <button
                        onClick={() => handleScrollTo(d.id)}
                        className="text-label-sm text-success hover:text-success/80 shrink-0 ml-2 cursor-pointer transition-colors"
                      >
                        Xem →
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <MiniBar value={d.score} color="var(--color-success)" />
                      </div>
                      <span className="text-label-sm font-semibold text-success shrink-0 w-7 text-right">
                        {d.score.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center rounded-[--radius-lg] bg-surface-container-high">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-body-sm text-on-surface font-medium mb-1">
                Chưa có nhóm nào đạt mức Tốt
              </div>
              <div className="text-label-sm text-on-surface-variant">
                Cải thiện các nhóm Cần cải thiện để nâng điểm
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

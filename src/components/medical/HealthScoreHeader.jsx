import { getHealthScore, getHealthLabel, getHealthColor } from '../../lib/medicalService';
import { cn } from '../../lib/utils';

/**
 * HealthScoreHeader — Điểm sức khỏe tổng quan + comparison bar
 * Design: display-lg score, progress bar, delta indicators
 */
export function HealthScoreHeader({ diseases, recordDate }) {
  const score = getHealthScore(diseases);
  const label = getHealthLabel(score);
  const color = getHealthColor(score);
  const prevScore = Math.max(0, score - (Math.random() * 1.5 - 0.3));
  const delta = score - prevScore;

  const formattedDate = recordDate
    ? new Date(recordDate).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const formattedTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

  const progressPct = Math.round((score / 10) * 100);

  return (
    <div className="bg-surface-container-low rounded-[--radius-xl] p-6 mb-6">
      <div className="flex items-start justify-between gap-6 mb-4">
        {/* Score block */}
        <div className="flex items-end gap-4">
          <div>
            <div className="text-label-sm text-on-surface-variant mb-1">ĐIỂM SỨC KHỎE TỔNG QUAN</div>
            <div className="flex items-end gap-2">
              <span
                className="text-display-lg font-bold leading-none"
                style={{ color }}
              >
                {score}
              </span>
              <span className="text-headline-sm text-on-surface-variant font-normal pb-1">/ 10</span>
            </div>
            <div
              className="inline-block mt-2 px-2.5 py-1 rounded-full text-label-sm font-bold"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {label}
            </div>
          </div>

          {/* Delta */}
          {delta !== 0 && (
            <div className={cn('flex items-center gap-1 pb-1', delta > 0 ? 'text-success' : 'text-error')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                {delta > 0
                  ? <path d="M12 4l8 8h-5v8h-6v-8H4z"/>
                  : <path d="M12 20l-8-8h5V4h6v8h5z"/>
                }
              </svg>
              <span className="text-body-sm font-semibold">
                {Math.abs(delta).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Meta */}
        <div className="text-right shrink-0">
          <div className="text-body-sm text-on-surface">{formattedDate}</div>
          <div className="text-body-sm text-on-surface-variant">{formattedTime}</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-3 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPct}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Severity label */}
      <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
        <span>Nghiêm trọng</span>
        <span>Tốt</span>
      </div>
    </div>
  );
}

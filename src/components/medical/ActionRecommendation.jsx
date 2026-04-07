import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

/**
 * ActionRecommendation — Chuyên gia Smax recommendation card
 * Priority badge (HIGH/MEDIUM) + title + impact + save button
 */
export function ActionRecommendation({ action, isSaved, onToggle, diseaseSeverity }) {
  const priorityConfig = {
    HIGH:   { label: 'HIGH',   bg: '#BF300318', color: '#BF3003', border: '#BF300340' },
    MEDIUM: { label: 'MED',   bg: '#0052FF18', color: '#0052FF', border: '#0052FF40' },
    LOW:    { label: 'LOW',   bg: '#05966918', color: '#059669', border: '#05966940' },
  };
  const p = priorityConfig[action.priority] || priorityConfig.MEDIUM;

  return (
    <div className={cn(
      'rounded-md p-4 transition-all duration-200',
      diseaseSeverity === 'NẶNG' ? 'bg-surface-container-low' : 'bg-surface-container-lowest'
    )}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Priority Badge */}
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold shrink-0"
            style={{ backgroundColor: p.bg, color: p.color, border: `1px solid ${p.border}` }}
          >
            {p.label}
          </span>
          {/* Title */}
          <h4 className="text-body-sm font-semibold text-on-surface leading-snug">
            {action.title}
          </h4>
        </div>

        {/* Impact Badge */}
        <span className="shrink-0 text-label-sm font-semibold text-success whitespace-nowrap">
          {action.impact}
        </span>
      </div>

      <p className="text-body-sm text-on-surface-variant leading-relaxed mb-3">
        {action.description}
      </p>

      <div className="flex items-center justify-end">
        <button
          onClick={() => onToggle(action.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm font-medium transition-all duration-150 cursor-pointer',
            isSaved
              ? 'bg-success/10 text-success border border-success/20'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest border border-transparent'
          )}
        >
          {isSaved ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Đã lưu
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
              Lưu hành động
            </>
          )}
        </button>
      </div>
    </div>
  );
}

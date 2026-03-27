import { cn } from '../../lib/utils';

function priorityConfig(priority) {
  if (priority === 'HIGH') return { color: '#BF3003', bg: 'rgba(191,48,3,0.08)', label: 'Cao' };
  if (priority === 'MEDIUM') return { color: '#0052FF', bg: 'rgba(0,82,255,0.08)', label: 'Trung bình' };
  return { color: '#059669', bg: 'rgba(5,150,105,0.08)', label: 'Thấp' };
}

function RecommendationItem({ rec, isSaved, onToggle }) {
  const { color, bg, label } = priorityConfig(rec.priority);

  return (
    <div className={cn(
      'rounded-[--radius-sm] p-3 transition-all',
      'hover:bg-surface-container-low'
    )}>
      {/* Header row */}
      <div className="flex items-start gap-2 mb-1">
        {/* Priority badge */}
        <span
          className="text-label-xs font-bold px-1.5 py-0.5 rounded shrink-0"
          style={{ backgroundColor: bg, color }}
        >
          {label.toUpperCase()}
        </span>

        {/* Title */}
        <span className="text-body-sm font-medium text-on-surface flex-1 leading-snug">
          {rec.title}
        </span>
      </div>

      {/* Impact + save */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-label-xs text-on-surface-variant">
          {rec.impact}
        </span>
        <button
          onClick={() => onToggle(rec)}
          className={cn(
            'flex items-center gap-1 text-label-xs px-2 py-1 rounded-full transition-all cursor-pointer',
            isSaved
              ? 'bg-success/10 text-success'
              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
          )}
        >
          {isSaved ? (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Đã lưu
            </>
          ) : (
            <>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
              </svg>
              Lưu
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export function SmaxRecommendationsPanel({ diseases, savedActionIds, onToggleAction }) {
  // Collect all HIGH priority recommendations from all diseases
  const allRecs = diseases.flatMap(d =>
    d.recommendations.map(r => ({ ...r, diseaseId: d.id, diseaseLabel: d.label }))
  );

  // Sort: HIGH first, then MEDIUM, then LOW
  const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
  allRecs.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Show top 8
  const visible = allRecs.slice(0, 8);

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <div className="w-4 h-4 rounded gradient-signature flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
          Gợi ý Smax
        </h3>
        {allRecs.length > 8 && (
          <span className="ml-auto text-label-xs text-on-surface-variant">
            +{allRecs.length - 8} khác
          </span>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <span className="text-body-sm text-on-surface-variant/60">Chưa có gợi ý</span>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {visible.map(rec => (
            <RecommendationItem
              key={`${rec.diseaseId}-${rec.id}`}
              rec={rec}
              isSaved={savedActionIds.includes(rec.id)}
              onToggle={() => onToggleAction(rec)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

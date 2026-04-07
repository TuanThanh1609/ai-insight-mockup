import { cn } from '../../lib/utils';

/**
 * SavedActionsBar — Thanh tổng hợp actions đã lưu
 * Sticky at bottom, shows count + improvement indicators
 */
export function SavedActionsBar({ savedActions, diseases, onRemove }) {
  if (!savedActions || savedActions.length === 0) return null;

  const totalSaved = savedActions.length;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="glass rounded-lg shadow-[--shadow-xl] px-5 py-3 flex items-center gap-4 max-w-2xl w-full">
        {/* Label */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <span className="text-label-sm text-on-surface font-semibold whitespace-nowrap">
            {totalSaved} hành động đã lưu
          </span>
        </div>

        {/* Separator */}
        <div className="w-px h-5 bg-[var(--color-outline-variant)] shrink-0" />

        {/* Saved action pills */}
        <div className="flex-1 min-w-0 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2">
            {savedActions.slice(0, 3).map(action => {
              const disease = diseases.find(d => d.id === action.diseaseId);
              return (
                <div
                  key={`${action.diseaseId}-${action.actionId}`}
                  className="flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-full shrink-0"
                >
                  <span className="text-label-sm text-on-surface truncate max-w-[120px]">
                    {action.title}
                  </span>
                  {action.isImproving && (
                    <span className="text-success text-xs">↓</span>
                  )}
                  <button
                    onClick={() => onRemove(action.diseaseId, action.actionId)}
                    className="text-on-surface-variant/40 hover:text-error transition-colors cursor-pointer ml-1"
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              );
            })}
            {totalSaved > 3 && (
              <span className="text-label-sm text-on-surface-variant shrink-0">
                +{totalSaved - 3} khác
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <button className="shrink-0 text-label-sm text-tertiary hover:text-on-tertiary bg-tertiary/10 hover:bg-tertiary/20 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
          Xem tất cả →
        </button>
      </div>
    </div>
  );
}

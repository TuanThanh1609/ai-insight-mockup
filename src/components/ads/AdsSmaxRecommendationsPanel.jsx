import { useState, useCallback, useRef, useEffect } from 'react';
import { cn } from '../../lib/utils';
import { askSmaxForDisease, clearCache } from '../../lib/smaxAIService';

// ─── Priority badge ───────────────────────────────────────────────────────────

function PriorityBadge({ priority }) {
  const map = { HIGH: '🔴', MEDIUM: '🟡', LOW: '🟢' };
  const labels = { HIGH: 'HIGH', MEDIUM: 'MEDIUM', LOW: 'LOW' };
  const colors = { HIGH: '#BF3003', MEDIUM: '#d97706', LOW: '#059669' };
  return (
    <span
      className="text-[9px] font-bold tracking-wide px-1.5 py-0.5 rounded"
      style={{ color: colors[priority] || colors.MEDIUM, background: `${colors[priority] || colors.MEDIUM}18` }}
    >
      {map[priority] || ''} {labels[priority] || ''}
    </span>
  );
}

// ─── Single action card ────────────────────────────────────────────────────────

function ActionCard({ action, index, isExpanded, onToggle, isSaved, onSave }) {
  return (
    <div className="rounded-md border border-[var(--color-outline-variant)]/30 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-3 py-2.5 flex items-center gap-2 text-left hover:bg-surface-container-low transition-colors cursor-pointer"
      >
        {/* Rank */}
        <span className="w-5 h-5 rounded-full bg-[#0052FF]/10 text-[#0052FF] text-label-xs font-bold flex items-center justify-center shrink-0">
          {index + 1}
        </span>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-on-surface leading-snug line-clamp-2">
            {action.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {action.smax_feature && (
              <span className="text-label-xs text-tertiary">{action.smax_feature}</span>
            )}
            {action.impact && (
              <span className="text-label-xs font-semibold text-success">{action.impact}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={cn(
              'p-1 rounded transition-colors',
              isSaved ? 'text-success' : 'text-on-surface-variant hover:text-on-surface'
            )}
            title={isSaved ? 'Đã lưu' : 'Lưu'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24"
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
            </svg>
          </button>
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            className={cn('transition-transform duration-200 text-on-surface-variant', isExpanded ? 'rotate-180' : '')}
          >
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </button>

      {/* Expanded: description + steps */}
      {isExpanded && (
        <div className="px-3 pb-3 border-t border-[var(--color-outline-variant)]/20 pt-2 space-y-2">
          {action.description && (
            <p className="text-body-xs text-on-surface-variant leading-relaxed">{action.description}</p>
          )}
          {action.steps?.length > 0 && (
            <div className="space-y-1.5">
              {action.steps.map((step, si) => (
                <div key={si} className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5 text-[10px] font-semibold text-on-surface-variant">
                    Step {si + 1}
                  </span>
                  <p className="text-body-xs text-on-surface-variant leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Per-disease AI recommendation block ─────────────────────────────────────

function DiseaseAIRec({ disease, savedActionIds = [], onSaveAction, onRemoveAction }) {
  const [status, setStatus]     = useState('idle');   // idle|loading|streaming|done|error
  const [actions, setActions]   = useState([]);
  const [preview, setPreview]   = useState('');
  const [expandedSet, setExpandedSet] = useState(new Set());
  const [savedSet, setSavedSet] = useState(new Set(savedActionIds));
  const [open, setOpen]         = useState(false);
  const controllerRef           = useRef(null);
  const mountedRef              = useRef(true);

  // Abort streaming on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      controllerRef.current?.abort();
      mountedRef.current = false;
    };
  }, []);

  const start = useCallback(() => {
    if (status === 'loading' || status === 'streaming') return;
    if (status === 'done') { setOpen(true); return; }

    setStatus('loading');
    setPreview('');
    setActions([]);
    setOpen(true);

    const { controller } = askSmaxForDisease({
      disease,
      industry: 'ads',
      industryLabel: 'Quảng Cáo Ads',
      topObjections: [],
      topMistakes: [],
      onChunk: (chunk) => {
        if (!mountedRef.current) return;
        setStatus('streaming');
        setPreview(prev => prev + chunk);
      },
      onDone: (parsed) => {
        if (!mountedRef.current) return;
        setStatus('done');
        setActions(Array.isArray(parsed) ? parsed : []);
      },
      onError: () => {
        if (!mountedRef.current) return;
        setStatus('error');
      },
    });
    controllerRef.current = controller;
  }, [status, disease]);

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
      controllerRef.current?.abort();
    } else {
      start();
    }
  };

  const retry = () => {
    clearCache('ads');
    setStatus('idle');
    setPreview('');
    setActions([]);
    setTimeout(start, 50);
  };

  const toggleExpand = (idx) =>
    setExpandedSet(prev => {
      const n = new Set(prev);
      n.has(idx) ? n.delete(idx) : n.add(idx);
      return n;
    });

  const toggleSave = (action) => {
    const isSaved = savedSet.has(action.id || action.title);
    if (isSaved) {
      setSavedSet(prev => { const n = new Set(prev); n.delete(action.id || action.title); return n; });
      onRemoveAction?.(action.id || action.title);
    } else {
      setSavedSet(prev => { const n = new Set(prev); n.add(action.id || action.title); return n; });
      onSaveAction?.(action);
    }
  };

  return (
    <div className="rounded-md border border-[var(--color-outline-variant)]/30 overflow-hidden">
      {/* Header row */}
      <button
        onClick={toggleOpen}
        className="w-full px-3 py-2.5 flex items-center gap-2 text-left hover:bg-surface-container-low transition-colors cursor-pointer"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-body-sm font-semibold text-on-surface line-clamp-1">{disease.label}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ color: disease.severityColor, background: `${disease.severityColor}18` }}>
              {disease.score}/10
            </span>
          </div>

          {status === 'loading' && (
            <p className="text-label-xs text-on-surface-variant flex items-center gap-1">
              <span className="inline-block w-3 h-3 border-2 border-[#0052FF]/30 border-t-[#0052FF] rounded-full animate-spin" />
              Smax đang phân tích...
            </p>
          )}
          {status === 'streaming' && (
            <p className="text-label-xs text-on-surface-variant">{preview || 'Đang xử lý...'}</p>
          )}
          {status === 'done' && (
            <p className="text-label-xs text-success flex items-center gap-1">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              {actions.length > 0 ? `${actions.length} hành động` : (preview || 'Chưa có hành động')}
            </p>
          )}
          {status === 'error' && (
            <p className="text-label-xs text-error">Lỗi — thử lại</p>
          )}
        </div>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          className={cn('shrink-0 transition-transform duration-200', open ? 'rotate-180' : '')}>
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </button>

      {/* Body */}
      {open && (
        <div className="px-3 pb-3 border-t border-[var(--color-outline-variant)]/20">
          {status === 'error' ? (
            <div className="pt-3 text-center">
              <p className="text-body-xs text-error mb-2">Smax AI tạm thời không trả lời được.</p>
              <button onClick={retry} className="text-label-xs text-tertiary underline cursor-pointer">Thử lại</button>
            </div>
          ) : status === 'idle' ? (
            <div className="pt-3 text-center">
              <p className="text-body-xs text-on-surface-variant mb-2">Nhấn để Smax AI phân tích nhóm này.</p>
              <button onClick={start} className="text-label-xs text-tertiary underline cursor-pointer">Bắt đầu</button>
            </div>
          ) : actions.length > 0 ? (
            <div className="pt-3 space-y-2">
              {actions.map((action, idx) => (
                <ActionCard
                  key={action.id || idx}
                  action={action}
                  index={idx}
                  isExpanded={expandedSet.has(idx)}
                  onToggle={() => toggleExpand(idx)}
                  isSaved={savedSet.has(action.id || action.title)}
                  onSave={() => toggleSave(action)}
                />
              ))}
            </div>
          ) : (
            <div className="pt-3 text-center">
              <p className="text-body-xs text-on-surface-variant animate-pulse">
                {preview || 'Đang phân tích...'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Panel ───────────────────────────────────────────────────────────────

/**
 * AdsSmaxRecommendationsPanel — Smax AI recommendations for Ads diseases
 *
 * Props:
 *   disease              { id, label, score, severity, severityColor, metrics[] }
 *   recommendations[]    — from ADS_SMAX_RECOMMENDATIONS[disease.id] (rule-based)
 *   savedActionIds[]    — action IDs already saved
 *   onSaveAction(action)
 *   onRemoveAction(actionId)
 *   industry             — 'ads' (for cache key)
 */
export function AdsSmaxRecommendationsPanel({
  disease,
  recommendations = [],
  savedActionIds = [],
  onSaveAction,
  onRemoveAction,
  industry = 'ads',
}) {
  const savedCount = savedActionIds.length;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-1">
        <div className="w-4 h-4 rounded gradient-signature flex items-center justify-center">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="white">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
          </svg>
        </div>
        <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
          Smax Gợi Ý
        </h3>
        {savedCount > 0 && (
          <span className="ml-auto text-label-xs font-bold text-success px-1.5 py-0.5 rounded-full bg-success/10">
            {savedCount} đã lưu
          </span>
        )}
      </div>

      {/* Rule-based recommendations (fallback / always shown) */}
      {recommendations.length > 0 && (
        <div className="space-y-2">
          {recommendations.map((rec, idx) => {
            const isSaved = savedActionIds.includes(rec.id);
            return (
              <div key={rec.id} className="rounded-md border border-[var(--color-outline-variant)]/30 overflow-hidden">
                <button
                  className="w-full px-3 py-2.5 flex items-center gap-2 text-left hover:bg-surface-container-low transition-colors cursor-pointer"
                  onClick={() => isSaved ? onRemoveAction(rec.id) : onSaveAction(rec)}
                >
                  {/* Priority + Rank */}
                  <PriorityBadge priority={rec.priority} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-body-sm font-semibold text-on-surface leading-snug line-clamp-2">
                      {rec.title}
                    </p>
                    {rec.impact && (
                      <p className="text-label-xs font-semibold text-success mt-0.5">{rec.impact}</p>
                    )}
                  </div>

                  {/* Bookmark toggle */}
                  <span className={cn('shrink-0 text-label-sm font-semibold', isSaved ? 'text-success' : 'text-on-surface-variant')}>
                    {isSaved ? '✓ Đã chọn' : 'Chọn ✓'}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* AI-powered block (toggle expand) */}
      <DiseaseAIRec
        disease={disease}
        savedActionIds={savedActionIds}
        onSaveAction={onSaveAction}
        onRemoveAction={onRemoveAction}
      />
    </div>
  );
}

import {
  Check, CircleDot, Square, Clock, TrendingUp, TrendingDown, Sparkles, Loader2, ChevronDown, ChevronRight,
} from 'lucide-react';

const STATUS_CONFIG = {
  'todo': {
    label: 'Chưa làm',
    color: '#9CA3AF',
    bg: '#F9FAFB',
    border: '#E5E7EB',
    icon: Square,
  },
  'in-progress': {
    label: 'Đang làm',
    color: '#0052FF',
    bg: 'rgba(0,82,255,0.06)',
    border: 'rgba(0,82,255,0.25)',
    icon: CircleDot,
  },
  'done': {
    label: 'Hoàn thành',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    border: 'rgba(5,150,105,0.25)',
    icon: Check,
  },
};

/** Cycle: todo → in-progress → done → todo */
function nextStatus(current) {
  if (current === 'todo')        return 'in-progress';
  if (current === 'in-progress') return 'done';
  return 'todo';
}

function StatusIcon({ status, size = 16 }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
  if (status === 'done') {
    return (
      <div
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: '#059669' }}
      >
        <Check size={11} color="white" strokeWidth={3} />
      </div>
    );
  }
  if (status === 'in-progress') {
    return (
      <div
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(0,82,255,0.12)' }}
      >
        <CircleDot size={14} color="#0052FF" strokeWidth={2.5} />
      </div>
    );
  }
  return <Square size={18} className="text-[#D1D5DB] shrink-0" />;
}

function SubTaskItem({ subTask, status, onToggle }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['todo'];
  const isDone = status === 'done';
  const isInProgress = status === 'in-progress';

  return (
    <button
      onClick={onToggle}
      className={[
        'w-full flex items-start gap-3 px-3 py-3 rounded-[--radius-md] transition-all cursor-pointer',
        isDone
          ? 'hover:bg-[#F9FAFB]'
          : isInProgress
          ? 'hover:bg-[rgba(0,82,255,0.04)]'
          : 'hover:bg-[#F3F4F6]',
      ].join(' ')}
    >
      {/* Status icon */}
      <div className="shrink-0 mt-0.5">
        <StatusIcon status={status} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-0.5">
          <span
            className={[
              'text-[13px] leading-snug text-left',
              isDone
                ? 'text-[#9CA3AF] line-through'
                : isInProgress
                ? 'text-on-surface font-medium'
                : 'text-on-surface',
            ].join(' ')}
          >
            {subTask.title}
          </span>
          {/* Status badge */}
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {cfg.label}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant">
          {subTask.estimatedDays && (
            <span className="flex items-center gap-1">
              <Clock size={10} />
              ~{subTask.estimatedDays} ngày
            </span>
          )}
          {subTask.notes && (
            <span className="flex items-center gap-1 truncate">
              {subTask.notes}
            </span>
          )}
          {subTask.isAI && (
            <span className="flex items-center gap-1 text-[#7C3AED] font-medium">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              AI đề xuất
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function MetricArrow({ before, after, unit, direction }) {
  const isUp = direction === 'up';
  const color = isUp ? '#059669' : '#DC2626';
  const Icon = isUp ? TrendingUp : TrendingDown;
  const diff = Math.abs(
    unit === 'điểm' ? parseFloat((after - before).toFixed(1))
    : unit === '%' ? Math.round(after - before)
    : (after - before).toFixed(1)
  );
  return (
    <div className="flex items-center gap-1">
      <span className="text-[12px] font-semibold text-on-surface">
        {typeof before === 'number' ? before : before}
        <span className="text-[#9CA3AF] mx-1">→</span>
        <span className="font-bold">{after}</span>
        <span className="text-[11px] text-on-surface-variant ml-1">{unit}</span>
      </span>
      <span className="flex items-center gap-0.5 text-[11px] font-semibold" style={{ color }}>
        <Icon size={10} />
        {diff}{unit === 'điểm' ? '' : unit === '%' ? '%' : '×'}
      </span>
    </div>
  );
}

/**
 * JobDetailPanel — right side of split layout
 * Shows sub-tasks for selected job with 3-state lifecycle + AI guidance
 */
export function JobDetailPanel({
  job,
  phaseColor,
  phaseProjectedMetrics = [],
  statusMap,
  onToggleStatus,
  onCompleteAll,
  aiSubTasks = [],
  aiLoading = false,
}) {
  const total   = job.subTasks?.length || 0;
  const done    = job.subTasks?.filter(st => statusMap?.[st.id] === 'done').length || 0;
  const inProg  = job.subTasks?.filter(st => statusMap?.[st.id] === 'in-progress').length || 0;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const remaining = total - done;

  const estimatedDays = (job.subTasks || []).reduce((s, st) => s + (st.estimatedDays || 1), 0);

  const progressRingSize = 72;

  return (
    <div className="bg-white rounded-[--radius-lg] border border-[#E5E7EB] overflow-hidden">
      {/* ── Header ── */}
      <div
        className="px-5 py-4"
        style={{ borderLeft: `4px solid ${phaseColor}` }}
      >
        <div className="flex items-start gap-4 mb-3">
          {/* Progress ring */}
          <div className="shrink-0 flex flex-col items-center">
            <svg width={progressRingSize} height={progressRingSize} viewBox={`0 0 ${progressRingSize} ${progressRingSize}`}>
              <circle
                cx={progressRingSize/2}
                cy={progressRingSize/2}
                r={(progressRingSize - 8) / 2}
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="6"
              />
              <circle
                cx={progressRingSize/2}
                cy={progressRingSize/2}
                r={(progressRingSize - 8) / 2}
                fill="none"
                stroke={phaseColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${Math.round((pct / 100) * Math.PI * (progressRingSize - 8))} ${Math.PI * (progressRingSize - 8)}`}
                transform={`rotate(-90 ${progressRingSize/2} ${progressRingSize/2})`}
              />
              <text
                x={progressRingSize/2}
                y={progressRingSize/2 + 6}
                textAnchor="middle"
                fontSize="18"
                fontWeight="800"
                fill={phaseColor}
                fontFamily="Manrope, sans-serif"
              >
                {pct}%
              </text>
            </svg>
            <span className="text-[10px] text-on-surface-variant mt-1">
              {done}/{total} hoàn thành
            </span>
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-semibold text-on-surface leading-snug mb-2">
              {job.title}
            </h2>
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority */}
              <span
                className="text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{
                  background: job.priority === 'HIGH' ? 'rgba(191,48,3,0.08)' : job.priority === 'MEDIUM' ? 'rgba(0,82,255,0.08)' : 'rgba(5,150,105,0.08)',
                  color: job.priority === 'HIGH' ? '#BF3003' : job.priority === 'MEDIUM' ? '#0052FF' : '#059669',
                }}
              >
                {job.priority === 'HIGH' ? 'Ưu tiên CAO' : job.priority === 'MEDIUM' ? 'Ưu tiên TRUNG' : 'Ưu tiên THẤP'}
              </span>
              {/* Severity */}
              <span className="text-[10px] font-medium px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-on-surface-variant">
                {job.severity}
              </span>
              {/* Time estimate */}
              <span className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full text-on-surface-variant">
                <Clock size={10} />
                ~{estimatedDays} ngày
              </span>
            </div>
          </div>
        </div>

        {/* ── Kết quả khi hoàn thành ── */}
        {phaseProjectedMetrics.length > 0 && (
          <div
            className="rounded-[--radius-md] px-4 py-3"
            style={{ background: '#F8F9FB', border: '1px solid #E5E7EB' }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
              Kết quả khi hoàn thành
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {phaseProjectedMetrics.map((metric, i) => (
                <MetricArrow
                  key={i}
                  before={metric.before}
                  after={metric.after}
                  unit={metric.unit}
                  direction={metric.direction}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Sub-tasks list ── */}
      <div className="px-4 py-3">
        {/* Status summary row */}
        <div className="flex items-center gap-3 mb-3 px-1 text-[11px]">
          <span className="text-on-surface-variant font-medium">Đầu việc ({total})</span>
          <span className="text-[#9CA3AF]">·</span>
          {inProg > 0 && (
            <span className="flex items-center gap-1" style={{ color: '#0052FF' }}>
              <CircleDot size={10} />
              Đang làm: {inProg}
            </span>
          )}
          {inProg > 0 && done > 0 && <span className="text-[#9CA3AF]">·</span>}
          {done > 0 && (
            <span className="flex items-center gap-1" style={{ color: '#059669' }}>
              <Check size={10} />
              Hoàn thành: {done}
            </span>
          )}
          {remaining > 0 && (done > 0 || inProg > 0) && (
            <span className="text-[#9CA3AF]">·</span>
          )}
          {remaining > 0 && (
            <span className="text-on-surface-variant">
              Còn lại: {remaining}
            </span>
          )}
        </div>

        <div className="divide-y divide-[#F3F4F6]">
          {job.subTasks?.map(subTask => (
            <SubTaskItem
              key={subTask.id}
              subTask={subTask}
              status={statusMap?.[subTask.id] || 'todo'}
              onToggle={() => onToggleStatus(subTask.id)}
            />
          ))}
        </div>
      </div>

      {/* ── AI Guidance Section ── */}
      <div className="px-4 pb-3">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <Sparkles size={13} className="text-[#7C3AED]" />
          <span className="text-[12px] font-semibold text-[#7C3AED]">
            Hướng dẫn chi tiết từ Smax AI
          </span>
          {aiLoading && (
            <span className="flex items-center gap-1 text-[11px] text-[#9CA3AF]">
              <Loader2 size={10} className="animate-spin" />
              Đang tạo đề xuất…
            </span>
          )}
        </div>

        {/* AI sub-tasks */}
        {aiLoading && aiSubTasks.length === 0 && (
          <div className="flex items-center gap-3 px-4 py-5 rounded-[--radius-md] bg-[#F8F5FF] border border-[#7C3AED]/20">
            <Loader2 size={20} className="animate-spin text-[#7C3AED] shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-[#7C3AED]">
                SMAX AI đang phân tích…
              </p>
              <p className="text-[11px] text-[#9CA3AF] mt-0.5">
                Dựa trên nhóm bệnh và ngành hàng của bạn
              </p>
            </div>
          </div>
        )}

        {aiSubTasks.length > 0 && (
          <div className="space-y-1.5">
            {aiSubTasks.map((subTask, i) => (
              <div
                key={subTask.id || `ai-${i}`}
                className={[
                  'flex items-start gap-3 px-3 py-3 rounded-[--radius-md] border transition-all',
                  statusMap?.[subTask.id] === 'done'
                    ? 'bg-[rgba(5,150,105,0.04)] border-[rgba(5,150,105,0.15)]'
                    : statusMap?.[subTask.id] === 'in-progress'
                    ? 'bg-[rgba(0,82,255,0.04)] border-[rgba(0,82,255,0.15)]'
                    : 'bg-[#F8F5FF] border-[#7C3AED]/20',
                ].join(' ')}
              >
                {/* Status icon */}
                <div className="shrink-0 mt-0.5">
                  {statusMap?.[subTask.id] === 'done' ? (
                    <div className="w-5 h-5 rounded-full bg-[#059669] flex items-center justify-center">
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                  ) : statusMap?.[subTask.id] === 'in-progress' ? (
                    <div className="w-5 h-5 rounded-full bg-[rgba(0,82,255,0.12)] flex items-center justify-center">
                      <CircleDot size={14} color="#0052FF" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#7C3AED]/12 flex items-center justify-center">
                      <Sparkles size={11} color="#7C3AED" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-0.5">
                    <span className={[
                      'text-[13px] leading-snug',
                      statusMap?.[subTask.id] === 'done'
                        ? 'text-[#9CA3AF] line-through'
                        : 'text-on-surface',
                    ].join(' ')}>
                      {subTask.title}
                    </span>
                    <button
                      onClick={() => onToggleStatus(subTask.id)}
                      className="shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/20 transition-colors cursor-pointer"
                    >
                      {statusMap?.[subTask.id] === 'done' ? 'Hoàn thành' :
                       statusMap?.[subTask.id] === 'in-progress' ? 'Đang làm' : 'Bắt đầu'}
                    </button>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-on-surface-variant">
                    {subTask.estimatedDays && (
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        ~{subTask.estimatedDays} ngày
                      </span>
                    )}
                    {subTask.notes && (
                      <span className="text-[#7C3AED] font-medium">
                        {subTask.notes}
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[#7C3AED] font-medium">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                      </svg>
                      AI
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state: no AI yet */}
        {!aiLoading && aiSubTasks.length === 0 && (
          <div className="flex items-center gap-3 px-4 py-4 rounded-[--radius-md] bg-[#F8F5FF] border border-dashed border-[#7C3AED]/25">
            <div className="w-8 h-8 rounded-full bg-[#7C3AED]/12 flex items-center justify-center shrink-0">
              <Sparkles size={14} color="#7C3AED" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-medium text-on-surface">
                Đang chờ Smax AI gợi ý đầu việc
              </p>
              <p className="text-[11px] text-on-surface-variant mt-0.5">
                Nhấn chọn công việc này để Smax AI phân tích và đề xuất hướng dẫn cụ thể
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Footer actions ── */}
      {remaining > 0 && (
        <div className="px-5 py-3 border-t border-[#F3F4F6] flex gap-2">
          <button
            onClick={onCompleteAll}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[--radius-md] bg-[#F9FAFB] hover:bg-[#F3F4F6] text-[13px] font-medium text-on-surface transition-colors cursor-pointer border border-[#E5E7EB]"
          >
            <Check size={14} />
            Hoàn thành tất cả ({remaining})
          </button>
        </div>
      )}

      {/* ── All done state ── */}
      {remaining === 0 && total > 0 && (
        <div className="px-5 py-3 border-t border-[#F3F4F6] bg-[rgba(5,150,105,0.04)]">
          <div className="flex items-center gap-2 text-[13px] font-medium text-[#059669]">
            <Check size={16} />
            Tất cả đầu việc đã hoàn thành!
          </div>
        </div>
      )}
    </div>
  );
}

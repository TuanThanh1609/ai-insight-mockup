import { CheckSquare, Square } from 'lucide-react';

const PRIORITY_COLOR = {
  HIGH:   '#BF3003',
  MEDIUM: '#0052FF',
  LOW:    '#059669',
};

function ProgressRing({ percent, color, size = 24 }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const dash = Math.round((percent / 100) * circ);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="2.5" />
      <circle
        cx={size/2} cy={size/2} r={r}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform={`rotate(-90 ${size/2} ${size/2})`}
      />
    </svg>
  );
}

/**
 * JobCard — single job item in the left panel list.
 * Uses statusMap (Record<subTaskId, 'todo'|'in-progress'|'done'>) for progress.
 */
export function JobCard({ job, phaseColor, isSelected, onClick, statusMap }) {
  const total   = job.subTasks?.length || 0;
  const done    = job.subTasks?.filter(st => statusMap?.[st.id] === 'done').length || 0;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const borderColor = PRIORITY_COLOR[job.priority] || phaseColor;

  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left px-3 py-2.5 rounded-[--radius-md] transition-all duration-150 cursor-pointer',
        isSelected
          ? 'bg-[#F0F4FF] border border-[#0052FF]/30 shadow-sm'
          : 'bg-[#F9FAFB] hover:bg-[#F3F4F6] hover:border-[#E5E7EB] border border-transparent',
      ].join(' ')}
      style={!isSelected ? { borderLeftWidth: '3px', borderLeftColor: borderColor } : {}}
    >
      <div className="flex items-start gap-2.5">
        {/* Completion ring */}
        <div className="shrink-0 mt-0.5">
          <ProgressRing percent={pct} color={borderColor} size={24} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-0.5">
            <span className="text-[13px] font-medium text-on-surface leading-snug">
              {job.title}
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1 flex-wrap">
            {/* Priority badge */}
            <span
              className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
              style={{ background: `${borderColor}18`, color: borderColor }}
            >
              {job.priority === 'HIGH' ? 'Cao' : job.priority === 'MEDIUM' ? 'Trung' : 'Thấp'}
            </span>

            {/* Severity */}
            <span className="text-[10px] text-on-surface-variant bg-[#F3F4F6] px-1.5 py-0.5 rounded-full">
              {job.severity}
            </span>

            {/* Completion count */}
            <span className="text-[10px] text-on-surface-variant ml-auto">
              {done}/{total}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

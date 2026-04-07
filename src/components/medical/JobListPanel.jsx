import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { JobCard } from './JobCard';

const FILTERS = [
  { value: 'all',          label: 'Tất cả' },
  { value: 'in-progress',  label: 'Đang làm' },
  { value: 'todo',         label: 'Chưa làm' },
  { value: 'done',         label: 'Hoàn thành' },
];

/** ── Metric Arrow Card ──
 * Shows a single metric: label + before → after + colored diff badge
 * Sized to be scannable at a glance (large labels, bold values)
 */
function MetricArrowCard({ metric }) {
  const isUp   = metric.direction === 'up';
  const diffColor = isUp ? '#059669' : '#DC2626';
  const Icon    = isUp ? TrendingUp : TrendingDown;
  const unitSuffix = metric.unit === 'điểm' ? 'điểm'
    : metric.unit === '%' ? '%'
    : metric.unit || '';
  const diff = metric.unit === 'điểm'
    ? parseFloat((metric.after - metric.before).toFixed(1))
    : metric.unit === '%'
    ? Math.round(metric.after - metric.before)
    : parseFloat((metric.after - metric.before).toFixed(1));

  return (
    <div className="flex items-stretch gap-0 flex-1 min-w-0">
      {/* Vertical divider (not on first) */}
      <div className="w-px bg-[#E5E7EB] mr-4 shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Label — prominent, uppercase */}
        <div className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide mb-1.5 leading-tight">
          {metric.label}
        </div>

        {/* Values row */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Before */}
          <span className="text-[15px] font-semibold text-on-surface">
            {metric.before}
          </span>

          {/* Arrow */}
          <svg width="18" height="10" viewBox="0 0 18 10" className="shrink-0 text-[#9CA3AF]">
            <path d="M0 5h16M11 1l5 4-5 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* After (bold) */}
          <span className="text-[18px] font-bold text-on-surface leading-none">
            {metric.after}
          </span>

          {/* Unit */}
          {unitSuffix && (
            <span className="text-[13px] font-medium text-on-surface-variant">
              {unitSuffix}
            </span>
          )}

          {/* Diff badge */}
          <span
            className="flex items-center gap-0.5 text-[12px] font-bold px-2 py-0.5 rounded-full leading-none"
            style={{ background: `${diffColor}15`, color: diffColor }}
          >
            <Icon size={11} />
            {Math.abs(diff)}{unitSuffix}
          </span>
        </div>
      </div>
    </div>
  );
}

/** ── Phase Accordion ──
 * White card with colored left-border (4px)
 * Collapsible: header always visible, jobs list toggles open/closed
 * Header: title row + inline metrics strip (always visible even when collapsed)
 */
function PhaseAccordion({ phase, selectedJobId, onSelectJob, statusMap }) {
  const [isOpen, setIsOpen] = useState(true);

  const allSubTasks = phase.jobs.flatMap(j => j.subTasks || []);
  const doneCount   = allSubTasks.filter(st => statusMap?.[st.id] === 'done').length;
  const pct         = allSubTasks.length > 0
    ? Math.round((doneCount / allSubTasks.length) * 100) : 0;

  const progressColor = pct >= 75 ? '#059669'
    : pct >= 40 ? '#0052FF'
    : '#BF3003';

  return (
    <div className="mb-3">
      {/* ── White phase card ── */}
      <div
        className="bg-white rounded-lg border border-[#E5E7EB] overflow-hidden"
        style={{ borderLeft: `4px solid ${phase.color}` }}
      >
        {/* ── Header (always visible) ── */}
        <button
          className="w-full flex items-start gap-3 px-4 pt-3.5 pb-3 cursor-pointer bg-transparent text-left hover:bg-[#FAFAFA] transition-colors"
          onClick={() => setIsOpen(v => !v)}
        >
          {/* Chevron */}
          <div className="shrink-0 mt-0.5">
            {isOpen
              ? <ChevronDown size={16} className="text-on-surface-variant" />
              : <ChevronRight size={16} className="text-on-surface-variant" />
            }
          </div>

          {/* Left: title + meta */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {/* Phase name */}
              <span className="text-[14px] font-bold text-on-surface leading-tight">
                Phase {phase.phaseIndex} · {phase.title}
              </span>
              {/* Week badge */}
              <span
                className="text-[11px] font-bold px-2 py-0.5 rounded-full leading-none"
                style={{ background: `${phase.color}18`, color: phase.color }}
              >
                {phase.weeks}
              </span>
              {/* Date range */}
              {phase.dateStart && phase.dateEnd && (
                <span className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                  <Clock size={10} />
                  {phase.dateStart} → {phase.dateEnd}
                </span>
              )}
            </div>

            {/* Progress bar + count */}
            <div className="flex items-center gap-2.5">
              <div className="flex-1 max-w-[140px]">
                <div className="h-1.5 bg-[#F3F4F6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: progressColor }}
                  />
                </div>
              </div>
              <span className="text-[12px] font-medium text-on-surface-variant shrink-0">
                {doneCount}/{allSubTasks.length} việc
              </span>
            </div>
          </div>
        </button>

        {/* ── Metrics strip (always visible below header) ── */}
        {phase.projectedMetrics && phase.projectedMetrics.length > 0 && (
          <div
            className="flex items-stretch gap-0 px-4 py-3 border-t border-[#F3F4F6]"
            style={{ background: `${phase.color}05` }}
          >
            <div className="flex items-center gap-0 flex-1 flex-wrap">
              {/* "Kết quả dự kiến" label */}
              <div className="flex items-center gap-2 mr-4 shrink-0">
                <div className="w-1 h-8 rounded-full" style={{ background: phase.color }} />
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wide leading-tight">
                  Kết quả<br />dự kiến
                </span>
              </div>

              {/* Metrics */}
              {phase.projectedMetrics.map((metric, i) => (
                <MetricArrowCard key={i} metric={metric} />
              ))}
            </div>
          </div>
        )}

        {/* ── Jobs list (collapsible) ── */}
        {isOpen && (
          <div className="px-3 pb-3 pt-1.5 space-y-1.5 border-t border-[#F3F4F6]">
            {phase.jobs.map(job => (
              <JobCard
                key={job.id}
                job={job}
                phaseColor={phase.color}
                isSelected={selectedJobId === job.id}
                onClick={() => onSelectJob(job)}
                statusMap={statusMap}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** ── JobListPanel ── */
export function JobListPanel({
  phases,
  selectedJobId,
  onSelectJob,
  activeFilter,
  onFilterChange,
  statusMap,
}) {
  return (
    <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
      {/* Filter chips */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        <span className="text-label-xs text-on-surface-variant mr-1">Lọc:</span>
        {FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onFilterChange(f.value)}
            className={[
              'text-[11px] font-medium px-2.5 py-1 rounded-full transition-all cursor-pointer',
              activeFilter === f.value
                ? 'bg-[#1A2138] text-white'
                : 'bg-[#F3F4F6] text-on-surface-variant hover:bg-[#E5E7EB]'
            ].join(' ')}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Phase accordions */}
      <div>
        {phases.map(phase => (
          <PhaseAccordion
            key={phase.id}
            phase={phase}
            selectedJobId={selectedJobId}
            onSelectJob={onSelectJob}
            statusMap={statusMap}
          />
        ))}
      </div>
    </div>
  );
}

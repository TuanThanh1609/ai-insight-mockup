import { useState, useEffect, useCallback, useRef } from 'react';
import {
  generateImprovementRoadmap,
  getRoadmapStatus,
  saveRoadmapStatus,
} from '../../lib/medicalService';
import {
  generateAllRoadmapSubTasks,
} from '../../lib/smaxAIService';
import { JobListPanel } from './JobListPanel';
import { JobDetailPanel } from './JobDetailPanel';

/** Cycle status: todo → in-progress → done → todo */
function nextStatus(current) {
  if (current === 'todo')        return 'in-progress';
  if (current === 'in-progress') return 'done';
  return 'todo';
}

/**
 * ImprovementRoadmapContent
 *
 * Split-panel layout:
 *  - Left (40%): Phase accordions with "Kết quả dự kiến" + filter chips
 *  - Right (60%): Job detail with 3-state sub-tasks + Kết quả block + AI guidance
 *
 * State:
 *  - statusMap: Record<subTaskId, 'todo'|'in-progress'|'done'>
 *  - aiSubTasks: Record<jobId, subTask[]>
 *  - aiLoading: Record<jobId, boolean>
 */
export function ImprovementRoadmapContent({ diseases, conversations, config }) {
  const industry     = config?.industry || 'default';
  const industryLabel = config?.industryLabel || industry;
  const roadmap      = generateImprovementRoadmap(diseases, conversations);
  const allJobs      = roadmap.phases.flatMap(p => p.jobs);

  // ── Status map (3-state: todo | in-progress | done) ──
  const [statusMap, setStatusMap] = useState(() => {
    const stored = getRoadmapStatus(industry);
    return new Map(Object.entries(stored));
  });

  // ── Persist to localStorage on every change ──
  useEffect(() => {
    saveRoadmapStatus(industry, Object.fromEntries(statusMap));
  }, [statusMap, industry]);

  // ── AI sub-tasks (augmented per-job by SMAX AI) ──
  // Record<jobId, { id, title, estimatedDays, notes, isAI }[]>
  const [aiSubTasks, setAiSubTasks] = useState({});
  const [aiLoading, setAiLoading]   = useState({});

  // ── Trigger AI generation when a job is selected ──
  const generateForJob = useCallback(async (job) => {
    if (!job) return;

    // Find the disease most relevant to this job
    const relevantDisease = job.diseases?.[0]
      ? (diseases || []).find(d => d.id === job.diseases[0])
      : (diseases || [])[0];

    if (!relevantDisease) return;

    setAiLoading(prev => ({ ...prev, [job.id]: true }));

    try {
      const subs = await generateAllRoadmapSubTasks({
        jobs: [job],
        disease: {
          label: relevantDisease.label || relevantDisease.id || 'N/A',
          score: relevantDisease.score || 5,
          severity: relevantDisease.severity || 'Trung bình',
        },
        industry,
        industryLabel,
      });

      if (subs[job.id]) {
        setAiSubTasks(prev => ({ ...prev, [job.id]: subs[job.id] }));
      }
    } catch {
      // silent — AI failure falls back to static sub-tasks
    } finally {
      setAiLoading(prev => ({ ...prev, [job.id]: false }));
    }
  }, [diseases, industry, industryLabel]);

  // ── Selected job ──
  const [selectedJob, setSelectedJob] = useState(null);

  // When a job is selected, trigger AI generation for it
  const handleSelectJob = useCallback((job) => {
    setSelectedJob(job);
    if (job) generateForJob(job);
  }, [generateForJob]);

  // ── Filter (4 states: all | in-progress | todo | done) ──
  const [activeFilter, setActiveFilter] = useState('all');

  // ── Total progress ──
  const allSubTasks   = allJobs.flatMap(j => j.subTasks || []);
  const doneCount      = Array.from(statusMap.values()).filter(s => s === 'done').length;
  const totalProgress  = allSubTasks.length > 0
    ? Math.round((doneCount / allSubTasks.length) * 100) : 0;

  // ── Status toggle (cycle: todo → in-progress → done → todo) ──
  const handleToggleStatus = useCallback((subTaskId) => {
    setStatusMap(prev => {
      const next = new Map(prev);
      next.set(subTaskId, nextStatus(prev.get(subTaskId) || 'todo'));
      return next;
    });
  }, []);

  // ── Mark all sub-tasks of a job as done ──
  const handleCompleteAll = useCallback((jobId) => {
    const job = allJobs.find(j => j.id === jobId);
    if (!job) return;
    setStatusMap(prev => {
      const next = new Map(prev);
      for (const st of job.subTasks) next.set(st.id, 'done');
      // Also mark AI sub-tasks done
      const aiSt = aiSubTasks[jobId] || [];
      for (const st of aiSt) next.set(st.id, 'done');
      return next;
    });
  }, [allJobs, aiSubTasks]);

  // ── All sub-tasks for selected job (static + AI) ──
  const selectedJobAllSubTasks = selectedJob
    ? [...(selectedJob.subTasks || []), ...(aiSubTasks[selectedJob.id] || [])]
    : [];

  // ── Phase of selected job ──
  const selectedPhase = selectedJob
    ? roadmap.phases.find(p => p.jobs.some(j => j.id === selectedJob.id))
    : null;

  return (
    <div>
      {/* ── Total Progress Bar ── */}
      <div className="bg-white rounded-[--radius-lg] border border-[#E5E7EB] px-5 py-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0052FF" strokeWidth="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span className="text-label-sm font-semibold text-on-surface uppercase tracking-wide">
              Tiến Độ Tổng
            </span>
          </div>
          <span className="text-body-sm font-semibold text-on-surface">
            {totalProgress}% Hoàn thành
          </span>
        </div>
        <div className="h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${totalProgress}%`,
              background: totalProgress >= 75 ? '#059669' : totalProgress >= 40 ? '#0052FF' : '#BF3003',
            }}
          />
        </div>
        <div className="flex gap-4 mt-2 text-label-xs text-on-surface-variant flex-wrap">
          <span>{doneCount}/{allSubTasks.length} công việc hoàn thành</span>
          <span>·</span>
          <span>{allJobs.length} công việc</span>
          <span>·</span>
          <span>{roadmap.phases.length} giai đoạn</span>
        </div>
      </div>

      {/* ── Split Panel ── */}
      <div className="flex gap-4 items-start">
        {/* Left: Job list (40%) */}
        <div className="w-[40%] shrink-0">
          <JobListPanel
            phases={roadmap.phases}
            selectedJobId={selectedJob?.id}
            onSelectJob={handleSelectJob}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            statusMap={Object.fromEntries(statusMap)}
          />
        </div>

        {/* Right: Job detail (60%) */}
        <div className="flex-1 min-w-0">
          {selectedJob ? (
            <JobDetailPanel
              job={selectedJob}
              phaseColor={selectedPhase?.color || '#0052FF'}
              phaseProjectedMetrics={selectedPhase?.projectedMetrics || []}
              statusMap={Object.fromEntries(statusMap)}
              onToggleStatus={handleToggleStatus}
              onCompleteAll={() => handleCompleteAll(selectedJob.id)}
              // AI sub-tasks
              aiSubTasks={aiSubTasks[selectedJob.id] || []}
              aiLoading={!!aiLoading[selectedJob.id]}
            />
          ) : (
            <div className="bg-white rounded-[--radius-lg] border border-[#E5E7EB] p-12 flex flex-col items-center justify-center min-h-[400px]">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" className="mb-4">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                <line x1="9" y1="12" x2="15" y2="12"/>
                <line x1="9" y1="16" x2="15" y2="16"/>
              </svg>
              <h3 className="text-body-md font-medium text-on-surface mb-1">
                Chọn công việc để xem chi tiết
              </h3>
              <p className="text-body-sm text-on-surface-variant text-center">
                Nhấn vào bất kỳ công việc nào bên trái để xem đầu việc cần làm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

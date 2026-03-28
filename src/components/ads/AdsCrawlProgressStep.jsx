import { useEffect, useRef } from 'react';

/**
 * Step 4 — Progress screen during Ads analysis crawl
 *
 * Props:
 *   progress    (0-100)
 *   statusText  — mô tả trạng thái hiện tại
 *   onComplete  — () => void  — gọi tự động khi progress = 100
 *
 * Demo: tự tăng progress 0→100 trong ~5 giây
 */
export function AdsCrawlProgressStep({
  progress = 0,
  statusText = 'Đang thu thập dữ liệu chiến dịch...',
  onComplete,
}) {
  const hasCompleted = useRef(false);

  // Demo: simulate progress if progress stays at 0
  useEffect(() => {
    if (progress === 0 && !hasCompleted.current) {
      // Will be driven externally via props in real usage
    }
    if (progress >= 100 && !hasCompleted.current) {
      hasCompleted.current = true;
      onComplete?.();
    }
  }, [progress, onComplete]);

  // 8 nhóm bệnh Ads tương ứng
  const diseaseGroups = [
    { id: 'lead-quality',     label: 'Chất lượng Lead',     icon: '🎯',   progress: 0 },
    { id: 'spend-efficiency',label: 'Hiệu quả Chi tiêu',   icon: '💰',   progress: 0 },
    { id: 'roas-health',      label: 'ROAS & Doanh thu',    icon: '📈',   progress: 0 },
    { id: 'campaign-health',  label: 'Sức khỏe Chiến dịch', icon: '🏥',   progress: 0 },
    { id: 'attribution',      label: 'Attribution & CvR',   icon: '🔗',   progress: 0 },
    { id: 'competitor',       label: 'Đối thủ Cạnh tranh',  icon: '⚔️',   progress: 0 },
    { id: 'seasonal',         label: 'Xu hướng Mùa vụ',      icon: '📅',   progress: 0 },
    { id: 'budget-alloc',     label: 'Phân bổ Ngân sách',   icon: '⚖️',   progress: 0 },
  ];

  // Simulate per-group progress based on overall progress
  const groupProgress = (groupIdx) => {
    if (progress === 0) return { status: 'pending', pct: 0 };
    const threshold = (groupIdx / diseaseGroups.length) * 100;
    if (progress <= threshold) {
      return { status: 'pending', pct: 0 };
    }
    const localPct = Math.min(100, ((progress - threshold) / (100 / diseaseGroups.length)) * 100);
    if (localPct >= 100) return { status: 'done', pct: 100 };
    return { status: 'active', pct: Math.round(localPct) };
  };

  const currentGroupIdx = Math.floor((progress / 100) * diseaseGroups.length);
  const currentGroup = diseaseGroups[Math.min(currentGroupIdx, diseaseGroups.length - 1)];

  const processed = Math.round((progress / 100) * 892);   // mock total records
  const total     = 892;
  const remaining = Math.max(0, Math.round((1 - progress / 100) * 8));

  const statusIcon = (status) => {
    if (status === 'done')    return <span className="text-success">✓</span>;
    if (status === 'active') return <span className="text-tertiary animate-pulse">◉</span>;
    return <span className="text-on-surface-variant/30">○</span>;
  };

  const statusLabel = (status, pct) => {
    if (status === 'done') return (
      <span className="text-success text-label-sm">Hoàn thành</span>
    );
    if (status === 'active') return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary rounded-full transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-label-sm text-tertiary whitespace-nowrap">{pct}%</span>
      </div>
    );
    return <span className="text-label-sm text-on-surface-variant/40">Chờ...</span>;
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">📊</span>
        </div>
        <h2 className="text-headline-md text-on-surface font-bold mb-2">
          Đang phân tích chiến dịch quảng cáo...
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Hệ thống đang chẩn đoán 8 nhóm bệnh từ dữ liệu Ads của bạn.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-surface-container-low rounded-[--radius-lg] p-6 mb-6">
        {/* Bar */}
        <div className="h-3 bg-surface-container-high rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-headline-sm font-bold text-on-surface">
              {processed.toLocaleString()}
              <span className="text-body-sm text-on-surface-variant font-normal">/{total.toLocaleString()}</span>
            </div>
            <div className="text-label-sm text-on-surface-variant mt-0.5">Đã xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-headline-sm font-bold text-on-surface">{progress}%</div>
            <div className="text-label-sm text-on-surface-variant mt-0.5">Tiến độ</div>
          </div>
          <div className="text-center">
            <div className="text-headline-sm font-bold text-on-surface">
              ~{remaining}<span className="text-body-sm text-on-surface-variant font-normal">s</span>
            </div>
            <div className="text-label-sm text-on-surface-variant mt-0.5">Còn lại</div>
          </div>
        </div>
      </div>

      {/* Status text */}
      {statusText && (
        <div className="mb-4 text-center text-body-sm text-on-surface-variant">
          {statusText}
        </div>
      )}

      {/* Disease Groups */}
      <div className="bg-surface-container-lowest rounded-[--radius-lg] shadow-[--shadow-sm] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-outline-variant)]/20">
          <h3 className="text-title-sm text-on-surface font-semibold flex items-center gap-2">
            <span>📊</span> Các nhóm phân tích
          </h3>
        </div>
        <div className="divide-y divide-[var(--color-outline-variant)]/10">
          {diseaseGroups.map((group, idx) => {
            const { status, pct } = groupProgress(idx);
            return (
              <div key={group.id} className="px-5 py-3 flex items-center gap-3">
                <span className="text-lg w-6 text-center shrink-0">{group.icon}</span>
                <span className="text-body-sm text-on-surface flex-1">{group.label}</span>
                {statusLabel(status, pct)}
                {statusIcon(status)}
              </div>
            );
          })}
        </div>
      </div>

      {/* Current analyzing label */}
      {currentGroup && progress < 100 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-body-sm text-tertiary bg-tertiary/5 px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            Đang phân tích nhóm "{currentGroup.label}"...
          </div>
        </div>
      )}

      {/* Done */}
      {progress >= 100 && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-body-sm text-success bg-success-container px-4 py-2 rounded-full">
            ✓ Hoàn thành! Đang chuyển sang kết quả...
          </div>
        </div>
      )}
    </div>
  );
}

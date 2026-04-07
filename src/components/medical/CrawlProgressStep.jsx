/**
 * Step 4 — Crawl Progress Screen
 * Shows progress bar + disease groups being analyzed
 */
export function CrawlProgressStep({ progress }) {
  const p = progress || { progress: 0, processed: 0, total: 1000, remainingSec: 60, diseaseGroups: [], currentLabel: '' };

  const statusIcon = (status) => {
    if (status === 'done')   return <span className="text-success">✓</span>;
    if (status === 'active') return <span className="text-tertiary animate-pulse">◉</span>;
    return <span className="text-on-surface-variant/30">○</span>;
  };

  const statusLabel = (status, pct) => {
    if (status === 'done')    return <span className="text-success text-label-sm">Hoàn thành</span>;
    if (status === 'active') return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] rounded-full overflow-hidden">
          <div
            className="h-full bg-tertiary rounded-full transition-all duration-500"
            style={{ width: `${pct || 0}%` }}
          />
        </div>
        <span className="text-label-sm text-tertiary whitespace-nowrap">{pct || 0}%</span>
      </div>
    );
    return <span className="text-label-sm text-on-surface-variant/40">Chờ...</span>;
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4 shadow-[--shadow-sm]">
          <span className="text-3xl">🏥</span>
        </div>
        <h2 className="text-headline-md text-on-surface font-bold mb-2">
          Đang thu thập &amp; phân tích hội thoại...
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Hệ thống đang chẩn đoán 10 nhóm bệnh từ dữ liệu hội thoại của bạn.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] rounded-lg p-6 mb-6 shadow-[--shadow-sm]">
        {/* Bar */}
        <div className="h-3 bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-primary to-tertiary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${p.progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-headline-sm font-bold text-on-surface">
              {p.processed.toLocaleString()}
              <span className="text-body-sm text-on-surface-variant font-normal">
                /{p.total.toLocaleString()}
              </span>
            </div>
            <div className="text-label-sm text-on-surface-variant mt-0.5">Đã xử lý</div>
          </div>
          <div className="text-center">
            <div className="text-headline-sm font-bold text-on-surface">{p.progress}%</div>
            <div className="text-label-sm text-on-surface-variant mt-0.5">Tiến độ</div>
          </div>
          <div className="text-center">
            <div className="text-headline-sm font-bold text-on-surface">
              ~{p.remainingSec}<span className="text-body-sm text-on-surface-variant font-normal">s</span>
            </div>
            <div className="text-label-sm text-on-surface-variant mt-0.5">Còn lại</div>
          </div>
        </div>
      </div>

      {/* Disease Groups */}
      <div className="bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] rounded-lg shadow-[--shadow-sm] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--color-outline-variant)]/30">
          <h3 className="text-title-sm text-on-surface font-semibold flex items-center gap-2">
            <span>🏥</span> Các "bệnh" đang được phân tích
          </h3>
        </div>
        <div className="divide-y divide-[var(--color-outline-variant)]/10">
          {p.diseaseGroups.map(group => (
            <div key={group.id} className="px-5 py-3 flex items-center gap-3">
              <span className="text-lg w-6 text-center shrink-0">{group.icon}</span>
              <span className="text-body-sm text-on-surface flex-1">{group.label}</span>
              {statusLabel(group.status, group.pct)}
              {statusIcon(group.status)}
            </div>
          ))}
        </div>
      </div>

      {/* Current analyzing label */}
      {p.currentLabel && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 text-body-sm text-tertiary bg-tertiary/5 px-4 py-2 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            Đang phân tích nhóm "{p.currentLabel}"...
          </div>
        </div>
      )}
    </div>
  );
}

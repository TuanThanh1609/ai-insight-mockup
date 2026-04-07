import { Pencil, Trash2 } from 'lucide-react';

export function InsightTable({ insights, onView, onDelete }) {
  const statusMap = {
    active: { label: 'Đang chạy', color: 'bg-tertiary-container text-on-tertiary-container' },
    paused: { label: 'Tạm dừng', color: 'bg-warning-container text-on-warning-container' },
  };

  const platformMap = {
    facebook: { label: 'Facebook', color: 'bg-facebook/10 text-facebook' },
    zalo: { label: 'Zalo', color: 'bg-zalo/10 text-zalo' },
    all: { label: 'Tất cả', color: 'bg-primary/10 text-primary' },
  };

  return (
    <div className="w-full flex flex-col">
      {/* Sticky header */}
      <div className="grid grid-cols-[1fr_100px_80px_100px_100px_80px] gap-4 px-4 py-3 bg-surface-container-low rounded-md mb-2 shrink-0">
        <span className="text-xs font-semibold text-on-surface-variant">Tên Insight</span>
        <span className="text-xs font-semibold text-on-surface-variant">Kênh</span>
        <span className="text-xs font-semibold text-on-surface-variant">Cột</span>
        <span className="text-xs font-semibold text-on-surface-variant">Trạng thái</span>
        <span className="text-xs font-semibold text-on-surface-variant">Hội thoại</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">Hành động</span>
      </div>

      {/* Scrollable rows */}
      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {insights.map((insight) => {
          const platform = platformMap[insight.platform] || platformMap.all;
          const status = statusMap[insight.status] || statusMap.active;

          return (
            <div
              key={insight.id}
              onClick={() => onView && onView(insight.id)}
              className="grid grid-cols-[1fr_100px_80px_100px_100px_80px] gap-4 px-4 py-3.5 items-center rounded-md hover:bg-surface-container-low cursor-pointer transition-colors duration-150 group"
            >
              {/* Name */}
              <div>
                <p className="text-sm font-medium text-on-surface">{insight.name}</p>
              </div>

              {/* Platform */}
              <div>
                <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${platform.color}`}>
                  {platform.label}
                </span>
              </div>

              {/* Column count */}
              <span className="text-sm text-on-surface-variant">{insight.columnCount}</span>

              {/* Status */}
              <div>
                <span className={`inline-flex text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Conversations */}
              <span className="text-sm text-on-surface-variant">
                {insight.conversationsCount.toLocaleString('vi-VN')}
              </span>

              {/* Actions — stop propagation so clicking them doesn't open detail */}
              <div
                className="flex items-center justify-end gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="p-1.5 rounded-sm text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                  title="Sửa"
                >
                  <Pencil size={14} />
                </button>
                <button
                  className="p-1.5 rounded-sm text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors cursor-pointer"
                  title="Xóa"
                  onClick={() => onDelete && onDelete(insight.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

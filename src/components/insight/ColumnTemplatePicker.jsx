import { useState } from 'react';
import { Button } from '../ui/Button';
import { ArrowLeft, Check, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ColumnTemplatePicker({ template, onBack, onSave }) {
  const [selectedColumns, setSelectedColumns] = useState(
    template.columns.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {})
  );

  const toggleColumn = (colId) => {
    setSelectedColumns((prev) => {
      if (colId === 'col-1') return prev; // can't uncheck first column
      return { ...prev, [colId]: !prev[colId] };
    });
  };

  const handleSave = () => {
    const selectedCols = template.columns.filter((c) => selectedColumns[c.id]);
    onSave(template, selectedCols);
  };

  const selectedCount = Object.values(selectedColumns).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-6 min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-[--radius-md] text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs text-on-surface-variant">Bước 2 / Chọn cột phân tích</p>
          <h3 className="font-display font-bold text-base text-on-surface">{template.name}</h3>
        </div>
      </div>

      <p className="text-sm text-on-surface-variant">
        Chọn các cột AI sẽ tự động bóc tách từ hội thoại. Cột đầu tiên là bắt buộc.
      </p>

      {/* Column list */}
      <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0">
        {template.columns.map((col) => {
          const isSelected = selectedColumns[col.id];
          const isLocked = col.id === 'col-1';

          return (
            <div
              key={col.id}
              onClick={() => !isLocked && toggleColumn(col.id)}
              className={cn(
                'flex items-start gap-3 p-4 rounded-[--radius-md] cursor-pointer transition-all duration-150',
                isSelected
                  ? 'bg-primary/5 border border-primary/20'
                  : 'bg-surface-container-low hover:bg-surface-container-high',
                isLocked && 'opacity-70 cursor-default'
              )}
            >
              {/* Checkbox */}
              <div
                className={cn(
                  'w-5 h-5 rounded-[4px] border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all duration-150',
                  isSelected
                    ? 'bg-primary border-primary'
                    : 'border-[var(--color-outline-variant)] bg-surface-container-lowest'
                )}
              >
                {isSelected && <Check size={12} className="text-white" />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-base">{col.icon}</span>
                  <span className="text-sm font-semibold text-on-surface">{col.name}</span>
                  {isLocked && (
                    <span className="text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-full">
                      Bắt buộc
                    </span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {col.prompt}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer — pinned to bottom */}
      <div className="flex items-center justify-between pb-0 pt-4 mt-auto border-t border-outline-variant/15">
        <p className="text-xs text-on-surface-variant">
          Đã chọn <span className="font-semibold text-primary">{selectedCount}</span> / {template.columns.length} cột
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            Quay lại
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={selectedCount === 0}>
            <Sparkles size={14} />
            Lưu Template
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Step 3 — Chọn số lượng hội thoại
 */
const QUANTITY_OPTIONS = [
  { value: 1000,  label: '1,000', timeLabel: '~1 phút', description: 'Phù hợp để trải nghiệm' },
  { value: 5000,  label: '5,000', timeLabel: '~5 phút', description: 'Dữ liệu đại diện tốt' },
  { value: 10000, label: '10,000', timeLabel: '~10 phút', description: 'Phân tích toàn diện nhất' },
];

export function QuantitySelectStep({ config, onQuantitySelect, onStart, onBack }) {
  const [selected, setSelected] = useState(config.quantity || 1000);

  const handleStart = () => {
    onQuantitySelect(selected);
    onStart();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-headline-md text-on-surface font-bold mb-2">
        Chọn số lượng hội thoại để khám bệnh
      </h2>
      <p className="text-body-md text-on-surface-variant mb-8">
        Số lượng càng lớn → phân tích càng chính xác, thời gian crawl lâu hơn.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {QUANTITY_OPTIONS.map(opt => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => setSelected(opt.value)}
              className={`
                relative rounded-[--radius-lg] p-6 text-center transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'bg-primary/5 border-2 border-primary shadow-[--shadow-md]'
                  : 'bg-surface-container-lowest border-2 border-transparent hover:border-[var(--color-outline-variant)] hover:shadow-[--shadow-sm]'
                }
              `}
            >
              {/* Radio indicator */}
              <div className={`
                absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                ${isSelected ? 'border-primary bg-primary' : 'border-[var(--color-outline-variant)]'}
              `}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-on-primary" />}
              </div>

              <div className="text-display-sm text-on-surface font-bold mb-1">
                {opt.label}
              </div>
              <div className="text-body-sm text-on-surface-variant mb-1">
                hội thoại
              </div>
              <div className={`
                text-label-sm mt-3 px-2 py-1 rounded-[--radius-full] inline-block
                ${isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-on-surface-variant'}
              `}>
                {opt.timeLabel}
              </div>
              <div className="text-body-sm text-on-surface-variant/70 mt-2">
                {opt.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info note */}
      <div className="bg-surface-container-low rounded-[--radius-md] px-4 py-3 mb-8 flex items-start gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-tertiary shrink-0 mt-0.5">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <p className="text-body-sm text-on-surface-variant">
          Thời gian crawl ước tính dựa trên tốc độ thực. Trong quá trình crawl, bạn sẽ thấy tiến độ phân tích từng nhóm bệnh.
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack} className="gap-1">
          <ChevronLeft size={16} />
          Quay lại
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleStart}
          className="gap-2"
        >
          Bắt đầu Khám
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

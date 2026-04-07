import { useState } from 'react';
import { ChevronLeft, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency } from '../../lib/utils';

/**
 * Step 3 — Chọn khoảng thời gian phân tích
 *
 * Props:
 *   selectedDays  (7|30|90)  — ngày đang chọn
 *   onSelect      (days) => void
 *   campaignCount — số chiến dịch đã chọn
 *   onNext        — () => void
 *   onBack        — () => void
 *   onStartCrawl  — () => void  (gọi khi bấm "Bắt đầu Phân tích")
 */
export function AdsDateRangeStep({
  selectedDays = 30,
  onSelect,
  campaignCount = 0,
  onNext,
  onBack,
  onStartCrawl,
}) {
  const DAY_OPTIONS = [
    {
      value: 7,
      label: '7 ngày',
      icon: Calendar,
      description: 'Phù hợp khi cần xem nhanh xu hướng gần nhất',
      estimate: '~40 đơn hàng',
      orders: 40,
    },
    {
      value: 30,
      label: '30 ngày',
      icon: BarChart3,
      description: 'Dữ liệu đại diện tốt cho phân tích chuẩn',
      estimate: '~180 đơn hàng',
      orders: 180,
    },
    {
      value: 90,
      label: '90 ngày',
      icon: TrendingUp,
      description: 'Phân tích sâu, phát hiện xu hướng dài hạn',
      estimate: '~540 đơn hàng',
      orders: 540,
    },
  ];

  const selected = DAY_OPTIONS.find(o => o.value === selectedDays) || DAY_OPTIONS[1];
  const totalEstimate = selected.orders * Math.max(campaignCount, 1);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-headline-md text-on-surface font-bold mb-2">
          Chọn khoảng thời gian phân tích
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Khoảng thời gian càng dài → phân tích càng chính xác và đầy đủ hơn.
        </p>
      </div>

      {/* Day Range Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {DAY_OPTIONS.map(opt => {
          const isSelected = selectedDays === opt.value;
          const Icon = opt.icon;

          return (
            <button
              key={opt.value}
              onClick={() => onSelect?.(opt.value)}
              className={`
                relative rounded-lg p-6 text-center transition-all duration-200 cursor-pointer
                ${isSelected
                  ? 'bg-tertiary/5 border-2 border-tertiary shadow-[--shadow-md]'
                  : 'bg-surface-container-lowest border-2 border-transparent hover:border-[var(--color-outline-variant)] hover:shadow-[--shadow-sm]'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-tertiary flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4
                ${isSelected ? 'bg-tertiary/10' : 'bg-surface-container-low'}
              `}>
                <Icon size={22} className={isSelected ? 'text-tertiary' : 'text-on-surface-variant'} />
              </div>

              {/* Label */}
              <div className={`
                text-title-sm font-bold mb-1
                ${isSelected ? 'text-tertiary' : 'text-on-surface'}
              `}>
                {opt.label}
              </div>

              {/* Description */}
              <div className="text-label-sm text-on-surface-variant leading-snug mb-3">
                {opt.description}
              </div>

              {/* Estimate chip */}
              <div className={`
                text-label-sm px-2 py-1 rounded-full inline-block
                ${isSelected ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-low text-on-surface-variant'}
              `}>
                {opt.estimate}
              </div>
            </button>
          );
        })}
      </div>

      {/* Estimate Summary */}
      <div className="
        bg-surface-container-low rounded-lg px-5 py-4 mb-8
        flex items-center justify-between flex-wrap gap-3
      ">
        <div className="flex items-center gap-2 text-body-sm text-on-surface">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-tertiary">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          <span>Ước tính:</span>
        </div>
        <div className="text-body-sm text-on-surface">
          <span className="font-semibold text-primary">{campaignCount}</span>
          <span className="text-on-surface-variant"> chiến dịch</span>
          <span className="text-[var(--color-outline-variant)] mx-1">×</span>
          <span className="font-semibold text-primary">{selectedDays}</span>
          <span className="text-on-surface-variant"> ngày</span>
          <span className="text-[var(--color-outline-variant)] mx-1">=</span>
          <span className="font-semibold text-success">~{totalEstimate.toLocaleString()} đơn hàng</span>
        </div>
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
          onClick={() => {
            onStartCrawl?.();
            onNext?.();
          }}
          className="gap-2"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3v18h18"/>
            <path d="m19 9-5 5-4-4-3 3"/>
          </svg>
          Bắt đầu Phân tích
          <ChevronLeft size={16} className="rotate-180" />
        </Button>
      </div>
    </div>
  );
}

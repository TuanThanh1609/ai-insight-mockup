import { Check, Circle } from 'lucide-react';

/**
 * Ads Wizard Step Indicator — 4 bước
 *
 * Props:
 *   currentStep  (1-4)  — step đang active
 *   onStepClick(step)   — click vào step để quay lại
 */
export function AdsWizardSteps({ currentStep = 1, onStepClick }) {
  const STEPS = [
    { id: 1, label: 'Kết nối Ads' },
    { id: 2, label: 'Chọn chiến dịch' },
    { id: 3, label: 'Khoảng thời gian' },
    { id: 4, label: 'Kết quả' },
  ];

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, idx) => {
        const isDone   = step.id < currentStep;
        const isActive = step.id === currentStep;
        const isPending = step.id > currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1 min-w-0">
            {/* Step pill */}
            <button
              type="button"
              onClick={() => isDone && onStepClick?.(step.id)}
              disabled={isPending}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap
                ${isDone   ? 'bg-secondary text-on-secondary hover:bg-secondary/80' : ''}
                ${isActive ? 'bg-primary text-on-primary' : ''}
                ${isPending ? 'bg-surface-container-low text-on-surface-variant/40 cursor-not-allowed' : ''}
              `}
            >
              {/* Icon */}
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                {isDone ? (
                  <Check size={11} strokeWidth={3} />
                ) : isActive ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                ) : (
                  <Circle size={11} strokeWidth={2} />
                )}
              </div>

              {/* Label */}
              <span className={`
                text-label-sm hidden sm:block
                ${isActive ? 'font-semibold' : ''}
              `}>
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className={`
                flex-1 h-px mx-2 min-w-3
                ${isDone ? 'bg-secondary/50' : 'bg-[var(--color-outline-variant)]'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
}

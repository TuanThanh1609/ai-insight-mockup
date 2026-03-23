import { cn } from '../../lib/utils';

export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn(
      'flex gap-1 p-1 bg-surface-container-low rounded-[--radius-md] overflow-x-auto snap-x',
      '[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]',
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-none snap-start px-3 py-1.5 text-sm font-medium rounded-[--radius-sm] transition-all duration-150 cursor-pointer whitespace-nowrap',
            activeTab === tab.value
              ? 'bg-surface-container-lowest text-on-surface shadow-[0_1px_3px_rgba(44,52,55,0.08)]'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

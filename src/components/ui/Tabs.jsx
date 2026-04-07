import { cn } from '../../lib/utils';

/**
 * Tabs — Ultra Soft Identity
 *
 * Active tab: gradient card fill + soft shadow — elevated look
 * Inactive: tonal shift only (no border)
 * Border radius: 10px (--radius-md) for pill tab feel
 * Container: 12px radius (--radius-lg)
 */
export function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn(
      'flex gap-1.5 p-1.5',
      'bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee]',
      'rounded-lg',
      'overflow-x-auto snap-x',
      '[&::-webkit-scrollbar]:hidden',
      '[-ms-overflow-style:none]',
      '[scrollbar-width:none]',
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            // Base
            'flex-none snap-start px-4 py-2 text-sm font-medium',
            'rounded-md',
            'transition-all duration-150 cursor-pointer whitespace-nowrap',
            // Active: ultra soft card fill + shadow
            activeTab === tab.value
              ? 'bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] text-on-surface shadow-[--shadow-sm] font-semibold'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-[rgba(255,255,255,0.50)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

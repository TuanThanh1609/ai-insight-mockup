import { cn } from '../../lib/utils';

/**
 * Tabs — Editorial Precision Design System
 *
 * Active tab: elevated (surface_container_lowest) + ambient shadow
 * Inactive: tonal shift only (no border)
 * Border radius: 8px (DEFAULT)
 */
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
            // Base
            'flex-none snap-start px-4 py-2 text-sm font-medium rounded-[--radius-md] transition-all duration-150 cursor-pointer whitespace-nowrap',
            // Active: elevated + ambient shadow
            activeTab === tab.value
              ? 'bg-surface-container-lowest text-on-surface shadow-[--shadow-sm]'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

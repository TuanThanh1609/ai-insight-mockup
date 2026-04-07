import { DISEASE_GROUPS } from '../../lib/medicalService';
import { cn } from '../../lib/utils';

/**
 * MedicalFilterTabs — Ultra Soft Identity
 * Filter diseases by group code
 * Active: gradient dark navy pill. Inactive: soft gradient lavender pill.
 */
export function MedicalFilterTabs({ activeFilter, onFilterChange, diseaseCounts }) {
  const tabs = [
    { value: 'all', label: 'Tất cả', code: 'ALL' },
    ...DISEASE_GROUPS.map(g => ({ value: g.id, label: g.label, code: g.code })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {tabs.map(tab => {
        const isActive = activeFilter === tab.value;
        const count = diseaseCounts?.[tab.value] ?? null;

        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              'flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-label-sm whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0',
              isActive
                ? 'bg-gradient-to-br from-[#1A2138] to-[#2b3354] text-white shadow-[--shadow-sm]'
                : 'bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] text-on-surface-variant hover:from-white hover:to-[#faf7fc] hover:text-on-surface'
            )}
          >
            <span>{tab.label}</span>
            {count !== null && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-white/20 text-white' : 'bg-[rgba(26,33,56,0.08)] text-on-surface-variant'
              )}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

import { DISEASE_GROUPS } from '../../lib/medicalService';
import { cn } from '../../lib/utils';

/**
 * MedicalFilterTabs — Filter diseases by group code
 * Design: pill-style tabs, no borders (Editorial Precision)
 */
export function MedicalFilterTabs({ activeFilter, onFilterChange, diseaseCounts }) {
  const tabs = [
    { value: 'all', label: 'Tất cả', code: 'ALL' },
    ...DISEASE_GROUPS.map(g => ({ value: g.id, label: g.label, code: g.code })),
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {tabs.map(tab => {
        const isActive = activeFilter === tab.value;
        const count = diseaseCounts?.[tab.value] ?? null;

        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0',
              isActive
                ? 'bg-primary text-on-primary shadow-[--shadow-sm]'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            )}
          >
            <span>{tab.label}</span>
            {count !== null && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-on-primary/20 text-on-primary' : 'bg-surface-container-high text-on-surface-variant'
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

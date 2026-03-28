import { cn } from '../../lib/utils';

/**
 * AdsFilterTabs — Filter diseases by group for Ads Dashboard
 * Design: pill-style tabs, no borders (Editorial Precision)
 */
export function AdsFilterTabs({ diseases = [], activeFilter = 'all', onFilterChange }) {
  const tabs = [
    { value: 'all',              label: 'Tất cả',   code: 'ALL' },
    { value: 'roas-health',       label: 'ROAS',      code: 'RA' },
    { value: 'attribution-quality', label: 'Attribution', code: 'AQ' },
    { value: 'ad-creative',       label: 'Creative',  code: 'AC' },
    { value: 'audience-targeting', label: 'Target',    code: 'AT' },
    { value: 'budget-allocation', label: 'Ngân sách', code: 'BA' },
    { value: 'platform-performance', label: 'Platform',  code: 'PP' },
    { value: 'lead-order-conversion', label: 'Conv',    code: 'LC' },
    { value: 'junk-campaigns',    label: 'Rác',       code: 'CR' },
  ];

  // Count diseases per filter tab (diseases is already sorted worst-first)
  const diseaseCounts = {};
  for (const d of diseases) {
    diseaseCounts[d.id] = 1;
  }
  diseaseCounts.all = diseases.length;

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {tabs.map(tab => {
        const isActive = activeFilter === tab.value;
        const count = diseaseCounts[tab.value] ?? null;

        return (
          <button
            key={tab.value}
            onClick={() => onFilterChange(tab.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-label-sm whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0',
              isActive
                ? 'bg-tertiary text-on-tertiary shadow-[--shadow-sm]'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            )}
          >
            <span>{tab.label}</span>
            {count !== null && (
              <span className={cn(
                'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                isActive ? 'bg-on-tertiary/20 text-on-tertiary' : 'bg-surface-container-high text-on-surface-variant'
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

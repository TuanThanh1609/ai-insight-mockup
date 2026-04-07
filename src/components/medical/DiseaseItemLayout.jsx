import { DiseaseCard } from './DiseaseCard';
import { CriticalAlertsPanel } from './CriticalAlertsPanel';
import { SmaxRecommendationsPanel } from './SmaxRecommendationsPanel';

/**
 * DiseaseItemLayout
 * Per-item split layout:
 * - Left 2/3: DiseaseCard (tabs Tổng quan/Chi tiết)
 * - Right 1/3: Cảnh báo + Gợi ý Smax for the SAME disease
 *
 * Right panel is ALWAYS visible (as requested).
 */
export function DiseaseItemLayout({
  disease,
  conversations,
  isExpanded,
  onToggleExpand,
  onToggleAction,
  savedActionIds,
  industry,
  industryLabel,
}) {
  return (
    <div id={`disease-${disease.id}`} className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
      {/* Left 2/3 */}
      <div className="xl:col-span-2 min-w-0">
        <DiseaseCard
          disease={disease}
          conversations={conversations}
          isExpanded={isExpanded}
          isSaved={disease.savedActionIds?.length > 0}
          onToggleAction={onToggleAction}
          onToggleExpand={onToggleExpand}
        />
      </div>

      {/* Right 1/3 — always visible */}
      <div className="xl:col-span-1 min-w-0 flex flex-col gap-3">
        <div className="bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] rounded-lg p-4 shadow-[--shadow-sm]">
          <CriticalAlertsPanel diseases={[disease]} conversations={conversations} />
        </div>

        <div className="bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5] rounded-lg p-4 shadow-[--shadow-sm]">
          <SmaxRecommendationsPanel
            diseases={[disease]}
            savedActionIds={savedActionIds}
            onToggleAction={(action) => onToggleAction(disease.id, action.id, action)}
            industry={industry}
            industryLabel={industryLabel}
            conversations={conversations}
          />
        </div>
      </div>
    </div>
  );
}

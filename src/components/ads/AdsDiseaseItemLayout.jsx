import { AdsDiseaseCard } from './AdsDiseaseCard';
import { AdsCriticalAlertsPanel } from './AdsCriticalAlertsPanel';
import { AdsSmaxRecommendationsPanel } from './AdsSmaxRecommendationsPanel';

/**
 * AdsDiseaseItemLayout — 2/3 + 1/3 split for each ads disease group
 * - Left 2/3: AdsDiseaseCard (tabs Tổng quan / Diễn giải / Chi tiết)
 * - Right 1/3: AdsCriticalAlertsPanel + AdsSmaxRecommendationsPanel
 *
 * Mirrors src/components/medical/DiseaseItemLayout.jsx
 */
export function AdsDiseaseItemLayout({
  disease,
  attributionData = [],
  campaigns = [],
  savedActionIds = [],
  onSaveAction,
  onRemoveAction,
  defaultExpanded = false,
}) {
  return (
    <div id={`ads-disease-${disease.id}`} className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
      {/* Left 2/3 */}
      <div className="xl:col-span-2 min-w-0">
        <AdsDiseaseCard
          disease={disease}
          attributionData={attributionData}
          campaigns={campaigns}
          savedActionIds={savedActionIds}
          onSaveAction={onSaveAction}
          onRemoveAction={onRemoveAction}
          defaultExpanded={defaultExpanded}
        />
      </div>

      {/* Right 1/3 */}
      <div className="xl:col-span-1 min-w-0 flex flex-col gap-3">
        {/* Critical Alerts */}
        <div className="bg-surface-container-low rounded-[--radius-lg] p-4">
          <AdsCriticalAlertsPanel
            diseases={[disease]}
            attributionData={attributionData}
            maxAlerts={5}
          />
        </div>

        {/* Smax Recommendations */}
        <div className="bg-surface-container-low rounded-[--radius-lg] p-4">
          <AdsSmaxRecommendationsPanel
            disease={disease}
            recommendations={disease.recommendations || []}
            savedActionIds={savedActionIds}
            onSaveAction={onSaveAction}
            onRemoveAction={onRemoveAction}
            industry="ads"
          />
        </div>
      </div>
    </div>
  );
}

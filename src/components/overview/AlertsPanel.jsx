import RuleCommentary from './RuleCommentary';
import { CriticalAlertsPanel } from '../medical/CriticalAlertsPanel';

/**
 * AlertsPanel — Cảnh báo khẩn (expandable conversations) + Rule Commentary
 * Layout: stacked, chiếm 1/5 page width
 */
export default function AlertsPanel({ conversations = [], diseases = [], industry = 'thoi-trang' }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Cảnh báo khẩn — expandable rows with conversation examples */}
      <CriticalAlertsPanel diseases={diseases} conversations={conversations} />

      {/* Rule Commentary */}
      <div className="flex-1 min-h-0">
        <RuleCommentary conversations={conversations} industry={industry} />
      </div>
    </div>
  );
}

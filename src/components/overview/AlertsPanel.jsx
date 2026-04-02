import { Card } from '../ui/Card';
import { CriticalAlertsPanel } from '../medical/CriticalAlertsPanel';
import RuleCommentary from './RuleCommentary';

/**
 * AlertsPanel — Cảnh báo khẩn + Hybrid Rule Commentary
 *
 * Props:
 *  - conversations: pre-loaded conversations array (from parent to avoid duplicate loading)
 *  - diseases: pre-computed diseases (from parent via computeDiagnosis)
 *  - industry: industry label for AI commentary
 */
export default function AlertsPanel({ conversations = [], diseases = [], industry = 'thoi-trang' }) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Cảnh báo khẩn */}
      <div className="flex-1">
        <CriticalAlertsPanel diseases={diseases} conversations={conversations} />
      </div>

      {/* Hybrid Rule Commentary tổng hợp */}
      <Card className="p-4">
        <RuleCommentary conversations={conversations} industry={industry} />
      </Card>
    </div>
  );
}

import { Card } from '../ui/Card';
import RuleCommentary from './RuleCommentary';
import { AlertTriangle } from 'lucide-react';

/**
 * AlertsPanel — Compact: Cảnh báo khẩn (compact) + Rule Commentary
 * Layout: stacked, chiếm 1/5 page width
 */
export default function AlertsPanel({ conversations = [], diseases = [], industry = 'thoi-trang' }) {
  // Compact list: top 6 alerts from diseases, sorted by severity
  const topAlerts = diseases
    .filter((d) => d.score < 5)
    .sort((a, b) => a.score - b.score)
    .slice(0, 6);

  const SEVERITY_COLOR = {
    critical: '#dc2626',
    high: '#d97706',
    medium: '#1877F2',
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Cảnh báo khẩn — compact stacked */}
      <Card className="p-3 flex flex-col gap-0">
        <div className="flex items-center gap-1.5 mb-2">
          <AlertTriangle size={13} className="text-[#dc2626]" />
          <span className="text-[12px] font-semibold text-primary">Cảnh Báo Khẩn</span>
          {topAlerts.length > 0 && (
            <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-[#dc2626]/10 text-[#dc2626]">
              {topAlerts.length}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          {topAlerts.length > 0 ? topAlerts.map((d) => {
            const color = SEVERITY_COLOR[d.severity] || '#dc2626';
            return (
              <div key={d.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-[11px] text-primary flex-1 truncate">{d.label}</span>
                <span className="text-[10px] font-semibold shrink-0" style={{ color }}>
                  {d.score}/10
                </span>
                <span className="text-[10px] text-primary opacity-40 shrink-0">▼</span>
              </div>
            );
          }) : (
            <p className="text-[11px] text-primary opacity-40 italic text-center py-3">
              Không có cảnh báo khẩn
            </p>
          )}
        </div>
      </Card>

      {/* Rule Commentary — compact */}
      <div className="flex-1 min-h-0">
        <RuleCommentary conversations={conversations} industry={industry} />
      </div>
    </div>
  );
}

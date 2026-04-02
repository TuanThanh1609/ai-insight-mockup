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
    <div className="flex flex-col gap-4 h-full">
      {/* Cảnh báo khẩn — prominent card */}
      <Card className="p-4 flex flex-col gap-0">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={15} className="text-[#dc2626]" />
          <h3 className="text-[13px] font-semibold text-primary">Cảnh Báo Khẩn</h3>
          {topAlerts.length > 0 && (
            <span className="ml-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#dc2626]/10 text-[#dc2626]">
              {topAlerts.length}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          {topAlerts.length > 0 ? topAlerts.map((d) => {
            const color = SEVERITY_COLOR[d.severity] || '#dc2626';
            return (
              <div key={d.id} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-primary font-medium">{d.label}</p>
                  <p className="text-[11px] text-primary opacity-40 mt-0.5">{d.keyConcern}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[12px] font-semibold" style={{ color }}>
                    {d.score}/10
                  </span>
                  <span className="text-[11px] text-primary opacity-30">▼</span>
                </div>
              </div>
            );
          }) : (
            <p className="text-[12px] text-primary opacity-40 italic text-center py-4">
              Không có cảnh báo khẩn
            </p>
          )}
        </div>
      </Card>

      {/* Rule Commentary */}
      <div className="flex-1 min-h-0">
        <RuleCommentary conversations={conversations} industry={industry} />
      </div>
    </div>
  );
}

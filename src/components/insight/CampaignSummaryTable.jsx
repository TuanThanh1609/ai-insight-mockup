import { cn, formatCurrency, formatNumber, formatPercent, formatRoas } from '../../lib/utils';
import { Badge } from '../ui/Badge';

/**
 * CampaignSummaryTable — Tổng quan chiến dịch
 *
 * 8 cột: Chiến dịch | Chi tiêu | Hội thoại | Chuyển đổi | Doanh thu | ROAS | Đơn | Chất lượng
 * Click dòng → mở AIInsightPanel
 */
function QualityBadge({ score }) {
  if (score >= 70) return <Badge variant="success" size="sm">{score}</Badge>;
  if (score >= 40) return <Badge variant="warning" size="sm">{score}</Badge>;
  return <Badge variant="danger" size="sm">{score}</Badge>;
}

function RoasCell({ revenue, spend }) {
  const roas = spend > 0 ? revenue / spend : 0;
  const colorClass =
    roas >= 3 ? 'text-[#059669]' : roas >= 1.5 ? 'text-[#d97706]' : 'text-[#dc2626]';
  return (
    <span className={cn('text-sm font-semibold', colorClass)}>
      {formatRoas(revenue, spend)}
    </span>
  );
}

export function CampaignSummaryTable({ campaigns, onSelectCampaign }) {
  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="grid grid-cols-[1fr_100px_90px_80px_110px_80px_70px_90px] gap-3 px-4 py-3 bg-surface-container-low rounded-[--radius-md]">
        <span className="text-xs font-semibold text-on-surface-variant">Chiến dịch</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">Chi tiêu</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">Hội thoại</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">CvR</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">Doanh thu</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">ROAS</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">Đơn</span>
        <span className="text-xs font-semibold text-on-surface-variant text-center">Chất lượng</span>
      </div>

      {/* Rows */}
      {campaigns.map((camp) => {
        const isPaused = camp.status === 'paused';

        return (
          <div
            key={camp.id}
            className={cn(
              'grid grid-cols-[1fr_100px_90px_80px_110px_80px_70px_90px] gap-3 px-4 py-3 items-center rounded-[--radius-md] transition-colors duration-150 cursor-pointer',
              'hover:bg-surface-container-low',
              isPaused && 'opacity-60'
            )}
            onClick={() => onSelectCampaign && onSelectCampaign(camp)}
          >
            {/* Campaign name + platform */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-on-surface truncate">{camp.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge platform={camp.platform} size="sm">
                    {camp.platform === 'facebook' ? 'FB' : 'Zalo'}
                  </Badge>
                  {isPaused && (
                    <span className="text-[10px] text-on-surface-variant">· Tạm dừng</span>
                  )}
                </div>
              </div>
            </div>

            {/* Spend */}
            <span className="text-sm text-on-surface font-medium text-right">
              {formatCurrency(camp.spend)}
            </span>

            {/* Conversations */}
            <span className="text-sm text-on-surface text-right">
              {formatNumber(camp.conversations)}
            </span>

            {/* Conversion rate */}
            <span className="text-sm text-on-surface text-right">
              {formatPercent(camp.conversionRate)}
            </span>

            {/* Doanh thu */}
            <span className="text-sm text-on-surface font-medium text-right">
              {formatCurrency(camp.revenue)}
            </span>

            {/* ROAS */}
            <RoasCell revenue={camp.revenue} spend={camp.spend} />

            {/* Orders */}
            <span className="text-sm text-on-surface text-right">
              {formatNumber(camp.ordersCount)}
            </span>

            {/* Quality score */}
            <div className="flex justify-center">
              <QualityBadge score={camp.qualityScore} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

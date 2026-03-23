import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn, formatCurrency, formatNumber, formatPercent, formatRoas } from '../../lib/utils';
import { Sparkles, ChevronRight } from 'lucide-react';

const aiActionConfig = {
  increase: { label: 'Tăng', color: 'bg-tertiary-container text-on-tertiary-container', icon: '↑' },
  decrease: { label: 'Giảm', color: 'bg-error-container text-on-error-container', icon: '↓' },
  keep: { label: 'Giữ', color: 'bg-warning-container text-on-warning-container', icon: '↔' },
  pause: { label: 'Tắt', color: 'bg-surface-container-high text-on-surface-variant', icon: '⏸' },
};

function QualityBadge({ score }) {
  if (score >= 70) {
    return <Badge variant="success" size="sm">{score}</Badge>;
  }
  if (score >= 40) {
    return <Badge variant="warning" size="sm">{score}</Badge>;
  }
  return <Badge variant="danger" size="sm">{score}</Badge>;
}

function RoasCell({ revenue, spend }) {
  const roas = spend > 0 ? revenue / spend : 0;
  const colorClass = roas >= 3
    ? 'text-[#059669]'
    : roas >= 1.5
    ? 'text-[#d97706]'
    : 'text-[#dc2626]';
  return (
    <span className={cn('text-sm font-semibold', colorClass)}>
      {formatRoas(revenue, spend)}
    </span>
  );
}

export function CampaignTable({ campaigns, onSelectCampaign }) {
  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="grid grid-cols-[1fr_90px_80px_80px_95px_70px_70px_80px_100px_100px_60px] gap-3 px-4 py-3 bg-surface-container-low rounded-[--radius-md]">
        <span className="text-xs font-semibold text-on-surface-variant">Chiến dịch</span>
        <span className="text-xs font-semibold text-on-surface-variant">Chi tiêu</span>
        <span className="text-xs font-semibold text-on-surface-variant">Hội thoại</span>
        <span className="text-xs font-semibold text-on-surface-variant">Chuyển đổi</span>
        <span className="text-xs font-semibold text-on-surface-variant">Doanh thu</span>
        <span className="text-xs font-semibold text-on-surface-variant">ROAS</span>
        <span className="text-xs font-semibold text-on-surface-variant">Đơn</span>
        <span className="text-xs font-semibold text-on-surface-variant">Chất lượng</span>
        <span className="text-xs font-semibold text-on-surface-variant">AI Gợi ý</span>
        <span className="text-xs font-semibold text-on-surface-variant text-right">Hành động</span>
        <span />
      </div>

      {/* Rows */}
      {campaigns.map((camp) => {
        const aiConfig = aiActionConfig[camp.aiAction] || aiActionConfig.keep;
        const isPaused = camp.status === 'paused';

        return (
          <div
            key={camp.id}
            className={cn(
              'grid grid-cols-[1fr_90px_80px_80px_95px_70px_70px_80px_100px_100px_60px] gap-3 px-4 py-3.5 items-center rounded-[--radius-md] hover:bg-surface-container-low transition-colors duration-150 cursor-pointer',
              isPaused && 'opacity-60'
            )}
            onClick={() => onSelectCampaign && onSelectCampaign(camp)}
          >
            {/* Campaign name + platform */}
            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{camp.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Badge platform={camp.platform} size="sm">
                    {camp.platform === 'facebook' ? 'Facebook' : 'Zalo'}
                  </Badge>
                  {isPaused && (
                    <span className="text-[10px] text-on-surface-variant">· Tạm dừng</span>
                  )}
                </div>
              </div>
            </div>

            {/* Spend */}
            <span className="text-sm text-on-surface font-medium">
              {formatCurrency(camp.spend)}
            </span>

            {/* Conversations */}
            <span className="text-sm text-on-surface">
              {formatNumber(camp.conversations)}
            </span>

            {/* Conversion */}
            <span className="text-sm text-on-surface">
              {formatPercent(camp.conversionRate)}
            </span>

            {/* Doanh thu */}
            <span className="text-sm text-on-surface font-medium">
              {formatCurrency(camp.revenue)}
            </span>

            {/* ROAS */}
            <RoasCell revenue={camp.revenue} spend={camp.spend} />

            {/* Orders */}
            <span className="text-sm text-on-surface">
              {formatNumber(camp.ordersCount)}
            </span>

            {/* Quality score */}
            <QualityBadge score={camp.qualityScore} />

            {/* AI suggestion */}
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-primary shrink-0" />
              <span className={cn('inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full', aiConfig.color)}>
                {aiConfig.icon} {aiConfig.label}
              </span>
            </div>

            {/* Action */}
            <div className="flex items-center justify-end">
              <Button variant="ghost" size="icon" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onSelectCampaign && onSelectCampaign(camp); }}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

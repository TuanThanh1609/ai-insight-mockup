import { useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn, formatCurrency, formatNumber, formatPercent, formatRoas } from '../../lib/utils';
import { Sparkles, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Minus, AlertOctagon } from 'lucide-react';

/**
 * CampaignTable — với expandable AI Action Row
 *
 * Theo paid-ads skill: optimization levers, action buttons.
 * Expandable row: click chevron → hiện lý do AI + 2 nút hành động.
 */
const aiActionConfig = {
  increase: {
    label: 'Tăng',
    color: 'bg-tertiary-container text-on-tertiary-container',
    icon: TrendingUp,
    btnColor: 'success',
  },
  decrease: {
    label: 'Giảm',
    color: 'bg-error-container text-on-error-container',
    icon: TrendingDown,
    btnColor: 'danger',
  },
  keep: {
    label: 'Giữ',
    color: 'bg-warning-container text-on-warning-container',
    icon: Minus,
    btnColor: 'warning',
  },
  pause: {
    label: 'Tắt',
    color: 'bg-surface-container-high text-on-surface-variant',
    icon: AlertOctagon,
    btnColor: 'danger',
  },
};

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

function ConfirmModal({ campaign, action, onConfirm, onCancel }) {
  const isIncrease = action === 'increase';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-on-surface/30" onClick={onCancel} />
      <div className="relative bg-surface-container-lowest rounded-[--radius-lg] p-6 w-[340px] shadow-2xl">
        <h3 className="font-display font-bold text-base text-on-surface mb-2">
          Xác nhận hành động
        </h3>
        <p className="text-sm text-on-surface-variant mb-4">
          {isIncrease ? (
            <>
              Bạn có chắc muốn <span className="font-semibold text-[#059669]">tăng ngân sách +20%</span>{' '}
              cho chiến dịch{' '}
              <span className="font-semibold">{campaign.name}</span>?
            </>
          ) : (
            <>
              Bạn có chắc muốn{' '}
              <span className="font-semibold text-[#dc2626]">tắt chiến dịch</span>{' '}
              <span className="font-semibold">{campaign.name}</span>?
            </>
          )}
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1 justify-center"
            onClick={onCancel}
          >
            Hủy
          </Button>
          <Button
            variant={isIncrease ? 'primary' : 'danger'}
            className="flex-1 justify-center"
            onClick={onConfirm}
          >
            {isIncrease ? 'Tăng +20%' : 'Tắt ngay'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AIActionRow({ campaign, insight, aiConfig }) {
  const [pendingAction, setPendingAction] = useState(null);

  const handleConfirm = (action) => {
    console.log(
      `[AI Action] ${action === 'increase' ? 'TĂNG +20%' : 'TẮT'} chiến dịch:`,
      campaign.name,
      '| Budget hiện tại:',
      formatCurrency(campaign.budget)
    );
    setPendingAction(null);
  };

  const ActionIcon = aiConfig.icon;

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-3 bg-surface-container-low rounded-b-[--radius-md] border-t border-surface-container-high">
        {/* Icon */}
        <div className="mt-0.5">
          <ActionIcon
            size={14}
            className={
              aiConfig.btnColor === 'success'
                ? 'text-[#059669]'
                : aiConfig.btnColor === 'danger'
                ? 'text-[#dc2626]'
                : 'text-[#d97706]'
            }
          />
        </div>

        {/* AI insight text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[11px] text-on-surface font-medium leading-snug">
              <Sparkles size={10} className="inline text-primary mr-1" />
              {insight?.recommendation || 'Chưa có phân tích AI.'}
            </p>
          </div>

          {/* Confidence bar */}
          {insight?.confidence && (
            <div className="flex items-center gap-2 mb-2">
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden flex-1 max-w-[120px]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${insight.confidence}%`,
                    background:
                      insight.confidence >= 90
                        ? '#059669'
                        : insight.confidence >= 70
                        ? '#d97706'
                        : '#dc2626',
                  }}
                />
              </div>
              <span className="text-[10px] text-on-surface-variant">
                Độ tin cậy {insight.confidence}%
              </span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {(aiConfig.label === 'Tăng' || aiConfig.label === 'Giữ') && (
              <Button
                variant="primary"
                size="sm"
                className="text-xs h-7"
                onClick={() => setPendingAction('increase')}
              >
                <TrendingUp size={12} />
                Tăng +20%
              </Button>
            )}
            {(aiConfig.label === 'Giảm' || aiConfig.label === 'Tắt') && (
              <Button
                variant="danger"
                size="sm"
                className="text-xs h-7"
                onClick={() => setPendingAction('pause')}
              >
                <AlertOctagon size={12} />
                Tắt ngay
              </Button>
            )}
            <span className="text-[10px] text-on-surface-variant">
              Mở Ads Manager để thực hiện
            </span>
          </div>
        </div>
      </div>

      {pendingAction && (
        <ConfirmModal
          campaign={campaign}
          action={pendingAction}
          onConfirm={() => handleConfirm(pendingAction)}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </>
  );
}

export function CampaignTable({ campaigns, onSelectCampaign }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="grid grid-cols-[1fr_90px_80px_80px_95px_70px_70px_80px_100px_60px_40px] gap-3 px-4 py-3 bg-surface-container-low rounded-[--radius-md]">
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
        const isExpanded = expandedId === camp.id;

        return (
          <div key={camp.id} className="flex flex-col rounded-[--radius-md] overflow-hidden">
            {/* Main row */}
            <div
              className={cn(
                'grid grid-cols-[1fr_90px_80px_80px_95px_70px_70px_80px_100px_60px_40px] gap-3 px-4 py-3 items-center transition-colors duration-150',
                'hover:bg-surface-container-low cursor-pointer',
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
              <span className="text-sm text-on-surface">{formatNumber(camp.conversations)}</span>

              {/* Conversion */}
              <span className="text-sm text-on-surface">{formatPercent(camp.conversionRate)}</span>

              {/* Doanh thu */}
              <span className="text-sm text-on-surface font-medium">
                {formatCurrency(camp.revenue)}
              </span>

              {/* ROAS */}
              <RoasCell revenue={camp.revenue} spend={camp.spend} />

              {/* Orders */}
              <span className="text-sm text-on-surface">{formatNumber(camp.ordersCount)}</span>

              {/* Quality score */}
              <QualityBadge score={camp.qualityScore} />

              {/* AI suggestion */}
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-primary shrink-0" />
                <span
                  className={cn(
                    'inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full',
                    aiConfig.color
                  )}
                >
                  {aiConfig.label}
                </span>
              </div>

              {/* Actions + Expand */}
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(camp.id);
                  }}
                >
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </div>

              <div />
            </div>

            {/* Expandable AI Action Row */}
            {isExpanded && (
              <AIActionRow
                campaign={camp}
                aiConfig={aiConfig}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

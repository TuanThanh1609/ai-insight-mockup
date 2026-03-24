import { useState } from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, AlertOctagon, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn, formatCurrency, formatNumber } from '../../lib/utils';

/**
 * CampaignOptimizationTable — Gợi ý tối ưu chiến dịch
 *
 * 4 cột: Chiến dịch | AI Gợi ý | Phân tích chi tiết | Hành động
 * Expandable row: click → hiện lý do đầy đủ + nút thao tác
 */
const aiActionConfig = {
  increase: {
    label: 'Tăng',
    color: 'bg-tertiary-container text-on-tertiary-container',
    icon: TrendingUp,
    iconColor: 'text-[#059669]',
    btnVariant: 'primary',
    btnLabel: '+20%',
    confidenceColor: '#059669',
  },
  decrease: {
    label: 'Giảm',
    color: 'bg-error-container text-on-error-container',
    icon: TrendingDown,
    iconColor: 'text-[#dc2626]',
    btnVariant: 'danger',
    btnLabel: 'Tắt',
    confidenceColor: '#dc2626',
  },
  keep: {
    label: 'Giữ',
    color: 'bg-warning-container text-on-warning-container',
    icon: Minus,
    iconColor: 'text-[#d97706]',
    btnVariant: 'secondary',
    btnLabel: 'Giữ nguyên',
    confidenceColor: '#d97706',
  },
  pause: {
    label: 'Tắt',
    color: 'bg-surface-container-high text-on-surface-variant',
    icon: AlertOctagon,
    iconColor: 'text-[#dc2626]',
    btnVariant: 'danger',
    btnLabel: 'Tắt ngay',
    confidenceColor: '#dc2626',
  },
};

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
              cho chiến dịch <span className="font-semibold">{campaign.name}</span>?
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
          <Button variant="primary" className="flex-1 justify-center" onClick={onCancel}>
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

function ExpandableRow({ campaign, insight, aiConfig }) {
  const [expanded, setExpanded] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const ActionIcon = aiConfig.icon;

  const handleConfirm = (action) => {
    console.log(
      `[AI Action] ${action === 'increase' ? 'TĂNG +20%' : 'TẮT'} chiến dịch:`,
      campaign.name,
      '| Budget hiện tại:',
      formatCurrency(campaign.budget)
    );
    setPendingAction(null);
  };

  return (
    <>
      <div className="flex items-start gap-3 px-4 py-3 bg-surface-container-low rounded-b-[--radius-md] border-t border-surface-container-high transition-all duration-200">
        {/* AI icon */}
        <div className="mt-0.5">
          <ActionIcon size={14} className={aiConfig.iconColor} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Recommendation text */}
          <p className="text-[11px] text-on-surface font-medium leading-snug">
            <Sparkles size={10} className="inline text-primary mr-1" />
            {insight?.recommendation || 'Chưa có phân tích AI.'}
          </p>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-surface-container-lowest rounded-[--radius-sm] p-2 text-center">
              <p className="text-[10px] text-on-surface-variant">Junk rate</p>
              <p className="text-xs font-bold text-on-surface">
                {insight?.metrics?.junkRate ?? '—'}%
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-[--radius-sm] p-2 text-center">
              <p className="text-[10px] text-on-surface-variant">Quality rate</p>
              <p className="text-xs font-bold text-on-surface">
                {insight?.metrics?.qualityRate ?? '—'}%
              </p>
            </div>
            <div className="bg-surface-container-lowest rounded-[--radius-sm] p-2 text-center">
              <p className="text-[10px] text-on-surface-variant">Spam</p>
              <p className="text-xs font-bold text-on-surface">
                {insight?.metrics?.spamRate ?? '—'}%
              </p>
            </div>
          </div>

          {/* Confidence + actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Confidence bar */}
            {insight?.confidence && (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden flex-1 max-w-[100px]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${insight.confidence}%`, background: aiConfig.confidenceColor }}
                  />
                </div>
                <span className="text-[10px] text-on-surface-variant whitespace-nowrap">
                  Tin cậy {insight.confidence}%
                </span>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {(aiConfig.label === 'Tăng' || aiConfig.label === 'Giữ') && (
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => setPendingAction('increase')}
                >
                  <TrendingUp size={11} />
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
                  <AlertOctagon size={11} />
                  Tắt ngay
                </Button>
              )}
              <span className="text-[10px] text-on-surface-variant">
                Mở Ads Manager
              </span>
            </div>
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

export function CampaignOptimizationTable({ campaigns, onSelectCampaign }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Sort: increase first, then keep, decrease, pause
  const sorted = [...campaigns].sort((a, b) => {
    const order = { increase: 0, keep: 1, decrease: 2, pause: 3 };
    return (order[a.aiAction] ?? 9) - (order[b.aiAction] ?? 9);
  });

  return (
    <div className="flex flex-col gap-1">
      {/* Header */}
      <div className="grid grid-cols-[1fr_120px_1fr_160px_44px] gap-3 px-4 py-3 bg-surface-container-low rounded-[--radius-md]">
        <span className="text-xs font-semibold text-on-surface-variant">Chiến dịch</span>
        <span className="text-xs font-semibold text-on-surface-variant">AI Gợi ý</span>
        <span className="text-xs font-semibold text-on-surface-variant">Phân tích</span>
        <span className="text-xs font-semibold text-on-surface-variant">Chỉ số</span>
        <span />
      </div>

      {/* Rows */}
      {sorted.map((camp) => {
        const aiConfig = aiActionConfig[camp.aiAction] || aiActionConfig.keep;
        const isPaused = camp.status === 'paused';
        const isExpanded = expandedId === camp.id;

        return (
          <div key={camp.id} className="flex flex-col rounded-[--radius-md] overflow-hidden">
            {/* Main row */}
            <div
              className={cn(
                'grid grid-cols-[1fr_120px_1fr_160px_44px] gap-3 px-4 py-3 items-center transition-colors duration-150',
                'hover:bg-surface-container-low cursor-pointer',
                isPaused && 'opacity-60'
              )}
            >
              {/* Campaign name + platform */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-on-surface truncate">{camp.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Badge platform={camp.platform} size="sm">
                      {camp.platform === 'facebook' ? 'FB' : 'Zalo'}
                    </Badge>
                    <span className="text-[10px] text-on-surface-variant">
                      {formatNumber(camp.conversations)} hội thoại
                    </span>
                    {isPaused && (
                      <span className="text-[10px] text-on-surface-variant">· Tạm dừng</span>
                    )}
                  </div>
                </div>
              </div>

              {/* AI suggestion badge */}
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

              {/* Quick insight */}
              <div className="min-w-0">
                <p className="text-[11px] text-on-surface-variant leading-snug line-clamp-2">
                  {camp.aiAction === 'increase'
                    ? `ROAS ${(camp.revenue / camp.spend).toFixed(1)}× — hiệu quả cao, nên scale.`
                    : camp.aiAction === 'decrease'
                    ? `Junk rate cao, chi phí cao hơn hiệu quả.`
                    : camp.aiAction === 'pause'
                    ? `Không còn hiệu quả, đốt ngân sách rác.`
                    : `Ổn định, duy trì ngân sách hiện tại.`}
                </p>
              </div>

              {/* Mini stats */}
              <div className="flex items-center gap-3 text-[11px]">
                <div className="text-right">
                  <p className="text-on-surface-variant">Chi tiêu</p>
                  <p className="font-medium text-on-surface">{formatCurrency(camp.spend)}</p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant">ROAS</p>
                  <p
                    className={cn(
                      'font-bold',
                      camp.revenue / camp.spend >= 3
                        ? 'text-[#059669]'
                        : camp.revenue / camp.spend >= 1.5
                        ? 'text-[#d97706]'
                        : 'text-[#dc2626]'
                    )}
                  >
                    {(camp.revenue / camp.spend).toFixed(1)}×
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface-variant">Chất lượng</p>
                  <p
                    className={cn(
                      'font-bold',
                      camp.qualityScore >= 70
                        ? 'text-[#059669]'
                        : camp.qualityScore >= 40
                        ? 'text-[#d97706]'
                        : 'text-[#dc2626]'
                    )}
                  >
                    {camp.qualityScore}
                  </p>
                </div>
              </div>

              {/* Expand toggle */}
              <div className="flex items-center justify-end">
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
            </div>

            {/* Expandable detail */}
            {isExpanded && (
              <ExpandableRow
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

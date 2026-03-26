import { Sparkles, AlertTriangle, Eye, Star } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';
import { formatCurrency } from '../../lib/utils';

/**
 * ExecutiveSummaryCard — CEO/CMO Summary
 *
 * Component layout theo kpi-dashboard-design (Executive Summary pattern) +
 * data-storytelling (KEY INSIGHT → THE DATA → THE IMPLICATION).
 *
 * Nội dung tính toán từ mockCampaigns + mockAIInsights trong AdsDashboard,
 * truyền xuống qua props.
 */

// ─── Sub-components ──────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, colorClass, bgClass }) {
  return (
    <div className={cn('flex items-center gap-2 mb-3', colorClass)}>
      <div className={cn('p-1 rounded-[--radius-sm]', bgClass)}>
        <Icon size={14} />
      </div>
      <span className="text-xs font-bold tracking-wide uppercase">{label}</span>
    </div>
  );
}

function BulletItem({ item, onActionClick }) {
  const borderColor = {
    danger: 'border-l-[3px] border-on-error-container',
    warning: 'border-l-[3px] border-on-warning-container',
    info: 'border-l-[3px] border-primary',
    success: 'border-l-[3px] border-on-tertiary-container',
  };

  const iconBg = {
    danger: 'bg-error-container/40',
    warning: 'bg-warning-container/40',
    info: 'bg-primary/10',
    success: 'bg-tertiary-container/40',
  };

  return (
    <div className={cn('rounded-[--radius-sm] p-3 bg-surface-container-lowest', borderColor[item.type])}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <span className="text-base leading-none mt-0.5">{item.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-on-surface leading-snug">{item.title}</p>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{item.summary}</p>
          </div>
        </div>
        {item.actionType && (
          <Badge
            size="sm"
            className={cn(
              'shrink-0 text-[10px]',
              item.actionType === 'decrease' && 'bg-error-container text-on-error-container',
              item.actionType === 'pause' && 'bg-surface-container-high text-on-surface-variant',
              item.actionType === 'keep' && 'bg-warning-container text-on-warning-container',
              item.actionType === 'increase' && 'bg-tertiary-container text-on-tertiary-container'
            )}
          >
            {item.actionType === 'decrease' ? '↓ Giảm' :
             item.actionType === 'pause' ? '⏸ Tạm dừng' :
             item.actionType === 'increase' ? '↑ Tăng' : '↔ Giữ'}
          </Badge>
        )}
      </div>
    </div>
  );
}

function AISummaryBox({ summary }) {
  return (
    <div className="rounded-[--radius-md] p-4 bg-gradient-to-r from-primary/8 to-primary-dim/8 border border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={14} className="text-primary" />
        <span className="text-xs font-bold text-primary">TÓM TẮT TUẦN NÀY</span>
      </div>
      <p className="text-xs text-on-surface leading-relaxed">{summary}</p>
    </div>
  );
}

function PortfolioStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-3 p-3 bg-surface-container-low rounded-[--radius-sm]">
      <div className="text-center">
        <p className="font-display font-bold text-base text-on-surface leading-none">
          {formatCurrency(stats.totalRevenue)}
        </p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">Doanh thu</p>
        <p className="text-[10px] text-[#059669] font-semibold mt-0.5">{stats.revenueTrend}</p>
      </div>
      <div className="text-center border-x border-surface-container-high">
        <p className="font-display font-bold text-base text-on-surface leading-none">
          {stats.portfolioRoas}×
        </p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">ROAS Portfolio</p>
        <p className="text-[10px] text-[#059669] font-semibold mt-0.5">{stats.roasTrend}</p>
      </div>
      <div className="text-center">
        <p className="font-display font-bold text-base text-on-surface leading-none">
          {formatCurrency(stats.totalSpend)}
        </p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">Chi tiêu</p>
        <p className="text-[10px] text-on-surface-variant mt-0.5">7 ngày</p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────

export function ExecutiveSummaryCard({ summary }) {
  return (
    <div className="space-y-3">
      {/* Portfolio KPIs */}
      <PortfolioStats stats={summary.portfolio} />

      {/* AI Summary */}
      <AISummaryBox summary={summary.aiSummary} />

      {/* 3 columns: Urgent | Watch | Highlight */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* 🔴 Urgent */}
        {summary.urgent && summary.urgent.length > 0 && (
          <div className="space-y-2">
            <SectionHeader
              icon={AlertTriangle}
              label="Cần xử lý ngay"
              colorClass="text-on-error-container"
              bgClass="bg-error-container/40"
            />
            {summary.urgent.map((item, i) => (
              <BulletItem key={i} item={item} />
            ))}
          </div>
        )}

        {/* 🟡 Watch */}
        {summary.watch && summary.watch.length > 0 && (
          <div className="space-y-2">
            <SectionHeader
              icon={Eye}
              label="Theo dõi tuần này"
              colorClass="text-on-warning-container"
              bgClass="bg-warning-container/40"
            />
            {summary.watch.map((item, i) => (
              <BulletItem key={i} item={item} />
            ))}
          </div>
        )}

        {/* 🟢 Highlights */}
        {summary.highlight && summary.highlight.length > 0 && (
          <div className="space-y-2">
            <SectionHeader
              icon={Star}
              label="Điểm sáng"
              colorClass="text-on-tertiary-container"
              bgClass="bg-tertiary-container/40"
            />
            {summary.highlight.map((item, i) => (
              <BulletItem key={i} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Budget Recommendation */}
      {summary.budgetRecommendation && (
        <div className="rounded-[--radius-md] p-3 bg-surface-container-low border border-surface-container-high">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide mb-2">
            📊 Gợi ý phân bổ ngân sách tuần tới
          </p>
          <div className="grid grid-cols-4 gap-2 text-xs">
            {summary.budgetRecommendation.scaleUp?.length > 0 && (
              <div>
                <p className="font-semibold text-[#059669] mb-1">↑ Tăng</p>
                {summary.budgetRecommendation.scaleUp.map((b, i) => (
                  <p key={i} className="text-on-surface-variant leading-tight">
                    {b.campaign}: {formatCurrency(b.suggestedBudget)}
                  </p>
                ))}
              </div>
            )}
            {summary.budgetRecommendation.keep?.length > 0 && (
              <div>
                <p className="font-semibold text-[#d97706] mb-1">↔ Giữ</p>
                {summary.budgetRecommendation.keep.map((b, i) => (
                  <p key={i} className="text-on-surface-variant leading-tight">
                    {b.campaign}: {formatCurrency(b.suggestedBudget)}
                  </p>
                ))}
              </div>
            )}
            {summary.budgetRecommendation.reduce?.length > 0 && (
              <div>
                <p className="font-semibold text-[#d97706] mb-1">↓ Giảm</p>
                {summary.budgetRecommendation.reduce.map((b, i) => (
                  <p key={i} className="text-on-surface-variant leading-tight">
                    {b.campaign}: {formatCurrency(b.suggestedBudget)}
                  </p>
                ))}
              </div>
            )}
            {summary.budgetRecommendation.pause?.length > 0 && (
              <div>
                <p className="font-semibold text-[#dc2626] mb-1">⏸ Dừng</p>
                {summary.budgetRecommendation.pause.map((b, i) => (
                  <p key={i} className="text-on-surface-variant leading-tight">
                    {b.campaign}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

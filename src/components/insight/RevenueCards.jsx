import { Card } from '../ui/Card';
import { Banknote, TrendingUp } from 'lucide-react';
import { formatCurrency, formatNumber, formatRoas } from '../../lib/utils';
import { cn } from '../../lib/utils';

function RoasBadge({ roas }) {
  const isGood = roas >= 3;
  const isOk = roas >= 1.5;

  const colorClass = isGood
    ? 'text-[#059669]'
    : isOk
    ? 'text-[#d97706]'
    : 'text-[#dc2626]';

  const label = isGood ? 'Tốt' : isOk ? 'Cải thiện' : 'Thấp';

  return (
    <span className={cn('inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full', colorClass)}>
      {label}
    </span>
  );
}

export function RevenueCards({ stats }) {
  const portfolioRoas = stats.totalSpend > 0
    ? stats.totalRevenue / stats.totalSpend
    : 0;

  const cards = [
    {
      label: 'Doanh thu Portfolio',
      value: formatCurrency(stats.totalRevenue),
      icon: Banknote,
      color: 'text-primary',
      bg: 'bg-primary/10',
      sub: (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-on-surface-variant font-medium">
            {formatNumber(stats.totalOrders)} đơn hàng
          </span>
          <span className="text-[10px] text-on-surface-variant">·</span>
          <span className="text-[10px] text-[#059669] font-semibold">↑18%</span>
        </div>
      ),
    },
    {
      label: 'ROAS Trung bình',
      value: formatRoas(stats.totalRevenue, stats.totalSpend),
      icon: TrendingUp,
      color: portfolioRoas >= 3 ? 'text-[#059669]' : portfolioRoas >= 1.5 ? 'text-[#d97706]' : 'text-[#dc2626]',
      bg: portfolioRoas >= 3 ? 'bg-[#059669]/10' : portfolioRoas >= 1.5 ? 'bg-[#d97706]/10' : 'bg-[#dc2626]/10',
      sub: (
        <div className="mt-1">
          <RoasBadge roas={portfolioRoas} />
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">{card.label}</span>
              <div className={cn('p-2 rounded-sm', card.bg)}>
                <Icon size={16} className={card.color} />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-on-surface leading-none">
                {card.value}
              </p>
              {card.sub}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

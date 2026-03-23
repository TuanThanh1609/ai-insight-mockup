import { Card } from '../ui/Card';
import { MessageCircle, Megaphone, TrendingUp, Wallet } from 'lucide-react';
import { formatNumber, formatPercent, formatCurrency } from '../../lib/utils';

export function OverviewCards({ stats }) {
  const cards = [
    {
      label: 'Tổng hội thoại',
      value: formatNumber(stats.totalConversations),
      icon: MessageCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
      sub: null,
    },
    {
      label: 'Từ Quảng cáo',
      value: formatNumber(stats.adsConversations),
      icon: Megaphone,
      color: 'text-facebook',
      bg: 'bg-facebook/10',
      sub: (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-facebook font-semibold">
            FB: {formatNumber(stats.facebookConversations)}
          </span>
          <span className="text-[10px] text-on-surface-variant">·</span>
          <span className="text-[10px] text-zalo font-semibold">
            Zalo: {formatNumber(stats.zaloConversations)}
          </span>
        </div>
      ),
    },
    {
      label: 'Tỉ lệ chuyển đổi',
      value: formatPercent(stats.conversionRate),
      icon: TrendingUp,
      color: 'text-on-tertiary-container',
      bg: 'bg-tertiary-container',
      sub: (
        <div className="mt-1">
          <span className="inline-flex items-center text-[10px] text-tertiary-container font-medium bg-tertiary-container px-1.5 py-0.5 rounded-full">
            ↑ 3.2%
          </span>
        </div>
      ),
    },
    {
      label: 'Chi tiêu Ads',
      value: formatCurrency(stats.totalSpend),
      icon: Wallet,
      color: 'text-on-warning-container',
      bg: 'bg-warning-container',
      sub: (
        <div className="mt-1">
          <span className="inline-flex items-center text-[10px] text-warning-container font-medium bg-warning-container px-1.5 py-0.5 rounded-full">
            ↕ ₫2.3M hôm qua
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">{card.label}</span>
              <div className={`p-2 rounded-[--radius-sm] ${card.bg}`}>
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

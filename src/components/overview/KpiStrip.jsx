import { Card } from '../ui/Card';
import { MessageCircle, Wallet, TrendingUp, Zap } from 'lucide-react';
import { formatNumber, formatCurrency, formatRoas } from '../../lib/utils';
import { mockCampaigns } from '../../data/mockCampaigns';

/**
 * KpiStrip — 4 big KPI cards cho CEO dashboard
 * Data: conversations prop (from parent) + mockCampaigns (Ads)
 */
export default function KpiStrip({ conversations = [] }) {
  const totalConversations = conversations.length;

  // Phone collected
  const phoneCollected = conversations.filter(
    (c) =>
      c.phone_status === 'Đã thu thập' ||
      c.phone_status === 'Đã thu thập SĐT' ||
      c.phone === true
  ).length;

  // Ads data từ mockCampaigns
  const totalSpend = mockCampaigns.reduce((s, c) => s + (c.spend || 0), 0);
  const totalRevenue = mockCampaigns.reduce((s, c) => s + (c.revenue || 0), 0);
  const avgRoas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

  // ROAS color
  const roasColor =
    avgRoas >= 3
      ? 'text-[#059669]'
      : avgRoas >= 1.5
      ? 'text-[#d97706]'
      : 'text-[#dc2626]';
  const roasBg =
    avgRoas >= 3
      ? 'bg-[#059669]/10'
      : avgRoas >= 1.5
      ? 'bg-[#d97706]/10'
      : 'bg-[#dc2626]/10';

  const cards = [
    {
      label: 'Tổng hội thoại',
      value: formatNumber(totalConversations),
      sub: phoneCollected > 0 ? `${formatNumber(phoneCollected)} SĐT thu thập` : null,
      icon: MessageCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Chi tiêu Ads',
      value: formatCurrency(totalSpend),
      sub: `${mockCampaigns.filter((c) => c.status === 'active').length} chiến dịch đang chạy`,
      icon: Wallet,
      color: 'text-[#d97706]',
      bg: 'bg-[#d97706]/10',
    },
    {
      label: 'Doanh thu',
      value: formatCurrency(totalRevenue),
      sub: `${formatNumber(mockCampaigns.reduce((s, c) => s + (c.ordersCount || 0), 0))} đơn hàng`,
      icon: TrendingUp,
      color: 'text-[#059669]',
      bg: 'bg-[#059669]/10',
    },
    {
      label: 'ROAS trung bình',
      value: formatRoas(totalRevenue, totalSpend),
      sub:
        avgRoas >= 3
          ? 'Vượt ngưỡng 3×'
          : avgRoas >= 1.5
          ? 'Ngưỡng cải thiện'
          : 'Cần tối ưu',
      icon: Zap,
      color: roasColor,
      bg: roasBg,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.label} className="p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-on-surface-variant font-medium">
                {card.label}
              </span>
              <div className={`p-2 rounded-sm ${card.bg}`}>
                <Icon size={16} className={card.color} />
              </div>
            </div>
            <div>
              <p className="font-display font-bold text-2xl text-on-surface leading-none">
                {card.value}
              </p>
              {card.sub && (
                <p className="text-[11px] text-on-surface-variant mt-1 opacity-70">
                  {card.sub}
                </p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

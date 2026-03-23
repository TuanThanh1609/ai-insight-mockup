import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn, formatRoas, calcRoas } from '../../lib/utils';

/**
 * PlatformROASCard — So sánh ROAS Facebook vs Zalo
 *
 * Theo paid-ads skill: platform selection guide, optimization levers.
 * Màu ROAS theo ngưỡng: ≥3× xanh, ≥1.5× vàng, <1.5× đỏ.
 *
 * Props:
 *   campaigns — array từ mockCampaigns
 *   stats — mockOverviewStats (có facebookConversations, zaloConversations)
 */
export function PlatformROASCard({ campaigns, stats }) {
  const fbCampaigns = campaigns.filter((c) => c.platform === 'facebook');
  const zaloCampaigns = campaigns.filter((c) => c.platform === 'zalo');

  const fbRevenue = fbCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const fbSpend = fbCampaigns.reduce((sum, c) => sum + c.spend, 0);
  const zaloRevenue = zaloCampaigns.reduce((sum, c) => sum + c.revenue, 0);
  const zaloSpend = zaloCampaigns.reduce((sum, c) => sum + c.spend, 0);

  const fbRoas = calcRoas(fbRevenue, fbSpend);
  const zaloRoas = calcRoas(zaloRevenue, zaloSpend);
  const portfolioRoas = stats.totalSpend > 0 ? stats.totalRevenue / stats.totalSpend : 0;

  const getRoasColor = (roas) => {
    if (roas >= 3) return { text: 'text-[#059669]', bg: 'bg-[#059669]/10', label: 'Tốt' };
    if (roas >= 1.5) return { text: 'text-[#d97706]', bg: 'bg-[#d97706]/10', label: 'Cải thiện' };
    return { text: 'text-[#dc2626]', bg: 'bg-[#dc2626]/10', label: 'Thấp' };
  };

  const fbColor = getRoasColor(fbRoas);
  const zaloColor = getRoasColor(zaloRoas);

  const fbDiff = fbRoas - portfolioRoas;
  const zaloDiff = zaloRoas - portfolioRoas;

  const fbLead = fbRoas > zaloRoas;
  const zaloLead = zaloRoas > fbRoas;

  const platforms = [
    {
      key: 'facebook',
      label: 'Facebook',
      icon: 'f',
      roas: fbRoas,
      revenue: fbRevenue,
      spend: fbSpend,
      conv: stats.facebookConversations,
      color: fbColor,
      diff: fbDiff,
      winner: fbLead,
    },
    {
      key: 'zalo',
      label: 'Zalo',
      icon: 'Z',
      roas: zaloRoas,
      revenue: zaloRevenue,
      spend: zaloSpend,
      conv: stats.zaloConversations,
      color: zaloColor,
      diff: zaloDiff,
      winner: zaloLead,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {platforms.map((p) => (
        <Card key={p.key} className="p-4 relative overflow-hidden">
          {/* Winner indicator */}
          {p.winner && (
            <div className="absolute top-2 right-2">
              <Badge size="sm" className="bg-tertiary-container text-on-tertiary-container text-[9px] font-bold">
                ✦ HIỆU QUẢ HƠN
              </Badge>
            </div>
          )}

          {/* Platform label */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className={cn(
                'w-7 h-7 rounded-[--radius-sm] flex items-center justify-center text-xs font-bold text-white',
                p.key === 'facebook' ? 'bg-facebook' : 'bg-zalo'
              )}
            >
              {p.icon}
            </div>
            <span className="text-xs font-semibold text-on-surface">{p.label}</span>
          </div>

          {/* ROAS lớn */}
          <div className="mb-3">
            <p className={cn('font-display font-bold text-2xl leading-none', p.color.text)}>
              {formatRoas(p.revenue, p.spend)}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Badge size="sm" className={cn(p.color.bg, p.color.text, 'text-[10px]')}>
                {p.color.label}
              </Badge>
              <span className="text-[10px] text-on-surface-variant">
                {p.diff >= 0 ? `+${(p.diff).toFixed(1)}× vs TB` : `${(p.diff).toFixed(1)}× vs TB`}
              </span>
            </div>
          </div>

          {/* Mini metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-surface-container-low">
            <div>
              <p className="text-[10px] text-on-surface-variant">Doanh thu</p>
              <p className="text-xs font-semibold text-on-surface">
                {(p.revenue / 1_000_000).toFixed(1)}M
              </p>
            </div>
            <div>
              <p className="text-[10px] text-on-surface-variant">Chi tiêu</p>
              <p className="text-xs font-semibold text-on-surface">
                {(p.spend / 1_000_000).toFixed(1)}M
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] text-on-surface-variant">Hội thoại</p>
              <p className="text-xs font-semibold text-on-surface">{p.conv} cuộc</p>
            </div>
          </div>
        </Card>
      ))}

      {/* So sánh ROAS */}
      <div className="col-span-2 rounded-[--radius-md] p-3 bg-surface-container-low flex items-center justify-between">
        <div className="flex items-center gap-2">
          {fbLead ? (
            <>
              <span className="text-xs font-bold text-facebook">Facebook</span>
              <span className="text-xs text-on-surface-variant">hiệu quả hơn</span>
              <span className="text-xs font-bold text-on-tertiary-container">
                +{(fbRoas - zaloRoas).toFixed(1)}×
              </span>
            </>
          ) : (
            <>
              <span className="text-xs font-bold text-zalo">Zalo</span>
              <span className="text-xs text-on-surface-variant">hiệu quả hơn</span>
              <span className="text-xs font-bold text-on-tertiary-container">
                +{(zaloRoas - fbRoas).toFixed(1)}×
              </span>
            </>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-on-surface-variant">Chênh lệch ROAS</p>
          <p className="text-xs font-bold text-primary">
            {Math.abs(fbRoas - zaloRoas).toFixed(1)}×
          </p>
        </div>
      </div>
    </div>
  );
}

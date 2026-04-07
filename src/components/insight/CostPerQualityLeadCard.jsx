import { Target, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { cn, formatCurrency, formatNumber } from '../../lib/utils';

/**
 * CostPerQualityLeadCard — Chi phí cho mỗi lead chất lượng
 *
 * Theo analytics-product skill: CAC formula, quality rate.
 * Công thức: CPL = totalSpend / (totalLeads × avgQualityRate)
 *
 * Props:
 *   campaigns — array từ mockCampaigns
 *   stats — mockOverviewStats
 */
export function CostPerQualityLeadCard({ campaigns, stats }) {
  // Tính tổng leads chất lượng từ tất cả campaign
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);

  // avgQualityRate = avg qualityScore / 100 của các campaign
  const avgQualityRate =
    campaigns.length > 0
      ? campaigns.reduce((sum, c) => sum + c.qualityScore, 0) / campaigns.length / 100
      : 0;

  // Số lead chất lượng ước tính
  const qualityLeads = Math.round(totalLeads * avgQualityRate);

  // Chi phí cho mỗi lead chất lượng
  const cpl = qualityLeads > 0 ? stats.totalSpend / qualityLeads : 0;

  // Ngưỡng ngành mặc định (100k VND/lead là benchmark cho ngành TMĐT VN)
  const benchmark = 100000;
  const cplVsBenchmark = benchmark > 0 ? ((cpl - benchmark) / benchmark) * 100 : 0;
  const isGood = cpl <= benchmark;

  // Chi phí cho mỗi lead thường (không lọc chất lượng)
  const cplRaw = totalLeads > 0 ? stats.totalSpend / totalLeads : 0;

  // Lead nóng (dựa trên AI insights)
  const hotLeads = Object.values({
    'camp-1': 8, 'camp-2': 28, 'camp-3': 1, 'camp-4': 2,
    'camp-5': 31, 'camp-6': 14, 'camp-7': 0, 'camp-8': 41,
  }).reduce((a, b) => a + b, 0);

  const getColor = () => {
    if (cpl <= benchmark * 0.7) return { text: 'text-[#059669]', bg: 'bg-[#059669]/10', label: 'Tốt' };
    if (cpl <= benchmark) return { text: 'text-[#d97706]', bg: 'bg-[#d97706]/10', label: 'Trung bình' };
    return { text: 'text-[#dc2626]', bg: 'bg-[#dc2626]/10', label: 'Cao' };
  };

  const color = getColor();

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-sm bg-primary/10">
            <Target size={14} className="text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold text-on-surface">Chi phí / Lead chất lượng</p>
            <p className="text-[10px] text-on-surface-variant"> CPL (sau khi lọc junk)</p>
          </div>
        </div>
        <Badge size="sm" className={cn(color.bg, color.text, 'text-[10px]')}>
          {color.label}
        </Badge>
      </div>

      {/* Main number */}
      <div className="mb-3">
        <p className={cn('font-display font-bold text-2xl leading-none', color.text)}>
          {cpl > 0 ? formatCurrency(cpl) : '—'}
        </p>
        <div className="flex items-center gap-2 mt-1">
          {isGood ? (
            <TrendingDown size={12} className="text-[#059669]" />
          ) : (
            <TrendingUp size={12} className="text-[#dc2626]" />
          )}
          <span className="text-[10px] text-on-surface-variant">
            {isGood ? (
              <span className="text-[#059669] font-semibold">
                Thấp hơn benchmark {Math.abs(cplVsBenchmark).toFixed(0)}%
              </span>
            ) : (
              <span className="text-[#dc2626] font-semibold">
                Cao hơn benchmark {Math.abs(cplVsBenchmark).toFixed(0)}%
              </span>
            )}
            <span className="text-on-surface-variant"> (ngưỡng: {formatCurrency(benchmark)})</span>
          </span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-surface-container-low">
        <div className="text-center">
          <p className="text-[10px] text-on-surface-variant">Lead tổng</p>
          <p className="text-xs font-bold text-on-surface">{formatNumber(totalLeads)}</p>
        </div>
        <div className="text-center border-x border-surface-container-low">
          <p className="text-[10px] text-on-surface-variant">Lead chất lượng</p>
          <p className="text-xs font-bold text-on-surface">{formatNumber(qualityLeads)}</p>
          <p className="text-[9px] text-[#059669] font-semibold">
            {(avgQualityRate * 100).toFixed(0)}% quality
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-on-surface-variant">Lead nóng</p>
          <p className="text-xs font-bold text-on-tertiary-container">{formatNumber(hotLeads)}</p>
          <p className="text-[9px] text-on-surface-variant">
            {(hotLeads / qualityLeads * 100).toFixed(0)}% của chất lượng
          </p>
        </div>
      </div>

      {/* CPL trước lọc */}
      <div className="mt-2 flex items-center justify-between rounded-sm p-2 bg-surface-container-low">
        <span className="text-[10px] text-on-surface-variant">CPL trước lọc junk:</span>
        <span className="text-[10px] font-semibold text-on-surface">{formatCurrency(cplRaw)}</span>
      </div>
    </Card>
  );
}

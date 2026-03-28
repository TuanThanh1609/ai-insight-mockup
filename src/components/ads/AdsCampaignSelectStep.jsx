import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatCurrency, formatRoas } from '../../lib/utils';

/**
 * Step 2 — Chọn chiến dịch quảng cáo
 *
 * Props:
 *   campaigns    — array từ mockCampaigns.js
 *   selectedIds  — array of campaign id đang chọn
 *   onChange     — (selectedIds) => void
 *   onNext       — () => void
 *   onBack       — () => void
 */
export function AdsCampaignSelectStep({ campaigns = [], selectedIds = [], onChange, onNext, onBack }) {
  const [activeFilter, setActiveFilter] = useState('all');

  // All checked by default
  const checked = useMemo(() => {
    if (selectedIds.length === 0) return campaigns.map(c => c.id);
    return selectedIds;
  }, [selectedIds, campaigns]);

  const setChecked = (ids) => onChange?.(ids);

  const toggleOne = (id) => {
    if (checked.includes(id)) {
      setChecked(checked.filter(x => x !== id));
    } else {
      setChecked([...checked, id]);
    }
  };

  const toggleAll = () => {
    if (checked.length === filtered.length) {
      setChecked([]);
    } else {
      setChecked(filtered.map(c => c.id));
    }
  };

  const filtered = useMemo(() => {
    if (activeFilter === 'all')     return campaigns;
    if (activeFilter === 'facebook') return campaigns.filter(c => c.platform === 'facebook');
    if (activeFilter === 'zalo')   return campaigns.filter(c => c.platform === 'zalo');
    if (activeFilter === 'active') return campaigns.filter(c => c.status === 'active');
    return campaigns;
  }, [campaigns, activeFilter]);

  const selectedCampaigns = campaigns.filter(c => checked.includes(c.id));
  const totalBudget = selectedCampaigns.reduce((s, c) => s + c.budget, 0);

  const roasColor = (roas) => {
    if (roas >= 3)   return 'text-success bg-success-container';
    if (roas >= 1.5) return 'text-warning bg-warning-container';
    return 'text-error bg-error-container';
  };

  const roasBadge = (roas) => {
    const color = roasColor(roas);
    return (
      <span className={`text-label-sm px-2 py-0.5 rounded-full font-semibold ${color}`}>
        ROAS {roas.toFixed(1)}×
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-headline-md text-on-surface font-bold mb-2">
          Chọn chiến dịch quảng cáo
        </h2>
        <p className="text-body-md text-on-surface-variant">
          Tick chọn các chiến dịch bạn muốn phân tích. Dữ liệu chiến dịch sẽ được đưa vào chẩn đoán Ads Health.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-5">
        {[
          { key: 'all',      label: 'Tất cả' },
          { key: 'facebook', label: 'Facebook' },
          { key: 'zalo',     label: 'Zalo' },
          { key: 'active',  label: 'Đang chạy' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`
              px-3 py-1.5 rounded-full text-label-sm transition-all cursor-pointer
              ${activeFilter === tab.key
                ? 'bg-primary text-on-primary font-semibold'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Campaign List */}
      <div className="space-y-2 mb-6">
        {filtered.map(campaign => {
          const isChecked = checked.includes(campaign.id);
          const roas = campaign.revenue > 0 && campaign.spend > 0
            ? campaign.revenue / campaign.spend
            : 0;

          return (
            <div
              key={campaign.id}
              className={`
                rounded-[--radius-md] p-4 flex items-center gap-4 cursor-pointer transition-all
                ${isChecked
                  ? 'bg-surface-container-low shadow-[--shadow-sm]'
                  : 'bg-surface-container-lowest hover:bg-surface-container-low'
                }
              `}
              onClick={() => toggleOne(campaign.id)}
            >
              {/* Checkbox */}
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors
                ${isChecked
                  ? 'bg-tertiary border-tertiary'
                  : 'border-[var(--color-outline-variant)]'
                }
              `}>
                {isChecked && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                )}
              </div>

              {/* Platform Badge */}
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center shrink-0
                ${campaign.platform === 'facebook' ? 'bg-[#1877f2]/10' : 'bg-tertiary/10'}
              `}>
                <span className={`
                  text-[9px] font-bold uppercase
                  ${campaign.platform === 'facebook' ? 'text-[#1877f2]' : 'text-tertiary'}
                `}>
                  {campaign.platform === 'facebook' ? 'FB' : 'ZA'}
                </span>
              </div>

              {/* Campaign Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-body-md text-on-surface font-medium truncate">{campaign.name}</span>
                  {campaign.status === 'paused' && (
                    <span className="text-label-sm px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
                      Tạm dừng
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-0.5 text-label-sm text-on-surface-variant">
                  <span>Ngân sách: {formatCurrency(campaign.budget)}</span>
                  <span>·</span>
                  <span>Chi tiêu: {formatCurrency(campaign.spend)}</span>
                  <span>·</span>
                  <span>Đơn: {campaign.ordersCount}</span>
                </div>
              </div>

              {/* ROAS Badge */}
              {roasBadge(roas)}
            </div>
          );
        })}
      </div>

      {/* Summary Bar */}
      <div className="
        bg-surface-container-low rounded-[--radius-lg] px-5 py-4 mb-6
        flex items-center justify-between flex-wrap gap-3
      ">
        <div className="flex items-center gap-3 text-body-sm text-on-surface">
          <span className="text-label-sm text-on-surface-variant">Đã chọn:</span>
          <span className="font-semibold text-primary">
            {checked.length} chiến dịch
          </span>
          <span className="text-[var(--color-outline-variant)]">|</span>
          <span className="text-label-sm text-on-surface-variant">Tổng ngân sách:</span>
          <span className="font-semibold text-primary">
            {formatCurrency(totalBudget)}
          </span>
        </div>

        {checked.length === 0 && (
          <span className="text-body-sm text-warning">
            Vui lòng chọn ít nhất 1 chiến dịch
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack} className="gap-1">
          <ChevronLeft size={16} />
          Quay lại
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={onNext}
          disabled={checked.length === 0}
          className="gap-2"
        >
          Tiếp tục
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}

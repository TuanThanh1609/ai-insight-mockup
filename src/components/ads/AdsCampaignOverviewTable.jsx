import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

// ─── Seeded PRNG ──────────────────────────────────────────────────────────────
function sr(seed) {
  let s = Math.sin(seed * 9301 + 49297) * 233280;
  return s - Math.floor(s);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatVND(amount) {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  return `${(amount / 1_000).toFixed(0)}K`;
}

function roasColor(roas) {
  if (roas >= 3)   return '#059669';
  if (roas >= 1.5) return '#d97706';
  return '#dc2626';
}

function phoneRate(campaign) {
  if (!campaign.conversations) return 0;
  return (campaign.phoneCollected / campaign.conversations) * 100;
}

function closeRate(campaign) {
  if (!campaign.ordersCount) return 0;
  return (campaign.ordersCount / campaign.conversations) * 100;
}

// ─── Cell sub-components ───────────────────────────────────────────────────────

const ROASLabel = ({ roas }) => (
  <span className="font-bold" style={{ color: roasColor(roas) }}>
    {roas.toFixed(1)}×
  </span>
);

const TempPill = ({ value, type }) => {
  const colorMap = { hot: '#dc2626', warm: '#d97706', cold: '#0052FF' };
  return (
    <span
      className="inline-block w-5 h-5 rounded-full text-[9px] font-bold leading-5 text-center text-white"
      style={{ background: colorMap[type] || '#9ca3af' }}
    >
      {value}
    </span>
  );
};

const ActionBadge = ({ aiAction }) => {
  const map = {
    increase: { label: 'Tăng',    icon: '↑', color: '#059669', bg: 'rgba(5,150,105,0.12)' },
    keep:     { label: 'Giữ',     icon: '●', color: '#0052FF', bg: 'rgba(0,82,255,0.10)' },
    decrease: { label: 'Giảm',    icon: '↓', color: '#dc2626', bg: 'rgba(220,38,38,0.10)' },
    pause:    { label: 'Tạm dừng', icon: '⏸', color: '#d97706', bg: 'rgba(217,119,6,0.12)' },
  };
  const cfg = map[aiAction] || map.keep;
  return (
    <span
      className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
};

// ─── Column definition ─────────────────────────────────────────────────────────
// 14 columns: Ads ID | Post Content | Tổng Tin nhắn | SĐT thu thập | Tỉ lệ để lại SĐT
//             | Đơn thành công | Đơn hủy | Tỉ lệ chốt đơn | Chi phí Ads | Doanh thu | ROAS
//             | Nóng | Ấm | Lạnh

const COLUMNS = [
  { key: 'adId',          label: 'Ads ID',              align: 'left',   width: 'w-[130px]' },
  { key: 'postContent',   label: 'Post Content',         align: 'left',   width: 'w-[220px]' },
  { key: 'conversations', label: 'Tổng Tin nhắn',         align: 'center', width: 'w-[80px]'  },
  { key: 'phoneCollected',label: 'SĐT thu thập',          align: 'center', width: 'w-[80px]'  },
  { key: 'phoneRate',     label: 'Tỉ lệ để lại SĐT',     align: 'center', width: 'w-[90px]'  },
  { key: 'ordersCount',   label: 'Đơn thành công',       align: 'center', width: 'w-[80px]'  },
  { key: 'ordersCancelled',label: 'Đơn hủy',             align: 'center', width: 'w-[70px]'  },
  { key: 'closeRate',     label: 'Tỉ lệ chốt đơn',       align: 'center', width: 'w-[80px]'  },
  { key: 'spend',         label: 'Chi phí Ads',           align: 'right',  width: 'w-[90px]'  },
  { key: 'revenue',       label: 'Doanh thu',             align: 'right',  width: 'w-[90px]'  },
  { key: 'roas',          label: 'ROAS',                  align: 'center', width: 'w-[70px]'  },
  { key: 'tempHot',       label: 'Nóng',                  align: 'center', width: 'w-[50px]'  },
  { key: 'tempWarm',      label: 'Ấm',                   align: 'center', width: 'w-[50px]'  },
  { key: 'tempCold',      label: 'Lạnh',                  align: 'center', width: 'w-[50px]'  },
];

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * AdsCampaignOverviewTable — 14-column overview table for Facebook campaigns.
 *
 * Columns: Ads ID | Post Content | Tổng Tin nhắn | SĐT thu thập | Tỉ lệ để lại SĐT
 *          | Đơn thành công | Đơn hủy | Tỉ lệ chốt đơn | Chi phí Ads | Doanh thu | ROAS
 *          | Nóng | Ấm | Lạnh
 *
 * Props:
 *   campaigns       — array of campaign objects
 *   onCampaignClick — (campaign) => void
 */
export function AdsCampaignOverviewTable({ campaigns = [], onCampaignClick }) {
  const [sortBy, setSortBy] = useState('newest');

  // Derive computed fields
  const enriched = useMemo(() =>
    campaigns.map(c => {
      const roas       = c.spend > 0 ? c.revenue / c.spend : 0;
      const pRate      = phoneRate(c);
      const cRate      = closeRate(c);
      const { hot = 0, warm = 0, cold = 0 } = c.temperature || {};
      return { ...c, roas, pRate, cRate, hot, warm, cold };
    }), [campaigns]);

  // Sort
  const sorted = useMemo(() => {
    const copy = [...enriched];
    if (sortBy === 'roas')       copy.sort((a, b) => b.roas - a.roas);
    else if (sortBy === 'spend') copy.sort((a, b) => b.spend - a.spend);
    else if (sortBy === 'cvr')  copy.sort((a, b) => b.cRate - a.cRate);
    else                         copy.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    return copy;
  }, [enriched, sortBy]);

  // Post content preview — strip emoji/hashtag, truncate to ~50 chars
  function postPreview(text) {
    if (!text) return '—';
    return text.replace(/[\p{Emoji_Presentation}\u{1F300}-\u{1FAFF}]/gu, '').slice(0, 52) + (text.length > 52 ? '…' : '');
  }

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'roas',   label: 'ROAS cao' },
    { value: 'spend',  label: 'Chi tiêu' },
    { value: 'cvr',    label: 'Tỉ lệ chốt' },
  ];

  return (
    <div>
      {/* ─── Section header ─── */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-label-sm font-bold text-on-surface uppercase tracking-wide">
          Tổng Quan Chiến Dịch
        </h3>

        {/* Facebook badge + sort */}
        <div className="flex items-center gap-3">
          {/* Platform badge */}
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(24,119,242,0.12)', color: '#1877F2' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </span>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-[11px] px-2 py-1 rounded-full bg-surface-container-low text-on-surface-variant
              cursor-pointer focus:outline-none focus:ring-0 border-b-2 border-tertiary"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── Scrollable table wrapper ─── */}
      <div className="rounded-lg overflow-hidden border"
        style={{ borderColor: 'var(--color-outline-variant)' }}>

        {/* Sticky header */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[1100px]">
            <thead>
              <tr style={{ background: 'var(--color-surface-container-low)' }}>
                {COLUMNS.map(col => (
                  <th key={col.key}
                    className={cn(
                      'px-3 py-2.5 text-[9px] font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap border-b',
                      col.align === 'right'  ? 'text-right'  :
                      col.align === 'center' ? 'text-center' : 'text-left'
                    )}
                    style={{ borderColor: 'var(--color-outline-variant)' }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={COLUMNS.length} className="text-center py-10 text-on-surface-variant">
                    <span className="text-3xl block mb-2">📭</span>
                    <p className="text-body-sm">Không có chiến dịch nào.</p>
                  </td>
                </tr>
              ) : sorted.map(campaign => {
                const isPaused = campaign.status === 'paused';
                return (
                  <tr
                    key={campaign.id}
                    onClick={() => onCampaignClick?.(campaign)}
                    className={cn(
                      'cursor-pointer transition-colors duration-75',
                      isPaused
                        ? 'opacity-60'
                        : 'hover:bg-surface-container-lowest'
                    )}
                    style={{ borderBottom: '1px solid var(--color-outline-variant)' }}
                  >
                    {/* Ads ID */}
                    <td className="px-3 py-3 text-[11px] font-mono font-semibold text-tertiary whitespace-nowrap">
                      {campaign.adId}
                    </td>

                    {/* Post Content */}
                    <td className="px-3 py-3 text-[11px] text-on-surface-variant max-w-[220px]">
                      <span className="line-clamp-2 leading-snug">
                        {postPreview(campaign.postContent)}
                      </span>
                    </td>

                    {/* Tổng Tin nhắn */}
                    <td className="px-3 py-3 text-center text-[12px] font-semibold text-on-surface whitespace-nowrap">
                      {campaign.conversations}
                    </td>

                    {/* SĐT thu thập */}
                    <td className="px-3 py-3 text-center text-[12px] text-on-surface whitespace-nowrap">
                      {campaign.phoneCollected}
                    </td>

                    {/* Tỉ lệ để lại SĐT */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={cn(
                        'text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                        campaign.pRate >= 50
                          ? 'bg-emerald-50 text-emerald-700'
                          : campaign.pRate >= 30
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-600'
                      )}>
                        {campaign.pRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Đơn thành công */}
                    <td className="px-3 py-3 text-center text-[12px] font-semibold text-emerald-600 whitespace-nowrap">
                      {campaign.ordersCount}
                    </td>

                    {/* Đơn hủy */}
                    <td className="px-3 py-3 text-center text-[11px] text-red-500 whitespace-nowrap">
                      {campaign.ordersCancelled ?? 0}
                    </td>

                    {/* Tỉ lệ chốt đơn */}
                    <td className="px-3 py-3 text-center whitespace-nowrap">
                      <span className={cn(
                        'text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
                        campaign.cRate >= 30
                          ? 'bg-emerald-50 text-emerald-700'
                          : campaign.cRate >= 15
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-red-50 text-red-600'
                      )}>
                        {campaign.cRate.toFixed(1)}%
                      </span>
                    </td>

                    {/* Chi phí Ads */}
                    <td className="px-3 py-3 text-right text-[12px] font-bold text-tertiary whitespace-nowrap">
                      {formatVND(campaign.spend)}
                    </td>

                    {/* Doanh thu */}
                    <td className="px-3 py-3 text-right text-[12px] font-bold text-emerald-600 whitespace-nowrap">
                      {formatVND(campaign.revenue)}
                    </td>

                    {/* ROAS */}
                    <td className="px-3 py-3 text-center">
                      <ROASLabel roas={campaign.roas} />
                    </td>

                    {/* Nóng */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center">
                        <TempPill value={campaign.hot} type="hot" />
                      </div>
                    </td>

                    {/* Ấm */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center">
                        <TempPill value={campaign.warm} type="warm" />
                      </div>
                    </td>

                    {/* Lạnh */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex justify-center">
                        <TempPill value={campaign.cold} type="cold" />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom: AI action badges row */}
        <div className="flex items-center gap-2 px-4 py-2.5 flex-wrap"
          style={{ background: 'var(--color-surface-container-lowest)' }}>
          <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wide mr-1">
            Hành động:
          </span>
          {sorted.map(c => (
            <button
              key={c.id}
              onClick={(e) => { e.stopPropagation(); onCampaignClick?.(c); }}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] transition-all hover:scale-105 cursor-pointer"
              style={{ background: 'var(--color-surface-container-low)' }}
            >
              <span className="font-mono text-[9px] text-on-surface-variant">{c.adId}</span>
              <ActionBadge aiAction={c.aiAction} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

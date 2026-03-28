import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

/**
 * AdsOrderTable
 *
 * Table hiển thị đơn hàng từ Ads với attribution data.
 *
 * Props:
 *   orders    — mảng attribution rows (đã filter)
 *   campaigns — mảng campaign object (từ mockCampaigns)
 *   onOrderClick(order) — callback khi click vào dòng order
 *   pageSize  — số dòng mỗi trang (default 20)
 */
export function AdsOrderTable({
  orders = [],
  campaigns = [],
  onOrderClick,
  pageSize = 20,
}) {
  const [statusFilter, setStatusFilter] = useState('all');   // 'all' | 'matched' | 'untracked'
  const [campaignFilter, setCampaignFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  // Build campaign map
  const campMap = useMemo(() => {
    const m = {};
    for (const c of campaigns) m[c.id] = c;
    return m;
  }, [campaigns]);

  // Unique campaign list for dropdown
  const campaignList = useMemo(() => {
    const ids = [...new Set(orders.map(o => o.campaignId))];
    return ids.map(id => campMap[id] || { id, name: id });
  }, [orders, campMap]);

  // Filter rows
  const filtered = useMemo(() => {
    let rows = orders;

    // Status filter
    if (statusFilter === 'matched') {
      rows = rows.filter(r => r.matchedConversationId !== null);
    } else if (statusFilter === 'untracked') {
      rows = rows.filter(r => r.matchedConversationId === null);
    }

    // Campaign filter
    if (campaignFilter !== 'all') {
      rows = rows.filter(r => r.campaignId === campaignFilter);
    }

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(r =>
        r.orderId.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }

    return rows;
  }, [orders, statusFilter, campaignFilter, search]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Summary
  const matchedRows = orders.filter(r => r.matchedConversationId !== null);
  const untrackedRows = orders.filter(r => r.matchedConversationId === null);
  const matchedRevenue = matchedRows.reduce((s, r) => s + r.orderValue, 0);
  const untrackedRevenue = untrackedRows.reduce((s, r) => s + r.orderValue, 0);

  // Status chips
  const statusChips = [
    { key: 'all', label: 'Tất cả', count: orders.length },
    { key: 'matched', label: 'Matched ✅', count: matchedRows.length },
    { key: 'untracked', label: 'Untracked ⚠️', count: untrackedRows.length },
  ];

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-on-surface-variant">
        <div className="text-center">
          <div className="text-4xl mb-2">📦</div>
          <p className="text-body-sm">Không có đơn hàng nào.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0 rounded-[--radius-lg] overflow-hidden"
      style={{ border: '1px solid var(--color-outline-variant)' }}>

      {/* ─── Header ─── */}
      <div className="px-4 py-3 flex items-center justify-between shrink-0"
        style={{ background: 'var(--color-surface-container-low)', borderBottom: '1px solid var(--color-outline-variant)' }}>
        <h3 className="text-label-sm font-semibold text-on-surface flex items-center gap-2">
          📦 Đơn hàng từ Ads
          <span className="text-label-xs font-normal px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}>
            {orders.length}
          </span>
        </h3>

        {/* Campaign dropdown */}
        <select
          value={campaignFilter}
          onChange={e => { setCampaignFilter(e.target.value); setPage(0); }}
          className="text-[12px] px-2 py-1 rounded-[--radius-md] bg-surface-container-high text-on-surface
            focus:outline-none focus:ring-0 border-b-2 border-tertiary cursor-pointer"
        >
          <option value="all">Tất cả chiến dịch</option>
          {campaignList.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* ─── Filter + Search Bar ─── */}
      <div className="px-4 py-2.5 flex items-center gap-3 shrink-0"
        style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>

        {/* Status chips */}
        <div className="flex items-center gap-1.5">
          {statusChips.map(chip => (
            <button
              key={chip.key}
              onClick={() => { setStatusFilter(chip.key); setPage(0); }}
              className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer',
                statusFilter === chip.key
                  ? 'bg-tertiary text-white shadow-[--shadow-sm]'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              )}
            >
              {chip.label}
              <span className="text-[10px] opacity-75">{chip.count}</span>
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Search */}
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
            width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Tìm Order ID hoặc SĐT..."
            className="pl-8 pr-3 py-1.5 rounded-[--radius-md] text-[12px] bg-surface-container-high text-on-surface
              placeholder:text-on-surface-variant/50
              focus:outline-none focus:ring-0 border-b-2 border-tertiary w-48"
          />
        </div>
      </div>

      {/* ─── Table ─── */}
      <div className="overflow-x-auto">
        <table className="w-full text-[12px]">
          <thead>
            <tr className="text-left" style={{ background: 'var(--color-surface-container-low)' }}>
              {[
                { label: 'Order ID', key: 'orderId' },
                { label: 'SĐT', key: 'phone' },
                { label: 'Giá trị', key: 'orderValue' },
                { label: 'Ngày', key: 'orderDate' },
                { label: 'Attribution', key: 'attribution' },
                { label: 'Touches', key: 'touches' },
                { label: 'Trạng thái', key: 'status' },
              ].map(col => (
                <th key={col.key}
                  className="px-3 py-2 text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide whitespace-nowrap">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-on-surface-variant">
                  Không có kết quả phù hợp.
                </td>
              </tr>
            ) : pageRows.map(row => {
              const isUntracked = row.matchedConversationId === null;
              const campaign = campMap[row.campaignId];

              return (
                <tr
                  key={row.id}
                  onClick={() => onOrderClick?.(row)}
                  className={cn(
                    'cursor-pointer transition-colors',
                    isUntracked
                      ? 'bg-[rgba(220,38,38,0.04)] hover:bg-[rgba(220,38,38,0.08)]'
                      : 'hover:bg-surface-container-low',
                    // No border between rows — tonal spacing
                  )}
                  style={{ borderBottom: '1px solid var(--color-outline-variant)/30' }}
                >
                  {/* Order ID */}
                  <td className="px-3 py-2.5">
                    <span className="font-semibold text-tertiary hover:underline">
                      {row.orderId}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="px-3 py-2.5 text-on-surface-variant font-mono text-[11px]">
                    {row.phone}
                  </td>

                  {/* Value */}
                  <td className="px-3 py-2.5 font-semibold text-on-surface">
                    {formatVND(row.orderValue)}
                  </td>

                  {/* Date */}
                  <td className="px-3 py-2.5 text-on-surface-variant">
                    {formatDate(row.orderDate)}
                  </td>

                  {/* Attribution */}
                  <td className="px-3 py-2.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-semibold text-on-surface">
                        {row.firstTouch.campaignId === row.lastTouch.campaignId
                          ? row.firstTouch.campaignName
                          : row.lastTouch.campaignName}
                      </span>
                      <div className="flex gap-1.5">
                        {row.firstTouch.campaignId === row.lastTouch.campaignId ? (
                          <span className="text-[10px] text-on-surface-variant">Last + First</span>
                        ) : (
                          <>
                            <span className="text-[10px] text-[#059669] font-semibold">First: {row.firstTouch.campaignId}</span>
                            <span className="text-[10px] text-[#0052FF] font-semibold">Last: {row.lastTouch.campaignId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Touches count */}
                  <td className="px-3 py-2.5 text-center">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                      style={{
                        background: 'var(--color-surface-container-high)',
                        color: 'var(--color-on-surface-variant)',
                      }}>
                      {row.touches.length}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-2.5">
                    {isUntracked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#dc2626]">
                        ⚠️ Untracked
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#059669]">
                        ✅ Matched
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ─── Pagination ─── */}
      <div className="px-4 py-2.5 flex items-center justify-between shrink-0"
        style={{ borderTop: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
        <span className="text-[11px] text-on-surface-variant">
          Trang {currentPage + 1} / {totalPages} — {filtered.length} đơn hàng
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer',
              currentPage === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-low'
            )}
          >
            ← Trước
          </button>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className={cn(
              'px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer',
              currentPage >= totalPages - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-surface-container-high text-on-surface hover:bg-surface-container-low'
            )}
          >
            Sau →
          </button>
        </div>
      </div>

      {/* ─── Summary Footer ─── */}
      <div className="px-4 py-3 grid grid-cols-2 lg:grid-cols-4 gap-3 shrink-0"
        style={{ borderTop: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
        <SummaryItem label="Matched" value={matchedRows.length} color="#059669" />
        <SummaryItem label="Untracked" value={untrackedRows.length} color="#dc2626" />
        <SummaryItem label="Doanh thu Matched" value={formatVND(matchedRevenue)} color="#059669" />
        <SummaryItem label="Doanh thu Untracked" value={formatVND(untrackedRevenue)} color="#dc2626" />
      </div>
    </div>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function SummaryItem({ label, value, color }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-on-surface-variant uppercase tracking-wide">{label}</span>
      <span className="text-[14px] font-bold" style={{ color }}>{value}</span>
    </div>
  );
}

function formatVND(amount) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1).replace(/\.0$/, '')}Mđ`;
  }
  return `${(amount / 1000).toFixed(0)}Kđ`;
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

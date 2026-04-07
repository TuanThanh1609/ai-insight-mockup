import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

const PAGE_SIZE = 10;

function formatTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now - d;
  const diffH = Math.floor(diffMs / 3600000);
  const diffD = Math.floor(diffMs / 86400000);
  if (diffH < 1) return 'Vừa xong';
  if (diffH < 24) return `${diffH}h trước`;
  if (diffD === 1) return 'Hôm qua';
  if (diffD < 7) return `${diffD} ngày trước`;
  return d.toLocaleDateString('vi');
}

function formatLastMessage(customer, temperature, phoneStatus, isJunk, isReturning) {
  const tags = [];
  if (temperature) tags.push(temperature === 'Nóng' ? 'NÓNG' : temperature === 'Ấm' ? 'ẤM' : 'LẠNH');
  if (phoneStatus === 'Đã cho SĐT') tags.push('Đã thu SĐT');
  if (isJunk) tags.push('JUNK');
  if (isReturning) tags.push('KH cũ');
  if (tags.length === 0) return null;
  return tags;
}

function ConversationRow({ row }) {
  const tags = formatLastMessage(row.customer, row.temperature, row.phone_status, row.is_junk, row.is_returning_customer);
  const isJunk = row.is_junk === true || row.is_junk === 'true';
  const isHot = row.temperature === 'Nóng';

  return (
    <div className={cn(
      'rounded-md overflow-hidden border transition-colors',
      'hover:border-[var(--color-outline-variant)]',
      isJunk ? 'border-red-200/50 bg-red-50/30' : 'border-[var(--color-outline-variant)]/50 bg-surface-container-lowest'
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Avatar circle */}
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-body-sm font-bold',
          isJunk ? 'bg-red-100 text-red-600' : 'bg-surface-container text-on-surface-variant'
        )}>
          {row.customer ? row.customer.charAt(0).toUpperCase() : '?'}
        </div>

        {/* Customer + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-body-sm font-medium text-on-surface truncate">
              {row.customer || 'Khách ẩn danh'}
            </span>
            <span className="text-body-xs text-on-surface-variant shrink-0">
              {formatTime(row.converted_at)}
            </span>
          </div>
          {/* Product info if available */}
          {row.product && (
            <span className="text-body-xs text-on-surface-variant/70">
              Sp: {row.product}
              {row.size && ` · Size: ${row.size}`}
              {row.treatment && ` · DV: ${row.treatment}`}
              {row.destination && ` · ${row.destination}`}
            </span>
          )}
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {tags ? tags.map(tag => {
            const tagConfig = {
              'NÓNG':    { bg: 'rgba(5,150,105,0.12)', color: '#059669', label: 'NÓNG' },
              'ẤM':     { bg: 'rgba(217,119,6,0.12)', color: '#d97706', label: 'ẤM' },
              'LẠNH':   { bg: 'rgba(28,27,29,0.08)', color: '#49454f', label: 'LẠNH' },
              'Đã thu SĐT': { bg: 'rgba(0,82,255,0.1)', color: '#0052FF', label: 'Đã thu SĐT' },
              'JUNK':    { bg: 'rgba(220,38,38,0.1)', color: '#dc2626', label: 'JUNK' },
              'KH cũ':  { bg: 'rgba(191,48,3,0.1)', color: '#BF3003', label: 'KH cũ' },
            };
            const cfg = tagConfig[tag] || { bg: 'rgba(28,27,29,0.08)', color: '#49454f', label: tag };
            return (
              <span
                key={tag}
                className="text-label-xs font-semibold px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}
              >
                {cfg.label}
              </span>
            );
          }) : null}
          {isJunk && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          )}
        </div>
      </div>

      {/* Pain point / note if available */}
      {(row.pain_point || row.objection) && (
        <div className="px-4 pb-3">
          <p className="text-body-xs text-on-surface-variant/80 bg-surface-container-low rounded px-2 py-1.5 leading-relaxed">
            💬 {row.pain_point || row.objection}
          </p>
        </div>
      )}
    </div>
  );
}

function Pagination({ total, pageSize, currentPage, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between pt-3">
      <span className="text-body-xs text-on-surface-variant">
        {total} hội thoại
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded text-body-xs text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 transition-colors cursor-pointer"
        >
          ‹
        </button>
        {pages.map(p => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded text-body-xs transition-colors cursor-pointer',
              p === currentPage
                ? 'bg-primary text-on-primary font-semibold'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded text-body-xs text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 transition-colors cursor-pointer"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export function ConversationList({ conversations, disease }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);

  // Filter options based on disease type
  const filterOptions = useMemo(() => {
    const base = [
      { value: 'all', label: 'Tất' },
    ];
    if (disease?.id === 'lead-quality') {
      return [
        ...base,
        { value: 'junk', label: 'Junk' },
        { value: 'has_phone', label: 'Có SĐT' },
        { value: 'hot', label: 'Nóng' },
        { value: 'returning', label: 'KH cũ' },
      ];
    }
    return base;
  }, [disease?.id]);

  // Apply filters
  const filtered = useMemo(() => {
    let rows = conversations;

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        (r.customer || '').toLowerCase().includes(q) ||
        (r.product || '').toLowerCase().includes(q) ||
        (r.pain_point || '').toLowerCase().includes(q) ||
        (r.objection || '').toLowerCase().includes(q) ||
        (r.treatment || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filter === 'junk') {
      rows = rows.filter(r => r.is_junk === true || r.is_junk === 'true');
    } else if (filter === 'has_phone') {
      rows = rows.filter(r =>
        r.phone_status === 'Đã cho SĐT' || r.phone_status === 'Có SĐT'
      );
    } else if (filter === 'hot') {
      rows = rows.filter(r => r.temperature === 'Nóng');
    } else if (filter === 'returning') {
      rows = rows.filter(r => r.is_returning_customer === true || r.is_returning_customer === 'true');
    }

    return rows;
  }, [conversations, search, filter]);

  // Paginate
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleFilter = (val) => {
    setFilter(val);
    setPage(1);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search + filter bar */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50"
            width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm hội thoại..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-body-sm bg-surface-container-high rounded-md
                       border-none outline-none focus:ring-2 focus:ring-tertiary/30
                       placeholder:text-on-surface-variant/50 text-on-surface"
          />
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 shrink-0">
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => handleFilter(opt.value)}
              className={cn(
                'px-2.5 py-1 rounded-full text-label-xs font-semibold transition-all cursor-pointer whitespace-nowrap',
                filter === opt.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {filtered.length !== conversations.length && (
        <p className="text-body-xs text-on-surface-variant">
          Hiển thị {filtered.length} / {conversations.length} hội thoại
        </p>
      )}

      {/* Conversation list */}
      {paginated.length === 0 ? (
        <div className="py-10 text-center">
          <span className="text-3xl">🔍</span>
          <p className="text-body-sm text-on-surface-variant/60 mt-2">Không tìm thấy hội thoại phù hợp</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {paginated.map((row, idx) => (
            <ConversationRow key={row.id || idx} row={row} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination
        total={filtered.length}
        pageSize={PAGE_SIZE}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  );
}

import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';

/**
 * AdsConversationDetailPanel
 *
 * 2-column layout cho Ads Attribution detail:
 *   CỘT TRÁI  (40%): Danh sách hội thoại đã match
 *   CỘT PHẢI (60%): Chi tiết hội thoại — 3 tab:
 *     [Tin nhắn] [Đánh Giá] [Hành Động]
 *   + Attribution Chain ở cuối cột phải
 *
 * Props:
 *   conversations  — mảng attribution rows (đã filter, đã match)
 *   attributionData — full attribution rows (for order reference)
 *   campaigns     — mảng campaign object
 */
export function AdsConversationDetailPanel({
  conversations = [],
  attributionData = [],
  campaigns = [],
}) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'evaluation' | 'actions'
  const [tempFilter, setTempFilter] = useState('all');   // 'all' | 'Nóng' | 'Ấm' | 'Lạnh'
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 20;

  // Build campaign map
  const campMap = useMemo(() => {
    const m = {};
    for (const c of campaigns) m[c.id] = c;
    return m;
  }, [campaigns]);

  // Filter conversations (only matched ones)
  const matched = useMemo(() => {
    return conversations.filter(r => r.matchedConversationId !== null);
  }, [conversations]);

  // Apply filters
  const filtered = useMemo(() => {
    let rows = matched;
    if (tempFilter !== 'all') {
      rows = rows.filter(r => r.matchedConversationTemp === tempFilter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(r =>
        r.orderId.toLowerCase().includes(q) ||
        r.phone.includes(q)
      );
    }
    return rows;
  }, [matched, tempFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const pageRows = filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // Auto-select first item
  const selected = useMemo(() => {
    if (selectedIdx === null && filtered.length > 0) {
      // Use setTimeout to avoid "cannot update during existing state transition"
      setTimeout(() => setSelectedIdx(0), 0);
      return filtered[0];
    }
    return filtered[selectedIdx] || filtered[0] || null;
  }, [filtered, selectedIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  if (matched.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-on-surface-variant">
        <div className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-body-sm">Không có hội thoại nào được match.</p>
          <p className="text-[12px] text-on-surface-variant mt-1">Chỉ hiển thị hội thoại đã match đơn hàng (có SĐT).</p>
        </div>
      </div>
    );
  }

  // Temp counts
  const tempCounts = {
    all: matched.length,
    Nóng: matched.filter(r => r.matchedConversationTemp === 'Nóng').length,
    'Ấm': matched.filter(r => r.matchedConversationTemp === 'Ấm').length,
    'Lạnh': matched.filter(r => r.matchedConversationTemp === 'Lạnh').length,
  };

  return (
    <div className="flex flex-col xl:flex-row gap-0 rounded-lg overflow-hidden"
      style={{ border: '1px solid var(--color-outline-variant)' }}>

      {/* ══════════════════════════════════════════ */}
      {/* CỘT TRÁI — Danh sách hội thoại (40%)   */}
      {/* ══════════════════════════════════════════ */}
      <div className="xl:w-[40%] flex flex-col"
        style={{ borderRight: '1px solid var(--color-outline-variant)' }}>

        {/* Header */}
        <div className="px-3 py-2 flex items-center justify-between shrink-0"
          style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
          <div>
            <h4 className="text-label-xs font-semibold text-on-surface uppercase tracking-wide">Hội thoại phát sinh</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              {matched.length} cuộc trò chuyện đã match
            </p>
          </div>
          {/* Temp filter chips */}
          <div className="flex gap-1">
            <TempChipBtn label="Nóng" count={tempCounts['Nóng']} color="#059669"
              active={tempFilter === 'Nóng'} onClick={() => { setTempFilter('Nóng'); setPage(0); }} />
            <TempChipBtn label="Ấm" count={tempCounts['Ấm']} color="#d97706"
              active={tempFilter === 'Ấm'} onClick={() => { setTempFilter('Ấm'); setPage(0); }} />
            <TempChipBtn label="Lạnh" count={tempCounts['Lạnh']} color="#6b7280"
              active={tempFilter === 'Lạnh'} onClick={() => { setTempFilter('Lạnh'); setPage(0); }} />
          </div>
        </div>

        {/* Note */}
        <div className="px-3 py-1.5 shrink-0"
          style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'rgba(0,82,255,0.04)' }}>
          <p className="text-[10px] text-tertiary font-semibold flex items-center gap-1">
            🔗 Chỉ hiển thị: Hội thoại đã match đơn hàng (có SĐT)
          </p>
        </div>

        {/* Search */}
        <div className="px-3 py-2 shrink-0"
          style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            placeholder="Tìm SĐT hoặc Order ID..."
            className="w-full px-2.5 py-1.5 rounded-md text-[12px] text-on-surface
              bg-surface-container-high
              placeholder:text-on-surface-variant/50
              focus:outline-none focus:ring-0
              border-b-2 border-tertiary"
          />
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '480px' }}>
          {pageRows.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-on-surface-variant text-[12px]">
              Không có kết quả.
            </div>
          ) : pageRows.map((conv, idx) => {
            const globalIdx = filtered.indexOf(conv);
            return (
              <AdsConvListItem
                key={conv.id}
                conv={conv}
                isSelected={selected?.id === conv.id}
                onClick={() => setSelectedIdx(globalIdx)}
                campMap={campMap}
              />
            );
          })}
        </div>

        {/* Pagination */}
        <div className="px-3 py-2 flex items-center justify-between shrink-0"
          style={{ borderTop: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
          <span className="text-[10px] text-on-surface-variant">
            {filtered.length} kết quả
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className={cn('px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer',
                currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-low'
              )}
            >
              ←
            </button>
            <span className="text-[10px] text-on-surface-variant">
              {currentPage + 1}/{totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
              className={cn('px-2 py-0.5 rounded text-[10px] font-semibold transition-all cursor-pointer',
                currentPage >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-low'
              )}
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* CỘT PHẢI — Chi tiết hội thoại (60%)    */}
      {/* ══════════════════════════════════════════ */}
      <div className="xl:flex-1 flex flex-col min-w-0">

        {/* Customer header */}
        {selected && (
          <div className="px-4 py-2.5 shrink-0"
            style={{ borderBottom: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={tempStyle(selected.matchedConversationTemp)}>
                  {selected.phone.substring(0, 3)}
                </div>
                <div className="min-w-0">
                  <h3 className="text-label-sm font-semibold text-on-surface truncate">
                    {maskName(selected.phone)}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PlatformBadge platform={selected.platform} />
                    <span className="text-label-xs text-on-surface-variant">
                      {formatDate(selected.conversationDate)} · {formatTime(selected.conversationDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order info + Temperature */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span className="text-[11px] font-semibold text-tertiary">
                  {selected.orderId}
                </span>
                <span className="text-[13px] font-bold text-on-surface">
                  {formatVND(selected.orderValue)}
                </span>
                <TempBadge temp={selected.matchedConversationTemp} />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5 pt-3 pb-0 shrink-0">
          <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-0.5 w-fit">
            {[
              { key: 'messages', label: 'Tin nhắn' },
              { key: 'evaluation', label: 'Đánh Giá' },
              { key: 'actions', label: 'Hành Động' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap',
                  activeTab === tab.key
                    ? 'bg-surface-container-lowest text-on-surface shadow-[--shadow-sm]'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto px-5 pb-5 pt-3"
          style={{ maxHeight: '380px' }}>
          {selected && activeTab === 'messages' && (
            <AdsMessagesTab conv={selected} />
          )}
          {selected && activeTab === 'evaluation' && (
            <AdsEvaluationTab conv={selected} campMap={campMap} />
          )}
          {selected && activeTab === 'actions' && (
            <AdsActionsTab conv={selected} />
          )}
        </div>

        {/* ─── Attribution Chain ─── */}
        {selected && (
          <div className="px-5 pb-4 shrink-0"
            style={{ borderTop: '1px solid var(--color-outline-variant)', background: 'var(--color-surface-container-low)' }}>
            <AttributionChain conv={selected} campMap={campMap} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TempChipBtn({ label, count, color, active, onClick }) {
  if (count === 0) return null;
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer',
        active
          ? 'text-white shadow-[--shadow-sm]'
          : 'opacity-70 hover:opacity-100'
      )}
      style={active ? { backgroundColor: color } : { backgroundColor: `${color}25`, color }}>
      {count}
    </button>
  );
}

function AdsConvListItem({ conv, isSelected, onClick, campMap }) {
  const tempColor = tempColorMap(conv.matchedConversationTemp);

  return (
    <div
      onClick={onClick}
      className={cn(
        'px-3 py-2.5 cursor-pointer transition-all',
        'hover:bg-surface-container-low',
        isSelected && 'bg-surface-container-low'
      )}
      style={isSelected ? { borderLeft: '3px solid var(--color-tertiary)' } : { borderLeft: '3px solid transparent' }}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
          style={{ background: `${tempColor}20`, color: tempColor }}>
          {conv.phone.substring(0, 3)}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-on-surface truncate">
              {maskName(conv.phone)}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-bold" style={{ color: tempColor }}>
                {conv.matchedConversationTemp === 'Nóng' ? '🔴' : conv.matchedConversationTemp === 'Ấm' ? '🟡' : '⚪'}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {formatTime(conv.conversationDate)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] text-on-surface-variant font-mono">
              {conv.phone}
            </span>
            <span className="text-[11px] font-bold text-tertiary">
              {formatVND(conv.orderValue)}
            </span>
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            <PlatformBadge platform={conv.platform} />
            <span className="text-[10px] px-1 py-0.5 rounded font-semibold"
              style={{ background: `${tempColor}15`, color: tempColor }}>
              {conv.matchedConversationTemp}
            </span>
            <span className="text-[10px] px-1 py-0.5 rounded"
              style={{ background: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }}>
              {conv.touches.length} touches
            </span>
            {conv.firstTouch.campaignId !== conv.lastTouch.campaignId && (
              <span className="text-[10px] px-1 py-0.5 rounded"
                style={{ background: 'rgba(0,82,255,0.08)', color: 'var(--color-tertiary)' }}>
                Multi-touch
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Tin nhắn ─────────────────────────────────────────────────────────

const DUMMY_MESSAGES = {
  Nóng: {
    customer: [
      { text: 'Shop ơi, cho mình hỏi sản phẩm này còn size M không?', time: '10:15' },
      { text: 'Mình lấy 2 cái, giao cho mình nhé', time: '10:17' },
      { text: 'Mình đặt rồi, shop nhận đơn chưa?', time: '10:22' },
    ],
    shop: [
      { text: 'Dạ chào anh/chị! Sản phẩm ạ, để em kiểm tra ngay ạ.', time: '10:16' },
      { text: 'Dạ còn ạ! Em đặt giữ cho anh/chị ngay. Anh/chị cho em xin địa chỉ giao hàng ạ.', time: '10:18' },
      { text: 'Đơn hàng đã xác nhận ạ! Mình thanh toán qua link này nhé:', time: '10:23' },
    ],
  },
  'Ấm': {
    customer: [
      { text: 'Chào shop, sản phẩm này có giảm giá không?', time: '14:05' },
      { text: 'Giá này ship về Đà Nẵng thì bao nhiêu vậy?', time: '14:08' },
      { text: '�ể mình suy nghĩ thêm rồi rep lại shop sau nhé', time: '14:12' },
    ],
    shop: [
      { text: 'Dạ chào anh/chị! Hiện đang có chương trình giảm 15% ạ.', time: '14:06' },
      { text: 'Em tính phí ship về Đà Nẵng là 25K ạ, đơn trên 500K thì miễn phí ạ.', time: '14:09' },
      { text: 'Dạ không sao ạ! Anh/chị cứ cần là ib em nhé, em luôn sẵn sàng tư vấn ạ.', time: '14:13' },
    ],
  },
  'Lạnh': {
    customer: [
      { text: 'Xem qua', time: '09:01' },
      { text: 'Không cần nữa', time: '09:05' },
    ],
    shop: [
      { text: 'Dạ chào anh/chị! Shop có thể hỗ trợ gì ạ?', time: '09:02' },
      { text: 'Dạ, không sao ạ! Anh/chị cần thì cứ ib shop nhé.', time: '09:06' },
    ],
  },
};

function AdsMessagesTab({ conv }) {
  const temp = conv.matchedConversationTemp || 'Ấm';
  const messages = DUMMY_MESSAGES[temp] || DUMMY_MESSAGES['Ấm'];

  // Merge customer + shop messages into chronological order
  const merged = [];
  const customerMsgs = [...messages.customer];
  const shopMsgs = [...messages.shop];

  // Simple interleave: customer first, then shop
  let ci = 0, si = 0;
  while (ci < customerMsgs.length || si < shopMsgs.length) {
    if (ci < customerMsgs.length) {
      merged.push({ ...customerMsgs[ci], sender: 'customer' });
      ci++;
    }
    if (si < shopMsgs.length) {
      merged.push({ ...shopMsgs[si], sender: 'shop' });
      si++;
    }
  }

  const msgColors = {
    customer: { bg: 'var(--color-surface-container-high)', text: 'var(--color-on-surface)', align: 'flex-start' },
    shop: { bg: 'rgba(0,82,255,0.10)', text: 'var(--color-tertiary)', align: 'flex-end' },
  };

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[11px] text-on-surface-variant">
          {customerMsgs.length} tin khách
        </span>
        <span className="text-on-surface-variant/40">·</span>
        <span className="text-[11px] text-on-surface-variant">
          {shopMsgs.length} tin shop
        </span>
        <span className="text-on-surface-variant/40">·</span>
        <span className="text-[11px] text-on-surface-variant">
          {merged.length} tin nhắn
        </span>
      </div>

      {/* Message bubbles */}
      <div className="space-y-3">
        {merged.map((msg, idx) => {
          const isCustomer = msg.sender === 'customer';
          const style = msgColors[msg.sender];

          return (
            <div key={idx} className="flex flex-col gap-0.5"
              style={{ alignItems: isCustomer ? 'flex-start' : 'flex-end' }}>
              <div className="flex items-center gap-2" style={{ alignSelf: isCustomer ? 'flex-start' : 'flex-end' }}>
                <span className="text-[11px] text-on-surface-variant">
                  {isCustomer ? maskName(conv.phone) : 'Shop'}
                </span>
                <span className="text-[11px] text-on-surface-variant/60">{msg.time}</span>
              </div>
              <div
                className="max-w-[80%] px-3 py-2 rounded-2xl text-[13px] leading-snug"
                style={{
                  backgroundColor: style.bg,
                  color: style.text,
                  borderBottomLeftRadius: isCustomer ? '4px' : '12px',
                  borderBottomRightRadius: isCustomer ? '12px' : '4px',
                }}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Attribution note */}
      <div className="mt-4 pt-3 flex items-center gap-2 px-3 py-2 rounded-md"
        style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
        <span className="text-[11px] text-on-surface-variant">
          📌 Đơn hàng <span className="font-semibold text-tertiary">{conv.orderId}</span> được ghi nhận sau cuộc trò chuyện này.
        </span>
        <span className="text-[11px] font-semibold text-[#059669]">
          {formatVND(conv.orderValue)}
        </span>
      </div>
    </div>
  );
}

// ─── Tab: Đánh Giá ─────────────────────────────────────────────────────────

function AdsEvaluationTab({ conv, campMap }) {
  const temp = conv.matchedConversationTemp || 'Ấm';
  const tempColor = tempColorMap(temp);

  const items = [
    {
      label: 'Mức độ quan tâm',
      value: temp,
      color: tempColor,
      bg: `${tempColor}12`,
      description: temp === 'Nóng'
        ? 'Khách hỏi giá + xin SĐT + muốn mua ngay, chốt đơn nhanh'
        : temp === 'Ấm'
          ? 'Khách đang tư vấn, có quan tâm nhưng chưa chốt trực tiếp'
          : 'Khách seen không rep hoặc từ chối trực tiếp',
    },
    {
      label: 'Thu thập SĐT',
      value: conv.matchedConversationId ? 'Đã thu thập' : 'Chưa xác định',
      color: conv.matchedConversationId ? '#059669' : '#dc2626',
      bg: conv.matchedConversationId ? 'rgba(5,150,105,0.06)' : 'rgba(220,38,38,0.06)',
      description: `SĐT: ${conv.phone} — dùng để match với đơn hàng`,
    },
    {
      label: 'Loại khách hàng',
      value: conv.matchedConversationId ? 'Khách thật' : 'Chưa xác định',
      color: conv.matchedConversationId ? '#059669' : '#d97706',
      bg: conv.matchedConversationId ? 'rgba(5,150,105,0.06)' : 'rgba(217,119,6,0.06)',
      description: conv.matchedConversationId
        ? 'Hội thoại được match với đơn hàng thành công'
        : 'Hội thoại chưa có dữ liệu match',
    },
    {
      label: 'Nền tảng',
      value: conv.platform === 'facebook' ? 'Facebook' : 'Zalo',
      color: conv.platform === 'facebook' ? '#1877F2' : '#0078D4',
      bg: conv.platform === 'facebook' ? 'rgba(24,119,242,0.06)' : 'rgba(0,120,220,0.06)',
      description: conv.platform === 'facebook' ? 'Hội thoại qua Messenger Facebook' : 'Hội thoại qua Zalo OA',
    },
    {
      label: 'Attribution Model',
      value: conv.firstTouch.campaignId === conv.lastTouch.campaignId ? 'Last Touch' : 'Multi-Touch',
      color: '#0052FF',
      bg: 'rgba(0,82,255,0.06)',
      description: conv.firstTouch.campaignId === conv.lastTouch.campaignId
        ? `Đơn hàng được ghi nhận từ chiến dịch cuối cùng: ${conv.lastTouch.campaignName}`
        : `First: ${conv.firstTouch.campaignName} → Last: ${conv.lastTouch.campaignName}`,
    },
    {
      label: 'Số Touches',
      value: `${conv.touches.length} sự kiện`,
      color: '#7c3aed',
      bg: 'rgba(124,58,237,0.06)',
      description: `Chuỗi hành trình khách: ${conv.touches.map(t => `${t.type}(${t.campaignId})`).join(' → ')}`,
    },
  ];

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-on-surface-variant mb-2 uppercase tracking-wide">
        Đánh giá tự động từ AI Engine
      </p>

      {items.map((item, idx) => (
        <div key={idx} className="rounded-md px-3 py-2"
          style={{ backgroundColor: item.bg, border: `1px solid ${item.color}20` }}>
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
              style={{ backgroundColor: item.color }} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-0.5">
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wide">
                  {item.label}
                </span>
                <span className="text-[13px] font-bold" style={{ color: item.color }}>
                  {item.value}
                </span>
              </div>
              <p className="text-[12px] text-on-surface-variant leading-snug">
                {item.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* AI confidence */}
      <div className="flex items-center justify-between pt-1.5">
        <span className="text-[11px] text-on-surface-variant">Độ chính xác AI</span>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1 bg-surface-container-high rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '91%', backgroundColor: '#059669' }} />
          </div>
          <span className="text-[11px] font-bold text-[#059669]">91%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Hành Động ─────────────────────────────────────────────────────────

function AdsActionsTab({ conv }) {
  const temp = conv.matchedConversationTemp || 'Ấm';

  // Generate actions based on temperature and touches
  const actions = generateActions(conv, temp);

  const severityConfig = {
    success: { color: '#059669', bg: 'rgba(5,150,105,0.06)', border: 'rgba(5,150,105,0.20)', label: '✓ Thành công' },
    info: { color: '#0052FF', bg: 'rgba(0,82,255,0.06)', border: 'rgba(0,82,255,0.20)', label: '→ Gợi ý' },
    warning: { color: '#d97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.20)', label: '⚠ Cảnh báo' },
    error: { color: '#dc2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.20)', label: '✗ Lỗi' },
    neutral: { color: '#6b7280', bg: 'rgba(107,114,128,0.06)', border: 'rgba(107,114,128,0.20)', label: '○ Ghi nhận' },
  };

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-on-surface-variant mb-2 uppercase tracking-wide">
        Nhận định từ AI Engine
      </p>

      {actions.map((action, idx) => {
        const cfg = severityConfig[action.severity] || severityConfig.neutral;
        return (
          <div key={idx} className="rounded-md px-3 py-2.5"
            style={{ backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
            <div className="flex items-start gap-2 mb-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 mt-0.5"
                style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}>
                {action.severity === 'success' && '✓'}
                {action.severity === 'info' && '→'}
                {action.severity === 'warning' && '!'}
                {action.severity === 'error' && '✗'}
                {action.severity === 'neutral' && '○'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <h4 className="text-[13px] font-semibold text-on-surface mt-0.5 leading-snug">
                  {action.label}
                </h4>
              </div>
            </div>
            <p className="text-[12px] text-on-surface-variant leading-snug pl-7">
              {action.description}
            </p>
          </div>
        );
      })}

      {/* Summary */}
      <div className="rounded-md px-3 py-2.5 mt-2"
        style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-on-surface-variant">Tổng hành động</span>
          <span className="text-[13px] font-bold text-on-surface">{actions.length}</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[11px] text-on-surface-variant">Cần xử lý ngay</span>
          <span className="text-[13px] font-bold"
            style={{ color: actions.some(a => a.severity === 'error' || a.severity === 'warning') ? '#dc2626' : '#059669' }}>
            {actions.filter(a => a.severity === 'error' || a.severity === 'warning').length}
          </span>
        </div>
      </div>
    </div>
  );
}

function generateActions(conv, temp) {
  const actions = [];

  if (temp === 'Nóng') {
    actions.push({
      severity: 'success',
      label: 'Xác nhận đơn hàng thành công',
      description: `Đơn hàng ${conv.orderId} trị giá ${formatVND(conv.orderValue)} đã được tạo. Khách hàng có mức độ quan tâm Nóng — nên theo dõi giao hàng và chăm sóc sau mua.`,
    });
    if (conv.firstTouch.campaignId !== conv.lastTouch.campaignId) {
      actions.push({
        severity: 'info',
        label: 'Multi-touch attribution detected',
        description: `Chiến dịch ${conv.firstTouch.campaignId} (First) và ${conv.lastTouch.campaignId} (Last) đều có đóng góp. Nên scale cả 2 chiến dịch.`,
      });
    }
  } else if (temp === 'Ấm') {
    actions.push({
      severity: 'info',
      label: 'Thu thập SĐT — cần nuôi dưỡng',
      description: `Khách có mức độ quan tâm Ấm, đã cung cấp SĐT nhưng chưa chốt đơn. Nên gửi tin nhắn chăm sóc trong 24h.`,
    });
    actions.push({
      severity: 'info',
      label: 'Đề xuất retargeting',
      description: `Chiến dịch ${conv.lastTouch.campaignId} đã tiếp cận khách này gần đây. Cân nhắc chạy retargeting để đẩy chốt đơn.`,
    });
  } else {
    actions.push({
      severity: 'warning',
      label: 'Khách không phản hồi hoặc từ chối',
      description: `Mức độ quan tâm Lạnh — khách đã seen tin hoặc từ chối. Không nên push quá mạnh trong tuần tới.`,
    });
    if (conv.firstTouch.campaignId === conv.lastTouch.campaignId) {
      actions.push({
        severity: 'neutral',
        label: 'Xem xét tối ưu creative',
        description: `Chiến dịch ${conv.lastTouch.campaignId} có thể không phù hợp với audience này. Thử A/B test với message khác.`,
      });
    }
  }

  return actions;
}

// ─── Attribution Chain ────────────────────────────────────────────────────────

function AttributionChain({ conv, campMap }) {
  const touches = conv.touches || [];
  const campaign = campMap[conv.campaignId];

  return (
    <div className="pt-3 pb-1">
      <div className="text-[11px] font-semibold text-on-surface uppercase tracking-wide mb-3 flex items-center gap-2">
        📌 ATTRIBUTION CHAIN
      </div>

      <div className="space-y-1.5 mb-3">
        {touches.map((touch, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{
                  background: touch.type === 'click' ? 'rgba(0,82,255,0.12)' : 'rgba(107,114,128,0.12)',
                  color: touch.type === 'click' ? '#0052FF' : '#6b7280',
                }}>
                {idx + 1}
              </div>
              {idx < touches.length - 1 && (
                <div className="w-px flex-1 mt-0.5" style={{ background: 'var(--color-outline-variant)' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-on-surface">
                {touch.type === 'click' ? '↓ Click' : '⬜ Impression'} <span className="font-normal text-tertiary">{touch.campaignId}</span>
              </div>
              <div className="text-[10px] text-on-surface-variant">
                {touch.campaignName} · {touch.adId}
                {touch.touchDate && (
                  <span className="ml-2">
                    ({formatDate(touch.touchDate)} {formatTime(touch.touchDate)})
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order + Summary */}
      <div className="rounded-md px-3 py-2.5 mt-2"
        style={{ background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.15)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-semibold text-[#059669]">
            ✅ Đơn hàng: {conv.orderId}
          </span>
          <span className="text-[13px] font-bold text-on-surface">{formatVND(conv.orderValue)}</span>
        </div>
        <div className="text-[10px] text-on-surface-variant">
          {formatDate(conv.orderDate)} {formatTime(conv.orderDate)}
        </div>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <div className="rounded-sm px-2 py-1.5"
          style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
          <div className="text-[9px] text-on-surface-variant uppercase tracking-wide">First touch</div>
          <div className="text-[11px] font-semibold text-tertiary truncate">{conv.firstTouch.campaignId}</div>
          <div className="text-[9px] text-on-surface-variant">{conv.firstTouch.daysToConversion} ngày trước</div>
        </div>
        <div className="rounded-sm px-2 py-1.5"
          style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
          <div className="text-[9px] text-on-surface-variant uppercase tracking-wide">Last touch</div>
          <div className="text-[11px] font-semibold text-tertiary truncate">{conv.lastTouch.campaignId}</div>
          <div className="text-[9px] text-on-surface-variant">{conv.lastTouch.daysToConversion} ngày trước</div>
        </div>
        <div className="rounded-sm px-2 py-1.5"
          style={{ background: 'var(--color-surface-container-low)', border: '1px solid var(--color-outline-variant)' }}>
          <div className="text-[9px] text-on-surface-variant uppercase tracking-wide">Touches</div>
          <div className="text-[11px] font-semibold text-on-surface">{touches.length}</div>
          <div className="text-[9px] text-on-surface-variant">
            {touches.filter(t => t.type === 'impression').length} imp · {touches.filter(t => t.type === 'click').length} click
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Shared helpers ──────────────────────────────────────────────────────────

function PlatformBadge({ platform }) {
  const isFB = platform === 'facebook';
  return (
    <span className="inline-flex items-center gap-1 text-label-xs px-1.5 py-0.5 rounded"
      style={{ background: isFB ? 'rgba(24,119,242,0.10)' : 'rgba(0,120,220,0.10)', color: isFB ? '#1877F2' : '#0078D4' }}>
      {isFB ? (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ) : (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
        </svg>
      )}
      {isFB ? 'FB' : 'Zalo'}
    </span>
  );
}

function TempBadge({ temp }) {
  const color = tempColorMap(temp);
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold"
      style={{ backgroundColor: `${color}18`, color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      {temp}
    </span>
  );
}

function tempColorMap(temp) {
  if (temp === 'Nóng') return '#059669';
  if (temp === 'Ấm') return '#d97706';
  return '#6b7280';
}

function tempStyle(temp) {
  const color = tempColorMap(temp);
  return {
    background: `${color}18`,
    color,
  };
}

function maskName(phone) {
  if (!phone) return 'Khách Ẩn danh';
  // Vietnamese name mask
  const names = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D', 'Đặng Thị E'];
  const idx = phone.charCodeAt(1) % names.length;
  return names[idx];
}

function formatVND(amount) {
  if (!amount) return '0đ';
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

function formatTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

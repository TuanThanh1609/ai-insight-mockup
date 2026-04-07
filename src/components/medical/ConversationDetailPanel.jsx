import { useState, useMemo } from 'react';
import { cn } from '../../lib/utils';
import { getConversationDetailsByDisease } from '../../data/mockConversationDetails';

/**
 * ConversationDetailPanel
 *
 * Wireframe mới — 2 cột:
 *   CỘT TRÁI  (40%): Danh sách hội thoại
 *   CỘT PHẢI (60%): Chi tiết hội thoại — 3 tab:
 *     [Tin nhắn] [Đánh Giá] [Hành Động]
 *
 * Props:
 *   disease — disease object (with id, label, code)
 *   conversations — raw conversation rows (optional, for seed)
 */
export function ConversationDetailPanel({ disease, conversations = [] }) {
  const [selectedId, setSelectedId] = useState(null);
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' | 'evaluation' | 'actions'

  const details = useMemo(
    () => getConversationDetailsByDisease(disease?.id || 'lead-quality', conversations),
    [disease?.id]
  );

  const selected = useMemo(
    () => details.find(d => d.id === selectedId) || details[0] || null,
    [details, selectedId]
  );

  // Auto-select first item
  const initialSelected = useMemo(() => {
    if (!selectedId && details.length > 0) {
      // Use setTimeout to avoid "cannot update during existing state transition" warning
      setTimeout(() => setSelectedId(details[0].id), 0);
      return details[0];
    }
    return selected;
  }, [details, selectedId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (details.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-on-surface-variant">
        <div className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <p className="text-body-sm">Không có hội thoại nào trong nhóm này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col xl:flex-row gap-0 rounded-lg overflow-hidden shadow-[--shadow-sm]"
      style={{ border: '1px solid rgba(26,33,56,0.08)' }}>
      {/* ══════════════════════════════════════════ */}
      {/* CỘT TRÁI — Danh sách hội thoại           */}
      {/* ══════════════════════════════════════════ */}
      <div className="xl:w-[40%] flex flex-col"
        style={{ borderRight: '1px solid rgba(26,33,56,0.08)' }}>

        {/* Header */}
        <div className="px-3 py-2 flex items-center justify-between shrink-0 bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]"
          style={{ borderBottom: '1px solid rgba(26,33,56,0.08)' }}>
          <div>
            <h4 className="text-label-xs font-semibold text-on-surface uppercase tracking-wide">Hội thoại</h4>
            <p className="text-[11px] text-on-surface-variant mt-0.5">
              {details.length} cuộc trò chuyện
            </p>
          </div>
          {/* Filter chips */}
          <div className="flex gap-1.5">
            <TempChip label="Nóng" count={details.filter(d => d.evaluation.temperature === 'Nóng').length} color="#059669" />
            <TempChip label="Ấm" count={details.filter(d => d.evaluation.temperature === 'Ấm').length} color="#d97706" />
            <TempChip label="Lạnh" count={details.filter(d => d.evaluation.temperature === 'Lạnh').length} color="#dc2626" />
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 shrink-0"
          style={{ borderBottom: '1px solid rgba(26,33,56,0.08)' }}>
          <input
            type="text"
            placeholder="Tìm tên khách hàng..."
            className="w-full px-2.5 py-1.5 rounded-md text-[13px] text-on-surface
              bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee]
              placeholder:text-on-surface-variant/50
              focus:outline-none focus:ring-0
              border-b-2 border-tertiary"
            onChange={(e) => {
              const val = e.target.value.toLowerCase();
              // simple client-side filter via CSS
              const items = document.querySelectorAll('[data-conv-item]');
              items.forEach(item => {
                const match = item.textContent.toLowerCase().includes(val);
                (item).style.display = match ? '' : 'none';
              });
            }}
          />
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto" style={{ maxHeight: '480px' }}>
          {details.map((conv) => (
            <ConversationListItem
              key={conv.id}
              conv={conv}
              isSelected={selected?.id === conv.id}
              onClick={() => setSelectedId(conv.id)}
            />
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* CỘT PHẢI — Chi tiết hội thoại            */}
      {/* ══════════════════════════════════════════ */}
      <div className="xl:flex-1 flex flex-col min-w-0">

        {/* Customer header */}
        {selected && (
          <div className="px-4 py-2.5 shrink-0 bg-gradient-to-br from-white via-[#faf7fc] to-[#f5f1f5]"
            style={{ borderBottom: '1px solid rgba(26,33,56,0.08)' }}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{
                    background: selected.evaluation.temperature === 'Nóng'
                      ? 'rgba(5,150,105,0.12)'
                      : selected.evaluation.temperature === 'Ấm'
                        ? 'rgba(217,119,6,0.12)'
                        : 'rgba(220,38,38,0.10)',
                    color: selected.evaluation.temperatureColor,
                  }}>
                  {selected.customerName.split(' ').slice(-1)[0][0]}
                </div>

                <div className="min-w-0">
                  <h3 className="text-label-sm font-semibold text-on-surface truncate">
                    {selected.customerName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <PlatformBadge platform={selected.platform} />
                    <span className="text-label-xs text-on-surface-variant">
                      {selected.date} · {selected.time}
                    </span>
                    {selected.evaluation.isJunk && (
                      <span className="text-label-xs px-1.5 py-0.5 rounded bg-[rgba(220,38,38,0.08)] text-[#dc2626] font-semibold">
                        JUNK
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Temperature badge */}
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-sm font-bold"
                  style={{
                    backgroundColor: selected.evaluation.temperatureBg,
                    color: selected.evaluation.temperatureColor,
                  }}>
                  <TempDot color={selected.evaluation.temperatureColor} />
                  {selected.evaluation.temperature}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="px-5 pt-3 pb-0 shrink-0">
          <div className="flex items-center gap-1 bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] rounded-lg p-0.5 w-fit">
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
                    ? 'bg-white text-on-surface shadow-[--shadow-sm]'
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
          style={{ maxHeight: '420px' }}>
          {selected && activeTab === 'messages' && (
            <MessagesTab conv={selected} />
          )}
          {selected && activeTab === 'evaluation' && (
            <EvaluationTab conv={selected} />
          )}
          {selected && activeTab === 'actions' && (
            <ActionsTab conv={selected} />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TempChip({ label, count, color }) {
  if (count === 0) return null;
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold"
      style={{ backgroundColor: `${color}18`, color }}>
      <span>{count}</span>
    </span>
  );
}

function TempDot({ color }) {
  return (
    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
  );
}

function PlatformBadge({ platform }) {
  const isFB = platform === 'Facebook';
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
      {platform}
    </span>
  );
}

function ConversationListItem({ conv, isSelected, onClick }) {
  const { evaluation } = conv;

  return (
    <div
      data-conv-item
      onClick={onClick}
      className={cn(
        'px-3 py-2.5 cursor-pointer transition-all border-b',
        'border-[rgba(26,33,56,0.08)]/40',
        'hover:bg-[rgba(26,33,56,0.04)]',
        isSelected && 'bg-[rgba(26,33,56,0.04)]'
      )}
      style={isSelected ? { borderLeft: '3px solid var(--color-tertiary)' } : {}}
    >
      <div className="flex items-start gap-2.5">
        {/* Avatar */}
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
          style={{
            background: evaluation.temperature === 'Nóng'
              ? 'rgba(5,150,105,0.12)'
              : evaluation.temperature === 'Ấm'
                ? 'rgba(217,119,6,0.12)'
                : 'rgba(220,38,38,0.10)',
            color: evaluation.temperatureColor,
          }}>
          {conv.customerName.split(' ').slice(-1)[0][0]}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold text-on-surface truncate">
              {conv.customerName}
            </span>
            <span className="text-[11px] text-on-surface-variant shrink-0">
              {conv.time}
            </span>
          </div>

          {/* Preview message */}
          <p className="text-[11px] text-on-surface-variant mt-0.5 truncate">
            {conv.messages[0]?.text || 'Không có tin nhắn'}
          </p>

          {/* Tags row */}
          <div className="flex items-center gap-1 mt-1.5 flex-wrap">
            {evaluation.isJunk ? (
              <span className="text-[10px] px-1 py-0.5 rounded bg-[rgba(220,38,38,0.08)] text-[#dc2626] font-semibold">
                JUNK
              </span>
            ) : (
              <>
                <TempTag color={evaluation.temperatureColor} label={evaluation.temperature} />
                <span className="text-[10px] px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: evaluation.phoneStatus === 'Đã thu thập' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.06)',
                    color: evaluation.phoneStatus === 'Đã thu thập' ? '#059669' : '#dc2626',
                  }}>
                  SĐT: {evaluation.phoneStatus === 'Đã thu thập' ? '✓' : '✗'}
                </span>
                {evaluation.attitude === 'Kém' && (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[rgba(220,38,38,0.08)] text-[#dc2626]">
                    TT: Kém
                  </span>
                )}
                {evaluation.hasCompetitor && (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[rgba(217,119,6,0.08)] text-[#d97706]">
                    ĐT: {evaluation.competitorMention}
                  </span>
                )}
                {evaluation.objection && evaluation.objection !== 'Không' && (
                  <span className="text-[10px] px-1 py-0.5 rounded bg-[rgba(220,38,38,0.08)] text-[#dc2626]">
                    Obj: {evaluation.objection.length > 12 ? evaluation.objection.slice(0, 12) + '…' : evaluation.objection}
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TempTag({ color, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] px-1 py-0.5 rounded font-semibold"
      style={{ backgroundColor: `${color}15`, color }}>
      <span className="w-1 h-1 rounded-full inline-block" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}

// ─── Tab: Tin nhắn ─────────────────────────────────────────────────────────

function MessagesTab({ conv }) {
  const msgColors = {
    customer: { bg: 'rgba(26,33,56,0.04)', text: 'var(--color-on-surface)', align: 'flex-start' },
    shop: { bg: 'rgba(0,82,255,0.10)', text: 'var(--color-tertiary)', align: 'flex-end' },
    system: { bg: 'rgba(107,114,128,0.08)', text: 'var(--color-on-surface-variant)', align: 'center' },
  };

  return (
    <div className="space-y-3">
      {/* Stats bar */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <span className="text-[11px] text-on-surface-variant">
          {conv.messages.filter(m => m.sender === 'customer').length} tin khách
        </span>
        <span className="text-on-surface-variant/40">·</span>
        <span className="text-[11px] text-on-surface-variant">
          {conv.messages.filter(m => m.sender === 'shop').length} tin shop
        </span>
        <span className="text-on-surface-variant/40">·</span>
        <span className="text-[11px] text-on-surface-variant">
          {conv.messages.length} tin nhắn
        </span>
      </div>

      {/* Message bubbles */}
      <div className="space-y-3">
        {conv.messages.map((msg, idx) => {
          const isCustomer = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';
          const style = msgColors[msg.sender] || msgColors.customer;

          if (isSystem) {
            return (
              <div key={idx} className="flex justify-center">
                <span className="text-label-xs text-on-surface-variant px-3 py-1 rounded-full"
                  style={{ background: style.bg }}>
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div key={idx} className="flex flex-col gap-0.5" style={{ alignItems: isCustomer ? 'flex-start' : 'flex-end' }}>
              <div className="flex items-center gap-2" style={{ alignSelf: isCustomer ? 'flex-start' : 'flex-end' }}>
                <span className="text-[11px] text-on-surface-variant">
                  {isCustomer ? conv.customerName.split(' ').slice(-1)[0] : 'Shop'}
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
    </div>
  );
}

// ─── Tab: Đánh Giá ─────────────────────────────────────────────────────────

function EvaluationTab({ conv }) {
  const { evaluation } = conv;

  const items = [
    {
      label: 'Mức độ quan tâm',
      value: evaluation.temperature,
      color: evaluation.temperatureColor,
      bg: evaluation.temperatureBg,
      description: evaluation.temperature === 'Nóng'
        ? 'Khách hỏi giá + xin SĐT + muốn mua ngay'
        : evaluation.temperature === 'Ấm'
          ? 'Khách đang tư vấn, có quan tâm nhưng chưa chốt'
          : 'Khách seen không rep hoặc từ chối trực tiếp',
    },
    {
      label: 'Thu thập SĐT',
      value: evaluation.phoneStatus === 'Đã thu thập' ? 'Đã thu thập' : evaluation.phoneStatus,
      color: evaluation.phoneStatusColor,
      bg: evaluation.phoneStatus === 'Đã thu thập' ? 'rgba(5,150,105,0.08)' : 'rgba(220,38,38,0.06)',
      description: evaluation.phoneNumber
        ? `SĐT: ${evaluation.phoneNumberMasked}`
        : evaluation.phoneStatus === 'Đã thu thập'
          ? 'Khách đã để lại SĐT để liên hệ'
          : 'Khách chưa sẵn sàng cung cấp SĐT',
    },
    {
      label: 'Loại khách hàng',
      value: evaluation.isJunk ? 'Junk Lead' : 'Khách thật',
      color: evaluation.isJunk ? '#dc2626' : '#059669',
      bg: evaluation.isJunk ? 'rgba(220,38,38,0.06)' : 'rgba(5,150,105,0.06)',
      description: evaluation.isJunk
        ? `Lý do: ${evaluation.junkReason || 'Tin tự động / click nhầm ads'}`
        : 'Khách có intent mua thật, đang trong vòng tư vấn',
    },
    {
      label: 'Thái độ tư vấn',
      value: evaluation.attitude,
      color: evaluation.attitudeColor,
      bg: evaluation.attitudeColor === '#059669' ? 'rgba(5,150,105,0.06)'
        : evaluation.attitudeColor === '#d97706' ? 'rgba(217,119,6,0.06)'
        : 'rgba(220,38,38,0.06)',
      description: evaluation.attitude === 'Tốt'
        ? 'Nhân viên tư vấn nhiệt tình, chuyên nghiệp'
        : evaluation.attitude === 'Bình thường'
          ? 'Nhân viên tư vấn đủ trả lời, chưa nổi bật'
          : 'Nhân viên tư vấn có vấn đề — thiếu thông tin hoặc phản hồi chậm',
    },
    {
      label: 'Cảm xúc khách hàng',
      value: evaluation.sentiment,
      color: evaluation.sentimentColor,
      bg: evaluation.sentimentColor === '#059669' ? 'rgba(5,150,105,0.06)'
        : evaluation.sentimentColor === '#d97706' ? 'rgba(217,119,6,0.06)'
        : 'rgba(220,38,38,0.06)',
      description: evaluation.sentiment === 'Tích cực'
        ? 'Khách hào hứng, phản hồi nhanh và tích cực'
        : evaluation.sentiment === 'Băn khoăn'
          ? 'Khách còn thắc mắc, cần thêm thông tin hoặc đang so sánh'
          : 'Khách không hài lòng hoặc có phản ứng tiêu cực',
    },
  ];

  if (evaluation.painPoint) {
    items.push({
      label: 'Pain Point',
      value: evaluation.painPoint.length > 20 ? evaluation.painPoint.slice(0, 20) + '…' : evaluation.painPoint,
      color: '#0052FF',
      bg: 'rgba(0,82,255,0.06)',
      description: `Khách đang quan tâm: ${evaluation.painPoint}`,
    });
  }

  if (evaluation.objection && evaluation.objection !== 'Không') {
    items.push({
      label: 'Objection gặp phải',
      value: evaluation.objection,
      color: '#dc2626',
      bg: 'rgba(220,38,38,0.06)',
      description: 'Khách đặt câu hỏi nghi ngờ hoặc từ chối. Nhân viên cần xử lý bằng proof points.',
    });
  }

  if (evaluation.mistake) {
    items.push({
      label: 'Lỗi nhân viên',
      value: evaluation.mistake,
      color: '#dc2626',
      bg: 'rgba(220,38,38,0.06)',
      description: 'Nhân viên mắc lỗi trong quá trình tư vấn. Cần review và đào tạo lại kịch bản.',
    });
  }

  if (evaluation.hasCompetitor && evaluation.competitorMention) {
    items.push({
      label: 'Đối thủ được nhắc',
      value: evaluation.competitorMention,
      color: '#d97706',
      bg: 'rgba(217,119,6,0.06)',
      description: `Khách so sánh với ${evaluation.competitorMention}. Cần có battle card để xử lý.`,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-on-surface-variant mb-2 uppercase tracking-wide">
        Đánh giá tự động từ AI Engine
      </p>

      {items.map((item, idx) => (
        <div key={idx} className="rounded-md px-3 py-2"
          style={{ backgroundColor: item.bg, border: `1px solid ${item.color}20` }}>
          <div className="flex items-start gap-2">
            {/* Color indicator dot */}
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

      {/* AI confidence badge */}
      <div className="flex items-center justify-between pt-1.5">
        <span className="text-[11px] text-on-surface-variant">Độ chính xác AI</span>
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-1 bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: '87%', backgroundColor: '#059669' }} />
          </div>
          <span className="text-[11px] font-bold text-[#059669]">87%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Hành Động ─────────────────────────────────────────────────────────

function ActionsTab({ conv }) {
  const { actions } = conv;

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

      {actions.length === 0 && (
        <div className="text-center py-6 text-on-surface-variant">
          <div className="text-2xl mb-1.5">✅</div>
          <p className="text-[12px]">Cuộc trò chuyện không có vấn đề nổi bật.</p>
        </div>
      )}

      {actions.map((action, idx) => {
        const cfg = severityConfig[action.severity] || severityConfig.neutral;

        return (
          <div key={idx} className="rounded-md px-3 py-2.5"
            style={{
              backgroundColor: cfg.bg,
              border: `1px solid ${cfg.border}`,
            }}>
            {/* Header */}
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
                <span className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: cfg.color }}>
                  {cfg.label}
                </span>
                <h4 className="text-[13px] font-semibold text-on-surface mt-0.5 leading-snug">
                  {action.label}
                </h4>
              </div>
            </div>

            {/* Description */}
            <p className="text-[12px] text-on-surface-variant leading-snug pl-7">
              {action.description}
            </p>

            {/* Action button for info/warning */}
            {(action.severity === 'info' || action.severity === 'warning') && (
              <div className="mt-2 pl-7">
                <button
                  className="text-[11px] font-semibold px-3 py-1 rounded-full transition-all cursor-pointer"
                  style={{
                    backgroundColor: `${cfg.color}12`,
                    color: cfg.color,
                    border: `1px solid ${cfg.color}30`,
                  }}
                  onClick={() => alert(`Đã ghi nhận hành động: ${action.label}`)}
                >
                  Ghi nhận
                </button>
              </div>
            )}
          </div>
        );
      })}

      {/* Summary */}
      <div className="rounded-lg px-3 py-2.5 mt-2 bg-gradient-to-br from-[#f5f1f5] to-[#ede9ee] shadow-[--shadow-sm]"
        style={{ border: '1px solid rgba(26,33,56,0.08)' }}>
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

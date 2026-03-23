import { useState, useEffect, useCallback } from 'react';
import { BarChart3, Users, AlertCircle, Activity, TrendingUp, CheckCircle2, Target, MessageCircle, ChevronLeft, ChevronRight, X, MousePointerClick } from 'lucide-react';
import { Modal, ModalHeader, ModalBody } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { mockTemplates } from '../../data/mockTemplates';
import { mockAnalysisResults } from '../../data/mockAnalysisResults';
import { mockConversations } from '../../data/mockConversations';
import { cn, formatNumber, timeAgo } from '../../lib/utils';

// ─── Mini chart components ───────────────────────────────────────────────

function TemperatureChart({ data, onItemClick }) {
  const total = data.hot + data.warm + data.cold;
  const hotPct = Math.round((data.hot / total) * 100);
  const warmPct = Math.round((data.warm / total) * 100);
  const coldPct = 100 - hotPct - warmPct;

  const bars = [
    { label: data.hotLabel || 'Nóng', value: data.hot, pct: hotPct, color: '#ef4444', filterKey: 'Nóng' },
    { label: data.warmLabel || 'Ấm', value: data.warm, pct: warmPct, color: '#f59e0b', filterKey: 'Ấm' },
    { label: data.coldLabel || 'Lạnh', value: data.cold, pct: coldPct, color: '#3b82f6', filterKey: 'Lạnh' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {bars.map((bar) => (
        <div key={bar.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface-variant">{bar.label}</span>
            <button
              onClick={() => bar.value > 0 && onItemClick?.({ field: 'temperature', value: bar.filterKey, label: bar.label, count: bar.value })}
              className={cn(
                "text-xs font-bold transition-colors",
                bar.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default"
              )}
              title={bar.value > 0 ? `Lọc ${bar.value} hội thoại "${bar.label}"` : "Không có dữ liệu"}
            >
              {bar.value} ({bar.pct}%)
            </button>
          </div>
          <button
            onClick={() => bar.value > 0 && onItemClick?.({ field: 'temperature', value: bar.filterKey, label: bar.label, count: bar.value })}
            className={cn(
              "w-full h-2.5 rounded-full transition-all duration-700 relative overflow-hidden",
              bar.value > 0 ? "cursor-pointer hover:brightness-110 group" : "bg-surface-container-low"
            )}
            style={bar.value > 0 ? { background: bar.color } : undefined}
            title={bar.value > 0 ? `Lọc ${bar.value} hội thoại "${bar.label}"` : "Không có dữ liệu"}
          >
            {bar.value > 0 && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {bar.value} khách
                </span>
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

function PhoneCollectionChart({ data, onItemClick }) {
  const total = data.collected + data.refused + data.notAsked;
  const items = [
    { label: 'Đã cho SĐT', value: data.collected, color: '#10b981', filterKey: 'Đã cho SĐT' },
    { label: 'Chưa cho', value: data.notAsked, color: '#6b7280', filterKey: 'Chưa cho' },
    { label: 'Từ chối', value: data.refused, color: '#ef4444', filterKey: 'Từ chối' },
  ];

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const pct = Math.round((item.value / total) * 100);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-on-surface-variant">{item.label}</span>
              <button
                onClick={() => item.value > 0 && onItemClick?.({ field: 'phoneStatus', value: item.filterKey, label: item.label, count: item.value })}
                className={cn(
                  "text-xs font-bold transition-colors",
                  item.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default"
                )}
                title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
              >
                {item.value} ({pct}%)
              </button>
            </div>
            <button
              onClick={() => item.value > 0 && onItemClick?.({ field: 'phoneStatus', value: item.filterKey, label: item.label, count: item.value })}
              className={cn(
                "w-full h-2 rounded-full transition-all duration-700 relative overflow-hidden group",
                item.value > 0 ? "cursor-pointer hover:brightness-110" : "bg-surface-container-low"
              )}
              style={item.value > 0 ? { background: item.color } : undefined}
              title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
            >
              {item.value > 0 && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.value} khách
                  </span>
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function AttitudeChart({ data, onItemClick }) {
  const total = data.good + data.average + data.poor;
  const items = [
    { label: 'Tốt', value: data.good, pct: Math.round((data.good / total) * 100), color: '#10b981', filterKey: 'Tốt' },
    { label: 'Trung bình', value: data.average, pct: Math.round((data.average / total) * 100), color: '#f59e0b', filterKey: 'Trung bình' },
    { label: 'Kém', value: data.poor, pct: 100 - Math.round((data.good / total) * 100) - Math.round((data.average / total) * 100), color: '#ef4444', filterKey: 'Kém' },
  ];
  return (
    <div className="flex items-center gap-3">
      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => item.value > 0 && onItemClick?.({ field: 'attitude', value: item.filterKey, label: item.label, count: item.value })}
          className={cn(
            "flex-1 text-center rounded-[--radius-md] p-2 transition-all duration-200",
            item.value > 0
              ? "cursor-pointer hover:brightness-95 active:brightness-90 hover:scale-[1.02]"
              : "cursor-default opacity-50"
          )}
          style={item.value > 0 ? { background: `${item.color}18` } : undefined}
          title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
        >
          <div className="text-lg font-display font-bold mb-0.5" style={{ color: item.color }}>
            {item.value}
          </div>
          <div className="text-[10px] text-on-surface-variant">{item.label}</div>
          <div className="text-[10px] text-on-surface-variant/60">{item.pct}%</div>
        </button>
      ))}
    </div>
  );
}

function ListItems({ items, highlight = false, onItemClick, clickableField, clickableValue }) {
  return (
    <div className="flex flex-col gap-1.5">
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            "flex items-center justify-between gap-2 rounded-[--radius-sm] transition-colors",
            onItemClick && item.count > 0
              ? "cursor-pointer hover:bg-surface-container-low active:bg-surface-container-low/70 px-1.5 -mx-1.5 py-0.5"
              : ""
          )}
          onClick={() => {
            if (onItemClick && clickableField && clickableValue && item.count > 0) {
              // Use the name/text of the item as the filter value
              const filterValue = item.name || item.text;
              onItemClick({ field: clickableField, value: filterValue, label: filterValue, count: item.count });
            }
          }}
        >
          <span className="text-xs text-on-surface-variant flex-1 leading-snug">
            {highlight && <span className="text-primary font-medium mr-1">#{i + 1}</span>}
            {item.name || item.text}
          </span>
          <span className={cn(
            "shrink-0 px-1.5 py-0.5 rounded-full text-xs font-bold transition-colors",
            onItemClick && item.count > 0
              ? "bg-primary/10 text-primary group-hover:bg-primary/20"
              : "text-on-surface"
          )}>
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Template 5: Competitor Chart ─────────────────────────────────
function CompetitorMentionChart({ data, onItemClick }) {
  const total = data.mentioned + data.notMentioned;
  const mentionedPct = Math.round((data.mentioned / total) * 100);
  const notPct = 100 - mentionedPct;

  const rows = [
    { label: 'Có nhắc đến đối thủ', value: data.mentioned, pct: mentionedPct, color: '#3b82f6', filterKey: true, filterLabel: 'Có nhắc đến đối thủ' },
    { label: 'Không nhắc đến', value: data.notMentioned, pct: notPct, color: '#6b7280', filterKey: false, filterLabel: 'Không nhắc đến' },
  ];

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface-variant">{row.label}</span>
            <button
              onClick={() => row.value > 0 && onItemClick?.({ field: 'hasCompetitor', value: row.filterKey, label: row.filterLabel, count: row.value })}
              className={cn(
                "text-xs font-bold transition-colors",
                row.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default"
              )}
              title={row.value > 0 ? `Lọc ${row.value} hội thoại "${row.label}"` : "Không có dữ liệu"}
            >
              {row.value} ({row.pct}%)
            </button>
          </div>
          <button
            onClick={() => row.value > 0 && onItemClick?.({ field: 'hasCompetitor', value: row.filterKey, label: row.filterLabel, count: row.value })}
            className={cn(
              "w-full h-3 rounded-full transition-all duration-700 relative overflow-hidden group",
              row.value > 0 ? "cursor-pointer hover:brightness-110" : "bg-surface-container-low"
            )}
            style={row.value > 0 ? { background: row.color } : undefined}
            title={row.value > 0 ? `Lọc ${row.value} hội thoại "${row.label}"` : "Không có dữ liệu"}
          >
            {row.value > 0 && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {row.value} khách
                </span>
              </span>
            )}
          </button>
        </div>
      ))}
    </div>
  );
}

function CompetitorSentiment({ data, onItemClick }) {
  return (
    <div className="flex flex-col gap-3">
      {data.map((item) => {
        const total = item.positive + item.neutral + item.negative;
        const pos = Math.round((item.positive / total) * 100);
        const neu = Math.round((item.neutral / total) * 100);
        return (
          <div key={item.name}>
            <div className="flex items-center justify-between mb-1">
              <button
                onClick={() => onItemClick?.({ field: 'competitorName', value: item.name, label: item.name, count: total })}
                className="text-xs font-medium text-on-surface hover:text-primary cursor-pointer transition-colors"
                title={`Lọc ${total} hội thoại về "${item.name}"`}
              >
                {item.name}
              </button>
              <span className="text-[10px] text-on-surface-variant">{total} lượt</span>
            </div>
            <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
              <div className="bg-tertiary-container rounded-l-full" style={{ width: `${pos}%` }} title={`Tích cực ${pos}%` } />
              <div className="bg-warning-container" style={{ width: `${neu}%` }} title={`Trung lập ${neu}%` } />
              <div className="bg-error-container rounded-r-full" style={{ width: `${100 - pos - neu}%` }} title={`Tiêu cực ${100 - pos - neu}%` } />
            </div>
          </div>
        );
      })}
      <div className="flex items-center gap-4 text-[10px] text-on-surface-variant">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary-container inline-block" />Tích cực</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning-container inline-block" />Trung lập</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-error-container inline-block" />Tiêu cực</span>
      </div>
    </div>
  );
}

// ─── Template 6: Post-sale Chart ─────────────────────────────────
function MessageTypeChart({ data, onItemClick }) {
  const total = data.shipping + data.usageGuide + data.complaint + data.other;
  const items = [
    { label: 'Hỏi giao hàng', value: data.shipping, color: '#3b82f6', filterKey: 'Hỏi giao hàng' },
    { label: 'Hướng dẫn sử dụng', value: data.usageGuide, color: '#8b5cf6', filterKey: 'Xin hướng dẫn sử dụng' },
    { label: 'Khiếu nại lỗi', value: data.complaint, color: '#ef4444', filterKey: 'Khiếu nại lỗi' },
    { label: 'Khác', value: data.other, color: '#94a3b8', filterKey: 'Khác' },
  ];
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => {
        const pct = Math.round((item.value / total) * 100);
        return (
          <div key={item.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-on-surface-variant">{item.label}</span>
              <button
                onClick={() => item.value > 0 && onItemClick?.({ field: 'messageType', value: item.filterKey, label: item.label, count: item.value })}
                className={cn(
                  "text-xs font-bold transition-colors",
                  item.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default"
                )}
                title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
              >
                {item.value} ({pct}%)
              </button>
            </div>
            <button
              onClick={() => item.value > 0 && onItemClick?.({ field: 'messageType', value: item.filterKey, label: item.label, count: item.value })}
              className={cn(
                "w-full h-2 rounded-full transition-all duration-700 relative overflow-hidden group",
                item.value > 0 ? "cursor-pointer hover:brightness-110" : "bg-surface-container-low"
              )}
              style={item.value > 0 ? { background: item.color } : undefined}
              title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
            >
              {item.value > 0 && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.value} khách
                  </span>
                </span>
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}

function SentimentDonut({ data, onItemClick }) {
  const total = data.negative + data.neutral + data.positive;
  const items = [
    { label: 'Tiêu cực', value: data.negative, color: '#ef4444', filterKey: 'Tiêu cực' },
    { label: 'Trung lập', value: data.neutral, color: '#f59e0b', filterKey: 'Trung lập' },
    { label: 'Tích cực', value: data.positive, color: '#10b981', filterKey: 'Tích cực' },
  ];
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--color-surface-container-low)" strokeWidth="5" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#ef4444" strokeWidth="5"
            strokeDasharray={`${(data.negative / total) * 88} ${88 - (data.negative / total) * 88}`}
            strokeDashoffset="0" />
          <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="5"
            strokeDasharray={`${(data.neutral / total) * 88} ${88 - (data.neutral / total) * 88}`}
            strokeDashoffset={`${-(data.negative / total) * 88}`} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-on-surface">{total}</span>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => item.value > 0 && onItemClick?.({ field: 'sentiment', value: item.filterKey, label: item.label, count: item.value })}
            className={cn(
              "flex items-center gap-2 rounded-[--radius-sm] transition-colors px-1 -mx-1 py-0.5",
              item.value > 0 ? "cursor-pointer hover:bg-surface-container-low active:bg-surface-container-low/70" : "cursor-default opacity-50"
            )}
            title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-[11px] text-on-surface-variant">{item.label}</span>
            <span className={cn(
              "text-[11px] font-bold ml-auto transition-colors",
              item.value > 0 ? "text-on-surface" : "text-on-surface-variant/40"
            )}>{item.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main Modal ────────────────────────────────────────────────────────

const detailTabs = [
  { value: 'overview', label: 'Tổng quan' },
  { value: 'template', label: 'Cấu hình' },
  { value: 'results', label: 'Kết quả phân tích' },
  { value: 'detail', label: 'Chi tiết' },
];

export function InsightDetailModal({ insight, isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [crossFilter, setCrossFilter] = useState(null); // { field, value, label, count }

  // Reset page when tab or filter changes
  useEffect(() => { setCurrentPage(1); }, [activeTab, crossFilter]);

  // Auto-switch to detail tab when cross-filter is applied from overview/results
  const handleCrossFilter = useCallback((filter) => {
    setCrossFilter(filter);
    setActiveTab('detail');
  }, []);

  const clearCrossFilter = useCallback(() => {
    setCrossFilter(null);
  }, []);

  // Reset cross-filter and tab when modal opens with new insight
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview');
      setCrossFilter(null);
      setCurrentPage(1);
    }
  }, [isOpen, insight?.id]);

  if (!insight) return null;

  const template = mockTemplates.find((t) => t.id === insight.templateId);
  const analysis = mockAnalysisResults[insight.templateId] || null;
  const conversations = mockConversations[insight.templateId] || null;

  // Apply cross-filter to conversation rows
  const filteredRows = conversations
    ? conversations.rows.filter((row) => {
        if (!crossFilter) return true;
        const fieldValue = row[crossFilter.field];
        // Handle boolean fields (hasCompetitor, isJunk, isNegative)
        if (typeof crossFilter.value === 'boolean') {
          return fieldValue === crossFilter.value;
        }
        return String(fieldValue) === String(crossFilter.value);
      })
    : [];

  const ROWS_PER_PAGE = 5;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <ModalHeader>
        <div className="pr-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{template?.icon || '📊'}</span>
            <h2 className="font-display font-bold text-xl text-on-surface">{insight.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Badge platform={insight.platform} size="sm">
              {insight.platform === 'facebook' ? 'Facebook' : insight.platform === 'zalo' ? 'Zalo' : 'Tất cả kênh'}
            </Badge>
            <Badge variant={insight.status === 'active' ? 'success' : 'warning'} size="sm">
              {insight.status === 'active' ? 'Đang chạy' : 'Tạm dừng'}
            </Badge>
            <span className="text-xs text-on-surface-variant">
              {insight.columnCount} cột · {formatNumber(insight.conversationsCount)} hội thoại
            </span>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="pt-2">
        <Tabs
          tabs={detailTabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        />

        {/* ── TAB 1: Tổng quan ── */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-5">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <p className="text-xs text-on-surface-variant mb-1">Tổng hội thoại</p>
                <p className="font-display font-bold text-2xl text-on-surface">
                  {formatNumber(analysis.summary.totalConversations)}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-on-surface-variant mb-1">Lần phân tích cuối</p>
                <p className="font-display font-bold text-base text-on-surface">
                  {timeAgo(analysis.summary.lastConversation)}
                </p>
              </Card>
              <Card className="p-4 text-center">
                <p className="text-xs text-on-surface-variant mb-1">Cột AI đang chạy</p>
                <p className="font-display font-bold text-2xl text-primary">{insight.columnCount}</p>
              </Card>
            </div>

            {/* Lead temperature (insight 1) */}
            {analysis.temperature && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Mức độ quan tâm (Lead Temperature)</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <TemperatureChart data={analysis.temperature} onItemClick={handleCrossFilter} />
              </Card>
            )}

            {/* Phone collection (insight 2) */}
            {analysis.phoneCollection && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Thu thập SĐT</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <PhoneCollectionChart data={analysis.phoneCollection} onItemClick={handleCrossFilter} />
              </Card>
            )}

            {/* Attitude (insight 3) */}
            {analysis.attitude && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Đánh giá thái độ Sale</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <AttitudeChart data={analysis.attitude} onItemClick={handleCrossFilter} />
              </Card>
            )}

            {/* Top products (insight 1) */}
            {analysis.productInterest && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Sản phẩm quan tâm nhiều nhất</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <ListItems items={analysis.productInterest} onItemClick={handleCrossFilter} clickableField="product" />
              </Card>
            )}

            {/* Top performers (insight 3) */}
            {analysis.topPerformers && (
              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Users size={16} className="text-tertiary-container" />
                  <h3 className="font-display font-bold text-sm text-on-surface">Top Sale xuất sắc</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {analysis.topPerformers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-on-surface">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-tertiary-container"
                            style={{ width: `${p.goodRate}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-on-tertiary-container">{p.goodRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Gender (insight 4) */}
            {analysis.gender && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-sm text-on-surface">Giới tính</h3>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Nữ', value: analysis.gender.female, color: '#ec4899', filterKey: 'Nữ' },
                      { label: 'Nam', value: analysis.gender.male, color: '#3b82f6', filterKey: 'Nam' },
                      { label: 'Không rõ', value: analysis.gender.unknown, color: '#94a3b8', filterKey: 'Không rõ' },
                    ].map((item) => {
                      const total = analysis.gender.female + analysis.gender.male + analysis.gender.unknown;
                      const pct = Math.round((item.value / total) * 100);
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-on-surface-variant">{item.label}</span>
                            <button
                              onClick={() => item.value > 0 && handleCrossFilter({ field: 'gender', value: item.filterKey, label: item.label, count: item.value })}
                              className={cn(
                                "text-xs font-bold transition-colors",
                                item.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default"
                              )}
                              title={item.value > 0 ? `Lọc ${item.value} khách "${item.label}"` : "Không có dữ liệu"}
                            >
                              {item.value} ({pct}%)
                            </button>
                          </div>
                          <button
                            onClick={() => item.value > 0 && handleCrossFilter({ field: 'gender', value: item.filterKey, label: item.label, count: item.value })}
                            className={cn(
                              "w-full h-2 rounded-full transition-all duration-700 relative overflow-hidden group",
                              item.value > 0 ? "cursor-pointer hover:brightness-110" : "bg-surface-container-low"
                            )}
                            style={item.value > 0 ? { background: item.color } : undefined}
                            title={item.value > 0 ? `Lọc ${item.value} khách "${item.label}"` : "Không có dữ liệu"}
                          >
                            {item.value > 0 && (
                              <span className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[9px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                  {item.value} khách
                                </span>
                              </span>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display font-bold text-sm text-on-surface">Top 3 khu vực</h3>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <ListItems
                    items={analysis.topLocations.slice(0, 3)}
                    onItemClick={handleCrossFilter}
                    clickableField="location"
                  />
                </Card>
              </div>
            )}

            {/* ── Template 5: Competitor ── */}
            {analysis.competitorMentions && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Target size={16} className="text-primary" />
                      <h3 className="font-display font-bold text-sm text-on-surface">Tỉ lệ nhắc đến đối thủ</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <CompetitorMentionChart data={analysis.competitorMentions} onItemClick={handleCrossFilter} />
                </Card>
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-tertiary-container" />
                      <h3 className="font-display font-bold text-sm text-on-surface">Top đối thủ được nhắc</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <ListItems
                    items={analysis.topCompetitors.slice(0, 3)}
                    onItemClick={handleCrossFilter}
                    clickableField="competitorName"
                  />
                </Card>
              </div>
            )}

            {/* Template 5: Competitor Sentiment */}
            {analysis.sentimentByCompetitor && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Cảm xúc khi nhắc đến đối thủ</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <CompetitorSentiment data={analysis.sentimentByCompetitor} onItemClick={handleCrossFilter} />
              </Card>
            )}

            {/* Template 6: Post-sale overview */}
            {analysis.messageType && (
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-primary" />
                      <h3 className="font-display font-bold text-sm text-on-surface">Phân loại tin nhắn hậu mãi</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <MessageTypeChart data={analysis.messageType} onItemClick={handleCrossFilter} />
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-error-container" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Mức độ tiêu cực (Sentiment)</h3>
                  </div>
                  <SentimentDonut data={analysis.negativeSentiment} onItemClick={handleCrossFilter} />
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-outline-variant)]">
                    <div className="text-center">
                      <p className="font-display font-bold text-base text-tertiary-container">{analysis.resolutionRate}%</p>
                      <p className="text-[10px] text-on-surface-variant">Tỉ lệ giải quyết</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display font-bold text-base text-on-surface">{analysis.avgResponseTime}</p>
                      <p className="text-[10px] text-on-surface-variant">Phản hồi TB</p>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: Cấu hình ── */}
        {activeTab === 'template' && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-[--radius-md] border border-primary/20">
              <span className="text-2xl mt-0.5">{template?.icon}</span>
              <div>
                <h3 className="font-display font-bold text-base text-on-surface mb-0.5">{template?.name}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{template?.description}</p>
              </div>
            </div>

            <div>
              <h3 className="font-display font-bold text-sm text-on-surface mb-3">Các cột AI đã cài đặt</h3>
              <div className="flex flex-col gap-3">
                {template?.columns.map((col, i) => (
                  <div
                    key={col.id}
                    className="flex items-start gap-3 p-4 bg-surface-container-low rounded-[--radius-md]"
                  >
                    <span className="text-lg">{col.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-on-surface">{col.name}</span>
                        <span className={cn(
                          'text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                          col.type === 'boolean' ? 'bg-blue-100 text-blue-700' :
                          col.type === 'enum' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        )}>
                          {col.dataType === 'true_false' ? 'True/False' :
                           col.dataType === 'single_select' ? 'Lựa chọn' :
                           col.dataType === 'dropdown' ? 'Dropdown' : 'Text'}
                        </span>
                      </div>
                      <p className="text-xs text-on-surface-variant leading-relaxed">{col.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: Kết quả phân tích ── */}
        {activeTab === 'results' && (
          <div className="flex flex-col gap-5">
            {analysis.topPainPoints && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-warning-container" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Top Nhu cầu cốt lõi (Pain Points)</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <ListItems items={analysis.topPainPoints} highlight onItemClick={handleCrossFilter} clickableField="painPoint" />
              </Card>
            )}

            {analysis.topObjections && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={16} className="text-primary" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Top Rào cản chốt đơn</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <ListItems items={analysis.topObjections} onItemClick={handleCrossFilter} clickableField="objection" />
              </Card>
            )}

            {analysis.topMistakes && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-error-container" />
                    <h3 className="font-display font-bold text-sm text-on-surface">Top Lỗi mất khách do Sale</h3>
                  </div>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <ListItems items={analysis.topMistakes} highlight onItemClick={handleCrossFilter} clickableField="mistake" />
              </Card>
            )}

            {analysis.topLocations && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-sm text-on-surface">Khu vực khách hàng</h3>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <ListItems items={analysis.topLocations} onItemClick={handleCrossFilter} clickableField="location" />
              </Card>
            )}

            {analysis.budgetRanges && (
              <Card className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-display font-bold text-sm text-on-surface">Phân bổ ngân sách</h3>
                  <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                    <MousePointerClick size={10} />Click để lọc
                  </span>
                </div>
                <ListItems items={analysis.budgetRanges} onItemClick={handleCrossFilter} clickableField="budget" />
              </Card>
            )}

            {/* Template 5: Competitor Criteria + Top competitors full list */}
            {analysis.competitorMentions && (
              <>
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} className="text-primary" />
                      <h3 className="font-display font-bold text-sm text-on-surface">Top tiêu chí so sánh với đối thủ</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <ListItems items={analysis.comparisonCriteria} onItemClick={handleCrossFilter} clickableField="criteria" />
                </Card>
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 size={16} className="text-primary" />
                      <h3 className="font-display font-bold text-sm text-on-surface">Danh sách đối thủ được nhắc đến</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <ListItems items={analysis.topCompetitors} highlight onItemClick={handleCrossFilter} clickableField="competitorName" />
                </Card>
              </>
            )}

            {/* Template 6: Urgent tickets */}
            {analysis.urgentTickets && (
              <>
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle size={16} className="text-error-container" />
                      <h3 className="font-display font-bold text-sm text-on-surface">⚠️ Ticket cần ưu tiên xử lý</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <ListItems items={analysis.urgentTickets} highlight onItemClick={handleCrossFilter} clickableField="priority" />
                </Card>
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} className="text-primary" />
                      <h3 className="font-display font-bold text-sm text-on-surface">Phân bổ ngân sách KH</h3>
                    </div>
                    <span className="text-[10px] text-on-surface-variant/50 flex items-center gap-1">
                      <MousePointerClick size={10} />Click để lọc
                    </span>
                  </div>
                  <ListItems items={analysis.budgetRanges || analysis.comparisonCriteria || []} onItemClick={handleCrossFilter} clickableField="budget" />
                </Card>
              </>
            )}

            {!analysis.topPainPoints && !analysis.topObjections && !analysis.topMistakes && !analysis.topLocations && !analysis.competitorMentions && !analysis.urgentTickets && (
              <div className="text-center py-12">
                <BarChart3 size={40} className="text-on-surface-variant/30 mx-auto mb-3" />
                <p className="text-sm text-on-surface-variant">Chưa có đủ dữ liệu phân tích để hiển thị.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: Chi tiết ── */}
        {activeTab === 'detail' && (
          <div className="flex flex-col gap-4">
            {/* Cross-filter active banner */}
            {crossFilter && (
              <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-[--radius-md] bg-primary/8 border border-primary/20">
                <div className="flex items-center gap-2 min-w-0">
                  <MousePointerClick size={14} className="text-primary shrink-0" />
                  <span className="text-xs text-on-surface">
                    <span className="font-semibold text-primary">{crossFilter.count} hội thoại</span>
                    <span className="text-on-surface-variant"> có </span>
                    <span className="font-semibold text-on-surface">{crossFilter.label}</span>
                  </span>
                </div>
                <button
                  onClick={clearCrossFilter}
                  className="flex items-center gap-1 shrink-0 text-xs text-primary hover:text-primary/80 font-medium transition-colors px-2 py-1 rounded-full hover:bg-primary/10"
                >
                  <X size={12} />
                  Bỏ lọc
                </button>
              </div>
            )}

            {!conversations ? (
              <div className="text-center py-12">
                <BarChart3 size={40} className="text-on-surface-variant/30 mx-auto mb-3" />
                <p className="text-sm text-on-surface-variant">Chưa có dữ liệu hội thoại để hiển thị.</p>
              </div>
            ) : filteredRows.length === 0 ? (
              <div className="text-center py-12">
                <BarChart3 size={40} className="text-on-surface-variant/30 mx-auto mb-3" />
                <p className="text-sm text-on-surface-variant">Không có hội thoại nào phù hợp với bộ lọc.</p>
                <button
                  onClick={clearCrossFilter}
                  className="mt-3 text-xs text-primary hover:underline"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                {/* Column headers with highlight for active filter field */}
                <div className="flex items-center justify-between px-1 mb-1">
                  <p className="text-xs text-on-surface-variant">
                    {crossFilter ? (
                      <span>
                        <span className="font-semibold text-primary">{filteredRows.length}</span>
                        <span className="text-on-surface-variant"> / {conversations.rows.length} hội thoại</span>
                      </span>
                    ) : (
                      <span>{filteredRows.length} hội thoại</span>
                    )}
                  </p>
                  {crossFilter && (
                    <button
                      onClick={clearCrossFilter}
                      className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      <X size={11} />
                      Bỏ lọc
                    </button>
                  )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded-[--radius-md] border border-[var(--color-outline-variant)]">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-surface-container-low">
                        <th className="px-3 py-2.5 text-left font-semibold text-on-surface-variant whitespace-nowrap">Khách hàng</th>
                        {conversations.columns.map((col) => (
                          <th
                            key={col.id}
                            className={cn(
                              "px-3 py-2.5 text-left font-semibold whitespace-nowrap transition-colors",
                              crossFilter?.field === col.field
                                ? "text-primary bg-primary/5"
                                : "text-on-surface-variant"
                            )}
                          >
                            {col.name}
                          </th>
                        ))}
                        <th className="px-3 py-2.5 text-left font-semibold text-on-surface-variant whitespace-nowrap">Kênh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={cn(
                            'border-t border-[var(--color-outline-variant)] transition-colors',
                            idx % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/40',
                          )}
                        >
                          <td className="px-3 py-2.5 font-medium text-on-surface whitespace-nowrap">{row.customer}</td>
                          {conversations.columns.map((col) => {
                            const raw = row[col.field];
                            const isHighlighted = crossFilter?.field === col.field;
                            return (
                              <td
                                key={col.id}
                                className={cn(
                                  "px-3 py-2.5 whitespace-nowrap transition-colors",
                                  isHighlighted ? "bg-primary/5" : "text-on-surface-variant"
                                )}
                              >
                                {col.field === 'temperature' && (
                                  <span className={cn(
                                    'inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === 'Nóng' ? 'bg-red-100 text-red-700' :
                                    raw === 'Ấm' ? 'bg-amber-100 text-amber-700' :
                                    'bg-blue-100 text-blue-700'
                                  )}>
                                    {raw}
                                  </span>
                                )}
                                {col.field === 'isJunk' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === true ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container text-on-tertiary-container'
                                  )}>
                                    {raw ? 'Có' : 'Không'}
                                  </span>
                                )}
                                {col.field === 'phoneStatus' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === 'Đã cho SĐT' ? 'bg-green-100 text-green-700' :
                                    raw === 'Chưa cho' ? 'bg-gray-100 text-gray-600' :
                                    'bg-red-100 text-red-700'
                                  )}>
                                    {raw}
                                  </span>
                                )}
                                {col.field === 'attitude' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === 'Tốt' ? 'bg-green-100 text-green-700' :
                                    raw === 'Trung bình' ? 'bg-amber-100 text-amber-700' :
                                    'bg-red-100 text-red-700'
                                  )}>
                                    {raw}
                                  </span>
                                )}
                                {col.field === 'isNegative' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                  )}>
                                    {raw ? 'Tiêu cực' : 'Bình thường'}
                                  </span>
                                )}
                                {col.field === 'hasCompetitor' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                  )}>
                                    {raw ? 'Có' : 'Không'}
                                  </span>
                                )}
                                {col.field === 'priority' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === 'Cao' ? 'bg-red-100 text-red-700' :
                                    raw === 'Bình thường' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-600'
                                  )}>
                                    {raw}
                                  </span>
                                )}
                                {col.field === 'status' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === 'Đã xử lý' ? 'bg-green-100 text-green-700' :
                                    raw === 'Đang xử lý' ? 'bg-amber-100 text-amber-700' :
                                    'bg-gray-100 text-gray-600'
                                  )}>
                                    {raw}
                                  </span>
                                )}
                                {col.field === 'sentiment' && (
                                  <span className={cn(
                                    'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                    raw === 'Tích cực' ? 'bg-green-100 text-green-700' :
                                    raw === 'Tiêu cực' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                                  )}>
                                    {raw}
                                  </span>
                                )}
                                {!['temperature', 'isJunk', 'phoneStatus', 'attitude', 'isNegative', 'hasCompetitor', 'priority', 'status', 'sentiment'].includes(col.field) && (
                                  <span>{raw}</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="px-3 py-2.5 whitespace-nowrap">
                            <span className={cn(
                              'inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                              row.platform === 'facebook' ? 'bg-blue-100 text-blue-700' : 'bg-violet-100 text-violet-700'
                            )}>
                              {row.platform === 'facebook' ? 'Facebook' : 'Zalo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-on-surface-variant">
                      Hiển thị {(currentPage - 1) * ROWS_PER_PAGE + 1}–{Math.min(currentPage * ROWS_PER_PAGE, filteredRows.length)} trong {filteredRows.length} hội thoại
                      {crossFilter && <span className="text-on-surface-variant/60"> (đã lọc)</span>}
                    </p>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-[--radius-sm] text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            'w-7 h-7 rounded-[--radius-sm] text-xs font-medium transition-colors',
                            page === currentPage
                              ? 'bg-primary text-on-primary'
                              : 'text-on-surface-variant hover:bg-surface-container-low'
                          )}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-[--radius-sm] text-on-surface-variant hover:bg-surface-container-low disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </ModalBody>
    </Modal>
  );
}

import { useState, useEffect, useCallback } from 'react';
import {
  BarChart3, Users, AlertCircle, Activity, TrendingUp, CheckCircle2,
  Target, MessageCircle, ChevronLeft, ChevronRight, X, MousePointerClick,
  Phone, Settings2, Sparkles, Download, RefreshCw, Search
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Tabs } from '../ui/Tabs';
import { Button } from '../ui/Button';
import { InsightTrendChart } from './InsightTrendChart';
import { mockTemplates } from '../../data/mockTemplates';
import { cn, formatNumber, timeAgo } from '../../lib/utils';
import { getConversations, getTrendData, computeAnalysisFromConversations } from '../../lib/mockDataService';

// ─── Mini chart components (reused from modal) ─────────────────────────────

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
            item.value > 0 ? "cursor-pointer hover:brightness-95 active:brightness-90 hover:scale-[1.02]" : "cursor-default opacity-50"
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
            onItemClick && item.count > 0 ? "bg-primary/10 text-primary group-hover:bg-primary/20" : "text-on-surface"
          )}>
            {item.count}
          </span>
        </div>
      ))}
    </div>
  );
}

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
              className={cn("text-xs font-bold transition-colors", row.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default")}
            >
              {row.value} ({row.pct}%)
            </button>
          </div>
          <button
            onClick={() => row.value > 0 && onItemClick?.({ field: 'hasCompetitor', value: row.filterKey, label: row.filterLabel, count: row.value })}
            className={cn("w-full h-3 rounded-full transition-all duration-700 relative overflow-hidden group", row.value > 0 ? "cursor-pointer hover:brightness-110" : "bg-surface-container-low")}
            style={row.value > 0 ? { background: row.color } : undefined}
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
              <div className="bg-tertiary-container rounded-l-full" style={{ width: `${pos}%` }} />
              <div className="bg-warning-container" style={{ width: `${neu}%` }} />
              <div className="bg-error-container rounded-r-full" style={{ width: `${100 - pos - neu}%` }} />
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
                className={cn("text-xs font-bold transition-colors", item.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40 cursor-default")}
              >
                {item.value} ({pct}%)
              </button>
            </div>
            <button
              onClick={() => item.value > 0 && onItemClick?.({ field: 'messageType', value: item.filterKey, label: item.label, count: item.value })}
              className={cn("w-full h-2 rounded-full transition-all duration-700 relative overflow-hidden group", item.value > 0 ? "cursor-pointer hover:brightness-110" : "bg-surface-container-low")}
              style={item.value > 0 ? { background: item.color } : undefined}
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
            className={cn("flex items-center gap-2 rounded-[--radius-sm] transition-colors px-1 -mx-1 py-0.5", item.value > 0 ? "cursor-pointer hover:bg-surface-container-low active:bg-surface-container-low/70" : "cursor-default opacity-50")}
            title={item.value > 0 ? `Lọc ${item.value} hội thoại "${item.label}"` : "Không có dữ liệu"}
          >
            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
            <span className="text-[11px] text-on-surface-variant">{item.label}</span>
            <span className="text-[11px] font-bold ml-auto transition-colors">{item.value}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Insight Selector Card ──────────────────────────────────────────────────
function InsightSelectorCard({ insight, isSelected, onClick }) {
  const template = mockTemplates.find((t) => t.id === insight.templateId);

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-shrink-0 w-72 rounded-[--radius-lg] border-2 p-4 text-left transition-all duration-200 cursor-pointer',
        isSelected
          ? 'border-primary bg-primary/5 shadow-sm'
          : 'border-[var(--color-outline-variant)] bg-surface-container-lowest hover:border-primary/40 hover:bg-surface-container-low'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn(
          'w-10 h-10 rounded-[--radius-md] flex items-center justify-center text-xl shrink-0',
          isSelected ? 'bg-primary/15' : 'bg-surface-container-low'
        )}>
          {template?.icon || insight.icon || '📊'}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-on-surface leading-tight truncate">{insight.name}</h4>
          <div className="flex items-center gap-2 mt-0.5">
            <Badge
              variant={insight.status === 'active' ? 'success' : 'warning'}
              size="sm"
            >
              {insight.status === 'active' ? 'ĐANG CHẠY' : 'TẠM DỪNG'}
            </Badge>
          </div>
        </div>
      </div>
      <p className="text-xs text-on-surface-variant">
        <span className="font-semibold text-on-surface">{formatNumber(insight.conversationsCount)}</span> hội thoại
      </p>
    </button>
  );
}

// ─── Detail tabs ─────────────────────────────────────────────────────────────
const detailTabs = [
  { value: 'overview', label: 'Tổng quan' },
  { value: 'template', label: 'Cấu hình' },
  { value: 'detail', label: 'Chi tiết' },
];

// ─── Main Full-Page Component ───────────────────────────────────────────────
export function InsightDetail({ insights, selectedInsightId, onSelectInsight, onBack, setInsights }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [currentPage, setCurrentPage] = useState(1);
  const [crossFilter, setCrossFilter] = useState(null);
  const [editingInsightId, setEditingInsightId] = useState(null); // which insight is being edited
  const [editColumns, setEditColumns] = useState(null);             // working copy of columns
  const [savedNotice, setSavedNotice] = useState(false);             // "Đã lưu" toast

  useEffect(() => { setCurrentPage(1); }, [activeTab, crossFilter]);
  useEffect(() => {
    setActiveTab('overview');
    setCrossFilter(null);
    setCurrentPage(1);
    setEditingInsightId(null);
    setEditColumns(null);
  }, [selectedInsightId]);

  // ── Column editing ───────────────────────────────────────────────────
  const handleStartEdit = (insightId, template) => {
    setEditingInsightId(insightId);
    setEditColumns(JSON.parse(JSON.stringify(template?.columns || [])));
  };

  const handleCancelEdit = () => {
    setEditingInsightId(null);
    setEditColumns(null);
  };

  const handleSaveEdit = () => {
    // Persist to localStorage
    try {
      const raw = localStorage.getItem('aiinsight_user_insights');
      const parsed = JSON.parse(raw || '[]');
      const updated = parsed.map((ins) =>
        ins.id === editingInsightId
          ? { ...ins, columnCount: editColumns.length }
          : ins
      );
      localStorage.setItem('aiinsight_user_insights', JSON.stringify(updated));
    } catch (_) {}

    // Also update in-memory insights
    setInsights((prev) =>
      prev.map((ins) =>
        ins.id === editingInsightId
          ? { ...ins, columnCount: editColumns.length }
          : ins
      )
    );

    setEditingInsightId(null);
    setEditColumns(null);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const updateColumn = (idx, field, value) => {
    setEditColumns((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const DATA_TYPE_OPTIONS = [
    { key: 'short_text', label: 'Text' },
    { key: 'true_false', label: 'True / False' },
    { key: 'single_select', label: 'Lựa chọn' },
    { key: 'dropdown', label: 'Dropdown' },
  ];

  const handleCrossFilter = useCallback((filter) => {
    setCrossFilter(filter);
    setActiveTab('detail');
  }, []);

  const clearCrossFilter = useCallback(() => setCrossFilter(null), []);

  const selectedInsight = insights.find((i) => i.id === selectedInsightId) || null;
  // Template: ưu tiên AI-generated columns (inline), fallback static mockTemplates
  const template = selectedInsight
    ? (selectedInsight.columns?.length > 0
        ? { ...selectedInsight, columns: selectedInsight.columns }
        : mockTemplates.find((t) => t.id === selectedInsight.templateId))
    : null;
  const insightId   = selectedInsight?.id;
  const templateId  = selectedInsight?.templateId;

  // conversations/analysis: ưu tiên runtime (AI flow hoặc template mới chưa có static)
  const conversations = insightId ? getConversations(insightId) : null;
  // analysis: COMPUTED từ conversations + crossFilter → filter kích hoạt được ngay
  const analysis = conversations ? computeAnalysisFromConversations(conversations, crossFilter) : null;
  // trend: template-based → dùng templateId (lookup static), AI-generated → dùng insightId
  const trendKey  = (templateId && templateId !== 'ai-generated') ? templateId : insightId;
  const trendData = trendKey ? getTrendData(trendKey) : [];

  const filteredRows = conversations
    ? conversations.rows.filter((row) => {
        if (!crossFilter) return true;
        const fieldValue = row[crossFilter.field];
        if (typeof crossFilter.value === 'boolean') return fieldValue === crossFilter.value;
        return String(fieldValue) === String(crossFilter.value);
      })
    : [];

  const ROWS_PER_PAGE = 10;
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / ROWS_PER_PAGE));
  const paginatedRows = filteredRows.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  // ── Live Feed ─────────────────────────────────────────────────────────────
  const liveMessages = [
    { platform: 'facebook', time: 'VỪA XONG', message: 'Hi, mình muốn hỏi giá bộ sưu tập hè...' },
    { platform: 'zalo', time: '2 PHÚT TRƯỚC', message: 'Shop có chi nhánh ở Quận 1 không?' },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
      {/* ── Carousel Selector ── */}
      <div className="border-b border-[var(--color-outline-variant)] bg-surface-container-lowest px-6 pt-5 pb-4">
        {/* Back button + title */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer px-2 py-1 rounded-[--radius-sm] hover:bg-surface-container-low"
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Quay lại</span>
          </button>
          <div className="h-4 w-px bg-[var(--color-outline-variant)]" />
          <h2 className="font-display font-bold text-base text-on-surface">Lựa chọn Insight</h2>
        </div>

        {/* Scrollable card row */}
        <div className="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent">
          {insights.map((ins) => (
            <div key={ins.id} className="snap-start">
              <InsightSelectorCard
                insight={ins}
                isSelected={ins.id === selectedInsightId}
                onClick={() => {
                  onSelectInsight(ins.id);
                  // Scroll to detail area after selecting
                  setTimeout(() => {
                    document.getElementById('insight-detail-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 50);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Detail content area ── */}
      <div id="insight-detail-content" className="flex-1 min-h-0 overflow-y-auto">
      {/* ── No insight selected ── */}
      {!selectedInsight ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20">
          <Search size={48} className="text-on-surface-variant/30" />
          <p className="text-sm text-on-surface-variant">Chọn một Insight bên trên để xem chi tiết</p>
        </div>
      ) : (
        <>
          {/* ── Detail Header ── */}
          <div className="px-6 pt-5 pb-4 bg-surface-container-lowest">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-[--radius-lg] bg-primary/10 flex items-center justify-center shrink-0 text-3xl mt-0.5">
                {template?.icon || selectedInsight.icon || '📊'}
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="font-display font-bold text-xl text-on-surface">{selectedInsight.name}</h1>
                  <Badge variant={selectedInsight.status === 'active' ? 'success' : 'warning'} size="sm">
                    {selectedInsight.status === 'active' ? 'ĐANG CHẠY' : 'TẠM DỪNG'}
                  </Badge>
                </div>
                <p className="text-xs text-on-surface-variant">
                  {selectedInsight.columnCount} cột AI · {formatNumber(selectedInsight.conversationsCount)} hội thoại · Cập nhật 45s trước
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Settings2 size={14} />
                  <span className="hidden sm:inline">Cấu hình AI</span>
                </Button>
                <Button variant="primary" size="sm" className="gap-1.5">
                  <Download size={14} />
                  <span className="hidden sm:inline">Xuất dữ liệu</span>
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <Tabs
                tabs={detailTabs}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {/* ── TAB 1: Tổng quan (gộp cả Kết quả phân tích) ── */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">

                {/* Row 1: 3 KPI stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center">
                    <p className="text-xs text-on-surface-variant mb-1">Tổng hội thoại</p>
                    <p className="font-display font-bold text-2xl text-on-surface">
                      {formatNumber(analysis?.summary?.totalConversations || 0)}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-xs text-on-surface-variant mb-1">Lần phân tích cuối</p>
                    <p className="font-display font-bold text-base text-on-surface">
                      {timeAgo(analysis?.summary?.analyzedAt)}
                    </p>
                  </Card>
                  <Card className="p-4 text-center">
                    <p className="text-xs text-on-surface-variant mb-1">Cột AI đang chạy</p>
                    <p className="font-display font-bold text-2xl text-primary">{selectedInsight.columnCount}</p>
                  </Card>
                </div>

                {/* Row 2: Xu hướng Line Chart */}
                <InsightTrendChart
                  insightId={trendKey}
                  trendData={trendData}
                  crossFilter={crossFilter}
                  conversations={conversations}
                />

                {/* Row 2+: Smart columns + auto-fill metrics grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

                  {/* Col 1–3: Cột dữ liệu thông minh */}
                  <div className="lg:col-span-3 flex flex-col gap-3">
                    <Card className="p-4">
                      <h3 className="font-display font-bold text-xs text-on-surface mb-3 flex items-center gap-1.5">
                        <Sparkles size={13} className="text-primary" />
                        CỘT DỮ LIỆU THÔNG MINH
                      </h3>
                      <div className="flex flex-col gap-2">
                        {(template?.columns || []).map((col) => (
                          <div key={col.id} className="flex items-start gap-2.5 p-2.5 rounded-[--radius-sm] bg-surface-container-low">
                            <div className="w-7 h-7 rounded-[--radius-sm] bg-surface-container-lowest flex items-center justify-center shrink-0 text-xs">
                              {col.icon || '📊'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-semibold text-on-surface leading-tight">{col.name}</p>
                              <p className="text-[10px] text-on-surface-variant mt-0.5 leading-relaxed line-clamp-2">
                                {col.dataType === 'single_select'
                                  ? col.dataOptions?.join(', ')
                                  : col.prompt?.slice(0, 55) + (col.prompt?.length > 55 ? '…' : '')}
                              </p>
                            </div>
                            <CheckCircle2 size={12} className="text-tertiary-container shrink-0 mt-0.5" />
                          </div>
                        ))}
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-display font-bold text-xs text-on-surface mb-3 flex items-center gap-1.5">
                        <Activity size={13} className="text-primary" />
                        LUỒNG TRỰC TIẾP
                      </h3>
                      <div className="flex flex-col gap-2">
                        {liveMessages.map((msg, i) => (
                          <div key={i} className="flex items-start gap-2 p-2.5 rounded-[--radius-sm] bg-surface-container-low">
                            <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                              <span className={cn(
                                'text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                                msg.platform === 'facebook' ? 'bg-facebook/15 text-facebook' : 'bg-zalo/15 text-zalo'
                              )}>
                                {msg.platform === 'facebook' ? 'FB' : 'ZALO'}
                              </span>
                              <span className="text-[8px] text-on-surface-variant">{msg.time}</span>
                            </div>
                            <p className="text-[11px] text-on-surface leading-snug flex-1 line-clamp-2">
                              "{msg.message}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Col 4–12: Metrics — auto-fill grid, no empty rows */}
                  <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start">

                    {/* Lead Temperature */}
                    {analysis?.temperature && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Activity size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Mức độ quan tâm</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <TemperatureChart data={analysis.temperature} onItemClick={handleCrossFilter} />
                      </Card>
                    )}

                    {/* Phone Collection */}
                    {analysis?.phoneCollection && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Thu thập SĐT</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <PhoneCollectionChart data={analysis.phoneCollection} onItemClick={handleCrossFilter} />
                      </Card>
                    )}

                    {/* Attitude */}
                    {analysis?.attitude && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Thái độ Sale</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <AttitudeChart data={analysis.attitude} onItemClick={handleCrossFilter} />
                      </Card>
                    )}

                    {/* Pain Points */}
                    {analysis?.topPainPoints && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <AlertCircle size={13} className="text-warning-container" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Nhu cầu cốt lõi</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <ListItems items={analysis.topPainPoints} highlight onItemClick={handleCrossFilter} clickableField="painPoint" />
                      </Card>
                    )}

                    {/* Objections */}
                    {analysis?.topObjections && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <BarChart3 size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Rào cản chốt đơn</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <ListItems items={analysis.topObjections} onItemClick={handleCrossFilter} clickableField="objection" />
                      </Card>
                    )}

                    {/* Mistakes */}
                    {analysis?.topMistakes && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <AlertCircle size={13} className="text-error-container" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Lỗi mất khách</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <ListItems items={analysis.topMistakes} highlight onItemClick={handleCrossFilter} clickableField="mistake" />
                      </Card>
                    )}

                    {/* Competitor mentions ratio */}
                    {analysis?.competitorMentions && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Target size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Nhắc đến đối thủ</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <CompetitorMentionChart data={analysis.competitorMentions} onItemClick={handleCrossFilter} />
                      </Card>
                    )}

                    {/* Top competitors */}
                    {analysis?.topCompetitors && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp size={13} className="text-tertiary-container" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Top đối thủ</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <ListItems items={analysis.topCompetitors?.slice(0, 3) || []} onItemClick={handleCrossFilter} clickableField="competitorName" />
                      </Card>
                    )}

                    {/* Product Interest */}
                    {analysis?.productInterest && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Sản phẩm quan tâm</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <ListItems items={analysis.productInterest} onItemClick={handleCrossFilter} clickableField="product" />
                      </Card>
                    )}

                    {/* Gender */}
                    {analysis?.gender && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display font-bold text-[11px] text-on-surface">Giới tính</h3>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          {[
                            { label: 'Nữ', value: analysis.gender.female, color: '#ec4899', filterKey: 'Nữ' },
                            { label: 'Nam', value: analysis.gender.male, color: '#3b82f6', filterKey: 'Nam' },
                            { label: 'Không rõ', value: analysis.gender.unknown, color: '#94a3b8', filterKey: 'Không rõ' },
                          ].map((item) => {
                            const total = analysis.gender.female + analysis.gender.male + analysis.gender.unknown;
                            const pct = Math.round((item.value / total) * 100);
                            return (
                              <div key={item.label}>
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-[11px] text-on-surface-variant">{item.label}</span>
                                  <button
                                    onClick={() => item.value > 0 && handleCrossFilter({ field: 'gender', value: item.filterKey, label: item.label, count: item.value })}
                                    className="text-[11px] font-bold text-on-surface hover:text-primary cursor-pointer transition-colors"
                                  >
                                    {item.value} ({pct}%)
                                  </button>
                                </div>
                                <button
                                  onClick={() => item.value > 0 && handleCrossFilter({ field: 'gender', value: item.filterKey, label: item.label, count: item.value })}
                                  className="w-full h-1.5 rounded-full transition-all duration-700 relative overflow-hidden group"
                                  style={item.value > 0 ? { background: item.color } : { background: 'var(--color-surface-container-low)' }}
                                >
                                  {item.value > 0 && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                      <span className="text-[8px] font-bold text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.value}
                                      </span>
                                    </span>
                                  )}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </Card>
                    )}

                    {/* Locations */}
                    {analysis?.topLocations && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-display font-bold text-[11px] text-on-surface">Top khu vực</h3>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <ListItems items={analysis.topLocations?.slice(0, 4) || []} onItemClick={handleCrossFilter} clickableField="location" />
                      </Card>
                    )}

                    {/* Message Type */}
                    {analysis?.messageType && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <MessageCircle size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Phân loại tin nhắn</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <MessageTypeChart data={analysis.messageType} onItemClick={handleCrossFilter} />
                      </Card>
                    )}

                    {/* Negative Sentiment */}
                    {analysis?.negativeSentiment && (
                      <Card className="p-3">
                        <div className="flex items-center gap-1.5 mb-2">
                          <AlertCircle size={13} className="text-error-container" />
                          <h3 className="font-display font-bold text-[11px] text-on-surface">Mức độ tiêu cực</h3>
                        </div>
                        <SentimentDonut data={analysis.negativeSentiment} onItemClick={handleCrossFilter} />
                        {analysis?.resolutionRate && (
                          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[var(--color-outline-variant)]">
                            <div className="text-center flex-1">
                              <p className="font-display font-bold text-sm text-tertiary-container">{analysis.resolutionRate}%</p>
                              <p className="text-[9px] text-on-surface-variant">Giải quyết</p>
                            </div>
                            <div className="text-center flex-1">
                              <p className="font-display font-bold text-sm text-on-surface">{analysis.avgResponseTime}</p>
                              <p className="text-[9px] text-on-surface-variant">Phản hồi TB</p>
                            </div>
                          </div>
                        )}
                      </Card>
                    )}

                    {/* Competitor sentiment */}
                    {analysis?.sentimentByCompetitor && (
                      <Card className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp size={13} className="text-primary" />
                            <h3 className="font-display font-bold text-[11px] text-on-surface">Cảm xúc đối thủ</h3>
                          </div>
                          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
                            <MousePointerClick size={9} />Lọc
                          </span>
                        </div>
                        <CompetitorSentiment data={analysis.sentimentByCompetitor} onItemClick={handleCrossFilter} />
                      </Card>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── TAB 2: Cấu hình ── */}
            {activeTab === 'template' && (
              <div className="flex flex-col gap-5 max-w-3xl">
                {/* Header card */}
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-[--radius-md] border border-primary/20">
                  <span className="text-2xl mt-0.5">{template?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-base text-on-surface mb-0.5">{template?.name}</h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{template?.description}</p>
                  </div>
                  {editingInsightId !== selectedInsightId ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartEdit(selectedInsightId, template)}
                      className="shrink-0 gap-1.5"
                    >
                      <Settings2 size={13} />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        Hủy
                      </Button>
                      <Button variant="primary" size="sm" onClick={handleSaveEdit}>
                        Lưu
                      </Button>
                    </div>
                  )}
                </div>

                {/* Saved notice */}
                {savedNotice && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-[--radius-md] bg-tertiary-container text-xs font-medium text-on-tertiary-container">
                    <CheckCircle2 size={14} />
                    Đã lưu thay đổi — AI sẽ phân tích lại với cấu hình mới
                  </div>
                )}

                {/* Column list */}
                <div>
                  <h3 className="font-display font-bold text-sm text-on-surface mb-3">Các cột AI</h3>
                  <div className="flex flex-col gap-3">
                    {(editColumns || template?.columns || []).map((col, idx) => {
                      const isEditing = editingInsightId === selectedInsightId;
                      return (
                        <div
                          key={isEditing ? `edit-${idx}` : col.id}
                          className={cn(
                            'flex items-start gap-3 p-4 rounded-[--radius-md] transition-colors',
                            isEditing ? 'bg-surface-container-low border border-[var(--color-outline-variant)]' : 'bg-surface-container-low'
                          )}
                        >
                          {/* Icon picker */}
                          <div className="flex flex-col items-center gap-1 shrink-0">
                            {isEditing ? (
                              <input
                                type="text"
                                value={col.icon || ''}
                                maxLength={2}
                                onChange={(e) => updateColumn(idx, 'icon', e.target.value)}
                                className="w-10 h-10 text-center text-lg border border-[var(--color-outline-variant)] rounded-[--radius-sm] bg-surface-container-lowest focus:outline-none focus:border-primary"
                              />
                            ) : (
                              <span className="text-lg">{col.icon}</span>
                            )}
                          </div>

                          {/* Fields */}
                          <div className="flex-1 min-w-0 flex flex-col gap-2.5">
                            {/* Name row */}
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">Tên cột</label>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={col.name || ''}
                                    onChange={(e) => updateColumn(idx, 'name', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-sm border border-[var(--color-outline-variant)] rounded-[--radius-sm] bg-surface-container-lowest focus:outline-none focus:border-primary text-on-surface"
                                  />
                                ) : (
                                  <p className="text-sm font-semibold text-on-surface">{col.name}</p>
                                )}
                              </div>

                              {/* Data type */}
                              <div className="shrink-0">
                                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">Kiểu dữ liệu</label>
                                {isEditing ? (
                                  <select
                                    value={col.dataType || 'short_text'}
                                    onChange={(e) => updateColumn(idx, 'dataType', e.target.value)}
                                    className="px-2.5 py-1.5 text-xs border border-[var(--color-outline-variant)] rounded-[--radius-sm] bg-surface-container-lowest focus:outline-none focus:border-primary text-on-surface"
                                  >
                                    {DATA_TYPE_OPTIONS.map((opt) => (
                                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className={cn(
                                    'inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5',
                                    col.dataType === 'true_false' ? 'bg-blue-100 text-blue-700' :
                                    col.dataType === 'single_select' ? 'bg-amber-100 text-amber-700' :
                                    col.dataType === 'dropdown' ? 'bg-violet-100 text-violet-700' :
                                    'bg-slate-100 text-slate-600'
                                  )}>
                                    {DATA_TYPE_OPTIONS.find(o => o.key === col.dataType)?.label || 'Text'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Prompt */}
                            <div>
                              <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">Prompt AI</label>
                              {isEditing ? (
                                <textarea
                                  value={col.prompt || ''}
                                  onChange={(e) => updateColumn(idx, 'prompt', e.target.value)}
                                  rows={2}
                                  className="w-full px-2.5 py-1.5 text-xs border border-[var(--color-outline-variant)] rounded-[--radius-sm] bg-surface-container-lowest focus:outline-none focus:border-primary text-on-surface resize-y leading-relaxed"
                                />
                              ) : (
                                <p className="text-xs text-on-surface-variant leading-relaxed">{col.prompt}</p>
                              )}
                            </div>

                            {/* Options (for single_select / dropdown) */}
                            {(col.dataType === 'single_select' || col.dataType === 'dropdown') && (
                              <div>
                                <label className="text-[10px] font-semibold text-on-surface-variant mb-1 block">Tùy chọn</label>
                                <div className="flex flex-wrap gap-1.5">
                                  {(isEditing ? (col.dataOptions || []) : (col.dataOptions || [])).map((opt, oi) => (
                                    <span
                                      key={oi}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium"
                                    >
                                      {opt}
                                      {isEditing && (
                                        <button
                                          onClick={() => {
                                            const opts = [...(editColumns[idx].dataOptions || [])];
                                            opts.splice(oi, 1);
                                            updateColumn(idx, 'dataOptions', opts);
                                          }}
                                          className="text-primary/50 hover:text-primary transition-colors ml-0.5"
                                        >
                                          ×
                                        </button>
                                      )}
                                    </span>
                                  ))}
                                  {isEditing && (
                                    <button
                                      onClick={() => {
                                        const opts = [...(editColumns[idx].dataOptions || [])];
                                        opts.push('Tùy chọn mới');
                                        updateColumn(idx, 'dataOptions', opts);
                                      }}
                                      className="px-2 py-0.5 rounded-full border border-dashed border-[var(--color-outline-variant)] text-[10px] text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                                    >
                                      + Thêm
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add column */}
                  {editingInsightId === selectedInsightId && (
                    <button
                      onClick={() => {
                        const newCol = {
                          id: `custom-${Date.now()}`,
                          icon: '📊',
                          name: 'Cột mới',
                          prompt: 'Mô tả cột này làm gì...',
                          type: 'text',
                          dataType: 'short_text',
                          dataOptions: null,
                        };
                        setEditColumns((prev) => [...prev, newCol]);
                      }}
                      className="mt-3 w-full py-2.5 border border-dashed border-[var(--color-outline-variant)] rounded-[--radius-md] text-xs text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
                    >
                      + Thêm cột mới
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: Chi tiết ── */}
            {activeTab === 'detail' && (
              <div className="flex flex-col gap-4">
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
                    <button onClick={clearCrossFilter} className="mt-3 text-xs text-primary hover:underline">
                      Xóa bộ lọc
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between px-1 mb-1">
                      <p className="text-xs text-on-surface-variant">
                        {crossFilter ? (
                          <span><span className="font-semibold text-primary">{filteredRows.length}</span><span className="text-on-surface-variant"> / {conversations.rows.length} hội thoại</span></span>
                        ) : (
                          <span>{filteredRows.length} hội thoại</span>
                        )}
                      </p>
                      {crossFilter && (
                        <button onClick={clearCrossFilter} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                          <X size={11} />Bỏ lọc
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
                                  crossFilter?.field === col.field ? "text-primary bg-primary/5" : "text-on-surface-variant"
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
                                    className={cn("px-3 py-2.5 whitespace-nowrap transition-colors", isHighlighted ? "bg-primary/5" : "text-on-surface-variant")}
                                  >
                                    {col.field === 'temperature' && (
                                      <span className={cn('inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === 'Nóng' ? 'bg-red-100 text-red-700' : raw === 'Ấm' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                                      )}>{raw}</span>
                                    )}
                                    {col.field === 'isJunk' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === true ? 'bg-error-container text-on-error-container' : 'bg-tertiary-container text-on-tertiary-container'
                                      )}>{raw ? 'Có' : 'Không'}</span>
                                    )}
                                    {col.field === 'phoneStatus' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === 'Đã cho SĐT' ? 'bg-green-100 text-green-700' : raw === 'Chưa cho' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                                      )}>{raw}</span>
                                    )}
                                    {col.field === 'attitude' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === 'Tốt' ? 'bg-green-100 text-green-700' : raw === 'Trung bình' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                      )}>{raw}</span>
                                    )}
                                    {col.field === 'isNegative' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                      )}>{raw ? 'Tiêu cực' : 'Bình thường'}</span>
                                    )}
                                    {col.field === 'hasCompetitor' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                      )}>{raw ? 'Có' : 'Không'}</span>
                                    )}
                                    {col.field === 'priority' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === 'Cao' ? 'bg-red-100 text-red-700' : raw === 'Bình thường' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                      )}>{raw}</span>
                                    )}
                                    {col.field === 'status' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === 'Đã xử lý' ? 'bg-green-100 text-green-700' : raw === 'Đang xử lý' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                      )}>{raw}</span>
                                    )}
                                    {col.field === 'sentiment' && (
                                      <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
                                        raw === 'Tích cực' ? 'bg-green-100 text-green-700' : raw === 'Tiêu cực' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                      )}>{raw}</span>
                                    )}
                                    {!['temperature', 'isJunk', 'phoneStatus', 'attitude', 'isNegative', 'hasCompetitor', 'priority', 'status', 'sentiment'].includes(col.field) && (
                                      <span>{raw}</span>
                                    )}
                                  </td>
                                );
                              })}
                              <td className="px-3 py-2.5 whitespace-nowrap">
                                <span className={cn('inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full',
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
                              className={cn('w-7 h-7 rounded-[--radius-sm] text-xs font-medium transition-colors',
                                page === currentPage ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low'
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
          </div>
        </>
      )}
      </div>
    </div>
  );
}
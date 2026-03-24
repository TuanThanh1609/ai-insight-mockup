/**
 * DynamicMetricsGrid.jsx
 *
 * Tự động render cards metrics dựa trên columns thực tế có trong conversations.
 * Không còn hardcoded card types — grid hoàn toàn dynamic theo template.
 */

import { useMemo } from 'react';
import {
  Activity, AlertCircle, BarChart3, CheckCircle2, MessageCircle,
  TrendingUp, Users, MousePointerClick, Target
} from 'lucide-react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────

function toDisplayName(field) {
  return field
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// ─── CARD TYPE DETECTION ───────────────────────────────────────────────────

/**
 * Detect card type + config từ column metadata + data sample.
 * Trả về null nếu column không phù hợp để render thành card.
 */
function detectCardConfig(col, rows) {
  const field = col.field || '';
  const dataType = col.dataType || col.type || '';
  const name = col.name || '';
  const norm = (s) => String(s || '').toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const n = norm(name);
  const f = norm(field);

  // ── Skip meta / utility fields ──────────────────────────────────────
  if (['id', 'customer', 'platform', 'converted_at', 'row'].includes(field)) return null;
  if (f.includes('khách hàng') || f === 'customer') return null;

  // ── Temperature / Lead Heat ──────────────────────────────────────────
  if (
    n.includes('mức độ quan tâm') || n.includes('nhiệt độ') || n.includes('lead temp') ||
    f.includes('temperature') || f.includes('muc do quan tam') || f.includes('nhiet do')
  ) {
    return { type: 'temperature', label: name, field, icon: Activity, iconColor: 'text-primary' };
  }

  // ── Boolean / True-False ───────────────────────────────────────────
  if (dataType === 'true_false' || dataType === 'boolean') {
    // Special: Junk Lead / Satisfaction
    if (n.includes('rác') || n.includes('junk') || n.includes('hàng rác')) {
      return { type: 'bool-junk', label: name, field, icon: AlertCircle, iconColor: 'text-error-container' };
    }
    if (n.includes('giới thiệu') || n.includes('refer') || n.includes('bức xúc') || n.includes('frustration')) {
      return { type: 'bool-binary', label: name, field, icon: CheckCircle2, iconColor: 'text-primary' };
    }
    return { type: 'bool-generic', label: name, field, icon: BarChart3, iconColor: 'text-primary' };
  }

  // ── Single-select / Enum / Dropdown ─────────────────────────────────
  if (['single_select', 'dropdown', 'enum'].includes(dataType)) {

    // Categorical: phone, objection, objection, attitude, message type, booking
    if (n.includes('thu thập') || n.includes('sđt') || n.includes('phone') || f === 'phone_status') {
      return { type: 'phone-status', label: name, field, icon: CheckCircle2, iconColor: 'text-primary' };
    }
    if (n.includes('thái độ') || n.includes('attitude')) {
      return { type: 'attitude', label: name, field, icon: Users, iconColor: 'text-primary' };
    }
    if (n.includes('đối thủ') || n.includes('competitor') || n.includes('nhắc đến')) {
      return { type: 'competitor-mention', label: name, field, icon: Target, iconColor: 'text-primary' };
    }
    if (n.includes('rào cản') || n.includes('objection') || n.includes('băn khoăn')) {
      return { type: 'top-list', label: name, field, icon: BarChart3, iconColor: 'text-primary', color: '#f59e0b' };
    }
    if (n.includes('mục đích') || n.includes('message type') || n.includes('loại tin')) {
      return { type: 'top-list', label: name, field, icon: MessageCircle, iconColor: 'text-primary', color: '#8b5cf6' };
    }
    if (n.includes('ý định') || n.includes('booking') || n.includes('đặt lịch') || n.includes('đặt bàn')) {
      return { type: 'top-list', label: name, field, icon: TrendingUp, iconColor: 'text-tertiary-container', color: '#059669' };
    }
    if (n.includes('sản phẩm') || n.includes('quan tâm') || n.includes('product') || n.includes('treatment') || n.includes('destination') || n.includes('dịch vụ')) {
      return { type: 'top-list', label: name, field, icon: TrendingUp, iconColor: 'text-primary', color: '#3b82f6' };
    }
    if (n.includes('ngân sách') || n.includes('budget')) {
      return { type: 'top-list', label: name, field, icon: BarChart3, iconColor: 'text-primary', color: '#10b981' };
    }
    if (n.includes('khu vực') || n.includes('location') || n.includes('tỉnh')) {
      return { type: 'top-list', label: name, field, icon: Target, iconColor: 'text-primary', color: '#6366f1' };
    }
    if (n.includes('giới tính') || n.includes('gender') || n.includes('phân loại khách')) {
      return { type: 'gender', label: name, field, icon: Users, iconColor: 'text-primary' };
    }
    if (n.includes('lỗi') || n.includes('mistake') || n.includes('sai sót')) {
      return { type: 'top-list', label: name, field, icon: AlertCircle, iconColor: 'text-error-container', color: '#ef4444' };
    }
    if (n.includes('đối thủ') || n.includes('tiêu chí') || n.includes('criteria') || n.includes('so sánh')) {
      return { type: 'top-list', label: name, field, icon: Target, iconColor: 'text-tertiary-container', color: '#f59e0b' };
    }
    if (n.includes('nhu cầu') || n.includes('pain point') || n.includes('vấn đề') || n.includes('cot loi')) {
      return { type: 'top-list', label: name, field, icon: AlertCircle, iconColor: 'text-warning-container', color: '#f59e0b', highlight: true };
    }
    // Generic categorical → top list
    return { type: 'top-list', label: name, field, icon: BarChart3, iconColor: 'text-primary' };
  }

  // ── Short text → top-list (value frequency) ───────────────────────
  if (dataType === 'short_text' || dataType === 'text' || !dataType) {
    // Skip long text fields
    if (n.includes('nội dung') || n.includes('message') || n.includes('tin nhắn')) return null;
    return { type: 'top-list', label: name, field, icon: TrendingUp, iconColor: 'text-primary' };
  }

  return null; // Unknown type — skip
}

// ─── Value distribution helper ────────────────────────────────────────────────

function topByField(rows, fieldName, limit = 5) {
  if (!fieldName || !rows || rows.length === 0) return [];
  const map = {};
  rows.forEach(r => {
    const v = r[fieldName];
    if (v !== undefined && v !== null && String(v).trim() !== '') {
      const key = String(v);
      map[key] = (map[key] || 0) + 1;
    }
  });
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([text, count]) => ({ text, count }));
}

// ─── Mini chart components ────────────────────────────────────────────────────

function TemperatureMiniChart({ data, onClick }) {
  const total = (data.hot || 0) + (data.warm || 0) + (data.cold || 0);
  if (total === 0) return null;
  const bars = [
    { label: 'Nóng', value: data.hot || 0, color: '#ef4444', pct: Math.round(((data.hot || 0) / total) * 100), filterKey: 'Nóng' },
    { label: 'Ấm', value: data.warm || 0, color: '#f59e0b', pct: Math.round(((data.warm || 0) / total) * 100), filterKey: 'Ấm' },
    { label: 'Lạnh', value: data.cold || 0, color: '#3b82f6', pct: Math.round(((data.cold || 0) / total) * 100), filterKey: 'Lạnh' },
  ];
  return (
    <div className="flex flex-col gap-1.5">
      {bars.map(bar => (
        <div key={bar.label}>
          <div className="flex justify-between mb-0.5">
            <span className="text-[10px] text-on-surface-variant">{bar.label}</span>
            <button
              onClick={() => bar.value > 0 && onClick?.({ field: null, value: null, label: bar.label, count: bar.value })}
              className={cn("text-[10px] font-semibold", bar.value > 0 ? "text-on-surface hover:text-primary cursor-pointer" : "text-on-surface-variant/40")}
            >
              {bar.value} ({bar.pct}%)
            </button>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-container-low overflow-hidden">
            <button
              onClick={() => bar.value > 0 && onClick?.({ field: null, value: null, label: bar.label, count: bar.value })}
              className="h-full rounded-full transition-all duration-700 hover:brightness-110"
              style={{ width: `${bar.pct}%`, background: bar.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function TopListCard({ items, onClick, highlight, accentColor }) {
  if (!items || items.length === 0) return <p className="text-[10px] text-on-surface-variant">Chưa có dữ liệu</p>;
  const total = items.reduce((s, i) => s + (i.count || 0), 0);
  return (
    <div className="flex flex-col gap-1">
      {items.slice(0, 4).map((item, i) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={i} className="flex items-center gap-1.5 min-w-0">
            {highlight ? (
              <span className="text-[10px] font-semibold text-warning-container shrink-0">{i + 1}</span>
            ) : null}
            <button
              onClick={() => onClick?.({ field: null, value: item.text, label: item.text, count: item.count })}
              className={cn(
                "text-[10px] text-on-surface hover:text-primary cursor-pointer text-left truncate flex-1 min-w-0",
                highlight ? "text-warning-container hover:text-primary" : ""
              )}
            >
              {item.text}
            </button>
            <span className="text-[10px] font-semibold text-on-surface-variant shrink-0">{item.count}</span>
            <div className="w-8 h-1 bg-surface-container-low rounded-full overflow-hidden shrink-0">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: accentColor || 'var(--color-primary)' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BoolJunkCard({ rows, field, onClick }) {
  const trueCount = rows.filter(r => r[field] === true || r[field] === 'true' || r[field] === 1).length;
  const falseCount = rows.length - trueCount;
  const total = rows.length;
  if (total === 0) return null;
  const truePct = Math.round((trueCount / total) * 100);
  const falsePct = 100 - truePct;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[10px]">
        <span className="text-green-600 font-semibold">Thật ({trueCount})</span>
        <span className="text-red-500 font-semibold">Rác ({falseCount})</span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden bg-surface-container-low flex">
        <button
          onClick={() => onClick?.({ field, value: true, label: 'Lead thật', count: trueCount })}
          className="h-full bg-green-500 hover:brightness-110 transition-all"
          style={{ width: `${truePct}%` }}
        />
        <button
          onClick={() => onClick?.({ field, value: false, label: 'Junk Lead', count: falseCount })}
          className="h-full bg-red-500 hover:brightness-110 transition-all"
          style={{ width: `${falsePct}%` }}
        />
      </div>
    </div>
  );
}

function GenderCard({ rows, field, onClick }) {
  const counts = {};
  rows.forEach(r => {
    const v = String(r[field] || 'Không rõ').trim();
    counts[v] = (counts[v] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = rows.length;
  const COLORS = ['#ec4899', '#3b82f6', '#94a3b8', '#f59e0b', '#10b981'];
  return (
    <div className="flex flex-col gap-1">
      {entries.slice(0, 3).map(([label, count], i) => {
        const pct = Math.round((count / total) * 100);
        return (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLORS[i] || '#94a3b8' }} />
            <button
              onClick={() => onClick?.({ field, value: label, label, count })}
              className="text-[10px] text-on-surface hover:text-primary cursor-pointer flex-1 text-left truncate"
            >
              {label}
            </button>
            <span className="text-[10px] font-semibold text-on-surface-variant">{count} ({pct}%)</span>
          </div>
        );
      })}
    </div>
  );
}

function PhoneStatusCard({ rows, field, onClick }) {
  const counts = {};
  rows.forEach(r => {
    const v = String(r[field] || '').trim() || 'Không rõ';
    counts[v] = (counts[v] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const COLORS = { 'Đã cho SĐT': '#10b981', 'Chưa cho': '#6b7280', 'Khách từ chối': '#ef4444', 'Không rõ': '#94a3b8' };
  return (
    <div className="flex flex-col gap-1">
      {entries.slice(0, 3).map(([label, count]) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: COLORS[label] || '#94a3b8' }} />
          <span className="text-[10px] text-on-surface flex-1 truncate">{label}</span>
          <span className="text-[10px] font-semibold text-on-surface-variant">{count}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Per-column card renderer ────────────────────────────────────────────────

function ColumnCard({ col, rows, onCrossFilter, config }) {
  const { type, label, field, icon: Icon, iconColor } = config;
  const items = topByField(rows, field);

  // Temperature: already computed in analysis, use directly
  if (type === 'temperature') {
    const tempData = {};
    items.forEach(item => {
      if (item.text === 'Nóng' || item.text === 'Hot') tempData.hot = (tempData.hot || 0) + item.count;
      else if (item.text === 'Ấm' || item.text === 'Warm') tempData.warm = (tempData.warm || 0) + item.count;
      else if (item.text === 'Lạnh' || item.text === 'Cold') tempData.cold = (tempData.cold || 0) + item.count;
      else {
        // Auto-classify by text
        if (item.text?.toLowerCase().includes('nóng') || item.text?.toLowerCase().includes('hot')) tempData.hot = (tempData.hot || 0) + item.count;
        else if (item.text?.toLowerCase().includes('ấm') || item.text?.toLowerCase().includes('warm')) tempData.warm = (tempData.warm || 0) + item.count;
        else tempData.cold = (tempData.cold || 0) + item.count;
      }
    });
    if (tempData.hot + tempData.warm + tempData.cold === 0) return null;
    return (
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon size={13} className={iconColor} />}
            <h3 className="font-display font-bold text-[11px] text-on-surface">{label}</h3>
          </div>
          <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
            <MousePointerClick size={9} />Filter
          </span>
        </div>
        <TemperatureMiniChart
          data={tempData}
          onClick={onCrossFilter}
        />
      </Card>
    );
  }

  if (type === 'bool-junk') {
    return (
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon size={13} className={iconColor} />}
            <h3 className="font-display font-bold text-[11px] text-on-surface">{label}</h3>
          </div>
        </div>
        <BoolJunkCard rows={rows} field={field} onClick={onCrossFilter} />
      </Card>
    );
  }

  if (type === 'gender') {
    return (
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon size={13} className={iconColor} />}
            <h3 className="font-display font-bold text-[11px] text-on-surface">{label}</h3>
          </div>
        </div>
        <GenderCard rows={rows} field={field} onClick={onCrossFilter} />
      </Card>
    );
  }

  if (type === 'phone-status') {
    return (
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            {Icon && <Icon size={13} className={iconColor} />}
            <h3 className="font-display font-bold text-[11px] text-on-surface">{label}</h3>
          </div>
        </div>
        <PhoneStatusCard rows={rows} field={field} onClick={onCrossFilter} />
      </Card>
    );
  }

  // Generic top-list
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon size={13} className={iconColor} />}
          <h3 className="font-display font-bold text-[11px] text-on-surface">{label}</h3>
        </div>
        <span className="text-[9px] text-on-surface-variant/50 flex items-center gap-0.5">
          <MousePointerClick size={9} />Filter
        </span>
      </div>
      <TopListCard items={items} onClick={onCrossFilter} highlight={config.highlight} accentColor={config.color} />
    </Card>
  );
}

// ─── Main DynamicMetricsGrid ────────────────────────────────────────────────

/**
 * conversations: { columns, rows } — từ getConversations()
 * crossFilter: { field, value } — filter hiện tại
 * onCrossFilter: (filter) => void
 */
export function DynamicMetricsGrid({ conversations, crossFilter, onCrossFilter }) {
  const rows = conversations?.rows || [];
  const columns = conversations?.columns || [];

  // Apply cross-filter first
  const filteredRows = crossFilter
    ? rows.filter(row => {
        const fv = row[crossFilter.field];
        if (typeof crossFilter.value === 'boolean') return fv === crossFilter.value;
        return String(fv) === String(crossFilter.value);
      })
    : rows;

  // Detect card config for each column
  const cardConfigs = useMemo(() => {
    return columns
      .map(col => detectCardConfig(col, rows))
      .filter(Boolean);
  }, [columns, rows]);

  if (cardConfigs.length === 0) {
    return (
      <div className="text-center py-8">
        <BarChart3 size={32} className="text-on-surface-variant/30 mx-auto mb-2" />
        <p className="text-xs text-on-surface-variant">Chưa có metrics nào được cấu hình</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
      {cardConfigs.map((config, i) => (
        <ColumnCard
          key={`${config.field}-${i}`}
          col={{ field: config.field }}
          rows={filteredRows}
          onCrossFilter={onCrossFilter}
          config={config}
        />
      ))}
    </div>
  );
}

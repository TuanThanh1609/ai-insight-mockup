/**
 * DynamicMetricsGrid.jsx — v2
 *
 * 6 chart type palette — mỗi card lớn, scan được trong 3 giây:
 *   1. ScoreCard       — KPI lớn + progress bar + 3 stat chips
 *   2. DonutChart     — True/False với SVG donut
 *   3. BarChart       — Top-N horizontal bars (ranking)
 *   4. GaugeCard      — Level/score với arc SVG + per-category bars
 *   5. TemperatureCard — 3-bar Nóng/Ấm/Lạnh + summary chips
 *   6. ChipGrid       — Demographic / multi-category pills
 *
 * Layout: grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 (3 block/hàng)
 * Card padding: p-5 (lớn hơn phiên bản cũ p-3)
 */

import { cn } from '../../lib/utils';

// ─── Detect chart type from column metadata ─────────────────────────────────

function detectCardType(col) {
  const field = col.field || '';
  const dataType = col.dataType || '';
  const name = (col.name || '').toLowerCase();
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const n = norm(name);
  const f = norm(field);

  // Kịch bản bán hàng → Scenario performance bars with chot rate
  if (f.includes('scenario') || n.includes('kich ban') || n.includes('kịch bản')) {
    return 'scenario-bars';
  }

  // Junk / boolean binary → Donut
  if (dataType === 'true_false' || f.includes('isjunk') || f.includes('is_junk') ||
      f.includes('canrefer') || f.includes('can_refer') ||
      f.includes('hascompetitor') || f.includes('has_competitor') ||
      f.includes('missed_conv') || f.includes('missedconv') ||
      f.includes('silent_cust') || f.includes('silentcust') ||
      f.includes('chot_don') || f.includes('chotdon')) {
    if (f.includes('isjunk') || f.includes('is_junk')) return 'donut-bool';
    if (f.includes('scenario')) return 'scenario-bars';
    return 'donut-binary';
  }

  // Temperature → Temperature
  if (n.includes('mức độ quan tâm') || n.includes('nhiệt độ') ||
      n.includes('lead temp') || f.includes('temperature') ||
      f.includes('nhiet do') || f.includes('muc do quan tam')) {
    return 'temperature';
  }

  // Channel donut (platform → facebook/zalo)
  if (dataType === 'channel' || f === 'kênh' || f === 'channel' || f === 'platform') {
    return 'channel';
  }

  // Single-select with few options → Gauge (attitude, satisfaction)
  if (dataType === 'single_select' || dataType === 'dropdown') {
    if (n.includes('thái độ') || n.includes('attitude') ||
        n.includes('hài lòng') || n.includes('satisfaction') ||
        n.includes('mức độ')) {
      return 'gauge';
    }
    if (n.includes('giới tính') || n.includes('gender') ||
        n.includes('phân loại khách') || n.includes('segment')) {
      return 'chip-grid';
    }
    if (n.includes('khu vực') || n.includes('location') ||
        n.includes('tỉnh') || n.includes('độ tuổi') || n.includes('baby_age')) {
      return 'chip-grid';
    }
    if (n.includes('ngân sách') || n.includes('budget') ||
        n.includes('gia') || n.includes('price')) {
      return 'chip-grid';
    }
    // Default for dropdown/categorical → Bar (top list)
    return 'bar';
  }

  // Short text → Bar (frequency)
  return 'bar';
}

// ─── Value frequency helper ──────────────────────────────────────────────────

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

// ─── Chart 1: Score Card ─────────────────────────────────────────────────────

function ScoreCard({ col, rows, onFilter }) {
  const field = col.field;
  const items = topByField(rows, field, 3);
  const total = rows.length;
  const topItem = items[0];
  const topPct = topItem && total > 0 ? Math.round((topItem.count / total) * 100) : 0;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <button
          onClick={() => onFilter?.({ field, value: null, label: 'Tất cả', count: total })}
          className="text-[10px] text-on-surface-variant hover:text-primary transition-colors px-2 py-0.5 rounded-sm hover:bg-primary/8"
        >
          Tất cả
        </button>
      </div>

      {/* KPI large */}
      <div className="flex items-end gap-2">
        <span className="font-display font-bold text-4xl text-on-surface leading-none">{topItem?.count ?? 0}</span>
        <span className="text-sm text-on-surface-variant mb-1.5">/{total}</span>
        <span className="ml-auto text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-1.5">
          {topPct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${topPct}%` }}
        />
      </div>

      {/* 3 stat chips */}
      <div className="flex gap-2 flex-wrap">
        {items.slice(0, 3).map((item, i) => (
          <button
            key={item.text}
            onClick={() => onFilter?.({ field, value: item.text, label: item.text, count: item.count })}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all',
              i === 0
                ? 'bg-primary/12 text-primary'
                : 'bg-surface-container-lowest text-on-surface hover:bg-primary/8 hover:text-primary'
            )}
          >
            <span>{item.text}</span>
            <span className="opacity-70 font-semibold">{item.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Chart 2: Donut Chart (Boolean) ─────────────────────────────────────────

function DonutChart({ col, rows, onFilter }) {
  const field = col.field;
  const total = rows.length;
  const trueCount = rows.filter(r => r[field] === true || r[field] === 'true' || r[field] === 1).length;
  const falseCount = total - trueCount;
  if (total === 0) return null;

  const truePct = Math.round((trueCount / total) * 100);
  const falsePct = 100 - truePct;
  const circumference = 2 * Math.PI * 36;
  const trueArc = (truePct / 100) * circumference;
  const falseArc = (falsePct / 100) * circumference;

  const f = field.toLowerCase();
  const isJunk = f.includes('junk') || f.includes('rác');
  const isMissedConv = f.includes('missed_conv') || f.includes('missedconv') || f.includes('bỏ sót');
  const isSilentCust = f.includes('silent_cust') || f.includes('silentcust') || f.includes('im lặng');
  const isChotDon = f.includes('chot_don') || f.includes('chotdon') || f.includes('chốt đơn');
  const labelA = isJunk ? 'Rác' : isMissedConv ? 'Bỏ sót' : isSilentCust ? 'Im lặng' : isChotDon ? 'Chốt đơn' : 'Có';
  const labelB = isJunk ? 'Thật' : isMissedConv ? 'Bình thường' : isSilentCust ? 'Phản hồi' : isChotDon ? 'Chưa chốt' : 'Không';
  const colorA = isJunk || isMissedConv || isSilentCust ? '#ef4444' : '#10b981';
  const colorB = isJunk || isMissedConv || isSilentCust ? '#10b981' : '#6b7280';

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <button
          onClick={() => onFilter?.({ field, value: null, label: 'Tất cả', count: total })}
          className="text-[10px] text-on-surface-variant hover:text-primary transition-colors px-2 py-0.5 rounded-sm hover:bg-primary/8"
        >
          Tất cả
        </button>
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-4">
        {/* SVG donut */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="36" fill="none"
              stroke="var(--color-surface-container-lowest)" strokeWidth="10" />
            <circle cx="40" cy="40" r="36" fill="none"
              stroke={colorB} strokeWidth="10"
              strokeDasharray={`${falseArc} ${circumference - falseArc}`}
              strokeDashoffset="0" strokeLinecap="butt" />
            <circle cx="40" cy="40" r="36" fill="none"
              stroke={colorA} strokeWidth="10"
              strokeDasharray={`${trueArc} ${circumference - trueArc}`}
              strokeDashoffset={`${-falseArc}`} strokeLinecap="butt" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-xl text-on-surface leading-none">{truePct}</span>
            <span className="text-[9px] text-on-surface-variant">%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {[
            { label: labelA, count: trueCount, pct: truePct, color: colorA, val: true },
            { label: labelB, count: falseCount, pct: falsePct, color: colorB, val: false },
          ].map(({ label, count, pct, color, val }) => (
            <button
              key={label}
              onClick={() => count > 0 && onFilter?.({ field, value: val, label, count })}
              className="flex items-center gap-2.5 rounded-lg p-2 -mx-1 hover:bg-surface-container-lowest transition-colors"
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-on-surface truncate">{label}</span>
                  <span className="text-xs font-bold ml-2 shrink-0" style={{ color }}>{count}</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-lowest rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Chart 3: Bar Chart (Top-N Horizontal) ─────────────────────────────────

function BarChart({ col, rows, onFilter }) {
  const field = col.field;
  const items = topByField(rows, field, 5);
  const total = items.reduce((s, i) => s + (i.count || 0), 0);

  if (items.length === 0) {
    return (
      <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface">{col.name}</h3>
        </div>
        <p className="text-xs text-on-surface-variant text-center py-4">Chưa có dữ liệu</p>
      </div>
    );
  }

  const maxCount = items[0]?.count || 1;
  const ACCENT_COLORS = [
    'var(--color-primary)', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'
  ];

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <span className="text-[10px] text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full">
          Top {items.length}
        </span>
      </div>

      {/* Bars */}
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const pct = Math.round((item.count / maxCount) * 100);
          const sharePct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
          return (
            <button
              key={item.text}
              onClick={() => onFilter?.({ field, value: item.text, label: item.text, count: item.count })}
              className="flex items-center gap-2.5 group"
            >
              <span className="w-5 h-5 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-on-surface-variant">{i + 1}</span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-on-surface truncate group-hover:text-primary transition-colors font-medium">
                    {item.text}
                  </span>
                  <span className="text-xs font-bold shrink-0 ml-2" style={{ color }}>
                    {item.count} <span className="text-[10px] font-normal opacity-70">({sharePct}%)</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 4: Gauge Card ────────────────────────────────────────────────────

function GaugeCard({ col, rows, onFilter }) {
  const field = col.field;
  const counts = {};
  rows.forEach(r => {
    const v = String(r[field] || 'Không rõ').trim();
    counts[v] = (counts[v] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = rows.length;

  const LEVEL_COLORS = {
    'Tốt': '#10b981', 'Tích cực': '#10b981', 'Cao': '#10b981',
    'Trung bình': '#f59e0b', 'Khá': '#f59e0b', 'Bình thường': '#f59e0b',
    'Kém': '#ef4444', 'Tiêu cực': '#ef4444', 'Thấp': '#ef4444',
  };

  const topColor = LEVEL_COLORS[entries[0]?.[0]] || 'var(--color-primary)';
  const topPct = entries[0] && total > 0 ? Math.round((entries[0][1] / total) * 100) : 0;
  const arcCircumference = Math.PI * 36;
  const dashArray = `${(topPct / 100) * arcCircumference} ${arcCircumference}`;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
      </div>

      {/* Gauge arc + top label */}
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-14 shrink-0">
          <svg viewBox="0 0 80 28" className="w-full h-full">
            <path d="M 4 24 A 36 36 0 0 1 76 24" fill="none"
              stroke="var(--color-surface-container-lowest)" strokeWidth="8" strokeLinecap="round" />
            <path d="M 4 24 A 36 36 0 0 1 76 24" fill="none"
              stroke={topColor} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={dashArray}
              className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="font-display font-bold text-xl leading-none" style={{ color: topColor }}>
              {topPct}%
            </span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-on-surface">{entries[0]?.[0] ?? '—'}</p>
          <p className="text-[10px] text-on-surface-variant mt-0.5">
            {entries[0]?.[1]} / {total} hội thoại
          </p>
        </div>
      </div>

      {/* Per-level buttons */}
      <div className="flex gap-2">
        {entries.slice(0, 3).map(([label, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const color = LEVEL_COLORS[label] || 'var(--color-on-surface-variant)';
          return (
            <button
              key={label}
              onClick={() => onFilter?.({ field, value: label, label, count })}
              className="flex-1 flex flex-col items-center gap-0.5 p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
            >
              <span className="text-xs font-bold" style={{ color }}>{count}</span>
              <span className="text-[10px] text-on-surface-variant truncate w-full text-center">{label}</span>
              <div className="w-full h-1 bg-surface-container-low rounded-full mt-0.5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 5: Temperature Card ─────────────────────────────────────────────

function TemperatureCard({ col, rows, onFilter }) {
  const field = col.field;
  const tempData = { hot: 0, warm: 0, cold: 0 };

  rows.forEach(r => {
    const v = String(r[field] || '').toLowerCase();
    if (v.includes('nóng') || v.includes('hot')) tempData.hot += 1;
    else if (v.includes('ấm') || v.includes('warm')) tempData.warm += 1;
    else if (v.includes('lạnh') || v.includes('cold')) tempData.cold += 1;
    else {
      if (v.includes('giá') || v.includes('mua') || v.includes('sđt') || v.includes('còn')) tempData.hot += 1;
      else if (v.includes('tư vấn') || v.includes('xem')) tempData.warm += 1;
      else tempData.cold += 1;
    }
  });

  const total = tempData.hot + tempData.warm + tempData.cold;
  if (total === 0) return null;

  const bars = [
    { key: 'hot', label: 'Nóng', value: tempData.hot, color: '#ef4444', filterKey: 'Nóng' },
    { key: 'warm', label: 'Ấm', value: tempData.warm, color: '#f59e0b', filterKey: 'Ấm' },
    { key: 'cold', label: 'Lạnh', value: tempData.cold, color: '#3b82f6', filterKey: 'Lạnh' },
  ];
  const maxVal = Math.max(...bars.map(b => b.value), 1);

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '🌡️'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <span className="text-[10px] text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full">
          {total} KH
        </span>
      </div>

      {/* 3 temperature bars */}
      <div className="flex flex-col gap-3">
        {bars.map(bar => {
          const pct = Math.round((bar.value / total) * 100);
          const barPct = Math.round((bar.value / maxVal) * 100);
          return (
            <button
              key={bar.key}
              onClick={() => bar.value > 0 && onFilter?.({ field, value: bar.filterKey, label: bar.label, count: bar.value })}
              className="flex items-center gap-3 group"
            >
              <span className="w-8 text-xs font-semibold text-on-surface shrink-0 text-left">{bar.label}</span>
              <div className="flex-1 h-3 bg-surface-container-lowest rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                  style={{ width: `${barPct}%`, background: bar.color }}
                />
              </div>
              <div className="w-14 text-right shrink-0">
                <span className="text-xs font-bold" style={{ color: bar.color }}>{bar.value}</span>
                <span className="text-[10px] text-on-surface-variant ml-1">({pct}%)</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap">
        {bars.map(bar => {
          const pct = Math.round((bar.value / total) * 100);
          return (
            <button
              key={bar.key}
              onClick={() => bar.value > 0 && onFilter?.({ field, value: bar.filterKey, label: bar.label, count: bar.value })}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                bar.value > 0 ? 'cursor-pointer hover:brightness-90 active:scale-95' : 'opacity-40 cursor-default'
              )}
              style={{ background: `${bar.color}18`, color: bar.color }}
            >
              <span>{bar.label}</span>
              <span className="font-bold">{bar.value}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 6: Channel Donut ────────────────────────────────────────────────

function ChannelDonut({ col, rows, onFilter }) {
  const counts = {};
  rows.forEach(r => {
    const v = String(r[col.field] || 'Không rõ').trim();
    counts[v] = (counts[v] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = rows.length;

  if (total === 0 || entries.length === 0) return null;

  // Facebook = blue, Zalo = purple, Others = slate
  const CHANNEL_COLORS = {
    'facebook': '#3b82f6',
    'zalo': '#8b5cf6',
  };
  const CHANNEL_LABELS = {
    'facebook': 'Facebook',
    'zalo': 'Zalo',
  };

  const circumference = 2 * Math.PI * 36;
  let offset = 0;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📡'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <button
          onClick={() => onFilter?.({ field: 'platform', value: null, label: 'Tất cả', count: total })}
          className="text-[10px] text-on-surface-variant hover:text-primary transition-colors px-2 py-0.5 rounded-sm hover:bg-primary/8"
        >
          Tất cả
        </button>
      </div>

      {/* Donut + legend */}
      <div className="flex items-center gap-4">
        {/* SVG donut */}
        <div className="relative w-24 h-24 shrink-0">
          <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
            <circle cx="40" cy="40" r="36" fill="none"
              stroke="var(--color-surface-container-lowest)" strokeWidth="10" />
            {entries.map(([label], i) => {
              const segLength = (entries[i][1] / total) * circumference;
              const segOffset = offset;
              offset += segLength;
              const color = CHANNEL_COLORS[label] || '#94a3b8';
              return (
                <circle
                  key={label}
                  cx="40" cy="40" r="36" fill="none"
                  stroke={color} strokeWidth="10"
                  strokeDasharray={`${segLength} ${circumference - segLength}`}
                  strokeDashoffset={`${-segOffset}`}
                  strokeLinecap="butt"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-bold text-xl text-on-surface leading-none">{total}</span>
            <span className="text-[9px] text-on-surface-variant">tổng</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2.5 flex-1">
          {entries.map(([label, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const color = CHANNEL_COLORS[label] || '#94a3b8';
            const displayLabel = CHANNEL_LABELS[label] || label;
            return (
              <button
                key={label}
                onClick={() => count > 0 && onFilter?.({ field: 'platform', value: label, label: displayLabel, count })}
                className="flex items-center gap-2.5 rounded-lg p-2 -mx-1 hover:bg-surface-container-lowest transition-colors"
              >
                <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-on-surface truncate">{displayLabel}</span>
                    <span className="text-xs font-bold ml-2 shrink-0" style={{ color }}>{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-lowest rounded-full mt-1 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pill row */}
      <div className="flex gap-2 flex-wrap">
        {entries.map(([label, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const color = CHANNEL_COLORS[label] || '#94a3b8';
          const displayLabel = CHANNEL_LABELS[label] || label;
          return (
            <button
              key={label}
              onClick={() => count > 0 && onFilter?.({ field: 'platform', value: label, label: displayLabel, count })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all hover:brightness-90 active:scale-95"
              style={{ background: `${color}18`, color }}
            >
              <span>{displayLabel}</span>
              <span className="font-bold">{pct}%</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 7: Chip Grid (Demographics) ─────────────────────────────────────

function ChipGrid({ col, rows, onFilter }) {
  const field = col.field;
  const counts = {};
  rows.forEach(r => {
    const v = String(r[field] || 'Không rõ').trim();
    counts[v] = (counts[v] || 0) + 1;
  });
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const total = rows.length;

  const COLORS = [
    'var(--color-primary)', '#3b82f6', '#8b5cf6', '#10b981',
    '#f59e0b', '#ef4444', '#ec4899', '#06b6d4'
  ];

  if (entries.length === 0) return null;

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <button
          onClick={() => onFilter?.({ field, value: null, label: 'Tất cả', count: total })}
          className="text-[10px] text-on-surface-variant hover:text-primary transition-colors px-2 py-0.5 rounded-sm hover:bg-primary/8"
        >
          Tất cả
        </button>
      </div>

      {/* Row bars */}
      <div className="flex flex-col gap-2">
        {entries.slice(0, 6).map(([label, count], i) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const color = COLORS[i % COLORS.length];
          return (
            <button
              key={label}
              onClick={() => onFilter?.({ field, value: label, label, count })}
              className="flex items-center gap-2.5 group rounded-lg p-2 -mx-1 hover:bg-surface-container-lowest transition-colors"
            >
              <div className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
              <span className="text-xs text-on-surface truncate flex-1 text-left group-hover:text-primary transition-colors font-medium">
                {label}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-14 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
                <span className="text-xs font-bold w-8 text-right" style={{ color }}>{count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Pill row */}
      <div className="flex gap-1.5 flex-wrap">
        {entries.slice(0, 8).map(([label, count], i) => {
          const color = COLORS[i % COLORS.length];
          return (
            <button
              key={label}
              onClick={() => onFilter?.({ field, value: label, label, count })}
              className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium transition-all hover:brightness-90 active:scale-95"
              style={{ background: `${color}18`, color }}
            >
              <span>{label}</span>
              <span className="opacity-70 font-bold">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Chart 8: Scenario Performance Bars ─────────────────────────────────────

function ScenarioBarsCard({ col, rows, onFilter }) {
  const field = col.field;
  const SCENARIO_COLORS = {
    'Tư vấn chi phí': '#3b82f6',
    'Khai thác thông tin': '#8b5cf6',
    'Ưu đãi cá nhân hóa': '#10b981',
    'Giải quyết vấn đề': '#f59e0b',
  };

  // Count conversations per scenario
  const scenarioCounts = {};
  rows.forEach(r => {
    const v = String(r[field] || '').trim();
    if (v) scenarioCounts[v] = (scenarioCounts[v] || 0) + 1;
  });
  const total = rows.length;
  const entries = Object.entries(scenarioCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = entries[0]?.[1] || 1;

  // Count chot_don=true per scenario for conversion rate
  const chotByScenario = {};
  rows.forEach(r => {
    const v = String(r[field] || '').trim();
    if (v) {
      if (!chotByScenario[v]) chotByScenario[v] = { total: 0, chot: 0 };
      chotByScenario[v].total++;
      if (r.chot_don === true || r.chot_don === 'true') chotByScenario[v].chot++;
    }
  });

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/12 flex items-center justify-center">
            <span className="text-base">{col.icon || '📊'}</span>
          </div>
          <h3 className="font-display font-bold text-sm text-on-surface leading-tight">{col.name}</h3>
        </div>
        <span className="text-[10px] text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded-full">
          Top {entries.length}
        </span>
      </div>

      {/* Bars with chot rate */}
      <div className="flex flex-col gap-3">
        {entries.map(([scenario, count], i) => {
          const pct = Math.round((count / maxCount) * 100);
          const sharePct = total > 0 ? Math.round((count / total) * 100) : 0;
          const chotData = chotByScenario[scenario];
          const chotRate = chotData && chotData.total > 0
            ? Math.round((chotData.chot / chotData.total) * 100) : 0;
          const color = SCENARIO_COLORS[scenario] || `hsl(${i * 90}, 70%, 50%)`;
          return (
            <button
              key={scenario}
              onClick={() => onFilter?.({ field, value: scenario, label: scenario, count })}
              className="flex items-center gap-2.5 group"
            >
              <span className="w-5 h-5 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-on-surface-variant">{i + 1}</span>
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-on-surface truncate group-hover:text-primary transition-colors font-medium">
                    {scenario}
                  </span>
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span className="text-[10px] font-semibold text-on-surface-variant">
                      Chốt: {chotRate}%
                    </span>
                    <span className="text-xs font-bold shrink-0" style={{ color }}>
                      {count} <span className="text-[10px] font-normal opacity-70">({sharePct}%)</span>
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-surface-container-lowest rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 group-hover:brightness-110"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Card router ────────────────────────────────────────────────────────────

function MetricCard({ col, rows, onFilter }) {
  const cardType = detectCardType(col);

  switch (cardType) {
    case 'temperature':   return <TemperatureCard col={col} rows={rows} onFilter={onFilter} />;
    case 'donut-bool':
    case 'donut-binary':   return <DonutChart col={col} rows={rows} onFilter={onFilter} />;
    case 'bar':            return <BarChart col={col} rows={rows} onFilter={onFilter} />;
    case 'gauge':          return <GaugeCard col={col} rows={rows} onFilter={onFilter} />;
    case 'chip-grid':      return <ChipGrid col={col} rows={rows} onFilter={onFilter} />;
    case 'channel':        return <ChannelDonut col={col} rows={rows} onFilter={onFilter} />;
    case 'scenario-bars':  return <ScenarioBarsCard col={col} rows={rows} onFilter={onFilter} />;
    default:               return <BarChart col={col} rows={rows} onFilter={onFilter} />;
  }
}

// Alias for backward compat with InsightTrendChart.jsx (rows param ignored — dataType now in col)
export const detectCardConfig = (col, _rows) => detectCardType(col);

// ─── Main Grid ───────────────────────────────────────────────────────────────

export function DynamicMetricsGrid({ conversations, crossFilter, onCrossFilter }) {
  const rows = conversations?.rows || [];
  const columns = conversations?.columns || [];

  const cards = columns
    .map(col => ({ col, type: detectCardType(col) }))
    .filter(c => c.type !== null);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="var(--color-on-surface-variant)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-on-surface">Chưa có cấu hình metrics</p>
          <p className="text-xs text-on-surface-variant mt-1">
            Thêm columns trong tab Cấu hình để hiển thị chart
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 content-start">
      {cards.map(({ col }, i) => (
        <MetricCard
          key={`${col.field}-${i}`}
          col={col}
          rows={rows}
          onFilter={onCrossFilter}
        />
      ))}
    </div>
  );
}

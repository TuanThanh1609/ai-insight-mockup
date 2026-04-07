import { useEffect, useMemo, useState } from 'react';
import { cn } from '../../lib/utils';
import { generateAdsInterpretation, getAdsKpiAlertLevel } from '../../lib/adsMedicalService';
import { AdsOrderTable } from './AdsOrderTable';
import { AdsConversationDetailPanel } from './AdsConversationDetailPanel';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

/** Helper: get severity/neutral color for a metric */
function getMetricAlertColor(key, value) {
  const level = getAdsKpiAlertLevel(key, value);
  if (level === 'red')    return '#dc2626';
  if (level === 'yellow') return '#d97706';
  return '#059669';
}

function getMetricAlertBg(key, value) {
  const level = getAdsKpiAlertLevel(key, value);
  if (level === 'red')    return 'rgba(220,38,38,0.06)';
  if (level === 'yellow') return 'rgba(217,119,6,0.06)';
  return 'rgba(5,150,105,0.06)';
}

/** Highlighted metric row */
function HighlightedMetric({ metric }) {
  const color = getMetricAlertColor(metric.key, metric.value);
  const bg = getMetricAlertBg(metric.key, metric.value);
  const isRed = color === '#dc2626';
  const isYellow = color === '#d97706';
  const levelLabel = isRed ? 'nguy hiểm' : isYellow ? 'cần theo dõi' : 'tốt';

  const descriptions = {
    roasOriginal: 'ROAS gốc = doanh thu / chi tiêu quảng cáo. Cao hơn ≠ chính xác hơn nếu attribution lỗi.',
    roasActual: 'ROAS thực = doanh thu đã trừ phần không match được. Đây mới là con số đáng tin.',
    roasGap: 'ROAS lệch = chênh lệch giữa ROAS gốc và ROAS thực. Gap lớn = attribution đang có vấn đề.',
    untrackedRevenue: 'Doanh thu không gắn được với ads = tiền "bốc hơi" không rõ nguồn.',
    matchedRate: 'Tỉ lệ match = % đơn gắn đúng với ads. Dưới 70% = attribution không đáng tin.',
    ctr: 'CTR thấp = creative không đủ compelling. A/B test ngay.',
    hookRetention: 'Hook Retention = % khách xem qua giây đầu. Thấp = hook yếu.',
    scrollStopRate: 'Scroll Stop Rate = % khách dừng lại xem. Cao ≠ tốt (cần xem context).',
    overlapPercent: 'Audience Overlap = % khách nhìn thấy ads từ nhiều chiến dịch. Cao = lãng phí.',
    ageMatchRate: 'Khách đúng độ tuổi mục tiêu. Thấp = targeting chưa chính xác.',
    interestAccuracy: 'Interest targeting accuracy. Thấp = audience không đúng ICP.',
    dailyUtilization: '% ngân sách sử dụng mỗi ngày. Quá thấp/tcao đều有问题.',
    hourlySpread: 'Phân bổ chi tiêu theo giờ. Spread cao = không tập trung giờ cao điểm.',
    campaignBalance: 'Cân bằng ngân sách giữa các chiến dịch. Thấp = một số chiến dịch bị饿死.',
    fbRoas: 'Facebook ROAS — nếu thấp hơn Zalo nhiều → nên xem lại FB creative/targeting.',
    zaloRoas: 'Zalo ROAS — nền tảng có ROAS cao hơn → ưu tiên scale.',
    fbRevenueShare: 'Tỉ lệ đóng góp doanh thu từ Facebook.',
    hotToOrderRate: 'Tỉ lệ khách NÓNG chuyển thành đơn. Cao nhất trong 3 nhóm.',
    warmToOrderRate: 'Tỉ lệ khách ẤM chuyển thành đơn. Cần nurture sequence.',
    coldToOrderRate: 'Tỉ lệ khách LẠNH chuyển thành đơn. Thường thấp, cần re-engagement.',
    junkRate: 'Junk Rate = % khách không có intent mua thật. Cao → tạm dừng chiến dịch.',
    qualityRate: 'Quality Rate = % khách có giá trị thật sự.',
    spamRate: 'Spam Rate = % khách có hành vi spam-like.',
  };

  const desc = descriptions[metric.key] || `Chỉ số này cần được cải thiện.`;

  return (
    <div
      className="rounded-md p-3 transition-all"
      style={{ backgroundColor: bg, borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-start gap-2">
        <div className="shrink-0 mt-0.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-body-sm font-semibold text-on-surface">{metric.label}</span>
            <span className="text-headline-sm font-bold" style={{ color }}>
              {formatMetricValue(metric)}
            </span>
          </div>

          <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full rounded-full"
              style={{
                width: `${getBarWidth(metric)}%`,
                backgroundColor: color,
              }}
            />
          </div>

          <p className="text-body-xs text-on-surface-variant leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function formatMetricValue(metric) {
  const { value, format } = metric;
  switch (format) {
    case 'percent': return `${value}%`;
    case 'roas':    return `${value}x`;
    case 'currency': return value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${(value / 1000).toFixed(0)}K`;
    case 'days':    return `${value}d`;
    case 'number':  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value);
    default:        return String(value);
  }
}

function getBarWidth(metric) {
  const { value, format } = metric;
  switch (format) {
    case 'percent': return Math.min(100, value);
    case 'roas':    return Math.min(100, value * 15);       // max 6.67x → 100%
    case 'currency': return Math.min(100, value / 1000000);  // up to 10M → 100%
    case 'days':    return Math.min(100, value * 10);        // up to 10d → 100%
    default:        return Math.min(100, value * 2);
  }
}

// ─── 7-day ROAS trend chart ─────────────────────────────────────────────────

function buildRoasTrend(metrics, scoreSeed = 0) {
  const labels = ['T-6', 'T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Hôm nay'];
  const roasOrig = metrics.find(m => m.key === 'roasOriginal')?.value ?? 2;
  const roasAct  = metrics.find(m => m.key === 'roasActual')?.value ?? 1.5;

  return labels.map((label, idx) => {
    const seed = (scoreSeed * 10 + idx) * 0.91;
    const noiseOrig = (Math.sin(seed) * 0.3);
    const noiseAct  = (Math.sin(seed * 1.4) * 0.25);
    return {
      label,
      roasOriginal: parseFloat((roasOrig + noiseOrig).toFixed(2)),
      roasActual:   parseFloat((roasAct  + noiseAct ).toFixed(2)),
    };
  });
}

function RoasTrendChart({ metrics, score }) {
  const data = useMemo(() => buildRoasTrend(metrics, score * 1.37), [metrics, score]);

  return (
    <div className="bg-surface-container-low rounded-md p-4">
      <h4 className="text-label-sm text-on-surface-variant mb-2.5">XU HƯỚNG ROAS 7 NGÀY</h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,27,29,0.08)" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: 'rgba(28,27,29,0.12)' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={false}
              tickLine={false}
              width={32}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid rgba(28,27,29,0.12)',
                boxShadow: '0 6px 20px rgba(27,27,29,0.10)',
                fontSize: 12,
              }}
              formatter={(value, key) => [`${value}x`, key === 'roasOriginal' ? 'ROAS gốc' : 'ROAS thực']}
            />
            <Line
              type="monotone"
              dataKey="roasOriginal"
              stroke="#0052FF"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="roasActual"
              stroke="#059669"
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-[#0052FF] rounded" style={{ borderTop: '2px dashed #0052FF' }} />
          <span className="text-label-xs text-on-surface-variant">ROAS gốc</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-[#059669] rounded" />
          <span className="text-label-xs text-on-surface-variant">ROAS thực</span>
        </div>
      </div>
    </div>
  );
}

// ─── Breakdown table ────────────────────────────────────────────────────────

function BreakdownTable({ metrics }) {
  const roasOrig = metrics.find(m => m.key === 'roasOriginal')?.value ?? 0;
  const roasAct  = metrics.find(m => m.key === 'roasActual')?.value ?? 0;
  const matched  = metrics.find(m => m.key === 'matchedRate')?.value ?? 0;
  const untracked = metrics.find(m => m.key === 'untrackedRevenue')?.value ?? 0;

  const rows = [
    { label: 'ROAS gốc',          value: `${roasOrig.toFixed(2)}x`,  color: '#0052FF' },
    { label: 'ROAS thực',         value: `${roasAct.toFixed(2)}x`,  color: '#059669' },
    { label: 'Tỉ lệ match',       value: `${matched}%`,              color: matched >= 70 ? '#059669' : matched >= 50 ? '#d97706' : '#dc2626' },
    { label: 'Untracked Revenue',  value: formatMetricValue({ value: untracked, format: 'currency' }), color: '#dc2626' },
  ];

  return (
    <div className="bg-surface-container-low rounded-md p-4">
      <h4 className="text-label-sm text-on-surface-variant mb-3">SO SÁNH CHI TIẾT</h4>
      <div className="flex flex-col gap-2">
        {rows.map(row => (
          <div key={row.label} className="flex items-center gap-3">
            <span className="text-body-sm text-on-surface-variant w-32 shrink-0">{row.label}</span>
            <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: row.key === 'ROAS thực' ? `${Math.min(100, (roasAct / roasOrig) * 100)}%` : '100%',
                  backgroundColor: row.color,
                }}
              />
            </div>
            <span className="text-body-sm font-semibold w-20 text-right shrink-0" style={{ color: row.color }}>
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Interpretation tab ─────────────────────────────────────────────────────

function InterpretationTab({ disease }) {
  const interp = useMemo(() => generateAdsInterpretation(disease), [disease]);

  return (
    <div className="space-y-4">
      {/* Score highlight */}
      <div className="bg-surface-container-low rounded-md p-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-md flex items-center justify-center text-2xl shrink-0"
            style={{ backgroundColor: `${disease.severityColor}15` }}
          >
            {disease.icon}
          </div>
          <div>
            <div className="text-headline-sm font-bold" style={{ color: disease.severityColor }}>
              {disease.score} / 10
              <span className="text-body-sm font-normal text-on-surface-variant ml-2">
                — {disease.severity}
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant">{disease.label}</p>
          </div>
        </div>
      </div>

      {/* Chẩn đoán */}
      <div>
        <h4 className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Chẩn đoán
        </h4>
        <p className="text-body-sm text-on-surface leading-relaxed">
          {interp.diagnosis}
        </p>
      </div>

      {/* Vấn đề nổi bật */}
      <div>
        <h4 className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          Vấn đề nổi bật
        </h4>
        <div className="bg-surface-container-low rounded-md p-3 border-l-3"
          style={{ borderLeftColor: disease.severityColor }}>
          <p className="text-body-sm text-on-surface leading-relaxed">
            {interp.keyConcern}
          </p>
        </div>
      </div>

      {/* Tóm lại + hành động */}
      <div>
        <h4 className="text-label-sm text-on-surface-variant uppercase tracking-wide mb-2 flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          Tóm lại & Hành động
        </h4>
        <p className="text-body-sm text-on-surface leading-relaxed">
          {interp.bottomLine}
        </p>
      </div>

      {/* Summary chips */}
      <div className="pt-2 border-t border-[var(--color-outline-variant)]/30">
        <p className="text-label-sm text-on-surface-variant mb-2">TỔNG QUAN CHỈ SỐ</p>
        <div className="flex flex-wrap gap-2">
          {interp.summary.split(' · ').map((chip, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-surface-container-low rounded-full text-[11px] font-medium text-on-surface"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Overview tab ───────────────────────────────────────────────────────────

function OverviewTab({ disease }) {
  const { severity, severityColor, score, metrics } = disease;

  const criticalMetrics = metrics.filter(m => {
    const level = getAdsKpiAlertLevel(m.key, m.value);
    return level === 'red' || level === 'yellow';
  });

  return (
    <div className="space-y-4">
      {/* 4 metric KPI cards */}
      <div className="grid grid-cols-2 gap-3">
        {metrics.slice(0, 4).map(m => {
          const color = getMetricAlertColor(m.key, m.value);
          const bg = getMetricAlertBg(m.key, m.value);
          return (
            <div
              key={m.key}
              className="rounded-md p-3"
              style={{ backgroundColor: bg }}
            >
              <p className="text-label-xs text-on-surface-variant mb-1">{m.label}</p>
              <p className="text-headline-sm font-bold" style={{ color }}>
                {formatMetricValue(m)}
              </p>
              {m.key === 'roasGap' && (
                <p className="text-label-xs text-on-surface-variant mt-0.5">lệch</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Critical metrics */}
      {criticalMetrics.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={severityColor} strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <h4 className="text-label-sm font-semibold text-on-surface uppercase tracking-wide">
              Những chỉ số cần chú ý
            </h4>
          </div>
          <div className="flex flex-col gap-2">
            {criticalMetrics.map(m => (
              <HighlightedMetric key={m.key} metric={m} />
            ))}
          </div>
        </div>
      )}

      {/* All metrics bar */}
      <div className="bg-surface-container-low rounded-md p-4">
        <h4 className="text-label-sm text-on-surface-variant mb-3">TẤT CẢ CHỈ SỐ</h4>
        <div className="flex flex-col gap-2.5">
          {metrics.map(m => {
            const color = getMetricAlertColor(m.key, m.value);
            return (
              <div key={m.key} className="flex items-center gap-3">
                <span className="text-body-sm text-on-surface-variant w-36 shrink-0">{m.label}</span>
                <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${getBarWidth(m)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <span
                  className="text-body-sm font-semibold w-12 text-right shrink-0"
                  style={{ color }}
                >
                  {formatMetricValue(m)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ROAS trend chart (for roas-health group) */}
      {disease.id === 'roas-health' && (
        <RoasTrendChart metrics={metrics} score={score} />
      )}

      {/* Breakdown table (for roas-health group) */}
      {disease.id === 'roas-health' && (
        <BreakdownTable metrics={metrics} />
      )}
    </div>
  );
}

// ─── Detail tab — 3 sub-tabs ───────────────────────────────────────────────

function DetailTab({ disease, attributionData = [], campaigns = [] }) {
  const [subTab, setSubTab] = useState('ads-stats'); // 'ads-stats' | 'orders' | 'conversations'
  const summaryMetrics = disease.metrics || [];

  // ── Filter attribution rows for this disease ─────────────────────────────────
  const diseaseRows = useMemo(() => {
    return (attributionData || []).filter(r => {
      switch (disease.id) {
        case 'roas-health':
        case 'attribution-quality':
          return r.matchedRate != null;
        case 'ad-creative':
          return r.ctr != null;
        case 'audience-targeting':
          return r.overlapPercent != null;
        case 'budget-allocation':
          return r.dailyUtilization != null;
        case 'platform-performance':
          return r.fbRoas != null || r.zaloRoas != null;
        case 'lead-order-conversion':
          return r.hotToOrderRate != null;
        case 'junk-campaigns':
          return r.junkRate != null;
        default:
          return true;
      }
    });
  }, [attributionData, disease.id]);

  // ── Build mock conversations from attribution data ─────────────────────────
  const mockConversations = useMemo(() => {
    return diseaseRows.slice(0, 10).map((r, i) => {
      const isMatched = r.matchedRate > 55;
      const temps = ['Nóng', 'Nóng', 'Ấm', 'Lạnh'];
      const temp = isMatched ? temps[i % temps.length] : 'Lạnh';
      const orderValue = isMatched
        ? 200000 + (r.matchedRate || 50) * 8000
        : 0;
      return {
        id: `ads-conv-${r.campaignId}-${i}`,
        phone: `09${String(r.campaignId.length * 13 + i * 7 + 1).padStart(8, '0')}`,
        orderId: `ORD-2026-${String(1000 + i).padStart(4, '0')}`,
        orderValue,
        orderDate: new Date(Date.now() - i * 86400000 * 2).toISOString(),
        platform: r.platform || 'facebook',
        matchedConversationId: isMatched ? `conv-${i}` : null,
        matchedConversationTemp: temp,
        firstTouch: {
          campaignId: r.campaignId,
          campaignName: r.campaignName || r.campaignId,
          daysToConversion: 1 + (i % 7),
        },
        lastTouch: {
          campaignId: r.campaignId,
          campaignName: r.campaignName || r.campaignId,
          daysToConversion: 0,
        },
        touches: [
          { campaignId: r.campaignId, campaignName: r.campaignName || r.campaignId, type: 'click', touchDate: new Date(Date.now() - (i + 2) * 86400000).toISOString() },
          { campaignId: r.campaignId, campaignName: r.campaignName || r.campaignId, type: 'impression', touchDate: new Date(Date.now() - i * 86400000).toISOString() },
        ],
        matchedRate: r.matchedRate || 50,
      };
    });
  }, [diseaseRows]);

  // ── Sort key per disease ───────────────────────────────────────────────────
  const sortKey = useMemo(() => {
    const map = {
      'roas-health': 'roasGap',
      'attribution-quality': 'matchedRate',
      'ad-creative': 'ctr',
      'audience-targeting': 'overlapPercent',
      'budget-allocation': 'dailyUtilization',
      'platform-performance': 'fbRoas',
      'lead-order-conversion': 'coldToOrderRate',
      'junk-campaigns': 'junkRate',
    };
    return map[disease.id] || 'matchedRate';
  }, [disease.id]);

  const isWorstFirst = ['roasGap', 'overlapPercent', 'junkRate', 'coldToOrderRate', 'unmatchedCount'].includes(sortKey);

  const sortedRows = useMemo(() => {
    const rows = [...diseaseRows];
    rows.sort((a, b) => {
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;
      return isWorstFirst ? vb - va : va - vb;
    });
    return rows.slice(0, 12);
  }, [diseaseRows, sortKey, isWorstFirst]);

  // ── Color per row ─────────────────────────────────────────────────────────
  function rowColor(r) {
    const level = getAdsKpiAlertLevel(sortKey, r[sortKey] ?? 0);
    if (level === 'red')   return '#dc2626';
    if (level === 'yellow') return '#d97706';
    return '#059669';
  }

  // ── Summary metrics for sub-tab 1 ────────────────────────────────────────
  const topMetrics = summaryMetrics.slice(0, 3);

  const subTabs = [
    { key: 'ads-stats',      label: 'Thống Kê Ads',        icon: '📊' },
    { key: 'orders',         label: 'Đơn Hàng từ Ads',    icon: '📦' },
    { key: 'conversations',  label: 'Chi tiết Tin nhắn',  icon: '💬' },
  ];

  return (
    <div className="space-y-3">
      {/* ── Sub-tab pills ── */}
      <div className="flex items-center gap-1 px-1">
        <div className="flex items-center gap-1 bg-surface-container-low rounded-full p-0.5">
          {subTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              className={cn(
                'px-3 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5',
                subTab === tab.key
                  ? 'bg-surface-container-lowest text-on-surface shadow-[--shadow-sm]'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        {subTab !== 'conversations' && (
          <span className="ml-auto text-label-xs text-on-surface-variant shrink-0">
            {sortedRows.length} Ads
          </span>
        )}
      </div>

      {/* ── Sub-tab 1: Thống Kê Ads ── */}
      {subTab === 'ads-stats' && (
        <div className="space-y-3">
          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            {topMetrics.map(m => {
              const color = getMetricAlertColor(m.key, m.value);
              return (
                <div key={m.key} className="bg-surface-container-low rounded-md p-3">
                  <p className="text-label-xs text-on-surface-variant mb-1">{m.label}</p>
                  <p className="text-headline-sm font-bold" style={{ color }}>
                    {formatMetricValue(m)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Stats table */}
          <div className="rounded-md overflow-hidden"
            style={{ border: '1px solid var(--color-outline-variant)' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-on-surface-variant bg-surface-container-low">
                    <th className="px-3 py-2 font-semibold">Ads ID</th>
                    <th className="px-3 py-2 font-semibold">Chiến dịch</th>
                    {summaryMetrics.slice(0, 2).map(m => (
                      <th key={m.key} className="px-3 py-2 font-semibold text-right">{m.label}</th>
                    ))}
                    <th className="px-3 py-2 font-semibold text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((r, i) => {
                    const color = rowColor(r);
                    const m0 = summaryMetrics[0];
                    const m1 = summaryMetrics[1];
                    return (
                      <tr key={`${r.campaignId}-${i}`}
                        className="border-t border-[var(--color-outline-variant)]/40 hover:bg-surface-container-low transition-colors">
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <span className="text-[11px] font-mono font-semibold text-on-surface">
                              {r.campaignId?.toUpperCase().slice(0, 10) || `ADS-${i}`}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="text-[11px] text-on-surface-variant line-clamp-1">
                            {r.campaignName || r.campaignId}
                          </span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {r.platform === 'zalo' ? (
                              <span className="text-[9px] px-1 py-0.5 rounded font-bold text-[#0078D4]" style={{ background: 'rgba(0,120,220,0.08)' }}>ZA</span>
                            ) : (
                              <span className="text-[9px] px-1 py-0.5 rounded font-bold text-[#1877F2]" style={{ background: 'rgba(24,119,242,0.08)' }}>FB</span>
                            )}
                            <span className="text-[10px] text-on-surface-variant">
                              {r.matchedRate ?? 0}% match
                            </span>
                          </div>
                        </td>
                        {m0 && (
                          <td className="px-3 py-2.5 text-right">
                            <span className="text-[11px] font-semibold" style={{ color }}>
                              {formatMetricValue({ value: r[m0.key] ?? 0, format: m0.format })}
                            </span>
                          </td>
                        )}
                        {m1 && (
                          <td className="px-3 py-2.5 text-right">
                            <span className="text-[11px] font-semibold" style={{ color }}>
                              {formatMetricValue({ value: r[m1.key] ?? 0, format: m1.format })}
                            </span>
                          </td>
                        )}
                        <td className="px-3 py-2.5 text-right">
                          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: `${color}15`, color }}>
                            {((r[sortKey] ?? 0) / 10).toFixed(1)}/10
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-tab 2: Đơn Hàng từ Ads ── */}
      {subTab === 'orders' && (
        <div className="space-y-3">
          {/* Summary chips */}
          <div className="flex flex-wrap gap-2 px-1">
            <span className="text-[11px] text-on-surface-variant">
              <span className="font-semibold text-on-surface">{diseaseRows.length}</span> đơn được gắn
            </span>
            <span className="text-[11px] text-on-surface-variant">·</span>
            <span className="text-[11px] font-semibold" style={{ color: '#dc2626' }}>
              {diseaseRows.filter(r => (r.matchedRate || 0) < 70).length} đơn untracked
            </span>
            <span className="text-[11px] text-on-surface-variant">·</span>
            <span className="text-[11px] font-semibold" style={{ color: '#059669' }}>
              {diseaseRows.filter(r => (r.matchedRate || 0) >= 70).length} đơn matched
            </span>
          </div>

          {diseaseRows.length > 0 ? (
            <AdsOrderTable orders={diseaseRows.map((r, i) => ({
              id: `ord-${r.campaignId}-${i}`,
              orderId: `ORD-2026-${String(1000 + i).padStart(4, '0')}`,
              phone: `09${String(r.campaignId.length * 17 + i * 3 + 1).padStart(8, '0')}`,
              orderValue: Math.round((r.matchedRate || 50) * 12000),
              orderDate: new Date(Date.now() - i * 86400000 * 2).toISOString(),
              campaignId: r.campaignId,
              matchedConversationId: (r.matchedRate || 0) > 60 ? `conv-${i}` : null,
              touches: ['FB-Ads', 'Zalo-OA'],
              firstTouch: { campaignId: r.campaignId, campaignName: r.campaignName || r.campaignId },
              lastTouch: { campaignId: r.campaignId, campaignName: r.campaignName || r.campaignId },
            }))} campaigns={campaigns} />
          ) : (
            <div className="bg-surface-container-low rounded-lg p-8 text-center">
              <p className="text-body-sm text-on-surface-variant">Không có dữ liệu đơn hàng cho nhóm này.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Sub-tab 3: Chi tiết Tin nhắn ── */}
      {subTab === 'conversations' && (
        <div>
          {mockConversations.length > 0 ? (
            <AdsConversationDetailPanel
              conversations={mockConversations}
              attributionData={diseaseRows}
              campaigns={campaigns}
            />
          ) : (
            <div className="bg-surface-container-low rounded-lg p-8 text-center">
              <p className="text-body-sm text-on-surface-variant">Không có hội thoại nào được match cho nhóm này.</p>
              <p className="text-[11px] text-on-surface-variant mt-1">Chỉ hiển thị hội thoại đã match đơn hàng (có SĐT).</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

export function AdsDiseaseCard({
  disease,
  attributionData = [],
  campaigns = [],
  savedActionIds = [],
  onSaveAction,
  onRemoveAction,
  defaultExpanded = false,
}) {
  const { id, code, label, icon, severity, severityColor, score, metrics, delta, exampleCount } = disease;
  const [activeTab, setActiveTab] = useState('overview');
  const [isExpanded, setIsExpanded] = useState(Boolean(defaultExpanded)); // default expanded driven by parent prop on mount only

  // If parent says expanded by default, enforce expanded state
  useEffect(() => {
    if (defaultExpanded) setIsExpanded(true);
  }, [defaultExpanded]);

  const tabs = [
    { key: 'overview',  label: 'Tổng Quan' },
    { key: 'interpret', label: 'Diễn Giải' },
    { key: 'detail',    label: `Chi Tiết${exampleCount > 0 ? ` (${exampleCount})` : ''}` },
  ];

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden transition-all duration-300',
        isExpanded ? 'bg-surface-container-low shadow-[--shadow-md]' : 'bg-surface-container-lowest hover:shadow-[--shadow-sm]',
        severity === 'NẶNG' && !isExpanded ? 'border-l-4' : ''
      )}
      style={severity === 'NẶNG' && !isExpanded ? { borderLeftColor: severityColor } : {}}
    >
      {/* ── Header (always visible) ── */}
      <button
        onClick={() => setIsExpanded(v => !v)}
        className="w-full px-5 py-4 flex items-start gap-4 text-left cursor-pointer"
      >
        {/* Severity icon */}
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center text-xl shrink-0 mt-0.5"
          style={{ backgroundColor: `${severityColor}15` }}
        >
          {icon}
        </div>

        {/* Main info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3 className="text-title-sm text-on-surface font-bold leading-tight">{label}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase"
                  style={{ backgroundColor: `${severityColor}18`, color: severityColor }}
                >
                  {severity}
                </span>
                <span className="text-label-sm text-on-surface-variant">
                  Nhóm: <span className="font-semibold text-on-surface">{code}</span>
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right shrink-0">
              <div className="text-headline-md font-bold" style={{ color: severityColor }}>
                {score}
                <span className="text-body-sm font-normal text-on-surface-variant">/10</span>
              </div>
              {delta && (
                <div className={cn('flex items-center justify-end gap-0.5 mt-0.5',
                  delta.direction === 'up' ? 'text-[#059669]' : 'text-[#dc2626]')}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                    {delta.direction === 'up'
                      ? <path d="M12 4l8 8h-5v8h-6v-8H4z"/>
                      : <path d="M12 20l-8-8h5V4h6v8h5z"/>
                    }
                  </svg>
                  <span className="text-[10px] font-semibold">{delta.value}</span>
                </div>
              )}
            </div>
          </div>

          {/* Metrics row (collapsed only) */}
          {!isExpanded && (
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {metrics.slice(0, 3).map(m => {
                const color = getMetricAlertColor(m.key, m.value);
                return (
                  <div key={m.key} className="flex items-center gap-1.5">
                    <span className="text-body-sm font-semibold" style={{ color }}>
                      {formatMetricValue(m)}
                    </span>
                    <span className="text-body-sm text-on-surface-variant">{m.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Expand icon */}
        <div className={cn('shrink-0 mt-1 text-on-surface-variant transition-transform duration-200',
          isExpanded ? 'rotate-180' : '')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </div>
      </button>

      {/* ── Expanded content ── */}
      {isExpanded && (
        <div className="px-5 pb-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 mb-4 bg-surface-container-low rounded-full p-1 w-fit">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  'px-4 py-1.5 rounded-full text-label-sm font-semibold transition-all cursor-pointer whitespace-nowrap',
                  activeTab === tab.key
                    ? 'bg-surface-container-lowest text-on-surface shadow-[--shadow-sm]'
                    : 'text-on-surface-variant hover:text-on-surface'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === 'overview' && (
            <OverviewTab disease={disease} />
          )}
          {activeTab === 'interpret' && (
            <InterpretationTab disease={disease} />
          )}
          {activeTab === 'detail' && (
            <DetailTab disease={disease} attributionData={attributionData} campaigns={campaigns} />
          )}

          {/* Collapse button */}
          <div className="flex justify-end mt-4 pt-2 border-t border-[var(--color-outline-variant)]/30">
            <button
              onClick={() => setIsExpanded(false)}
              className="text-label-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer flex items-center gap-1"
            >
              Thu gọn
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Collapsed footer ── */}
      {!isExpanded && (
        <div className="px-5 pb-4 flex items-center justify-end">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-label-sm text-tertiary hover:text-on-tertiary transition-colors cursor-pointer ml-auto"
          >
            Xem chi tiết →
          </button>
        </div>
      )}
    </div>
  );
}

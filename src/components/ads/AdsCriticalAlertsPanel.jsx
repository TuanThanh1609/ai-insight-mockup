import { useState } from 'react';
import { cn } from '../../lib/utils';

function getVietnameseMetricLabel(key) {
  const map = {
    roasGap: 'ROAS lệch',
    matchedRate: 'Tỉ lệ match',
    untrackedRevenue: 'Untracked Revenue',
    ctr: 'Click-Through Rate',
    hookRetention: 'Hook Retention',
    scrollStopRate: 'Scroll Stop Rate',
    overlapPercent: 'Audience Overlap',
    ageMatchRate: 'Đúng độ tuổi mục tiêu',
    interestAccuracy: 'Interest Accuracy',
    dailyUtilization: 'Chi ngân sách hàng ngày',
    hourlySpread: 'Phân bổ theo giờ',
    campaignBalance: 'Cân bằng chiến dịch',
    fbRoas: 'Facebook ROAS',
    zaloRoas: 'Zalo ROAS',
    fbRevenueShare: 'Facebook Revenue %',
    hotToOrderRate: 'Nóng → Đơn',
    warmToOrderRate: 'Ấm → Đơn',
    coldToOrderRate: 'Lạnh → Đơn',
    junkRate: 'Junk Rate',
    qualityRate: 'Quality Rate',
    spamRate: 'Spam Rate',
    unmatchedCount: 'Unmatched Orders',
    avgDaysToConversion: 'Avg Days to Conversion',
    roasOriginal: 'ROAS gốc',
    roasActual: 'ROAS thực',
  };
  return map[key] || key;
}

function PlatformIcon({ platform }) {
  if (platform === 'zalo') {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="#0068ff">
        <circle cx="12" cy="12" r="10" />
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Z</text>
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877f2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

function getExampleOrders(attributionData = []) {
  const count = Math.min(attributionData.length, 6);
  const examples = [];
  for (let i = 0; i < count; i++) {
    const row = attributionData[i] || {};
    examples.push({
      id: 'order-' + i,
      campaignName: row.campaignName || 'Chiến dịch ' + (i + 1),
      platform: row.platform || (i % 2 === 0 ? 'facebook' : 'zalo'),
      matched: (row.matchedRate || 0) > 60,
      revenue: row.untrackedRevenue || 0,
      roasOriginal: row.roasOriginal,
      roasActual: row.roasActual,
    });
  }
  return examples;
}

function AlertRow({ alert, attributionData, isExpanded, onToggle }) {
  const metricLabel = getVietnameseMetricLabel(alert.metricKey);
  const examples = isExpanded ? getExampleOrders(attributionData) : [];

  return (
    <div className="flex flex-col">
      <div
        className="flex items-start gap-2.5 px-3 py-2.5 rounded-sm transition-colors hover:bg-surface-container-low cursor-pointer"
        onClick={onToggle}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
          style={{ backgroundColor: alert.bg }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={alert.color} strokeWidth="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-1.5">
            <span className="text-body-sm font-semibold text-on-surface truncate">
              {alert.diseaseLabel}
            </span>
            <span className="text-body-sm font-medium text-on-surface-variant truncate">
              {metricLabel}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <span className="text-title-sm font-bold" style={{ color: alert.color }}>
              {alert.value}{alert.unit}
            </span>
            <button
              className="text-label-xs font-semibold px-2 py-0.5 rounded transition-colors shrink-0"
              style={{ color: alert.color, backgroundColor: alert.bg }}
            >
              {isExpanded ? '▲ Thu gọn' : '▼ Xem chi tiết'}
            </button>
          </div>
        </div>
      </div>
      {isExpanded && examples.length > 0 && (
        <div className="flex flex-col gap-0.5 px-3 pb-2 mt-0.5">
          {examples.map(ex => (
            <div
              key={ex.id}
              className="flex items-center gap-3 px-3 py-1.5 rounded-sm bg-surface-container-lowest border-b border-surface-secondary last:border-0"
            >
              <div className="shrink-0">
                <PlatformIcon platform={ex.platform} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-on-surface leading-tight truncate">
                  {ex.campaignName}
                </p>
                <p className="text-[11px] text-on-surface-variant leading-snug">
                  {ex.matched
                    ? '✓ Matched — ROAS thực ' + (ex.roasActual ? ex.roasActual.toFixed(2) + 'x' : 'N/A')
                    : '✗ Unmatched — ' + (ex.revenue > 0 ? (ex.revenue / 1000000).toFixed(1) + 'M untracked' : 'Không gắn được')
                  }
                </p>
              </div>
              <div className="shrink-0">
                <span className={cn(
                  'text-[10px] font-semibold px-1.5 py-0.5 rounded-full',
                  ex.matched ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                )}>
                  {ex.matched ? 'Matched' : 'Unmatched'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function buildAlertsFromDiseases(diseases, maxAlerts) {
  const alerts = [];
  for (const disease of diseases) {
    const criticalMetrics = (disease.metrics || []).filter(m => {
      if (m.key === 'roasGap' && m.value > 0.8) return true;
      if (m.key === 'matchedRate' && m.value < 75) return true;
      if (m.key === 'ctr' && m.value < 1.5) return true;
      if (m.key === 'junkRate' && m.value > 30) return true;
      if (m.key === 'dailyUtilization' && m.value < 65) return true;
      if (m.key === 'roasActual' && m.value < 2) return true;
      if (m.key === 'hotToOrderRate' && m.value < 20) return true;
      return false;
    });
    for (const metric of criticalMetrics) {
      const level = (metric.value > 40 || (metric.key === 'roasGap' && metric.value > 1.5)) ? 'red' : 'yellow';
      const color = level === 'red' ? '#dc2626' : '#d97706';
      const bg = level === 'red' ? 'rgba(220,38,38,0.08)' : 'rgba(217,119,6,0.08)';
      alerts.push({
        id: disease.id + '-' + metric.key,
        diseaseId: disease.id,
        diseaseLabel: disease.label,
        metricKey: metric.key,
        value: metric.value,
        unit: metric.format === 'roas' ? 'x' : '%',
        color,
        bg,
        level,
      });
    }
  }
  alerts.sort((a, b) => {
    if (a.level === 'red' && b.level !== 'red') return -1;
    if (a.level !== 'red' && b.level === 'red') return 1;
    return 0;
  });
  return alerts.slice(0, maxAlerts);
}

export function AdsCriticalAlertsPanel({ diseases = [], attributionData = [], maxAlerts = 5 }) {
  const [expandedId, setExpandedId] = useState(null);
  const alerts = buildAlertsFromDiseases(diseases, maxAlerts);
  const redAlerts = alerts.filter(a => a.level === 'red');
  const yellowAlerts = alerts.filter(a => a.level === 'yellow');
  const handleToggle = (alertId) => setExpandedId(prev => prev === alertId ? null : alertId);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 mb-1 px-1">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h3 className="text-label-md font-semibold text-on-surface-variant uppercase tracking-wide">
          Cảnh Báo Ads
        </h3>
        {redAlerts.length > 0 && (
          <span className="ml-auto text-label-xs font-bold px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(220,38,38,0.1)', color: '#dc2626' }}>
            {redAlerts.length}
          </span>
        )}
      </div>
      {alerts.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <span className="text-body-sm text-on-surface-variant/60">Không có cảnh báo</span>
        </div>
      ) : (
        <div className="flex flex-col gap-0.5">
          {redAlerts.map(alert => (
            <AlertRow
              key={alert.id}
              alert={alert}
              attributionData={attributionData}
              isExpanded={expandedId === alert.id}
              onToggle={() => handleToggle(alert.id)}
            />
          ))}
          {yellowAlerts.map(alert => (
            <AlertRow
              key={alert.id}
              alert={alert}
              attributionData={attributionData}
              isExpanded={expandedId === alert.id}
              onToggle={() => handleToggle(alert.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

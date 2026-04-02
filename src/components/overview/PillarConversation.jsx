import { MessageCircle } from 'lucide-react';
import { mockCampaigns } from '../../data/mockCampaigns';
import PillarCard from './PillarCard';

/**
 * Pillar A — Chất lượng Hội Thoại
 *
 * Đo lường chấm điểm hội thoại:
 * - Lead Nóng / Ấm / Lạnh funnel
 * - Tỉ lệ thu thập SĐT
 * - Tỉ lệ chuyển đổi
 */

// ─── Thresholds ────────────────────────────────────────────────────────────────

const THRESHOLDS = {
  hotRate: 0.25,   // >25% Nóng = tốt
  phoneRate: 0.40, // >40% SĐT thu thập = tốt
  warnHotRate: 0.12,  // >12% Nóng = cải thiện
  warnPhoneRate: 0.20, // >20% SĐT = cải thiện
};

function computeStatus({ hotRate, phoneRate }) {
  if (hotRate >= THRESHOLDS.hotRate && phoneRate >= THRESHOLDS.phoneRate)
    return { status: 'tot', label: 'Tốt', cls: 'text-[#059669]', dot: 'bg-[#059669]' };
  if (hotRate >= THRESHOLDS.warnHotRate || phoneRate >= THRESHOLDS.warnPhoneRate)
    return { status: 'can-cai-thien', label: 'Cần cải thiện', cls: 'text-[#d97706]', dot: 'bg-[#d97706]' };
  return { status: 'nguy-co', label: 'Nguy cơ', cls: 'text-[#dc2626]', dot: 'bg-[#dc2626]' };
}

// ─── Temperature Bar ─────────────────────────────────────────────────────────

function TempBar({ hot, warm, cold, total }) {
  const hp = total > 0 ? (hot / total) * 100 : 0;
  const wp = total > 0 ? (warm / total) * 100 : 0;
  const cp = total > 0 ? (cold / total) * 100 : 0;

  return (
    <div className="flex flex-col gap-1.5">
      {/* Bar */}
      <div className="flex rounded-full overflow-hidden h-7 gap-px bg-[rgba(26,33,56,0.06)]">
        {hp > 0 && (
          <div
            className="flex items-center justify-center bg-[#059669] text-white text-[10px] font-semibold"
            style={{ width: `${Math.max(hp, 3)}%` }}
          >
            {hp >= 8 ? `${hot}` : ''}
          </div>
        )}
        {wp > 0 && (
          <div
            className="flex items-center justify-center bg-[#d97706] text-white text-[10px] font-semibold"
            style={{ width: `${Math.max(wp, 3)}%` }}
          >
            {wp >= 8 ? `${warm}` : ''}
          </div>
        )}
        {cp > 0 && (
          <div
            className="flex items-center justify-center bg-[#dc2626] text-white text-[10px] font-semibold"
            style={{ width: `${Math.max(cp, 3)}%` }}
          >
            {cp >= 8 ? `${cold}` : ''}
          </div>
        )}
        {total === 0 && <div className="flex-1" />}
      </div>
      {/* Legend */}
      <div className="flex gap-3">
        {[
          { label: 'Nóng', value: hot, pct: hp.toFixed(0), dot: 'bg-[#059669]' },
          { label: 'Ấm', value: warm, pct: wp.toFixed(0), dot: 'bg-[#d97706]' },
          { label: 'Lạnh', value: cold, pct: cp.toFixed(0), dot: 'bg-[#dc2626]' },
        ].map((r) => (
          <div key={r.label} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${r.dot}`} />
            <span className="text-[11px] text-primary opacity-60">{r.label}</span>
            <span className="text-[11px] font-semibold text-primary">{r.value} ({r.pct}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Phone Rate ────────────────────────────────────────────────────────────────

function PhoneRate({ ok, total }) {
  const rate = total > 0 ? (ok / total) * 100 : 0;
  const good = rate >= THRESHOLDS.phoneRate * 100;
  const color = good ? '#059669' : rate >= THRESHOLDS.warnPhoneRate * 100 ? '#d97706' : '#dc2626';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[rgba(26,33,56,0.06)] rounded-full h-2">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.max(rate, 4)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[11px] font-semibold text-primary w-14 text-right shrink-0">
        {ok}/{total}
      </span>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function PillarConversation({ conversations = [] }) {
  const data = conversations;
  const total = data.length;
  // Temperature: field là 'temperature' (not 'lead_temperature')
  // Available in ~1058/6202 rows — use with fallback
  const hasTemp = (c) =>
    c.temperature === 'Nóng' || c.temperature === 'Ấm' || c.temperature === 'Lạnh';
  const hot = data.filter((c) => c.temperature === 'Nóng').length;
  const warm = data.filter((c) => c.temperature === 'Ấm').length;
  const cold = data.filter((c) => c.temperature === 'Lạnh').length;
  const withTempCount = data.filter(hasTemp).length;

  // Phone: 'phone_status' available in ~1002 rows
  const phoneOk = data.filter(
    (c) =>
      c.phone_status === 'Đã thu thập' ||
      c.phone_status === 'Đã thu thập SĐT' ||
      c.phone === true
  ).length;

  // Junk lead: is_junk flag
  const junkLeads = data.filter(
    (c) => c.is_junk === true || c.is_junk === 'true' || c.junk_lead === true
  ).length;
  const junkRate = total > 0 ? junkLeads / total : 0;

  // Conversion: converted_at or converted flag
  const converted = data.filter((c) => c.converted_at || c.converted === true).length;
  const conversionRate = total > 0 ? converted / total : 0;

  // Top Products (fsh-1, mbb-1, spa-1, cos-1... có field 'product' hoặc 'service')
  const productCount = {};
  data.forEach((c) => {
    const p = c.product || c.service || c.data_json?.product || c.data_json?.service;
    if (p) productCount[p] = (productCount[p] || 0) + 1;
  });
  const topProducts = Object.entries(productCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Top Campaigns (từ mockCampaigns)
  const topCampaigns = [...mockCampaigns]
    .sort((a, b) => b.conversations - a.conversations)
    .slice(0, 3);

  // Denominator: use rows WITH temperature data for accuracy
  const hotRate = withTempCount > 0 ? hot / withTempCount : 0;
  const phoneRate = total > 0 ? phoneOk / total : 0;
  const statusInfo = computeStatus({ hotRate, phoneRate });

  return (
    <PillarCard
      icon={MessageCircle}
      title="Chất lượng Hội Thoại"
      iconBg="bg-[#1877F2]/10"
      iconTextColor="text-[#1877F2]"
      chart={
        <div className="flex flex-col gap-3">
          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-primary opacity-50">Tổng hội thoại</span>
            <span className="font-display font-bold text-[15px] text-primary">{total}</span>
          </div>

          {/* Temp funnel */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-primary opacity-50">Phân loại Lead</span>
            </div>
            <TempBar hot={hot} warm={warm} cold={cold} total={withTempCount} />
          </div>

          {/* Phone rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-primary opacity-50">Thu thập SĐT</span>
            </div>
            <PhoneRate ok={phoneOk} total={total} />
          </div>

          {/* Junk Lead */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-primary opacity-50">Khách rác</span>
              <span className={`text-[11px] font-semibold ${junkRate > 0.05 ? 'text-[#dc2626]' : 'text-primary'}`}>
                {junkRate > 0 ? `${junkRate > 0.05 ? '⚠️ ' : ''}${junkLeads} (${(junkRate * 100).toFixed(1)}%)` : '0 (0%)'}
              </span>
            </div>
            <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
              <div
                className="h-full rounded-full bg-[#dc2626]"
                style={{ width: `${Math.min(junkRate * 100 * 5, 100)}%` }}
              />
            </div>
          </div>

          {/* Conversion Rate */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-primary opacity-50">Tỉ lệ chốt đơn</span>
              <span className="text-[11px] font-semibold text-[#059669]">
                {converted}/{total}
              </span>
            </div>
            <div className="bg-[rgba(26,33,56,0.06)] rounded-full h-2">
              <div
                className="h-full rounded-full bg-[#059669]"
                style={{ width: `${Math.min(conversionRate * 100 * 5, 100)}%` }}
              />
            </div>
          </div>

          {/* Top sản phẩm quan tâm */}
          {topProducts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-primary opacity-50">Sản phẩm quan tâm nhiều nhất</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {topProducts.map(([product, count]) => (
                  <span
                    key={product}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-[#0052FF]/10 text-[#0052FF] font-medium"
                  >
                    {product} ({count})
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Top chiến dịch */}
          {topCampaigns.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-primary opacity-50">Chiến dịch nhiều hội thoại nhất</span>
              </div>
              <div className="flex flex-col gap-1">
                {topCampaigns.map((camp) => (
                  <div key={camp.id} className="flex items-center justify-between">
                    <span className="text-[11px] text-primary truncate max-w-[120px]">{camp.name}</span>
                    <span className="text-[11px] font-semibold text-primary">{camp.conversations}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      commentary={
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${statusInfo.dot}`} />
          <span className={`text-[11px] font-semibold ${statusInfo.cls}`}>{statusInfo.label}</span>
          <span className="text-[11px] text-primary opacity-50 truncate">
            · {withTempCount > 0 ? `${(hotRate * 100).toFixed(0)}% Nóng trong ${withTempCount} hội thoại có nhiệt độ` : 'Chưa có dữ liệu nhiệt độ'}
          </span>
        </div>
      }
    />
  );
}
